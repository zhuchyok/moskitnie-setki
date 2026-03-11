use axum::{
    extract::{State, Path, Query, Multipart},
    Json,
};
use crate::handlers::{ok, ApiResult, bad_request};
use crate::AppState;
use crate::npm::NpmClient;
use serde::{Deserialize, Serialize};
use std::sync::Arc;
use uuid::Uuid;
use chrono::{DateTime, Utc, Datelike, TimeZone};
use tracing;

use rust_decimal::Decimal;
use rust_decimal_macros::dec;

// --- Обработчики файлов ---

#[derive(Debug, Deserialize)]
pub struct UpdateBalanceRequest {
    pub amount: Decimal,
    pub description: Option<String>,
}

pub async fn update_dealer_balance(
    State(state): State<Arc<AppState>>,
    Path(id): Path<String>,
    Json(payload): Json<UpdateBalanceRequest>,
) -> ApiResult<serde_json::Value> {
    use moskit_core::repository::{DealerRepository, PostgresDealerRepository};
    
    let dealer_id = Uuid::parse_str(&id).map_err(|_| bad_request("Invalid UUID"))?;
    let repo = PostgresDealerRepository::new(state.pool.clone());
    
    let new_balance = repo.update_balance(
        dealer_id,
        payload.amount,
        "deposit".to_string(),
        payload.description,
        None
    ).await.map_err(|e| bad_request(&e.to_string()))?;
    
    ok(serde_json::json!({
        "success": true,
        "new_balance": new_balance
    }))
}

pub async fn list_dealer_transactions(
    State(state): State<Arc<AppState>>,
    Path(id): Path<String>,
) -> ApiResult<Vec<moskit_core::entity::Transaction>> {
    use moskit_core::repository::{DealerRepository, PostgresDealerRepository};
    
    let dealer_id = Uuid::parse_str(&id).map_err(|_| bad_request("Invalid UUID"))?;
    let repo = PostgresDealerRepository::new(state.pool.clone());
    
    let transactions = repo.find_transactions_by_dealer(dealer_id, 100, 0)
        .await.map_err(|e| bad_request(&e.to_string()))?;
        
    ok(transactions)
}

pub async fn list_dealer_users(
    State(state): State<Arc<AppState>>,
    Path(id): Path<String>,
) -> ApiResult<Vec<moskit_core::entity::User>> {
    use moskit_core::repository::{UserRepository, PostgresUserRepository};
    
    let dealer_id = Uuid::parse_str(&id).map_err(|_| bad_request("Invalid UUID"))?;
    let repo = PostgresUserRepository::new(state.pool.clone());
    
    let users = repo.list_by_dealer(dealer_id).await.map_err(|e| bad_request(&e.to_string()))?;
    ok(users)
}

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
    pub parent_id: Option<Uuid>,
    pub role: Option<String>,
    pub credit_limit: Option<Decimal>,
}

#[derive(Debug, Serialize)]
pub struct DealerResponse {
    pub id: String,
    pub parent_id: Option<Uuid>,
    pub role: String,
    pub name: String,
    pub city: String,
    pub phone: String,
    pub email: Option<String>,
    pub domain: Option<String>,
    pub is_active: bool,
    pub margin_percent: f64,
    pub delivery_mode: String,
    pub payment_type: String,
    pub balance: Decimal,
    pub credit_limit: Decimal,
    pub branding: moskit_core::entity::DealerBranding,
    pub contacts: moskit_core::entity::DealerContacts,
    pub legal_info: moskit_core::entity::DealerLegalInfo,
    pub seo_config: moskit_core::entity::DealerSeoConfig,
    pub initial_password: Option<String>,
}

