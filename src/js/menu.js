import idef0 from '../image/idef0.jpg'
import '../css/menu.css'
import { Link } from "react-router-dom";
import { clearWorkspace } from './workspace';

// Главная функция
export const Menu = () => {
	document.title = "Меню"
    return (
      <>
		<h1>Меню</h1>
		<div className="menu">
			<Link to='/diagram/idef0' className="menu-item">
				<img src={idef0} alt="Изображение 1"/>
			</Link>
		</div>
		<a href="clear" onClick={(e) => { e.preventDefault(); clearWorkspace(); }}>Очистить кэш</a>
      </>
    );
  }

export default Menu;