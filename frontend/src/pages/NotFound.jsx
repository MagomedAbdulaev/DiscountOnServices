import React, {useEffect} from 'react';
import Title from "../ui/Title.jsx";

function NotFound(props) {

    useEffect(()=>{
        window.scrollTo({ top: 0 }); // Плавная прокрутка наверх
    }, [])

    return (
        <Title title='This page was not found' />
    );
}

export default NotFound;