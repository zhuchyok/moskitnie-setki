// service/pricing.rs - Сервис ценообразования

use crate::core::entity::{ColorId, DealerPrice, FrameType, MarginConfig, MeshType, GlobalPricing};
use rust_decimal::Decimal;
use rust_decimal_macros::dec;
use rust_decimal::prelude::ToPrimitive;

pub struct PricingService {
    pub global: GlobalPricing,
    pub margin: MarginConfig,
}

impl PricingService {
    pub fn new(global: GlobalPricing, margin: MarginConfig) -> Self {
        Self { global, margin }
    }

    /// Найти цену элемента по ID
    fn find_price(&self, items: &[crate::core::entity::PricingItem], id: &str) -> Decimal {
        items.iter()
            .find(|i| i.id == id)
            .map(|i| i.price)
            .unwrap_or(Decimal::ZERO)
    }

    /// Рассчитать стоимость работы
    pub fn get_work(&self, color_id: u8, mesh_type: &MeshType, frame_type: &FrameType) -> Decimal {
        let mesh_id = match mesh_type {
            MeshType::Standart => "standart",
            MeshType::Antimoshka => "antimoshka",
            MeshType::Ultravyu => "ultravyu",
            MeshType::Antikoshka => "antikoshka",
            MeshType::Antipyl => "antipyl",
        };
        let mesh_base = self.find_price(&self.global.mesh, mesh_id);

        let profile_id = match (frame_type, color_id) {
            (FrameType::Vstavnaya, 1) => "white_vsn",
            (FrameType::Vstavnaya, 2) => "brown_vsn",
            (FrameType::Vstavnaya, 3) => "anthracite_vsn",
            (FrameType::Vstavnaya, 4) => "ral_vsn",
            (FrameType::Standart, 1) => "white",
            (FrameType::Standart, 2) => "brown",
            (FrameType::Standart, 3) => "anthracite",
            (FrameType::Standart, 4) => "ral",
            _ => "white",
        };
        let mut profile_price = self.find_price(&self.global.profiles, profile_id);
        
        if frame_type == &FrameType::Standart && color_id == 4 {
            profile_price += self.find_price(&self.global.profiles, "ral_painting");
        }

        self.global.markup.manufacturing_base + (mesh_base + profile_price) * (self.global.markup.manufacturing_percent / dec!(100.0))
    }

    /// Рассчитать себестоимость москитной сетки
    pub fn compute_cost(&self, width_mm: u32, height_mm: u32, color_id: ColorId, mesh_type: &MeshType, frame_type: &FrameType) -> Decimal {
        let w = Decimal::from(width_mm) / dec!(1000.0);
        let h = Decimal::from(height_mm) / dec!(1000.0);
        let perimeter_m = dec!(2.0) * (w + h);
        let area_m2 = w * h;
        
        // Минимальная площадь 0.3 м2
        let min_area = dec!(0.3);
        let area_calc = area_m2.max(min_area);

        // 1. Полотно
        let mesh_id = match mesh_type {
            MeshType::Standart => "standart",
            MeshType::Antimoshka => "antimoshka",
            MeshType::Ultravyu => "ultravyu",
            MeshType::Antikoshka => "antikoshka",
            MeshType::Antipyl => "antipyl",
        };
        let mesh_base = self.find_price(&self.global.mesh, mesh_id);
        let mesh_cost = area_calc * mesh_base * dec!(1.32); // Запас 32%

        // 2. Профиль и комплектующие
        let fixed_total = self.get_fixed_total(color_id.0, mesh_type, frame_type);
        
        let profile_id = match (frame_type, color_id.0) {
            (FrameType::Vstavnaya, 1) => "white_vsn",
            (FrameType::Vstavnaya, 2) => "brown_vsn",
            (FrameType::Vstavnaya, 3) => "anthracite_vsn",
            (FrameType::Vstavnaya, 4) => "ral_vsn",
            (FrameType::Standart, 1) => "white",
            (FrameType::Standart, 2) => "brown",
            (FrameType::Standart, 3) => "anthracite",
            (FrameType::Standart, 4) => "ral",
            _ => "white",
        };
        let profile_price = self.find_price(&self.global.profiles, profile_id);
        let profile_length_m = (perimeter_m - dec!(0.24)).max(Decimal::ZERO);
        let profile_cost = profile_length_m * profile_price * dec!(1.15); // Запас 15%

        let cord_price = self.find_price(&self.global.components, "cord");
        let cord_cost = perimeter_m * cord_price;

        let impost_id = match color_id.0 {
            1 => "impost_white",
            2 => "impost_brown",
            3 => "impost_anthracite",
            _ => "impost_white",
        };
        let impost_price = self.find_price(&self.global.profiles, impost_id);
        let impost_length_m = (Decimal::from(width_mm) - dec!(48.0)) / dec!(1000.0);
        let impost_length_m = impost_length_m.max(Decimal::ZERO);
        let impost_cost = impost_length_m * impost_price * dec!(1.15);

        let raw_cost = fixed_total + profile_cost + cord_cost + impost_cost + mesh_cost;

        // Комиссия банка за оплату картой закладывается в себестоимость:
        // делим на (1 - cardPercent), чтобы после удержания получить нужную сумму
        let card_percent = dec!(0.025);
        raw_cost / (Decimal::ONE - card_percent)
    }

