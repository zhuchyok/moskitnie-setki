<?php

$email = 'sloboda@100kna.ru'; // почта на которую отправлять


$send .= $_POST['list_order'] . "<br><hr><br>";

$send .= "Стоимость всех сеток - " . $_POST['total_price_value'] . "<br>";
$send .= "Дополнительно " . $_POST['total_order_value'] . "<br><br><hr><br>";

$send .= "Указал размеры - " . $_POST['formSelect'] . "<br>";
$send .= "Имя - " . $_POST['formName'] . "<br>";
$send .= "Телефон - " . $_POST['formPhone'] . "<br>";
$send .= "Email - " . $_POST['formEmail'] . "<br>";
$send .= "Адрес - " . $_POST['formAddress'] . "<br>";
$send .= "Коментарий - " . $_POST['formComment'] . "<br>";


$headers  = 'MIME-Version: 1.0' . "\r\n";
$headers .= 'Content-type: text/html; charset=utf-8' . "\r\n";
$headers .= 'From: noreply@'.$_SERVER['HTTP_HOST']. "\r\n";

@mail($email, 'Заявка москитные сетки Антикошка', $send, $headers);



echo '<p class="success">Спасибо! <br>Мы обязательно с вами свяжемся!</p>
			<button data-remodal-action="cancel" class="btn">ЗАКРЫТЬ</button>';

?>