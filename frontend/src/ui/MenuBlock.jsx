import React, { useState, useEffect, useRef } from 'react';
import SettingsBlueImage from "../assets/icons/settings_blue.svg";
import SettingsGrayImage from "../assets/icons/settings_gray.svg";
import WalletGrayImage from "../assets/icons/wallet_gray.svg";
import WalletBlueImage from "../assets/icons/wallet_blue.svg";
import DropDownArrowBlackImage from "../assets/icons/dropdown_arrow_black.svg";
import { Link } from "react-router-dom";
import './MenuBlock.css';

function MenuBlock(props) {
    const [menuOpen, setMenuOpen] = useState(false);

    // Создаем реф для меню
    const menuRef = useRef(null);

    const handleClickOutside = (event) => {
        if (menuRef.current && !menuRef.current.contains(event.target)) {
            setMenuOpen(false); // Закрываем меню при клике вне его
        }
    };

    useEffect(() => {
        // Добавляем обработчик кликов на документ
        document.addEventListener('mousedown', handleClickOutside);

        return () => {
            // Удаляем обработчик при размонтировании компонента
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    return (
        <>
            <aside className="menu__block menu__block--list">
                <Link to="/profile/" className="block__item">
                    <img
                        src={props.profile ? SettingsBlueImage : SettingsGrayImage}
                        alt="Настройки"
                        width="20"
                        height="20"
                    />
                    Account info
                </Link>
                <Link to="/subscriptions/" className="block__item">
                    <img
                        src={props.profile ? WalletGrayImage : WalletBlueImage}
                        alt="Кошелёк"
                        width="20"
                        height="20"
                    />
                    My Subscriptions
                </Link>
            </aside>
            <aside className="menu__block menu__block--modal" ref={menuRef}>
                <article
                    className="block__article"
                    onClick={() => {
                        setMenuOpen(!menuOpen); // Переключение состояния меню
                    }}
                >
                    <div className="block__item">
                        {props.profile ? (
                            <>
                                <img
                                    src={SettingsBlueImage}
                                    alt="Настройки"
                                    width="20"
                                    height="20"
                                />
                                Account info
                            </>
                        ) : (
                            <>
                                <img
                                    src={WalletBlueImage}
                                    alt="Кошелёк"
                                    width="20"
                                    height="20"
                                />
                                My Subscriptions
                            </>
                        )}
                    </div>
                    <img
                        src={DropDownArrowBlackImage}
                        alt="Открыть"
                        width="14"
                        height="7"
                        className={
                            menuOpen
                                ? "article__arrow article__arrow--rotate"
                                : "article__arrow"
                        }
                    />
                </article>
                {menuOpen && (
                    <div
                        className={
                            menuOpen
                                ? "block__modal block__modal--active"
                                : "block__modal"
                        }
                    >
                        {props.profile ? (
                            <>
                                <img
                                    src={WalletGrayImage}
                                    alt="Кошелёк"
                                    width="20"
                                    height="20"
                                />
                                My Subscriptions
                            </>
                        ) : (
                            <>
                                <img
                                    src={SettingsGrayImage}
                                    alt="Настройки"
                                    width="20"
                                    height="20"
                                />
                                Account info
                            </>
                        )}
                    </div>
                )}
            </aside>
        </>
    );
}

export default MenuBlock;
