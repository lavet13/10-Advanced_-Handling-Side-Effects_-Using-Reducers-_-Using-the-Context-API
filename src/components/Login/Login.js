import React, { useState, useEffect, useReducer } from 'react';

import Card from '../UI/Card/Card';
import classes from './Login.module.css';
import Button from '../UI/Button/Button';

const isValidEmail = email => email.includes('@');
const isValidPassword = password => password.trim().length > 6;

const reducerHelper = (state, action, validationHandler) => {
    switch (action.type) {
        case 'USER_INPUT':
            return {
                value: action.payload,
                isValid: validationHandler(action.payload),
            };

        case 'INPUT_BLUR':
            return {
                value: state.value,
                isValid: validationHandler(state.value),
            };

        default:
            return state;
    }
};

const initialEmailState = { value: '', isValid: null };
const emailReducer = (state, action) =>
    reducerHelper(state, action, isValidEmail);

const initialPasswordState = { value: '', isValid: null };
const passwordReducer = (state, action) =>
    reducerHelper(state, action, isValidPassword);

const Login = ({ onLogin }) => {
    // const [enteredEmail, setEnteredEmail] = useState('');
    // const [emailIsValid, setEmailIsValid] = useState(true);

    const [emailState, dispatchEmail] = useReducer(
        emailReducer,
        initialEmailState
    );

    // const [enteredPassword, setEnteredPassword] = useState('');
    // const [passwordIsValid, setPasswordIsValid] = useState(true);
    const [passwordState, dispatchPassword] = useReducer(
        passwordReducer,
        initialPasswordState
    );

    const [formIsValid, setFormIsValid] = useState(null);

    // technique debouncing. We wanna debounce the user input.

    /*
    useEffect(() => {
        const identifier = (async () => {
            return await new Promise(resolve => {
                resolve(
                    setTimeout(() => {
                        setFormIsValid(
                            isValidEmail(enteredEmail) &&
                                isValidPassword(enteredPassword)
                        );
                    }, 500)
                );
            });
        })();
        console.log('EFFECT RUNNING 1');

        // That's a so-called cleanup function. This will run as a cleanup process before useEffect executes the function.
        // So whenever this useEffect function runs before it runs, except for the very first time when it runs, this cleanup function will run.
        // And in addition, the cleanup function will run whenever the component you're specifying the effect in unmounts from the DOM.
        // So whenever the component is reused. So the cleanup function runs before every new side-effect function execution and before the component
        // is removed. And it doesn't run before the first side-effect function execution. But thereafter, it will run before every next side-effect function
        // execution.
        return () => {
            console.log('EFFECT CLEANUP 1');
            (async () => {
                clearTimeout(await identifier);
            })();
        };
    }, [enteredEmail, enteredPassword]);
    */

    const { isValid: emailIsValid } = emailState;
    const { isValid: passwordIsValid } = passwordState;

    useEffect(() => {
        setFormIsValid(emailIsValid && passwordIsValid);

        console.log('EFFECT RUNNING');
    }, [emailIsValid, passwordIsValid]);

    const emailChangeHandler = event => {
        dispatchEmail({ type: 'USER_INPUT', payload: event.target.value });
    };

    const passwordChangeHandler = event => {
        dispatchPassword({ type: 'USER_INPUT', payload: event.target.value });
    };

    const validateEmailHandler = () => {
        dispatchEmail({ type: 'INPUT_BLUR' });
    };

    const validatePasswordHandler = () => {
        dispatchPassword({ type: 'INPUT_BLUR' });
    };

    const submitHandler = event => {
        event.preventDefault();

        onLogin(emailState.value, passwordState.value);
    };

    return (
        <Card className={classes.login}>
            <form onSubmit={submitHandler}>
                <div
                    className={`${classes.control} ${
                        emailState.isValid === false && !formIsValid
                            ? classes.invalid
                            : ''
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
                    className={`${classes.control} ${
                        passwordState.isValid === false && !formIsValid
                            ? classes.invalid
                            : ''
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
