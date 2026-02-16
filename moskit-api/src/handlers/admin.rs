use axum::{
    extract::{State, Path, Query, Multipart},
    Json,
};
use crate::handlers::{ok, ApiResult, bad_request};
use crate::AppState;
use serde::{Deserialize, Serialize};
use std::sync::Arc;
use uuid::Uuid;
use chrono::{DateTime, Utc};

// --- Обработчики файлов ---

pub async fn upload_file(
    State(state): State<Arc<AppState>>,
    mut multipart: Multipart,
) -> ApiResult<serde_json::Value> {
    use moskit_core::service::{StorageService, DiskStorageService};
    use std::path::PathBuf;

    let storage = DiskStorageService::new(
        PathBuf::from("./uploads"),
        "/uploads".to_string()
    );

    while let Some(field) = multipart.next_field().await.map_err(|e| bad_request(&e.to_string()))? {
        let name = field.name().unwrap_or("file").to_string();
        let file_name = field.file_name().unwrap_or("upload.bin").to_string();
        let data = field.bytes().await.map_err(|e| bad_request(&e.to_string()))?;

        // Генерируем уникальное имя
        let ext = file_name.split('.').last().unwrap_or("bin");
        let unique_name = format!("{}.{}", Uuid::new_v4(), ext);

        let url = storage.save_file(&unique_name, &data).await
            .map_err(|e| bad_request(&e.to_string()))?;

        return ok(serde_json::json!({ "url": url }));
    }

    Err(bad_request("No file uploaded"))
}

#[derive(Debug, Deserialize)]
pub struct CreateDealerRequest {
    pub name: String,
    pub city: String,
    pub phone: String,
    pub email: Option<String>,
    pub domain: Option<String>,
    pub margin_percent: Option<f64>,
}

#[derive(Debug, Serialize)]
pub struct DealerResponse {
    pub id: String,
    pub name: String,
    pub city: String,
    pub phone: String,
    pub domain: Option<String>,
    pub is_active: bool,
    pub margin_percent: f64,
    pub delivery_mode: String,
    pub payment_type: String,
    pub balance: f64,
    pub branding: moskit_core::entity::DealerBranding,
    pub contacts: moskit_core::entity::DealerContacts,
    pub legal_info: moskit_core::entity::DealerLegalInfo,
    pub seo_config: moskit_core::entity::DealerSeoConfig,
}

pub async fn create_dealer(
    State(state): State<Arc<AppState>>,
    Json(payload): Json<CreateDealerRequest>
) -> ApiResult<DealerResponse> {
    use moskit_core::entity::{Dealer, MarginConfig, DeliveryMode, PaymentType};
    use moskit_core::repository::{DealerRepository, PostgresDealerRepository};

    let dealer = Dealer {
        id: Uuid::new_v4(),
        name: payload.name,
        city: payload.city,
        phone: payload.phone,
        email: payload.email,
        address: None,
        domain: payload.domain,
        margin_config: MarginConfig {
            base_margin_percent: payload.margin_percent.unwrap_or(1.30),
            city_multiplier: 1.0,
            volume_discounts: vec![],
            category_margins: std::collections::HashMap::new(),
        },
        delivery_mode: DeliveryMode::SelfPickup,
        payment_type: PaymentType::Postpaid,
        balance: 0.0,
        branding: Default::default(),
        contacts: Default::default(),
        legal_info: Default::default(),
        seo_config: Default::default(),
        is_active: true,
        created_at: chrono::Utc::now(),
        updated_at: chrono::Utc::now(),
    };

    let repo = PostgresDealerRepository::new(state.pool.clone());
    let created = repo.create(dealer).await.map_err(|e| bad_request(&e.to_string()))?;

    ok(DealerResponse {
        id: created.id.to_string(),
        name: created.name,
        city: created.city,
        phone: created.phone,
        domain: created.domain,
        is_active: created.is_active,
        margin_percent: created.margin_config.base_margin_percent,
        delivery_mode: format!("{:?}", created.delivery_mode),
        payment_type: format!("{:?}", created.payment_type),
        balance: created.balance,
        branding: created.branding,
        contacts: created.contacts,
        legal_info: created.legal_info,
        seo_config: created.seo_config,
    })
}

