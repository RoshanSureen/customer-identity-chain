import React, { Component } from "react";
import { Link } from "react-router-dom";
import { FormGroup, FormControl, Button } from "react-bootstrap";
import history from "../history";

export default class UserKeys extends Component {
  state = { userPublicKey: "", userSecretKey: "" };

  updatePublicKey = event => {
    this.setState({ userPublicKey: event.target.value });
  };
  updateSecretKey = event => {
    this.setState({ userSecretKey: event.target.value });
  };

  saveUserDetails = () => {
    const { userPublicKey, userSecretKey } = this.state;
    fetch(`${document.location.origin}/api/userKeys`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userPublicKey, userSecretKey })
    })
      .then(response => response.json())
      .then(json => {
        alert(json.message || json.confirmation);
        history.push("/userlist");
      });
  };
  render() {
    return (
      <div>
        <div>
          <Link to="/">Home</Link>
        </div>
        <br />
        <div className="userkeys">
          <FormGroup>
            <FormControl
              input="text"
              placeholder="User Public Key"
              value={this.state.userPublicKey}
              onChange={this.updatePublicKey}
            />
          </FormGroup>
          <FormGroup>
            <FormControl
              input="text"
              placeholder="Secret Key"
              value={this.state.userSecretKey}
              onChange={this.updateSecretKey}
            />
          </FormGroup>
          <Button variant="danger" onClick={this.saveUserDetails}>
            Submit
          </Button>
        </div>
      </div>
    );
  }
}
