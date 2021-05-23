import React, { Component } from "react";

import UserService from "../services/user.service";

export default class Device extends Component {
  constructor(props) {
    super(props);

    this.state = {
      content: "",
      error: false
    };
  }

  componentDidMount() {
    UserService.getUserBoard().then(
        response => {
          this.setState({
            content: response.data
          });
        },
        error => {
          this.setState({
              content:
                  (error.response &&
                  error.response.data &&
                  error.response.data.message) ||
                  error.message ||
                  error.toString(),
              error: true
          });
        }
      );
  }

  render() {
    return (
        <div className="container">
        <header className="jumbotron">
            {this.state.error && (
                <div>
                    <h3>{this.state.content}</h3>

                    <div>Error retrieving dashboard.</div>
                </div>
            )}

            {!this.state.error && (
                <div>
                    <div>{this.state.content}</div>
                    <div>
                        <div>yay</div>
                    </div>
                </div>
            )}
        </header>
      </div>
    );
  }
}
