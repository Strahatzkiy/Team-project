import idef0 from '../image/idef0.jpg'
import '../css/menu.css'
import { Link } from "react-router-dom";

// Главная функция
export const Menu = () => {
    return (
      <>
		<h1>Меню</h1>
		<div class="menu">
			<Link to='/diagram/idef0' class="menu-item">
				<img src={idef0} alt="Изображение 1"/>
			</Link>
			<Link to='/' class="menu-item">
				<img src="image2.jpg" alt="Изображение 2" />
			</Link>
			<Link to='/' class="menu-item">
				<img src="image3.jpg" alt="Изображение 3" />
			</Link>
			<Link to='/' class="menu-item">
				<img src="image4.jpg" alt="Изображение 4" />
			</Link>
		</div>
      </>
    );
  }

export default Menu;