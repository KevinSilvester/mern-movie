use std::env;
use std::time::Duration;

#[cfg(feature = "tmdb-cache-file")]
use std::collections::HashMap;
#[cfg(feature = "tmdb-cache-file")]
use std::sync::LazyLock;

use axum::http::HeaderMap;
#[cfg(feature = "tmdb-cache-file")]
use bincode::config;
#[cfg(feature = "tmdb-cache-file")]
use bincode::serde::{decode_from_slice, encode_to_vec};
use chrono::{DateTime, Utc};
use moka::future::Cache;
use reqwest::{Client, Url, header::AUTHORIZATION};
use serde::Deserialize;
#[cfg(feature = "tmdb-cache-file")]
use tokio::sync::Mutex;

use crate::data::MovieTMDB;

const TMDB_API_URL: &str = "https://api.themoviedb.org/3/";
const TMDB_IMG_URL: &str = "https://image.tmdb.org/t/p/";
const TMDB_MOVIE_CACHE_SIZE: u64 = 1000;
const TMDB_SEARCH_CACHE_SIZE: u64 = 2000;
const TMDB_IMG_CACHE_SIZE: u64 = 200;

type TMDBSearchCache = Cache<(String, u32), Option<u32>>;
type TMDBMovieCache = Cache<u32, MovieTMDB>;
type TMDBImageCache = Cache<u32, (Vec<u8>, String)>;

pub enum TMDBImageCacheStatus {
    Hit,
    Miss,
}

#[cfg(feature = "tmdb-cache-file")]
#[derive(Debug, Default)]
struct TMDBFileCache {
    pub movies: HashMap<u32, MovieTMDB>,
    pub searches: HashMap<(String, u32), Option<u32>>,
    pub images: HashMap<u32, (Vec<u8>, String)>,
}

#[cfg(feature = "tmdb-cache-file")]
impl TMDBFileCache {
    pub fn new() -> Self {
        if !std::fs::exists("cache").unwrap() {
            std::fs::create_dir("cache").unwrap();
            return Self::default();
        }

        Self::load_from_file()
    }

    fn load_from_file() -> Self {
        let movies = match std::fs::exists("cache/movies.bin").unwrap() {
            true => {
                let data = std::fs::read("cache/movies.bin").unwrap();
                decode_from_slice(&data, config::standard()).unwrap().0
            }
            false => HashMap::new(),
        };

        let searches = match std::fs::exists("cache/searches.bin").unwrap() {
            true => {
                let data = std::fs::read("cache/searches.bin").unwrap();
                decode_from_slice(&data, config::standard()).unwrap().0
            }
            false => HashMap::new(),
        };

        let images = match std::fs::exists("cache/images.bin").unwrap() {
            true => {
                let data = std::fs::read("cache/images.bin").unwrap();
                decode_from_slice(&data, config::standard()).unwrap().0
            }
            false => HashMap::new(),
        };

        Self {
            movies,
            searches,
            images,
        }
    }

    pub async fn insert_movie(&mut self, key: u32, value: MovieTMDB) {
        self.movies.insert(key, value);
        let data = encode_to_vec(&self.movies, config::standard())
            .expect("failed to serialize movies cache");
        tokio::fs::write("cache/movies.bin", data)
            .await
            .expect("failed to write movies cache");
    }

    pub async fn insert_search(&mut self, key: (String, u32), value: Option<u32>) {
        self.searches.insert(key, value);
        let data = encode_to_vec(&self.searches, config::standard())
            .expect("failed to serialize searches cache");
        tokio::fs::write("cache/searches.bin", data)
            .await
            .expect("failed to write searches cache");
    }

    pub async fn insert_image(&mut self, key: u32, value: (Vec<u8>, String)) {
        self.images.insert(key, value);
        let data = encode_to_vec(&self.images, config::standard())
            .expect("failed to serialize images cache");
        tokio::fs::write("cache/images.bin", data)
            .await
            .expect("failed to write images cache");
    }
}

#[cfg(feature = "tmdb-cache-file")]
static TMDB_FILE_CACHE: LazyLock<Mutex<TMDBFileCache>> =
    LazyLock::new(|| Mutex::new(TMDBFileCache::new()));

