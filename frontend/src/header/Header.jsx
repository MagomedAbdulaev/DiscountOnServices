import React, { useState, useEffect } from 'react';
import './Header.css';
import Logo from "../ui/Logo.jsx";
import HeaderMobile from "./HeaderMobile.jsx";
import Registration from "../UserAuth/Registration.jsx";
import ForgetPassword from "../UserAuth/ForgetPassword.jsx";
import Login from "../UserAuth/Login.jsx";
import EmailConfirm from "../UserAuth/EmailConfirm.jsx";
import NewPassword from "../UserAuth/NewPassword.jsx";


function Header(props) {

    const [widthWindow, setWidthWindow] = useState(window.innerWidth);
    const handleResize = () => setWidthWindow(window.innerWidth);
    const [authKey, setAuthKey] = useState('');
    const LogoTextIsVisible = widthWindow > 375;

    useEffect(() => {
        window.addEventListener('resize', handleResize);
    }, []);

    let authComponent = null;

    if (authKey === 'registration') {
        authComponent = <Registration set_auth_key={setAuthKey} />;
    } else if (authKey === 'login') {
        authComponent = <Login set_auth_key={setAuthKey} />;
    } else if (authKey === 'password') {
        authComponent = <ForgetPassword set_auth_key={setAuthKey} />;
    } else if (authKey === 'email_confirm') {
        authComponent = <EmailConfirm set_auth_key={setAuthKey} />;
    } else if (authKey === 'new_password') {
        authComponent = <NewPassword set_auth_key={setAuthKey} />;
    }

    return (
        <header className='header' id='header'>
            <div className="header__content">
                <Logo width='54' text_is_visible={LogoTextIsVisible} />
                <HeaderMobile widthWindow={widthWindow} auth_key={authKey} set_auth_key={setAuthKey} />
            </div>
            <div className="overlay" onClick={()=>{ setAuthKey(false); }}></div>
            {authComponent}
        </header>
    );
}

export default Header;