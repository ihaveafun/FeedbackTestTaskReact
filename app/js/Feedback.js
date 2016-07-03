import React from "react";
import ReactDOM from "react-dom";

import Grid from 'react-bootstrap/lib/Grid';
import Row from 'react-bootstrap/lib/Row';
import Col from 'react-bootstrap/lib/Col';
import Collapse from 'react-bootstrap/lib/Collapse';

import Label from 'react-bootstrap/lib/Label';

import "./../sass/bootstrap.scss";

import Message from "./Message";
import SortLabel from "./FormControls/SortLabel";
import PreviewMessage from "./PreviewMessage";
import Form from "./Form";
import AuthForm from "./AuthForm";
import Ajax from "./Ajax";
import * as Actions from "./Actions";
import MessagesStore from "./MessagesStore"


// ------------------------------------------------
//
//              ФОРМА АВТОРИЗАЦИИ
//              Главный копонент
//
// ------------------------------------------------

export default class Feedback extends React.Component {
//4;;4
  constructor(){
    super();

    // Начальное состояние компонента
    this.state = {
      // Состояние авторизации
      isAuthorized: false,
      // Все сообщения
      messages: MessagesStore.getAll(),
      // Состояние предпросмотра
      previewVisible: false,
      previewMessage: {name:"Ваше имя", email: "noreply@noreply.com", text:"Текст вашего сообщения"},
      // Состояние сортировки
      sort: {type: "date", reverse: true},
      // картинка выбранная в форме
      img: null,
    }

  }

  componentWillMount(){
    // Реакция на событие от MessagesStore "перерисовать все сообщения"
    MessagesStore.on("redraw", () => {
      this.setState({
        messages: MessagesStore.getAll(),
        isAuthorized: MessagesStore.isAdmin,
      });
    });
    // Реакция на событие от MessagesStore "сообщение отправлено"
    // Обнуляем предпросмотр
    MessagesStore.on("msg_sent", () => {
      this.setState({ previewVisible: false, previewMessage: {name:"Ваше имя", email: "noreply@noreply.com", text:"Текст вашего сообщения"}, img: null,});
    });
  }

  // Обработка включения/выключения предпросмотра сообщения
  handlePreviewVisible(e){
    this.setState({previewVisible: e.target.checked});
  }

  // Связывание редактирование полей формы и предпросмотра
  handlePreviewMessage(type, data){
    this.state.previewMessage[type] = data;
    this.setState({previewMessage: this.state.previewMessage });
  }

  // Картика из формы
  handleImgSelected(img){
    this.setState({img});
  }

  // Изменение состояния сортировки
  handleSort(type, reverse){
    this.setState({
      sort: {type, reverse,},
    });
  }

  // Модерация, сообщение принято
  handleMessageAccept(idx){
    // для скорости реакции, изменяем сразу, потом проверяем, удалось ли загрузить на сервер
    let old_approved = MessagesStore.messages[idx].approved;
    MessagesStore.messages[idx].approved = 1;
    this.setState({
      messages: MessagesStore.getAll(),
    });
    // Отправляем на сервер
    let aj = new Ajax("php/post.php");
    aj.Post({act:"status", approved:1, id: MessagesStore.messages[idx].id}, (data) => {
      let res = JSON.parse(data);
      if (res.status!="ok"){
        // не удалось, возвращаем
        window.alert("Не удалось сохранить данные. Попробуйте позже");
        MessagesStore.messages[idx].approved = old_approved;
        this.setState({
          messages: MessagesStore.getAll(),
        });
      }
    });
  }

  // Модерация, сообщение отклонено
  handleMessageReject(idx){
    // для скорости реакции, изменяем сразу, потом проверяем, удалось ли загрузить на сервер
    let old_approved = MessagesStore.messages[idx].approved;
    MessagesStore.messages[idx].approved = 2;
    this.setState({
      messages: MessagesStore.getAll(),
    });
    // Отправляем на сервер
    let aj = new Ajax("php/post.php");
    aj.Post({act:"status", approved:2, id: MessagesStore.messages[idx].id}, (data) => {
      let res = JSON.parse(data);
      if (res.status!="ok"){
        // не удалось, возвращаем
        window.alert("Не удалось сохранить данные. Попробуйте позже");
        MessagesStore.messages[idx].approved = old_approved;
        this.setState({
          messages: MessagesStore.getAll(),
        });
      }
    });
  }

  // Модерация, удалить сообщение
  handleMessageDelete(idx){
    if (!window.confirm ("Вы уверены, что хотите удалить эту запись?") ) return;
    // для скорости реакции, изменяем сразу, потом проверяем, удалось ли загрузить на сервер
    let old_deleted = MessagesStore.messages[idx];
    let id = MessagesStore.messages[idx].id;
    MessagesStore.messages.splice (idx, 1);
    this.setState({
      messages: MessagesStore.getAll(),
    });
    // Отправляем на сервер
    let aj = new Ajax("php/post.php");
    aj.Post({act:"del", id}, (data) => {
      let res = JSON.parse(data);
      if (res.status!="ok"){
        // не удалось, возвращаем
        window.alert("Не удалось сохранить данные. Попробуйте позже");
        MessagesStore.messages.push(old_deleted);
        this.setState({
          messages: MessagesStore.getAll(),
        });
      }
    });
  }

