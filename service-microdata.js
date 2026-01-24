// Микроразметка услуг для SEO
document.addEventListener('DOMContentLoaded', function() {
    const servicesData = {
        "@context": "https://schema.org",
        "@type": "ItemList",
        "name": "Услуги по москитным сеткам",
        "description": "Полный спектр услуг по москитным сеткам в Чебоксарах и Новочебоксарске",
        "itemListElement": [
            {
                "@type": "ListItem",
                "position": 1,
                "item": {
                    "@type": "Service",
                    "name": "Установка москитных сеток",
                    "description": "Профессиональная установка москитных сеток на окна и двери",
                    "provider": {
                        "@type": "Organization",
                        "name": "Сетки21"
                    },
                    "serviceType": "Установка",
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
                    "offers": {
                        "@type": "Offer",
                        "price": "0",
                        "priceCurrency": "RUB",
                        "availability": "https://schema.org/InStock"
                    },
                    "url": "https://setki21.ru"
                }
            },
            {
                "@type": "ListItem",
                "position": 2,
                "item": {
                    "@type": "Service",
                    "name": "Замер москитных сеток",
                    "description": "Бесплатный замер для точного изготовления москитных сеток",
                    "provider": {
                        "@type": "Organization",
                        "name": "Сетки21"
                    },
                    "serviceType": "Замер",
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
                    "offers": {
                        "@type": "Offer",
                        "price": "0",
                        "priceCurrency": "RUB",
                        "availability": "https://schema.org/InStock"
                    },
                    "url": "https://setki21.ru"
                }
            },
            {
                "@type": "ListItem",
                "position": 3,
                "item": {
                    "@type": "Service",
                    "name": "Ремонт москитных сеток",
                    "description": "Профессиональный ремонт поврежденных москитных сеток",
                    "provider": {
                        "@type": "Organization",
                        "name": "Сетки21"
                    },
                    "serviceType": "Ремонт",
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
                    "offers": {
                        "@type": "Offer",
                        "price": "500",
                        "priceCurrency": "RUB",
                        "availability": "https://schema.org/InStock"
                    },
                    "url": "https://setki21.ru/remont/"
                }
            },
            {
                "@type": "ListItem",
                "position": 4,
                "item": {
                    "@type": "Service",
                    "name": "Консультация по москитным сеткам",
                    "description": "Бесплатная консультация по выбору и установке москитных сеток",
                    "provider": {
                        "@type": "Organization",
                        "name": "Сетки21"
                    },
                    "serviceType": "Консультация",
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
                    "offers": {
                        "@type": "Offer",
                        "price": "0",
                        "priceCurrency": "RUB",
                        "availability": "https://schema.org/InStock"
                    },
                    "url": "https://setki21.ru"
                }
            },
            {
                "@type": "ListItem",
                "position": 5,
                "item": {
                    "@type": "Service",
                    "name": "Выезд мастера на дом",
                    "description": "Удобный выезд мастера на дом для замера и установки",
                    "provider": {
                        "@type": "Organization",
                        "name": "Сетки21"
                    },
                    "serviceType": "Выезд",
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
                    "offers": {
                        "@type": "Offer",
                        "price": "0",
                        "priceCurrency": "RUB",
                        "availability": "https://schema.org/InStock"
                    },
                    "url": "https://setki21.ru"
                }
            }
        ]
    };

    // Добавляем микроразметку в head
    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.textContent = JSON.stringify(servicesData);
    document.head.appendChild(script);
}); 