use bson::{DateTime, Uuid};
use serde::{Deserialize, Serialize};

use crate::data::{MovieDTO, MovieTitleDTO};

#[derive(Debug, Default, Clone, Serialize, Deserialize)]
pub struct MovieTMDB {
    pub tmdb_id: Option<u32>,
    pub found: bool,
    pub budget: Option<u64>,
    pub revenue: Option<u64>,
    pub poster_path: Option<String>,
    pub backdrop_path: Option<String>,
    pub imdb_link: Option<String>,
    pub youtube_link: Option<String>,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct MovieModel {
    #[serde(rename = "_id")]
    pub id: Uuid,

    pub title: String,

    pub actors: Vec<String>,

    pub directors: Vec<String>,

    pub genres: Vec<String>,

    pub runtime: u32,

    pub year: u32,

    pub plot: String,

    pub tmdb: MovieTMDB,

    pub poster_uploaded: bool,

    /// Account creation date
    pub created_at: DateTime,

    /// Account last updated date
    pub updated_at: DateTime,
}

impl From<&MovieModel> for MovieDTO {
    fn from(movie: &MovieModel) -> Self {
        Self {
            id: Some(movie.id.to_string()),
            title: movie.title.clone(),
            actors: movie.actors.clone(),
            directors: movie.directors.clone(),
            genres: movie.genres.clone(),
            runtime: movie.runtime,
            year: movie.year,
            plot: movie.plot.clone(),
            tmdb: Some(movie.tmdb.clone()),
            poster_uploaded: movie.poster_uploaded,
            poster_string: None,
            created_at: Some(movie.created_at.into()),
            updated_at: Some(movie.updated_at.into()),
        }
    }
}

impl MovieModel {
    pub fn new(id: Uuid, movie: MovieDTO, tmdb: MovieTMDB, poster_uploaded: bool) -> Self {
        Self {
            id,
            title: movie.title,
            actors: movie.actors,
            directors: movie.directors,
            genres: movie.genres,
            runtime: movie.runtime,
            year: movie.year,
            plot: movie.plot,
            tmdb,
            poster_uploaded,
            created_at: DateTime::now(),
            updated_at: DateTime::now(),
        }
    }

    pub fn update(&mut self, movie: MovieDTO, tmdb: MovieTMDB, poster_uploaded: bool) {
        self.title = movie.title;
        self.actors = movie.actors;
        self.directors = movie.directors;
        self.genres = movie.genres;
        self.runtime = movie.runtime;
        self.year = movie.year;
        self.plot = movie.plot;
        self.tmdb = tmdb;
        self.poster_uploaded = poster_uploaded;
        self.updated_at = DateTime::now();
    }
}

#[derive(Debug, Serialize, Deserialize)]
pub struct MovieTitleModel {
    #[serde(rename = "_id")]
    pub id: Uuid,
    pub title: String,
    pub poster_uploaded: bool,
    pub tmdb: MovieTitleTMDB,
    pub created_at: DateTime,
    pub updated_at: DateTime,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct MovieTitleTMDB {
    pub tmdb_id: Option<u32>,
    pub poster_path: Option<String>,
}

impl From<MovieTitleModel> for MovieTitleDTO {
    fn from(movie: MovieTitleModel) -> Self {
        Self {
            id: movie.id.to_string(),
            title: movie.title.clone(),
            poster_uploaded: movie.poster_uploaded,
            tmdb: movie.tmdb.clone(),
            created_at: movie.created_at.into(),
            updated_at: movie.updated_at.into(),
        }
    }
}
