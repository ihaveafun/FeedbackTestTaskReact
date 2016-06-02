import dispatcher from "./dispatcher";
// ------------------------------------------------
//
//           События Flux
//
// ------------------------------------------------


// Отправка нового сообщения на сервер
export function createMessage (name, email, text, file) {
  dispatcher.dispatch({
    type: "CREATE_MSG",
    name,
    email,
    text,
    file,
  })
}

// Загрузка всех сообщений с сервера
export function reloadMessages () {
  dispatcher.dispatch({
    type: "RELOAD_ALL",
  })
}
