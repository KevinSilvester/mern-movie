use crate::clients::{mongo::MongoClient, r2::R2Client, tmdb::TMDBClient};

#[derive(Debug)]
pub struct AppState {
    pub db: MongoClient,
    pub r2: R2Client,
    pub tmdb: TMDBClient,
}

impl AppState {
    pub async fn new() -> anyhow::Result<Self> {
        let db = MongoClient::new().await?;
        let r2 = R2Client::new().await?;
        let tmdb = TMDBClient::new().await?;

        Ok(Self { db, r2, tmdb })
    }
}
