import React, { Component } from "react";
import socketIOClient from "socket.io-client";

import UserService from "../services/user.service";

const ENDPOINT = "http://localhost:5000";

export default class BoardUser extends Component {
  constructor(props) {
    super(props);

    this.state = {
        content: "",
        iotData: {
            imageUrl: "https://i.pinimg.com/originals/e0/3d/5b/e03d5b812b2734826f76960eca5b5541.jpg"
        }
    };
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
            error.toString()
        });
      }
    );
  }

  render() {
    return (
      <div className="container">
        <header className="jumbotron">
            <h3>{this.state.content}</h3>
            <div>
                <div>{this.state.iotData.imageUrl}</div>
                <img alt="yomama" src={this.state.iotData.imageUrl}/>
            </div>
        </header>
      </div>
    );
  }
}
