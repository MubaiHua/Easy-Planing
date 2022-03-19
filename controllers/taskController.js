const Task = require("../models/taskModel");

exports.addTask = async (req, res) => {
  const { task, state, poster, solver } = req.body;
  try {
    await Task.create({
      task: task,
      state: state,
      poster: poster,
      solver: solver,
    });
    res.status(201).json({
      status: "success",
    });
  } catch (err) {
    res.status(401).json(err.message);
  }
};

exports.updateTask = async (req, res) => {
  const { id, state, solver } = req.body;
  try {
    await Task.findByIdAndUpdate(id, { state: state, solver: solver });
    res.status(201).json({
      status: "success",
    });
  } catch (err) {
    res.status(401).json(err.message);
  }
};

exports.getUserTask = async (req, res) => {
  const { solver } = req.body;
  try {
    const userTask = await Task.find({ solver: solver });
    if (userTask === null) {
      res.status(201).json({
        status: "no task found",
      });
    } else {
      res.status(201).json({
        usertask: userTask,
      });
    }
  } catch (err) {
    res.status(401).json(err.message);
  }
};

exports.getAllTask = async (req, res) => {
  try {
    const all = await Task.find({});
    res.status(201).json({
      allTasks: all,
    });
  } catch (err) {
    res.status(401).json(err.message);
  }
};

exports.deleteTask= async (req, res) => {
    const { id } = req.body;
    try {
      await Task.findByIdAndDelete(id);
      res.status(201).json({
        status: 'success'
      });
    } catch (err) {
      res.status(401).json(err.message);
    }
  };
