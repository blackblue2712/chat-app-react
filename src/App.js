import React from 'react';
import { Route, Switch, withRouter } from 'react-router-dom';
import "./App.css";
import ChatArea from './chats/ChatArea';
import Discovery from './component/Discovery';
import ChatServerArea from "./chats/ChatServerArea";
import Auth from './users/Auth';
import PrivateRoute from './PrivateRoute';

class App extends React.Component {
  constructor() {
    super();
    this.state = {

    }
  }



  componentDidMount() {
    console.log(process.env.REACT_APP_API_URL)
  }

  render() {
    return (
      <>
        <Switch>
          <PrivateRoute exact path="/" component={ChatArea} />
          <PrivateRoute exact path="/discovery" component={Discovery} />
          <PrivateRoute exact path="/chanels/:chanelId" component={ChatServerArea} />
          <PrivateRoute exact path="/chanels/@me/:toUid" component={ChatArea} />

          
          <Route exact path="/auth" component={Auth} />
        </Switch>
      </>
    )
  }
}

export default withRouter(App);
