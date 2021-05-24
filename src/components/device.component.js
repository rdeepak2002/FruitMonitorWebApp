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
        id: id,
        device: undefined,
        imageUrl: "../logo192.png"
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
                    if(data !== undefined && data.deviceInfo !== undefined && data.deviceInfo.owner === this.state.currentUser.id && data.deviceInfo.id === this.state.id) {
                        const hash = Date.now();
                        console.log(hash);
                        this.setState({device: data, imageUrl: `${data.imageUrl}&hash=${hash}`});
                    }
                    console.log(data)
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
                              { title: this.state.device.predictions[0].tagName, value: this.state.device.predictions[0].probability * 100, color: '#c6d2ed'},
                              { title: this.state.device.predictions[1].tagName, value: this.state.device.predictions[1].probability * 100, color: '#292929'}
                            ]}
                            lengthAngle={360}
                            startAngle={180}
                            lineWidth={50}
                          />
                          <img alt="80085" key={Date.now()} src={this.state.imageUrl}></img>
                        </div>

                    )}
                </div>
            )}
        </header>
      </div>
    );
  }
}
