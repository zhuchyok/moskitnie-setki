function calc() {
  var area_doors = +$("#horizontal").val() * +$("#vertical").val();
  var radio_value = +$("#radio_value").val();
  var price;
  var index = 0;

  if (area_doors < 400000) index = 0;
  else if (area_doors < 500000) index = 1;
  else if (area_doors < 600000) index = 2;
  else if (area_doors < 700000) index = 3;
  else if (area_doors < 800000) index = 4;
  else if (area_doors < 900000) index = 5;
  else if (area_doors < 1000000) index = 6;
  else if (area_doors < 1100000) index = 7;
  else if (area_doors < 1200000) index = 8;
  else if (area_doors < 1300000) index = 9;
  else if (area_doors < 1400000) index = 10;
  else if (area_doors < 1500000) index = 11;
  else if (area_doors < 1600000) index = 12;
  else if (area_doors < 1700000) index = 13;
  else if (area_doors < 1800000) index = 14;
  else index = 15;

  var offset = (radio_value - 1) * 16;
  price = PRICES_REMONT[offset + index];

  $(".price span, .price-dynamic").text(price);
}

function add_order() {
  //$( ".list_order table" ).append( "<tr><td> 1. </td><td> Противомоскитная сетка Ремонт - </td><td> - белая рамка - </td><td> - 500x1200 мм - </td><td> - 2 ШТ - </td><td> - 1160 Р </td></tr>" );

  var color = $("#block_radio .item.active").text();
  var horizontal = $("#horizontal").val();
  var vertical = $("#vertical").val();
  var count = +$("#count").val();
  var price = +$(".price span").text();
  var fabricNames = ['Стандарт', 'Антимошка', 'Антикошка', 'Антипыль'];
  var fabricIndex = $("#radio_value").val() - 1;
  var type = fabricNames[fabricIndex] || 'Стандарт';
  var item = {
    type: type + ' - ремонт рамка',
    color: '',
    width: horizontal,
    height: vertical,
    qty: count,
    price: price * count
  };
  if (window.Order && typeof Order.addToOrder === 'function') Order.addToOrder(item);
  if (window.Order && typeof Order.renderOrderBlock === 'function') Order.renderOrderBlock();
}

(function ($) {
  $(function () {
    //$('input[type=radio]').styler({ //[type=checkbox]
    $("input, select").styler();
    //selectSearch: true,
  });
})(jQuery);

/* $('.mainButton').click(function(e) {
setTimeout( function() {
	  $('input, select').trigger('refresh');
	}, 100);
}); */

// Функция для автоматического определения размеров с минимальной ценой
function setMinimalSliderValues() {
  // Всегда выбираем стандартное полотно по умолчанию
  var minPrice = PRICES_REMONT[0]; // полотно стандарт, индекс 0
  var minPriceIndex = 0;
  
  // Устанавливаем размеры, которые гарантированно дают площадь < 400,000 мм²
  // Это обеспечивает попадание в индекс 0 (минимальная цена)
  var minHorizontal = 350;
  var minVertical = 1000;
  
  $("#slider-horizontal").slider("option", "value", minHorizontal);
  $("#slider-vertical").slider("option", "value", minVertical);
  $("#horizontal").val(minHorizontal);
  $("#vertical").val(minVertical);
  
  // Устанавливаем активный тип полотна с минимальной ценой
  var fabricIndex = (minPriceIndex / 16) + 1; // 1-стандарт, 2-антимошка, 3-антикошка, 4-антипыль
  $("#block_radio .item").removeClass("active");
  $("#block_radio .item[data-radio='" + fabricIndex + "']").addClass("active");
  $("#radio_value").val(fabricIndex);
  
  console.log("Автоматически выбрана минимальная цена:", minPrice, "для типа полотна с индексом", fabricIndex);
}

$(function () {
  $("#slider-horizontal").slider({
    orientation: "horizontal",
    animate: true,
    range: "min",
    value: 350,
    min: 200,
    max: 1500,
    step: 5,
    slide: function (event, ui) {
      //calc(ui.value);
      //console.log("--" + ui.value);
      $("#horizontal").val(ui.value);
      calc();
    },
  });

  $("#slider-vertical").slider({
    orientation: "vertical",
    animate: true,
    range: "min",
    min: 200,
    max: 2000,
    value: 1000,
    step: 5,
    slide: function (event, ui) {
      //calc(ui.value);
      $("#vertical").val(ui.value);
      calc();
    },
  });

  // Устанавливаем минимальные размеры для гарантии минимальной цены
  setMinimalSliderValues();

  $("#block_radio .item").on("click", function () {
    $("#block_radio .item.active").removeClass("active");
    $(this).addClass("active");
    $("#radio_value").val($(this).data("radio"));
    //$("#radio_value").val($(this).text());
    calc();
  });

  $(".add_order").on("click", function () {
    add_order();
    return false;
  });

  $(".delivery_block").click(function (e) {
    e.stopPropagation();
    //alert(e.target);
  });
  $("body").on("click", function (e) {
    $(".delivery_block").css("display", "none");
  });
  $(".choose").on("click", function (evt) {
    if ($(".delivery_block").css("display") == "none") {
      $(".delivery_block").css("display", "block");
    } else {
      $(".delivery_block").css("display", "none");
      return false;
    }

    $(".delivery_block").css("position", "absolute");

    evt = window.event ? window.event : evt;

    /*  $(".delivery_block").css("top", evt.pageY+15) //clientX
        $(".delivery_block").css("left", evt.pageX-50) //clientY */

    $(".delivery_block").css("top", this.offsetTop + 35); //clientX
    $(".delivery_block").css("left", this.offsetLeft); //clientY

    //var content_center = document.getElementById('content_center');
    /* var content_center = document.querySelector('.delivery_block');
		//var w = content_center.clientWidth;
		var w = content_center.offsetTop;
		alert(w); */

    //alert(evt.pageX +', '+ evt.pageY);
    return false;
  });

  $(".delivery_block input[type=radio]").on("change", function () {
    $(".delivery_price span").html($(".delivery_block input:checked").val());
    $(".total_order_price span").html($(".delivery_block input:checked").val());
    $("#total_order_value").val($(".delivery_block input:checked").val());
  });

  $(".clean_button").on("click", function () {
    if (window.Order && typeof Order.clearOrder === 'function') {
      Order.clearOrder();
    }
  });

  $(".form_show").on("click", function () {
    var list_order_textarea = $(".list_order_table").html();
    if (list_order_textarea.length > 0) {
      $(".list_order_textarea").val("\n" + list_order_textarea);
      var remodal = $("[data-remodal-id=modal]").remodal();
      remodal.open();
      setTimeout(function () {
        if (window.Order && typeof Order.renderOrderBlock === 'function') Order.renderOrderBlock();
        $("input, select").trigger("refresh");
      }, 100);
    } else {
      alert("Ваш заказ пуст!");
    }
  });

  $("#horizontal, #vertical").on("input keyup", function () {
    $("#slider-horizontal").slider("option", "value", $("#horizontal").val());
    $("#slider-vertical").slider("option", "value", $("#vertical").val());
    calc();
  });

  $("#count").on("change", function () {
    var count_val = $("#count").val();
    if (count_val < 1) {
      $("#count").val("1");
      return false;
    }
  });

  jQuery(function ($) {
    $(".putPhone").mask("+7 (999) 999-99-99");
  });

  calc();
});
