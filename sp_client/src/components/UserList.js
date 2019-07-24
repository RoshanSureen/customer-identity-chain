import React, { Component } from "react";
import { Link } from "react-router-dom";
import UserListItem from "./UserListItem";

export default class UserList extends Component {
  state = { message: "", userList: [] };

  componentDidMount() {
    fetch(`${document.location.origin}/api/userlist`)
      .then(response => response.json())
      .then(json => {
        console.log(json);
        this.setState({ message: json.message, userList: json.userList });
      })
      .catch(err => console.log(err));
  }
  render() {
    return (
      <div>
        <div>
          <Link to="/">Home</Link>
        </div>
        <br />
        {this.state.userList.length === 0 ? (
          <h3>{this.state.message}</h3>
        ) : (
          <div>
            <h3>{this.state.message}</h3>
            <br />
            {this.state.userList.map(user => {
              return <UserListItem key={user.publicKey} user={user} />;
            })}
          </div>
        )}
      </div>
    );
  }
}
