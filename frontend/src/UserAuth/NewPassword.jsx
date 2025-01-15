import React, {useState} from 'react';
import PasswordInput from "../ui/PasswordInput.jsx";
import Button from "../ui/Button.jsx";
import axios from "axios";
import HostBackend, {getCookie} from "../main.jsx";
import {useNavigate} from "react-router-dom";


function NewPassword(props) {

    const Navigate = useNavigate();
    const [password, setPassword] = useState('');
    const [passwordError, setPasswordError] = useState('');
    const [passwordConfirm, setPasswordConfirm] = useState('');

    const handleSubmit = async () => {

        if(password.length <= 4){
            setPasswordError('Password length must be greater than 4')
            return;
        }

        if(password !== passwordConfirm){
            setPasswordError("Passwords don't match");
            return;
        }

        axios.post(`${HostBackend}new_password/`, {
            password: password,
            email: localStorage.getItem('email_user') ? localStorage.getItem('email_user') : false,
        }, {
            headers: {
                'Content-Type': 'application/json',
                'X-CSRFToken': getCookie('csrftoken'),
            },
            withCredentials: true
        }).then(response => {

            props.set_auth_key('');
            Navigate('/profile'); // Перенаправляем пользователя после успешной авторизации

        }).catch(error => {
            console.log(error);
        });
    };

    return (
        <div className='auth__block'>
            <article className="block__article">
                <h2 className='block__title'>Forget Password</h2>
                <div className="block__close" onClick={() => { props.set_auth_key('') }}></div>
            </article>
            <p className="block__inscription">
                Enter a new password.
            </p>
            <div className="block__passwords">
                <PasswordInput input_data={{
                    title: 'Password',
                    value: password,
                    onChange: (e) => setPassword(e.target.value),
                    error: passwordError,
                }} />
                <PasswordInput input_data={{
                    title: 'Confirm Password',
                    value: passwordConfirm,
                    onChange: (e) => setPasswordConfirm(e.target.value),
                    error: passwordError,
                }} />
            </div>
            <Button button_data={{
                title: 'Restore Password',
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

export default NewPassword;