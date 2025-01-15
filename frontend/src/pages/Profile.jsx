import React, {useEffect, useState, useRef} from 'react';
import InviteFriend from "../ui/InviteFriend.jsx";
import axios from "axios";
import HostBackend from "../main.jsx";
import {useNavigate} from "react-router-dom";
import MenuBlock from "../ui/MenuBlock.jsx";
import './Profile.css';
import Input from "../ui/Input.jsx";
import Button from "../ui/Button.jsx";
import Message from "../ui/Message.jsx";


function Profile(props) {

    const Navigate = useNavigate();
    const [userId, setUserId] = useState('');
    const [userName, setUserName] = useState('');
    const [userNameError, setUserNameError] = useState('');
    const [userEmail, setUserEmail] = useState('');
    const [messageOpen, setMessageOpen] = useState(false);
    const timerId = useRef(null); // Храним идентификатор таймера

    useEffect(() => {
        axios.get(HostBackend + 'auth_status/', {
            withCredentials: true
        })
        .then(response => {
            if(!response.data.authenticated){
                Navigate('/');
                return;
            }
        })
        .catch(error => {
            console.error("Error fetching services:", error);
        });
        axios.get(HostBackend + 'info_user/', {
            withCredentials: true
        })
        .then(response => {
            setUserId(response.data.id);
            setUserName(response.data.username);
            setUserEmail(response.data.email);
        })
        .catch(error => {
            console.error("Error fetching services:", error);
        });

    }, []);

    const handleClickSubmit = () =>{

        const regex = /^[a-zA-Z]+$/; // Регулярное выражение для проверки только букв
        if(userName){
            if(!regex.test(userName)){// Возвращает false, если есть что-то кроме букв, а иначе true
                setUserNameError('The input field must contain only letters')
                return;
            }
        }
        else{
            setUserNameError('Fill in the input field')
            return;
        }
        setUserNameError('');

        axios.get(HostBackend + 'change_user_info/', { params: { userName }, withCredentials: true })
        .then(response => {

            if(response.data.error){
                setUserNameError(response.data.error);
                return
            }

            setMessageOpen(true);
            // Если таймер уже запущен, сбрасываем его
            if (timerId.current) {
                clearTimeout(timerId.current);
            }

            // Запускаем новый таймер
            timerId.current = setTimeout(() => {
                setMessageOpen(false);
            }, 4000);

        })
        .catch(error => {
            console.error("Error fetching services:", error);
        });
    }

    return (
        <div className='profile'>
            <h1 className='profile__title'>Personal data management</h1>
            <div className="profile__content">
                <MenuBlock profile={true}/>
                <div className="content__account">
                    <h2 className='account__title'>Account info</h2>
                    <Input input_data={{
                        title: 'ID user',
                        type: 'text',
                        placeholder: 'Enter your id',
                        value: userId,
                        onChange: () => {},
                        error: '',
                        readonly: true,
                    }} />
                    <Input input_data={{
                        title: 'How can I call you?',
                        type: 'text',
                        placeholder: 'Enter your name',
                        value: userName,
                        onChange: (e) => setUserName(e.target.value),
                        error: userNameError,
                    }} />
                    <Input input_data={{
                        title: 'E-mail',
                        type: 'email',
                        placeholder: 'Enter your e-mail',
                        value: userEmail,
                        onChange: () => {},
                        error: '',
                        readonly: true,
                    }} />
                    <Button button_data={{
                        title: 'Save changes',
                        background: 'var(--blue-color)',
                        color: 'var(--white-color)',
                        padding: '15px',
                        maxWidth: '100%',
                        is_link: false,
                        click: handleClickSubmit,
                    }} />
                </div>
                <Message message_open={messageOpen} name='Username saved'/>
            </div>
            <InviteFriend/>
        </div>
    );
}

export default Profile;