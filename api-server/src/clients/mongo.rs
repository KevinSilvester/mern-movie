use std::env;

use mongodb::{Client, Database, bson::doc, options::ClientOptions};

use crate::data::MovieCollection;

#[derive(Debug)]
struct MongoConfig {
    connection_uri: String,
    db_name: String,
    search_index: String,
}

impl MongoConfig {
    pub fn from_env() -> anyhow::Result<Self> {
        if let (Ok(connection_uri), Ok(db_name), Ok(search_index)) = (
            env::var("MONGO_CONNECTION_URI"),
            env::var("MONGO_DB_NAME"),
            env::var("MONGO_SEARCH_INDEX"),
        ) {
            let mut err = false;
            if connection_uri.is_empty() {
                log::warn!("MONGO_CONNECTION_URI is empty");
                err = true;
            }
            if db_name.is_empty() {
                log::warn!("MONGO_DB_NAME is empty");
                err = true;
            }
            if search_index.is_empty() {
                log::warn!("MONGO_SEARCH_INDEX is empty");
                err = true;
            }

            if err {
                anyhow::bail!("MONGO_CONNECTION_URI, MONGO_SEARCH_INDEX or MONGO_DB_NAME is empty");
            }

            Ok(Self {
                connection_uri,
                db_name,
                search_index,
            })
        } else {
            anyhow::bail!("MONGO_CONNECTION_URI, MONGO_SEARCH_INDEX or MONGO_DB_NAME not set");
        }
    }
}

#[derive(Debug)]
pub struct MongoClient {
    database: Database,
    pub movies: MovieCollection,
}

impl MongoClient {
    pub async fn new() -> anyhow::Result<Self> {
        let config = MongoConfig::from_env()?;

        let mut options = ClientOptions::parse(config.connection_uri.clone()).await?;
        options.app_name = Some(env!("CARGO_CRATE_NAME").into());
        options.min_pool_size = Some(5);

        let client = Client::with_options(options)?;
        let database = client.database(&config.db_name);

        let movies = MovieCollection::new(
            database.collection("movies"),
            config.db_name,
            config.search_index,
        );

        Ok(Self { database, movies })
    }

    pub async fn ping(&self) -> anyhow::Result<()> {
        log::trace!("Pinging MongoDB client at {}", self.database.name());

        match self.database.run_command(doc! { "ping": 1}).await {
            Ok(_) => {
                log::info!("Mongodb client connected successfully");
            }
            Err(err) => {
                log::error!("Mongodb client failed to connect");
                anyhow::bail!(err);
            }
        }
        Ok(())
    }
}
