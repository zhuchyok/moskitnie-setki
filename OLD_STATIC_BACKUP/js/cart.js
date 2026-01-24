// Корзина для всех калькуляторов
(function() {
  const CART_KEY = 'moskitka_cart';

  // Получить корзину из localStorage
  function getCart() {
    try {
      return JSON.parse(localStorage.getItem(CART_KEY)) || [];
    } catch (e) {
      return [];
    }
  }

  // Сохранить корзину в localStorage
  function saveCart(cart) {
    localStorage.setItem(CART_KEY, JSON.stringify(cart));
  }

  // Добавить товар в корзину
  function addToCart(item) {
    const cart = getCart();
    cart.push(item);
    saveCart(cart);
    updateCartIcon();
  }

  // Удалить товар по индексу
  function removeFromCart(index) {
    const cart = getCart();
    cart.splice(index, 1);
    saveCart(cart);
    updateCartIcon();
  }

  // Очистить корзину
  function clearCart() {
    saveCart([]);
    updateCartIcon();
  }

  // Получить количество товаров
  function getCartCount() {
    return getCart().length;
  }

  // Обновить иконку-счётчик
  function updateCartIcon() {
    let icon = document.getElementById('cart-icon');
    let count = getCartCount();
    if (!icon) {
      icon = document.createElement('div');
      icon.id = 'cart-icon';
      icon.style.position = 'fixed';
      icon.style.top = '20px';
      icon.style.right = '20px';
      icon.style.background = '#fff';
      icon.style.border = '2px solid #333';
      icon.style.borderRadius = '50%';
      icon.style.width = '48px';
      icon.style.height = '48px';
      icon.style.display = 'flex';
      icon.style.alignItems = 'center';
      icon.style.justifyContent = 'center';
      icon.style.cursor = 'pointer';
      icon.style.zIndex = '9999';
      icon.innerHTML = '<span style="font-size:24px;">🛒</span><span id="cart-count" style="position:absolute;top:5px;right:5px;background:#e00;color:#fff;border-radius:50%;padding:2px 6px;font-size:14px;">'+count+'</span>';
      document.body.appendChild(icon);
      icon.addEventListener('click', showCartModal);
    } else {
      let countSpan = icon.querySelector('#cart-count');
      if (countSpan) countSpan.textContent = count;
    }
  }

  // Показать модальное окно корзины
  function showCartModal() {
    let modal = document.getElementById('cart-modal');
    if (!modal) {
      modal = document.createElement('div');
      modal.id = 'cart-modal';
      modal.style.position = 'fixed';
      modal.style.top = '0';
      modal.style.left = '0';
      modal.style.width = '100vw';
      modal.style.height = '100vh';
      modal.style.background = 'rgba(0,0,0,0.5)';
      modal.style.display = 'flex';
      modal.style.alignItems = 'center';
      modal.style.justifyContent = 'center';
      modal.style.zIndex = '10000';
      modal.innerHTML = '<div id="cart-modal-content" style="background:#fff;padding:24px 32px;border-radius:12px;min-width:320px;max-width:90vw;max-height:90vh;overflow:auto;position:relative;"></div>';
      document.body.appendChild(modal);
      modal.addEventListener('click', function(e) {
        if (e.target === modal) modal.remove();
      });
    }
    renderCartModalContent();
    modal.style.display = 'flex';
  }

  // Отрисовать содержимое модального окна корзины
  function renderCartModalContent() {
    const cart = getCart();
    let content = document.getElementById('cart-modal-content');
    if (!content) return;
    let html = '<h2 style="margin-top:0;">Корзина</h2>';
    if (cart.length === 0) {
      html += '<p>Корзина пуста.</p>';
    } else {
      html += '<ul style="list-style:none;padding:0;">';
      cart.forEach(function(item, idx) {
        html += '<li style="margin-bottom:12px;border-bottom:1px solid #eee;padding-bottom:8px;">';
        html += '<b>' + (item.type || 'Сетка') + '</b> — ';
        html += (item.width ? item.width + 'x' + item.height + ' мм' : '');
        html += (item.color ? ' — ' + item.color : '');
        html += (item.qty ? ' — ' + item.qty + ' шт.' : '');
        html += (item.price ? ' — ' + item.price + ' ₽' : '');
        html += ' <button data-idx="'+idx+'" style="margin-left:8px;" class="cart-remove-btn">Удалить</button>';
        html += '</li>';
      });
      html += '</ul>';
      html += '<button id="cart-clear-btn">Очистить корзину</button> ';
      html += '<button id="cart-order-btn">Оформить заказ</button>';
    }
    html += '<button id="cart-close-btn" style="position:absolute;top:8px;right:8px;">✖</button>';
    content.innerHTML = html;
    // События
    content.querySelectorAll('.cart-remove-btn').forEach(function(btn) {
      btn.onclick = function() {
        removeFromCart(parseInt(btn.getAttribute('data-idx')));
        renderCartModalContent();
      };
    });
    let clearBtn = content.querySelector('#cart-clear-btn');
    if (clearBtn) clearBtn.onclick = function() { clearCart(); renderCartModalContent(); };
    let closeBtn = content.querySelector('#cart-close-btn');
    if (closeBtn) closeBtn.onclick = function() { document.getElementById('cart-modal').remove(); };
    let orderBtn = content.querySelector('#cart-order-btn');
    if (orderBtn) orderBtn.onclick = function() { alert('Здесь будет оформление заказа!'); };
  }

  // Экспортируем функции для использования в калькуляторах
  window.Cart = {
    getCart, addToCart, removeFromCart, clearCart, getCartCount, updateCartIcon
  };

  // Инициализация
  document.addEventListener('DOMContentLoaded', updateCartIcon);
})(); 