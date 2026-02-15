// service/pricing.rs - Сервис ценообразования

use crate::core::entity::{ColorId, DealerPrice, FrameType, MarginConfig, MeshParams, MeshType, PriceConfig};

/// Константы ценообразования (аналог JS PRICING_CONFIG)
pub struct PricingConstants;

impl PricingConstants {
    /// Фиксированные costs
    pub const FIXED_HANDLES: f64 = 4.4;
    pub const FIXED_STRETCH: f64 = 24.0;
    pub const FIXED_WORK_BASE: f64 = 60.0;
    pub const FIXED_WORK_PERCENT: f64 = 0.1;

    /// Фиксированные для рамочной
    pub const CORNERS_BY_COLOR: [f64; 4] = [3.75, 6.0, 7.0, 7.0];
    pub const FIXED_MOUNTS: f64 = 40.0;
    pub const IMPOST_MOUNT_COUNT: u32 = 2;
    pub const IMPOST_MOUNT_PRICE: f64 = 1.8;

    /// Фиксированные для вставной VSN
    pub const CORNERS_VSN_BY_COLOR: [f64; 4] = [14.8, 4.85, 7.15, 7.15];
    pub const VSN_MOUNT_PER_PIECE: f64 = 30.0;
    pub const VSN_MOUNT_COUNT: u32 = 4;

    /// Профиль за м.п. по цветам (рамочная)
    pub const PROFILE_PER_METER: [f64; 4] = [60.0, 64.8, 70.0, 160.0]; // RAL = 60 + 100
    /// Профиль VSN за м.п.
    pub const PROFILE_VSN_PER_METER: [f64; 4] = [151.0, 153.0, 163.0, 251.0];
    /// Импост за м.п.
    pub const IMPOST_PER_METER: [f64; 4] = [62.0, 67.2, 75.0, 162.0];
    /// Покраска RAL
    pub const RAL_PAINTING_PER_METER: f64 = 100.0;
    /// Шнур
    pub const CORD_PER_METER: f64 = 4.6;
    /// Запасы
    pub const MARGIN_PROFILE: f64 = 1.15;
    pub const MARGIN_MESH: f64 = 1.32;
    pub const MARGIN_CORD: f64 = 1.0;
    /// Минимальная площадь
    pub const MIN_AREA_M2: f64 = 0.3;

    /// Полотно за м²
    pub const MESH_PER_M2: [f64; 5] = [63.0, 265.0, 295.0, 414.0, 645.0];
    /// Наценки
    pub const DEALER_FACTOR: f64 = 1.43;
    pub const CLIENT_FACTOR: f64 = 2.13;
    /// Доп. услуги
    pub const INSTALLATION_PRICE: f64 = 400.0;
    pub const HANDLE_METAL_PRICE: f64 = 50.0;
}

/// Рассчитать стоимость работы
fn get_work(mesh_type: &MeshType) -> f64 {
    let mesh_base = match mesh_type {
        MeshType::Standart => PricingConstants::MESH_PER_M2[0],
        MeshType::Antimoshka => PricingConstants::MESH_PER_M2[1],
        MeshType::Ultravyu => PricingConstants::MESH_PER_M2[2],
        MeshType::Antikoshka => PricingConstants::MESH_PER_M2[3],
        MeshType::Antipyl => PricingConstants::MESH_PER_M2[4],
    };

    let profile_input = PricingConstants::PROFILE_PER_METER[0]; // Базовая
    PricingConstants::FIXED_WORK_BASE + (mesh_base + profile_input) * PricingConstants::FIXED_WORK_PERCENT
}

/// Рассчитать фиксированную часть для рамочной
fn get_fixed_total_ramochnaya(color_id: u8) -> f64 {
    let corner = PricingConstants::CORNERS_BY_COLOR[color_id as usize - 1];
    let corners_total = 4.0 * corner;
    let impost_mount_total = PricingConstants::IMPOST_MOUNT_COUNT as f64 * PricingConstants::IMPOST_MOUNT_PRICE;
    let work = get_work(&MeshType::Standart);

    corners_total + PricingConstants::FIXED_HANDLES + PricingConstants::FIXED_MOUNTS
        + impost_mount_total + PricingConstants::STRETCH + work
}

/// Рассчитать фиксированную часть для вставной VSN
fn get_fixed_total_vsn(color_id: u8) -> f64 {
    let corner = PricingConstants::CORNERS_VSN_BY_COLOR[color_id as usize - 1];
    let corners_total = 4.0 * corner;
    let mounts_total = PricingConstants::VSN_MOUNT_COUNT as f64 * PricingConstants::VSN_MOUNT_PER_PIECE;
    let impost_mount_total = PricingConstants::IMPOST_MOUNT_COUNT as f64 * PricingConstants::IMPOST_MOUNT_PRICE;
    let work = get_work(&MeshType::Standart);

    corners_total + PricingConstants::FIXED_HANDLES + mounts_total
        + impost_mount_total + PricingConstants::STRETCH + work
}

/// Цена профиля за м.п.
fn get_profile_per_meter(color_id: u8) -> f64 {
    let base = PricingConstants::PROFILE_PER_METER[color_id as usize - 1];
    if color_id == 4 {
        base + PricingConstants::RAL_PAINTING_PER_METER
    } else {
        base
    }
}

/// Цена профиля VSN за м.п.
fn get_profile_vsn_per_meter(color_id: u8) -> f64 {
    PricingConstants::PROFILE_VSN_PER_METER[color_id as usize - 1] * PricingConstants::MARGIN_PROFILE
}

