// Микроразметка навигации для SEO
document.addEventListener('DOMContentLoaded', function() {
    const navigationData = {
        "@context": "https://schema.org",
        "@type": "SiteNavigationElement",
        "name": "Основная навигация",
        "hasPart": [
            {
                "@type": "WebPage",
                "name": "Главная",
                "url": "https://setki21.ru",
                "description": "Москитные сетки в Чебоксарах и Новочебоксарске"
            },
            {
                "@type": "WebPage",
                "name": "Сетка антикошка",
                "url": "https://setki21.ru/antikoshka/",
                "description": "Защита от кошек и собак"
            },
            {
                "@type": "WebPage",
                "name": "Сетка антипыль",
                "url": "https://setki21.ru/antipyl/",
                "description": "Защита от пыли и тополиного пуха"
            },
            {
                "@type": "WebPage",
                "name": "Сетка антимошка",
                "url": "https://setki21.ru/antimoshka/",
                "description": "Защита от комаров и мошек"
            },
            {
                "@type": "WebPage",
                "name": "Вставные москитные сетки",
                "url": "https://setki21.ru/vstavnye/",
                "description": "Вставные сетки для пластиковых окон"
            },
            {
                "@type": "WebPage",
                "name": "Ремонт москитных сеток",
                "url": "https://setki21.ru/remont/",
                "description": "Профессиональный ремонт сеток"
            },
            {
                "@type": "WebPage",
                "name": "Политика конфиденциальности",
                "url": "https://setki21.ru/privacy/",
                "description": "Политика конфиденциальности"
            }
        ]
    };

    // Добавляем микроразметку в head
    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.textContent = JSON.stringify(navigationData);
    document.head.appendChild(script);
}); 