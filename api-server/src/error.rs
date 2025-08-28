use std::collections::HashMap;

use axum::extract::Json;
use axum::http::StatusCode;
use axum::response::{IntoResponse, Response};
use serde_json::json;
use thiserror::Error;

#[derive(Debug, Error)]
pub enum ApiError {
    #[error("Internal server error: {0}")]
    InternalServerError(String),

    #[error("Bad request: {0}")]
    BadRequest(String),

    #[error("{0}")]
    NotFound(String),

    #[error("Validation error: {0}")]
    ValidationError(validator::ValidationErrors),

    #[error("Invalid credentials: {0}")]
    Unauthorized(String),

    #[error("Too many requests: {0}")]
    TooManyRequests(String),
}

impl From<anyhow::Error> for ApiError {
    fn from(error: anyhow::Error) -> Self {
        Self::InternalServerError(error.to_string())
    }
}

impl From<reqwest::Error> for ApiError {
    fn from(error: reqwest::Error) -> Self {
        Self::InternalServerError(error.to_string())
    }
}

impl From<url::ParseError> for ApiError {
    fn from(error: url::ParseError) -> Self {
        Self::InternalServerError(error.to_string())
    }
}

impl From<validator::ValidationErrors> for ApiError {
    fn from(error: validator::ValidationErrors) -> Self {
        Self::ValidationError(error)
    }
}

impl From<base64::DecodeError> for ApiError {
    fn from(error: base64::DecodeError) -> Self {
        Self::BadRequest(format!("Base64 decode error: {}", error))
    }
}

impl IntoResponse for ApiError {
    fn into_response(self) -> Response {
        match self {
            Self::BadRequest(err) => Self::bad_request(err),
            Self::NotFound(err) => Self::not_found(err),
            Self::InternalServerError(err) => Self::internal_server_error(err),
            Self::ValidationError(err) => Self::validation_error(err),
            Self::Unauthorized(err) => Self::unauthorized(err),
            Self::TooManyRequests(err) => Self::too_many_requests(err),
        }
    }
}

impl ApiError {
    fn bad_request(message: String) -> Response {
        (
            StatusCode::BAD_REQUEST,
            Json(json!({
                "status": "error",
                "error": {
                    "type": "BAD_REQUEST",
                    "message": message
                }
            })),
        )
            .into_response()
    }

    fn not_found(message: String) -> Response {
        (
            StatusCode::NOT_FOUND,
            Json(json!({
                "status": "error",
                "error": {
                    "type": "NOT_FOUND",
                    "message": message
                }
            })),
        )
            .into_response()
    }

    fn validation_error(errors: validator::ValidationErrors) -> Response {
        let mut error_details: HashMap<String, Vec<String>> = HashMap::new();
        for (error_key, error_value) in errors.0.iter() {
            let field_name = error_key.to_string();

            match error_value {
                validator::ValidationErrorsKind::Field(errors) => {
                    error_details.insert(
                        field_name,
                        errors
                            .iter()
                            .map(|e| e.to_string())
                            .collect::<Vec<String>>(),
                    );
                }
                validator::ValidationErrorsKind::Struct(error) => {
                    error_details.insert(field_name, vec![error.to_string()]);
                }
                validator::ValidationErrorsKind::List(errors) => {
                    error_details.insert(
                        field_name,
                        errors
                            .iter()
                            .map(|e| e.1.to_string())
                            .collect::<Vec<String>>(),
                    );
                }
            }
        }
        (
            StatusCode::UNPROCESSABLE_ENTITY,
            Json(json!({
                "status": "error",
                "error": {
                    "type": "VALIDATION_ERROR",
                    "message": error_details
                }
            })),
        )
            .into_response()
    }

    fn internal_server_error(err: String) -> Response {
        log::error!("INTERNAL_SERVER_ERROR: {err}");
        (
            StatusCode::INTERNAL_SERVER_ERROR,
            Json(json!({
                "status": "error",
                "error": {
                    "type": "INTERNAL_SERVER_ERROR",
                    "message": "An error occured"
                }
            })),
        )
            .into_response()
    }

    fn unauthorized(message: String) -> Response {
        (
            StatusCode::UNAUTHORIZED,
            Json(json!({
                "status": "error",
                "error": {
                    "type": "UNAUTHORIZED",
                    "message": message
                }
            })),
        )
            .into_response()
    }

    fn too_many_requests(message: String) -> Response {
        (
            StatusCode::TOO_MANY_REQUESTS,
            Json(json!({
                "status": "error",
                "error": {
                    "type": "TOO_MANY_REQUESTS",
                    "message": message
                }
            })),
        )
            .into_response()
    }
}

/// Handle errors that occur from application timeout or uncaught internal server errors
pub async fn handle_timeout(err: Box<dyn std::error::Error + Send + Sync>) -> impl IntoResponse {
    if err.is::<tower::timeout::error::Elapsed>() {
        return (
            StatusCode::REQUEST_TIMEOUT,
            Json(json!({
                "status": "error",
                "error": {
                    "type": "REQUEST_TIMEOUT",
                    "message": "Request took too long"
                }
            })),
        );
    }

    log::error!("INTERNAL ERROR - {:?}", err);
    (
        StatusCode::INTERNAL_SERVER_ERROR,
        Json(json!({
            "status": "error",
            "error": {
                "type": "INTERNAL_SERVER_ERROR",
                "message": "An error occured"
            }
        })),
    )
}
