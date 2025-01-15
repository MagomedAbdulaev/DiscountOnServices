import React from 'react';

function Input(props) {
    return (
        <label className='label'>
            <span className="label__content">
                {props.input_data.title}
                <input
                    type={props.input_data.type}
                    placeholder={props.input_data.placeholder}
                    value={props.input_data.value || ''}
                    onChange={props.input_data.onChange}
                    readOnly={props.input_data.readonly}
                    className='label__input' required />
            </span>
            {props.input_data.error && (
                <span className="input_error">{props.input_data.error}</span>
            )}

        </label>
    );
}

export default Input;