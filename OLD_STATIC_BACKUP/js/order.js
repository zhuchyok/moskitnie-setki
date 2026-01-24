// order.js — Единый заказ для всех калькуляторов
(function() {
  const ORDER_KEY = 'moskitka_order';

  function getOrder() {
    try {
      return JSON.parse(localStorage.getItem(ORDER_KEY)) || [];
    } catch (e) {
      return [];
    }
  }

  function saveOrder(order) {
    localStorage.setItem(ORDER_KEY, JSON.stringify(order));
  }

  function addToOrder(item) {
    const order = getOrder();
    order.push(item);
    saveOrder(order);
    renderOrderBlock();
  }

  function removeFromOrder(index) {
    const order = getOrder();
    order.splice(index, 1);
    saveOrder(order);
    renderOrderBlock();
  }

  function clearOrder() {
    saveOrder([]);
    renderOrderBlock();
  }

  function renderOrderBlock() {
    const order = getOrder();
    const table = document.querySelector('.list_order_table table');
    if (!table) return;
    table.innerHTML = '';
    let total = 0;
    order.forEach(function(item, idx) {
      total += parseInt(item.price);
      let row = document.createElement('tr');
      let typeText = item.type.startsWith('Полотно') ? item.type : 'Полотно ' + item.type;
      let colorText = (typeText.toLowerCase().includes('рамка')) ? '' : `${item.color.toLowerCase()} рамка - `;
      row.innerHTML = `
  <td>
    <div style="display: flex; align-items: center; justify-content: space-between; gap: 10px;">
      <span style="flex:1;">
        ${idx+1}. ${typeText} - ${colorText}${item.width}x${item.height} мм - ${item.qty} шт - <span class='price_item_rub'><span class='price_item'>${item.price}</span> Р</span>
      </span>
      <button class='order-remove-btn' data-idx='${idx}'>УДАЛИТЬ</button>
    </div>
  </td>
`;
      table.appendChild(row);
    });
    // total price
    const totalPriceSpan = document.querySelector('.total_price span');
    if (totalPriceSpan) totalPriceSpan.textContent = total;
    const totalPriceInput = document.getElementById('total_price_value');
    if (totalPriceInput) totalPriceInput.value = total;
    // remove buttons
    document.querySelectorAll('.order-remove-btn').forEach(function(btn) {
      btn.onclick = function() {
        removeFromOrder(parseInt(btn.getAttribute('data-idx')));
      };
    });
  }

  // При загрузке страницы — отрисовать заказ
  document.addEventListener('DOMContentLoaded', renderOrderBlock);
  window.addEventListener('remodal-open', renderOrderBlock);

  // Экспортируем для использования в калькуляторах
  window.Order = {
    getOrder, addToOrder, removeFromOrder, clearOrder, renderOrderBlock
  };

  // При формировании заказа для отправки по почте — убираем кнопки 'Удалить'
  window.Order.getOrderTextForMail = function() {
    const table = document.querySelector('.list_order_table table');
    if (!table) return '';
    // Копируем HTML, убираем все кнопки
    let html = table.innerHTML;
    // Удаляем все <button ...>Удалить</button>
    html = html.replace(/<button[^>]*>Удалить<\/button>/g, '');
    // Можно дополнительно убрать лишние пробелы/атрибуты
    return html;
  };
})(); 