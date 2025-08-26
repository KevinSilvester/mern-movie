use std::env;

use aws_config::{Region, retry::RetryConfig};
use aws_sdk_s3::Client;
use aws_sdk_s3::config::Credentials;

#[derive(Debug)]
pub struct R2Config {
    account_id: String,
    access_key_id: String,
    secret_access_key: String,
    r2_bucket: String,
}

impl R2Config {
    pub fn from_env() -> anyhow::Result<Self> {
        if let (Ok(account_id), Ok(access_key_id), Ok(secret_access_key), Ok(r2_bucket)) = (
            env::var("CLOUDFLARE_ACCOUNT_ID"),
            env::var("CLOUDFLARE_ACCESS_KEY_ID"),
            env::var("CLOUDFLARE_SECRET_ACCESS_KEY"),
            env::var("CLOUDFLARE_R2_BUCKET"),
        ) {
            let mut err = false;
            if account_id.is_empty() {
                log::error!("CLOUDFLARE_ACCOUNT_ID is empty");
                err = true;
            }
            if access_key_id.is_empty() {
                log::error!("CLOUDFLARE_ACCESS_KEY_ID is empty");
                err = true;
            }
            if secret_access_key.is_empty() {
                log::error!("CLOUDFLARE_SECRET_ACCESS_KEY is empty");
                err = true;
            }
            if r2_bucket.is_empty() {
                log::error!("CLOUDFLARE_R2_BUCKET is empty");
                err = true;
            }
            if err {
                anyhow::bail!(
                    "CLOUDFLARE_ACCESS_KEY_ID, CLOUDFLARE_SECRET_ACCESS_KEY, CLOUDFLARE_R2_BUCKET or CLOUDFLARE_ACCOUNT_ID is empty"
                );
            }

            Ok(Self {
                account_id,
                access_key_id,
                secret_access_key,
                r2_bucket,
            })
        } else {
            anyhow::bail!(
                "CLOUDFLARE_ACCESS_KEY_ID, CLOUDFLARE_SECRET_ACCESS_KEY, CLOUDFLARE_R2_BUCKET or CLOUDFLARE_ACCOUNT_ID is empty"
            );
        }
    }
}

#[derive(Debug)]
pub struct R2Client {
    config: R2Config,
    client: Client,
}

impl R2Client {
    pub async fn new() -> anyhow::Result<Self> {
        let config = R2Config::from_env()?;
        let region = Region::new("auto");
        let retry_config = RetryConfig::standard().with_max_attempts(5);

        let credentials = Credentials::new(
            &config.access_key_id,
            &config.secret_access_key,
            None,
            None,
            "R2",
        );

        let client_config = aws_config::from_env()
            .endpoint_url(format!(
                "https://{}.r2.cloudflarestorage.com",
                &config.account_id
            ))
            .credentials_provider(credentials)
            .region(region)
            .retry_config(retry_config)
            .load()
            .await;

        let client = Client::new(&client_config);

        Ok(Self { config, client })
    }

    pub async fn ping(&self) -> anyhow::Result<()> {
        log::trace!("Pinging R2 client for bucket: {}", self.config.r2_bucket);

        match self
            .client
            .head_bucket()
            .bucket(&self.config.r2_bucket)
            .send()
            .await
        {
            Ok(_) => log::info!("R2 client connected successfully"),
            Err(err) => {
                log::error!("R2 client failed to connect");
                anyhow::bail!(err);
            }
        }
        Ok(())
    }

    pub async fn upload_object(
        &self,
        key: &str,
        data: Vec<u8>,
        content_type: String,
    ) -> anyhow::Result<()> {
        log::trace!("Uploading object to R2 with key: {}", key);

        self.client
            .put_object()
            .bucket(&self.config.r2_bucket)
            .content_type(content_type)
            .key(key)
            .body(data.into())
            .send()
            .await?;

        log::trace!("Uploaded object to R2 with key: {}", key);
        Ok(())
    }

    pub async fn delete_object(&self, key: &str) -> anyhow::Result<()> {
        log::trace!("Deleting object from R2 with key: {}", key);

        self.client
            .delete_object()
            .bucket(&self.config.r2_bucket)
            .key(key)
            .send()
            .await?;

        log::trace!("Deleted object from R2 with key: {}", key);
        Ok(())
    }
}
