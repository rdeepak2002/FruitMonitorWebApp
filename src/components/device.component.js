import React, { Component } from "react";

import socketIOClient from "socket.io-client";

import UserService from "../services/user.service";
import AuthService from "../services/auth.service";

import qs from "qs";

const ENDPOINT = "http://localhost:5000";

export default class Device extends Component {
  constructor(props) {
    super(props);

    const id = qs.parse(this.props.location.search, { ignoreQueryPrefix: true }).id;

    this.state = {
    currentUser: undefined,
      content: "",
      error: false,
      deviceId: id,
      device: undefined
    };
  }

  componentDidMount() {
    UserService.getUserBoard().then(
        response => {
            const currentUser = AuthService.getCurrentUser();

            this.setState({
                content: response.data,
                currentUser: currentUser
            }, ()=>{
                const socket = socketIOClient(ENDPOINT);

                socket.on("iotMessage", data => {
                    if(data.deviceInfo.owner === this.state.currentUser.id && data.deviceInfo.id === this.state.id) {
                        this.setState({device: data});
                    }
                });
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
                    {!this.state.device ? (
                        <div>Loading Device...</div>
                    ) : (
                        <div>{this.state.device.deviceId}</div>
                    )}
                </div>
            )}
        </header>
      </div>
    );
  }
}
