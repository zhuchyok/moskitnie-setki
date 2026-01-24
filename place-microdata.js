// Микроразметка места для SEO
document.addEventListener('DOMContentLoaded', function() {
    const placeData = {
        "@context": "https://schema.org",
        "@type": "Place",
        "name": "Сетки21 - Москитные сетки в Чебоксарах",
        "description": "Производство и установка москитных сеток в Чебоксарах и Новочебоксарске",
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
        "openingHoursSpecification": [
            {
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
        ],
        "priceRange": "1500-5000 руб",
        "paymentAccepted": ["Cash", "Credit Card", "Bank Transfer"],
        "currenciesAccepted": "RUB",
        "areaServed": [
            {
                "@type": "City",
                "name": "Чебоксары",
                "geo": {
                    "@type": "GeoCoordinates",
                    "latitude": 56.1324,
                    "longitude": 47.2519
                }
            },
            {
                "@type": "City",
                "name": "Новочебоксарск",
                "geo": {
                    "@type": "GeoCoordinates",
                    "latitude": 56.1094,
                    "longitude": 47.4791
                }
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
        "hasMap": "https://yandex.ru/maps/-/CCUQ4XgKhB",
        "amenityFeature": [
            {
                "@type": "LocationFeatureSpecification",
                "name": "Бесплатный замер",
                "value": true
            },
            {
                "@type": "LocationFeatureSpecification",
                "name": "Бесплатная установка",
                "value": true
            },
            {
                "@type": "LocationFeatureSpecification",
                "name": "Гарантия качества",
                "value": true
            },
            {
                "@type": "LocationFeatureSpecification",
                "name": "Выезд на дом",
                "value": true
            }
        ],
        "publicAccess": true,
        "smokingAllowed": false,
        "wheelchairAccessible": true,
        "parkingAvailable": true,
        "sameAs": [
            "https://vk.com/setki21",
            "https://instagram.com/setki21"
        ]
    };

    // Добавляем микроразметку в head
    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.textContent = JSON.stringify(placeData);
    document.head.appendChild(script);
}); 