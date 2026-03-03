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
use axum::response::Redirect;

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
        // 2. Иначе ищем по домену
        repo.find_by_domain(&host).await
            .map_err(|e| bad_request(&e.to_string()))?
    };

    match dealer {
        Some(d) => {
            // АВТОМАТИЧЕСКОЕ SEO (AI-Optimized)
            // Генерируем заголовки и описания на основе города и бренда дилера
            let city = if d.city.to_lowercase().contains("чебоксар") {
                "Чебоксарах и Новочебоксарске".to_string()
            } else {
                d.city.clone()
            };

            let title = format!("Москитные сетки на окна в {} — цены от 850 руб | {}", city, d.name);
            let description = format!(
                "Заказать москитные сетки в {} от производителя {}. Изготовление за 1 день, металлический крепеж, замер и установка. Рамочные, Антикошка, Антипыль, вставные VSN.",
                city, d.name
            );
            let keywords = format!(
                "москитные сетки {}, купить сетку на окно, антикошка, антипыль, vsn, ремонт сеток, {}",
                city, d.name
            );

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
                branding: d.branding,
                contacts: d.contacts,
                seo: serde_json::json!({
                    "title": title,
                    "description": description,
                    "keywords": keywords,
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
            })
        },
        None => Err(bad_request("Tenant not found for this domain")),
    }
}

pub async fn get_tenant_favicon(
    State(state): State<Arc<AppState>>,
    Host(host): Host,
    Query(query): Query<TenantQuery>,
) -> Redirect {
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
        // 2. Иначе ищем по домену
        match repo.find_by_domain(&host).await {
            Ok(Some(d)) => Some(d),
            _ => None
        }
    };

    let logo_url = if let Some(d) = dealer {
        d.branding.logo_url.unwrap_or_else(|| "/favicon.ico".to_string())
    } else {
        "/favicon.ico".to_string()
    };

    Redirect::temporary(&logo_url)
}