#[derive(Debug, Clone)]
pub struct TMDBConfig {
    pub access_token: String,
}

impl TMDBConfig {
    pub fn new() -> anyhow::Result<Self> {
        let access_token = match env::var("TMDB_ACCESS_TOKEN") {
            Ok(token) if token.is_empty() => {
                log::error!("TMDB_ACCESS_TOKEN is empty");
                anyhow::bail!("TMDB_ACCESS_TOKEN is empty");
            }
            Ok(token) => token,
            _ => {
                anyhow::bail!("TMDB_ACCESS_TOKEN environment variable is not set or is empty");
            }
        };

        Ok(Self { access_token })
    }
}

#[allow(clippy::to_string_trait_impl)]
impl ToString for TMDBImageCacheStatus {
    fn to_string(&self) -> String {
        match self {
            TMDBImageCacheStatus::Hit => "HIT".to_string(),
            TMDBImageCacheStatus::Miss => "MISS".to_string(),
        }
    }
}

#[derive(Debug)]
pub struct TMDBClient {
    api_url: Url,
    img_url: Url,
    client: Client,
    movie_cache: TMDBMovieCache,
    search_cache: TMDBSearchCache,
    img_cache: TMDBImageCache,
}

impl TMDBClient {
    pub async fn new() -> anyhow::Result<Self> {
        let config = TMDBConfig::new()?;

        let api_url = Url::parse(TMDB_API_URL)?;
        let img_url = Url::parse(TMDB_IMG_URL)?;

        let mut client_headers = HeaderMap::new();
        client_headers.append(
            AUTHORIZATION,
            format!("Bearer {}", config.access_token).parse().unwrap(),
        );

        let client = Client::builder()
            .user_agent("moviedb-server")
            .default_headers(client_headers)
            .timeout(std::time::Duration::from_secs(10))
            .build()?;

        let (search_cache, img_cache, movie_cache) = Self::cache_intialize().await;
        let tmdb_client = Self {
            client,
            api_url,
            img_url,
            search_cache,
            img_cache,
            movie_cache,
        };

        #[cfg(feature = "tmdb-cache-file")]
        tmdb_client.populate_caches().await;

        Ok(tmdb_client)
    }

    pub async fn ping(&self) -> anyhow::Result<()> {
        let url = self.api_url.join("configuration")?;

        log::trace!("Pinging TMDB client at  {}", url);

        let response = self.client.get(url).send().await?;
        if !response.status().is_success() {
            log::error!("Failed to ping TMDB API: {}", response.status());
            return Err(anyhow::anyhow!(
                "Failed to ping TMDB API: {}",
                response.text().await?
            ));
        }

        log::info!("TMDB client connected successfully");

        Ok(())
    }

    async fn search_movie(&self, title: &str, year: u32) -> anyhow::Result<Option<u32>> {
        if let Some(cached_id) = self.search_cache.get(&(title.to_string(), year)).await {
            log::trace!("TMDB search cache hit for {} ({})", title, year);
            return Ok(cached_id);
        }

        let mut url = self.api_url.join("search/movie")?;
        url.query_pairs_mut()
            .append_pair("language", "en-US")
            .append_pair("include_adult", "false")
            .append_pair("query", title)
            .append_pair("primary_release_year", &year.to_string());

        let response = self.client.get(url).send().await?;

        if !response.status().is_success() {
            log::error!("Failed to fetch TMDB data: {}", response.status());
            return Err(anyhow::anyhow!(
                "Failed to fetch TMDB data: {}",
                response.status()
            ));
        }

        let search_res: TMDBSearch = response.json().await?;

        if search_res.total_results == 0 {
            log::trace!("No TMDB results found for {} ({})", title, year);
        }

        let movie_id = match search_res.total_results == 0 {
            true => None,
            false => Some(search_res.results[0].id),
        };

        self.cache_insert_search((title.to_string(), year), movie_id)
            .await;

        Ok(movie_id)
    }

