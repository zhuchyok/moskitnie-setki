// handlers/content.rs

use axum::{
    extract::{State, Host},
    Json,
};
use std::sync::Arc;
use serde::Serialize;
use crate::AppState;
use crate::handlers::{ApiResult, ok, bad_request};
use moskit_core::repository::{DealerRepository, PostgresDealerRepository};

#[derive(Debug, Serialize)]
pub struct TenantConfig {
    pub dealer_id: String,
    pub dealer_name: String,
    pub city: String,
    pub phone: String,
    pub branding: moskit_core::entity::DealerBranding,
    pub contacts: moskit_core::entity::DealerContacts,
    pub seo: serde_json::Value,
    pub legal: moskit_core::entity::DealerLegalInfo,
}

pub async fn get_tenant_config(
    State(state): State<Arc<AppState>>,
    Host(host): Host,
) -> ApiResult<TenantConfig> {
    let repo = PostgresDealerRepository::new(state.pool.clone());
    
    // Ищем дилера по домену
    let dealer = repo.find_by_domain(&host).await
        .map_err(|e| bad_request(&e.to_string()))?;

    match dealer {
        Some(d) => {
            // SEO логика: заменяем плейсхолдеры в шаблонах
            let title = d.seo_config.title_template.clone()
                .unwrap_or_else(|| "Москитные сетки в {city}".to_string())
                .replace("{city}", &d.city)
                .replace("{dealer_name}", &d.name);

            let description = d.seo_config.description_template.clone()
                .unwrap_or_else(|| "Заказать москитные сетки в городе {city} от компании {dealer_name}".to_string())
                .replace("{city}", &d.city)
                .replace("{dealer_name}", &d.name);

            ok(TenantConfig {
                dealer_id: d.id.to_string(),
                dealer_name: d.name,
                city: d.city,
                phone: d.phone,
                branding: d.branding,
                contacts: d.contacts,
                seo: serde_json::json!({
                    "title": title,
                    "description": description,
                    "keywords": d.seo_config.keywords
                }),
                legal: d.legal_info,
            })
        },
        None => Err(bad_request("Tenant not found for this domain")),
    }
}
