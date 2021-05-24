import React, { Component } from "react";

export default class Home extends Component {
  constructor(props) {
    super(props);

    this.state = {
      content: ""
    };
  }

  componentDidMount() {
    
  }

  render() {
    return (
      <div className="container" style={{marginTop: "1rem"}}>
        <header className="jumbotron">
          <h3>Hello World</h3>
        </header>
      </div>
    );
  }
}
