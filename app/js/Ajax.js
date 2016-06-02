// ------------------------------------------------
//
//          Ajax-взаимодействие с сервером
//
// ------------------------------------------------
export default class Ajax{


  constructor(url){
    this.xhr = new XMLHttpRequest();
    this.url = url;
  }


  // отправка данных POST
  Post (data, callback){

    /* Создаем тело запроса */
    var boundary = String(Math.random()).slice(2);
    var boundaryMiddle = '--' + boundary + '\r\n';
    var boundaryLast = '--' + boundary + '--\r\n';
    var body = ['\r\n'];
    for (var key in data) {
      body.push('Content-Disposition: form-data; name="' + key + '"\r\n\r\n' + data[key] + '\r\n');
    }
    body = body.join(boundaryMiddle) + boundaryLast;

    /* Отправляем */
    this.xhr.open('POST', this.url, true);
    this.xhr.setRequestHeader('Content-Type', 'multipart/form-data; boundary=' + boundary);
    this.xhr.onreadystatechange = function(){
      if (this.readyState != 4) return;
      callback( this.responseText );
    };

    this.xhr.send(body);
  }



  // отправка формы (для авторизации)
  sendForm(form, callback){

    /* берем данные из формы */
    var field, s = [];
    if (typeof form == 'object' && form.nodeName.toLowerCase() == "form") {
        var len = form.elements.length;
        for (let i=0; i<len; i++) {
            field = form.elements[i];
            if (field.name && !field.disabled && field.type != 'file' && field.type != 'reset' && field.type != 'submit' && field.type != 'button') {
                if (field.type == 'select-multiple') {
                    for (j=form.elements[i].options.length-1; j>=0; j--) {
                        if(field.options[j].selected)
                            s[s.length] = encodeURIComponent(field.name) + "=" + encodeURIComponent(field.options[j].value);
                    }
                } else if ((field.type != 'checkbox' && field.type != 'radio') || field.checked) {
                    s[s.length] = encodeURIComponent(field.name) + "=" + encodeURIComponent(field.value);
                }
            }
        }
    }

    /* Создаем тело запроса */
    var body = s.join('&').replace(/%20/g, '+');

    /* Отправляем */
    this.xhr.open('POST', this.url, true);
    this.xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
    this.xhr.onreadystatechange = function(){
      if (this.readyState != 4) return;
      callback( this.responseText );
    };
    this.xhr.send(body);
  }



}
