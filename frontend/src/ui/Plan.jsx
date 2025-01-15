import React, {useState} from 'react';
import CheckMarkCircleImage from '../assets/icons/check_mark_circle.svg';
import './Plan.css';
import Button from "./Button.jsx";


function Plan(props) {

    return (
        <>
            <section className='plan'>
                <h3 className='plan__title'>{props.plan_data.name}</h3>
                <hr className='plan__line'/>
                <ul className='plan__clauses' style={{height: 100*props.plan_data.clauses.length, maxHeight: '200px'}}>
                    {props.plan_data.clauses.map((item)=>(
                        <li className='clauses__item' key={item.id}>
                            <img src={CheckMarkCircleImage} alt="Чекбокс" width='26' height='26' />
                            {item.name}
                        </li>
                    ))}
                </ul>
                <h3 className='plan__price'>
                    <span className='price__currency'>$</span> {props.plan_data.price}
                </h3>
                <Button button_data={{
                    title: 'Get started',
                    background: 'var(--blue-color)',
                    color: 'var(--white-color)',
                    padding: '15px',
                    maxWidth: '320px',
                    is_link: false,
                    click: props.plan_data.handle_modal_open,
                }} />
            </section>
        </>
    );
}

export default Plan;