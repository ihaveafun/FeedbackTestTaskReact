import React from "react";

import Button from 'react-bootstrap/lib/Button';
import Collapse from 'react-bootstrap/lib/Collapse';

import FormGroup from 'react-bootstrap/lib/FormGroup';
import FormControl from 'react-bootstrap/lib/FormControl';
import ControlLabel from 'react-bootstrap/lib/ControlLabel';

// ------------------------------------------------
//
//              Форма авторизации
//
// ------------------------------------------------

export default class AuthForm extends React.Component {

  constructor(){
    super();
    this.state = {collapsed: true,};
  }

  // Скрытие/показ формы при нажатии на ссылку
  handleMakeMeVisible(e){
    e.preventDefault();
    this.setState({collapsed: !this.state.collapsed,});
  }

  render() {
    if (this.props.authorized) {
      // Вывод при залогиненом пользователе
      return (
        <p class="login-text">
          Вы вошли как admin, <a href="" onClick={this.props.onUnAuthorize}>выйти</a><br />
          Нажмите на текст сообщения, чтоб редактировать его
        </p>
      )
    }else{
      //Выод формы авторизации
      return (
        <div>
          <p class="login-text"><a href="" onClick={this.handleMakeMeVisible.bind(this)}>Авторизация</a></p>
          <Collapse in = {!this.state.collapsed}>
            <div>
              <form onSubmit={this.props.onAuthorize}>

                <FormGroup controlId="username" >
                  <FormControl type="text" name="username" placeholder="Имя пользователя" />
                </FormGroup>

                <FormGroup controlId="password" >
                  <FormControl type="password" name="password" placeholder="Пароль" />
                </FormGroup>

                <FormControl type="hidden" name="act" value="login" />

                <Button type="submit" >Отправить</Button>

              </form>
            </div>
          </Collapse>
        </div>
      )
    }
  }
}
