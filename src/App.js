import React from 'react';
import { Route, Switch, withRouter } from 'react-router-dom';
import "./App.css";

import TabPanel from './component/TabPanel';
import Navigation from './component/Navigation';
import ChatArea from './chats/ChatArea';
import Discovery from './component/Discovery';

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
        <div id="wrap-left">
          <Navigation />
          <TabPanel />
        </div>
        <div id="wrap-right">
          <div className="container tab-content" id="nav-tabContent">
              <Switch>
                <Route exact path="/" component={ChatArea} />
                <Route exact path="/discovery" component={Discovery} />
              </Switch>
          </div>
        </div>
      </>
    )
  }
}

export default withRouter(App);
