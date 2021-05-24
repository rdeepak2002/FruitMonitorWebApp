import React, { Component } from "react";
import { BrowserRouter as Router, Switch, Route, NavLink, Redirect } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";

import AuthService from "./services/auth.service";

import Login from "./components/login.component";
import Register from "./components/register.component";
import Home from "./components/home.component";
import Profile from "./components/profile.component";
import BoardUser from "./components/board-user.component";
import Device from "./components/device.component";

import { Navbar, Nav } from 'react-bootstrap';

class App extends Component {
  constructor(props) {
    super(props);
    this.logOut = this.logOut.bind(this);

    this.state = {
      currentUser: undefined,
      goToRoot: false
    };
  }

  componentDidMount() {
    const user = AuthService.getCurrentUser();

    if (user && user.roles !== undefined) {
      this.setState({
        currentUser: user
      });
    }
  }

  logOut() {
    AuthService.logout();
    // this.setState({goToRoot: true});
    window.location.href = "/";
  }

  render() {
    const { currentUser } = this.state;

    return (
        <Router>
            {this.state.goToRoot && (
                <Redirect to="/home"></Redirect>
            )}

            <div>
                <Navbar bg="dark" expand="lg" variant="dark" sticky="top">
                    <div className="container">
                        <Navbar.Brand href="/">FruitVision</Navbar.Brand>
                        <Navbar.Toggle aria-controls="basic-navbar-nav" />

                        <Navbar.Collapse id="basic-navbar-nav">
                            <Nav>
                                {currentUser && (
                                    <NavLink to={"/user"} className="nav-link" activeClassName="active">Devices</NavLink>
                                )}
                            </Nav>
                            <Nav className="justify-content-end" style={{ width: "100%" }}>
                                {currentUser && (
                                    <NavLink to={"/profile"} className="nav-link" activeClassName="active">My Account</NavLink>
                                )}

                                {currentUser && (
                                    <NavLink to={"/login"} className="nav-link" activeClassName="active" onClick={this.logOut}>Log Out</NavLink>
                                )}

                                {!currentUser && (
                                    <NavLink to={"/login"} className="nav-link" activeClassName="active">Login</NavLink>
                                )}

                                {!currentUser && (
                                    <NavLink to={"/register"} className="nav-link" activeClassName="active">Sign Up</NavLink>
                                )}
                            </Nav>
                        </Navbar.Collapse>
                    </div>
                </Navbar>

                <div>
                    <Switch>
                        <Route exact path={["/", "/home"]} component={Home} />
                        <Route exact path="/login" component={Login} />
                        <Route exact path="/register" component={Register} />
                        <Route exact path="/profile" component={Profile} />
                        <Route path="/user" component={BoardUser} />
                        <Route path="/device" component={Device} />
                        
                        {(currentUser) && (
                            <Route path='*'>
                                <Redirect to="/user" />
                            </Route>
                        )}

                        {(!currentUser) && (
                            <Redirect to="/home" />
                        )}
                    </Switch>
                </div>
            </div>
        </Router>
    );
  }
}

export default App;