    async fn find_movie_by_id(&self, movie_id: u32) -> anyhow::Result<MovieTMDB> {
        if let Some(cached) = self.movie_cache.get(&movie_id).await {
            log::trace!("TMDB movie cache hit for {}", movie_id);
            return Ok(cached);
        }

        let mut url = self.api_url.join(&format!("movie/{}", movie_id))?;
        url.query_pairs_mut()
            .append_pair("language", "en-US")
            .append_pair("append_to_response", "videos");

        let response = self.client.get(url).send().await?;

        if !response.status().is_success() {
            log::error!("Failed to fetch TMDB movie details: {}", response.status());
            return Err(anyhow::anyhow!(
                "Failed to fetch TMDB movie details: {}",
                response.status()
            ));
        }

        let movie: TMDBMovie = response.json().await?;

        // Find the most recent official YouTube trailer
        let mut youtube_links = movie.videos.results;
        youtube_links.sort_by(|a, b| b.published_at.cmp(&a.published_at));

        let youtube_link = youtube_links
            .iter()
            .find(|v| v.site == "YouTube" && v.video_type == "Trailer" && v.official)
            .map(|v| format!("https://www.youtube.com/embed/{}", v.key));

        let poster_path = if let Some(p) = &movie.poster_path {
            Some(self.img_url.join(&format!("original{}", p))?.to_string())
        } else {
            None
        };

        let backdrop_path = if let Some(b) = &movie.backdrop_path {
            Some(self.img_url.join(&format!("original{}", b))?.to_string())
        } else {
            None
        };

        let imdb_link = movie
            .imdb_id
            .as_ref()
            .map(|imdb_id| format!("https://www.imdb.com/title/{}", imdb_id));

        let movie_tmdb = MovieTMDB {
            found: true,
            tmdb_id: Some(movie.id),
            imdb_link,
            budget: movie.budget,
            revenue: movie.revenue,
            poster_path,
            backdrop_path,
            youtube_link,
        };

        self.cache_insert_movie(movie_id, movie_tmdb.clone()).await;

        Ok(movie_tmdb)
    }

    pub async fn get_details(&self, title: &str, year: u32) -> anyhow::Result<MovieTMDB> {
        let movie_id = match self.search_movie(title, year).await? {
            Some(id) => id,
            None => return Ok(MovieTMDB::default()),
        };

        let movie = self.find_movie_by_id(movie_id).await?;
        Ok(movie)
    }

    pub async fn get_image(
        &self,
        tmdb_id: u32,
        url: &str,
    ) -> anyhow::Result<Option<(Vec<u8>, String, TMDBImageCacheStatus)>> {
        if let Some(cached) = self.img_cache.get(&tmdb_id).await {
            log::trace!("TMDB image cache hit for {}", tmdb_id);
            return Ok(Some((cached.0, cached.1, TMDBImageCacheStatus::Hit)));
        }

        let response = self.client.get(url).send().await?;
        if !response.status().is_success() {
            log::warn!("Failed to fetch TMDB image: {}", response.status());
            return Ok(None);
        }

        let mime_type = &response
            .headers()
            .get(reqwest::header::CONTENT_TYPE)
            .and_then(|v| v.to_str().ok())
            .unwrap_or("application/octet-stream")
            .to_string();
        let bytes = response.bytes().await?.to_vec();

        self.cache_insert_image(tmdb_id, (bytes.clone(), mime_type.clone()))
            .await;

        Ok(Some((bytes, mime_type.clone(), TMDBImageCacheStatus::Miss)))
    }

    async fn cache_intialize() -> (TMDBSearchCache, TMDBImageCache, TMDBMovieCache) {
        (
            Cache::builder()
                .max_capacity(TMDB_SEARCH_CACHE_SIZE)
                .time_to_live(Duration::from_secs(60 * 60 * 24 * 7)) // 7 days
                .build(),
            Cache::builder()
                .max_capacity(TMDB_IMG_CACHE_SIZE)
                .time_to_live(Duration::from_secs(60 * 60 * 24 * 7)) // 7 days
                .build(),
            Cache::builder()
                .max_capacity(TMDB_MOVIE_CACHE_SIZE)
                .time_to_live(Duration::from_secs(60 * 60 * 24 * 15)) // 30 days
                .build(),
        )
    }

