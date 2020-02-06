import React from 'react';
import { withRouter, BrowserRouter } from "react-router-dom";
// import PrivateRoute from './PrivateRoute';
import App from './App';

class MainRouter extends React.Component {
    render() {
        return <BrowserRouter>
            <App />
        </BrowserRouter>
    }
}

export default MainRouter;