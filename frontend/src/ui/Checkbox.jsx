import React from 'react';
import {Link} from "react-router-dom";
import CheckMarkImage from '../assets/icons/check_mark.svg';

function Checkbox(props) {
    return (
        <label className='label__checkbox'>
            <input
                type="checkbox"
                checked={props.input_data.checked || false}
                onChange={props.input_data.onChange}
                className='checkbox__input' required/>
            <span className="checkbox">
                <img src={CheckMarkImage} alt="Включён" className='checkbox__image' width='12px'/>
            </span>
            <p className='checkbox__text'>
                By creating an account you agree to our <Link className='text__link'>Privacy Policy</Link> and <Link className='text__link'>Terms of Service</Link>.
            </p>
            {props.input_data.error && (
                <span className="checkbox__error">To continue, click on the box</span>
            )}
        </label>
    );
}

export default Checkbox;