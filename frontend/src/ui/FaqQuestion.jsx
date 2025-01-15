import React, {useState} from 'react';
import DropDownArrowBlackImage from '../assets/icons/dropdown_arrow_black.svg';


function FaqQuestion(props) {

    const [answerDisplay, setAnswerDisplay] = useState(false);

    return (
        <div className='faq__block' onClick={()=>{setAnswerDisplay(!answerDisplay)}}>
            <article className="faq__question">
                <p className='question__title'>{props.question_data.name}</p>
                <img src={DropDownArrowBlackImage} alt="Открыть"
                     width='7' height='14' className={answerDisplay ? 'arrow__image arrow__image--active' : 'arrow__image'} />
            </article>
            {answerDisplay && (
                <p className="faq__answer">{props.question_data.answer}</p>
            )}
        </div>
    );
}

export default FaqQuestion;