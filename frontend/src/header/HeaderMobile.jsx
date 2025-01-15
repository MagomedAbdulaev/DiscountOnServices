import React, {useEffect, useState} from 'react';
import Navigation from "./Navigation.jsx";
import {Link, useNavigate} from "react-router-dom";
import WhatsAppBlackImage from "../assets/icons/whatsapp_black.svg";
import TelegramBlackImage from "../assets/icons/telegram_black.svg";
import DropDownListLanguage from "../ui/DropDownListLanguage.jsx";
import Button from "../ui/Button.jsx";
import DropDownListProfile from "../ui/DropDownListProfile.jsx";
import axios from "axios";
import HostBackend from "../main.jsx";
import UserWhiteImage from '../assets/icons/user_white.svg';
import LogoutBlackImage from '../assets/icons/logout_black.svg';


function HeaderMobile(props) {

    const Navigate = useNavigate();

    const [modalOpen, setModalOpen] = useState(false);
    const [authStatus, setAuthStatus] = useState(false);
    const HeaderClass = modalOpen && !props.auth_key ? 'header__modal header__modal--active' : 'header__modal';

    useEffect(() => {
        axios.get(HostBackend + 'auth_status/', {
            withCredentials: true
        })
            .then(response => {

                if(response.data.authenticated){
                    setAuthStatus(true);
                }

            })
            .catch(error => {
                console.error("Error fetching services:", error);
            });
    }, [props.auth_key]);

    useEffect(() => {
        if (modalOpen) {
            // Добавляем стиль, чтобы запретить прокрутку
            document.body.style.overflow = 'hidden';
        } else {
            // Убираем стиль, чтобы разрешить прокрутку
            document.body.style.overflow = '';
        }
    }, [modalOpen]);

    const handleLogout = async () => {

        axios.get(HostBackend + 'logout_user/', {
            withCredentials: true,
        })
            .then(response => {
                setModalOpen(false);
                setAuthStatus(false);
                Navigate('/');

            })
            .catch(error => {
                console.error("Error fetching services:", error);
            });
    }

    return (
        <>
            {props.widthWindow > 1024 ? (
                <>
                    <Navigation widthWindow={props.widthWindow} modal_open={modalOpen} set_modal_open={setModalOpen} />
                    <section className="header__user_interface">
                        <div className="interface__social">
                            <Link to='tel:79280580092'>
                                <img src={WhatsAppBlackImage} alt="Whatsapp" width='24px' className='social__image'/>
                            </Link>
                            <Link to='https://t.me/DiscountsOnServices_bot' className='social__link'>
                                <img src={TelegramBlackImage} alt="Telegram" width='24px' className='social__image'/>
                            </Link>
                        </div>
                        <DropDownListLanguage white={false} />
                        {authStatus ? (
                            <DropDownListProfile set_auth_status={setAuthStatus}/>
                        ) : (
                            <Button button_data={{
                                title: 'Log in',
                                background: 'var(--blue-color)',
                                color: 'var(--white-color)',
                                padding: '12px',
                                maxWidth: '150px',
                                is_link: false,
                                click: () => props.set_auth_key('login'),
                            }} />
                        )}
                    </section>
                </>
            ): (
                <>
                    {props.widthWindow > 640 ? (
                        <section className="header__user_interface">
                            <div className="interface__social">
                                <Link to='tel:79280580092'>
                                    <img src={WhatsAppBlackImage} alt="Whatsapp" width='24px' className='social__image'/>
                                </Link>
                                <Link to='https://t.me/DiscountsOnServices_bot' className='social__link'>
                                    <img src={TelegramBlackImage} alt="Telegram" width='24px' className='social__image'/>
                                </Link>
                            </div>
                            <DropDownListLanguage white={false} />
                            {authStatus ? (
                                <DropDownListProfile set_auth_status={setAuthStatus}/>
                            ) : (
                                <Button button_data={{
                                    title: 'Log in',
                                    background: 'var(--blue-color)',
                                    color: 'var(--white-color)',
                                    padding: '12px',
                                    maxWidth: '150px',
                                    is_link: false,
                                    click: () => props.set_auth_key('login'),
                                }} />
                            )}
                            {modalOpen ? (
                                <div className='menu_icon close' onClick={()=>{setModalOpen(!modalOpen)}}></div>
                            ): (
                                <menu className='menu_icon gamburger' onClick={()=>{setModalOpen(!modalOpen)}}>
                                    <span className='gamburger__line'></span>
                                </menu>
                            )}
                        </section>
                    ) :(
                        <>
                            {modalOpen ? (
                                <div className='menu_icon close' onClick={()=>{setModalOpen(!modalOpen)}}></div>
                            ): (
                                <menu className='menu_icon gamburger' onClick={()=>{setModalOpen(!modalOpen)}}>
                                    <span className='gamburger__line'></span>
                                </menu>
                            )}

                        </>
                    )}

                </>
            )}
            {props.widthWindow <= 1024 && (
                <div className={HeaderClass}>
                    {props.widthWindow <= 640 && authStatus && (
                        <Link to='profile/' className='profile__link' onClick={()=>{setModalOpen(false)}}>
                            <span className='link__image'>
                                <img src={UserWhiteImage} alt="Профиль" width='14' height='17'/>
                            </span>
                            Account
                        </Link>
                    )}
                    <Navigation widthWindow={props.widthWindow} modal_open={modalOpen} set_modal_open={setModalOpen} />
                    {props.widthWindow <= 640 && (
                        <section className="header__user_interface">
                            <div className="user_interface__block">
                                <div className="interface__social">
                                    <Link to='tel:79280580092'>
                                        <img src={WhatsAppBlackImage} alt="Whatsapp" width='24px' className='social__image'/>
                                    </Link>
                                    <Link to='https://t.me/DiscountsOnServices_bot' className='social__link'>
                                        <img src={TelegramBlackImage} alt="Telegram" width='24px' className='social__image'/>
                                    </Link>
                                </div>
                                <DropDownListLanguage white={false} />
                            </div>

                            {!authStatus && (
                                <>
                                    <Button button_data={{
                                        title: 'Log in',
                                        background: 'var(--blue-color)',
                                        color: 'var(--white-color)',
                                        padding: '12px',
                                        maxWidth: '320px',
                                        is_link: false,
                                        click: () => props.set_auth_key('login'),
                                    }} />
                                    <Button button_data={{
                                        title: 'Sign up',
                                        background: 'var(--blue-color)',
                                        color: 'var(--white-color)',
                                        padding: '12px',
                                        maxWidth: '320px',
                                        is_link: false,
                                        click: () => props.set_auth_key('registration'),
                                    }} />
                                </>
                            )}
                        </section>
                    )}

                    {props.widthWindow <= 640 && authStatus && (
                        <span className='user__logout' onClick={handleLogout}>
                            <img src={LogoutBlackImage} alt="Выйти" width='20' height='20'/>
                            Log out
                        </span>
                    )}

                </div>
            )}

        </>
    );
}

export default HeaderMobile;

