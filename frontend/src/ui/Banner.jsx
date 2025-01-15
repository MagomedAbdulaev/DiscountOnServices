import React, {useState, useRef} from 'react';
import BannerImage from '../assets/images/banner.png';
import Button from "./Button.jsx";
import './Banner.css';
import axios from "axios";
import HostBackend, {getCookie} from "../main.jsx";
import Input from "./Input.jsx";
import ReCAPTCHA from "react-google-recaptcha";
import Message from "./Message.jsx";


function Banner(props) {

    const [modalOpen, setModalOpen] = useState(false);
    const [messageOpen, setMessageOpen] = useState(false);
    const [captchaToken, setCaptchaToken] = useState(''); // Состояние для токена капчи
    const [captchaError, setCaptchaError] = useState(''); // Ошибка капчи
    const [email, setEmail] = useState('');
    const [emailError, setEmailError] = useState('');
    const [username, setUsername] = useState('');
    const [usernameError, setUsernameError] = useState('');
    const [phone, setPhone] = useState('');
    const [phoneError, setPhoneError] = useState('');

    const timerId = useRef(null); // Храним идентификатор таймера

    const handleSubmit = async () => {

        const regex = /^[a-zA-Z]+$/; // Регулярное выражение для проверки только букв
        if(username){
            if(!regex.test(username)){// Возвращает false, если есть что-то кроме букв, а иначе true
                setUsernameError('The input field must contain only letters')
                return;
            }
        }
        else{
            setUsernameError('Fill in the input field')
            return;
        }

        setUsernameError('');

        if(!email.includes('@')){
            setEmailError('Invalid email format')
            return;
        }

        setEmailError('');

        if(!(/^[+\d]+$/.test(phone))){
            setPhoneError('Only numbers and plus sign');
            return;
        }

        if(phone.length <= 10){
           setPhoneError('Phone length must be greater than 10');
           return;
        }

        setPhoneError('');

        // Проверка капчи
        if (!captchaToken) {
            setCaptchaError('Captcha is required');
            return;
        }

        setCaptchaError('');

        axios.post(`${HostBackend}subscription_bid/`, {
            email: email,
            phone: phone,
            username: username,
        }, {
            headers: {
                'Content-Type': 'application/json',
                'X-CSRFToken': getCookie('csrftoken'),
            },
            withCredentials: true
        }).then(response => {



            setMessageOpen(true);

            // Если таймер уже запущен, сбрасываем его
            if (timerId.current) {
                clearTimeout(timerId.current);
            }

            // Запускаем новый таймер
            timerId.current = setTimeout(() => {
                setMessageOpen(false);
            }, 4000);

            setModalOpen(false);

        }).catch(error => {
            console.log(error);
        });

    };

    const onCaptchaChange = (value) => {
        setCaptchaToken(value); // Сохраняем токен капчи
        setCaptchaError(''); // Сбрасываем ошибку капчи
    }

    const openModal = () => {
        window.scrollTo({ top: 0 });

        setModalOpen(true);
    }

    return (
        <section className='banner'>
            <div className="banner__info">
                <h2 className='info__title'>Start enjoying a benefit of up to 50%</h2>
                <p className='info__description'>
                    You have always wanted to get the same product at a special price
                    for you, without haggling - and it is yours.
                </p>
                    <Button button_data={{
                        title: 'Start using',
                        background: 'var(--white-color)',
                        color: 'var(--blue-color)',
                        padding: '15px',
                        maxWidth: '100%',
                        is_link: false,
                        click: openModal,
                    }} />
            </div>
            <div><img src={BannerImage} alt="Баннер" width='600' height='500' className='banner__image' /></div>
            {modalOpen && (
                <div className='auth__block'>
                <article className="block__article">
                    <h2 className='block__title'>Subscription Application</h2>
                    <div className="block__close" onClick={() => { setModalOpen(false); }}></div>
                </article>

                <p className="block__inscription"></p>

                <Input input_data={{
                    title: 'Enter your name',
                    type: 'text',
                    placeholder: 'Anastasiia',
                    value: username,
                    onChange: (e) => setUsername(e.target.value),
                    error: usernameError,
                }} />

                <Input input_data={{
                    title: 'E-mail',
                    type: 'email',
                    placeholder: 'Enter your e-mail',
                    value: email,
                    onChange: (e) => setEmail(e.target.value),
                    error: emailError,
                }} />

                <Input input_data={{
                    title: 'Phone',
                    type: 'tel',
                    placeholder: 'Enter your phone',
                    value: phone,
                    onChange: (e) => setPhone(e.target.value),
                    error: phoneError,
                }} />

                <div className="captcha">
                    <ReCAPTCHA
                        sitekey="6LcC5q0qAAAAAJOzGNXQwzj3xpg8mo70yYW852ov"
                        onChange={onCaptchaChange}
                    />
                    {captchaError && <span className="input_error">{captchaError}</span>} {/* Вывод ошибки капчи */}
                </div>

                <Button button_data={{
                    title: 'Apply',
                    background: 'var(--blue-color)',
                    color: 'var(--white-color)',
                    padding: '15px',
                    maxWidth: '100%',
                    is_link: false,
                    click: handleSubmit,
                }} />
            </div>
            )}
            <div className="overlay" onClick={()=>{ setModalOpen(false); }}></div>
            <Message name='The application has been approved. You will be contacted shortly'
                     message_open={messageOpen} set_message_open={setMessageOpen}/>
        </section>
    );
}

export default Banner;