<?php

//include_once './../Auth.class.php';

/**
* Класс для работы с базой данных
*
*
*/

class MessagesDB {

  // параметры подключения
  protected static $base = 'mysql:host=192.168.137.106;port=3306;dbname=db1082774_test';
  protected static $user = 'u1082774_test';
  protected static $psw = 'XFqytMCIPlR;h8,&';


  /**
  * Получение всех сообщений
  * Если не залогинен админ, то возвращается массив только одобренных администратором сообщений, где approved=1
  */
  public static function GetAll(){

    $user = new User();
    $isAdmin = $user->isAuthorized();

    $arr = Array();

    try {
      $db = new PDO (MessagesDB::$base, MessagesDB::$user, MessagesDB::$psw);
      $db->query('SET CHARACTER SET utf8');
      $query = $isAdmin ? 'SELECT * FROM messages' : 'SELECT * FROM messages WHERE approved=1';
      foreach($db->query($query, PDO::FETCH_ASSOC) as $row) {
        $arr[] = $row;
      }
      $arr[] = Array("isAdmin" => $isAdmin);
      $db = null;
    } catch (PDOException $e) {
      die();
    }

    return($arr);

  }


  /**
  * Изменение статуса сообщения (только для администратора)
  * $id - идентификатор сообщения
  * $status - новый статус сообщения
  * Коды статусов:
  *     0 - не определен, новое сообщение
  *     1 - сообщение принято
  *     2 - сообщение отвергнуто
  * Если не залогинен админ, то возвращается false
  */
  public static function SetMessageStatus($id, $status){

    $user = new User();
    $isAdmin = $user->isAuthorized();

    if (!$isAdmin) return(false);

    try {
      $db = new PDO (MessagesDB::$base, MessagesDB::$user, MessagesDB::$psw);
      $db->query('SET CHARACTER SET utf8');
      $statement = $db->prepare('UPDATE messages SET approved=:approved WHERE id=:id');
      $statement->bindParam(':approved', $status);
      $statement->bindParam(':id', $id);
      $result = $statement->execute();
      $db = null;
    } catch (PDOException $e) {
      die();
    }

    return($result);

  }


  /**
  * Изменение текста сообщения (только для администратора)
  * $id - идентификатор сообщения
  * $text - новый текст сообщения
  * Так же устанавливается поле edited в 1, показывающее, что сообщение редактировалось
  * Если не залогинен админ, то возвращается false
  */
  public static function SetMessageNewText($id, $text){

    $user = new User();
    $isAdmin = $user->isAuthorized();
    $edited = 1;

    if (!$isAdmin) return(false);

    try {
      $db = new PDO (MessagesDB::$base, MessagesDB::$user, MessagesDB::$psw);
      $db->query('SET CHARACTER SET utf8');
      $statement = $db->prepare('UPDATE messages SET text=:text, edited=:edited WHERE id=:id');
      $statement->bindParam(':text', $text);
      $statement->bindParam(':edited', $edited);
      $statement->bindParam(':id', $id);
      $result = $statement->execute();
      $db = null;
    } catch (PDOException $e) {
      die();
    }
    return($result);
  }


  /**
  * Удаление записи сообщения (только для администратора)
  * $id - идентификатор сообщения
  * Если не залогинен админ, то возвращается false
  */
  public static function DeleteMessage($id){

    $user = new User();
    $isAdmin = $user->isAuthorized();

    if (!$isAdmin) return(false);

    try {
      $db = new PDO (MessagesDB::$base, MessagesDB::$user, MessagesDB::$psw);
      $db->query('SET CHARACTER SET utf8');
      $statement = $db->prepare('DELETE FROM messages WHERE id=:id');
      $statement->bindParam(':id', $id);
      $result = $statement->execute();
      $db = null;
    } catch (PDOException $e) {
      die();
    }
    return($result);
  }

  /**
  * Добавление новой записи сообщения
  * $data - массив с данными сообщения
  */
  public static function addRow($data){
    try {
      $db = new PDO (MessagesDB::$base, MessagesDB::$user, MessagesDB::$psw);
      $db->query('SET CHARACTER SET utf8');
      $statement = $db->prepare('INSERT INTO messages SET name=:name, email=:email, text=:text, date=:date, file=:file, approved=:approved');
      $result = $statement->execute($data);
      $db = null;
    } catch (PDOException $e) {
      die();
    }
    return ($result);
  }


}

// echo"<pre>";
// print_r(MessagesDB::DeleteMessage(40));
// echo"<pre>";

// echo"<pre>";
// print_r(MessagesDB::SetMessageNewText(40, "------------"));
// echo"<pre>";

// echo"<pre>";
// print_r(MessagesDB::addRow(array(':name' => 'testname', ':email' => 'testemail', 'text' => 'текст', 'date' => 1464151436837, 'approved' => 0)));
// echo"<pre>";

// echo"<pre>";
// print_r(MessagesDB::GetAll());
// echo"<pre>";
