import React from 'react';
import ReactDOMClient from 'react-dom/client';
import {BrowserRouter} from "react-router-dom";
import App from './App.jsx';
import './index.css';
import './reset.css';

const HostBackend = 'http://localhost:8000/';

export function getCookie(name) {
  var cookieValue = null;
  if (document.cookie && document.cookie !== '') {
    var cookies = document.cookie.split(';');
    for (var i = 0; i < cookies.length; i++) {
      var cookie = cookies[i].trim(); // Удаляет пробелы в начале и конце строки
      if (cookie.substring(0, name.length + 1) === (name + '=')) {
        cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
        break;
      }
    }
  }
  return cookieValue;
}

const app = ReactDOMClient.createRoot(document.getElementById('root'));

app.render(
    <BrowserRouter>
      <App/>
    </BrowserRouter>
)


export default HostBackend;
