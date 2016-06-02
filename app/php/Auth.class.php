<?php

//namespace Auth;

/**
* Класс для работы с пользователями
* Пределка для одного админа
*
*
*/

class User
{
  private $username;
  private $is_authorized = false;

  private $salt;
  private $password;  //hash
  private $user_id;

  public function __construct(){
    $this->username = "admin";
    //$this->password = "a2e3e4fdfc2e7a883620d9b1bf1ec3ae5bf4e0b1ebc79748caab5cf18122ddab";//noentrance
    $this->password = "5fcdb149e1a6ae7a40fc32e8bb2f2a3c7e25364bb255563188c8210cc82c8f89"; // 123
    $this->salt = "in voluptate velit esse cillum dolore eu fugiat nulla pariatur";
    $this->user_id = 1;
  }

  // проверка в данном случае на админа
  public static function isAuthorized(){
    if (!empty($_SESSION["user_id"])){
      return (bool) $_SESSION["user_id"];
    }
    return false;
  }

  // Hash пароля
  public function passwordHash($password, $salt = null){
    $salt || $salt = uniqid();
    $hash = hash_hmac("sha256", ($password . $salt), $salt);
    for ($i = 0; $i < $iterations; ++$i){
      $hash = md5(md5(sha1($hash)));
    }
    return array('hash' => $hash, 'salt' => $salt);
  }

  public function getSalt(/*$username*/){
    return $this->salt;
  }

  // Авторизация
  public function authorize($username, $password, $remember = false){
    $salt = $this->getSalt();
    if (!$salt) {
      return false;
    }
    $hashes = $this->passwordHash($password, $salt);
    if(($this->username == $username) && ($this->password == $hashes['hash'])){
      $this->is_authorized = true;
      $this->saveSession($remember);
    }else{
      $this->is_authorized = false;
    }
    return $this->is_authorized;
  }

  // Разлогинивание
  public function logout(){
    if (!empty($_SESSION["user_id"])) {
        unset($_SESSION["user_id"]);
    }
  }

  // Сохранение сессии
  public function saveSession($remember = false, $days = 7){
    $_SESSION["user_id"] = $this->user_id;

    if ($remember) {
        $sid = session_id();

        $expire = time() + $days * 24 * 3600;
        $domain = "";
        $secure = false;
        $path = "/";

        $cookie = setcookie("sid", $sid, $expire, $path, $domain, $secure, true);
    }
  }

}
