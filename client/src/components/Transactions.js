import React, { Component } from "react";
import { Link } from "react-router-dom";

export default class Transactions extends Component {
  state = {
    transactions: []
  };

  componentDidMount() {
    fetch(`${document.location.origin}/api/transactions`)
      .then(response => response.json())
      .then(json => this.setState({ transactions: json }))
      .catch(err => console.log(err));
  }

  render() {
    return (
      <div>
        <div>
          <Link to="/">Home</Link>
        </div>
        <h3>History of Transactions</h3>
        <ul className="list-group">
          {this.state.transactions.map(tx => {
            return (
              <li className="list-group-item" key={tx.id}>
                <Link to={`/transactions/${tx.id}`}>{tx.id}</Link>
              </li>
            );
          })}
        </ul>
      </div>
    );
  }
}