  // Модерация, изменение текста сообщеения
  handleMessageEdit(e, idx){
    if (MessagesStore.messages[idx].text === e.target.value) return; // нет изменений, выходим
    // для скорости реакции, изменяем сразу, потом проверяем, удалось ли загрузить на сервер
    let old_text = MessagesStore.messages[idx].text;
    let old_edited = MessagesStore.messages[idx].edited;
    MessagesStore.messages[idx].text = e.target.value;
    MessagesStore.messages[idx].edited = 1;
    this.setState({
      messages: MessagesStore.getAll(),
    });
    // Отправляем изменения на сервер
    let aj = new Ajax("php/post.php");
    aj.Post({act:"edit", text: e.target.value, id: MessagesStore.messages[idx].id}, (data) => {
      let res = JSON.parse(data);
      if (res.status!="ok"){
        // не удалось, возвращаем
        window.alert("Не удалось сохранить данные. Попробуйте позже");
        MessagesStore.messages[idx].text = old_text;
        MessagesStore.messages[idx].edited = old_edited;
        this.setState({
          messages: MessagesStore.getAll(),
        });
      }
    });
  }

  // Авторизация
  authorize(e, b, c){
    e.preventDefault();
    var aj = new Ajax("php/auth.php");
    aj.sendForm(e.target, data => {
      let res = JSON.parse(data);
      if (res.status=="ok"){
        Actions.reloadMessages();
        this.setState({isAuthorized: true});
      }else{
        window.alert("Неверный логин или пароль");
      }
    });
  }

  // Разлогинивание
  deauthorize(e){
    e.preventDefault();
    var aj = new Ajax("php/auth.php");
    aj.Post({act:"logout"}, (data) => {
      let res = JSON.parse(data);
      if (res.status=="ok"){
        Actions.reloadMessages();
        this.setState({isAuthorized: false});
      }
    });
  }



  render(){

    // Создаем массив компонентов-сообщений, предварительно отсортировав в соответствии с текущим состоянием сортировки
    let Messages;
    const sort = this.state.sort;
    if (sort.type==="date"){ // Сравнение чисел
      Messages = this.state.messages.sort((a, b) => sort.reverse ? b.date - a.date : a.date - b.date).map((msg, i) =>
        <Message key={msg.id} idx={i} message={msg}
          messageAccept={this.handleMessageAccept.bind(this)}
          messageReject={this.handleMessageReject.bind(this)}
          messageDelete={this.handleMessageDelete.bind(this)}
          messageEdit={this.handleMessageEdit.bind(this)}
          controls={this.state.isAuthorized} />);
    }else{ // Сравнение строк
      Messages = this.state.messages.sort((a, b) => {
        if (b[sort.type] === a[sort.type]) return 0;
        let res = b[sort.type] > a[sort.type] ? 1: -1;
        return sort.reverse ? res : -res;
      }).map((msg, i) =>
        <Message key={msg.id} idx={i} message={msg}
          messageAccept={this.handleMessageAccept.bind(this)}
          messageReject={this.handleMessageReject.bind(this)}
          messageDelete={this.handleMessageDelete.bind(this)}
          messageEdit={this.handleMessageEdit.bind(this)}
          controls={this.state.isAuthorized} />);
    }

    // Выводим все
    // >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
    return (
      <Grid>
        <Row>
          <Col sm={5}>
            {/* Форма авторизации */}
            <AuthForm collapsed={true}
              onAuthorize={this.authorize.bind(this)}
              onUnAuthorize={this.deauthorize.bind(this)}
              authorized={this.state.isAuthorized} />
          </Col>
          <Col sm={12}>
            <h1>Форма обратной связи</h1>
            {/* Элементы управления сортировкой */}
            Сортировать:&nbsp;
              <SortLabel
                value="Имя" type="name"
                active={sort.type==="name" ? true : false}
                reverse={sort.type==="name" ? sort.reverse : false}
                handleSort = {this.handleSort.bind(this)} />&nbsp;
              <SortLabel value="E-mail" type="email"
                active={sort.type==="email" ? true : false}
                reverse={sort.type==="email" ? sort.reverse : false}
                handleSort = {this.handleSort.bind(this)} />&nbsp;
              <SortLabel value="Дата" type="date"
                active={sort.type==="date" ? true : false}
                reverse={sort.type==="date" ? sort.reverse : true}
                handleSort = {this.handleSort.bind(this)} />
            {/* Сообщения */}
            {Messages}
            {/* Предпросмотр */}
            <Collapse in = {this.state.previewVisible}>
              <div>
                <PreviewMessage message={this.state.previewMessage} img={this.state.img} />
              </div>
            </Collapse>
          </Col>
          <Col sm={5}>
            {/* Форма для ввода сообщения */}
            <h2>Отправить сообщение</h2>
            <Form
              handlePreviewVisible = {this.handlePreviewVisible.bind(this)}
              handlePreviewMessage = {this.handlePreviewMessage.bind(this)}
              handleImgSelected = {this.handleImgSelected.bind(this)}
              previewVisible={this.state.previewVisible} />
          </Col>
        </Row>
      </Grid>
    );
  }
}


const app = document.body.querySelector('#feedback');
ReactDOM.render(<Feedback />, app);
