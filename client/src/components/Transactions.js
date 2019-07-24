import React, { Component } from "react";
import { Link } from "react-router-dom";
import DisplayTransaction from "./DisplayTransaction";

export default class Transactions extends Component {
  state = {
    message: "",
    transactions: []
  };

  componentDidMount() {
    fetch(`${document.location.origin}/api/transactions`)
      .then(response => response.json())
      .then(json =>
        this.setState({
          message: json.message,
          transactions: json.transactions
        })
      )
      .catch(err => console.log(err));
  }

  render() {
    return (
      <div>
        <div>
          <Link to="/">Home</Link>
        </div>
        {this.state.transactions.length === 0 ? (
          <h3>{this.state.message}</h3>
        ) : (
          <div>
            <h3>{this.state.message}</h3>
            {this.state.transactions.map(tx => {
              return <DisplayTransaction key={tx.txId} transaction={tx} />;
            })}
          </div>
        )}
      </div>
    );
  }
}
