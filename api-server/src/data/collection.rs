use bson::{Uuid, doc};
use futures::StreamExt;
use mongodb::Collection;

use crate::data::{MovieDTO, MovieTMDB, MovieTitleDTO, MovieTitleModel};

use super::MovieModel;

#[derive(Debug)]
pub struct MovieCollection {
    pub collection: Collection<MovieModel>,
    pub db_name: String,
    pub search_index: String,
}

#[derive(Debug)]
pub enum MovieSortValue {
    Title,
    Year,
    UpdatedAt,
}

impl From<Option<String>> for MovieSortValue {
    fn from(value: Option<String>) -> Self {
        match value.as_deref() {
            Some("title") => MovieSortValue::Title,
            Some("year") => MovieSortValue::Year,
            _ => MovieSortValue::UpdatedAt,
        }
    }
}

#[derive(Debug)]
pub enum MovieSortOrder {
    Ascending,
    Descending,
}

impl From<Option<String>> for MovieSortOrder {
    fn from(value: Option<String>) -> Self {
        match value.as_deref() {
            Some("asc") => MovieSortOrder::Ascending,
            Some("desc") => MovieSortOrder::Descending,
            _ => MovieSortOrder::Descending,
        }
    }
}

impl MovieCollection {
    pub fn new(collection: Collection<MovieModel>, db_name: String, search_index: String) -> Self {
        Self {
            collection,
            db_name,
            search_index,
        }
    }

    pub async fn reset_collection(&self, movies: &Vec<MovieModel>) -> anyhow::Result<()> {
        log::trace!("Resetting movie collection");
        self.collection.delete_many(doc! {}).await?;
        log::debug!("Movies to insert: {}", movies.len());
        self.collection.insert_many(movies).await?;
        log::trace!("Movie collection reset");
        Ok(())
    }

    pub async fn create_movie(
        &self,
        movie_id: Uuid,
        movie: MovieDTO,
        tmdb: MovieTMDB,
        poster_uploaded: bool,
    ) -> anyhow::Result<()> {
        log::trace!("Creating movie - id: {}", movie_id);
        let user_model = MovieModel::new(movie_id, movie, tmdb, poster_uploaded);
        self.collection.insert_one(user_model).await?;
        Ok(())
    }

    pub async fn get_movie(&self, id: Uuid) -> anyhow::Result<Option<MovieModel>> {
        log::trace!("Getting movie with id {}", id);

        let filter = doc! { "_id": id };

        match self.collection.find_one(filter).await? {
            Some(movie) => {
                log::trace!("Movie found with id {}", id);
                Ok(Some(movie))
            }
            None => {
                log::trace!("Movie not found with id {}", id);
                Ok(None)
            }
        }
    }

    pub async fn list_movies(
        &self,
        title: Option<String>,
        years: Option<Vec<u32>>,
        genres: Option<Vec<String>>,
        sort_value: MovieSortValue,
        sort_order: MovieSortOrder,
    ) -> anyhow::Result<Vec<MovieTitleDTO>> {
        log::trace!("Listing movies with filters");
        let mut pipeline = vec![];

        if let Some(title) = title {
            log::trace!("Filtering movies by title: {}", title);
            pipeline.push(doc! {
                "$search": {
                    "index": &self.search_index,
                    "compound": {
                        "should": [
                            {
                                "autocomplete": {
                                    "query": &title,
                                    "path": "title",
                                    "score": { "boost": { "value": 3 } }
                                }
                            },
                            {
                                "text": {
                                    "query": &title,
                                    "path": ["actors", "director"],
                                    "score": { "boost": { "value": 3 } }
                                }
                            },
                            {
                                "text": {
                                    "query": &title,
                                    "path": "title",
                                    "score": { "constant": { "value": 3 } }
                                }
                            }
                        ]
                    }
                }
            });
        }

        if let Some(years) = years {
            log::trace!("Filtering movies by years: {:?}", years);
            pipeline.push(doc! { "$match": { "year": { "$in": years } } });
        }

        if let Some(genres) = genres {
            log::trace!("Filtering movies by genres: {:?}", genres);
            pipeline.push(doc! { "$match": { "genres": { "$in": genres } } });
        }

        log::trace!("Sorting movies by {:?} in {:?}", sort_value, sort_order);
        let sort_order_value = match sort_order {
            MovieSortOrder::Ascending => 1,
            MovieSortOrder::Descending => -1,
        };
        let sort_field = match sort_value {
            MovieSortValue::Title => "title",
            MovieSortValue::Year => "year",
            MovieSortValue::UpdatedAt => "updated_at",
        };
        pipeline.push(doc! { "$sort": { sort_field: sort_order_value } });

        pipeline.push(doc! {
            "$project": {
                "_id": 1,
                "title": 1,
                "poster_uploaded": 1,
                "tmdb": {
                    "tmdb_id": "$tmdb.tmdb_id",
                    "poster_path": "$tmdb.poster_path"
                },
                "created_at": 1,
                "updated_at": 1
            }
        });

        let mut cursor = self.collection.aggregate(pipeline).await?;
        let mut movies: Vec<MovieTitleDTO> = vec![];

        while let Some(result) = cursor.next().await {
            if result.is_err() {
                log::error!("Error in aggregation cursor: {:?}", result);
                return Err(anyhow::anyhow!("Error in aggregation cursor"));
            }

            let movie = bson::from_document::<MovieTitleModel>(result.unwrap());
            if movie.is_err() {
                log::error!("Error deserializing movie document: {:?}", movie);
                return Err(anyhow::anyhow!("Error deserializing movie document"));
            }

            movies.push(movie.unwrap().into());
        }

        Ok(movies)
    }

    pub async fn get_year_list(&self) -> anyhow::Result<Vec<i32>> {
        log::trace!("Getting list of years from movies");

        let mut years: Vec<i32> = self
            .collection
            .distinct("year", doc! {})
            .await?
            .into_iter()
            .filter_map(|y| match y {
                bson::Bson::Int32(year) => Some(year),
                bson::Bson::Int64(year) => Some(year as i32),
                _ => None,
            })
            .collect();
        years.dedup();

        log::trace!("Years found");
        Ok(years)
    }

    pub async fn update_movie(&self, movie: MovieModel) -> anyhow::Result<()> {
        log::trace!("Updating movie with id {}", movie.id);

        let filter = doc! { "_id": movie.id };

        self.collection.replace_one(filter, &movie).await?;

        log::trace!("Movie with id {} updated", movie.id);
        Ok(())
    }

    pub async fn delete_movie(&self, id: Uuid) -> anyhow::Result<()> {
        log::trace!("Deleting movie with id {}", id);

        let filter = doc! { "_id": id };
        self.collection.delete_one(filter).await?;

        log::trace!("Movie with id {} deleted", id);
        Ok(())
    }
}
