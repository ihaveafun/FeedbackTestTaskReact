<?php

include_once './feedbackAjaxRequest.php';

/**
* Файл для ajax-получения и отправки данных
*
*/

if (!empty($_COOKIE['sid'])) {
    // check session id in cookies
    session_id($_COOKIE['sid']);
}
session_start();

$ajaxRequest = new feedbackAjaxRequest($_REQUEST);
$ajaxRequest->showResponse();
