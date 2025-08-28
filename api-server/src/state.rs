use std::env;

use chrono::{Datelike, Utc};
use parking_lot::Mutex;

use crate::clients::{mongo::MongoClient, r2::R2Client, tmdb::TMDBClient};

const MAX_DAILY_RESET: u8 = 5;

#[derive(Debug)]
pub struct AppState {
    pub db: MongoClient,
    pub r2: R2Client,
    pub tmdb: TMDBClient,
    pub access_token: String,
    pub reset_quota: Mutex<ResetQuota>,
}

impl AppState {
    pub async fn new() -> anyhow::Result<Self> {
        let db = MongoClient::new().await?;
        let r2 = R2Client::new().await?;
        let tmdb = TMDBClient::new().await?;
        let access_token = Self::get_access_token();
        let reset_quota = Mutex::new(ResetQuota::new());

        Ok(Self {
            db,
            r2,
            tmdb,
            access_token,
            reset_quota,
        })
    }

    fn get_access_token() -> String {
        let token = env::var("MOVIEDB_API_ADMIN_TOKEN").ok();

        if token.is_none() {
            log::error!("MOVIEDB_API_ADMIN_TOKEN is not set in environment variables");
            panic!("MOVIEDB_API_ADMIN_TOKEN is not set in environment variables");
        }

        token.unwrap()
    }
}

#[derive(Debug)]
pub struct ResetQuota {
    count: u8,
    max: u8,
    day_num: u64,
}

impl ResetQuota {
    fn new() -> Self {
        Self {
            count: 0,
            max: MAX_DAILY_RESET,
            day_num: Self::day_num(),
        }
    }

    pub fn try_reset(&mut self) -> Result<(), &'static str> {
        let today = Self::day_num();

        if self.day_num != today {
            self.day_num = today;
            self.count = 0;
        }

        if self.count >= self.max {
            Err("Daily reset quota exceeded")
        } else {
            self.count += 1;
            Ok(())
        }
    }

    pub fn remaining(&self) -> u8 {
        self.max - self.count
    }

    fn day_num() -> u64 {
        Utc::now().num_days_from_ce() as u64
    }
}
