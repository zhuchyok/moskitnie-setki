// Микроразметка статьи для SEO
document.addEventListener('DOMContentLoaded', function() {
    const articleData = {
        "@context": "https://schema.org",
        "@type": "Article",
        "headline": "Москитные сетки в Чебоксарах - защита от насекомых и животных",
        "description": "Профессиональное производство и установка москитных сеток в Чебоксарах и Новочебоксарске. Сетки антикошка, антипыль, антимошка с гарантией качества.",
        "image": [
            "https://setki21.ru/images/logo.png",
            "https://setki21.ru/images/doors.png",
            "https://setki21.ru/upload/iblock/6ec/6ecd680a4de616cd7a4118fe7c4e82ae.png"
        ],
        "author": {
            "@type": "Organization",
            "name": "Сетки21",
            "url": "https://setki21.ru"
        },
        "publisher": {
            "@type": "Organization",
            "name": "Сетки21",
            "logo": {
                "@type": "ImageObject",
                "url": "https://setki21.ru/images/logo.png"
            }
        },
        "datePublished": "2024-01-01",
        "dateModified": "2024-12-19",
        "mainEntityOfPage": {
            "@type": "WebPage",
            "@id": "https://setki21.ru"
        },
        "articleSection": "Москитные сетки",
        "keywords": "москитные сетки, сетки антикошка, сетки антипыль, сетки антимошка, установка москитных сеток, Чебоксары, Новочебоксарск",
        "inLanguage": "ru-RU",
        "wordCount": "1500",
        "articleBody": "Москитные сетки являются незаменимым элементом защиты жилых помещений от насекомых, пыли и домашних животных. В Чебоксарах и Новочебоксарске компания Сетки21 предлагает полный спектр услуг по производству и установке качественных москитных сеток. Наши специалисты используют современные материалы и технологии для создания надежной защиты вашего дома. Мы предлагаем различные типы сеток: стандартные антимошка, прочные антикошка для защиты от домашних животных, и специальные антипыль для защиты от пыли и тополиного пуха. Все работы выполняются с гарантией качества и бесплатным замером.",
        "mentions": [
            {
                "@type": "Product",
                "name": "Сетка антикошка",
                "url": "https://setki21.ru/antikoshka/"
            },
            {
                "@type": "Product",
                "name": "Сетка антипыль",
                "url": "https://setki21.ru/antipyl/"
            },
            {
                "@type": "Product",
                "name": "Сетка антимошка",
                "url": "https://setki21.ru/antimoshka/"
            }
        ]
    };

    // Добавляем микроразметку в head
    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.textContent = JSON.stringify(articleData);
    document.head.appendChild(script);
}); 