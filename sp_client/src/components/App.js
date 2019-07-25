import React, { Component } from "react";
import { Link } from "react-router-dom";
import { Badge } from "react-bootstrap";
import logo from "../assets/logo.png";

class App extends Component {
  state = { updates: "fail" };
  checkUpdates = () => {
    fetch(`${document.location.origin}/api/updates`)
      .then(response => response.json())
      .then(json => {
        this.setState({ updates: json.confirmation });
      })
      .catch(err => console.log(err));
  };

  componentDidMount() {
    this.checkUpdates();

    this.updateInterval = setInterval(() => this.checkUpdates(), 4000);
  }

  render() {
    return (
      <div>
        {this.state.updates === "fail" ? (
          <br />
        ) : (
          <div>
            <h1>
              <Badge variant="primary">
                Blockchain has been updated with new Data
              </Badge>
            </h1>
            <br />
          </div>
        )}
        <div className="App">
          <img src={logo} className="logo" />
          <br />
          <div>Welcome to the kyc blockchain.</div>
          <div>Query the blockchain to retrieve user data</div>
          <br />
          <div>
            <Link to="/save">Save User Info</Link>
          </div>
          <br />
          <div>
            <Link to="/userlist">Check User List</Link>
          </div>
          <br />
          <div>
            <Link to="/updates">Check For Updates on the Chain</Link>
          </div>
        </div>
      </div>
    );
  }
}

export default App;
