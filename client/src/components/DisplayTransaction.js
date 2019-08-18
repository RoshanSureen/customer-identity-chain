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
      let userData = JSON.parse(decryptedData);
      return (
        <div>
          <div>Timestamp: {new Date(timestamp).toLocaleDateString()}</div>
          <div>Decrypted User Data:</div>
          <div>&#123;</div>

          <h3>Full Name: {userData.fullName}</h3>

          <h3>Date of Birth: {userData.dob}</h3>

          <h3>Street Name: {userData.street}</h3>
          <h3>City: {userData.city}</h3>
          <h3>Postal Code: {userData.postcode}</h3>
          <h3>National ID: {userData.id}</h3>

          <div>&#125;</div>
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
    console.log(this.props.transaction);
    const { txId } = this.props.transaction;

    return (
      <div className="Transaction">
        <div>Transaction ID: {txId}</div>

        {this.displayDataView}
        <hr />
      </div>
    );
  }
}
