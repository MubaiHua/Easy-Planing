import React, { Component } from "react";
import API from "../utils/API";
import "bootstrap/dist/css/bootstrap.min.css";
import { DataGrid } from "@mui/x-data-grid";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";

const columns = [
  {
    field: "id",
    headerName: "No.",
    width: 60,
    hide: true,
    disableColumnMenu: true,
  },
  {
    field: "user",
    headerName: "User",
    width: 120,
    disableColumnMenu: true,
  },
  {
    field: "content",
    headerName: "Content",
    width: 400,
    disableColumnMenu: true,
  },
  {
    field: "session",
    headerName: "Session",
    width: 190,
    disableColumnMenu: true,
  },
  {
    field: "delete",
    headerName: "Delete",
    sortable: false,
    disableColumnMenu: true,
    width: 120,
    renderCell(params) {
      const handleDelete = async () => {
        const obj_id = params.getValue(params.id, "obj_id");
        const config = { headers: { "Content-Type": "application/json" } };
        const body = { _id: obj_id };
        try {
          await API.post(
            "http://localhost:5000/api/logRoutes/deleteLog",
            body,
            config
          );
          window.location.reload();
        } catch (err) {
          console.log(err);
        }
      };

      return (
        <Button
          variant="contained"
          color="primary"
          size="small"
          style={{ marginRight: 32, width: 100, height: 40, borderRadius: 5 }}
          onClick={handleDelete}
        >
          Delete
        </Button>
      );
    },
  },
  { field: "obj_id", hide: true },
];

class Log extends Component {
  constructor(props) {
    super(props);
    this.state = {
      rows: [],
      username: props.username,
      email: props.email,
      serachKeyword: "None",
      searchUser: "None",
      searchSession: "xxxxxxxx",
      user_schedule: [],
      addSession: "",
      addContent: "",
    };
  }
  componentDidMount() {
    this.getRowsData();
    this.getUserEntires();
  }

  generateRows = (rowsData) => {
    console.log(rowsData);
    let temp = [];
    for (let i = 0; i < rowsData.length; i++) {
      temp.push({
        id: i + 1,
        user: rowsData[i].username,
        session: rowsData[i].session,
        content: rowsData[i].content,
        obj_id: rowsData[i]._id,
      });
    }
    this.setState({
      rows: temp,
    });
  };

  getRowsData = () => {
    try {
      API.post("api/logRoutes/getAllLog").then((res) =>
        this.generateRows(res.data.allLogs)
      );
    } catch (err) {
      console.log(err);
    }
  };

  handleSearchSessionChange = (event) => {
    const dateString = this.state.searchSession.substring(0, 3);
    this.setState({
      searchSession: dateString + event.target.value,
    });
  };

  handleSearchSessionChangeDay = (event) => {
    const timeString = this.state.searchSession.substring(3, 8);
    this.setState({
      searchSession: event.target.value + timeString,
    });
  };

  handleSearchKeywordChange = (event) => {
    this.setState({
      serachKeyword: event.target.value,
    });
  };

  handlesearchUserChange = (event) => {
    this.setState({
      searchUser: event.target.value,
    });
  };

  handleAddContentChange = (event) => {
    this.setState({
      addContent: event.target.value,
    });
  };

  handleAddSessionChange = (event) => {
    this.setState({
      addSession: event.target.value,
    });
  };

  handleSearch = (event) => {
    event.preventDefault();
    try {
      const config = { headers: { "Content-Type": "application/json" } };
      const body = {
        username: this.state.searchUser,
        content: this.state.serachKeyword,
        session: this.state.searchSession,
      };
      API.post("api/logRoutes/searchLog", body, config).then((res) =>
        this.generateRows(res.data.logs)
      );
    } catch (err) {
      console.log(err);
    }
  };

  getUserEntires = async () => {
    try {
      const config = { headers: { "Content-Type": "application/json" } };
      const body = { email: this.state.email };
      const res = await API.post("api/calenderRoutes/getUser", body, config);
      const resData = res.data.availabilities;
      const new_arr = [];
      for (let i = 0; i < resData.length; i++) {
        let str = resData[i].substring(13, 16);
        let hr = Number(resData[i].substring(11, 13));
        if (hr === 0) hr = 17;
        else hr -= 7;
        str = hr.toString() + str;
        let d = new Date(resData[i]).getTime();

        if (d < 1647356400000) str = "Mon" + str;
        else if (d < 1647442800000) str = "Tue" + str;
        else if (d < 1647529200000) str = "Wed" + str;
        else if (d < 1647615600000) str = "Thu" + str;
        else if (d < 1647702000000) str = "Fri" + str;
        else if (d < 1647788400000) str = "Sat" + str;
        else str = "Sun" + str;
        new_arr.push(str);
      }
      this.setState({
        user_schedule: new_arr,
      });
    } catch (err) {
      console.log(err);
    }
  };

  addLog = async(event)=>{
    event.preventDefault();
    if(this.state.addSession === "" || this.state.addContent === ""){
      alert("You must enter a session or content")
      return;
    }
    try{
      const config = { headers: { "Content-Type": "application/json" } };
      const body = { username:this.state.username, content:this.state.addContent,  session:this.state.addSession};
      await API.post("api/logRoutes/addLog",body,config);
      alert("Add log successful")
    }
    catch (err) {
      console.log(err);
    }
    window.location.reload();
  }

