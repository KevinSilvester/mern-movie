use std::env;
use std::net::SocketAddr;
use std::sync::Arc;
use std::time::Duration;

use moviedb_api_server::cli::{Args, LogFormat};
use moviedb_api_server::middleware;
use moviedb_api_server::state::AppState;
use moviedb_api_server::{error, routes};

use axum::Router;
use axum::error_handling::HandleErrorLayer;
use axum::extract::Json;
use axum::http::{Method, StatusCode, Uri, header};
use axum::middleware::{from_fn, from_fn_with_state};
use axum::response::IntoResponse;
use axum_client_ip::ClientIpSource;
use clap::Parser;
use mimalloc::MiMalloc;
use serde_json::json;
use tokio::net::TcpListener;
use tower::ServiceBuilder;
use tower_http::catch_panic::CatchPanicLayer;
use tower_http::compression::CompressionLayer;
use tower_http::cors::{Any, CorsLayer};
use tower_http::decompression::DecompressionLayer;
use tower_http::limit::RequestBodyLimitLayer;
use tracing_subscriber::layer::SubscriberExt;
use tracing_subscriber::util::SubscriberInitExt;
use tracing_subscriber::{EnvFilter, fmt};

#[global_allocator]
static GLOBAL: MiMalloc = MiMalloc;

#[tokio::main]
async fn main() -> anyhow::Result<()> {
    dotenv::dotenv().ok();

    // parse command line arguments
    let args = Args::parse();

    let log_filter = format!(
        "{}={},REQUEST=info",
        env!("CARGO_CRATE_NAME"),
        args.log_level.to_str(),
    );

    match args.log_format {
        LogFormat::Plain => {
            tracing_subscriber::registry()
                .with(EnvFilter::new(log_filter))
                .with(fmt::layer())
                .init();
        }
        LogFormat::Json => {
            tracing_subscriber::registry()
                .with(EnvFilter::new(log_filter))
                .with(fmt::layer().json())
                .init();
        }
    }

    // initialize the application state
    let state = Arc::new(AppState::new().await?);

    // ping services to ensure connection is established
    state.db.ping().await?;
    state.r2.ping().await?;
    state.tmdb.ping().await?;

    let app = Router::new()
        .fallback(fallback)
        .merge(routes::router())
        .layer(
            CorsLayer::new()
                .allow_origin(Any)
                .allow_methods([
                    Method::GET,
                    Method::PUT,
                    Method::POST,
                    Method::OPTIONS,
                    Method::DELETE,
                ])
                .allow_headers([header::AUTHORIZATION, header::CONTENT_TYPE]),
        )
        .layer(CompressionLayer::new())
        .layer(DecompressionLayer::new())
        .layer(CatchPanicLayer::new())
        .layer(
            ServiceBuilder::new()
                .layer(HandleErrorLayer::new(error::handle_timeout))
                .timeout(Duration::from_secs(60)),
        )
        .layer(RequestBodyLimitLayer::new(6 << 20))
        .layer(from_fn_with_state(state.clone(), middleware::auth))
        .layer(from_fn(middleware::response_headers))
        .layer(from_fn(middleware::logger))
        .layer(ClientIpSource::from(args.ip_source.clone()).into_extension())
        .with_state(state);

    log::info!("Server staring on address: http://{}", args.socket_addr());

    // necessary to capture client ip addresses
    let app = app.into_make_service_with_connect_info::<SocketAddr>();

    let listener = TcpListener::bind(args.socket_addr()).await?;
    axum::serve(listener, app).await?;
    Ok(())
}

async fn fallback(uri: Uri) -> impl IntoResponse {
    let message = format!("URI '{uri}' Not found");
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
}
