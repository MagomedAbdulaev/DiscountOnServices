import React, {useState, useEffect} from 'react';
import './Footer.css';
import Logo from "../ui/Logo.jsx";
import axios from "axios";
import HostBackend from "../main.jsx";
import {Link} from "react-router-dom";
import WhatsAppImage from "../assets/icons/whatsapp_white.svg";
import TelegramImage from "../assets/icons/telegram_white.svg";
import DropDownListLanguage from "../ui/DropDownListLanguage.jsx";


function Footer(props) {

    const [services, setServices] = useState([]);

    useEffect(() => {
        let language = 'en';
        if (localStorage.getItem('language')) {
            language = localStorage.getItem('language');
        }

        axios.get(HostBackend + 'services_list/', { params: { language } })
            .then(response => {
                setServices(response.data);
            })
            .catch(error => {
                console.error("Error fetching services:", error);
            });
    }, []);

    return (
        <footer className='footer'>
            <div className="footer__content">
                <div className="footer__columns">
                    <section className="footer__column footer__column--logo">
                        <Logo text_is_visible={true} />
                        <p className='column__item simple_text'>It's simple, fast and economical</p>
                    </section>
                    <section className="footer__column footer__column--services">
                        <h3 className='column__title'>Subscriptions</h3>
                        <ul className="column__list">
                            {services.map((item)=>(
                                <Link to={`subscription/${item.slug}`} className='column__item' key={item.id}>{item.name}</Link>
                            ))}
                        </ul>
                    </section>
                    <section className="footer__column footer__column--navigation">
                        <h3 className='column__title'>Site navigation</h3>
                        <ul className="column__list">
                            <Link to='/about' className='column__item'>About</Link>
                            <Link to='/faq' className='column__item'>FAQ</Link>
                            <Link to='/support' className='column__item'>Support</Link>
                        </ul>
                    </section>
                    <section className="footer__column footer__column--social">
                        <div className="column__social">
                            <Link to='tel:79280580092'>
                                <img src={WhatsAppImage} alt="Whatsapp" width='24px' className='social__image'/>
                            </Link>
                            <Link to='https://t.me/DiscountsOnServices_bot' className='social__link'>
                                <img src={TelegramImage} alt="Telegram" width='24px' className='social__image'/>
                            </Link>
                        </div>
                        <DropDownListLanguage white={true} />
                    </section>
                </div>
                <hr className='footer__line'/>
                <div className="footer__row">
                    <p className='row__item'>Privacy Policy</p>
                    <p className='row__item'>Copyright 2025 © All Rights Reserved</p>
                    <p className='row__item'>Developed by @monoli_t (telegram)</p>
                </div>
            </div>
        </footer>
    );
}

export default Footer;