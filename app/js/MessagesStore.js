import {EventEmitter} from "events";
import dispatcher from "./dispatcher";

import Ajax from "./Ajax";

// ------------------------------------------------
//
//              Хранилище сообщений
//
// ------------------------------------------------

class MessagesStore extends EventEmitter {

  /* Варианты значения поля approved
  static NEW_MESSAGE = 0;
  static APPROVED_MESSAGE = 1;
  static REJECTED_MESSAGE = 2; */


  constructor() {
    super();
    this.messages = []; // Массив с сообщениями
    this.isAdmin = false; // Выводить ли модерирующие элементы для сообщений

    //Начальная загрузка всех сообщений
    const act="getAll";
    let aj = new Ajax("php/post.php");
    aj.Post({act}, (response) => {
      let res = JSON.parse(response);
      if (res.status == "ok"){
        let data = JSON.parse(res.data);
        this.isAdmin = data.pop().isAdmin;
        this.messages = data;
        this.emit("redraw");
      }
    });

    /* массив для отладки */
    // this.messages = [
    //   {name:"Антон Федоров", email:"den@noreply.ru", text: "Сообщение", date: 1464071817875, id: 1, approved: 1, edited: 0},
    //   {name:"Иван Федоров", email:"zzz@noreply.ru", text: "Другое сообщение", date: 1464072533057, id: 2, approved: 1, edited: 0},
    //   {name:"Руслан Федоров", email:"abc@noreply.ru", text: "Третье сообщение", date: 1464072622716, id: 3, approved: 1, edited: 0},
    //   {name:"Иван Федоров", email:"cde@noreply.ru", text: "Еще одно сообщение", date: 1464151436837, id: 4, approved: 0, edited: 1},
    //   {name:"Robot Kerks", email:"robot@robots.rob", text: "1094809384093219", date: 1464151436838, id: 5, approved: 2, edited: 0},
    // ];
  }


  // Отправка сообщения на сервер
  createMessage(name, email, text, file){
    const date = Date.now();
    const act = "add";
    let aj = new Ajax("php/post.php");
    aj.Post({name, email, text, date, file, act}, (response) => {
      let res = JSON.parse(response);
      if (res.status == "ok"){
        this.emit("msg_sent");
        if(this.isAdmin) this.loadAll();
        // Останавливаем индикацию загрузки (emit("msg_sent")) и если залогинен администратор, перезагружаем сообщения
      }
    });
  }

  // Получение всех сообщений из хранилища (без участия сервера)
  getAll() {
    return this.messages;
  }

  // Получение всех сообщений с загрузкой с сервера
  loadAll() {
    const act="getAll";
    let aj = new Ajax("php/post.php");
    aj.Post({act}, (response) => {
      let res = JSON.parse(response);
      if (res.status == "ok"){
        let data = JSON.parse(res.data);
        this.isAdmin = data.pop().isAdmin;
        this.messages = data;
        this.emit("redraw");
      }
    });
  }

  // Обработка событий Flux
  handleActions(action){
    switch (action.type){
      // Новое сообщение
      case "CREATE_MSG":{
        this.createMessage(action.name, action.email, action.text, action.file);
      }
      break;
      // Загрузка сообщений с сервера
      case "RELOAD_ALL":{
        this.loadAll();
      }
      break;
    }
  }

}

const msgStore = new MessagesStore;
dispatcher.register(msgStore.handleActions.bind(msgStore));

export default msgStore;
