import React, { Component } from "react";
import { Button } from "react-bootstrap";

export default class Block extends Component {
  state = { displayData: false };

  toggleDataView = () => {
    this.setState({ displayData: !this.state.displayData });
  };

  get displayDataView() {
    const { timestamp, decryptedData } = this.props.user;

    if (this.state.displayData) {
      return (
        <div>
          <div>Timestamp: {new Date(timestamp).toLocaleDateString()}</div>
          <div>Decrypted User Data: {decryptedData}</div>
          <br />
          <Button variant="danger" size="sm" onClick={this.toggleDataView}>
            Show Less
          </Button>
        </div>
      );
    }

    return (
      <div>
        <div>Data: ....</div>
        <Button variant="danger" size="sm" onClick={this.toggleDataView}>
          Show More
        </Button>
      </div>
    );
  }
  render() {
    const { publicKey, secretKey } = this.props.user;

    return (
      <div className="userlist">
        <div>User Public Key: {publicKey}</div>
        <div>User Secret Key: {secretKey}</div>
        <hr />
        <br />
        {this.displayDataView}
      </div>
    );
  }
}
