use std::sync::Arc;

use axum::http::{Method, header};
use axum::{
    extract::{Request, State},
    middleware::Next,
    response::{IntoResponse, Response},
};

use crate::error::ApiError;
use crate::state::AppState;

pub async fn auth(
    State(state): State<Arc<AppState>>,
    request: Request,
    next: Next,
) -> Result<Response, Response> {
    log::trace!("auth middleware started");

    // return early if the uri path isn't /movie/reset
    if request.uri().path() != "/movie/reset" {
        return Ok(next.run(request).await);
    }

    // return early if the request method isn't POST
    if request.method() != Method::POST {
        return Ok(next.run(request).await);
    }

    // extract the Authorization header from request
    let token = request
        .headers()
        .get(header::AUTHORIZATION)
        .and_then(|header| header.to_str().ok())
        .and_then(|value| value.strip_prefix("Bearer "));

    // if there is a token present in the request authorization header
    // check if it matches the expected admin token
    if let Some(token) = token {
        if token != state.access_token {
            log::trace!("auth middleware finished with unauthorized");
            return Err(ApiError::Unauthorized("Unauthorized (＃°Д°)".to_string()).into_response());
        }
        log::trace!("auth middleware finished with authorized");
        return Ok(next.run(request).await);
    }

    // if there is no token present in the request authorization header
    // assume the request is from a non-admin user and check if the daily reset quota is exceeded
    match state.reset_quota.lock().try_reset() {
        Ok(_) => (),
        Err(_) => {
            log::trace!("auth middleware finished with too many requests");
            return Err(
                ApiError::TooManyRequests("Too many resets today (；′⌒`)".to_string())
                    .into_response(),
            );
        }
    };

    log::trace!("auth middleware finished with authorized");
    Ok(next.run(request).await)
}
