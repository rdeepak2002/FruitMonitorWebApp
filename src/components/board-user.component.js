import React, { Component } from "react";
import socketIOClient from "socket.io-client";

import UserService from "../services/user.service";

const ENDPOINT = "http://localhost:5000";

export default class BoardUser extends Component {
  constructor(props) {
    super(props);

    this.state = {
        content: "",
        error: false,
        iotData: {
            imageUrl: "https://i.pinimg.com/originals/e0/3d/5b/e03d5b812b2734826f76960eca5b5541.jpg"
        },
        devices: [{id: 1234, name: "deeps"}, {id: 4321, name:"fruits"}]
    };

    this.handleClick = this.handleClick.bind(this);
  }

  handleClick() {
    console.log("====> HELLO YOU'VE CLICKED");
  }

  componentDidMount() {
    UserService.getUserBoard().then(
      response => {
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
      // <div className="container">
      //   <header className="jumbotron">
      //       {this.state.error && (
      //           <div>
      //               <h3>{this.state.content}</h3>

      //               <div>Error retrieving dashboard.</div>
      //           </div>
      //       )}

      //       {!this.state.error && (
      //           <div>
      //               <a href="/device?id=123">some device</a>
      //               <div>{this.state.content}</div>
      //               <div>
      //                   <div>{this.state.iotData.imageUrl}</div>
      //                   <img alt="yomama" src={this.state.iotData.imageUrl}/>
      //               </div>
      //           </div>
      //       )}
      //   </header>
      // </div>
      <div className="container-flex">
        {this.state.devices.map(device => <button key={device.id} className="box" onClick={this.handleClick}> {device.name} </button>)}
      </div>

    );
  }
}
