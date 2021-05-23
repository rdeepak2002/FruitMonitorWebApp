import React, { Component } from "react";
import socketIOClient from "socket.io-client";

import UserService from "../services/user.service";
import AuthService from "../services/auth.service";

const ENDPOINT = "http://localhost:5000";

export default class BoardUser extends Component {
  constructor(props) {
    super(props);

    this.state = {
        currentUser: undefined,
        pairCode: "",
        content: "",
        error: false,
        iotData: {
            imageUrl: "https://i.pinimg.com/originals/e0/3d/5b/e03d5b812b2734826f76960eca5b5541.jpg"
        },
        devices: [{id: 1234, name: "deeps"}, {id: 4321, name:"fruits"}]
    };

    this.sendPairRequest = this.sendPairRequest.bind(this);
    this.handleClick = this.handleClick.bind(this);
  }

  sendPairRequest() {
    const socket = socketIOClient(ENDPOINT);
    const pairRequestData = {
        deviceId: this.state.pairCode,
        owner: this.state.currentUser.id
    };

    socket.emit("pairRequest", pairRequestData);
  }

  handleClick() {
    console.log("====> HELLO YOU'VE CLICKED");
  }

  componentDidMount() {
    UserService.getUserBoard().then(
      response => {
        const currentUser = AuthService.getCurrentUser();

        if (!currentUser) this.setState({ redirect: "/home" });

        this.setState({currentUser: currentUser});

        const socket = socketIOClient(ENDPOINT);

        socket.on("iotMessage", data => {
            console.log(data);
            this.setState({
                iotData: data
            });
        });

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
      <div className="container-flex">
        {this.state.devices.map(device => <button key={device.id} className="box" onClick={this.handleClick}> {device.name} </button>)}
        
        <input type="text" onChange={e => this.setState({pairCode: e.target.value})} value={this.state.pairCode}/>
        <button onClick={this.sendPairRequest}>Pair</button>
      </div>
    );
  }
}
