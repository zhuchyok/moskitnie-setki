// Микроразметка события для SEO
document.addEventListener('DOMContentLoaded', function() {
    const eventData = {
        "@context": "https://schema.org",
        "@type": "Event",
        "name": "Бесплатный замер москитных сеток",
        "description": "Бесплатный замер и консультация по установке москитных сеток в Чебоксарах и Новочебоксарске. Акция действует круглый год.",
        "startDate": "2024-01-01T08:00:00+03:00",
        "endDate": "2024-12-31T20:00:00+03:00",
        "eventStatus": "https://schema.org/EventScheduled",
        "eventAttendanceMode": "https://schema.org/OfflineEventAttendanceMode",
        "location": [
            {
                "@type": "Place",
                "name": "Чебоксары",
                "address": {
                    "@type": "PostalAddress",
                    "addressLocality": "Чебоксары",
                    "addressRegion": "Чувашская Республика",
                    "addressCountry": "RU"
                }
            },
            {
                "@type": "Place",
                "name": "Новочебоксарск",
                "address": {
                    "@type": "PostalAddress",
                    "addressLocality": "Новочебоксарск",
                    "addressRegion": "Чувашская Республика",
                    "addressCountry": "RU"
                }
            }
        ],
        "organizer": {
            "@type": "Organization",
            "name": "Сетки21",
            "url": "https://setki21.ru",
            "telephone": "+7-937-123-45-67"
        },
        "offers": {
            "@type": "Offer",
            "price": "0",
            "priceCurrency": "RUB",
            "availability": "https://schema.org/InStock",
            "validFrom": "2024-01-01",
            "validThrough": "2024-12-31"
        },
        "performer": {
            "@type": "Organization",
            "name": "Сетки21",
            "description": "Профессиональная установка москитных сеток"
        },
        "audience": {
            "@type": "Audience",
            "audienceType": "Владельцы квартир и домов"
        },
        "inLanguage": "ru-RU"
    };

    // Добавляем микроразметку в head
    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.textContent = JSON.stringify(eventData);
    document.head.appendChild(script);
}); 