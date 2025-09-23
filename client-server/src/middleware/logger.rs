use std::time::Instant;

use axum::extract::Request;
use axum::middleware::Next;
use axum::response::Response;
use axum_client_ip::ClientIp;

pub async fn logger(ClientIp(ip): ClientIp, request: Request, next: Next) -> Response {
    // Start timing the request
    let start = Instant::now();

    let path = request.uri().path().to_owned();
    let method = request.method().clone();
    let version = format!("{:?}", request.version());
    let headers = request.headers().clone();
    let user_agent = headers
        .get("user-agent")
        .map(|v| v.to_str().unwrap())
        .unwrap_or("Unknown");

    let response = next.run(request).await;

    let latency = start.elapsed();
    match response.status().as_u16() {
        200..=399 => {
            tracing::event!(
                target:"REQUEST",
                tracing::Level::INFO,
                %ip,
                status = response.status().as_str(),
                %method,
                path,
                version,
                user_agent,
                ?latency,
            );
        }
        400..=499 => {
            tracing::event!(
                target:"REQUEST",
                tracing::Level::WARN,
                %ip,
                status = response.status().as_str(),
                %method,
                path,
                version,
                user_agent,
                ?latency,
            );
        }
        500..=599 => {
            tracing::event!(
                target:"REQUEST",
                tracing::Level::ERROR,
                %ip,
                status = response.status().as_str(),
                %method,
                path,
                version,
                user_agent,
                ?latency,
            );
        }
        _ => unreachable!(),
    };

    response
}
