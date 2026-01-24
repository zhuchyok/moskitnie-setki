// Микроразметка контактов для SEO
document.addEventListener('DOMContentLoaded', function() {
    const contactsData = {
        "@context": "https://schema.org",
        "@type": "LocalBusiness",
        "name": "Москитные сетки в Чебоксарах",
        "alternateName": "Сетки21",
        "description": "Производство и установка москитных сеток в Чебоксарах и Новочебоксарске. Сетки антикошка, антипыль, антимошка. Бесплатный замер и установка.",
        "url": "https://setki21.ru",
        "telephone": "+7-937-123-45-67",
        "email": "info@setki21.ru",
        "address": {
            "@type": "PostalAddress",
            "addressLocality": "Чебоксары",
            "addressRegion": "Чувашская Республика",
            "addressCountry": "RU",
            "postalCode": "428000"
        },
        "geo": {
            "@type": "GeoCoordinates",
            "latitude": 56.1324,
            "longitude": 47.2519
        },
        "openingHours": [
            "Mo-Su 08:00-20:00"
        ],
        "priceRange": "1500-5000 руб",
        "paymentAccepted": ["Cash", "Credit Card", "Bank Transfer"],
        "currenciesAccepted": "RUB",
        "areaServed": [
            {
                "@type": "City",
                "name": "Чебоксары"
            },
            {
                "@type": "City", 
                "name": "Новочебоксарск"
            }
        ],
        "serviceArea": {
            "@type": "GeoCircle",
            "geoMidpoint": {
                "@type": "GeoCoordinates",
                "latitude": 56.1324,
                "longitude": 47.2519
            },
            "geoRadius": "50000"
        },
        "hasOfferCatalog": {
            "@type": "OfferCatalog",
            "name": "Москитные сетки",
            "itemListElement": [
                {
                    "@type": "Offer",
                    "itemOffered": {
                        "@type": "Product",
                        "name": "Сетка антикошка",
                        "description": "Защита от кошек и собак"
                    },
                    "price": "2500",
                    "priceCurrency": "RUB"
                },
                {
                    "@type": "Offer",
                    "itemOffered": {
                        "@type": "Product",
                        "name": "Сетка антипыль",
                        "description": "Защита от пыли и тополиного пуха"
                    },
                    "price": "2000",
                    "priceCurrency": "RUB"
                },
                {
                    "@type": "Offer",
                    "itemOffered": {
                        "@type": "Product",
                        "name": "Сетка антимошка",
                        "description": "Защита от комаров и мошек"
                    },
                    "price": "1500",
                    "priceCurrency": "RUB"
                },
                {
                    "@type": "Offer",
                    "itemOffered": {
                        "@type": "Service",
                        "name": "Ремонт москитных сеток",
                        "description": "Профессиональный ремонт"
                    },
                    "price": "500",
                    "priceCurrency": "RUB"
                }
            ]
        },
        "sameAs": [
            "https://vk.com/setki21",
            "https://instagram.com/setki21"
        ]
    };

    // Добавляем микроразметку в head
    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.textContent = JSON.stringify(contactsData);
    document.head.appendChild(script);
}); 