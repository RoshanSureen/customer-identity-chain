import React, { Component } from "react";
import { FormGroup, FormControl, FormLabel, Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import history from "../history";

export default class ConductTransaction extends Component {
  state = {
    fullName: "",
    street: "",
    dob: "",
    city: "",
    postcode: "",
    id: ""
  };

  updateItem(event) {
    event.preventDefault();
    this.setState({ [event.target.name]: event.target.value });
  }

  saveUserDetails = () => {
    const { fullName, street, dob, city, postcode, id } = this.state;
    const userData = {
      fullName,
      street,
      dob,
      city,
      postcode,
      nationalID: id
    };
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
        <div>
          <div className="txForm">
            <FormGroup>
              <FormLabel>Enter Your Full Name</FormLabel>

              <FormControl
                input="text"
                placeholder="Full Name"
                name="fullName"
                value={this.state.fullName}
                onChange={this.updateItem.bind(this)}
              />
            </FormGroup>
            <FormGroup>
              <FormLabel>Enter Your Street Name</FormLabel>
              <FormControl
                input="text"
                placeholder="Street name"
                name="street"
                value={this.state.street}
                onChange={this.updateItem.bind(this)}
              />
            </FormGroup>
            <FormGroup>
              <FormLabel>Enter Your Date of Birth</FormLabel>
              <FormControl
                input="text"
                placeholder="DOB: xx/xx/xxxx"
                name="dob"
                value={this.state.dob}
                onChange={this.updateItem.bind(this)}
              />
            </FormGroup>
            <FormGroup>
              <FormLabel>Enter Your City</FormLabel>
              <FormControl
                input="text"
                placeholder="City"
                name="city"
                value={this.state.city}
                onChange={this.updateItem.bind(this)}
              />
            </FormGroup>
            <FormGroup>
              <FormLabel>Enter Your Postal Code</FormLabel>
              <FormControl
                input="text"
                placeholder="Postal Code"
                name="postcode"
                value={this.state.postcode}
                onChange={this.updateItem.bind(this)}
              />
            </FormGroup>
            <FormGroup>
              <FormLabel>Enter Your AUFENTHALTSTITEL number</FormLabel>
              <FormControl
                input="text"
                placeholder="National ID"
                name="id"
                value={this.state.id}
                onChange={this.updateItem.bind(this)}
              />
            </FormGroup>
          </div>
          <Button variant="danger" onClick={this.saveUserDetails}>
            Submit
          </Button>
        </div>
      </div>
    );
  }
}
