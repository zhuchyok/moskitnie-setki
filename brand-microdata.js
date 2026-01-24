// Микроразметка бренда для SEO
document.addEventListener('DOMContentLoaded', function() {
    const brandData = {
        "@context": "https://schema.org",
        "@type": "Brand",
        "name": "Сетки21",
        "alternateName": "Москитные сетки в Чебоксарах",
        "description": "Бренд качественных москитных сеток для защиты от насекомых, пыли и домашних животных",
        "url": "https://setki21.ru",
        "logo": "https://setki21.ru/images/logo.png",
        "image": [
            "https://setki21.ru/images/logo.png",
            "https://setki21.ru/images/logo_f.png"
        ],
        "slogan": "Качественная защита вашего дома",
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
            "availableLanguage": ["Russian"]
        },
        "hasOfferCatalog": {
            "@type": "OfferCatalog",
            "name": "Каталог москитных сеток Сетки21",
            "itemListElement": [
                {
                    "@type": "Offer",
                    "itemOffered": {
                        "@type": "Product",
                        "name": "Сетка антикошка Сетки21",
                        "brand": {
                            "@type": "Brand",
                            "name": "Сетки21"
                        },
                        "category": "Москитные сетки"
                    },
                    "price": "2500",
                    "priceCurrency": "RUB"
                },
                {
                    "@type": "Offer",
                    "itemOffered": {
                        "@type": "Product",
                        "name": "Сетка антипыль Сетки21",
                        "brand": {
                            "@type": "Brand",
                            "name": "Сетки21"
                        },
                        "category": "Москитные сетки"
                    },
                    "price": "2000",
                    "priceCurrency": "RUB"
                },
                {
                    "@type": "Offer",
                    "itemOffered": {
                        "@type": "Product",
                        "name": "Сетка антимошка Сетки21",
                        "brand": {
                            "@type": "Brand",
                            "name": "Сетки21"
                        },
                        "category": "Москитные сетки"
                    },
                    "price": "1500",
                    "priceCurrency": "RUB"
                }
            ]
        },
        "knowsAbout": [
            "Москитные сетки",
            "Сетки антикошка",
            "Сетки антипыль",
            "Сетки антимошка",
            "Установка москитных сеток",
            "Ремонт москитных сеток"
        ],
        "award": [
            "Гарантия качества 1 год",
            "Бесплатный замер",
            "Бесплатная установка"
        ],
        "review": {
            "@type": "Review",
            "reviewRating": {
                "@type": "Rating",
                "ratingValue": "4.8",
                "bestRating": "5"
            },
            "author": {
                "@type": "Organization",
                "name": "Клиенты Сетки21"
            },
            "reviewBody": "Отличное качество москитных сеток и профессиональная установка"
        },
        "sameAs": [
            "https://vk.com/setki21",
            "https://instagram.com/setki21"
        ]
    };

    // Добавляем микроразметку в head
    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.textContent = JSON.stringify(brandData);
    document.head.appendChild(script);
}); 