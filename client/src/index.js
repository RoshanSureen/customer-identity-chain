import React from "react";
import ReactDOM from "react-dom";
import { Router, Switch, Route } from "react-router-dom";
import history from "./history";
import Blocks from "./components/Blocks";
import App from "./components/App";
import ConductTransaction from "./components/ConductTransaction";
import TransactionPool from "./components/TransactionPool";
import Transactions from "./components/Transactions";
import DisplayTransaction from "./components/DisplayTransaction";
import "./index.css";

ReactDOM.render(
  <Router history={history}>
    <Switch>
      <Route exact path="/" component={App} />
      <Route path="/blocks" component={Blocks} />
      <Route path="/conduct-transaction" component={ConductTransaction} />
      <Route path="/transaction-pool" component={TransactionPool} />
      <Route path="/transactions" component={Transactions} />
      <Route path="/transactions/:id" component={DisplayTransaction} />
    </Switch>
  </Router>,
  document.getElementById("root")
);
