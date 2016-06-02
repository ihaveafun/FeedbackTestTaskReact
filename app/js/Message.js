import React from "react";

import Label from 'react-bootstrap/lib/Label';
import Button from 'react-bootstrap/lib/Button';
import Glyphicon from 'react-bootstrap/lib/Glyphicon';
import ButtonToolbar from 'react-bootstrap/lib/ButtonToolbar';
import ButtonGroup from 'react-bootstrap/lib/ButtonGroup';

import ContentEditable from "./FormControls/ContentEditable";
// ------------------------------------------------
//
//              Вывод отдельного сообщения
//
// ------------------------------------------------
export default class Message extends React.Component {


  render(){
    const message = this.props.message;
    // Ссылка имя + email
    const link = "mailto:" + message.email;
    // Приложенное изображение
    const img_file = (message.file!=null && message.file!="null" && message.file!="") ? <div class="img"><img src={message.file}/></div> : null;
    // Кнопки модерации
    const controls = this.props.controls ?
      <ButtonToolbar>
        <ButtonGroup>
          <Button bsSize="small"
            active={message.approved == 1 ? true : false}
            title="Принять"
            onClick={this.props.messageAccept.bind(this, this.props.idx)}>
              <Glyphicon glyph="ok" />
          </Button>
          <Button bsSize="small"
            active={message.approved == 2 ? true : false}
            title="Отклонить"
            onClick={this.props.messageReject.bind(this, this.props.idx)}>
              <Glyphicon glyph="remove" />
          </Button>
        </ButtonGroup>
        <Button bsSize="small"  title="Удалить"
          onClick={this.props.messageDelete.bind(this, this.props.idx)}>
            <Glyphicon glyph="trash" />
        </Button>
      </ButtonToolbar>
        : null;
    // Текст сообщения с возможностью редактирования, если админ
    const message_jsx = this.props.controls ?
      <ContentEditable html={message.text} idx={this.props.idx} onChange={this.props.messageEdit.bind(this)} /> :
      <p>{message.text}</p>;
    // Метка нового сообщения
    const label_new = message.approved != 1 ?
      (message.approved ? <Label bsStyle="danger">Отклонено</Label> : <Label bsStyle="success">Новое</Label>)
      : null;

    return (
      <div class={message.approved === 2 ? "message-notapproved" : null}>
        <h3><a href={link} title={message.email}>{message.name}</a></h3>
        <p><Label bsStyle="default">{(new Date(message.date)).toLocaleString()}</Label>&nbsp;{label_new}</p>
        {message_jsx}
        {img_file}
        {message.edited ? <em>Сообщение отредактировано администратором</em> : null}
        {controls}
        <hr/>
      </div>
    );
  }
}