pub async fn create_dealer(
    State(state): State<Arc<AppState>>,
    Json(payload): Json<CreateDealerRequest>
) -> ApiResult<DealerResponse> {
    use moskit_core::entity::{Dealer, MarginConfig, DeliveryMode, PaymentType, User, UserRole};
    use moskit_core::repository::{DealerRepository, PostgresDealerRepository, UserRepository, PostgresUserRepository};
    use bcrypt::{hash, DEFAULT_COST};
    use rand::{thread_rng, Rng};
    use rand::distributions::Alphanumeric;

    let dealer_id = Uuid::new_v4();
    let dealer = Dealer {
        id: dealer_id,
        parent_id: payload.parent_id,
        role: payload.role.unwrap_or_else(|| "dealer".to_string()),
        name: payload.name.clone(),
        city: payload.city,
        phone: payload.phone,
        email: payload.email.clone(),
        address: None,
        domain: payload.domain,
        margin_config: MarginConfig {
            base_margin_percent: payload.margin_percent.unwrap_or(30.0),
            city_multiplier: 1.0,
            branch_multiplier: 1.0,
            volume_discounts: vec![],
            category_margins: std::collections::HashMap::new(),
        },
        delivery_mode: DeliveryMode::SelfPickup,
        payment_type: PaymentType::Postpaid,
        balance: dec!(0.0),
        credit_limit: payload.credit_limit.unwrap_or(dec!(0.0)),
        branding: Default::default(),
        contacts: Default::default(),
        legal_info: Default::default(),
        seo_config: Default::default(),
        is_active: true,
        created_at: chrono::Utc::now(),
        updated_at: chrono::Utc::now(),
    };

    let repo = PostgresDealerRepository::new(state.pool.clone());
    let created = repo.create(dealer).await.map_err(|e| {
        tracing::error!(error = %e, "admin create_dealer: DB error");
        bad_request(&e.to_string())
    })?;

    // Создаем пользователя для дилера, если указан email
    let mut initial_password = None;
    if let Some(email) = &payload.email {
        let password: String = thread_rng()
            .sample_iter(&Alphanumeric)
            .take(10)
            .map(char::from)
            .collect();
        
        let password_hash = hash(&password, DEFAULT_COST).map_err(|e| bad_request(&e.to_string()))?;
        
        let mut user = User::new(
            email.clone(),
            password_hash,
            payload.name.clone(),
            UserRole::Dealer
        );
        user.dealer_id = Some(dealer_id);
        
        let user_repo = PostgresUserRepository::new(state.pool.clone());
        user_repo.create(user).await.map_err(|e| bad_request(&e.to_string()))?;
        
        initial_password = Some(password);
    }

    ok(DealerResponse {
        id: created.id.to_string(),
        parent_id: created.parent_id,
        role: created.role,
        name: created.name,
        city: created.city,
        phone: created.phone,
        email: created.email,
        domain: created.domain,
        is_active: created.is_active,
        margin_percent: created.margin_config.base_margin_percent,
        delivery_mode: created.delivery_mode.as_db_value().to_string(),
        payment_type: created.payment_type.as_db_value().to_string(),
        balance: created.balance,
        credit_limit: created.credit_limit,
        branding: created.branding,
        contacts: created.contacts,
        legal_info: created.legal_info,
        seo_config: created.seo_config,
        initial_password,
    })
}

pub async fn get_dealer(
    State(state): State<Arc<AppState>>,
    Path(id): Path<String>,
) -> ApiResult<DealerResponse> {
    use moskit_core::repository::{DealerRepository, PostgresDealerRepository};

    let dealer_id = Uuid::parse_str(&id).map_err(|_| bad_request("Invalid UUID"))?;
    let repo = PostgresDealerRepository::new(state.pool.clone());
    let dealer = repo.find_by_id(dealer_id).await
        .map_err(|e| {
            tracing::error!(dealer_id = %dealer_id, error = %e, "admin get_dealer: DB/decode error");
            bad_request(&e.to_string())
        })?
        .ok_or_else(|| bad_request("Dealer not found"))?;

    ok(DealerResponse {
        id: dealer.id.to_string(),
        parent_id: dealer.parent_id,
        role: dealer.role,
        name: dealer.name,
        city: dealer.city,
        phone: dealer.phone,
        email: dealer.email,
        domain: dealer.domain,
        is_active: dealer.is_active,
        margin_percent: dealer.margin_config.base_margin_percent,
        delivery_mode: dealer.delivery_mode.as_db_value().to_string(),
        payment_type: dealer.payment_type.as_db_value().to_string(),
        balance: dealer.balance,
        credit_limit: dealer.credit_limit,
        branding: dealer.branding,
        contacts: dealer.contacts,
        legal_info: dealer.legal_info,
        seo_config: dealer.seo_config,
        initial_password: None,
    })
}

