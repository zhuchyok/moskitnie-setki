// Хлебные крошки для SEO
function addBreadcrumbs() {
    const currentPath = window.location.pathname;
    const breadcrumbsContainer = document.createElement('div');
    breadcrumbsContainer.className = 'breadcrumbs';
    breadcrumbsContainer.style.cssText = `
        background: #f8f9fa;
        padding: 10px 0;
        margin-bottom: 20px;
        border-bottom: 1px solid #e9ecef;
        font-size: 14px;
    `;
    
    const container = document.createElement('div');
    container.className = 'container';
    container.style.cssText = `
        max-width: 1020px;
        margin: 0 auto;
        padding: 0 15px;
    `;
    
    let breadcrumbsHTML = '<span itemscope itemtype="https://schema.org/BreadcrumbList">';
    breadcrumbsHTML += '<span itemprop="itemListElement" itemscope itemtype="https://schema.org/ListItem">';
    breadcrumbsHTML += '<a href="/" itemprop="item" style="color: #2A6AB2; text-decoration: none;">';
    breadcrumbsHTML += '<span itemprop="name">Главная</span></a>';
    breadcrumbsHTML += '<meta itemprop="position" content="1" />';
    breadcrumbsHTML += '</span>';
    
    let position = 2;
    let currentUrl = '';
    
    // Определяем текущую страницу
    if (currentPath === '/') {
        breadcrumbsHTML += ' / <span itemprop="name">Москитные сетки</span>';
    } else if (currentPath.includes('/antikoshka/')) {
        breadcrumbsHTML += ' / <span itemprop="itemListElement" itemscope itemtype="https://schema.org/ListItem">';
        breadcrumbsHTML += '<a href="/antikoshka/" itemprop="item" style="color: #2A6AB2; text-decoration: none;">';
        breadcrumbsHTML += '<span itemprop="name">Антикошка</span></a>';
        breadcrumbsHTML += '<meta itemprop="position" content="' + position + '" />';
        breadcrumbsHTML += '</span>';
    } else if (currentPath.includes('/antipyl/')) {
        breadcrumbsHTML += ' / <span itemprop="itemListElement" itemscope itemtype="https://schema.org/ListItem">';
        breadcrumbsHTML += '<a href="/antipyl/" itemprop="item" style="color: #2A6AB2; text-decoration: none;">';
        breadcrumbsHTML += '<span itemprop="name">Антипыль</span></a>';
        breadcrumbsHTML += '<meta itemprop="position" content="' + position + '" />';
        breadcrumbsHTML += '</span>';
    } else if (currentPath.includes('/antimoshka/')) {
        breadcrumbsHTML += ' / <span itemprop="itemListElement" itemscope itemtype="https://schema.org/ListItem">';
        breadcrumbsHTML += '<a href="/antimoshka/" itemprop="item" style="color: #2A6AB2; text-decoration: none;">';
        breadcrumbsHTML += '<span itemprop="name">Антимошка</span></a>';
        breadcrumbsHTML += '<meta itemprop="position" content="' + position + '" />';
        breadcrumbsHTML += '</span>';
    } else if (currentPath.includes('/vstavnye/')) {
        breadcrumbsHTML += ' / <span itemprop="itemListElement" itemscope itemtype="https://schema.org/ListItem">';
        breadcrumbsHTML += '<a href="/vstavnye/" itemprop="item" style="color: #2A6AB2; text-decoration: none;">';
        breadcrumbsHTML += '<span itemprop="name">Вставные сетки VSN</span></a>';
        breadcrumbsHTML += '<meta itemprop="position" content="' + position + '" />';
        breadcrumbsHTML += '</span>';
    } else if (currentPath.includes('/remont/')) {
        breadcrumbsHTML += ' / <span itemprop="itemListElement" itemscope itemtype="https://schema.org/ListItem">';
        breadcrumbsHTML += '<a href="/remont/" itemprop="item" style="color: #2A6AB2; text-decoration: none;">';
        breadcrumbsHTML += '<span itemprop="name">Ремонт сеток</span></a>';
        breadcrumbsHTML += '<meta itemprop="position" content="' + position + '" />';
        breadcrumbsHTML += '</span>';
    } else if (currentPath.includes('/privacy/')) {
        breadcrumbsHTML += ' / <span itemprop="itemListElement" itemscope itemtype="https://schema.org/ListItem">';
        breadcrumbsHTML += '<a href="/privacy/" itemprop="item" style="color: #2A6AB2; text-decoration: none;">';
        breadcrumbsHTML += '<span itemprop="name">Политика конфиденциальности</span></a>';
        breadcrumbsHTML += '<meta itemprop="position" content="' + position + '" />';
        breadcrumbsHTML += '</span>';
    }
    
    breadcrumbsHTML += '</span>';
    
    container.innerHTML = breadcrumbsHTML;
    breadcrumbsContainer.appendChild(container);
    
    // Вставляем хлебные крошки после header
    const header = document.getElementById('header');
    if (header) {
        header.parentNode.insertBefore(breadcrumbsContainer, header.nextSibling);
    }
}

// Добавляем хлебные крошки при загрузке страницы
document.addEventListener('DOMContentLoaded', addBreadcrumbs); 