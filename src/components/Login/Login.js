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
    // Introducing useReducer & Reducers in General

    // Here, we managing a couple of states snapshots, and you might be able to spot some related state here.
    // We managed the enteredEmail and the enteredPassword, but then we also managed the fact or the question
    // the response to the question, whether the email or the password is valid. And we managed the overall
    // form validity. So you could argue that overall, this is all one big state that describes the overall
    // form state. The inputs are part of that, or you at least treat every input as one entity and one state,
    // which simply has two aspects. The value the user entered and the validity of that input.
    // And it becomes clear that we have some work to do and some redundancy if we consider the fact that
    // we're setting the overall form validity, by checking the validity of email and password when we're
    // doing the exact same thing for our two validate handlers. Now, we could re-write this in various ways
    // and for example, use our emailIsValid and passwordIsValid states in the useEffect hook and just use those
    // two states to confirm whether the overall form is valid and that it would work. But nonetheless,
    // we at least have these two states, the enteredEmail and the validity of the email that clearly kind of belong
    // together, and which we therefore might wanna manage together. In addition, I wanna come back to something
    // which we don't have anymore because we're using useEffect, but what we had before you might remember that
    // inside of emailChangeHandler and passwordChangeHandler, we had a slightly different code. That approach also
    // worked but we had some code re-usage which is why the useEffect was a better result. But let's say for
    // whatever reason you don't wanna take the route to useEffect. In that case, you would have another problem
    // and I'm just going back to the solution to show you this problem which you can have in some apps and in some
    // use cases. For example, we are updating some state the form validity state, based on two other states.
    // Now, what did you learn about updating the state based on some older state? You wanna use the function form.
    // Now, that doesn't work however, because that's only true if your next state update, depends on the previous
    // state snapshot of the same state. But here we depend on two other states snapshots of different state of
    // the enteredEmail and the enteredPassword, not on the last state snapshot of the form validity.
    // So therefore here actually we're doing something which you normally shouldn't do, because the way React
    // schedules state updates,
    // this code "setFormIsValid(event.target.value.includes('@') && enteredPassword.trim().length > 6)"
    // could actually in rare cases, but it could actually lead to the scenario
    // where "setFormIsValid(event.target.value.includes('@') && enteredPassword.trim().length > 6)" runs before, for example,
    // password state update was processed. So therefore enteredPassword when this
    // "setFormIsValid(event.target.value.includes('@') && enteredPassword.trim().length > 6)" code runs,
    // might not contain the latest enteredPassword, because of how React schedules state updates.
    // That's why I said before, and why I urged you to use the function form.
    // But again, it's not available here, because we're depending on two other states and not the last snapshot of this form
    // validity state. This is another scenario where you could use useReducer. So it's a good use case, a good replacement
    // of the useState. When you have states that belongs together, for example, enteredEmail and the validity
    // of the email's value or if you have state updates that depend on other state.
    // We already violate this rule of using the function form if a state update depends on an older state.
    // Here in our validateEmail and validatePassword handlers. There, we are calling setEmailIsValid and setPasswordIsValid
    // to set new states, for this emailIsValid and passwordIsValid state. Now, how are we setting these states? Well, by
    // having a look at another state and calling a method on it. (example: enteredEmail.includes('@')). We're having a look
    // at the enteredEmail state, which is a different state. Sure, they are related. They both changed because of what
    // the user entered, but technically these are two different states, two different variables. And we are deriving(выводим)
    // our new emailIsValid state by looking at another state and that is something we should not do.
    // It works in most cases, but in some scenarios it could not work because maybe some state update for enteredEmail
    // wasn't processed in time. And then we would try to update emailIsValid, based on some outdated enteredEmail state.
    // That is a scenario where useReducer is always a good choice. If you update a state, which depends on different state
    // then merging this into one state could be a good idea. And you can do that without useReducer as well. You could
    // simply manage an email state, which is an object with the value and the valid being part of the same object.
    // You could do it with the useState, but in such cases when your state becomes more complex, bigger and combines multiple
    // related states, useReducer can also be worth a closer look.

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

    // useEffect Summary

    // Rarely used, because it runs when the component first mounts, when component is rendered for the first time, but then also for every state update.
    // We learned that the effect function runs AFTER every component render cycle. Not before it and not during it, but AFTER it, including the first time
    // this component was mounted.
    // useEffect(() => {
    //     console.log('EFFECT RUNNING');
    // });

    // Now, this changes once we add an empty array. Now this function here, only executes for the first time this component
    // was mounted and rendered, but not thereafter, not for any subsequent rerender cycle. So it really only ran once.
    // useEffect(() => {
    //     console.log('EFFECT RUNNING');
    // }, []);

    // Alternatively, we add a dependency like enteredEmail or enteredPassword. Now this function here, reruns whenever the component was re-evaluated only IF
    // dependencies were changed.
    // useEffect(() => {
    //     console.log('EFFECT RUNNING');
    // }, [enteredPassword]);

    // We also have a cleanup function, which we can return. This cleanup function runs before this effect function, but not before
    // the first time(not in my case) it runs. Now, if we had an empty array here, so no dependencies, we learned that we only see
    // effect running once, and the cleanup function in this case, would run when the component is removed. So in this case, when I log in and the component
    // is removed from the DOM, we will see EFFECT CLEANUP. So that's how useEffect works, and how the different parts of it are related, and when they
    // execute.

    // useEffect(() => {
    //     console.log('EFFECT RUNNING 2');

    //     return () => {
    //         console.log('EFFECT CLEANUP 2');
    //     };
    // }, []);

    useEffect(() => {
        setFormIsValid(emailState.isValid && passwordState.isValid);
    }, [emailState.isValid, passwordState.isValid]);

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
