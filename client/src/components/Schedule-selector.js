import ScheduleSelector from "react-schedule-selector";
import React from "react";
import Dialog from "@mui/material/Dialog";
import API from "../utils/API";
import { DialogContent } from "@mui/material";
import DialogTitle from "@mui/material/DialogTitle";

export default class Schedule extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      user_schedule: [],
      all_schedule: [],
      userOnly: false,
      updateMode: false,
      email: props.email,
      username:  props.username,
      collection: undefined,
      dialogOpen: false,
      dialogUser: "None",
      dialogDate: "",
    };
  }

  componentDidMount(){
    this.getUserEntires();
    this.getAllEntries();
  }

  getAllEntries = async () => {
    try {
      const allEntries = await API.post("api/calenderRoutes/getAll");
      var allEntryData = allEntries.data.allEntries;
      var new_all_entries = [];
      var newCollection = new Map();
      for (let i = 0; i < allEntryData.length; i++) {
        let avails = allEntryData[i].availabilities;
        let username = allEntryData[i].username;
        for (let j = 0; j < avails.length; j++) {
          if (!new_all_entries.includes(avails[j])) {
            new_all_entries.push(avails[j]);
          }
          let date = new Date(avails[j]).getTime();
          let users =
            newCollection.get(date) !== undefined
              ? newCollection.get(date)
              : "";
          users = users + username + ", ";
          newCollection.set(date, users);
        }
      }
      this.setState({
        all_schedule: new_all_entries,
        collection: newCollection,
      });
    } catch (err) {
      console.log(err);
    }
  };

  handleChange = async (newSchedule) => {
    if (!this.state.updateMode) {
      return;
    }
    this.setState({ user_schedule: newSchedule });
  };

  updateUserEntries = async (email, username, availabilities) => {
    try {
      const config = { headers: { "Content-Type": "application/json" } };
      const body = { email, username, availabilities };
      await API.post("api/calenderRoutes/update", body, config);
      alert("Update successful");
    } catch (err) {
      console.log(err);
      alert("Update failed");
    }
  };

  getUserEntires = async () => {
    try {
      const config = { headers: { "Content-Type": "application/json" } };
      const body = { email: this.state.email };
      console.log(body);
      const res = await API.post("api/calenderRoutes/getUser", body, config);
      this.setState({
        user_schedule: res.data.availabilities,
      });
    } catch (err) {
      console.log(err);
    }
  };

  renderDateCell = (date, selected, refSetter) => {
    let backColor = "#42eff5";
    let collection = this.state.collection;
    let text = "";
    if (
      !this.state.userOnly &&
      collection !== undefined &&
      collection.get(date.getTime()) !== undefined
    ) {
      backColor = "#42f593";
      text = collection.get(date.getTime());
      text = text.substring(0, text.length - 2);
    }

    if (
      this.state.userOnly &&
      collection !== undefined &&
      collection.get(date.getTime()) !== undefined
      &&collection.get(date.getTime()).search(this.state.username)!==-1
    ) {
      backColor = "#42f593";
      text = collection.get(date.getTime());
      text = text.substring(0, text.length - 2);
    }

    if (
      collection !== undefined &&
      collection.get(date.getTime()) !== undefined
    ) {
      text = collection.get(date.getTime());
      text = text.substring(0, text.length - 2);
    }
    if (selected && this.state.updateMode) {
      backColor = "#f56c42";
    }

    let passed_date =  date.toString() 
    passed_date = passed_date.substring(0,3) + " "+ passed_date.substring(16,24);

    return (
      <button
        ref={refSetter}
        style={{
          width: "100%",
          height: "100%",
          background: backColor,
          borderRadius: "3px",
        }}
        onClick={() =>
          this.setState({
            dialogOpen: (this.state.updateMode)? false : true,
            dialogDate: passed_date,
            dialogUser: text,
          })
        }
      ></button>
    );
  };

  handleCloseDiaglog = () => {
    this.setState({dialogOpen:false})
  };

  handleCheckBox = () => {
    this.setState({
      userOnly: !this.state.userOnly,
    });
  };

  handleUpdate = async () => {
    this.setState({
      userOnly:true
    })
    if (this.state.updateMode === true) {
      await this.updateUserEntries(
        this.state.email,
        this.state.username,
        this.state.user_schedule
      );
      await this.getAllEntries();
    }
    this.setState({
      updateMode: !this.state.updateMode,
      userOnly: !this.state.userOnly,
    });
    window.location.reload();
  };

  render() {
    return (
      <div>
        <div>
          <h3>Availability Calender</h3>
          <ScheduleSelector
            selection={
              (this.state.userOnly || this.state.updateMode)
                ? this.state.user_schedule
                : this.state.all_schedule
            }
            numDays={7}
            minTime={8}
            maxTime={18}
            hourlyChunks={2}
            timeFormat={"hh:mm A"}
            dateFormat={"ddd"}
            startDate={"3-14-2022"}
            onChange={this.handleChange}
            renderDateCell={this.renderDateCell}
          />
        </div>
        <div>
          <input
            type="checkbox"
            className="custom-control-input"
            id="customCheck1"
            onChange={this.handleCheckBox}
            checked={this.state.userOnly}
          />
          <label for="vehicle1"> View my availabilities only</label>
        </div>
        <div>
          <button
            type="submit"
            className="btn btn-primary btn-block"
            onClick={this.handleUpdate}
          >
            {this.state.updateMode
              ? "Confirm Update"
              : "Update my availability"}
          </button>
        </div>
        <SimpleDialog open={this.state.dialogOpen} users = {this.state.dialogUser} date = {this.state.dialogDate} onClose = {this.handleCloseDiaglog}/>
      </div>
    );
  }
}

function SimpleDialog(props) {
  const { onClose, users, date, open } = props;

  const handleClose = () => {
    onClose();
  };

  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle>Available Users on {date}</DialogTitle>
      <DialogContent>{users}</DialogContent>
    </Dialog>
  );
}
