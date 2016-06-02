import React from "react";

import Label from 'react-bootstrap/lib/Label';
import Glyphicon from 'react-bootstrap/lib/Glyphicon';

// ------------------------------------------------
//
//           Элемент управления сортировкой
//
// ------------------------------------------------

export default class SortLabel extends React.Component {

  // обработчик нажатия
  handleClick(e){
    e.preventDefault();
    // Вызываем обработчик родителя и меняем направление сортировки, если кнопка была активна
    this.props.handleSort(this.props.type, this.props.active ? !this.props.reverse : this.props.reverse);
  }

  render(){
    // Вычисление положения стрелки
    const arrow = this.props.active ? (this.props.reverse ? <Glyphicon glyph="menu-up" /> : <Glyphicon glyph="menu-down" />) : null;

    return(
      <Label bsStyle="primary"><a href="" onClick={this.handleClick.bind(this)} >{this.props.value}</a>&nbsp;{arrow}</Label>
    );
  }
}
