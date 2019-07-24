import React, { Component } from "react";
import { Link } from "react-router-dom";
import logo from "../assets/logo.png";

class App extends Component {
  state = {
    walletInfo: {}
  };

  componentDidMount() {
    fetch(`${document.location.origin}/api/wallet-info`)
      .then(response => response.json())
      .then(json => this.setState({ walletInfo: json }))
      .catch(err => console.log(err));
  }
  render() {
    const { address, secretKey } = this.state.walletInfo;
    return (
      <div className="App">
        <img src={logo} className="logo" />
        <br />
        <div>Welcome to blockchain...</div>
        <br />
        <div>
          <Link to="/blocks">Blocks</Link>
        </div>
        <br />
        <div>
          <Link to="/conduct-transaction">Conduct a Transaction</Link>
        </div>
        <br />
        <div>
          <Link to="/transaction-pool">Transaction Pool</Link>
        </div>
        <br />
        <div>
          <Link to="/transactions">View Your Transactions</Link>
        </div>
        <br />
        <div className="WalletInfo">
          <div>Address: {address}</div>
          <br />
          <div>Your Secret Key: {secretKey}</div>
        </div>
      </div>
    );
  }
}

export default App;
