<?php

include_once './AjaxRequest.class.php';
include_once './Auth.class.php';

/**
* Класс ajax-авторизации
*
*/

class AuthorizationAjaxRequest extends AjaxRequest{

  // Массив доступных методов
  public $actions = array(
    "login" => "login",
    "logout" => "logout",
    "isAdmin" => "isAdmin",
  );

  /**
  *    Проверка - залогинен ли админ
  */
  public function isAdmin(){
    if ($_SERVER["REQUEST_METHOD"] !== "POST"){
      //Method not allowed
      http_response_code(405);
      header("Allow: POST");
      $this->setFieldError("main", "Method Not Allowed");
      return;
    }
    if (!empty($_SESSION["user_id"])){
      return (bool) $_SESSION["user_id"];
    }
  }

  /**
  *    Авторизация
  */
  public function login(){
    if ($_SERVER["REQUEST_METHOD"] !== "POST"){
      //Method not allowed
      http_response_code(405);
      header("Allow: POST");
      $this->setFieldError("main", "Method Not Allowed");
      return;
    }
    setcookie("sid","");

    $username = $this->getRequestParam("username");
    $password = $this->getRequestParam("password");
    $remember = !!$this->getRequestParam("remember-me");

    if(empty($username)){
      $this->setFieldError("username", "Enter the username");
      return;
    }

    if(empty($password)){
      $this->setFieldError("password", "Enter the password");
    }

    $user = new User();
    $auth_result = $user->authorize($username, $password, $remember);

    if (!$auth_result) {
        $this->setFieldError("password", "Invalid username or password");
        return;
    }

    $this->status = "ok";
    $this->message = sprintf("Hello, %s! Access granted.", $username);

  }

  /**
  *    Разлогинивание
  */
  public function logout(){
    if ($_SERVER["REQUEST_METHOD"] !== "POST") {
        // Method Not Allowed
        http_response_code(405);
        header("Allow: POST");
        $this->setFieldError("main", "Method Not Allowed");
        return;
    }

    setcookie("sid", "");

    $user = new User();
    $user->logout();

    $this->setResponse("logout", "success");
    $this->status = "ok";
  }

  
}
