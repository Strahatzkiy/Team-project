import "../css/App.css";
import { Rectangle, Oval, Arrow } from "./shapes.js";
import { WorkspaceContainer } from "./workspace.js"
import { useState, useRef } from "react";
import lupa from "../image/lupa.png";
import table from "../image/table.png";
import copy from "../image/copy.png";

// Главная функция
const App = () => {
  return (
    <>
      <div className="grid">
        <HeaderContainer />
        <SearchContainer />
        <ToolbarContainer />
        <WorkspaceContainer />
        <RightbarContainer />
      </div>
    </>
  );
}

// Контейнер заголовка
const HeaderContainer = () => {
  return ( 
    <header className="header container">
    <span className="logo">Логотип</span>
    <nav>
      <ul>
        <li><a href="#">Имя файла</a></li>
        <li><a href="#">Файл</a></li>
        <li><a href="#">Поделиться</a></li>
        <li><a href="#">Экспортировать</a></li>
        <li><a href="#">Вид</a></li>
        <li><a href="#">Настройки</a></li>
      </ul>
    </nav>
    </header>
  );
}

// Контейнер поиска
const SearchContainer = () => {
  return (
    <div className="search container">
    <input type="text" />
    <img src={lupa} alt="Лупа" />
  </div>
  );
}

// Контейнер панели инструментов
const ToolbarContainer = ({onDrop}) => {
  const itemsClass1 = [
  { component: <Rectangle/>, type: "rectangle" },
  { component: <Oval/>, type: "oval"}, 
  { component: <Arrow x1={0} x2={100} y1={0} y2={0}/>, type: "arrow"}]

  return (
    <div className="toolbar container">
			<nav className="tools">
				<h3>Класс 1</h3>
				<ul className="tools">
					{itemsClass1.map((item, index) => (
            <div key={index} 
            onDragStart={(e) => e.dataTransfer.setData("text/plain", item.type)}
            >
              {item.component}
              </div>
          ))}
				</ul>
				<h3>Класс 2</h3>
				<ul className="tools">
					<li>Треугольник</li>
					<li>Элемент 5</li>
					<li>Элемент 6</li>
					<li>Элемент 7</li>
					<li>Элемент 8</li>
				</ul>
			</nav>
		</div>
  );
}

// Контейнер правой панели
const RightbarContainer = () => {
  return (
		<div className="rightbar container">  
      <nav>
        <img className="icon" src={copy} alt="Копировать"/>
        <img className="icon" src={table} alt="Таблица" />
        <img className="icon" src={lupa} alt="Лупа" />
      </nav>
    </div>
  );
}

export default App;
