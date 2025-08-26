use std::sync::LazyLock;

use axum::extract::Request;
use axum::http::{HeaderName, HeaderValue, header};
use axum::middleware::Next;
use axum::response::Response;

#[derive(Debug)]
pub struct ResponseHeaders {
    pub access_control_allow_headers: HeaderValue,
    pub access_control_allow_methods: HeaderValue,
    pub access_control_allow_origin: HeaderValue,
    pub access_control_expose_headers: HeaderValue,
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
        ("script-src", "'self'"),
        ("script-src-attr", "'none'"),
        ("style-src", "'self'"),
        ("img-src", "'self' data: blob: *"),
        ("object-src", "'self'"),
        ("media-src", "'self'"),
        ("frame-src", "'self'"),
        ("frame-ancestors", "'self'"),
        ("base-uri", "'self'"),
        ("block-all-mixed-content", ""),
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
            access_control_allow_headers: HeaderValue::from_static("Content-Type, Authorization"),
            access_control_allow_methods: HeaderValue::from_static(
                "GET, POST, PUT, DELETE, OPTIONS",
            ),
            access_control_allow_origin: HeaderValue::from_static("*"),
            access_control_expose_headers: HeaderValue::from_static("*"),
            content_security_policy: HeaderValue::from_str(&Self::csp()).unwrap(),
            cross_origin_opener_policy: HeaderValue::from_static("same-origin"),
            cross_origin_resource_policy: HeaderValue::from_static("cross-origin"),
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
        header::ACCESS_CONTROL_ALLOW_HEADERS,
        RESPONSE_HEADERS.access_control_allow_headers.clone(),
    );
    headers.insert(
        header::ACCESS_CONTROL_ALLOW_METHODS,
        RESPONSE_HEADERS.access_control_allow_methods.clone(),
    );
    headers.insert(
        header::ACCESS_CONTROL_ALLOW_ORIGIN,
        RESPONSE_HEADERS.access_control_allow_origin.clone(),
    );
    headers.insert(
        header::ACCESS_CONTROL_EXPOSE_HEADERS,
        RESPONSE_HEADERS.access_control_expose_headers.clone(),
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
        header::HeaderName::from_static("x-permitted-cross-domain-policies"),
        RESPONSE_HEADERS.x_permitted_cross_domain_policies.clone(),
    );
    headers.insert(
        header::X_XSS_PROTECTION,
        RESPONSE_HEADERS.x_xss_protection.clone(),
    );
    response
}
