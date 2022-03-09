import React, { useRef, /* useEffect, */ useImperativeHandle } from "react";
import classes from './Input.module.css';

const Input = React.forwardRef((props, ref) => {
    const inputref = useRef();

    /* useEffect(() => {
        inputref.current.focus()
    }, []); // this would run only once after the coponent is mounted
    // then focus first on email */
    const activate = () => {
        inputref.current.focus()
    }

    useImperativeHandle(ref, () => {
        return {
            focus: activate
        }
    })
    return (
        <div
            className={`${classes.control} ${props.isValid === false ? classes.invalid : ''
                }`}
        >
            <label htmlFor={props.id}>{props.label}</label>
            <input
                ref={inputref}
                type={props.type}
                id={props.id}
                value={props.value}
                onChange={props.onChange}
                onBlur={props.onBlur}
            />
        </div>
    )
});

export default Input