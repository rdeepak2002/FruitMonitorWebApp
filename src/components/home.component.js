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
        </header>
        <body>
          {/* <img alt="unable to load" src="../edgar-castrejon-1CsaVdwfIew-unsplash.jpg" className="homepage-img"></img> */}
          <Carousel>
            <CarouselItem>
              <img alt="unable to load" src="../FruitVision-slide1.png" className="homepage-img"></img>
              <Carousel.Caption>
                <h2>Welcome to FruitVision</h2>
                <p>Made by Deepak R. and Aarush U.</p>
              </Carousel.Caption>
            </CarouselItem>
            <CarouselItem>
              <img alt="unable to load" src="../FruitVision-slide2.jpeg" className="homepage-img"></img>
              <Carousel.Caption>
                <h1>Our Goal</h1>
                <p>In America alone, up to 34% of all crops grown on a field will never make </p>
                <p>it to a food market. Fruits that go bad before reaching a supplier damage not </p>
                <p>only the harm farmer but the environment. This leads to water waste, food </p>
                <p>waste, and even excess carbon emissions. FruitVision aims to solve crop waste </p>
                <p>by implementing an easy-to-use crop monitoring webapp. </p>
              </Carousel.Caption>
            </CarouselItem>
          </Carousel>
        </body>
      </div>
    );
  }
}