pub async fn list_dealers(
    State(state): State<Arc<AppState>>
) -> ApiResult<Vec<DealerResponse>> {
    use moskit_core::repository::{DealerRepository, PostgresDealerRepository};
    
    let repo = PostgresDealerRepository::new(state.pool.clone());
    let dealers = repo.list(100, 0).await.map_err(|e| bad_request(&e.to_string()))?;

    let response = dealers.into_iter().map(|d| DealerResponse {
        id: d.id.to_string(),
        name: d.name,
        city: d.city,
        phone: d.phone,
        domain: d.domain,
        is_active: d.is_active,
        margin_percent: d.margin_config.base_margin_percent,
        delivery_mode: format!("{:?}", d.delivery_mode),
        payment_type: format!("{:?}", d.payment_type),
        balance: d.balance,
        branding: d.branding,
        contacts: d.contacts,
        legal_info: d.legal_info,
        seo_config: d.seo_config,
    }).collect();

    ok(response)
}

#[derive(Debug, Deserialize)]
pub struct UpdateDealerRequest {
    pub name: Option<String>,
    pub city: Option<String>,
    pub phone: Option<String>,
    pub email: Option<String>,
    pub domain: Option<String>,
    pub margin_percent: Option<f64>,
    pub is_active: Option<bool>,
    pub branding: Option<moskit_core::entity::DealerBranding>,
    pub contacts: Option<moskit_core::entity::DealerContacts>,
    pub legal_info: Option<moskit_core::entity::DealerLegalInfo>,
    pub seo_config: Option<moskit_core::entity::DealerSeoConfig>,
}

pub async fn update_dealer(
    State(state): State<Arc<AppState>>,
    Path(id): Path<String>,
    Json(payload): Json<UpdateDealerRequest>,
) -> ApiResult<DealerResponse> {
    use moskit_core::repository::{DealerRepository, PostgresDealerRepository};
    
    let dealer_id = Uuid::parse_str(&id).map_err(|_| bad_request("Invalid UUID"))?;
    let repo = PostgresDealerRepository::new(state.pool.clone());
    
    let mut dealer = repo.find_by_id(dealer_id).await
        .map_err(|e| bad_request(&e.to_string()))?
        .ok_or_else(|| bad_request("Dealer not found"))?;

    if let Some(name) = payload.name { dealer.name = name; }
    if let Some(city) = payload.city { dealer.city = city; }
    if let Some(phone) = payload.phone { dealer.phone = phone; }
    if let Some(email) = payload.email { dealer.email = Some(email); }
    if let Some(domain) = payload.domain { dealer.domain = Some(domain); }
    if let Some(margin) = payload.margin_percent { dealer.margin_config.base_margin_percent = margin; }
    if let Some(active) = payload.is_active { dealer.is_active = active; }
    if let Some(branding) = payload.branding { dealer.branding = branding; }
    if let Some(contacts) = payload.contacts { dealer.contacts = contacts; }
    if let Some(legal) = payload.legal_info { dealer.legal_info = legal; }
    if let Some(seo) = payload.seo_config { dealer.seo_config = seo; }

    let updated = repo.update(dealer).await.map_err(|e| bad_request(&e.to_string()))?;

    ok(DealerResponse {
        id: updated.id.to_string(),
        name: updated.name,
        city: updated.city,
        phone: updated.phone,
        domain: updated.domain,
        is_active: updated.is_active,
        margin_percent: updated.margin_config.base_margin_percent,
        delivery_mode: format!("{:?}", updated.delivery_mode),
        payment_type: format!("{:?}", updated.payment_type),
        balance: updated.balance,
        branding: updated.branding,
        contacts: updated.contacts,
        legal_info: updated.legal_info,
        seo_config: updated.seo_config,
    })
}

