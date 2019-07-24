import React, { Component } from "react";
import { FormGroup, FormControl, FormLabel, Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import history from "../history";

export default class ConductTransaction extends Component {
  state = { userData: "" };

  updateData = event => {
    this.setState({ userData: event.target.value });
  };

  saveData = () => {
    const { userData } = this.state;
    fetch(`${document.location.origin}/api/transact`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userData })
    })
      .then(response => response.json())
      .then(json => {
        alert(json.message || json.confirmation);
        history.push("/transaction-pool");
      });
  };

  render() {
    return (
      <div className="ConductTransaction">
        <Link to="/">Home</Link>
        <br />
        <FormGroup>
          <FormLabel>Enter Your Data</FormLabel>
          <FormControl
            as="textarea"
            rows="15"
            value={this.state.userData}
            onChange={this.updateData}
          />
        </FormGroup>

        <Button variant="danger" onClick={this.saveData}>
          Submit
        </Button>
      </div>
    );
  }
}
