import React, { Component } from "react";
import NavBar from "../components/AppNavbar";
import API from "../utils/API";
import TaskCard from "../components/TaskCard";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";

export default class taskPage extends Component {
  constructor() {
    super();
    this.state = {
      user: "",
      email: "",
      data_recieved: false,
      all_tasks: [],
      user_tasks: [],
      newtask: "",
    };
  }

  componentDidMount() {
    const token = sessionStorage.getItem("token");
    const config = { headers: { "Content-Type": "application/json" } };
    const body = { token };
    API.post("api/authRoutes/userCheck", body, config)
      .then((res) => {
        this.setState({
          user: res.data.user,
          email: res.data.email,
          data_recieved: true,
        });

        const config = { headers: { "Content-Type": "application/json" } };
        const body = { solver: this.state.user };
        console.log(body);
        API.post("api/taskRoutes/getUserTask", body, config)
          .then((res) => {
            let data = res.data.usertask;
            let temp = [];
            for (let i = 0; i < data.length; i++) {
              temp.push(data[i]);
            }
            console.log(data);
            this.setState({
              user_tasks: temp,
            });
          })
          .catch((err) => {
            console.log(err);
          });
      })
      .catch((err) => {
        console.log(err);
        alert("Protected contents");
        window.location.href = "log-in";
      });

    API.post("api/taskRoutes/getAllTask")
      .then((res) => {
        let data = res.data.allTasks;
        let temp = [];
        for (let i = 0; i < data.length; i++) {
          temp.push(data[i]);
        }
        console.log(data);
        this.setState({
          all_tasks: temp,
        });
      })
      .catch((err) => {
        console.log(err);
      });
  }

  handleTaskBox = (event) => {
    event.preventDefault();
    this.setState({
      newtask: event.target.value,
    });
  };

  postNewTask = async (event) => {
    event.preventDefault();
    try {
      const config = { headers: { "Content-Type": "application/json" } };
      const body = {
        task: this.state.newtask,
        state: "posted",
        poster: this.state.user,
        solver: "",
      };
      await API.post("api/taskRoutes/addTask", body, config);
      alert("Successfully posted new task");
      window.location.reload();
    } catch (err) {
      console.log(err);
    }
  };

  render() {
    return this.state.data_recieved ? (
      <div className="auth-task">
        <div className="auth-alltask">
          <NavBar username={this.state.user} />
          <h2>All Task</h2>
          {this.state.all_tasks?.map((option) => {
            return (
              <TaskCard
                key={option._id}
                task={option.task}
                state={option.state}
                poster={option.poster}
                solver={option.solver}
                id={option._id}
                user={this.state.user}
                mode="all"
              />
            );
          })}
        </div>

        <div className="auth-usertask">
          <h2> You can start a new task: </h2>
          <p />
          <TextField
            label="Enter task"
            fullWidth
            variant="outlined"
            value={this.state.newtask}
            onChange={this.handleTaskBox}
          />
          <p />
          <Button
            type="submit"
            sx={{ marginTop: 1, height: 40 }}
            variant="contained"
            onClick={this.postNewTask}
          >
            Post
          </Button>
          <p />
          <h2>Your Task</h2>
          {this.state.user_tasks?.map((option) => {
            return (
              <TaskCard
                key={option._id}
                task={option.task}
                state={option.state}
                poster={option.poster}
                solver={option.solver}
                id={option._id}
                user={this.state.user}
                mode="user"
              />
            );
          })}
        </div>
      </div>
    ) : (
      <h1>Loading</h1>
    );
  }
}
