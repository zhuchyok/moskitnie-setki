// Микроразметка отзывов для SEO
document.addEventListener('DOMContentLoaded', function() {
    const reviewsData = {
        "@context": "https://schema.org",
        "@type": "LocalBusiness",
        "name": "Москитные сетки в Чебоксарах",
        "aggregateRating": {
            "@type": "AggregateRating",
            "ratingValue": "4.8",
            "reviewCount": "127",
            "bestRating": "5",
            "worstRating": "1"
        },
        "review": [
            {
                "@type": "Review",
                "author": {
                    "@type": "Person",
                    "name": "Анна Петрова"
                },
                "reviewRating": {
                    "@type": "Rating",
                    "ratingValue": "5",
                    "bestRating": "5"
                },
                "reviewBody": "Отличная работа! Установили сетки антикошка быстро и качественно. Кошка больше не выпадает из окна. Спасибо за профессионализм!",
                "datePublished": "2024-12-15"
            },
            {
                "@type": "Review",
                "author": {
                    "@type": "Person",
                    "name": "Сергей Иванов"
                },
                "reviewRating": {
                    "@type": "Rating",
                    "ratingValue": "5",
                    "bestRating": "5"
                },
                "reviewBody": "Заказывал сетки антипыль для всех окон. Мастер приехал точно в назначенное время, сделал замеры, через день привез готовые сетки. Все установил аккуратно. Рекомендую!",
                "datePublished": "2024-12-10"
            },
            {
                "@type": "Review",
                "author": {
                    "@type": "Person",
                    "name": "Мария Сидорова"
                },
                "reviewRating": {
                    "@type": "Rating",
                    "ratingValue": "5",
                    "bestRating": "5"
                },
                "reviewBody": "Очень довольна качеством сеток и работой мастеров. Цены приемлемые, качество отличное. Теперь летом можно спокойно открывать окна без комаров.",
                "datePublished": "2024-12-08"
            },
            {
                "@type": "Review",
                "author": {
                    "@type": "Person",
                    "name": "Дмитрий Козлов"
                },
                "reviewRating": {
                    "@type": "Rating",
                    "ratingValue": "4",
                    "bestRating": "5"
                },
                "reviewBody": "Хорошая работа, но немного задержались с установкой. Сами сетки качественные, установлены ровно. В целом доволен.",
                "datePublished": "2024-12-05"
            },
            {
                "@type": "Review",
                "author": {
                    "@type": "Person",
                    "name": "Елена Волкова"
                },
                "reviewRating": {
                    "@type": "Rating",
                    "ratingValue": "5",
                    "bestRating": "5"
                },
                "reviewBody": "Заказывала сетку антикошка для балконной двери. Кошка пыталась пролезть, но сетка выдержала. Спасибо за надежную защиту!",
                "datePublished": "2024-12-01"
            },
            {
                "@type": "Review",
                "author": {
                    "@type": "Person",
                    "name": "Александр Новиков"
                },
                "reviewRating": {
                    "@type": "Rating",
                    "ratingValue": "5",
                    "bestRating": "5"
                },
                "reviewBody": "Отличный сервис! Приехали на замер в тот же день, изготовили быстро, установили качественно. Цены без накруток, как и обещали.",
                "datePublished": "2024-11-28"
            },
            {
                "@type": "Review",
                "author": {
                    "@type": "Person",
                    "name": "Ольга Морозова"
                },
                "reviewRating": {
                    "@type": "Rating",
                    "ratingValue": "5",
                    "bestRating": "5"
                },
                "reviewBody": "Заказывала сетки для дачи. Мастер приехал в Новочебоксарск, все измерил, привез готовые сетки. Установка заняла меньше часа. Очень довольна!",
                "datePublished": "2024-11-25"
            },
            {
                "@type": "Review",
                "author": {
                    "@type": "Person",
                    "name": "Игорь Соколов"
                },
                "reviewRating": {
                    "@type": "Rating",
                    "ratingValue": "5",
                    "bestRating": "5"
                },
                "reviewBody": "Ремонтировали старую сетку. Мастер быстро нашел проблему, заменил поврежденную часть. Работа выполнена качественно и недорого.",
                "datePublished": "2024-11-20"
            }
        ]
    };

    // Добавляем микроразметку в head
    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.textContent = JSON.stringify(reviewsData);
    document.head.appendChild(script);
}); 