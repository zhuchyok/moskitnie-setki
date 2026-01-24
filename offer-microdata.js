// Микроразметка предложений для SEO
document.addEventListener('DOMContentLoaded', function() {
    const offersData = {
        "@context": "https://schema.org",
        "@type": "ItemList",
        "name": "Предложения москитных сеток",
        "description": "Каталог москитных сеток с ценами и описанием",
        "itemListElement": [
            {
                "@type": "ListItem",
                "position": 1,
                "item": {
                    "@type": "Offer",
                    "itemOffered": {
                        "@type": "Product",
                        "name": "Сетка антикошка",
                        "description": "Прочная сетка для защиты от кошек и собак",
                        "brand": {
                            "@type": "Brand",
                            "name": "Сетки21"
                        },
                        "category": "Москитные сетки",
                        "image": "https://setki21.ru/upload/iblock/6ec/6ecd680a4de616cd7a4118fe7c4e82ae.png"
                    },
                    "price": "2500",
                    "priceCurrency": "RUB",
                    "availability": "https://schema.org/InStock",
                    "seller": {
                        "@type": "Organization",
                        "name": "Сетки21"
                    },
                    "url": "https://setki21.ru/antikoshka/"
                }
            },
            {
                "@type": "ListItem",
                "position": 2,
                "item": {
                    "@type": "Offer",
                    "itemOffered": {
                        "@type": "Product",
                        "name": "Сетка антипыль",
                        "description": "Сетка для защиты от пыли и тополиного пуха",
                        "brand": {
                            "@type": "Brand",
                            "name": "Сетки21"
                        },
                        "category": "Москитные сетки",
                        "image": "https://setki21.ru/upload/iblock/963/963b80b25938266f19cda63ac6f838b4.png"
                    },
                    "price": "2000",
                    "priceCurrency": "RUB",
                    "availability": "https://schema.org/InStock",
                    "seller": {
                        "@type": "Organization",
                        "name": "Сетки21"
                    },
                    "url": "https://setki21.ru/antipyl/"
                }
            },
            {
                "@type": "ListItem",
                "position": 3,
                "item": {
                    "@type": "Offer",
                    "itemOffered": {
                        "@type": "Product",
                        "name": "Сетка антимошка",
                        "description": "Стандартная сетка от комаров и мошек",
                        "brand": {
                            "@type": "Brand",
                            "name": "Сетки21"
                        },
                        "category": "Москитные сетки",
                        "image": "https://setki21.ru/upload/iblock/e09/e09007396221ccbae983f19a970e4be5.png"
                    },
                    "price": "1500",
                    "priceCurrency": "RUB",
                    "availability": "https://schema.org/InStock",
                    "seller": {
                        "@type": "Organization",
                        "name": "Сетки21"
                    },
                    "url": "https://setki21.ru/antimoshka/"
                }
            },
            {
                "@type": "ListItem",
                "position": 4,
                "item": {
                    "@type": "Offer",
                    "itemOffered": {
                        "@type": "Product",
                        "name": "Вставные москитные сетки",
                        "description": "Вставные сетки для пластиковых окон",
                        "brand": {
                            "@type": "Brand",
                            "name": "Сетки21"
                        },
                        "category": "Москитные сетки",
                        "image": "https://setki21.ru/images/dev.png"
                    },
                    "price": "1800",
                    "priceCurrency": "RUB",
                    "availability": "https://schema.org/InStock",
                    "seller": {
                        "@type": "Organization",
                        "name": "Сетки21"
                    },
                    "url": "https://setki21.ru/vstavnye/"
                }
            },
            {
                "@type": "ListItem",
                "position": 5,
                "item": {
                    "@type": "Offer",
                    "itemOffered": {
                        "@type": "Service",
                        "name": "Ремонт москитных сеток",
                        "description": "Профессиональный ремонт любых повреждений",
                        "provider": {
                            "@type": "Organization",
                            "name": "Сетки21"
                        }
                    },
                    "price": "500",
                    "priceCurrency": "RUB",
                    "availability": "https://schema.org/InStock",
                    "seller": {
                        "@type": "Organization",
                        "name": "Сетки21"
                    },
                    "url": "https://setki21.ru/remont/"
                }
            }
        ]
    };

    // Добавляем микроразметку в head
    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.textContent = JSON.stringify(offersData);
    document.head.appendChild(script);
}); 