/// Цена импоста за м.п.
fn get_impost_per_meter(color_id: u8) -> f64 {
    let base = PricingConstants::IMPOST_PER_METER[color_id as usize - 1];
    if color_id == 4 {
        base + PricingConstants::RAL_PAINTING_PER_METER
    } else {
        base
    }
}

/// Рассчитать себестоимость для рамочной сетки
pub fn compute_cost(width_mm: u32, height_mm: u32, color_id: ColorId, mesh_type: &MeshType) -> f64 {
    let w = width_mm as f64 / 1000.0;
    let h = height_mm as f64 / 1000.0;
    let perimeter_m = 2.0 * (w + h);
    let area_m2 = w * h;
    let area_calc = area_m2.max(PricingConstants::MIN_AREA_M2);

    let mesh_idx = match mesh_type {
        MeshType::Standart => 0,
        MeshType::Antimoshka => 1,
        MeshType::Ultravyu => 2,
        MeshType::Antikoshka => 3,
        MeshType::Antipyl => 4,
    };
    let mesh_base = PricingConstants::MESH_PER_M2[mesh_idx];
    let mesh_cost = area_calc * mesh_base * PricingConstants::MARGIN_MESH;

    let fixed_total = get_fixed_total_ramochnaya(color_id.0);
    let profile_length_m = (perimeter_m - 0.24).max(0.0);
    let profile_cost = profile_length_m * get_profile_per_meter(color_id.0) * PricingConstants::MARGIN_PROFILE;
    let cord_cost = perimeter_m * PricingConstants::CORD_PER_METER * PricingConstants::MARGIN_CORD;
    let impost_length_m = ((width_mm as f64 - 48.0) / 1000.0).max(0.0);
    let impost_cost = impost_length_m * get_impost_per_meter(color_id.0) * PricingConstants::MARGIN_PROFILE;

    fixed_total + profile_cost + cord_cost + impost_cost + mesh_cost
}

/// Рассчитать себестоимость для вставной VSN
pub fn compute_cost_vsn(width_mm: u32, height_mm: u32, color_id: ColorId, mesh_type: &MeshType) -> f64 {
    let w = width_mm as f64 / 1000.0;
    let h = height_mm as f64 / 1000.0;
    let perimeter_m = 2.0 * (w + h);
    let area_m2 = w * h;
    let area_calc = area_m2.max(PricingConstants::MIN_AREA_M2);

    let mesh_idx = match mesh_type {
        MeshType::Standart => 0,
        MeshType::Antimoshka => 1,
        MeshType::Ultravyu => 2,
        MeshType::Antikoshka => 3,
        MeshType::Antipyl => 4,
    };
    let mesh_base = PricingConstants::MESH_PER_M2[mesh_idx];
    let mesh_cost = area_calc * mesh_base * PricingConstants::MARGIN_MESH;

    let fixed_total = get_fixed_total_vsn(color_id.0);
    let profile_length_m = (perimeter_m - 0.24).max(0.0);
    let profile_cost = profile_length_m * get_profile_vsn_per_meter(color_id.0);
    let cord_cost = perimeter_m * PricingConstants::CORD_PER_METER * PricingConstants::MARGIN_CORD;
    let impost_length_m = ((width_mm as f64 - 48.0) / 1000.0).max(0.0);
    let impost_cost = impost_length_m * get_impost_per_meter(color_id.0) * PricingConstants::MARGIN_PROFILE;

    fixed_total + profile_cost + cord_cost + impost_cost + mesh_cost
}

/// Округление
fn round_to(value: f64, step: f64) -> f64 {
    (value / step).round() * step
}

/// Цена для клиента
pub fn cost_to_client_price(cost: f64) -> f64 {
    let client_price = cost * PricingConstants::CLIENT_FACTOR;
    round_to(client_price.max(0.0), 50.0)
}

/// Цена для дилера (себестоимость)
pub fn cost_to_dealer_price(cost: f64) -> f64 {
    let dealer_price = cost * PricingConstants::DEALER_FACTOR;
    round_to(dealer_price.max(0.0), 10.0)
}

/// Рассчитать цену для дилера с его наценкой
pub fn calculate_dealer_price(
    base_cost: f64,
    margin_config: &MarginConfig,
) -> DealerPrice {
    let dealer_cost = base_cost;
    let suggested_price = cost_to_client_price(base_cost);

    // Применяем наценку дилера
    let margin_multiplier = 1.0 + (margin_config.base_margin_percent / 100.0);
    let actual_price = suggested_price * margin_multiplier * margin_config.city_multiplier;

    let margin_percent = ((actual_price - dealer_cost) / dealer_cost * 100.0).max(0.0);
    let dealer_profit = actual_price - dealer_cost;

    DealerPrice {
        dealer_cost,
        suggested_price,
        actual_price: round_to(actual_price, 50.0),
        margin_percent,
        dealer_profit,
    }
}

/// Сумма покраски RAL
pub fn get_ral_painting_amount(width_mm: u32, height_mm: u32, color_id: ColorId) -> f64 {
    if color_id.0 != 4 {
        return 0.0;
    }

    let perimeter_m = 2.0 * (width_mm as f64 / 1000.0 + height_mm as f64 / 1000.0);
    let profile_length_m = (perimeter_m - 0.24).max(0.0);
    let impost_length_m = ((width_mm as f64 - 48.0) / 1000.0).max(0.0);

    (profile_length_m + impost_length_m) * PricingConstants::RAL_PAINTING_PER_METER
}
