import React, {useState, useEffect, useRef} from 'react';
import DropDownArrowBlackImage from '../assets/icons/dropdown_arrow_black.svg';
import {Link} from "react-router-dom";
import './DropDownList.css';


function DropDownList(props) {

    const [modalOpen, setModalOpen] = useState(false);

    // Создаем реф для меню
    const menuRef = useRef(null);

    const handleClickOutside = (event) => {
        if (menuRef.current && !menuRef.current.contains(event.target)) {
            setModalOpen(false);
        }
    };

    useEffect(() => {
        // Добавляем обработчик клика на документ
        document.addEventListener('click', handleClickOutside);

        return () => {
            // Удаляем обработчик при размонтировании компонента
            document.removeEventListener('click', handleClickOutside);
        };
    }, []);

    return (
        <menu className='dropdown__menu' ref={menuRef}>
            <article className="menu__article" onClick={()=>{setModalOpen(!modalOpen)}}>
                <span className='menu__title'>{props.dropdown_info.title}</span>
                <img src={DropDownArrowBlackImage} alt="Раскрыть список" className={modalOpen ? 'dropdown__arrow dropdown__arrow--active' : 'dropdown__arrow'} width='10' />
            </article>
            <ul className={modalOpen ? 'menu__list menu__list--active' : 'menu__list'}>
                {props.dropdown_info.list.map((item) => (
                    <li className='list__item' key={item.id}>
                        <Link
                            to={`subscription/${item.slug}`}
                            className='item__link'
                            onClick={()=>{setModalOpen(false)}}
                        >{item.name}</Link>
                    </li>
                ))}
            </ul>
        </menu>
    );
}

export default DropDownList;