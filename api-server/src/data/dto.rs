use chrono::{DateTime, Datelike, Utc};
use serde::{Deserialize, Serialize};
use validator::{Validate, ValidationError};

use crate::data::{MovieTMDB, MovieTitleTMDB};

#[derive(Debug, Serialize, Deserialize)]
pub struct MovieTitleDTO {
    #[serde(rename = "_id")]
    pub id: String,
    pub title: String,
    pub poster_uploaded: bool,
    pub tmdb: MovieTitleTMDB,
    pub created_at: DateTime<Utc>,
    pub updated_at: DateTime<Utc>,
}

fn validate_year(year: u32) -> Result<(), ValidationError> {
    let current_year = Utc::now().year() as u32 + 2;
    if year < 1888 || year > current_year {
        return Err(ValidationError::new("invalid_year"));
    }
    Ok(())
}

fn validate_year_str(year: &str) -> Result<(), ValidationError> {
    match year.parse::<u32>() {
        Ok(y) => validate_year(y),
        Err(_) => Err(ValidationError::new("invalid_year_format")),
    }
}

fn validate_runtime(runtime: &str) -> Result<(), ValidationError> {
    match runtime.parse::<u32>() {
        Ok(r) => {
            if !(30..=2000).contains(&r) {
                return Err(ValidationError::new("invalid_runtime"));
            }
            Ok(())
        }
        Err(_) => Err(ValidationError::new("invalid_runtime_format")),
    }
}

fn validate_optional_years(years: &&Vec<u32>) -> Result<(), ValidationError> {
    for year in years.iter().copied() {
        validate_year(year)?;
    }
    Ok(())
}

fn validate_sort_by(value: &str) -> Result<(), ValidationError> {
    match value {
        "title" | "year" => Ok(()),
        _ => Err(ValidationError::new("invalid_sork_key")),
    }
}

fn validate_sort_order(value: &str) -> Result<(), ValidationError> {
    match value {
        "asc" | "desc" => Ok(()),
        _ => Err(ValidationError::new("invalid_sort_order")),
    }
}

#[derive(Debug, Serialize, Deserialize, Validate)]
pub struct MovieDTO {
    #[serde(rename = "_id")]
    pub id: Option<String>,

    #[validate(length(min = 1, message = "Title cannot be empty"))]
    pub title: String,

    #[validate(custom(function = "validate_year", message = "Year must be a valid year"))]
    pub year: u32,

    #[validate(length(min = 1, message = "At least one genre is required"))]
    pub genres: Vec<String>,

    #[validate(length(min = 1, message = "At least one actor is required"))]
    pub actors: Vec<String>,

    #[validate(length(min = 1, message = "At least one director is required"))]
    pub directors: Vec<String>,

    #[validate(length(min = 1, message = "Plot cannot be empty"))]
    pub plot: String,

    #[validate(range(min = 30, max = 2000, message = "Runtime must be at least 30 minute"))]
    pub runtime: u32,

    pub tmdb: Option<MovieTMDB>,

    pub poster_uploaded: bool,

    pub poster_string: Option<String>,

    pub created_at: Option<DateTime<Utc>>,

    pub updated_at: Option<DateTime<Utc>>,
}

#[derive(Debug, Deserialize, Validate)]
pub struct MovieResetDTO {
    #[validate(length(min = 1, message = "Title cannot be empty"))]
    pub title: String,

    #[validate(custom(function = "validate_year_str", message = "Year must be a valid year"))]
    pub year: String,

    #[validate(custom(
        function = "validate_runtime",
        message = "Runtime must be at least 30 minutes"
    ))]
    pub runtime: String,

    #[validate(length(min = 1, message = "At least one genre is required"))]
    pub genres: Vec<String>,

    #[validate(length(min = 1, message = "At least one director is required"))]
    pub director: String,

    #[validate(length(min = 1, message = "At least one actor is required"))]
    pub actors: String,

    #[validate(length(min = 1, message = "Plot cannot be empty"))]
    pub plot: String,
}

impl From<MovieResetDTO> for MovieDTO {
    fn from(movie: MovieResetDTO) -> Self {
        let actors: Vec<String> = movie
            .actors
            .split(',')
            .map(|s| s.trim().to_string())
            .filter(|s| !s.is_empty())
            .collect();

        let directors: Vec<String> = movie
            .director
            .split(',')
            .map(|s| s.trim().to_string())
            .filter(|s| !s.is_empty())
            .collect();

        let genres: Vec<String> = movie
            .genres
            .iter()
            .map(|s| s.trim().to_string())
            .filter(|s| !s.is_empty())
            .collect();

        Self {
            id: None,
            title: movie.title.clone(),
            actors,
            directors,
            genres,
            runtime: movie.runtime.parse::<u32>().unwrap_or(0),
            year: movie.year.parse::<u32>().unwrap_or(0),
            plot: movie.plot.clone(),
            tmdb: None,
            poster_uploaded: false,
            poster_string: None,
            created_at: None,
            updated_at: None,
        }
    }
}

#[derive(Debug, Default, Deserialize, Validate)]
pub struct MovieQueryDTO {
    pub title: Option<String>,

    #[validate(custom(
        function = "validate_optional_years",
        message = "Years must be a valid year"
    ))]
    pub years: Option<Vec<u32>>,

    pub genres: Option<Vec<String>>,

    #[validate(custom(
        function = "validate_sort_by",
        message = "Sort by must be 'title' or 'year'"
    ))]
    pub sort_by: Option<String>,

    #[validate(custom(
        function = "validate_sort_order",
        message = "Sort order must be 'asc' or 'desc'"
    ))]
    pub sort_order: Option<String>,
}