  render() {
    return (
      <div>
        <div className="auth-log">
          <h2>Availability Logs</h2>
          <div style={{ height: 425 }}>
            <DataGrid
              rows={this.state.rows}
              columns={columns}
              pageSize={6}
              rowsPerPageOptions={[6]}
            />
          </div>
        </div>
        <div className="auth-searchAddLeft">
          <form className="marginForm" onSubmit={this.handleSearch}>
            <p />
            <label>
              {" "}
              Please enter some keywords for the content you're looking for:{" "}
            </label>
            <p />
            <TextField
              label="Enter keywords"
              fullWidth
              variant="outlined"
              value={
                this.state.serachKeyword === "None"
                  ? ""
                  : this.state.serachKeyword
              }
              onChange={this.handleSearchKeywordChange}
            />

            <p />
            <label> Please enter a username you're looking for：</label>
            <p />
            <TextField
              label="Enter username"
              variant="outlined"
              value={
                this.state.searchUser === "None" ? "" : this.state.searchUser
              }
              onChange={this.handlesearchUserChange}
            />

            <p />
            <label> Please select the session you're looking for：</label>
            <p />
            <FormControl variant="standard" sx={{ m: 1, minWidth: 120 }}>
              <InputLabel id="demo-simple-select-standard-label">
                Day
              </InputLabel>
              <Select
                labelId="demo-simple-select-standard-label"
                id="demo-simple-select-standard"
                value={this.state.searchSession.substring(0, 3)}
                onChange={this.handleSearchSessionChangeDay}
                label="Day"
              >
                <MenuItem value="xxx">
                  <em>None</em>
                </MenuItem>
                <MenuItem value={"Mon"}>Mon</MenuItem>
                <MenuItem value={"Tue"}>Tue</MenuItem>
                <MenuItem value={"Wed"}>Wed</MenuItem>
                <MenuItem value={"Thu"}>Thu</MenuItem>
                <MenuItem value={"Fri"}>Fri</MenuItem>
                <MenuItem value={"Sat"}>Sat</MenuItem>
                <MenuItem value={"Sun"}>Sun</MenuItem>
              </Select>
            </FormControl>

            <FormControl variant="standard" sx={{ m: 1, minWidth: 120 }}>
              <InputLabel id="demo-simple-select-standard-label">
                Time
              </InputLabel>
              <Select
                labelId="demo-simple-select-standard-label"
                id="demo-simple-select-standard"
                value={this.state.searchSession.substring(3, 8)}
                onChange={this.handleSearchSessionChange}
                label="Time"
              >
                <MenuItem value="xxxxx">
                  <em>None</em>
                </MenuItem>
                <MenuItem value={"8:00"}>8:00</MenuItem>
                <MenuItem value={"8:30"}>8:30</MenuItem>
                <MenuItem value={"9:00"}>9:00</MenuItem>
                <MenuItem value={"9:30"}>9:30</MenuItem>
                <MenuItem value={"10:00"}>10:00</MenuItem>
                <MenuItem value={"10:30"}>10:30</MenuItem>
                <MenuItem value={"11:00"}>11:00</MenuItem>
                <MenuItem value={"11:30"}>11:30</MenuItem>
                <MenuItem value={"12:00"}>12:00</MenuItem>
                <MenuItem value={"12:30"}>12:30</MenuItem>
                <MenuItem value={"13:00"}>13:00</MenuItem>
                <MenuItem value={"13:30"}>13:30</MenuItem>
                <MenuItem value={"14:00"}>14:00</MenuItem>
                <MenuItem value={"14:30"}>14:30</MenuItem>
                <MenuItem value={"15:00"}>15:00</MenuItem>
                <MenuItem value={"15:30"}>15:30</MenuItem>
                <MenuItem value={"16:00"}>16:00</MenuItem>
                <MenuItem value={"16:30"}>16:30</MenuItem>
                <MenuItem value={"17:00"}>17:00</MenuItem>
                <MenuItem value={"17:30"}>17:30</MenuItem>
              </Select>
            </FormControl>

            <p />
            <Button
              type="submit"
              sx={{ marginTop: 1, height: 40 }}
              variant="contained"
            >
              Search
            </Button>
          </form>
        </div>

        <div className="auth-searchAddRight">
          <form className="marginForm" onSubmit={this.addLog}>
            <p />
            <label> Please enter your new log here: </label>
            <p />
            <TextField
              label="Enter log content"
              fullWidth
              variant="outlined"
              value={this.state.addContent}
              onChange={this.handleAddContentChange}
            />

            <p />
            <label> Please select the session：</label>
            <p />
            <FormControl variant="standard" sx={{ m: 1, minWidth: 120 }}>
              <InputLabel id="demo-simple-select-standard-label">
                Day
              </InputLabel>
              <Select
                labelId="demo-simple-select-standard-label"
                id="demo-simple-select-standard"
                value={this.state.addSession}
                onChange={this.handleAddSessionChange}
                label="Day"
              >
                {this.state.user_schedule?.map(option => {
                  return (
                    <MenuItem  key={option} value={option}>
                      {option}
                    </MenuItem>
                  );
                })}
              </Select>
            </FormControl>

            <p />
            <Button
              type="submit"
              sx={{ marginTop: 1, height: 40 }}
              variant="contained"
            >
              Add
            </Button>
          </form>
        </div>
      </div>
    );
  }
}

export default Log;
