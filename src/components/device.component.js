import React, { Component } from "react";

import socketIOClient from "socket.io-client";

import UserService from "../services/user.service";
import AuthService from "../services/auth.service";
import { PieChart } from "react-minimal-pie-chart";

import { Image } from 'react-bootstrap';

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
        imageUrl: "https://i0.wp.com/www.cssscript.com/wp-content/uploads/2015/11/ispinner.jpg?fit=400%2C298&ssl=1",
        statusText: "good orange"
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
                        this.setState({device: data, imageUrl: `data:image/jpg;base64, ${data.imageUrl}`});
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
    const badColor = '#ff7961';
    const goodColor = '#8adb5e';

    let color0 = badColor;
    let color1 = goodColor;

    if(this.state.device && this.state.device.predictions[0].tagName === "good orange")
    {
        color0 = badColor;
        color1 = goodColor;
    }
    else {
        color0 = goodColor;
        color1 = badColor;
    }
    return (
        <div className="container" style={{marginTop: "1rem"}}>
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
                        <div className="device-info">
                            {/* <p className="device-loader">Loading Device...</p> */}

                            <h2>{this.state.statusText}</h2>

                            <PieChart className="chart"
                                data={[
                                    { title: "bad orange", value: 60, color: color0},
                                    { title: "good orange", value: 40, color: color1}
                                ]}
                                lengthAngle={360}
                                startAngle={0}
                                lineWidth={40}
                            >
                            </PieChart>

                            <Image alt="image" key={Date.now()} src={this.state.imageUrl} className="fruit-pic" fluid rounded/>
                        </div>                        
                    ) : (
                        <div className="device-info">
                            <h2>{this.state.statusText}</h2>

                            <PieChart className="chart"
                                data={[
                                    { title: this.state.device.predictions[0].tagName, value: this.state.device.predictions[0].probability * 100, color: color0},
                                    { title: this.state.device.predictions[1].tagName, value: this.state.device.predictions[1].probability * 100, color: color1}
                                ]}
                                lengthAngle={360}
                                startAngle={0}
                                lineWidth={40}
                            >
                            </PieChart>

                            <Image alt="image" key={Date.now()} src={this.state.imageUrl} className="fruit-pic" fluid rounded/>
                        </div>
                    )}
                </div>
            )}
        </header>
      </div>
    );
  }
}
