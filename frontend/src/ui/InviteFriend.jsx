import React, {useState, useRef} from 'react';
import CopyBlackImage from '../assets/icons/copy_black.svg';
import SuccessImage from '../assets/icons/success.svg';
import './InviteFriend.css';
import Message from "./Message.jsx";


function InviteFriend(props) {

    const [isCopy, setIsCopy] = useState(false);
    const [messageOpen, setMessageOpen] = useState(false);

    const timerId = useRef(null); // Храним идентификатор таймера

    const handleClickCopy = () => {
        navigator.clipboard.writeText('https://t.me/DiscountsOnServices_bot?start=343964809');
        setIsCopy(true);
        setMessageOpen(true);

        // Если таймер уже запущен, сбрасываем его
        if (timerId.current) {
            clearTimeout(timerId.current);
        }

        // Запускаем новый таймер
        timerId.current = setTimeout(() => {
            setIsCopy(false);
            setMessageOpen(false);
        }, 4000);
    };

    return (
        <section className='referal'>
            <div className="referal__content">
                <div className="referal__info">
                    <h3 className='info__title'>Invite friends</h3>
                    <p className='info__description'>
                        Starting today up to 50% for NETFLIX, YOUTUBE, SPOTIFY subscriptions with a secure payment from PAYPAL
                    </p>
                </div>
                <div className="referal__link">
                    <p className='link__title'>Click on the link</p>
                    <span className='link__value'>
                        <a href='https://t.me/DiscountsOnServices_bot?start=343964809' className='value__text'>DISCOUNTS ON SERVICES</a>
                        <img src={isCopy ? SuccessImage : CopyBlackImage} alt="Скопировать"
                             className='copy__image' width='16' height='16' onClick={handleClickCopy}/>
                    </span>
                </div>
            </div>
            <Message message_open={messageOpen} name='Copied to clipboard'/>
        </section>
    );
}

export default InviteFriend;