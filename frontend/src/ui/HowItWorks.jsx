import React from 'react';
import SmallTitle from "./SmallTitle.jsx";
import LightImage from '../assets/images/light.webp';
import PlanImage from '../assets/images/plan.webp';
import SuccessPaidImage from '../assets/images/success_paid.webp';
import './HowItWorks.css';


function HowItWorks(props) {
    return (
        <section className='work'>
            <SmallTitle name='How it works?' />
            <div className="work__content">
                <div className="content__block">
                    <img src={LightImage} alt="Лампа" width='175' height='175' className='block__image' />
                    <h3 className='block__title'>Step 1</h3>
                    <p className='block__description'>Enter your account information</p>
                </div>
                <div className="content__block">
                    <img src={PlanImage} alt="План" width='175' height='175' className='block__image' />
                    <h3 className='block__title'>Step 2</h3>
                    <p className='block__description'>Select the desired subscription and plan</p>
                </div>
                <div className="content__block">
                    <img src={SuccessPaidImage} alt="Успешно" width='175' height='175' className='block__image' />
                    <h3 className='block__title'>Step 3</h3>
                    <p className='block__description'>Pay your bill with PayPal</p>
                </div>
            </div>
        </section>
    );
}

export default HowItWorks;