use std::sync::Arc;

use axum::extract::{Json, Path, State};
use axum::http::StatusCode;
use axum::http::header::{self, HeaderName};
use axum::response::{IntoResponse, Response};
use axum::{Router, routing};
use axum_extra::extract::OptionalQuery;
use bson::Uuid;
use serde_json::json;
use validator::Validate;

use crate::data::{MovieDTO, MovieModel, MovieQueryDTO, MovieResetDTO};
use crate::utils;
use crate::{error::ApiError, state::AppState};

pub fn router() -> Router<Arc<AppState>> {
    Router::new()
        .route("/health", routing::get(health_check))
        .route("/movie/reset", routing::post(reset))
        .route("/movie/years", routing::get(get_year_list))
        .route("/movie", routing::post(create_movie))
        .route("/movie", routing::get(list_movies))
        .route("/movie/{id}", routing::put(update_movie))
        .route("/movie/{id}", routing::get(get_movie))
        .route("/movie/{id}", routing::delete(delete_movie))
        .route(
            "/movie/{id}/tmdb-poster",
            routing::get(get_movie_tmdb_poster),
        )
}

async fn health_check() -> Response {
    (
        StatusCode::OK,
        Json(json!({
            "success": true,
            "data": { "message": "Server Working ヾ(≧▽≦*)o" }
        })),
    )
        .into_response()
}

async fn reset(
    State(state): State<Arc<AppState>>,
    Json(payload): Json<Vec<MovieResetDTO>>,
) -> Result<Response, ApiError> {
    log::trace!(">>>===Resetting movies ===<<<");

    payload.validate()?;

    let mut movies = vec![];

    for movie in payload {
        log::debug!("Resetting movie: {} ({})", movie.title, movie.year);
        let movie_tmdb = state
            .tmdb
            .get_details(&movie.title, movie.year.parse::<u32>().unwrap_or(0))
            .await?;
        let movie_model = MovieModel::new(Uuid::new(), movie.into(), movie_tmdb, false);
        movies.push(movie_model);
    }

    std::fs::write("file.json", serde_json::to_string_pretty(&movies).unwrap()).unwrap();

    state.db.movies.reset_collection(&movies).await?;
    state
        .db
        .movies
        .list_movies(None, None, None, None.into(), None.into())
        .await?;

    log::trace!(">>>===Movies reset ===<<<");
    Ok((
        StatusCode::OK,
        Json(json!({
            "success": true,
            "data": { "message": "Database Reset! ( •̀ ω •́ )✧" }
        })),
    )
        .into_response())
}

async fn get_year_list(State(state): State<Arc<AppState>>) -> Result<Response, ApiError> {
    log::trace!(">>>=== Getting year list ===<<<");

    let years = state.db.movies.get_year_list().await?;

    Ok((
        StatusCode::OK,
        Json(json!({
            "success": true,
            "data": {
                "payload": years,
                "message": format!("{} years found! (^◕.◕^)", years.len())
            }
        })),
    )
        .into_response())
}

async fn create_movie(
    State(state): State<Arc<AppState>>,
    Json(payload): Json<MovieDTO>,
) -> Result<Response, ApiError> {
    log::trace!(">>>=== Creating movie ===<<<");

    payload.validate()?;

    let movie_id = Uuid::new();
    let movie_tmdb = state.tmdb.get_details(&payload.title, payload.year).await?;

    let (img_bytes, img_mime_type) = match &payload.poster_string {
        Some(s) if s.starts_with("data:image/") => utils::parse_data_url(s)?,
        Some(_) => {
            return Err(ApiError::BadRequest(
                "Poster image must be a data URL! (＃°Д°)".to_string(),
            ));
        }
        None => {
            return Err(ApiError::BadRequest(
                "Poster image is required! (＃°Д°)".to_string(),
            ));
        }
    };

    state
        .r2
        .upload_object(&movie_id.to_string(), img_bytes, img_mime_type)
        .await?;

    state
        .db
        .movies
        .create_movie(movie_id, payload, movie_tmdb, true)
        .await?;

    log::trace!(">>>=== Movie created ===<<<");
    Ok((
        StatusCode::OK,
        Json(json!({
            "success": true,
            "data": {
                "message": "Movie Created! ( •̀ ω •́ )✧",
                "payload": movie_id
            }
        })),
    )
        .into_response())
}

async fn list_movies(
    State(state): State<Arc<AppState>>,
    OptionalQuery(query): OptionalQuery<MovieQueryDTO>,
) -> Result<Response, ApiError> {
    log::trace!(">>>=== Listing movies ===<<<");

    let payload = query.unwrap_or(MovieQueryDTO::default());
    payload.validate()?;

    let movies = state
        .db
        .movies
        .list_movies(
            payload.title,
            payload.years,
            payload.genres,
            payload.sort_by.into(),
            payload.sort_order.into(),
        )
        .await?;

    log::trace!(">>>=== Movies listed: {} ===<<<", movies.len());
    Ok((
        StatusCode::OK,
        Json(json!({
            "success": true,
            "data": {
                "payload": movies,
                "message": format!("{} movies found! (^◕.◕^)", movies.len())
            }
        })),
    )
        .into_response())
}

