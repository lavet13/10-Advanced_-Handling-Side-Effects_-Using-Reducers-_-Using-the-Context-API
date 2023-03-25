import React from 'react';

// createContext returns a component or it will be an object that also contains components
// whilst AuthContext itself is not a component, it is an object that will contain a component.
const AuthContext = React.createContext({
    isLoggedIn: false,
});

export default AuthContext;

// We do have a default value, but this default value will actually only be used if we would consume
// without having a provider. So technically the provider is not even needed, however, you should memorize
// this pattern I explained earlier, where you need the provider. Technically, you don't need it if you have
// a default value, but in reality you will use context to have a value which can change and that will
// only be possible with a provider.
