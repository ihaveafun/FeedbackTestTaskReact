import React from "react";

import Button from 'react-bootstrap/lib/Button';
import Checkbox from 'react-bootstrap/lib/Checkbox';
import ProgressBar from 'react-bootstrap/lib/ProgressBar';
import Collapse from 'react-bootstrap/lib/Collapse';

import FormGroup from 'react-bootstrap/lib/FormGroup';
import FormControl from 'react-bootstrap/lib/FormControl';
import ControlLabel from 'react-bootstrap/lib/ControlLabel';
import HelpBlock from 'react-bootstrap/lib/HelpBlock';

import * as Actions from "./Actions";
import MessagesStore from "./MessagesStore";
import FileAPI from "FileAPI";

// ------------------------------------------------
//
//           Форма отправки сообщения
//
// ------------------------------------------------

export default class Form extends React.Component {

  constructor(){
    super();
    this.state = {
      // начальные данные формы
      name:"",
      email:"",
      text:"",
      img: null,
      // Индикатор загрузки
      loading: false,
      // Показывать ошибки валидации (влючается при попытке отправить форму)
      showWarn: false,
    };
  }

  componentWillMount(){
    // Событие - завершение отправки сообщения
    // Отключаем индикатор загрузки и очищаем форму
    MessagesStore.on("msg_sent", () => {
      this.setState({ loading: false, name:"", email:"", text:"", img:null, showWarn: false, });
      this.refs.form.reset(); // для очистки поля file
    });
  }

  // 3 обработчика изменений полей формы
  changeName(e){
    let name = e.target.value;
    this.setState({name});
    this.props.handlePreviewMessage("name", name);
  }
  changeEmail(e){
    let email = e.target.value;
    this.setState({email});
    this.props.handlePreviewMessage("email", email);
  }
  changeText(e){
    let text = e.target.value;
    this.setState({text});
    this.props.handlePreviewMessage("text", text);
  }

  // 3 обработчика валидации полей формы
  getNameValidationState(value) {
    const length = value.length;
    if (length > 2) return true;
    else if (length > 0) return false;
  }
  getEmailValidationState(value) {
    if (value.length < 1) return false;
    var r = /^[\w\.\d-_]+@[\w\.\d-_]+\.\w{2,4}$/i;
    if (!r.test(value)) {
      return false;
    }else{
      return true;
    }
  }
  getTextValidationState(value) {
    const length = value.length;
    if (length > 4 && length < 1025) return true;
    else if (length > 0) return false;
  }

  // отправка формы (сообщения)
  submitMessage(e){
    e.preventDefault();
    if (this.getNameValidationState(this.state.name) && this.getEmailValidationState(this.state.email) && this.getTextValidationState(this.state.text)) {
      // Если валидация пройдена, включаем индикатор загрузки и посылаем событие создания нового сообщения
      this.setState({ loading: true });
      Actions.createMessage(this.state.name, this.state.email, this.state.text, this.state.img);
    }else{
      // Валидация не пройдена, показываем сообщения о неправильно заполненных полях
      this.setState({ showWarn: true });
    }
  }

  // Обработчик загрузки изображения
  imageSelected(e){
    // если выбрана картинка -- уменьшаем и отправляем в обработчик родителя
    // так же сохраняем ее в state для будущей отправки на сервер
    let file = FileAPI.getFiles(e.target)[0];
    FileAPI.Image(file).resize(320, 240, 'max').get( (err, image) => {
      if( !err ){
        let img = image.toDataURL("image/jpeg");
        this.props.handleImgSelected(img);
        this.setState({ img });
      }
    });
  }

  render() {

    // Валидация с учетом пустого поля - показывать ошибку при пустом поле, только если была попытка отправить форму.
    const nameValidation = this.getNameValidationState(this.state.name) ? "success" : (this.state.name!=="" || this.state.showWarn ? "error" : null);
    const emailValidation = this.getEmailValidationState(this.state.email) ? "success" : (this.state.email!=="" || this.state.showWarn ? "error" : null);
    const textValidation = this.getNameValidationState(this.state.text) ? "success" : (this.state.text!=="" || this.state.showWarn ? "error" : null);
    const nameWarn = (nameValidation==="error" && this.state.showWarn) ? <HelpBlock>Введите Ваше имя, не менее 3х символов</HelpBlock> : null;
    const emailWarn = (emailValidation==="error" && this.state.showWarn) ? <HelpBlock>Введите настоящий e-mail</HelpBlock> : null;
    const textWarn = (textValidation==="error" && this.state.showWarn) ? <HelpBlock>Введите текст сообщения, не менее 5ти и не более 1024 символов</HelpBlock> : null;

    // Вывод формы
    // >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
    return (
      <form onSubmit = {this.submitMessage.bind(this)} ref="form">

        <FormGroup controlId="formName" validationState={nameValidation} >
          <FormControl
            type="text"
            value={this.state.name}
            placeholder="Ваше имя"
            onChange={this.changeName.bind(this)}
          />
          <FormControl.Feedback />
          {nameWarn}
        </FormGroup>

        <FormGroup controlId="formEmail" validationState={emailValidation} >
          <FormControl
            type="text"
            value={this.state.email}
            placeholder="Ваш Е-mail"
            onChange={this.changeEmail.bind(this)}
          />
          <FormControl.Feedback />
          {emailWarn}
        </FormGroup>

        <FormGroup controlId="formText" validationState={textValidation} >
          <FormControl
            componentClass="textarea"
            value={this.state.text}
            placeholder="Текст сообщения"
            onChange={this.changeText.bind(this)}
          />
          <FormControl.Feedback />
          {textWarn}
        </FormGroup>

        <FormGroup controlId="formControlsFile">
          <FormControl
            type="file"
            onChange={this.imageSelected.bind(this)}
            accept="image/jpeg,image/png,image/gif" />
          <HelpBlock>Вы можете приложить картинку в формате jpg, gif или png</HelpBlock>
        </FormGroup>

        <Checkbox onChange={this.props.handlePreviewVisible} checked={this.props.previewVisible} >Предпросмотр</Checkbox>

        <Collapse in = {this.state.loading}>
          <div>
            <ProgressBar active now={100} />
          </div>
        </Collapse>

        <Button
          disabled = {this.state.loading}
          type="submit" >
          {this.state.loading ? "Отправляется..." : "Отправить"}
        </Button>

      </form>
    );
  }
}
