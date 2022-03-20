import React, { Component } from "react";
import NavBar from "../components/WelcomePageNavBar";
import axios from "axios";
export default class SignUp extends Component {
  constructor() {
    super();
    this.state = {
      username: "",
      password: "",
      email: "",
    };
  }

  changeUserName = (event) => {
    this.setState({
      username: event.target.value,
    });
  };

  changeEmail = (event) => {
    this.setState({
      email: event.target.value,
    });
  };

  changePassword = (event) => {
    this.setState({
      password: event.target.value,
    });
  };

  containsBlank = () => {
    return (
      this.state.username === "" ||
      this.state.email === "" ||
      this.state.password === ""
    );
  };

  signupUser = async (username, password, email) => {
    try {
      const config = { headers: { "Content-Type": "application/json" } };
      const body = { username, password, email };
      const res = await axios.post("api/authRoutes/signup", body, config);
      console.log(res);
      alert("Sign up Successful!");
      window.location.href = "log-in"
    } catch (err) {
      console.log(err);
      alert("Email or username exist, please log in");
    }
  };

  validateEmail = (email) => {
    return String(email)
      .toLowerCase()
      .match(
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
      );
  };

  onSubmit = (event) => {
    event.preventDefault();
    console.log(this.validateEmail(this.state.email))
    if (this.containsBlank()) {
      alert("Please fill all the fields above");
      return;
    }
    if (this.validateEmail(this.state.email) === null){
      alert("Invalid Email");
      return;
    }
    this.signupUser(this.state.username, this.state.password, this.state.email);
  };

  render() {
    return (
      <div className="auth-signup">
        <NavBar />
        <form>
          <h3>Sign Up</h3>
          <div className="form-group">
            <label>Username</label>
            <input
              type="text"
              className="form-control"
              placeholder="Username"
              onChange={this.changeUserName}
            />
          </div>
          <div className="form-group">
            <label>Email address</label>
            <input
              type="email"
              className="form-control"
              placeholder="Enter email"
              onChange={this.changeEmail}
            />
          </div>
          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              className="form-control"
              placeholder="Enter password"
              onChange={this.changePassword}
            />
          </div>
          <div>
            <button
              type="submit"
              className="btn btn-primary btn-block"
              onClick={this.onSubmit}
            >
              Sign Up
            </button>
          </div>
          <p className="forgot-password text-right">
            Already have a account? <a href="/log-in">log in</a> here
          </p>
        </form>
      </div>
    );
  }
}
