use serde::{Deserialize, Serialize};
use serde_json::json;
use reqwest::Client;
use std::env;
use tracing;

#[derive(Debug, Serialize, Deserialize)]
struct TokenResponse {
    token: String,
}

#[derive(Debug, Serialize, Deserialize)]
struct ProxyHostResponse {
    id: i64,
}

pub struct NpmClient {
    client: Client,
    base_url: String,
    identity: String,
    secret: String,
}

impl NpmClient {
    pub fn new() -> Self {
        let base_url = env::var("NPM_URL").unwrap_or_else(|_| "http://atra-nginx-proxy:81/api".to_string());
        let identity = env::var("NPM_IDENTITY").unwrap_or_else(|_| "zhuchyok@icloud.com".to_string());
        let secret = env::var("NPM_SECRET").unwrap_or_else(|_| "Bik6007OS".to_string());

        Self {
            client: Client::new(),
            base_url,
            identity,
            secret,
        }
    }

    async fn get_token(&self) -> Result<String, String> {
        let url = format!("{}/tokens", self.base_url);
        let resp = self.client.post(&url)
            .json(&json!({
                "identity": self.identity,
                "secret": self.secret
            }))
            .send()
            .await
            .map_err(|e| format!("NPM Auth request failed: {}", e))?;

        let status = resp.status();
        if !status.is_success() {
            let err_text = resp.text().await.unwrap_or_default();
            return Err(format!("NPM Auth failed: {} - {}", status, err_text));
        }

        let data: TokenResponse = resp.json().await
            .map_err(|e| format!("NPM Auth JSON error: {}", e))?;
        
        Ok(data.token)
    }

    pub async fn create_proxy_host(&self, domain: &str) -> Result<i64, String> {
        let token = self.get_token().await?;
        let url = format!("{}/nginx/proxy-hosts", self.base_url);

        // Конфигурация для Сетки 21:
        // Проксируем на контейнер setki21-site (порт 80)
        let payload = json!({
            "domain_names": [domain],
            "forward_scheme": "http",
            "forward_host": "setki21-site",
            "forward_port": 80,
            "access_list_id": 0,
            "certificate_id": "new", // Запрос нового сертификата
            "ssl_forced": true,
            "caching_enabled": false,
            "block_exploits": true,
            "advanced_config": "",
            "meta": {
                "letsencrypt_email": self.identity,
                "letsencrypt_agree": true,
                "dns_challenge": false
            },
            "locations": [
                {
                    "path": "/api",
                    "forward_scheme": "http",
                    "forward_host": "moskit-api",
                    "forward_port": 8080,
                    "advanced_config": ""
                },
                {
                    "path": "/health",
                    "forward_scheme": "http",
                    "forward_host": "moskit-api",
                    "forward_port": 8080,
                    "advanced_config": ""
                }
            ]
        });

        let resp = self.client.post(&url)
            .header("Authorization", format!("Bearer {}", token))
            .json(&payload)
            .send()
            .await
            .map_err(|e| format!("NPM Create Host request failed: {}", e))?;

        let status = resp.status();
        if !status.is_success() {
            let err_text = resp.text().await.unwrap_or_default();
            return Err(format!("NPM Create Host failed: {} - {}", status, err_text));
        }

        let data: ProxyHostResponse = resp.json().await
            .map_err(|e| format!("NPM Create Host JSON error: {}", e))?;

        tracing::info!("Successfully created NPM Proxy Host {} for domain {}", data.id, domain);
        Ok(data.id)
    }
}
