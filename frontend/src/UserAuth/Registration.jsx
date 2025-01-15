import React, { useState } from 'react';
import './UserAuth.css';
import Input from "../ui/Input.jsx";
import PasswordInput from "../ui/PasswordInput.jsx";
import Button from "../ui/Button.jsx";
import Checkbox from "../ui/Checkbox.jsx";
import axios from 'axios';
import HostBackend, {getCookie} from "../main.jsx";
import ReCAPTCHA from "react-google-recaptcha";


function Registration(props) {

    const [username, setUsername] = useState('');
    const [usernameError, setUsernameError] = useState('');
    const [email, setEmail] = useState('');
    const [emailError, setEmailError] = useState('');
    const [password, setPassword] = useState('');
    const [passwordError, setPasswordError] = useState('');
    const [agreeTerms, setAgreeTerms] = useState(false);
    const [agreeTermsDisplayError, setAgreeTermsDisplayError] = useState(false);
    const [captchaToken, setCaptchaToken] = useState(''); // Состояние для токена капчи
    const [captchaError, setCaptchaError] = useState(''); // Ошибка капчи

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

        if(password.length <= 4){
            setPasswordError('Password length must be greater than 4')
            return;
        }

        setPasswordError('');

        if (!agreeTerms) {
            setAgreeTermsDisplayError(true);
            return;
        }

        // Проверка капчи
        if (!captchaToken) {
            setCaptchaError('Captcha is required');
            return;
        }

        setCaptchaError('');
        setAgreeTermsDisplayError(false);

        axios.post(`${HostBackend}registration_user/`, {
            email: email,
            password: password,
            username: username,
        }, {
            headers: {
                'Content-Type': 'application/json',
                'X-CSRFToken': getCookie('csrftoken'),
            },
            withCredentials: true
        }).then(response => {

            let email_response = response.data.email;
            if (email_response) {
                setEmailError(email_response);
                return;
            }

            let username_response = response.data.username;
            if (username_response) {
                setUsernameError(username_response);
                return;
            }

            localStorage.setItem('email_user', email);
            localStorage.removeItem('password');

            props.set_auth_key('email_confirm');  // Подтверждение почты
        }).catch(error => {
            console.log(error);
        });

    };

    const onCaptchaChange = (value) => {
        setCaptchaToken(value); // Сохраняем токен капчи
        setCaptchaError(''); // Сбрасываем ошибку капчи
    }

    return (
        <div className='auth__block'>
            <article className="block__article">
                <h2 className='block__title'>Create an account</h2>
                <div className="block__close" onClick={() => { props.set_auth_key('') }}></div>
            </article>
            <p className="block__inscription">
                Already have an account? <span className='inscription__link' onClick={() => { props.set_auth_key('login') }}>Sign In</span>
            </p>

            <Input input_data={{
                title: 'Username',
                type: 'text',
                placeholder: 'Enter your name',
                value: username,
                onChange: (e) => setUsername(e.target.value),
                error: usernameError,
            }} />

            <Input input_data={{
                title: 'Email Address',
                type: 'email',
                placeholder: 'Enter your e-mail',
                value: email,
                onChange: (e) => setEmail(e.target.value),
                error: emailError,
            }} />

            <PasswordInput input_data={{
                title: 'Password',
                value: password,
                onChange: (e) => setPassword(e.target.value),
                error: passwordError,
            }} />

            <div className="captcha">
                <ReCAPTCHA
                    sitekey="6LcC5q0qAAAAAJOzGNXQwzj3xpg8mo70yYW852ov"
                    onChange={onCaptchaChange}
                />
                {captchaError && <span className="input_error">{captchaError}</span>} {/* Вывод ошибки капчи */}
            </div>

            <Checkbox input_data={{
                checked: agreeTerms,
                error: agreeTermsDisplayError,
                onChange: (e) => setAgreeTerms(e.target.checked),
            }} />

            <Button button_data={{
                title: 'Sign up',
                background: 'var(--blue-color)',
                color: 'var(--white-color)',
                padding: '12px',
                maxWidth: '100%',
                is_link: false,
                click: handleSubmit,
            }} />
        </div>
    );
}

export default Registration;