// --- Обработчики отделов ---

#[derive(Debug, Deserialize)]
pub struct CreateDepartmentRequest {
    pub name: String,
    pub markup_config: Option<serde_json::Value>,
}

#[derive(Debug, Serialize)]
pub struct DepartmentResponse {
    pub id: String,
    pub dealer_id: String,
    pub name: String,
    pub markup_config: serde_json::Value,
    pub is_active: bool,
}

pub async fn create_department(
    State(state): State<Arc<AppState>>,
    Path(dealer_id): Path<String>,
    Json(payload): Json<CreateDepartmentRequest>,
) -> ApiResult<DepartmentResponse> {
    use moskit_core::entity::DealerDepartment;
    use moskit_core::repository::{DepartmentRepository, PostgresDepartmentRepository};

    let d_id = Uuid::parse_str(&dealer_id).map_err(|_| bad_request("Invalid Dealer UUID"))?;
    
    let mut dept = DealerDepartment::new(d_id, payload.name);
    if let Some(config) = payload.markup_config {
        dept.markup_config = config;
    }

    let repo = PostgresDepartmentRepository::new(state.pool.clone());
    let created = repo.create(dept).await.map_err(|e| bad_request(&e.to_string()))?;

    ok(DepartmentResponse {
        id: created.id.to_string(),
        dealer_id: created.dealer_id.to_string(),
        name: created.name,
        markup_config: created.markup_config,
        is_active: created.is_active,
    })
}

pub async fn list_departments(
    State(state): State<Arc<AppState>>,
    Path(dealer_id): Path<String>,
) -> ApiResult<Vec<DepartmentResponse>> {
    use moskit_core::repository::{DepartmentRepository, PostgresDepartmentRepository};

    let d_id = Uuid::parse_str(&dealer_id).map_err(|_| bad_request("Invalid Dealer UUID"))?;
    let repo = PostgresDepartmentRepository::new(state.pool.clone());
    let depts = repo.list_by_dealer(d_id).await.map_err(|e| bad_request(&e.to_string()))?;

    let response = depts.into_iter().map(|d| DepartmentResponse {
        id: d.id.to_string(),
        dealer_id: d.dealer_id.to_string(),
        name: d.name,
        markup_config: d.markup_config,
        is_active: d.is_active,
    }).collect();

    ok(response)
}

// --- Аналитика и Аудит ---

#[derive(Debug, Deserialize)]
pub struct StatsRequest {
    pub start_date: Option<DateTime<Utc>>,
    pub end_date: Option<DateTime<Utc>>,
}

pub async fn get_dealer_stats(
    State(state): State<Arc<AppState>>,
    Path(dealer_id): Path<String>,
    Query(query): Query<StatsRequest>,
) -> ApiResult<serde_json::Value> {
    use moskit_core::repository::{OrderRepository, PostgresOrderRepository};
    
    let d_id = Uuid::parse_str(&dealer_id).map_err(|_| bad_request("Invalid Dealer UUID"))?;
    let repo = PostgresOrderRepository::new(state.pool.clone());
    
    let start = query.start_date.unwrap_or_else(|| Utc::now() - chrono::Duration::days(30));
    let end = query.end_date.unwrap_or_else(Utc::now);
    
    let stats = repo.get_stats(Some(d_id), start, end).await
        .map_err(|e| bad_request(&e.to_string()))?;
        
    ok(stats)
}

