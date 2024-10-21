import React from "react";
import ReactDOM from "react-dom/client";
import "./css/index.css";
import App from "./js/App";

// Получение корневого контейнера
const root = ReactDOM.createRoot(document.getElementById("root"));
// Отрисовка элементов из функции App
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);