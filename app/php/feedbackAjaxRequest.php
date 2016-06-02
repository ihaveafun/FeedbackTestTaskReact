<?php

include_once './AjaxRequest.class.php';
include_once './Auth.class.php';
include_once './db/db.php';

/**
* Класс ajax-обмена данными
*
*/

class feedbackAjaxRequest extends AjaxRequest{

  // Доступные методы
  public $actions = array(
    "add" => "add",
    "status" => "status",
    "edit" => "edit",
    "del" => "del",
    "getAll" => "getAll",
  );

  /*
   *    Добавление сообщения
   */
  public function add(){
    if ($_SERVER["REQUEST_METHOD"] !== "POST"){
      //Method not allowed
      http_response_code(405);
      header("Allow: POST");
      $this->setFieldError("main", "Method Not Allowed");
      return;
    }
    $name = htmlentities($this->getRequestParam("name"));
    $email = htmlentities($this->getRequestParam("email"));
    $text = htmlentities($this->getRequestParam("text"));
    $date = htmlentities($this->getRequestParam("date"));
    $file = $this->getRequestParam("file");

    if( MessagesDB::addRow(array('name' => $name, 'email' => $email, 'text' => $text, 'date' => $date, 'file' => $file, 'approved' => 0)) )
    {
      $this->status = "ok";
      $this->message = "message saved";

    }else{
      $this->status = "err";
      $this->message = "database error";
    }
  }

  /*
   *     Изменение статуса сообщения
   */
  public function status(){
    if ($_SERVER["REQUEST_METHOD"] !== "POST"){
      //Method not allowed
      http_response_code(405);
      header("Allow: POST");
      $this->setFieldError("main", "Method Not Allowed");
      return;
    }
    $user = new User();
    $isAdmin = $user->isAuthorized();
    if(!$isAdmin){
      http_response_code(401);
      header("HTTP/1.1 401 Unauthorized");
      $this->setFieldError("main", "Access Denied");
      return;
    }
    $id = (int)htmlentities($this->getRequestParam("id"));
    $approved = (int)htmlentities($this->getRequestParam("approved"));
    if (MessagesDB::SetMessageStatus($id, $approved)){
      $this->status = "ok";
      $this->message = "status changed";
    }else{
      $this->status = "err";
      $this->message = "database error";
    }
  }

  /*
   *     Редактирование сообщения
   */
  public function edit(){
    if ($_SERVER["REQUEST_METHOD"] !== "POST"){
      //Method not allowed
      http_response_code(405);
      header("Allow: POST");
      $this->setFieldError("main", "Method Not Allowed");
      return;
    }
    $user = new User();
    $isAdmin = $user->isAuthorized();
    if(!$isAdmin){
      http_response_code(401);
      header("HTTP/1.1 401 Unauthorized");
      $this->setFieldError("main", "Access Denied");
      return;
    }
    $id = (int)htmlentities($this->getRequestParam("id"));
    $text = htmlentities($this->getRequestParam("text"));
    if (MessagesDB::SetMessageNewText($id, $text)){
      $this->status = "ok";
      $this->message = "text changed";
    }else{
      $this->status = "err";
      $this->message = "database error";
    }
  }

  /*
   *     Удаление сообщения
   */
  public function del(){
    if ($_SERVER["REQUEST_METHOD"] !== "POST"){
      //Method not allowed
      http_response_code(405);
      header("Allow: POST");
      $this->setFieldError("main", "Method Not Allowed");
      return;
    }
    $user = new User();
    $isAdmin = $user->isAuthorized();
    if(!$isAdmin){
      http_response_code(401);
      header("HTTP/1.1 401 Unauthorized");
      $this->setFieldError("main", "Access Denied");
      return;
    }
    $id = (int)htmlentities($this->getRequestParam("id"));
    if (MessagesDB::DeleteMessage($id)){
      $this->status = "ok";
      $this->message = "message deleted";
    }else{
      $this->status = "err";
      $this->message = "database error";
    }
  }


  /*
   *    Получение всех сообщений
   */
  public function getAll(){
    if ($_SERVER["REQUEST_METHOD"] !== "POST"){
      //Method not allowed
      http_response_code(405);
      header("Allow: POST");
      $this->setFieldError("main", "Method Not Allowed");
      return;
    }

    $this->data = json_encode(MessagesDB::GetAll(), JSON_NUMERIC_CHECK);
    $this->status = "ok";
    $this->message = "ok";
  }

}
