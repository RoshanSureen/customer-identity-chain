import React, { Component } from "react";
import { Button } from "react-bootstrap";

export default class UserListItem extends Component {
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
          <div>Decrypted User Data:</div>
          <div>&#123;</div>

          <h3>Full Name: {decryptedData.fullName}</h3>

          <h3>Date of Birth: {decryptedData.dob}</h3>

          <h3>Street Name: {decryptedData.street}</h3>
          <h3>City: {decryptedData.city}</h3>
          <h3>Postal Code: {decryptedData.postcode}</h3>
          <h3>National ID: {decryptedData.id}</h3>

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
    const { publicKey, secretKey } = this.props.user;

    return (
      <div className="userlist">
        <div>User Public Key: {publicKey}</div>
        <div>User Secret Key: {secretKey}</div>
        <hr />

        {this.displayDataView}
      </div>
    );
  }
}
