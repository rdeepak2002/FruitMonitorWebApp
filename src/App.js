import './App.css';
import socketIOClient from "socket.io-client";
import React, { Component, useEffect } from "react";

const ENDPOINT = "http://localhost:5000";

class App extends Component {

    constructor(props) {
        super(props);

        this.state = {
            iotData: {
                imageUrl: "https://i.pinimg.com/originals/e0/3d/5b/e03d5b812b2734826f76960eca5b5541.jpg"
            }
        };
    }

    componentDidMount() {
        const socket = socketIOClient(ENDPOINT);

        socket.on("iotMessage", data => {
            console.log(data);
            this.setState({
                iotData: data
            });
        });
    
    }

    render() {
        return (
            <div>
                <div>{this.state.iotData.imageUrl}</div>
                <img alt="yomama" src={this.state.iotData.imageUrl}/>
            </div>
        );
    }
  }
  
  export default App;