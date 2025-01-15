import React, { useState, useRef, useEffect } from 'react';
import DropDownArrowBlackImage from "../assets/icons/dropdown_arrow_black.svg";
import DropDownArrowWhiteImage from "../assets/icons/dropdown_arrow_white.svg";


function DropDownListLanguage(props) {

    const [modalOpen, setModalOpen] = useState(false);
    const currentLanguage = localStorage.getItem('language') ? localStorage.getItem('language') : 'en';

    // Создаем реф для меню
    const menuRef = useRef(null);

    const changeLanguage = (language) => {
        localStorage.setItem('language', language);
        window.location.reload();
    };

    // Обработчик клика вне меню
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
        <menu className={props.white ? "dropdown__menu dropdown__menu--white" : "dropdown__menu"} ref={menuRef}>
            <article className="menu__article" onClick={() => setModalOpen(!modalOpen)}>
                <span className="menu__title menu__title--language">{currentLanguage}</span>
                <img
                    src={props.white ? DropDownArrowWhiteImage : DropDownArrowBlackImage}
                    alt="Раскрыть список"
                    className={modalOpen ? 'dropdown__arrow dropdown__arrow--active' : 'dropdown__arrow'}
                    width="10"
                />
            </article>
            <ul className={modalOpen ? 'menu__list menu__list--language menu__list--active' : 'menu__list menu__list--language'}>
                <li className="list__item">
                    <p className="item__link" onClick={() => changeLanguage('en')}>English</p>
                </li>
                <li className="list__item">
                    <p className="item__link" onClick={() => changeLanguage('uk')}>Ukraine</p>
                </li>
                <li className="list__item">
                    <p className="item__link" onClick={() => changeLanguage('ru')}>Russian</p>
                </li>
            </ul>
        </menu>
    );
}

export default DropDownListLanguage;