pub async fn list_audit_logs(
    State(state): State<Arc<AppState>>,
    Path(dealer_id): Path<String>,
) -> ApiResult<Vec<moskit_core::entity::AuditLog>> {
    use moskit_core::repository::{AuditRepository, PostgresAuditRepository};
    
    let d_id = Uuid::parse_str(&dealer_id).map_err(|_| bad_request("Invalid Dealer UUID"))?;
    let repo = PostgresAuditRepository::new(state.pool.clone());
    
    let logs = repo.list_by_dealer(d_id, 50, 0).await
        .map_err(|e| bad_request(&e.to_string()))?;
        
    ok(logs)
}

#[derive(Debug, Serialize)]
pub struct OrderListItem {
    pub id: String,
    pub order_number: String,
    pub dealer_name: Option<String>,
    pub client_name: String,
    pub client_phone: String,
    pub status: String,
    pub total_amount: f64,
    pub created_at: String,
}

pub async fn list_all_orders(
    State(state): State<Arc<AppState>>
) -> ApiResult<Vec<OrderListItem>> {
    use moskit_core::repository::OrderRepository;
    use moskit_core::repository::DealerRepository;
    
    let order_repo = moskit_core::repository::PostgresOrderRepository::new(state.pool.clone());
    let dealer_repo = moskit_core::repository::PostgresDealerRepository::new(state.pool.clone());
    
    let orders = order_repo.list(100, 0).await.map_err(|e| bad_request(&e.to_string()))?;
    
    let mut response = Vec::new();
    for o in orders {
        let dealer_name = if let Some(d_id) = o.dealer_id {
            dealer_repo.find_by_id(d_id).await.ok().flatten().map(|d| d.name)
        } else {
            None
        };
        
        response.push(OrderListItem {
            id: o.id.to_string(),
            order_number: o.order_number,
            dealer_name,
            client_name: o.client_name,
            client_phone: o.client_phone,
            status: o.status.as_str().to_string(),
            total_amount: o.total_amount,
            created_at: o.created_at.to_rfc3339(),
        });
    }

    ok(response)
}

#[derive(Debug, Deserialize)]
pub struct UpdateStatusRequest {
    pub status: String,
    pub production_sub_status: Option<String>,
    pub comment: Option<String>,
}

pub async fn update_order_status(
    State(state): State<Arc<AppState>>,
    axum::extract::Path(id): axum::extract::Path<String>,
    Json(payload): Json<UpdateStatusRequest>,
) -> ApiResult<OrderListItem> {
    use moskit_core::repository::{OrderRepository, PostgresOrderRepository};
    use moskit_core::entity::OrderStatus;

    let order_id = Uuid::parse_str(&id).map_err(|_| bad_request("Invalid UUID"))?;
    let repo = PostgresOrderRepository::new(state.pool.clone());
    
    let mut order = repo.find_by_id(order_id).await
        .map_err(|e| bad_request(&e.to_string()))?
        .ok_or_else(|| bad_request("Order not found"))?;

    let new_status = match payload.status.as_str() {
        "confirmed" => OrderStatus::Confirmed,
        "in_production" => OrderStatus::InProduction,
        "ready" => OrderStatus::Ready,
        "in_installation" => OrderStatus::InInstallation,
        "completed" => OrderStatus::Completed,
        "cancelled" => OrderStatus::Cancelled,
        _ => return Err(bad_request("Invalid status")),
    };

    if !order.can_transition_to(new_status) {
        return Err(bad_request(&format!("Cannot transition from {:?} to {:?}", order.status, new_status)));
    }

    order.status = new_status;
    if let Some(c) = payload.comment {
        order.comment = Some(c);
    }

    let updated = repo.update(order).await.map_err(|e| bad_request(&e.to_string()))?;
    
    ok(OrderListItem {
        id: updated.id.to_string(),
        order_number: updated.order_number,
        dealer_name: None, // Можно подгрузить если нужно
        client_name: updated.client_name,
        client_phone: updated.client_phone,
        status: updated.status.as_str().to_string(),
        total_amount: updated.total_amount,
        created_at: updated.created_at.to_rfc3339(),
    })
}
