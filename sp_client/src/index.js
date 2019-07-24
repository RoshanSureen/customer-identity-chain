import React from "react";
import ReactDOM from "react-dom";
import { Router, Switch, Route } from "react-router-dom";
import history from "./history";
import App from "./components/App";
import UserList from "./components/UserList";
import UserKeys from "./components/UserKeys";
import Updates from "./components/updates";
import "./service-provider.css";

ReactDOM.render(
  <Router history={history}>
    <Switch>
      <Route exact path="/" component={App} />
    </Switch>
    <Switch>
      <Route exact path="/userlist" component={UserList} />
    </Switch>
    <Switch>
      <Route exact path="/save" component={UserKeys} />
    </Switch>
    <Switch>
      <Route exact path="/updates" component={Updates} />
    </Switch>
  </Router>,
  document.getElementById("root")
);