async fn update_movie(
    State(state): State<Arc<AppState>>,
    Path(movie_id): Path<Uuid>,
    Json(payload): Json<MovieDTO>,
) -> Result<Response, ApiError> {
    log::trace!(">>>=== Updating movie ===<<<");

    payload.validate()?;

    let mut movie = state
        .db
        .movies
        .get_movie(movie_id)
        .await?
        .ok_or(ApiError::NotFound("Movie not found! (＃°Д°)".to_string()))?;

    let mut poster_uploaded = movie.poster_uploaded;

    let movie_tmdb = state.tmdb.get_details(&payload.title, payload.year).await?;

    match &payload.poster_string {
        Some(s) if (s.starts_with("http") && s.ends_with("/tmdb-poster")) => {}
        Some(s) if s.starts_with("https://mern-movie-posters.kevins.site/") => {}
        Some(s) if s.starts_with("data:image/") => {
            let (img_bytes, img_mime_type) = utils::parse_data_url(s)?;
            state
                .r2
                .upload_object(&movie_id.to_string(), img_bytes, img_mime_type)
                .await?;
            poster_uploaded = true;
        }
        Some(_) => {
            return Err(ApiError::BadRequest(
                "Poster image must be a data or https URL! (＃°Д°)".to_string(),
            ));
        }
        None => {
            return Err(ApiError::BadRequest(
                "Poster image is required! (＃°Д°)".to_string(),
            ));
        }
    };

    movie.update(payload, movie_tmdb, poster_uploaded);

    state.db.movies.update_movie(movie).await?;

    log::trace!(">>>=== Movie updated ===<<<");
    Ok((
        StatusCode::OK,
        Json(json!({
            "success": true,
            "data": {
                "message": "Movie Updated! ( •̀ ω •́ )✧",
                "payload": movie_id.to_string()
            }
        })),
    )
        .into_response())
}

async fn get_movie(
    State(state): State<Arc<AppState>>,
    Path(movie_id): Path<Uuid>,
) -> Result<Response, ApiError> {
    log::trace!(">>>=== Getting movie ===<<<");

    let movie = state
        .db
        .movies
        .get_movie(movie_id)
        .await?
        .ok_or(ApiError::NotFound("Movie not found! (＃°Д°)".to_string()))?;

    log::trace!(">>>=== Movie found ===<<<");
    Ok((
        StatusCode::OK,
        Json(json!({
            "success": true,
            "data": {
                "payload": MovieDTO::from(&movie),
                "message": "Movie found! (^◕.◕^)"
            }
        })),
    )
        .into_response())
}

async fn delete_movie(
    State(state): State<Arc<AppState>>,
    Path(movie_id): Path<Uuid>,
) -> Result<Response, ApiError> {
    log::trace!(">>>=== Deleting movie ===<<<");

    let movie = state
        .db
        .movies
        .get_movie(movie_id)
        .await?
        .ok_or(ApiError::NotFound("Movie not found! (＃°Д°)".to_string()))?;
    state.db.movies.delete_movie(movie.id).await?;

    if movie.poster_uploaded {
        state.r2.delete_object(&movie_id.to_string()).await?;
    }

    log::trace!(">>>=== Movie deleted ===<<<");
    Ok((
        StatusCode::OK,
        Json(json!({
            "success": true,
            "data": { "message": "Movie Deleted! ( •̀ ω •́ )✧" }
        })),
    )
        .into_response())
}

async fn get_movie_tmdb_poster(
    State(state): State<Arc<AppState>>,
    Path(movie_id): Path<Uuid>,
) -> Result<Response, ApiError> {
    log::trace!(">>>=== Getting movie poster ===<<<");

    let movie = state
        .db
        .movies
        .get_movie(movie_id)
        .await?
        .ok_or(ApiError::NotFound("Movie not found! (＃°Д°)".to_string()))?;

    if !movie.tmdb.found {
        return Err(ApiError::BadRequest(
            "Movie not found in TMDB! (＃°Д°)".to_string(),
        ));
    }

    let (tmdb_id, poster_url) = match (movie.tmdb.poster_path, movie.tmdb.tmdb_id) {
        (Some(poster_path), Some(tmdb_id)) => (tmdb_id, poster_path),
        _ => {
            return Err(ApiError::BadRequest(
                "Movie poster not found! (＃°Д°)".to_string(),
            ));
        }
    };

    let (img_bytes, mime_type, cache_hit) = match state.tmdb.get_image(tmdb_id, &poster_url).await?
    {
        Some((bytes, mime_type, cache_hit)) => (bytes, mime_type, cache_hit),
        None => {
            return Err(ApiError::BadRequest(
                "Movie poster not found! (＃°Д°)".to_string(),
            ));
        }
    };

    log::trace!(">>>=== Movie poster found ===<<<");
    Ok((
        StatusCode::OK,
        [
            (header::CONTENT_TYPE, mime_type),
            (
                HeaderName::from_static("x-img-cache"),
                cache_hit.to_string(),
            ),
        ],
        img_bytes,
    )
        .into_response())
}
