import '../styles/App.css';
import LinkList from './LinkList';
import CreateLink from "./CreateLink";
import Header from './Header';
import React from "react";
import { Switch, Route, Redirect } from "react-router-dom";
import Login from './Login';
import Search from './Search';

function App() {
  return (
    <div className="center w85">
      <Header />
      <div className="ph3 pv1 background-gray">
        <Switch>
          <Route exact path="/" render={() => <Redirect to="/new/1" /> } />
          <Route path="/search" component={Search} />
          <Route path="/top" component={LinkList} />
          <Route path="/create" component={CreateLink} />
          <Route path="/login" component={Login} />
          <Route path="/new/:page" component={LinkList} />
        </Switch>
      </div>
    </div>
  );
}

export default App;
