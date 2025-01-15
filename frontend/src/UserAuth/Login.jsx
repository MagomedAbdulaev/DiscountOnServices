import React, { useState } from 'react';
import { getCookie } from "../main.jsx";
import HostBackend from "../main.jsx";
import Input from "../ui/Input.jsx";
import PasswordInput from "../ui/PasswordInput.jsx";
import Button from "../ui/Button.jsx";
import './UserAuth.css';
import axios from "axios";
import { useNavigate } from "react-router-dom";


function Login(props) {
    const Navigate = useNavigate();

    const [email, setEmail] = useState('');
    const [emailError, setEmailError] = useState('');
    const [password, setPassword] = useState('');
    const [passwordError, setPasswordError] = useState('');

    const handleSubmit = async () => {
        if (!email.includes('@')) {
            setEmailError('Invalid email format');
            return;
        }

        setEmailError('');

        axios.post(`${HostBackend}auth_user/`, {
            email: email,
            password: password
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

            let password_response = response.data.password;
            if (password_response) {
                setPasswordError(password_response);
                return;
            }

            props.set_auth_key('');
            Navigate('/profile');  // Перенаправляем пользователя после успешной авторизации
        }).catch(error => {
            console.log(error);
        });
    };

    return (
        <div className='auth__block'>
            <article className="block__article">
                <h2 className='block__title'>Log in</h2>
                <div className="block__close" onClick={() => { props.set_auth_key('') }}></div>
            </article>
            <p className="block__inscription">
                New user? <span className='inscription__link' onClick={() => { props.set_auth_key('registration') }}>Create an account</span>
            </p>

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

            <div className="block__item block__item--login">
                <span className='forgot_password' onClick={() => { props.set_auth_key('password') }}>Forgot password?</span>
                <Button button_data={{
                    title: 'Log in',
                    background: 'var(--blue-color)',
                    color: 'var(--white-color)',
                    padding: '12px',
                    maxWidth: '190px',
                    is_link: false,
                    click: handleSubmit,
                }} />
            </div>

        </div>
    );
}

export default Login;
