import React, { Component } from "react";
import { Button } from "react-bootstrap";

export default class DisplayTransaction extends Component {
  state = { displayData: false };

  toggleDataView = () => {
    this.setState({ displayData: !this.state.displayData });
  };

  get displayDataView() {
    const { timestamp, decryptedData } = this.props.transaction;

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
        <Button variant="danger" size="sm" onClick={this.toggleDataView}>
          Show More
        </Button>
      </div>
    );
  }
  render() {
    const { txId } = this.props.transaction;

    return (
      <div className="Transaction">
        <div>Transaction ID: {txId}</div>
        <br />
        {this.displayDataView}
        <hr />
      </div>
    );
  }
}