    #[cfg(feature = "tmdb-cache-file")]
    async fn populate_caches(&self) {
        let searches = TMDB_FILE_CACHE.lock().await.searches.clone();
        for (key, value) in searches.into_iter() {
            self.search_cache.insert(key, value).await;
        }
        let images = TMDB_FILE_CACHE.lock().await.images.clone();
        for (key, value) in images.into_iter() {
            self.img_cache.insert(key, value).await;
        }
        let movies = TMDB_FILE_CACHE.lock().await.movies.clone();
        for (key, value) in movies.into_iter() {
            self.movie_cache.insert(key, value).await;
        }
    }

    #[cfg(feature = "tmdb-cache-file")]
    async fn cache_insert_movie(&self, key: u32, value: MovieTMDB) {
        self.movie_cache.insert(key, value.clone()).await;
        TMDB_FILE_CACHE.lock().await.insert_movie(key, value).await;
    }

    #[cfg(feature = "tmdb-cache-file")]
    async fn cache_insert_search(&self, key: (String, u32), value: Option<u32>) {
        self.search_cache.insert(key.clone(), value).await;
        TMDB_FILE_CACHE.lock().await.insert_search(key, value).await;
    }

    #[cfg(feature = "tmdb-cache-file")]
    async fn cache_insert_image(&self, key: u32, value: (Vec<u8>, String)) {
        self.img_cache.insert(key, value.clone()).await;
        TMDB_FILE_CACHE.lock().await.insert_image(key, value).await;
    }

    #[cfg(not(feature = "tmdb-cache-file"))]
    async fn cache_insert_movie(&self, key: u32, value: MovieTMDB) {
        self.movie_cache.insert(key, value).await;
    }

    #[cfg(not(feature = "tmdb-cache-file"))]
    async fn cache_insert_search(&self, key: (String, u32), value: Option<u32>) {
        self.search_cache.insert(key, value).await;
    }

    #[cfg(not(feature = "tmdb-cache-file"))]
    async fn cache_insert_image(&self, key: u32, value: (Vec<u8>, String)) {
        self.img_cache.insert(key, value).await;
    }
}

#[derive(Debug, Deserialize)]
struct TMDBSearch {
    pub results: Vec<TMDBSearchResult>,
    pub total_results: u32,
}

#[derive(Debug, Deserialize)]
struct TMDBSearchResult {
    /// The only field we care about
    pub id: u32,
}

#[derive(Debug, Deserialize)]
struct TMDBMovie {
    pub id: u32,
    pub imdb_id: Option<String>,
    pub backdrop_path: Option<String>,
    pub poster_path: Option<String>,
    pub budget: Option<u64>,
    pub revenue: Option<u64>,
    pub videos: TMDBVideos,
}

#[derive(Debug, Deserialize)]
struct TMDBVideos {
    results: Vec<TMDBVideoResult>,
}

#[derive(Debug, Deserialize)]
struct TMDBVideoResult {
    site: String,
    #[serde(rename = "type")]
    video_type: String,
    official: bool,
    key: String,
    published_at: DateTime<Utc>,
}

#[cfg(test)]
mod tests {
    use super::*;

    #[tokio::test]
    async fn test_tmdb_client() {
        dotenv::dotenv().ok();

        let client = TMDBClient::new().await.unwrap();

        let _ = client.get_details("The Martian", 2015).await.unwrap();
        let _ = client.get_details("Superman", 2025).await.unwrap();
        let movie = client.get_details("Inception", 2010).await.unwrap();

        assert!(movie.found);
        assert_eq!(movie.tmdb_id, Some(27205));
        assert_eq!(
            movie.imdb_link,
            Some("https://www.imdb.com/title/tt1375666".to_string())
        );
        assert_eq!(
            movie.backdrop_path,
            Some("https://image.tmdb.org/t/p/original/gqby0RhyehP3uRrzmdyUZ0CgPPe.jpg".to_string())
        );
        assert_eq!(
            movie.poster_path,
            Some("https://image.tmdb.org/t/p/original/ljsZTbVsrQSqZgWeep2B1QiDKuh.jpg".to_string())
        );
        assert_eq!(
            movie.youtube_link,
            Some("https://www.youtube.com/embed/JE9z-gy4De4".to_string())
        );
        assert_eq!(movie.budget, Some(160000000));
        assert_eq!(movie.revenue, Some(839030630));
    }
}
