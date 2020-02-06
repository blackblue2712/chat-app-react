import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import { isAuthenticated } from './controllers/userController';

const PrivateRoute = ({ component: Component, ...rest }) => {
    return (
        <Route
            {...rest}
            render={props =>
                isAuthenticated() ? (
                    <Component {...props} userPayload={isAuthenticated()} />
                ) : (
                        <Redirect
                            to={{
                                pathname: "/auth",
                                state: { from: props.location }
                            }}
                        />
                    )
            }
        />
    );
}

export default PrivateRoute;