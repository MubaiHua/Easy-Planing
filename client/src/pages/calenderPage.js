import React, { Component } from "react";
import NavBar from "../components/AppNavbar";
import Schedule from "../components/Schedule-selector";
import Log from "../components/Logs";
import axios from "axios";

export default class calenderPage extends Component {
  constructor() {
    super();
    this.state = {
      user: "",
      email: "",
      data_recieved: false,
    };
  }

  componentDidMount() {
    const token = sessionStorage.getItem("token");
    const config = { headers: { "Content-Type": "application/json" } };
    const body = { token };
    axios.post("api/authRoutes/userCheck", body, config)
      .then((res) => {
        this.setState({
          user: res.data.user,
          email: res.data.email,
          data_recieved: true,
        });
      })
      .catch((err) => {
        console.log(err);
        // alert("Protected contents");
        // window.location.href = "log-in";
        alert(err);
      });
  }

  render() {
    return this.state.data_recieved ? (
      <div>
        <React.StrictMode>
          <div className="auth-calender">
            <NavBar username={this.state.user} />
            {/* <Schedule username={this.state.user} email={this.state.email} /> */}
          </div>
          {/* \<br></br>
          <div>
            <Log username={this.state.user} email={this.state.email} />
          </div> */}
        </React.StrictMode>
      </div>
    ) : (
      <h1>Loading</h1>
    );
  }
}
