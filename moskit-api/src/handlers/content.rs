// handlers/content.rs

use axum::response::{IntoResponse, Redirect};

#[derive(Debug, Serialize)]
pub struct TenantConfig {
    pub dealer_id: String,
    pub dealer_name: String,
    pub city: String,
    pub phone: String,
    pub email: Option<String>,
    pub branding: moskit_core::entity::DealerBranding,
    pub contacts: moskit_core::entity::DealerContacts,
    pub seo: serde_json::Value,
    pub legal: moskit_core::entity::DealerLegalInfo,
    pub branch_id: Option<String>,
}

#[derive(Debug, Deserialize)]
pub struct TenantQuery {
    pub dealer_id: Option<String>,
}

pub async fn get_tenant_config(
    State(state): State<Arc<AppState>>,
    Host(host): Host,
    Query(query): Query<TenantQuery>,
) -> ApiResult<TenantConfig> {
    let repo = PostgresDealerRepository::new(state.pool.clone());
    
    // 1. Пытаемся найти дилера по dealer_id из query-параметра (для предпросмотра)
    let dealer = if let Some(id_str) = query.dealer_id {
        if let Ok(id) = Uuid::parse_str(&id_str) {
            repo.find_by_id(id).await.map_err(|e| bad_request(&e.to_string()))?
        } else {
            None
        }
    } else {
        // 2. Ищем по домену (сначала филиалы, потом дилеры). www.setki21.ru → пробуем setki21.ru.
        let host_for_lookup = host.strip_prefix("www.").unwrap_or(host.as_str());
        let branch = sqlx::query_as::<_, moskit_core::entity::DealerBranch>(
            "SELECT id, dealer_id, name, domain, city, margin_config, is_active, created_at, updated_at FROM dealer_branches WHERE domain = $1"
        )
        .bind(&host)
        .fetch_optional(&state.pool)
        .await
        .map_err(|e| bad_request(&e.to_string()))?;
        let branch = match branch {
            Some(b) => Some(b),
            None if host_for_lookup != host.as_str() => sqlx::query_as::<_, moskit_core::entity::DealerBranch>(
                "SELECT id, dealer_id, name, domain, city, margin_config, is_active, created_at, updated_at FROM dealer_branches WHERE domain = $1"
            )
            .bind(host_for_lookup)
            .fetch_optional(&state.pool)
            .await
            .map_err(|e| bad_request(&e.to_string()))?,
            other => other,
        };

        if let Some(b) = branch {
            let mut d = repo.find_by_id(b.dealer_id).await
                .map_err(|e| bad_request(&e.to_string()))?
                .ok_or_else(|| bad_request("Dealer for branch not found"))?;
            
            // Переопределяем настройки дилера настройками филиала
            if let Some(m) = b.margin_config.get("branch_multiplier").and_then(|v| v.as_f64()) {
                d.margin_config.branch_multiplier = m;
            }
            if let Some(c) = b.city {
                d.city = c;
            }
            
            // Возвращаем дилера с пометкой branch_id
            return build_tenant_config(d, Some(b.id));
        }

        // Дилер: по точному Host, при отсутствии — без префикса www (www.setki21.ru → setki21.ru)
        let mut dealer = repo.find_by_domain(host.as_str()).await
            .map_err(|e| bad_request(&e.to_string()))?;
        if dealer.is_none() && host_for_lookup != host.as_str() {
            dealer = repo.find_by_domain(host_for_lookup).await
                .map_err(|e| bad_request(&e.to_string()))?;
        }
        dealer
    };

    match dealer {
        Some(d) => build_tenant_config(d, None),
        None => Err(bad_request("Tenant not found for this domain")),
    }
}

