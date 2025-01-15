import React, {useState, useEffect} from 'react';
import InviteFriend from "../ui/InviteFriend.jsx";
import MenuBlock from "../ui/MenuBlock.jsx";
import axios from "axios";
import HostBackend from "../main.jsx";
import {Link, useNavigate} from "react-router-dom";
import SmallTitle from "../ui/SmallTitle.jsx";


function Subscriptions(props) {

    const [subscriptions, setSubscriptions] = useState([]);
    const Navigate = useNavigate();

    useEffect(() => {
        let language = 'en';
        if (localStorage.getItem('language')) {
            language = localStorage.getItem('language');
        }
        axios.get(HostBackend + 'auth_status/', { params: { language }, withCredentials: true })
        .then(response => {
            if(!response.data.authenticated){
                Navigate('/');
            }
        })
        .catch(error => {
            console.error("Error fetching services:", error);
        });
        axios.get(HostBackend + 'info_user/', {
            withCredentials: true
        })
        .then(response => {
            setSubscriptions(response.data.subscriptions);
        })
        .catch(error => {
            console.error("Error fetching services:", error);
        });

    }, []);

    return (
        <div className='profile'>
            <h1 className='profile__title'>Personal data management</h1>
            <div className="profile__content">
                <MenuBlock profile={false}/>
                <div className="content__account content__subscriptions">
                    {subscriptions.length > 0 ? (
                        <>
                            {subscriptions.map((item) => (
                                <section className='subscriptions__card' key={item.id}>
                                    <article className='card__article' style={{backgroundColor: item.color}}>
                                        <h2 className='card__title'>{item.plan_name} {item.service_name}</h2>
                                    </article>
                                    <p className='info__description'>{item.description}</p>
                                </section>
                            ))}
                        </>
                    ) : (
                        <SmallTitle name='No subscriptions' />
                    )}

                </div>
            </div>
            <InviteFriend/>
        </div>
    );
}

export default Subscriptions;