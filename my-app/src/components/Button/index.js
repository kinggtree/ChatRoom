import React from 'react';
import './Button.css';

const Button = ({children, onClick}) => (
    <button className="submit-button" onClick={onClick}>
        {children}
    </button>
)

export default Button;