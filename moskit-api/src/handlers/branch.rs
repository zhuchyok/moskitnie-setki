// handlers/branch.rs - Обработчики филиалов

use axum::{Json, extract::{State, Path}};
use crate::handlers::{ok, ApiResult, bad_request};
use crate::AppState;
use serde::{Deserialize, Serialize};
use std::sync::Arc;
use uuid::Uuid;
use moskit_core::entity::DealerBranch;
use moskit_core::repository::{DealerRepository, PostgresDealerRepository};

#[derive(Debug, Deserialize)]
pub struct CreateBranchRequest {
    pub name: String,
    pub domain: Option<String>,
    pub city: Option<String>,
    pub margin_config: Option<serde_json::Value>,
}

pub async fn create_branch(
    State(state): State<Arc<AppState>>,
    Path(dealer_id): Path<String>,
    Json(payload): Json<CreateBranchRequest>
) -> ApiResult<DealerBranch> {
    let d_id = Uuid::parse_str(&dealer_id).map_err(|_| bad_request("Invalid Dealer UUID"))?;
    let repo = PostgresDealerRepository::new(state.pool.clone());

    let branch = DealerBranch {
        id: Uuid::new_v4(),
        dealer_id: d_id,
        name: payload.name,
        domain: payload.domain,
        city: payload.city,
        margin_config: payload.margin_config.unwrap_or_else(|| serde_json::json!({})),
        is_active: true,
        created_at: chrono::Utc::now(),
        updated_at: chrono::Utc::now(),
    };

    let created = repo.create_branch(branch).await.map_err(|e| bad_request(&e.to_string()))?;
    ok(created)
}

pub async fn list_branches(
    State(state): State<Arc<AppState>>,
    Path(dealer_id): Path<String>,
) -> ApiResult<Vec<DealerBranch>> {
    let d_id = Uuid::parse_str(&dealer_id).map_err(|_| bad_request("Invalid Dealer UUID"))?;
    let repo = PostgresDealerRepository::new(state.pool.clone());
    
    let branches = repo.find_branches_by_dealer(d_id).await.map_err(|e| bad_request(&e.to_string()))?;
    ok(branches)
}
