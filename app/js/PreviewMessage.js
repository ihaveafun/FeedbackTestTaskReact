import React from "react";
import ReactDOM from "react-dom";

import Label from 'react-bootstrap/lib/Label';
// ------------------------------------------------
//
//              Предпросмотр сообщения
//
// ------------------------------------------------

export default class PreviewMessage extends React.Component {

  // componentDidMount(){
  //   // Превью загружаемой картики
  //   if (this.refs.imgholder.hasChildNodes()) {
  //     this.refs.imgholder.removeChild(this.refs.imgholder.childNodes[0]);
  //   }
  //   if (this.props.img!=null){
  //     this.refs.imgholder.appendChild(this.props.img);
  //   }
  // }

  // componentWillReceiveProps(){
  //   // Превью загружаемой картики
  //   if (this.refs.imgholder.hasChildNodes()) {
  //     this.refs.imgholder.removeChild(this.refs.imgholder.childNodes[0]);
  //   }
  //   if (this.props.img!=null){
  //     this.refs.imgholder.appendChild(this.props.img);
  //   }
  // }

  render(){

    // Ссылка Имя + email
    const link = "mailto:" + this.props.message.email;
    const img = this.props.img!==null ? <img src={this.props.img} /> : null;


    return (
      <div>
        <h4><Label bsStyle="success">Ваше сообщение:</Label></h4>
        <h3><a href={link} title={this.props.message.email}>{this.props.message.name}</a></h3>
        <p><Label bsStyle="default">{(new Date()).toLocaleString()}</Label></p>
        <p>{this.props.message.text}</p>
        <div class="img">{img}</div>
        <hr/>
      </div>
    );
  }
}
