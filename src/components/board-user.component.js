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

  handleClick(deviceId) {
    this.props.history.push("/device?id="+deviceId);
    // this.setState({ redirect: "/device?id="+deviceId });
  }

  componentDidMount() {
    UserService.getUserBoard().then(
      response => {
        const currentUser = AuthService.getCurrentUser();

        if (!currentUser) this.setState({ redirect: "/home" });

        this.setState({currentUser: currentUser});

        const socket = socketIOClient(ENDPOINT);

        socket.on("iotMessage", data => {
            if(data.owner === this.state.currentUser.id) {
                let containsDevice = false;

                for(let i = 0; i < this.state.devices.length; i++) {
                    if(this.state.devices[i].id === data.deviceId) {
                        containsDevice = true;
                    }
                }

                if(!containsDevice) {
                    this.state.devices.push({id: data.deviceId, name: data.deviceId});
                }
            }

            this.setState({
                iotData: data
            });
        });

        socket.on("devicePaired", data => {
            console.log("Paired device info:");
            console.log(data);
            alert("Device Paired!");
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
        {this.state.devices.map(device => <button key={device.id} className="box" onClick={()=>this.handleClick(device.id)}> {device.name} </button>)}
        
        <input type="text" onChange={e => this.setState({pairCode: e.target.value})} value={this.state.pairCode}/>
        <button onClick={()=>this.sendPairRequest}>Pair</button>
      </div>
    );
  }
}
