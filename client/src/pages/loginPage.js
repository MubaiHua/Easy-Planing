import React, { Component } from "react";
import NavBar from "../components/WelcomePageNavBar";
import axios from "axios";

export default class Login extends Component {
  constructor() {
    super();
    this.state = {
      password: "",
      email: "",
    };
  }

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
      this.state.email === "" ||
      this.state.password === ""
    );
  };

  loginUser = async (password, email) => {
    try {
      const config = { headers: { "Content-Type": "application/json" } };
      const body = { password, email };
      const res = await axios.post("api/authRoutes/login", body, config);
      alert("Login Successful!");
      sessionStorage.setItem("token", res.data.token);
      window.location.href = "calender"
    } catch (err) {
      console.log(err);
      alert("Please verify your email and password");
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
    if (this.containsBlank()) {
      alert("Please fill all the fields above");
      return;
    }
    if (this.validateEmail(this.state.email) === null){
      alert("Invalid Email");
      return;
    }
    this.loginUser(this.state.password, this.state.email);
  };

  render() {
    return (
      <div className="auth-signup">
          <NavBar />
          <form>
            <h3>Login</h3>
            <div className="form-group">
              <label>Email address</label>
              <input
                type="email"
                className="form-control"
                placeholder="Enter email"
                onChange={this.changeEmail}
                value = {this.state.email}
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
              <button type="submit" className="btn btn-primary btn-block" onClick={this.onSubmit}>
                Submit
              </button>
            </div>
            <p className="forgot-password text-right">
              Don't have a account? <a href="/sign-up">sign up</a> here
            </p>
          </form>
        </div>
    );
  }
}
