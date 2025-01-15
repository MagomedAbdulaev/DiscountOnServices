import React, {useState} from 'react';
import './UserAuth.css';
import Input from "../ui/Input.jsx";
import Button from "../ui/Button.jsx";
import axios from "axios";
import HostBackend, {getCookie} from "../main.jsx";
import ReCAPTCHA from "react-google-recaptcha";


function ForgetPassword(props) {

    const [email, setEmail] = useState('');
    const [emailError, setEmailError] = useState('');
    const [captchaToken, setCaptchaToken] = useState(''); // Состояние для токена капчи
    const [captchaError, setCaptchaError] = useState(''); // Ошибка капчи

    const handleSubmit = async () => {
        // Проверка email
        if (!email.includes('@')) {
            setEmailError('Invalid email format');
            return;
        }

        // Проверка капчи
        if (!captchaToken) {
            setCaptchaError('Captcha is required');
            return;
        }

        axios.post(`${HostBackend}forget_password/`, {
            email: email,
            captcha: captchaToken, // Отправляем токен капчи на сервер
        }, {
            headers: {
                'Content-Type': 'application/json',
                'X-CSRFToken': getCookie('csrftoken'),
            },
            withCredentials: true,
        })
            .then(response => {
                if (response.data.status === 'error') {
                    setEmailError(response.data.error_text);
                    return;
                }
                localStorage.setItem('password', true);
                props.set_auth_key('email_confirm');
            })
            .catch(error => {
                console.error("Error fetching services:", error);
            });
    }

    const onCaptchaChange = (value) => {
        setCaptchaToken(value); // Сохраняем токен капчи
        setCaptchaError(''); // Сбрасываем ошибку капчи
    }

    return (
        <div className='auth__block'>
            <article className="block__article">
                <h2 className='block__title'>Forget Password</h2>
                <div className="block__close" onClick={() => { props.set_auth_key('') }}></div>
            </article>
            <p className="block__inscription">
                We will send reset code in this email.
            </p>
            <Input input_data={{
                title: 'Email Address',
                type: 'email',
                placeholder: 'name@gmail.com',
                value: email,
                onChange: (e) => setEmail(e.target.value),
                error: emailError,
            }}/>
            <div className="captcha">
                <ReCAPTCHA
                    sitekey="6LcC5q0qAAAAAJOzGNXQwzj3xpg8mo70yYW852ov"
                    onChange={onCaptchaChange}
                />
                {captchaError && <span className="input_error">{captchaError}</span>} {/* Вывод ошибки капчи */}
            </div>
            <Button button_data={{
                title: 'Submit',
                background: 'var(--blue-color)',
                color: 'var(--white-color)',
                padding: '12px',
                maxWidth: '460px',
                is_link: false,
                click: handleSubmit,
            }} />
        </div>
    );
}

export default ForgetPassword;