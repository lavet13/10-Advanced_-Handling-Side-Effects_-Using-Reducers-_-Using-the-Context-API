import React from 'react';
import AuthContext from '../../context/auth-context';

import classes from './Navigation.module.css';

const Navigation = ({ onLogout }) => {
    return (
        <AuthContext.Consumer>
            {({ isLoggedIn }) => {
                return (
                    <nav className={classes.nav}>
                        <ul>
                            {isLoggedIn && (
                                <li>
                                    <a href="/">Users</a>
                                </li>
                            )}
                            {isLoggedIn && (
                                <li>
                                    <a href="/">Admin</a>
                                </li>
                            )}
                            {isLoggedIn && (
                                <li>
                                    <button onClick={onLogout}>Logout</button>
                                </li>
                            )}
                        </ul>
                    </nav>
                );
            }}
        </AuthContext.Consumer>
    );
};

export default Navigation;
