import React, {useEffect, useState} from 'react';
import DropDownList from "../ui/DropDownList.jsx";
import {Link} from "react-router-dom";
import axios from "axios";
import HostBackend from "../main.jsx";
import HomeImage from '../assets/icons/home.svg';
import AboutImage from '../assets/icons/about.svg';
import FaqImage from '../assets/icons/faq.svg';
import SupportImage from '../assets/icons/support.svg';


function Navigation(props) {

    const [services, setServices] = useState([]);
    const widthWindow = props.widthWindow ? props.widthWindow : false;

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
        <nav className="header__navigation">
            {widthWindow > 1024 ? (
                <>
                    <DropDownList dropdown_info={{
                        title: 'Subscriptions',
                        list: services,
                        links: true,
                    }} />
                    <Link to='/faq' className='navigation__link' onClick={()=>{props.set_modal_open(false)}}>FAQ</Link>
                    <Link to='/support' className='navigation__link' onClick={()=>{props.set_modal_open(false)}}>Support</Link>
                    <Link to='/about' className='navigation__link' onClick={()=>{props.set_modal_open(false)}}>About</Link>
                </>
            ): (
                <>
                    <section className="navigation__links">
                        <Link to='/' className='navigation__link' onClick={()=>{props.set_modal_open(false)}}>
                            <img src={HomeImage} alt="Домашняя страница" width='16' className='link__image'/>
                            Home
                        </Link>
                        <Link to='about/' className='navigation__link' onClick={()=>{props.set_modal_open(false)}}>
                            <img src={AboutImage} alt="О нас" width='16' className='link__image'/>
                            About
                        </Link>
                        <Link to='faq/' className='navigation__link' onClick={()=>{props.set_modal_open(false)}}>
                            <img src={FaqImage} alt="Часто задаваемые вопросы" width='16' className='link__image'/>
                            FAQ
                        </Link>
                        <Link to='support/' className='navigation__link' onClick={()=>{props.set_modal_open(false)}}>
                            <img src={SupportImage} alt="Поддержка" width='16' className='link__image'/>
                            Support
                        </Link>
                    </section>
                    <ul className="navigation__links">
                        {services.map((item) => (
                            <li className='list__item' key={item.id} onClick={()=>{props.set_modal_open(false)}}>
                                <Link to={`subscription/${item.slug}`} className='item__link'>{item.name}</Link>
                            </li>
                        ))}
                    </ul>
                </>
            )}

        </nav>
    );
}

export default Navigation;