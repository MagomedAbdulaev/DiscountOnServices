import React from 'react';
import './SmallTitle.css';

function SmallTitle(props) {
    return (
        <h2 className='small_title'>{props.name}</h2>
    );
}

export default SmallTitle;