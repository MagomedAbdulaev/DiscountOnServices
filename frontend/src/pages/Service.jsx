import React, {useEffect, useState} from 'react';
import {useNavigate, useParams} from "react-router-dom";
import HostBackend, {getCookie} from "../main.jsx";
import axios from "axios";
import InviteFriend from "../ui/InviteFriend.jsx";
import Faq from "../ui/Faq.jsx";
import Plan from "../ui/Plan.jsx";
import './Service.css';
import Input from "../ui/Input.jsx";
import Button from "../ui/Button.jsx";
import SuccessImage from "../assets/icons/successfull.svg";


function Service(props) {

    const {slug} = useParams();
    const Navigate = useNavigate();
    const [serviceData, setServiceData] = useState({'durations': [], 'plans': []});
    const [modalOpen, setModalOpen] = useState(false);
    const [successOpen, setSuccessOpen] = useState(false);
    const [cardNumber, setCardNumber] = useState('');
    const [cardNumberError, setCardNumberError] = useState('');
    const [expirationDate, setExpirationDate] = useState('');
    const [expirationDateError, setExpirationDateError] = useState('');
    const [cvcNumber, setCvcNumber] = useState('');
    const [cvcNumberError, setCvcNumberError] = useState('');
    const [currentDuration, setCurrentDuration] = useState(null); // Начальное значение null
    const [pricePlan, setPricePlan] = useState(false);

    const handleModalOpen = (price) => {
        window.scrollTo({ top: 0 });
        setModalOpen(!modalOpen);
        setPricePlan(price);
    }

    const handleSubmit = () => {
        if (cardNumber.length !== 16 || !(/^[+\d]+$/.test(cardNumber))) {
            setCardNumberError('Card number must be 16 digits and contain only numbers');
            return;
        } else {
            setCardNumberError('');
        }

        if (!/^\d{2}\/\d{2}$/.test(expirationDate)) {
            setExpirationDateError('Expiration date must be in MM/ГГ format');
            return;
        } else {
            setExpirationDateError('');
        }

        if (cvcNumber.length !== 3 || !(/^\d{3}$/.test(cvcNumber))) {
            setCvcNumberError('CVC must be 3 digits');
            return;
        } else {
            setCvcNumberError('');
        }

        axios.post(HostBackend + 'tokenize_card/', {
            cardNumber,
            expirationDate,
            cvcNumber,
            pricePlan,
        }, {
            headers: {
                'Content-Type': 'application/json',
                'X-CSRFToken': getCookie('csrftoken'),
            },
            withCredentials: true
        })
        .then((response) => {
            if (response.data.success) {
                window.location.href = response.data.confirmation_url; // Перенаправляем на URL подтверждения
                setModalOpen(false);
                setSuccessOpen(true);
            } else {
                setCvcNumberError(response.data.error || 'Something went wrong');
            }
        })
        .catch((error) => {
            console.error(error);
            setCvcNumberError('Error occurred during payment');
        });

        // axios.get(HostBackend + 'check_payment/', {
        //     params: {
        //         cardNumber, expirationDate, cvcNumber, pricePlan
        //     }
        // })
        // .then(response => {
        //     setModalOpen(false);
        //     setSuccessOpen(true);
        // })
        // .catch(error => {
        //     console.error("Error fetching services:", error);
        // });

    };

    const handleCardNumberChange = (e) => {
        const value = e.target.value;
        setCardNumber(value);

        if (value.length === 16 && /^[+\d]+$/.test(value)) {
            setCardNumberError('');
        } else {
            setCardNumberError('Card number must be 16 digits and contain only numbers');
        }
    };

    const handleExpirationDateChange = (e) => {
        let value = e.target.value;

        // Удаляем все символы, кроме цифр
        value = value.replace(/[^0-9]/g, '');

        // Добавляем `/` после двух символов (если ещё не добавлено)
        if (value.length > 1) {
            value = value.slice(0, 2) + '/' + value.slice(2, 4);
        }

        // Ограничиваем длину до 5 символов (формат MM/ГГ)
        if (value.length > 5) {
            value = value.slice(0, 5);
        }

        // Проверяем месяц (первые два символа)
        const month = parseInt(value.slice(0, 2), 10);
        if (month > 12) {
            setExpirationDateError('Month cannot be greater than 12');
        } else {
            setExpirationDateError('');
        }

        setExpirationDate(value);

        // Проверяем общий формат (если ошибок месяца нет)
        if (!expirationDateError && !/^\d{2}\/\d{2}$/.test(value)) {
            setExpirationDateError('Expiration date must be in MM/ГГ format');
        }
    };

    const handleCvcNumberChange = (e) => {
        const value = e.target.value;
        setCvcNumber(value);

        if (value.length === 3 && /^\d{3}$/.test(value)) {
            setCvcNumberError('');
        } else {
            setCvcNumberError('CVC must be 3 digits');
        }
    };

    useEffect(() => {
        let language = 'en';
        if (localStorage.getItem('language')) {
            language = localStorage.getItem('language');
        }

        axios.get(HostBackend + 'service_detail/', { params: { language, slug } })
            .then(response => {
                if(response.data.error){
                    Navigate('/not_found');
                    return;
                }
                setServiceData(response.data);
                if (response.data.durations.length > 0) {
                    setCurrentDuration(response.data.durations[0]); // Устанавливаем первую длительность
                }
            })
            .catch(error => {
                console.error("Error fetching services:", error);
            });
    }, [slug]);

    const filteredPlans = currentDuration
        ? serviceData.plans.filter(plan => plan.duration === currentDuration)
        : serviceData.plans;

    return (
        <div className='service'>
            <div className="overlay" onClick={()=>{ setModalOpen(false); setSuccessOpen(false); }}></div>
            <article className="service__article">
                <h1 className='article__title'>
                    Choose a <span className='title__service'>{serviceData.name}</span> Plan
                </h1>
                {serviceData.durations.length >= 2 ? (
                    <>
                        <p className='article__description'>Listen without limits at a bargain price</p>
                        <ul className='durations'>
                            {serviceData.durations.map((item, index) => (
                                <li
                                    className={
                                        currentDuration === item
                                            ? 'durations__item durations__item--active'
                                            : 'durations__item'
                                    }
                                    key={index}
                                    onClick={() => setCurrentDuration(item)}
                                >
                                    {item} months
                                </li>
                            ))}
                        </ul>
                    </>
                ) : (
                    <p className='one__duration'>
                        Select the subscription type for a period of
                        <span className='duration__value'>
                             {serviceData.durations[0]} months:
                        </span>
                    </p>
                )}
            </article>
            <div className='service__content'>
                {filteredPlans.map(item => (
                    <Plan
                        plan_data={{
                            name: item.name,
                            price: item.price,
                            clauses: item.clauses,
                            handle_modal_open: () => handleModalOpen(item.price),
                        }}
                        key={item.id}
                    />
                ))}
            </div>
            <InviteFriend/>
            <Faq/>
            {modalOpen && (
                <div className='auth__block'>
                    <article className="block__article">
                        <h2 className='block__title'>Purchase payment</h2>
                        <div className="block__close" onClick={handleModalOpen}></div>
                    </article>
                    <Input input_data={{
                        title: 'Card Number',
                        type: 'number',
                        placeholder: '1234 1234 1234 1234',
                        value: cardNumber,
                        onChange: handleCardNumberChange,
                        error: cardNumberError,
                    }} />
                    <div className="block__card">
                        <Input input_data={{
                            title: 'Expiration Date',
                            type: 'text',
                            placeholder: 'MM/ГГ',
                            value: expirationDate,
                            onChange: handleExpirationDateChange,
                            error: expirationDateError,
                        }} />
                        <Input input_data={{
                            title: 'СVC',
                            type: 'number',
                            placeholder: 'СVC',
                            value: cvcNumber,
                            onChange: handleCvcNumberChange,
                            error: cvcNumberError,
                        }} />
                    </div>
                    <Button button_data={{
                        title: 'Pay with card',
                        background: 'var(--blue-color)',
                        color: 'var(--white-color)',
                        padding: '16px',
                        maxWidth: '500px',
                        is_link: false,
                        click: handleSubmit,
                    }} />
                    <p className='we_dont_honestly'>
                        We do not collect information on your cards, everything is safe
                    </p>
                </div>
            )}
            {successOpen && (
                <div className='auth__block modal__success'>
                    <article className="block__article">
                        <h2 className='block__title'></h2>
                        <div className="block__close" onClick={()=>{setSuccessOpen(false)}}></div>
                    </article>
                    <div className="success__info">
                        <img src={SuccessImage} alt="Успешно" width='150' height='140' />
                        <h3 className='success__title'>Subscription paid</h3>
                    </div>
                    <Button button_data={{
                        title: 'Continue work',
                        background: 'var(--blue-color)',
                        color: 'var(--white-color)',
                        padding: '16px',
                        maxWidth: '500px',
                        is_link: false,
                        click: ()=>{setSuccessOpen(false)},
                    }} />

                </div>
            )}
        </div>
    );
}

export default Service;
