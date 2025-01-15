import React, {useEffect, useState} from 'react';
import axios from "axios";
import HostBackend from "../main.jsx";
import Button from "./Button.jsx";
import './Services.css';
import SmallTitle from "./SmallTitle.jsx";


function Services(props) {

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
        <section className='services'>
            <SmallTitle name='Choose a subscription' />
            <div className="services__content">
                {services.map((item)=>(
                    <section className="content__card" key={item.id}>
                        <div className="card__info">
                            <h3 className="info__title">{item.name}</h3>
                            <p className='info__description'>{item.description}</p>
                            <Button button_data={{
                                title: 'Learn more',
                                background: 'var(--blue-color)',
                                color: 'var(--white-color)',
                                padding: '15px',
                                maxWidth: '100%',
                                is_link: true,
                                path: `subscription/${item.slug}`,
                            }} />
                        </div>
                        <img src={`${item.image}`} alt={item.name} width='600' height='340' className='card__image'/>
                    </section>
                ))}
            </div>
        </section>
    );
}

export default Services;