pub async fn list_dealers(
    State(state): State<Arc<AppState>>
) -> ApiResult<Vec<DealerResponse>> {
    use moskit_core::repository::{DealerRepository, PostgresDealerRepository};
    
    let repo = PostgresDealerRepository::new(state.pool.clone());
    let dealers = repo.list(100, 0).await.map_err(|e| {
        tracing::error!(error = %e, "admin list_dealers: DB/decode error");
        bad_request(&e.to_string())
    })?;

    let response = dealers.into_iter().map(|d| DealerResponse {
        id: d.id.to_string(),
        parent_id: d.parent_id,
        role: d.role,
        name: d.name,
        city: d.city,
        phone: d.phone,
        email: d.email,
        domain: d.domain,
        is_active: d.is_active,
        margin_percent: d.margin_config.base_margin_percent,
        delivery_mode: d.delivery_mode.as_db_value().to_string(),
        payment_type: d.payment_type.as_db_value().to_string(),
        balance: d.balance,
        credit_limit: d.credit_limit,
        branding: d.branding,
        contacts: d.contacts,
        legal_info: d.legal_info,
        seo_config: d.seo_config,
        initial_password: None,
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
    pub parent_id: Option<Uuid>,
    pub role: Option<String>,
    pub credit_limit: Option<Decimal>,
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
        .map_err(|e| {
            tracing::error!(dealer_id = %dealer_id, error = %e, "admin update_dealer find_by_id: DB/decode error");
            bad_request(&e.to_string())
        })?
        .ok_or_else(|| bad_request("Dealer not found"))?;

    if let Some(name) = payload.name { dealer.name = name; }
    if let Some(city) = payload.city { dealer.city = city; }
    if let Some(phone) = payload.phone { dealer.phone = phone; }
    if let Some(email) = payload.email { dealer.email = Some(email); }
    if let Some(domain) = payload.domain { dealer.domain = Some(domain); }
    if let Some(margin) = payload.margin_percent { dealer.margin_config.base_margin_percent = margin; }
    if let Some(active) = payload.is_active { dealer.is_active = active; }
    if let Some(parent_id) = payload.parent_id { dealer.parent_id = Some(parent_id); }
    if let Some(role) = payload.role { dealer.role = role; }
    if let Some(credit_limit) = payload.credit_limit { dealer.credit_limit = credit_limit; }
    // Слияние branding: не затирать logo_url и др., если в запросе пришли пустые значения (чтобы логотипы не слетали при сохранении других полей)
    if let Some(b) = payload.branding {
        if b.logo_url.as_ref().map_or(false, |s| !s.trim().is_empty()) {
            dealer.branding.logo_url = b.logo_url;
        }
        if b.primary_color.is_some() { dealer.branding.primary_color = b.primary_color; }
        if b.short_description.is_some() { dealer.branding.short_description = b.short_description; }
        if b.full_description.is_some() { dealer.branding.full_description = b.full_description; }
        if b.working_hours.is_some() { dealer.branding.working_hours = b.working_hours; }
    }
    if let Some(contacts) = payload.contacts { dealer.contacts = contacts; }
    if let Some(legal) = payload.legal_info { dealer.legal_info = legal; }
    if let Some(seo) = payload.seo_config { dealer.seo_config = seo; }

    let updated = repo.update(dealer).await.map_err(|e| {
        tracing::error!(dealer_id = %dealer_id, error = %e, "admin update_dealer update: DB error");
        bad_request(&e.to_string())
    })?;

    ok(DealerResponse {
        id: updated.id.to_string(),
        parent_id: updated.parent_id,
        role: updated.role,
        name: updated.name,
        city: updated.city,
        phone: updated.phone,
        email: updated.email,
        domain: updated.domain,
        is_active: updated.is_active,
        margin_percent: updated.margin_config.base_margin_percent,
        delivery_mode: updated.delivery_mode.as_db_value().to_string(),
        payment_type: updated.payment_type.as_db_value().to_string(),
        balance: updated.balance,
        credit_limit: updated.credit_limit,
        branding: updated.branding,
        contacts: updated.contacts,
        legal_info: updated.legal_info,
        seo_config: updated.seo_config,
        initial_password: None,
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
    use moskit_core::repository::{DealerRepository, PostgresDealerRepository};
    use sqlx::Row;
    
    let d_id = Uuid::parse_str(&dealer_id).map_err(|_| bad_request("Invalid Dealer UUID"))?;
    
    let start = query.start_date.unwrap_or_else(|| {
        let now = Utc::now();
        Utc.with_ymd_and_hms(now.year(), now.month(), 1, 0, 0, 0).single().unwrap_or(now)
    });
    let end = query.end_date.unwrap_or_else(Utc::now);
    
    let row = sqlx::query(
        r#"
        SELECT 
            COUNT(*) as total_count,
            COALESCE(SUM(total_amount), 0) as total_amount,
            COALESCE(SUM(dealer_profit), 0) as total_profit,
            COALESCE(SUM(potential_profit), 0) as potential_profit,
            COALESCE(SUM(dealer_price_total), 0) as total_buy_price
        FROM orders
        WHERE (dealer_id = $1 OR dealer_id IN (SELECT id FROM dealers WHERE parent_id = $1))
          AND created_at >= $2 AND created_at <= $3
        "#
    )
    .bind(d_id)
    .bind(start)
    .bind(end)
    .fetch_one(&state.pool)
    .await
    .map_err(|e| bad_request(&e.to_string()))?;

    let count: i64 = row.get("total_count");
    let amount: Decimal = row.get("total_amount");
    let profit: Decimal = row.get("total_profit");
    let pot_profit: Decimal = row.get("potential_profit");
    let buy_price: Decimal = row.get("total_buy_price");

    let mut alerts: Vec<serde_json::Value> = Vec::new();
    if let Ok(Some(dealer)) = PostgresDealerRepository::new(state.pool.clone()).find_by_id(d_id).await {
        if dealer.balance < state.low_balance_threshold {
            alerts.push(serde_json::json!({
                "type": "low_balance",
                "message": "Низкий баланс. Рекомендуем пополнить счёт.",
                "balance": dealer.balance
            }));
        }
    }

    ok(serde_json::json!({
        "count": count,
        "total_sales": amount,
        "total_profit": profit,
        "potential_profit": pot_profit,
        "total_buy_price": buy_price,
        "period": {
            "start": start,
            "end": end
        },
        "alerts": alerts
    }))
}

pub async fn get_dealer_chart_stats(
    State(state): State<Arc<AppState>>,
    Path(dealer_id): Path<String>,
    Query(query): Query<StatsRequest>,
) -> ApiResult<serde_json::Value> {
    use sqlx::Row;
    
    let d_id = Uuid::parse_str(&dealer_id).map_err(|_| bad_request("Invalid Dealer UUID"))?;
    
    let start = query.start_date.unwrap_or_else(|| {
        let now = Utc::now();
        Utc.with_ymd_and_hms(now.year(), now.month(), 1, 0, 0, 0).single().unwrap_or(now)
    });
    let end = query.end_date.unwrap_or_else(Utc::now);
    
    let rows = sqlx::query(
        r#"
        SELECT 
            DATE(created_at) as date,
            COUNT(*) as count,
            COALESCE(SUM(total_amount), 0) as amount,
            COALESCE(SUM(dealer_profit), 0) as profit
        FROM orders
        WHERE (dealer_id = $1 OR dealer_id IN (SELECT id FROM dealers WHERE parent_id = $1))
          AND created_at >= $2 AND created_at <= $3
        GROUP BY DATE(created_at)
        ORDER BY DATE(created_at)
        "#
    )
    .bind(d_id)
    .bind(start)
    .bind(end)
    .fetch_all(&state.pool)
    .await
    .map_err(|e| bad_request(&e.to_string()))?;

    let mut labels = Vec::new();
    let mut sales_data = Vec::new();
    let mut profit_data = Vec::new();

    for row in rows {
        let date: chrono::NaiveDate = row.get("date");
        let amount: Decimal = row.get("amount");
        let profit: Decimal = row.get("profit");
        
        labels.push(date.to_string());
        sales_data.push(amount);
        profit_data.push(profit);
    }

    ok(serde_json::json!({
        "labels": labels,
        "sales": sales_data,
        "profit": profit_data
    }))
}

/// Аналитика по филиалам: агрегаты продаж/прибыли по branch_id за период (для директора).
pub async fn get_dealer_stats_by_branch(
    State(state): State<Arc<AppState>>,
    Path(dealer_id): Path<String>,
    Query(query): Query<StatsRequest>,
) -> ApiResult<serde_json::Value> {
    use sqlx::Row;

    let d_id = Uuid::parse_str(&dealer_id).map_err(|_| bad_request("Invalid Dealer UUID"))?;

    let start = query.start_date.unwrap_or_else(|| {
        let now = Utc::now();
        Utc.with_ymd_and_hms(now.year(), now.month(), 1, 0, 0, 0).single().unwrap_or(now)
    });
    let end = query.end_date.unwrap_or_else(Utc::now);

    let rows = sqlx::query(
        r#"
        SELECT 
            o.branch_id,
            b.name AS branch_name,
            b.city AS branch_city,
            COUNT(*) AS order_count,
            COALESCE(SUM(o.total_amount), 0) AS total_sales,
            COALESCE(SUM(o.dealer_profit), 0) AS total_profit,
            COALESCE(SUM(o.potential_profit), 0) AS potential_profit,
            COALESCE(SUM(o.dealer_price_total), 0) AS total_buy_price
        FROM orders o
        LEFT JOIN dealer_branches b ON b.id = o.branch_id
        WHERE (o.dealer_id = $1 OR o.dealer_id IN (SELECT id FROM dealers WHERE parent_id = $1))
          AND o.created_at >= $2 AND o.created_at <= $3
        GROUP BY o.branch_id, b.name, b.city
        ORDER BY total_sales DESC NULLS LAST
        "#
    )
    .bind(d_id)
    .bind(start)
    .bind(end)
    .fetch_all(&state.pool)
    .await
    .map_err(|e| bad_request(&e.to_string()))?;

    let by_branch: Vec<serde_json::Value> = rows.iter().map(|row| {
        let branch_id: Option<Uuid> = row.get("branch_id");
        let branch_name: Option<String> = row.get("branch_name");
        let branch_city: Option<String> = row.get("branch_city");
        let order_count: i64 = row.get("order_count");
        let total_sales: Decimal = row.get("total_sales");
        let total_profit: Decimal = row.get("total_profit");
        let potential_profit: Decimal = row.get("potential_profit");
        let total_buy_price: Decimal = row.get("total_buy_price");
        serde_json::json!({
            "branch_id": branch_id,
            "branch_name": branch_name.unwrap_or_else(|| "Без филиала".to_string()),
            "branch_city": branch_city,
            "order_count": order_count,
            "total_sales": total_sales,
            "total_profit": total_profit,
            "potential_profit": potential_profit,
            "total_buy_price": total_buy_price,
        })
    }).collect();

    ok(serde_json::json!({
        "by_branch": by_branch,
        "period": { "start": start, "end": end }
    }))
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
    pub total_amount: Decimal,
    pub created_at: String,
}

#[derive(Debug, Serialize)]
pub struct ProductionOrderItem {
    pub id: String,
    pub name: String,
    pub quantity: i32,
}

#[derive(Debug, Serialize)]
pub struct ProductionOrderRow {
    pub id: String,
    pub order_number: String,
    pub client_name: String,
    pub created_at: String,
    pub status: String,
    pub production_sub_status: Option<String>,
    pub items: Vec<ProductionOrderItem>,
}

pub async fn get_production_orders(State(state): State<Arc<AppState>>) -> ApiResult<Vec<ProductionOrderRow>> {
    use moskit_core::repository::OrderRepository;
    use moskit_core::entity::OrderStatus;

    let order_repo = moskit_core::repository::PostgresOrderRepository::new(state.pool.clone());
    let orders = order_repo.list(100, 0).await.map_err(|e| bad_request(&e.to_string()))?;

    let mut rows = Vec::new();
    for o in orders {
        if o.status != OrderStatus::Confirmed && o.status != OrderStatus::InProduction {
            continue;
        }
        let full = match order_repo.find_by_id(o.id).await {
            Ok(Some(f)) => f,
            _ => continue,
        };
        let items: Vec<ProductionOrderItem> = full.items.iter().map(|i| ProductionOrderItem {
            id: i.id.to_string(),
            name: i.name.clone(),
            quantity: i.quantity,
        }).collect();
        rows.push(ProductionOrderRow {
            id: full.id.to_string(),
            order_number: full.order_number,
            client_name: full.client_name,
            created_at: full.created_at.to_rfc3339(),
            status: full.status.as_str().to_string(),
            production_sub_status: full.production_sub_status.map(|s| s.as_str().to_string()),
            items,
        });
    }

    ok(rows)
}

#[derive(Debug, Serialize)]
pub struct AdminStats {
    pub dealers_count: u32,
    pub orders_in_progress: u32,
    pub revenue_month: Decimal,
    pub new_orders_today: u32,
}

pub async fn get_admin_stats(State(state): State<Arc<AppState>>) -> ApiResult<AdminStats> {
    use moskit_core::repository::{DealerRepository, OrderRepository};
    use moskit_core::entity::OrderStatus;

    let dealer_repo = moskit_core::repository::PostgresDealerRepository::new(state.pool.clone());
    let order_repo = moskit_core::repository::PostgresOrderRepository::new(state.pool.clone());

    let dealers = dealer_repo.list(500, 0).await.map_err(|e| bad_request(&e.to_string()))?;
    let orders = order_repo.list(500, 0).await.map_err(|e| bad_request(&e.to_string()))?;

    let now = Utc::now();
    let start_of_month = Utc
        .with_ymd_and_hms(now.year(), now.month(), 1, 0, 0, 0)
        .single()
        .unwrap_or(now);

    let orders_in_progress = orders.iter()
        .filter(|o| o.status == OrderStatus::Confirmed || o.status == OrderStatus::InProduction)
        .count() as u32;

    let new_orders_today = orders.iter()
        .filter(|o| o.created_at.date_naive() == now.date_naive())
        .count() as u32;

    let stats_month = order_repo.get_stats(None, start_of_month, now).await
        .map_err(|e| bad_request(&e.to_string()))?;
    let revenue_month = stats_month.get("amount")
        .and_then(|v| v.as_f64())
        .map(|f| Decimal::from_f64_retain(f).unwrap_or_default())
        .unwrap_or_default();

    ok(AdminStats {
        dealers_count: dealers.len() as u32,
        orders_in_progress,
        revenue_month,
        new_orders_today,
    })
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

    // --- ЛОГИКА ОПЛАТЫ ПРИ ПОДТВЕРЖДЕНИИ ---
    if (new_status == OrderStatus::Confirmed || new_status == OrderStatus::InProduction) && order.status == OrderStatus::New {
        if let Some(dealer_id) = order.dealer_id {
            use moskit_core::repository::{DealerRepository, PostgresDealerRepository};
            use moskit_core::entity::{PaymentType, Transaction};
            
            let dealer_repo = PostgresDealerRepository::new(state.pool.clone());
            let dealer = dealer_repo.find_by_id(dealer_id).await
                .map_err(|e| bad_request(&e.to_string()))?
                .ok_or_else(|| bad_request("Dealer not found"))?;

            let total_cost = order.dealer_cost;

            // Проверка лимита
            if dealer.payment_type == PaymentType::Prepaid {
                if dealer.balance < total_cost {
                    return Err(bad_request("Недостаточно средств на балансе дилера для запуска в производство."));
                }
            } else if dealer.payment_type == PaymentType::Postpaid {
                if dealer.balance + dealer.credit_limit < total_cost {
                    return Err(bad_request("Превышен кредитный лимит дилера. Запуск в производство невозможен."));
                }
            }

            // Списание средств
            let mut updated_dealer = dealer.clone();
            updated_dealer.balance -= total_cost;
            dealer_repo.update(updated_dealer.clone()).await.map_err(|e| bad_request(&e.to_string()))?;

            // Лог транзакции
            let transaction = Transaction {
                id: Uuid::new_v4(),
                dealer_id: dealer.id,
                amount: -total_cost,
                balance_after: updated_dealer.balance,
                transaction_type: "order_payment".to_string(),
                order_id: Some(order.id),
                description: Some(format!("Оплата заказа №{}", order.order_number)),
                created_at: Utc::now(),
            };
            dealer_repo.create_transaction(transaction).await.map_err(|e| bad_request(&e.to_string()))?;
        }
    }

    order.status = new_status;
    if let Some(c) = payload.comment {
        order.comment = Some(c);
    }
    if let Some(ref ps) = payload.production_sub_status {
        if let Some(sub) = moskit_core::entity::ProductionSubStatus::from_str(ps) {
            order.production_sub_status = Some(sub);
        }
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

pub async fn activate_dealer_domain(
    State(state): State<Arc<AppState>>,
    Path(id): Path<String>,
) -> ApiResult<serde_json::Value> {
    use moskit_core::repository::{DealerRepository, PostgresDealerRepository};
    
    let dealer_id = Uuid::parse_str(&id).map_err(|_| bad_request("Invalid UUID"))?;
    let repo = PostgresDealerRepository::new(state.pool.clone());
    
    let dealer = repo.find_by_id(dealer_id).await
        .map_err(|e| bad_request(&e.to_string()))?
        .ok_or_else(|| bad_request("Dealer not found"))?;

    let domain = dealer.domain.ok_or_else(|| bad_request("Dealer has no domain configured"))?;
    
    tracing::info!("Activating domain {} for dealer {}", domain, dealer_id);
    
    let npm = NpmClient::new();
    match npm.create_proxy_host(&domain).await {
        Ok(host_id) => {
            tracing::info!("Domain {} activated successfully, NPM Host ID: {}", domain, host_id);
            ok(serde_json::json!({ 
                "success": true, 
                "npm_host_id": host_id,
                "message": format!("Домен {} успешно активирован в NPM", domain)
            }))
        },
        Err(e) => {
            tracing::error!("Failed to activate domain {} in NPM: {}", domain, e);
            Err(bad_request(&format!("Ошибка NPM: {}", e)))
        }
    }
}
