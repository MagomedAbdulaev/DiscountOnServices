import React from 'react';
import LogoImage from '../assets/icons/logo.svg';
import {Link} from "react-router-dom";
import './Logo.css';

function Logo(props) {

    const logo_styles = {
        width: `clamp(${props.width_to}px, 8vw, ${props.width_from}px)`
    }

    return (
         <Link to="/" className="logo">
            <img src={LogoImage} alt="Логотип" className="logo__image" style={logo_styles} />
            {props.text_is_visible && (
                <span className="logo__title">DiscountsOnServices</span>
            )}
        </Link>
    );
}

export default Logo;