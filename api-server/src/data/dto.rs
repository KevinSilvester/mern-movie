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
