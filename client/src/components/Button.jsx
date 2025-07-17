import React from 'react';
import clsx from 'clsx';

const Button = ({ className, label, type, onClick = () => {}, icon: Icon }) => {
    return (
        <button
        type={type || 'button'}
        onClick={onClick}
        className={clsx('px-3 py-2 outline-none rounded', className)}
        >

            {Icon && <Icon className="mr-2 inline-block" />}
            <span>{label}</span>
        </button>
    );
};

export default Button;