    fn get_fixed_total(&self, color_id: u8, mesh_type: &MeshType, frame_type: &FrameType) -> Decimal {
        let work = self.get_work(color_id, mesh_type, frame_type);
        let stretch = self.find_price(&self.global.components, "stretch");
        
        let mut total = work + stretch;

        match frame_type {
            FrameType::Standart => {
                let corner_id = match color_id {
                    1 => "corner_white",
                    2 => "corner_brown",
                    3 => "corner_anthracite",
                    _ => "corner_white",
                };
                total += dec!(4.0) * self.find_price(&self.global.components, corner_id);
                total += dec!(2.0) * self.find_price(&self.global.components, "handle_plastic");
                total += dec!(2.0) * self.find_price(&self.global.components, "screw"); // для ручек
                total += self.find_price(&self.global.components, "mount_plastic"); // набор креплений
                total += dec!(10.0) * self.find_price(&self.global.components, "screw"); // для креплений
                total += dec!(2.0) * self.find_price(&self.global.components, "mount_impost");
            },
            FrameType::Vstavnaya => {
                let corner_id = match color_id {
                    1 => "corner_vsn_white",
                    2 => "corner_vsn_brown",
                    3 => "corner_vsn_anthracite",
                    _ => "corner_vsn_white",
                };
                total += dec!(4.0) * self.find_price(&self.global.components, corner_id);
                total += dec!(2.0) * self.find_price(&self.global.components, "handle_plastic");
                total += dec!(2.0) * self.find_price(&self.global.components, "screw");
                total += dec!(4.0) * self.find_price(&self.global.components, "mount_vsn");
                total += dec!(4.0) * self.find_price(&self.global.components, "rivet");
                total += dec!(2.0) * self.find_price(&self.global.components, "mount_impost");
            }
        }

        total
    }

    /// Рассчитать итоговую цену для дилера
    pub fn calculate_dealer_price(&self, base_cost: Decimal) -> DealerPrice {
        let dealer_cost = (base_cost * self.global.markup.dealer).round_dp(0);
    let suggested_price = (base_cost * self.global.markup.client).round_dp(0);
    
    let multiplier = self.margin.get_multiplier();
    let actual_price = (suggested_price * multiplier).round_dp(0);
    
    let dealer_profit = actual_price - dealer_cost;
    let margin_percent = if dealer_cost > Decimal::ZERO {
        (dealer_profit / dealer_cost * dec!(100.0)).round_dp(2)
    } else {
        Decimal::ZERO
    };

    DealerPrice {
        dealer_cost,
        suggested_price,
        actual_price,
        margin_percent,
        dealer_profit,
    }
}

/// Рассчитать цену услуги (доставка, монтаж и т.д.) для клиента дилера
pub fn calculate_service_price(&self, base_service_cost: Decimal, service_type: &str) -> Decimal {
    //Suggested price from global markup
    let profit_factor = match service_type {
        "delivery" => self.global.markup.delivery_profit_factor,
        "installation" => self.global.markup.installation_profit_factor,
        "measurement" => self.global.markup.measurement_profit_factor,
        "urgent" => self.global.markup.urgent_profit_factor,
        _ => dec!(0.0),
    };

    let suggested_price = (base_service_cost * (dec!(1.0) + profit_factor / dec!(100.0))).round_dp(0);
    
    let multiplier = match service_type {
        "urgent" => self.margin.get_service_multiplier(self.margin.urgent_margin_percent),
        "delivery" => self.margin.get_service_multiplier(self.margin.delivery_margin_percent),
        "installation" => self.margin.get_service_multiplier(self.margin.installation_margin_percent),
        "measurement" => self.margin.get_service_multiplier(self.margin.measurement_margin_percent),
        _ => dec!(1.0),
    };

    (suggested_price * multiplier).round_dp(0)
}
}

/// Округление (helper)
pub fn round_to(value: Decimal, step: Decimal) -> Decimal {
    if step.is_zero() { return value; }
    (value / step).round() * step
}
