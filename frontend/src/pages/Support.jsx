import React from 'react';
import Title from "../ui/Title.jsx";
import './Support.css';


function Support(props) {
    return (
        <section className='support'>
            <Title title='Contacts for support'/>
            <ul className='support__list'>
                <li className='list__item'>+7 (928) 058 00-92</li>
                <li className='list__item'>magomedabdulaev915@gmail.com</li>
                <li className='list__item'>@monoli_t (telegram)</li>
                <li className='list__item'>magomedabdulaev915@mail.ru</li>
            </ul>
        </section>
    );
}

export default Support;