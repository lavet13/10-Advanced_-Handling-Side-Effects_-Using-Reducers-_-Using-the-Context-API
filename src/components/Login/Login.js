import React, { useState, useEffect } from 'react';

import Card from '../UI/Card/Card';
import classes from './Login.module.css';
import Button from '../UI/Button/Button';

const Login = ({ onLogin }) => {
    const [enteredEmail, setEnteredEmail] = useState('');
    const [emailIsValid, setEmailIsValid] = useState(true);

    const [enteredPassword, setEnteredPassword] = useState('');
    const [passwordIsValid, setPasswordIsValid] = useState(true);

    const [formIsValid, setFormIsValid] = useState(false);

    // useEffect & Dependencies

    // we could remove dependencies array but don't save this because this would crash your page.
    // This would run whenever this component was reevaluated. It's the same as if we wouldn't have used the useEffect hook at all.
    // There is a simple rule you add as dependencies, what you're using in your side effect function. So in this case, we are using, the setFormIsValid
    // function. We are using enteredEmail and we are using enteredPassword. These are three things we are using here. So therefore, here, between these
    // brackets, you would add, setFormIsValid, enteredEmail, enteredPassword. Now actually, you can also omit setFormIsValid because those state updating
    // function by default are insured by React to never change. So these functions will always be the same across re-render cycles, so you can omit them.
    // Now, one aspect that could be confusing, is that of course now, inside of useEffect example, we're not working with local storage. We're not sending
    // an HTTP request. We're not setting a timer or anything like that. Instead we're updating the React state and that could be confusing if you'll recall
    // that slide from earlier, where I had a slightly different separation. So to clear that confusion, you must not forget, that it's called useEffect,
    // and it has one main job, it's there to handle side effects and often side effects are HTTP requests and so on, but it's also a side effect if we
    // listen to every keystroke and save that entered data as we're doing it in the emailChangeHandler for example and we then wanna trigger another action
    // in response to that. So checking and updating that form validity, in response to a keystroke in the email or a password field, that is also something
    // you could call a side effect. It's a side effect of the user entering data. So that's why this should not confuse you.
    // useEffect in general, is a super important hook that helps you deal with code that should be executed in response to something. And something could be
    // the component being loaded. It could be the email address being updated. It could be anything, whenever you have an action that should be executed in
    // response to some other action that is a side effect and that is where a useEffect is able to help you.

    // technique debouncing. We wanna debounce the user input.
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

        // That's a so-called cleanup function. This will run as a cleanup process before useEffect executes the function.
        // So whenever this useEffect function runs before it runs, except for the very first time when it runs, this cleanup function will run.
        // And in addition, the cleanup function will run whenever the component you're specifying the effect in unmounts from the DOM.
        // So whenever the component is reused. So the cleanup function runs before every new side-effect function execution and before the component
        // is removed. And it doesn't run before the first side-effect function execution. But thereafter, it will run before every next side-effect function
        // execution.
        return () => {
            console.log('clear timer');
            (async () => {
                clearTimeout(await identifier);
            })();
        };
    }, [enteredEmail, enteredPassword]);

    const isValidEmail = email => email.includes('@');
    const isValidPassword = password => password.trim().length > 6;

    const emailChangeHandler = event => {
        setEnteredEmail(event.target.value);
    };

    const passwordChangeHandler = event => {
        setEnteredPassword(event.target.value);
    };

    const validateEmailHandler = () => {
        setEmailIsValid(isValidEmail(enteredEmail));
    };

    const validatePasswordHandler = () => {
        setPasswordIsValid(isValidPassword(enteredPassword));
    };

    const submitHandler = event => {
        event.preventDefault();

        onLogin(enteredEmail, enteredPassword);
    };

    return (
        <Card className={classes.login}>
            <form onSubmit={submitHandler}>
                <div
                    className={`${classes.control} ${
                        !emailIsValid && !formIsValid ? classes.invalid : ''
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
                        !passwordIsValid && !formIsValid ? classes.invalid : ''
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
