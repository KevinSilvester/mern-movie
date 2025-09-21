mod cli;
mod middleware;

use std::env;
use std::net::SocketAddr;
use std::time::Duration;

use axum::Router;
use axum::error_handling::HandleErrorLayer;
use axum::http::{Method, StatusCode, Uri};
use axum::middleware::from_fn;
use axum::response::IntoResponse;
use axum_client_ip::ClientIpSource;
use clap::Parser;
use mimalloc::MiMalloc;
use tokio::net::TcpListener;
use tower::ServiceBuilder;
use tower_http::catch_panic::CatchPanicLayer;
use tower_http::compression::CompressionLayer;
use tower_http::cors::CorsLayer;
use tower_http::decompression::DecompressionLayer;
use tower_http::services::ServeDir;
use tracing_subscriber::layer::SubscriberExt;
use tracing_subscriber::util::SubscriberInitExt;
use tracing_subscriber::{EnvFilter, fmt};

#[global_allocator]
static GLOBAL: MiMalloc = MiMalloc;

#[tokio::main]
async fn main() -> anyhow::Result<()> {
    // parse command line arguments
    let args = cli::Args::parse();

    // check if the directory path to the static files exist
    args.check_static_dir()?;

    let log_filter = format!(
        "{}={},REQUEST=info",
        env!("CARGO_CRATE_NAME"),
        args.log_level.to_str(),
    );

    match args.log_format {
        cli::LogFormat::Plain => {
            tracing_subscriber::registry()
                .with(EnvFilter::new(log_filter))
                .with(fmt::layer())
                .init();
        }
        cli::LogFormat::Json => {
            tracing_subscriber::registry()
                .with(EnvFilter::new(log_filter))
                .with(fmt::layer().json())
                .init();
        }
    }

    let app = Router::new()
        .fallback(fallback)
        .fallback_service(ServeDir::new(&args.static_dir))
        .layer(CorsLayer::new().allow_methods([Method::GET, Method::HEAD]))
        .layer(CompressionLayer::new())
        .layer(DecompressionLayer::new())
        .layer(CatchPanicLayer::new())
        .layer(
            ServiceBuilder::new()
                .layer(HandleErrorLayer::new(handle_timeout))
                .timeout(Duration::from_secs(5)),
        )
        .layer(from_fn(middleware::logger))
        .layer(from_fn(middleware::response_headers))
        .layer(ClientIpSource::from(args.ip_source.clone()).into_extension());

    log::info!("Server staring on address: http://{}", args.socket_addr());

    // necessary to capture client ip addresses
    let app = app.into_make_service_with_connect_info::<SocketAddr>();

    let listener = TcpListener::bind(args.socket_addr()).await?;
    axum::serve(listener, app).await?;
    Ok(())
}

async fn fallback(uri: Uri) -> impl IntoResponse {
    let message = format!("URI '{uri}' Not found");
    (StatusCode::NOT_FOUND, message)
}

/// Handle errors that occur from application timeout or uncaught internal server errors
pub async fn handle_timeout(err: Box<dyn std::error::Error + Send + Sync>) -> impl IntoResponse {
    if err.is::<tower::timeout::error::Elapsed>() {
        return (StatusCode::REQUEST_TIMEOUT, "Request took too long");
    }

    log::error!("INTERNAL ERROR - {:?}", err);
    (StatusCode::INTERNAL_SERVER_ERROR, "An error occured")
}
