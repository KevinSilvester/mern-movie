use std::sync::LazyLock;
use std::{net::SocketAddr, time::Instant};

use axum::extract::{ConnectInfo, Request};
use axum::http::{HeaderName, HeaderValue, header};
use axum::middleware::Next;
use axum::response::Response;

#[derive(Debug)]
pub struct ResponseHeaders {
    pub access_control_allow_origin: HeaderValue,
    pub access_control_allow_methods: HeaderValue,
    pub content_security_policy: HeaderValue,
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

impl ResponseHeaders {
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
        ("worker-src", "'self' blob:"),
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

impl Default for ResponseHeaders {
    fn default() -> Self {
        Self {
            access_control_allow_origin: HeaderValue::from_static("*"),
            access_control_allow_methods: HeaderValue::from_static("GET, HEAD"),
            content_security_policy: HeaderValue::from_str(&Self::csp()).unwrap(),
            cross_origin_opener_policy: HeaderValue::from_static("same-origin"),
            cross_origin_resource_policy: HeaderValue::from_static("same-origin"),
            origin_agent_cluster: HeaderValue::from_static("?1"),
            referrer_policy: HeaderValue::from_static("no-referrer"),
            strict_transport_security: HeaderValue::from_static(
                "max-age=15552000; includeSubDomains",
            ),
            x_content_type_options: HeaderValue::from_static("nosniff"),
            x_dns_prefetch_control: HeaderValue::from_static("off"),
            x_download_options: HeaderValue::from_static("noopen"),
            x_frame_options: HeaderValue::from_static("SAMEORIGIN"),
            x_permitted_cross_domain_policies: HeaderValue::from_static("none"),
            x_xss_protection: HeaderValue::from_static("0"),
        }
    }
}

static RESPONSE_HEADERS: LazyLock<ResponseHeaders> = LazyLock::new(ResponseHeaders::default);

pub async fn response_headers(request: Request, next: Next) -> Response {
    let mut response = next.run(request).await;
    let headers = response.headers_mut();

    headers.insert(
        header::ACCESS_CONTROL_ALLOW_ORIGIN,
        RESPONSE_HEADERS.access_control_allow_origin.clone(),
    );
    headers.insert(
        header::ACCESS_CONTROL_ALLOW_METHODS,
        RESPONSE_HEADERS.access_control_allow_methods.clone(),
    );
    headers.insert(
        header::CONTENT_SECURITY_POLICY,
        RESPONSE_HEADERS.content_security_policy.clone(),
    );
    headers.insert(
        HeaderName::from_static("cross-origin-opener-policy"),
        RESPONSE_HEADERS.cross_origin_opener_policy.clone(),
    );
    headers.insert(
        HeaderName::from_static("cross-origin-resource-policy"),
        RESPONSE_HEADERS.cross_origin_resource_policy.clone(),
    );
    headers.insert(
        HeaderName::from_static("origin-agent-cluster"),
        RESPONSE_HEADERS.origin_agent_cluster.clone(),
    );
    headers.insert(
        header::REFERRER_POLICY,
        RESPONSE_HEADERS.referrer_policy.clone(),
    );
    headers.insert(
        header::STRICT_TRANSPORT_SECURITY,
        RESPONSE_HEADERS.strict_transport_security.clone(),
    );
    headers.insert(
        header::X_CONTENT_TYPE_OPTIONS,
        RESPONSE_HEADERS.x_content_type_options.clone(),
    );
    headers.insert(
        header::X_DNS_PREFETCH_CONTROL,
        RESPONSE_HEADERS.x_dns_prefetch_control.clone(),
    );
    headers.insert(
        HeaderName::from_static("x-download-options"),
        RESPONSE_HEADERS.x_download_options.clone(),
    );
    headers.insert(
        header::X_FRAME_OPTIONS,
        RESPONSE_HEADERS.x_frame_options.clone(),
    );
    headers.insert(
        HeaderName::from_static("x-permitted-cross-domain-policies"),
        RESPONSE_HEADERS.x_permitted_cross_domain_policies.clone(),
    );
    headers.insert(
        header::X_XSS_PROTECTION,
        RESPONSE_HEADERS.x_xss_protection.clone(),
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
                status = response.status().as_str(),
                %method,
                path,
                version,
                ip = addr.ip().to_string(),
                user_agent,
                ?latency,
            );
        }
        400..=499 => {
            tracing::event!(
                target:"REQUEST",
                tracing::Level::WARN,
                status = response.status().as_str(),
                %method,
                path,
                version,
                ip = addr.ip().to_string(),
                user_agent,
                ?latency,
            );
        }
        500..=599 => {
            tracing::event!(
                target:"REQUEST",
                tracing::Level::ERROR,
                status = response.status().as_str(),
                %method,
                path,
                version,
                ip = addr.ip().to_string(),
                user_agent,
                ?latency,
            );
        }
        _ => unreachable!(),
    };

    response
}