fn build_tenant_config(d: moskit_core::entity::Dealer, branch_id: Option<Uuid>) -> ApiResult<TenantConfig> {
    // АВТОМАТИЧЕСКОЕ SEO (AI-Optimized)
    // Генерируем заголовки и описания на основе города и бренда дилера
    let city = if d.city.to_lowercase().contains("чебоксар") {
        "Чебоксарах и Новочебоксарске".to_string()
    } else {
        d.city.clone()
    };

    let title_tpl = d.margin_config.title_template.as_ref()
        .or(d.seo_config.title_template.as_ref())
        .map(|s| s.as_str())
        .unwrap_or("Москитные сетки на окна в {city} — цены от 850 руб | {dealer_name}");
    
    let desc_tpl = d.margin_config.description_template.as_ref()
        .or(d.seo_config.description_template.as_ref())
        .map(|s| s.as_str())
        .unwrap_or("Заказать москитные сетки в {city} от производителя {dealer_name}. Изготовление за 1 день, металлический крепеж, замер и установка. Рамочные, Антикошка, Антипыль, вставные VSN.");

    let kw_tpl = d.margin_config.keywords.as_ref()
        .or(d.seo_config.keywords.as_ref())
        .map(|s| s.as_str())
        .unwrap_or("москитные сетки {city}, купить сетку на окно, антикошка, антипыль, vsn, ремонт сеток, {dealer_name}");

    let title = title_tpl.replace("{city}", &city).replace("{dealer_name}", &d.name);
    let description = desc_tpl.replace("{city}", &city).replace("{dealer_name}", &d.name);
    let keywords = kw_tpl.replace("{city}", &city).replace("{dealer_name}", &d.name);

    // AI-Generated Product Descriptions (Extended texts)
    let main_text = format!(
        "Компания {} предлагает профессиональное производство и установку москитных сеток в {}. \
        Мы используем только качественные комплектующие: усиленный алюминиевый профиль и надежное полотно Fiberglass. \
        Наши сетки защитят ваш дом не только от комаров и мух, но и от тополиного пуха и уличного мусора. \
        Собственное производство позволяет нам держать низкие цены и гарантировать срок изготовления от 1 дня.",
        d.name, city
    );

    let vstavnye_text = format!(
        "Вставные москитные сетки VSN в {} — это инновационное решение, не требующее сверления оконной рамы. \
        Они устанавливаются изнутри помещения и фиксируются специальными зацепами, что делает их максимально безопасными и эстетичными. \
        Идеально подходят для новых пластиковых окон, где важно сохранить целостность профиля. Закажите VSN от {} с гарантией качества.",
        city, d.name
    );

    let antimoshka_text = format!(
        "Сетка Антимошка (Micro Mesh) от {} в {} — идеальный выбор для защиты от самых мелких насекомых и тополиного пуха. \
        Благодаря уменьшенному размеру ячейки 0.8х0.8 мм, она задерживает даже гнус, сохраняя при этом отличную вентиляцию. \
        Рекомендуем для квартир рядом с парками и водоемами.",
        d.name, city
    );

    let antikoshka_text = format!(
        "Усиленная сетка Антикошка (Pet Screen) в {} от компании {} создана специально для владельцев домашних животных. \
        Полотно из многослойной синтетической нити с ПВХ-покрытием выдерживает когти кошек и птиц, не рвется и не растягивается. \
        Обеспечьте безопасность вашим питомцам с нашими надежными решениями.",
        city, d.name
    );

    let antipyl_text = format!(
        "Сетка Антипыль (Poll-Tex) в {} — спасение для аллергиков. Специальное нейлоновое полотно от {} \
        обладает электростатическим эффектом, притягивая и удерживая до 90% цветочной пыльцы и уличной пыли. \
        Дышите чистым воздухом даже в период цветения или при жизни рядом с дорогой.",
        city, d.name
    );

    let ultravyu_text = format!(
        "Сетка Ультравью (Ultraview) в {} обеспечивает максимальную прозрачность и защиту. \
        Тонкая, но прочная нить от {} делает сетку практически невидимой на окне, пропуская на 25% больше света и воздуха. \
        Отличный вариант для тех, кто ценит естественное освещение и комфорт.",
        city, d.name
    );

    let remont_text = format!(
        "Профессиональный ремонт москитных сеток в {} от компании {}. \
        Мы быстро заменим порванное полотно, сломанные ручки или треснувшие уголки. \
        Ремонт в нашем цеху занимает всего 3 дня и обходится значительно дешевле покупки нового изделия. \
        Верните вашим сеткам вторую жизнь!",
        city, d.name
    );

    ok(TenantConfig {
        dealer_id: d.id.to_string(),
        dealer_name: d.name,
        city: d.city,
        phone: d.phone,
        email: d.email,
        branding: d.branding,
        contacts: d.contacts,
        seo: serde_json::json!({
            "title": title,
            "description": description,
            "keywords": keywords,
            "verification_tag": d.seo_config.verification_tag,
            "analytics_code": d.seo_config.analytics_code,
            "content": {
                "main": main_text,
                "vstavnye": vstavnye_text,
                "antimoshka": antimoshka_text,
                "antikoshka": antikoshka_text,
                "antipyl": antipyl_text,
                "ultravyu": ultravyu_text,
                "remont": remont_text
            }
        }),
        legal: d.legal_info,
        branch_id: branch_id.map(|id| id.to_string()),
    })
}

pub async fn get_tenant_favicon(
    State(state): State<Arc<AppState>>,
    Host(host): Host,
    Query(query): Query<TenantQuery>,
) -> axum::response::Response {
    let repo = PostgresDealerRepository::new(state.pool.clone());
    
    // 1. Пытаемся найти дилера по dealer_id из query-параметра (для предпросмотра)
    let dealer = if let Some(id_str) = query.dealer_id {
        if let Ok(id) = Uuid::parse_str(&id_str) {
            match repo.find_by_id(id).await {
                Ok(Some(d)) => Some(d),
                _ => None
            }
        } else {
            None
        }
    } else {
        // 2. Ищем по домену; www.setki21.ru → пробуем setki21.ru
        let mut dealer = repo.find_by_domain(host.as_str()).await.ok().flatten();
        if dealer.is_none() {
            if let Some(host_no_www) = host.strip_prefix("www.") {
                dealer = repo.find_by_domain(host_no_www).await.ok().flatten();
            }
        }
        dealer
    };

    if let Some(d) = dealer {
        if let Some(logo_url) = d.branding.logo_url {
            // Если логотип — это путь к загруженному файлу (начинается с /uploads)
            if logo_url.starts_with("/uploads") {
                // Пытаемся прочитать файл локально
                let file_path = format!(".{}", logo_url);
                if let Ok(data) = std::fs::read(&file_path) {
                    let mime = if logo_url.ends_with(".png") { "image/png" }
                              else if logo_url.ends_with(".jpg") || logo_url.ends_with(".jpeg") { "image/jpeg" }
                              else { "image/x-icon" };
                    
                    return axum::response::Response::builder()
                        .header("Content-Type", mime)
                        .header("Cache-Control", "public, max-age=86400")
                        .body(axum::body::Body::from(data))
                        .unwrap();
                }
            }
            // Если файл не найден или это внешний URL — редирект
            return Redirect::temporary(&logo_url).into_response();
        }
    }

    // Дефолтный фавикон (редирект на статику фронтенда)
    Redirect::temporary("/favicon.ico").into_response()
}
