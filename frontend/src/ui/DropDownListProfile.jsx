import React, {useEffect, useRef, useState} from 'react';
import DropDownArrowBlackImage from "../assets/icons/dropdown_arrow_black.svg";
import {Link, useNavigate} from "react-router-dom";
import UserWhiteImage from '../assets/icons/user_white.svg';
import UserBlackImage from '../assets/icons/user_black.svg';
import LogoutImage from '../assets/icons/logout.svg';
import axios from "axios";
import HostBackend from "../main.jsx";


function DropDownListProfile(props) {

    const [modalOpen, setModalOpen] = useState(false);
    const Navigate = useNavigate();

    // Создаем реф для меню
    const menuRef = useRef(null);

    const handleClickOutside = (event) => {
        if (menuRef.current && !menuRef.current.contains(event.target)) {
            setModalOpen(false);
        }
    };

    const handleLogout = async () => {

        axios.get(HostBackend + 'logout_user/', {
            withCredentials: true,
        })
            .then(response => {
                setModalOpen(false);
                props.set_auth_status(false);
                Navigate('/');

            })
            .catch(error => {
                console.error("Error fetching services:", error);
            });
    }

    useEffect(() => {
        // Добавляем обработчик клика на документ
        document.addEventListener('click', handleClickOutside);

        return () => {
            // Удаляем обработчик при размонтировании компонента
            document.removeEventListener('click', handleClickOutside);
        };
    }, []);

    return (
        <menu className='dropdown__menu dropdown__menu--profile' ref={menuRef}>
            <article className="menu__article" onClick={()=>{setModalOpen(!modalOpen)}}>
                <span className='menu__image'>
                    <img src={UserWhiteImage} alt="Профиль" width='14' height='10' className='article__user'/>
                </span>
                <span className='menu__title'>Profile</span>
                <img src={DropDownArrowBlackImage} alt="Раскрыть список" className={modalOpen ? 'dropdown__arrow dropdown__arrow--active' : 'dropdown__arrow'} width='10' />
            </article>
            <ul className={modalOpen ? 'menu__list menu__list--active' : 'menu__list'}>
                <Link to='profile' className='list__item' onClick={()=>{setModalOpen(false)}}>
                    <span className='menu__image menu__image--white'>
                        <img src={UserBlackImage} alt="Профиль" width='14' height='16' className='item__image'/>
                    </span>
                    My profile
                </Link>
                <li className='list__item' onClick={handleLogout}>
                    <span className='menu__image'>
                        <img src={LogoutImage} alt="Выйти" width='14' height='10' className='item__image'/>
                    </span>
                    Logout
                </li>
            </ul>
        </menu>
    );
}

export default DropDownListProfile;