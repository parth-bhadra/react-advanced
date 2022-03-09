import React, { useState, useEffect, useReducer } from 'react';

import Card from '../UI/Card/Card';
import classes from './Login.module.css';
import Button from '../UI/Button/Button';

const emailReducer = (state, action) => {
  if (action.type === 'USER_INPUT') {
    return { value: action.val, isValid: action.val.includes('@') }
  }
  if (action.type === 'INPUT_BLUR') {
    return { value: state.value, isValid: state.value.includes('@') }
  }
  return { value: '', isValid: false }
}

const passwordReducer = (state, action) => {
  if (action.type === 'USER_INPUT') {
    return { value: action.val, isValid: action.val.trim().length > 6 }
  }
  if (action.type === 'INPUT_BLUR') {
    return { value: state.value, isValid: state.value.trim().length > 6 }
  }
  return { value: '', isValid: false }
}

const Login = (props) => {
  // const [enteredEmail, setEnteredEmail] = useState(''); commented while using reducer
  // const [emailIsValid, setEmailIsValid] = useState();
  // const [enteredPassword, setEnteredPassword] = useState('');
  // const [passwordIsValid, setPasswordIsValid] = useState();
  const [formIsValid, setFormIsValid] = useState(false);

  const [emailState, dispatchEmail] = useReducer(emailReducer, {
    value: '',
    isValid: null
  });

  const [passwordState, dispatchPassword] = useReducer(passwordReducer, {
    value: '',
    isValid: null
  });

  useEffect(() => {

    const identifier = setTimeout(() => {
      console.log('checking form validity');
      // even here staete gets updated on basis of other states
      // why is ok here then?
      // because whenever the dependencies change, use effect is guaranteed to run the setIsFormValid function with latest state snapshots of the updated dependencies
      setFormIsValid(
        emailState.isValid && passwordState.isValid
      );
    }, 1000)
    // this is a clean up function
    // this runs every time before use effect runs except for the first time
    // and whenever the component you are specifying it in unmounts from the DOM
    return () => {
      console.log('cleanup');
      clearTimeout(identifier);
    }

  }, [emailState.isValid, passwordState.isValid]); // add as dependencies what you are using in your useEffect function
  // here it is entered email, entered password, and setFormIsValid
  // you can omit setFormIsValid because these are state updating functions and will never change

  const emailChangeHandler = (event) => {
    // setEnteredEmail(event.target.value); commented while implementing reducer
    // arguments of dispatch email get passed as email reducers action argument (see emailReducer)
    dispatchEmail({
      type: 'USER_INPUT',
      val: event.target.value
    })
    // using reducer still does not help with updating the state based on some other state
    // so we comment the code below and move it inside the use effect hook
    /* setFormIsValid(
      emailState.isValid && passwordState.isValid
    ); */
  };

  const passwordChangeHandler = (event) => {
    // setEnteredPassword(event.target.value); commented while implementing reducer
    dispatchPassword({
      type: 'USER_INPUT',
      val: event.target.value
    })
    /* setFormIsValid(
      emailState.isValid && passwordState.isValid
    ); */
  };

  const validateEmailHandler = () => {
    // commented while implementing reducer
    // setEmailIsValid(emailState.isValid); // this is a violation of our updating state on some other state and not a previous version of it - this is a good use case for use reducer
    // there is no value here because there is no extra data being added, only that the input lost focus
    dispatchEmail({
      type: 'INPUT_BLUR'
    })
  };

  const validatePasswordHandler = () => {
    // setPasswordIsValid(enteredPassword.trim().length > 6); // commented while implementing reducer
    dispatchPassword({
      type: 'INPUT_BLUR'
    })
  };

  const submitHandler = (event) => {
    event.preventDefault();
    props.onLogin(emailState.value, passwordState.value);
  };

  return (
    <Card className={classes.login}>
      <form onSubmit={submitHandler}>
        <div
          className={`${classes.control} ${emailState.isValid === false ? classes.invalid : ''
            }`}
        >
          <label htmlFor="email">E-Mail</label>
          <input
            type="email"
            id="email"
            value={emailState.value}
            onChange={emailChangeHandler}
            onBlur={validateEmailHandler}
          />
        </div>
        <div
          className={`${classes.control} ${passwordState.isValid === false ? classes.invalid : ''
            }`}
        >
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            value={passwordState.value}
            onChange={passwordChangeHandler}
            onBlur={validatePasswordHandler}
          />
        </div>
        <div className={classes.actions}>
          <Button type="submit" className={classes.btn} disabled={!formIsValid}>
            Login
          </Button>
        </div>
      </form>
    </Card>
  );
};

export default Login;
