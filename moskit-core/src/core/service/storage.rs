// core/service/storage.rs

use async_trait::async_trait;
use crate::core::error::{CoreError, CoreResult};
use std::path::PathBuf;
use tokio::fs;

#[async_trait]
pub trait StorageService: Send + Sync {
    async fn save_file(&self, name: &str, content: &[u8]) -> CoreResult<String>;
    async fn delete_file(&self, path: &str) -> CoreResult<()>;
}

pub struct DiskStorageService {
    base_path: PathBuf,
    base_url: String,
}

impl DiskStorageService {
    pub fn new(base_path: PathBuf, base_url: String) -> Self {
        Self { base_path, base_url }
    }
}

#[async_trait]
impl StorageService for DiskStorageService {
    async fn save_file(&self, name: &str, content: &[u8]) -> CoreResult<String> {
        if !self.base_path.exists() {
            fs::create_dir_all(&self.base_path).await
                .map_err(|e| CoreError::Internal(e.to_string()))?;
        }

        let file_path = self.base_path.join(name);
        fs::write(&file_path, content).await
            .map_err(|e| CoreError::Internal(e.to_string()))?;

        Ok(format!("{}/{}", self.base_url, name))
    }

    async fn delete_file(&self, path: &str) -> CoreResult<()> {
        let name = path.split('/').last().ok_or_else(|| CoreError::Internal("Invalid path".to_string()))?;
        let file_path = self.base_path.join(name);
        if file_path.exists() {
            fs::remove_file(file_path).await
                .map_err(|e| CoreError::Internal(e.to_string()))?;
        }
        Ok(())
    }
}
