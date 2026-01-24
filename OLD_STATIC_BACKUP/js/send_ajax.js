$(document).ready(function () {
    $("#form").submit(function () {
		//alert($('#select').val()); return false;
		 $('input[name=formName]').val($('.putName').val());
		$('input[name=formEmail]').val($('.putEmail').val());
		$('input[name=formPhone]').val($('.putPhone').val());
		$('input[name=formAddress]').val($('.putAddress').val());
		$('input[name=formSelect]').val($('#select').val());
		$('textarea[name=formComment]').val($('.putComment').val());
        
        var formID = $('#form_calc');
        $.ajax({
            type: "POST",
            url: '/ajax/form_call_mail.php',
            data: formID.serialize(),
            success: function (data) {
                // Вывод текста результата отправки
                $("#form").html(data); 
            },
            error: function (jqXHR, text, error) {
                // Вывод текста ошибки отправки
                $("#form").html(error);         
            }
        });
        return false;
    });
});


/* $(document).ready(function () {
    $("#calculation form").submit(function () {
		alert("submit");
        // Получение ID формы
        var formID = $(this).attr('id');
        // Добавление решётки к имени ID
        var formNm = $('#' + formID);
        $.ajax({
            type: "POST",
            url: '/ajax/form_call_mail.php',
            data: formNm.serialize(),
            success: function (data) {
                // Вывод текста результата отправки
                $(formNm).html(data); 
            },
            error: function (jqXHR, text, error) {
                // Вывод текста ошибки отправки
                $(formNm).html(error);         
            }
        });
        return false;
    });
}); */