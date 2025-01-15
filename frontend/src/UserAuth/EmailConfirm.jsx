import React, {useState} from 'react';
import Input from "../ui/Input.jsx";
import axios from "axios";
import HostBackend, {getCookie} from "../main.jsx";
import {useNavigate} from "react-router-dom";
import Button from "../ui/Button.jsx";


function EmailConfirm(props) {

    const Navigate = useNavigate();

    const [code, setCode] = useState('');
    const [codeError, setCodeError] = useState('');

    const handleSubmit = async () => {

        let address = localStorage.getItem('password') ? localStorage.getItem('password') : '';

        if(address){
            address = 'activate_email_password';
        }
        else{
            address = 'activate_email'
        }

        axios.post(`${HostBackend}${address}/`, {
            code: code,
            email: localStorage.getItem('email_user') ? localStorage.getItem('email_user') : false,
        }, {
            headers: {
                'Content-Type': 'application/json',
                'X-CSRFToken': getCookie('csrftoken'),
            },
            withCredentials: true
        }).then(response => {

            if(response.data.status === 'error'){
                setCodeError(response.data.error_text);
                return;
            }
            
            if(address === 'activate_email_password'){
                props.set_auth_key('new_password');
            }
            else{
                props.set_auth_key('');
                Navigate('/profile'); // Перенаправляем пользователя после успешной авторизации
            }
        }).catch(error => {
            console.log(error);
        });
    };

    return (
        <div className='auth__block'>
            <article className="block__article">
                <h2 className='block__title'>Email verification</h2>
                <div className="block__close" onClick={() => { props.set_auth_key('') }}></div>
            </article>
            <p className="block__inscription">
                Please enter the 6-digit verification code that was sent to {localStorage.getItem('email_user') ? localStorage.getItem('email_user') : 'your_email.com'}. The code is valid for 50 minutes.
            </p>
            <Input input_data={{
                title: 'Email verification code',
                type: 'number',
                placeholder: 'XXXXXX',
                value: code,
                onChange: (e) => setCode(e.target.value),
                error: codeError,
            }} />
            <Button button_data={{
                title: 'Sing up',
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

export default EmailConfirm;