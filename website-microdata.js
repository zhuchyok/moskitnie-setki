// Микроразметка веб-сайта для SEO
document.addEventListener('DOMContentLoaded', function() {
    const websiteData = {
        "@context": "https://schema.org",
        "@type": "WebSite",
        "name": "Сетки21 - Москитные сетки в Чебоксарах",
        "url": "https://setki21.ru",
        "description": "Официальный сайт компании Сетки21. Производство и установка москитных сеток в Чебоксарах и Новочебоксарске. Сетки антикошка, антипыль, антимошка.",
        "publisher": {
            "@type": "Organization",
            "name": "Сетки21",
            "logo": {
                "@type": "ImageObject",
                "url": "https://setki21.ru/images/logo.png"
            }
        },
        "potentialAction": {
            "@type": "SearchAction",
            "target": {
                "@type": "EntryPoint",
                "urlTemplate": "https://setki21.ru/search?q={search_term_string}"
            },
            "query-input": "required name=search_term_string"
        },
        "mainEntity": {
            "@type": "ItemList",
            "name": "Основные услуги",
            "itemListElement": [
                {
                    "@type": "ListItem",
                    "position": 1,
                    "item": {
                        "@type": "Product",
                        "name": "Сетка антикошка",
                        "url": "https://setki21.ru/antikoshka/",
                        "description": "Защита от кошек и собак"
                    }
                },
                {
                    "@type": "ListItem",
                    "position": 2,
                    "item": {
                        "@type": "Product",
                        "name": "Сетка антипыль",
                        "url": "https://setki21.ru/antipyl/",
                        "description": "Защита от пыли и тополиного пуха"
                    }
                },
                {
                    "@type": "ListItem",
                    "position": 3,
                    "item": {
                        "@type": "Product",
                        "name": "Сетка антимошка",
                        "url": "https://setki21.ru/antimoshka/",
                        "description": "Защита от комаров и мошек"
                    }
                },
                {
                    "@type": "ListItem",
                    "position": 4,
                    "item": {
                        "@type": "Product",
                        "name": "Вставные москитные сетки",
                        "url": "https://setki21.ru/vstavnye/",
                        "description": "Вставные сетки для пластиковых окон"
                    }
                },
                {
                    "@type": "ListItem",
                    "position": 5,
                    "item": {
                        "@type": "Service",
                        "name": "Ремонт москитных сеток",
                        "url": "https://setki21.ru/remont/",
                        "description": "Профессиональный ремонт сеток"
                    }
                }
            ]
        },
        "sameAs": [
            "https://vk.com/setki21",
            "https://instagram.com/setki21"
        ],
        "inLanguage": "ru-RU",
        "isAccessibleForFree": true,
        "dateCreated": "2020-01-01",
        "dateModified": "2024-12-19"
    };

    // Добавляем микроразметку в head
    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.textContent = JSON.stringify(websiteData);
    document.head.appendChild(script);
}); 