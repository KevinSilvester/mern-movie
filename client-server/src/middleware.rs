use std::sync::LazyLock;
use std::{net::SocketAddr, time::Instant};

use axum::extract::{ConnectInfo, Request};
use axum::http::{HeaderName, HeaderValue};
use axum::middleware::Next;
use axum::response::Response;

#[derive(Debug)]
pub struct SecurityHeaders {
    pub content_security_policy: HeaderValue,
    pub clear_site_data: HeaderValue,
    pub cross_origin_opener_policy: HeaderValue,
    pub cross_origin_resource_policy: HeaderValue,
    pub origin_agent_cluster: HeaderValue,
    pub referrer_policy: HeaderValue,
    pub strict_transport_security: HeaderValue,
    pub x_content_type_options: HeaderValue,
    pub x_dns_prefetch_control: HeaderValue,
    pub x_download_options: HeaderValue,
    pub x_frame_options: HeaderValue,
    pub x_permitted_cross_domain_policies: HeaderValue,
    pub x_xss_protection: HeaderValue,
}

impl SecurityHeaders {
    const CSP_MAP: &'static [(&'static str, &'static str)] = &[
        ("default-src", "'self'"),
        ("script-src", "'self' 'unsafe-inline'"),
        ("script-src-attr", "'none'"),
        (
            "style-src",
            "'self' https://fonts.googleapis.com 'unsafe-inline'",
        ),
        ("img-src", "'self' data: blob: *"),
        ("connect-src", "'self' * data:"),
        ("object-src", "'self'"),
        ("media-src", "'self'"),
        ("frame-src", "'self' https://www.youtube.com"),
        ("frame-ancestors", "'self'"),
        ("base-uri", "'self'"),
        ("block-all-mixed-content", ""),
        ("font-src", "'self' https://fonts.gstatic.com"),
        ("form-action", "'self'"),
        ("upgrade-insecure-requests", ""),
    ];

    fn csp() -> String {
        Self::CSP_MAP
            .iter()
            .map(|(key, value)| format!("{} {}", key, value))
            .collect::<Vec<_>>()
            .join(";")
    }
}

impl Default for SecurityHeaders {
    fn default() -> Self {
        Self {
            content_security_policy: Self::csp().parse().unwrap(),
            clear_site_data: "\"\"".parse().unwrap(),
            cross_origin_opener_policy: "same-origin".parse().unwrap(),
            cross_origin_resource_policy: "same-origin".parse().unwrap(),
            origin_agent_cluster: "?1".parse().unwrap(),
            referrer_policy: "no-referrer".parse().unwrap(),
            strict_transport_security: "max-age=15552000; includeSubDomains".parse().unwrap(),
            x_content_type_options: "nosniff".parse().unwrap(),
            x_dns_prefetch_control: "off".parse().unwrap(),
            x_download_options: "noopen".parse().unwrap(),
            x_frame_options: "SAMEORIGIN".parse().unwrap(),
            x_permitted_cross_domain_policies: "none".parse().unwrap(),
            x_xss_protection: "0".parse().unwrap(),
        }
    }
}

static SECURITY_HEADERS: LazyLock<SecurityHeaders> = LazyLock::new(SecurityHeaders::default);

pub async fn security_headers(request: Request, next: Next) -> Response {
    let mut response = next.run(request).await;
    let headers = response.headers_mut();

    headers.insert(
        HeaderName::from_static("content-security-policy"),
        SECURITY_HEADERS.content_security_policy.clone(),
    );
    headers.insert(
        HeaderName::from_static("clear-site-data"),
        SECURITY_HEADERS.clear_site_data.clone(),
    );
    headers.insert(
        HeaderName::from_static("cross-origin-opener-policy"),
        SECURITY_HEADERS.cross_origin_opener_policy.clone(),
    );
    headers.insert(
        HeaderName::from_static("cross-origin-resource-policy"),
        SECURITY_HEADERS.cross_origin_resource_policy.clone(),
    );
    headers.insert(
        HeaderName::from_static("origin-agent-cluster"),
        SECURITY_HEADERS.origin_agent_cluster.clone(),
    );
    headers.insert(
        HeaderName::from_static("referrer-policy"),
        SECURITY_HEADERS.referrer_policy.clone(),
    );
    headers.insert(
        HeaderName::from_static("strict-transport-security"),
        SECURITY_HEADERS.strict_transport_security.clone(),
    );
    headers.insert(
        HeaderName::from_static("x-content-type-options"),
        SECURITY_HEADERS.x_content_type_options.clone(),
    );
    headers.insert(
        HeaderName::from_static("x-dns-prefetch-control"),
        SECURITY_HEADERS.x_dns_prefetch_control.clone(),
    );
    headers.insert(
        HeaderName::from_static("x-download-options"),
        SECURITY_HEADERS.x_download_options.clone(),
    );
    headers.insert(
        HeaderName::from_static("x-frame-options"),
        SECURITY_HEADERS.x_frame_options.clone(),
    );
    headers.insert(
        HeaderName::from_static("x-permitted-cross-domain-policies"),
        SECURITY_HEADERS.x_permitted_cross_domain_policies.clone(),
    );
    headers.insert(
        HeaderName::from_static("x-xss-protection"),
        SECURITY_HEADERS.x_xss_protection.clone(),
    );
    response
}

pub async fn logger(
    ConnectInfo(addr): ConnectInfo<SocketAddr>,
    request: Request,
    next: Next,
) -> Response {
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
                %method,
                path,
                version,
                status = response.status().as_str(),
                ip = addr.ip().to_string(),
                user_agent,
                ?latency,
            );
        }
        400..=499 => {
            tracing::event!(
                target:"REQUEST",
                tracing::Level::WARN,
                %method,
                path,
                version,
                status = response.status().as_str(),
                ip = addr.ip().to_string(),
                user_agent,
                ?latency,
            );
        }
        500..=599 => {
            tracing::event!(
                target:"REQUEST",
                tracing::Level::ERROR,
                %method,
                path,
                version,
                status = response.status().as_str(),
                ip = addr.ip().to_string(),
                user_agent,
                ?latency,
            );
        }
        _ => unreachable!(),
    };

    response
}
