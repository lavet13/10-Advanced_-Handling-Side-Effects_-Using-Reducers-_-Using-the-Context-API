import React, { useState, useEffect } from 'react';

import Login from './components/Login/Login';
import Home from './components/Home/Home';
import MainHeader from './components/MainHeader/MainHeader';
import AuthContext from './context/auth-context';

function App() {
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    // Using the useEffect hook

    // this anonymous function will run AFTER every component re-evaluation. So whenever this component function ran thereafter,
    // function that pass in the useEffect, and if you update the state of isLoggedIn, the component will run again.
    // But it will not just run after every component evaluation, but only if the dependencies here changed.
    // Now when the app starts for the first time that will be the case. If component function runs for the very first time
    // because your app just started, then the dependencies are considered to have changed because you had no dependencies before
    // you could say. But once it ran for the first time, for example. We have no dependencies but therefore of course they also
    // didn't change compared to the first execution cycle. So therefore anonymous function here would indeed only run once when
    // the app starts because thereafter the dependencies never change because this here specifically has no dependencies. And in
    // this scenario, that's exactly what we want. We want to run this code once and that's when our app starts up.
    // So therefore we should have exactly the behavior we want. Once the app started, the code in the anonymous function runs.
    // Then we update state and as we learned this triggers component function to run again. Now therefore it all runs again.
    // JSX code is evaluated and the DOM is updated accordingly, BUT thereafter the Effect would run again but only IF our dependencies
    // also changed. And that's not the case here as I explained. So therefore anonymous function should only run once. That's one scenario
    // where it shines a lot.
    // This data fetching is a side-effect. It's not directly related to the UI. Of course the result is but not the data storage access
    // itself. And we wanna run it as a side effect with useEffect in this case to avoid an infinite loop and to make sure this code which
    // potentially could also be performance intensive does not run for every component re-render cycle but only if we wanted to run.

    useEffect(() => {
        const storedUserLoggedInInformation =
            localStorage.getItem('isLoggedIn');

        if (storedUserLoggedInInformation === '1') {
            setIsLoggedIn(true);
        }
    }, []);

    const loginHandler = (email, password) => {
        // We should of course check email and password
        // But it's just a dummy/ demo anyways
        localStorage.setItem('isLoggedIn', '1');
        setIsLoggedIn(true);
    };

    const logoutHandler = () => {
        localStorage.removeItem('isLoggedIn');
        setIsLoggedIn(false);
    };

    return (
        <AuthContext.Provider value={{ isLoggedIn }}>
            <MainHeader onLogout={logoutHandler} />
            <main>
                {!isLoggedIn && <Login onLogin={loginHandler} />}
                {isLoggedIn && <Home onLogout={logoutHandler} />}
            </main>
        </AuthContext.Provider>
    );
}

export default App;
