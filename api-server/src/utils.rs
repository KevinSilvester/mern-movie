use base64::{Engine as _, engine::general_purpose::STANDARD};

use crate::error::ApiError;

pub fn parse_data_url(data_url: &str) -> Result<(Vec<u8>, String), ApiError> {
    let parts: Vec<&str> = data_url.split(',').collect();
    if parts.len() != 2 {
        return Err(ApiError::BadRequest(
            "Invalid image data url! (＃°Д°)".to_string(),
        ));
    }

    let metadata = parts[0]; // e.g. "data:image/jpeg;base64"
    let b64_data = parts[1];

    // Extract mime type
    let mime_type = metadata
        .strip_prefix("data:")
        .and_then(|s| s.split(';').next())
        .ok_or_else(|| ApiError::BadRequest("Invalid mime type! (＃°Д°)".to_string()))?;

    // check if mime_type is supported
    match mime_type {
        "image/png" | "image/jpeg" | "image/pjpeg" | "image/gif" | "image/webp" | "image/jfif" => {}
        _ => {
            return Err(ApiError::BadRequest(
                "Unsupported image type! (＃°Д°)".to_string(),
            ));
        }
    }

    let bytes = STANDARD.decode(b64_data)?;
    Ok((bytes, mime_type.to_string()))
}
