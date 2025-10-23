use std::sync::LazyLock;

use axum::extract::Request;
use axum::http::{HeaderMap, HeaderName, HeaderValue, header};
use axum::middleware::Next;
use axum::response::Response;

const CSP_MAP: &[(&str, &str)] = &[
    ("default-src", "'self'"),
    ("script-src", "'self' 'unsafe-inline'"),
    ("script-src-attr", "'none'"),
    (
        "script-src-elem",
        "'self' https://static.cloudflareinsights.com 'unsafe-inline'",
    ),
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
    CSP_MAP
        .iter()
        .map(|(key, value)| format!("{} {}", key, value))
        .collect::<Vec<_>>()
        .join(";")
}

static HEADER_MAP: LazyLock<HeaderMap> = LazyLock::new(|| {
    let mut headers = HeaderMap::new();
    headers.insert(
        header::ACCESS_CONTROL_ALLOW_METHODS,
        HeaderValue::from_static("GET, HEAD"),
    );
    headers.insert(
        header::ACCESS_CONTROL_ALLOW_ORIGIN,
        HeaderValue::from_static("*"),
    );
    headers.insert(
        header::CONTENT_SECURITY_POLICY,
        HeaderValue::from_str(&csp()).unwrap(),
    );
    headers.insert(
        HeaderName::from_static("cross-origin-opener-policy"),
        HeaderValue::from_static("same-origin"),
    );
    headers.insert(
        HeaderName::from_static("cross-origin-resource-policy"),
        HeaderValue::from_static("cross-origin"),
    );
    headers.insert(
        HeaderName::from_static("origin-agent-cluster"),
        HeaderValue::from_static("?1"),
    );
    headers.insert(
        header::REFERRER_POLICY,
        HeaderValue::from_static("no-referrer"),
    );
    headers.insert(
        header::STRICT_TRANSPORT_SECURITY,
        HeaderValue::from_static("max-age=15552000; includeSubDomains"),
    );
    headers.insert(
        header::X_CONTENT_TYPE_OPTIONS,
        HeaderValue::from_static("nosniff"),
    );
    headers.insert(
        HeaderName::from_static("x-dns-prefetch-control"),
        HeaderValue::from_static("off"),
    );
    headers.insert(
        HeaderName::from_static("x-download-options"),
        HeaderValue::from_static("noopen"),
    );
    headers.insert(
        header::X_FRAME_OPTIONS,
        HeaderValue::from_static("SAMEORIGIN"),
    );
    headers.insert(
        HeaderName::from_static("x-permitted-cross-domain-policies"),
        HeaderValue::from_static("none"),
    );
    headers.insert(header::X_XSS_PROTECTION, HeaderValue::from_static("0"));

    headers
});

pub async fn response_headers(request: Request, next: Next) -> Response {
    let mut response = next.run(request).await;
    let headers = response.headers_mut();
    headers.extend(HEADER_MAP.clone());

    response
}
