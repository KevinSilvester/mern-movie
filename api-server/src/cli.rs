use std::net::{IpAddr, Ipv4Addr, Ipv6Addr, SocketAddr};

use axum_client_ip::ClientIpSource;
use clap::builder::Styles;
use clap::builder::styling::{AnsiColor, Effects};
use clap::{Parser, ValueEnum};

fn styles() -> Styles {
    Styles::default()
        .header(AnsiColor::Yellow.on_default() | Effects::BOLD)
        .usage(AnsiColor::Yellow.on_default() | Effects::BOLD)
        .literal(AnsiColor::Green.on_default() | Effects::BOLD)
        .valid(AnsiColor::Green.on_default() | Effects::BOLD)
        .placeholder(AnsiColor::Blue.on_default() | Effects::BOLD)
        .error(AnsiColor::Red.on_default() | Effects::BOLD)
}

#[derive(Parser, Clone, Debug, Default, ValueEnum)]
pub enum SupportedClientIpSource {
    #[default]
    ConnectInfo,
    CfConnectingIp,
    XRealIp,
}

impl From<SupportedClientIpSource> for ClientIpSource {
    fn from(source: SupportedClientIpSource) -> Self {
        match source {
            SupportedClientIpSource::ConnectInfo => ClientIpSource::ConnectInfo,
            SupportedClientIpSource::CfConnectingIp => ClientIpSource::CfConnectingIp,
            SupportedClientIpSource::XRealIp => ClientIpSource::XRealIp,
        }
    }
}

#[derive(Parser, Clone, Debug, Default, ValueEnum)]
pub enum HostAddress {
    #[default]
    #[clap(name = "ipv4")]
    IPv4,

    #[clap(name = "ipv6")]
    IPv6,
}

#[derive(Parser, Clone, Debug, Default, ValueEnum)]
pub enum LogFormat {
    #[default]
    Plain,
    Json,
}

#[derive(Parser, Clone, Debug, Default, ValueEnum)]
pub enum LogLevel {
    #[default]
    Trace,
    Debug,
    Info,
    Warn,
    Error,
}

impl HostAddress {
    pub fn to_local_ip(&self) -> IpAddr {
        match self {
            HostAddress::IPv4 => IpAddr::V4(Ipv4Addr::new(0, 0, 0, 0)),
            HostAddress::IPv6 => IpAddr::V6(Ipv6Addr::new(0, 0, 0, 0, 0, 0, 0, 0)),
        }
    }
}

impl LogLevel {
    pub fn to_str(&self) -> &str {
        match self {
            LogLevel::Trace => "trace",
            LogLevel::Debug => "debug",
            LogLevel::Info => "info",
            LogLevel::Warn => "warn",
            LogLevel::Error => "error",
        }
    }
}

#[derive(Parser, Debug)]
#[clap(about, author, styles = styles())]
pub struct Args {
    /// The host address type the sever will listen on.
    ///
    /// IPv4: 0.0.0.0
    /// IPv6: ::0
    #[clap(short, long, default_value_t, value_enum, verbatim_doc_comment)]
    pub address: HostAddress,

    /// The logging format for the server.
    #[clap(alias = "lf", long, default_value_t, value_enum, verbatim_doc_comment)]
    pub log_format: LogFormat,

    /// The logging level for the server.
    #[clap(alias = "ll", long, default_value_t, value_enum, verbatim_doc_comment)]
    pub log_level: LogLevel,

    /// The port the server will listen on.
    #[clap(
        short,
        long,
        default_value_t = 4000,
        env = "PORT",
        verbatim_doc_comment
    )]
    pub port: u16,

    /// The client IP source to log.
    #[clap(long, default_value_t, value_enum, verbatim_doc_comment)]
    pub ip_source: SupportedClientIpSource,
}

impl Args {
    pub fn socket_addr(&self) -> SocketAddr {
        SocketAddr::new(self.address.to_local_ip(), self.port)
    }
}
