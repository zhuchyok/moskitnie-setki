// Микроразметка организации для SEO
document.addEventListener('DOMContentLoaded', function() {
    const organizationData = {
        "@context": "https://schema.org",
        "@type": "Organization",
        "name": "Сетки21",
        "alternateName": "Москитные сетки в Чебоксарах",
        "url": "https://setki21.ru",
        "logo": "https://setki21.ru/images/logo.png",
        "description": "Производство и установка москитных сеток в Чебоксарах и Новочебоксарске. Качественные сетки антикошка, антипыль, антимошка с бесплатным замером и установкой.",
        "foundingDate": "2020",
        "address": {
            "@type": "PostalAddress",
            "addressLocality": "Чебоксары",
            "addressRegion": "Чувашская Республика",
            "addressCountry": "RU"
        },
        "contactPoint": {
            "@type": "ContactPoint",
            "telephone": "+7-937-123-45-67",
            "contactType": "customer service",
            "availableLanguage": ["Russian"],
            "hoursAvailable": {
                "@type": "OpeningHoursSpecification",
                "dayOfWeek": [
                    "Monday",
                    "Tuesday", 
                    "Wednesday",
                    "Thursday",
                    "Friday",
                    "Saturday",
                    "Sunday"
                ],
                "opens": "08:00",
                "closes": "20:00"
            }
        },
        "sameAs": [
            "https://vk.com/setki21",
            "https://instagram.com/setki21"
        ],
        "knowsAbout": [
            "Москитные сетки",
            "Сетки антикошка",
            "Сетки антипыль", 
            "Сетки антимошка",
            "Установка москитных сеток",
            "Ремонт москитных сеток"
        ],
        "hasOfferCatalog": {
            "@type": "OfferCatalog",
            "name": "Каталог москитных сеток",
            "itemListElement": [
                {
                    "@type": "Offer",
                    "itemOffered": {
                        "@type": "Product",
                        "name": "Сетка антикошка",
                        "description": "Прочная сетка для защиты от кошек и собак",
                        "brand": {
                            "@type": "Brand",
                            "name": "Сетки21"
                        },
                        "category": "Москитные сетки"
                    },
                    "price": "2500",
                    "priceCurrency": "RUB",
                    "availability": "https://schema.org/InStock"
                },
                {
                    "@type": "Offer",
                    "itemOffered": {
                        "@type": "Product",
                        "name": "Сетка антипыль",
                        "description": "Сетка для защиты от пыли и тополиного пуха",
                        "brand": {
                            "@type": "Brand",
                            "name": "Сетки21"
                        },
                        "category": "Москитные сетки"
                    },
                    "price": "2000",
                    "priceCurrency": "RUB",
                    "availability": "https://schema.org/InStock"
                },
                {
                    "@type": "Offer",
                    "itemOffered": {
                        "@type": "Product",
                        "name": "Сетка антимошка",
                        "description": "Стандартная сетка от комаров и мошек",
                        "brand": {
                            "@type": "Brand",
                            "name": "Сетки21"
                        },
                        "category": "Москитные сетки"
                    },
                    "price": "1500",
                    "priceCurrency": "RUB",
                    "availability": "https://schema.org/InStock"
                },
                {
                    "@type": "Offer",
                    "itemOffered": {
                        "@type": "Service",
                        "name": "Установка москитных сеток",
                        "description": "Профессиональная установка с гарантией"
                    },
                    "price": "0",
                    "priceCurrency": "RUB",
                    "availability": "https://schema.org/InStock"
                },
                {
                    "@type": "Offer",
                    "itemOffered": {
                        "@type": "Service",
                        "name": "Ремонт москитных сеток",
                        "description": "Качественный ремонт любых повреждений"
                    },
                    "price": "500",
                    "priceCurrency": "RUB",
                    "availability": "https://schema.org/InStock"
                }
            ]
        }
    };

    // Добавляем микроразметку в head
    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.textContent = JSON.stringify(organizationData);
    document.head.appendChild(script);
}); 