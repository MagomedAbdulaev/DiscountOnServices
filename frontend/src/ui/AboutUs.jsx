import React from 'react';
import SmallTitle from "./SmallTitle.jsx";
import Logo from "./Logo.jsx";
import AboutUsImage from '../assets/images/about_us.webp';
import './AboutUs.css';


function AboutUs(props) {
    return (
        <section className='about'>
            <SmallTitle name='About us' />
            <div className="about__content">
                <div className="content__info">
                    <Logo width_from='130' width_to='60' />
                    <p className='info__description'>We offer you a subscription to various media
                        services at the best price.</p>
                    <p className='info__description'>
                        We have partnered with several companies to help you find the best prices for your
                        media subscriptions and provide you with the best prices for the Premium subscriptions you want.
                    </p>
                    <h3 className='info__title'>It's simple, fast and economical.</h3>
                </div>
                <img src={AboutUsImage} alt="О нас" width='600' height='535' className='content__image' />
            </div>
        </section>
    );
}

export default AboutUs;