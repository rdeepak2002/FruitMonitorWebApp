import React, { Component } from "react";
import { CarouselItem } from "react-bootstrap";
import { Carousel } from "react-bootstrap";

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
      <div className="home">
        <header className="jumbotron">
          <h3>Hello World</h3>
        </header>
        <body>
          {/* <img alt="unable to load" src="../edgar-castrejon-1CsaVdwfIew-unsplash.jpg" className="homepage-img"></img> */}
          <Carousel>
            <CarouselItem>
              <img alt="unable to load" src="../edgar-castrejon-1CsaVdwfIew-unsplash.jpg" className="homepage-img"></img>
            </CarouselItem>
          </Carousel>
        </body>
      </div>
    );
  }
}
