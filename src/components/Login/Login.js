import React, { useState } from 'react';

import Card from '../UI/Card/Card';
import classes from './Login.module.css';
import Button from '../UI/Button/Button';

const Login = props => {
    const [enteredEmail, setEnteredEmail] = useState('');
    const [emailIsValid, setEmailIsValid] = useState(true);

    const [enteredPassword, setEnteredPassword] = useState('');
    const [passwordIsValid, setPasswordIsValid] = useState(true);

    const [formIsValid, setFormIsValid] = useState(false);

    const isValidEmail = email => email.includes('@');
    const isValidPassword = password => password.trim().length > 6;

    const emailChangeHandler = event => {
        setEnteredEmail(event.target.value);

        setFormIsValid(
            isValidEmail(event.target.value) && isValidPassword(enteredPassword)
        );
    };

    const passwordChangeHandler = event => {
        setEnteredPassword(event.target.value);

        setFormIsValid(
            isValidPassword(event.target.value) && isValidEmail(enteredEmail)
        );
    };

    const validateEmailHandler = () => {
        setEmailIsValid(isValidEmail(enteredEmail));
    };

    const validatePasswordHandler = () => {
        setPasswordIsValid(isValidPassword(enteredPassword));
    };

    const submitHandler = event => {
        event.preventDefault();
        props.onLogin(enteredEmail, enteredPassword);
    };

    return (
        <Card className={classes.login}>
            <form onSubmit={submitHandler}>
                <div
                    className={`${classes.control} ${
                        !emailIsValid || !formIsValid ? classes.invalid : ''
                    }`}
                >
                    <label htmlFor="email">E-Mail</label>
                    <input
                        type="email"
                        id="email"
                        value={enteredEmail}
                        onChange={emailChangeHandler}
                        onBlur={validateEmailHandler}
                    />
                </div>
                <div
                    className={`${classes.control} ${
                        !passwordIsValid || !formIsValid ? classes.invalid : ''
                    }`}
                >
                    <label htmlFor="password">Password</label>
                    <input
                        type="password"
                        id="password"
                        value={enteredPassword}
                        onChange={passwordChangeHandler}
                        onBlur={validatePasswordHandler}
                    />
                </div>
                <div className={classes.actions}>
                    <Button
                        type="submit"
                        className={classes.btn}
                        disabled={!formIsValid}
                    >
                        Login
                    </Button>
                </div>
            </form>
        </Card>
    );
};

export default Login;
