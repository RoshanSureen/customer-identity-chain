import React, { Component } from "react";
import { Link } from "react-router-dom";
import { Button } from "react-bootstrap";

export default class updates extends Component {
  state = { message: "", updates: [] };

  componentDidMount() {
    fetch(`${document.location.origin}/api/updates`)
      .then(response => response.json())
      .then(json => {
        console.log(json);
        this.setState({ message: json.message, updates: json.updates });
      })
      .catch(err => console.log(err));
  }

  updateList = () => {
    let r = confirm(
      `We hope you have saved the updated data in your system. Press "OK" to continue or "Cancel" to stop the operation`
    );
    if (r == true) {
      const { updates } = this.state;
      fetch(`${document.location.origin}/api/updateList`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ updates })
      })
        .then(response => response.json())
        .then(json => {
          this.setState({ message: json.message, updates: json.updates });
        });
    } else {
      this.setState({
        message:
          "Please save the updated data in your system before continuing!"
      });
    }
  };

  render() {
    const { message, updates } = this.state;
    return (
      <div className="updateComponent">
        <div>
          <Link to="/">Home</Link>
        </div>
        {updates.length === 0 ? (
          <h3>{message}</h3>
        ) : (
          <div className="updates">
            <h3>{message}</h3>
            <hr />
            {updates.map(update => {
              return (
                <div>
                  <h3>User Public Key: {update["publicKey"]}</h3>
                  <h3>User Secret Key: {update["secretKey"]}</h3>
                  <br />
                  <div>New User Data:</div>
                  <div>&#123;</div>

                  <h3>Full Name: {update.decryptedData.fullName}</h3>

                  <h3>Date of Birth: {update.decryptedData.dob}</h3>

                  <h3>Street Name: {update.decryptedData.street}</h3>
                  <h3>City: {update.decryptedData.city}</h3>
                  <h3>Postal Code: {update.decryptedData.postcode}</h3>
                  <h3>National ID: {update.decryptedData.id}</h3>

                  <div>&#125;</div>
                  <br />
                  <hr />
                </div>
              );
            })}
            <br />
            <Button variant="success" onClick={this.updateList}>
              Update List
            </Button>
          </div>
        )}
      </div>
    );
  }
}
