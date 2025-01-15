import React, {useEffect, useState} from 'react';
import SmallTitle from "./SmallTitle.jsx";
import FaqQuestion from "./FaqQuestion.jsx";
import axios from "axios";
import HostBackend from "../main.jsx";
import './Faq.css';
import Button from "./Button.jsx";


function Faq(props) {

    const [questions, setQuestions] = useState([]);

    useEffect(()=>{
        let language = 'en';
        if (localStorage.getItem('language')) {
            language = localStorage.getItem('language');
        }

        axios.get(HostBackend + 'questions_list/', { params: { language } })
            .then(response => {
                setQuestions(response.data);
            })
            .catch(error => {
                console.error("Error fetching services:", error);
            });
    }, [])

    return (
        <section className='faq'>
            <SmallTitle name='FAQ'/>
            <div className="faq__content">
                {questions.map((item)=>(
                    <FaqQuestion key={item.id} question_data={{
                        name: item.name,
                        answer: item.answer,
                    }} />
                ))}
            </div>
            <Button button_data={{
                title: 'Support',
                background: 'var(--gray-color)',
                color: 'var(--white-color)',
                padding: '15px',
                maxWidth: '250px',
                is_link: true,
                path: '/support',
                click: () => props.set_auth_key('login'),
            }} />
        </section>
    );
}

export default Faq;