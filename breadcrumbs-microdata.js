// Микроразметка хлебных крошек для SEO
document.addEventListener('DOMContentLoaded', function() {
    // Определяем текущую страницу
    const currentPath = window.location.pathname;
    let breadcrumbData = {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        "itemListElement": [
            {
                "@type": "ListItem",
                "position": 1,
                "name": "Главная",
                "item": "https://setki21.ru"
            }
        ]
    };

    // Добавляем страницы в зависимости от текущего пути
    if (currentPath.includes('/antikoshka/')) {
        breadcrumbData.itemListElement.push({
            "@type": "ListItem",
            "position": 2,
            "name": "Сетка антикошка",
            "item": "https://setki21.ru/antikoshka/"
        });
    } else if (currentPath.includes('/antipyl/')) {
        breadcrumbData.itemListElement.push({
            "@type": "ListItem",
            "position": 2,
            "name": "Сетка антипыль",
            "item": "https://setki21.ru/antipyl/"
        });
    } else if (currentPath.includes('/antimoshka/')) {
        breadcrumbData.itemListElement.push({
            "@type": "ListItem",
            "position": 2,
            "name": "Сетка антимошка",
            "item": "https://setki21.ru/antimoshka/"
        });
    } else if (currentPath.includes('/vstavnye/')) {
        breadcrumbData.itemListElement.push({
            "@type": "ListItem",
            "position": 2,
            "name": "Вставные москитные сетки",
            "item": "https://setki21.ru/vstavnye/"
        });
    } else if (currentPath.includes('/remont/')) {
        breadcrumbData.itemListElement.push({
            "@type": "ListItem",
            "position": 2,
            "name": "Ремонт москитных сеток",
            "item": "https://setki21.ru/remont/"
        });
    } else if (currentPath.includes('/privacy/')) {
        breadcrumbData.itemListElement.push({
            "@type": "ListItem",
            "position": 2,
            "name": "Политика конфиденциальности",
            "item": "https://setki21.ru/privacy/"
        });
    }

    // Добавляем микроразметку в head
    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.textContent = JSON.stringify(breadcrumbData);
    document.head.appendChild(script);
}); 