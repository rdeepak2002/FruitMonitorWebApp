import React, { Component } from "react";

import socketIOClient from "socket.io-client";

import UserService from "../services/user.service";
import AuthService from "../services/auth.service";
import { PieChart } from "react-minimal-pie-chart";

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
                    if(data.owner === this.state.currentUser.id && data.deviceId === this.state.deviceId) {
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
                        <div className="device-loader">Loading Device...</div>
                    ) : (
                        <div>
                          {/* {this.state.device.deviceId} */}
                          <PieChart 
                            data={[
                              { title: 'Good', value: 77, color: '#c6d2ed'},
                              { title: 'Bad', value: 23, color: '#292929'}
                            ]}
                            lengthAngle={180}
                            startAngle={180}
                            lineWidth={50}
                          />
                          <img alt="80085" src="../logo192.png"></img>
                        </div>

                    )}
                </div>
            )}
        </header>
      </div>
    );
  }
}
