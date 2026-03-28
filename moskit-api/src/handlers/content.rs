// handlers/content.rs

use axum::{
    extract::{State, Host, Query},
    Json,
};
use std::sync::Arc;
use serde::{Serialize, Deserialize};
use crate::AppState;
use crate::handlers::{ApiResult, ok, bad_request};
use moskit_core::repository::{DealerRepository, PostgresDealerRepository};
use uuid::Uuid;
use axum::response::{Redirect, IntoResponse};

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
    pub margin_config: moskit_core::entity::pricing::MarginConfig,
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

    // Приоритет: 1. Шаблон из seo_config (из админки), 2. AI-генерация
    let title = if let Some(ref t) = d.seo_config.title_template {
        if !t.trim().is_empty() {
            t.replace("{city}", &city).replace("{dealer_name}", &d.name)
        } else {
            format!("Москитные сетки на окна в {} — цены от 850 руб | {}", city, d.name)
        }
    } else {
        format!("Москитные сетки на окна в {} — цены от 850 руб | {}", city, d.name)
    };

    let description = if let Some(ref desc) = d.seo_config.description_template {
        if !desc.trim().is_empty() {
            desc.replace("{city}", &city).replace("{dealer_name}", &d.name)
        } else {
            format!(
                "Заказать москитные сетки в {} от производителя {}. Изготовление за 1 день, металлический крепеж, замер и установка. Рамочные, Антикошка, Антипыль, вставные VSN.",
                city, d.name
            )
        }
    } else {
        format!(
            "Заказать москитные сетки в {} от производителя {}. Изготовление за 1 день, металлический крепеж, замер и установка. Рамочные, Антикошка, Антипыль, вставные VSN.",
            city, d.name
        )
    };

    let keywords = if let Some(ref kw) = d.seo_config.keywords {
        if !kw.trim().is_empty() {
            kw.replace("{city}", &city).replace("{dealer_name}", &d.name)
        } else {
            format!(
                "москитные сетки {}, купить сетку на окно, антикошка, антипыль, vsn, ремонт сеток, {}",
                city, d.name
            )
        }
    } else {
        format!(
            "москитные сетки {}, купить сетку на окно, антикошка, антипыль, vsn, ремонт сеток, {}",
            city, d.name
        )
    };

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

    // Дополнительные SEO поля для конкретных страниц (если нужно переопределить через API)
    let seo_data = serde_json::json!({
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
        },
        // Шаблоны для внутренних страниц, если они не заданы в админке
        "pages": {
            "vstavnye": {
                "title": format!("Вставные москитные сетки VSN в {} — цены от 1450 руб | {}", city, d.name),
                "description": format!("Инновационные вставные сетки VSN в {} от компании {}. Не требуют сверления рамы, устанавливаются изнутри. Надежно, эстетично, безопасно.", city, d.name)
            },
            "antimoshka": {
                "title": format!("Москитная сетка Антимошка в {} — цены от 1000 руб | {}", city, d.name),
                "description": format!("Сетки Антимошка с уменьшенной ячейкой 0.8х0.8 мм в {} от компании {}. Защита от мелких насекомых и тополиного пуха.", city, d.name)
            },
            "antikoshka": {
                "title": format!("Сетка Антикошка на окна в {} — цены от 1800 руб | {}", city, d.name),
                "description": format!("Усиленные сетки Антикошка (Pet Screen) в {} от компании {}. Выдерживают когти животных, обеспечивают безопасность питомцев.", city, d.name)
            },
            "antipyl": {
                "title": format!("Сетка Антипыль (Poll-Tex) в {} — цены от 2200 руб | {}", city, d.name),
                "description": format!("Сетки Антипыль для аллергиков в {} от компании {}. Удерживают пыльцу и уличную пыль, обеспечивая чистый воздух.", city, d.name)
            },
            "ultravyu": {
                "title": format!("Сетка Ультравью (Ultraview) в {} — цены от 1200 руб | {}", city, d.name),
                "description": format!("Максимально прозрачные сетки Ультравью в {} от компании {}. Пропускают на 25% больше света и воздуха.", city, d.name)
            },
            "remont": {
                "title": format!("Ремонт москитных сеток в {} — от 100 руб | {}", city, d.name),
                "description": format!("Профессиональный ремонт москитных сеток в {} от компании {}. Замена полотна, ручек, уголков за 3 дня.", city, d.name)
            }
        }
    });

    ok(TenantConfig {
        dealer_id: d.id.to_string(),
        dealer_name: d.name,
        city: d.city,
        phone: d.phone,
        email: d.email,
        branding: d.branding,
        contacts: d.contacts,
        seo: seo_data,
        margin_config: d.margin_config,
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

    let dealer = if let Some(id_str) = query.dealer_id {
        if let Ok(id) = Uuid::parse_str(&id_str) {
            match repo.find_by_id(id).await {
                Ok(Some(d)) => Some(d),
                _ => None,
            }
        } else {
            None
        }
    } else {
        let mut dealer = repo.find_by_domain(host.as_str()).await.ok().flatten();
        if dealer.is_none() {
            if let Some(host_no_www) = host.strip_prefix("www.") {
                dealer = repo.find_by_domain(host_no_www).await.ok().flatten();
            }
        }
        dealer
    };

    if let Some(d) = dealer {
        let source_url = d.branding.favicon_url.or(d.branding.logo_url);
        if let Some(logo_url) = source_url {
            if logo_url.starts_with("/uploads") {
                let file_path = format!(".{}", logo_url);

                // Кэш: ./uploads/cache/favicon_<hash>.png
                let cache_key = format!("{:x}", md5_hash(&logo_url));
                let cache_dir = std::path::Path::new("./uploads/cache");
                let cache_path = cache_dir.join(format!("favicon_{}.png", cache_key));

                // Если кэш свежее исходника — отдаём из кэша
                let use_cache = if cache_path.exists() {
                    let source_mtime = std::fs::metadata(&file_path).and_then(|m| m.modified()).ok();
                    let cache_mtime = std::fs::metadata(&cache_path).and_then(|m| m.modified()).ok();
                    match (source_mtime, cache_mtime) {
                        (Some(s), Some(c)) => c >= s,
                        _ => true,
                    }
                } else {
                    false
                };

                if use_cache {
                    if let Ok(cached) = std::fs::read(&cache_path) {
                        return axum::response::Response::builder()
                            .header("Content-Type", "image/png")
                            .header("Cache-Control", "no-cache, must-revalidate")
                            .body(axum::body::Body::from(cached))
                            .unwrap();
                    }
                }

                if let Ok(data) = std::fs::read(&file_path) {
                    if let Ok(png_bytes) = resize_to_favicon(&data) {
                        // Сохраняем в кэш
                        let _ = std::fs::create_dir_all(cache_dir);
                        let _ = std::fs::write(&cache_path, &png_bytes);

                        return axum::response::Response::builder()
                            .header("Content-Type", "image/png")
                            .header("Cache-Control", "no-cache, must-revalidate")
                            .body(axum::body::Body::from(png_bytes))
                            .unwrap();
                    }
                    let mime = if logo_url.ends_with(".png") { "image/png" }
                        else if logo_url.ends_with(".jpg") || logo_url.ends_with(".jpeg") { "image/jpeg" }
                        else { "image/x-icon" };
                    return axum::response::Response::builder()
                        .header("Content-Type", mime)
                        .header("Cache-Control", "no-cache, must-revalidate")
                        .body(axum::body::Body::from(data))
                        .unwrap();
                }
            }
            return Redirect::temporary(&logo_url).into_response();
        }
    }

    // Дефолтный фавикон: минимальный прозрачный 1x1 PNG
    // (когда у дилера нет загруженного логотипа)
    static DEFAULT_PNG: &[u8] = &[
        0x89,0x50,0x4E,0x47,0x0D,0x0A,0x1A,0x0A,0x00,0x00,0x00,0x0D,0x49,0x48,0x44,0x52,
        0x00,0x00,0x00,0x01,0x00,0x00,0x00,0x01,0x08,0x06,0x00,0x00,0x00,0x1F,0x15,0xC4,
        0x89,0x00,0x00,0x00,0x0A,0x49,0x44,0x41,0x54,0x78,0x9C,0x62,0x00,0x01,0x00,0x00,
        0x05,0x00,0x01,0x0D,0x0A,0x2D,0xB4,0x00,0x00,0x00,0x00,0x49,0x45,0x4E,0x44,0xAE,
        0x42,0x60,0x82,
    ];
    axum::response::Response::builder()
        .header("Content-Type", "image/png")
        .header("Cache-Control", "no-cache, must-revalidate")
        .body(axum::body::Body::from(DEFAULT_PNG))
        .unwrap()
}

fn md5_hash(s: &str) -> u64 {
    use std::hash::{Hash, Hasher};
    use std::collections::hash_map::DefaultHasher;
    let mut h = DefaultHasher::new();
    s.hash(&mut h);
    h.finish()
}

fn resize_to_favicon(data: &[u8]) -> Result<Vec<u8>, Box<dyn std::error::Error>> {
    use image::imageops::FilterType;
    use image::ImageFormat;

    let img = image::load_from_memory(data)?;
    let resized = img.resize(32, 32, FilterType::Lanczos3);
    let mut out = std::io::Cursor::new(Vec::new());
    resized.write_to(&mut out, ImageFormat::Png)?;
    Ok(out.into_inner())
}
