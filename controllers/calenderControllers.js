const Calender = require("../models/availabilityModel");

exports.getUserAvailability = async (req, res) => {
  const { email } = req.body;
  try {
    let HasUser = await Calender.findOne({ email: email });

    if (HasUser === null) {
      res.status(201).json({
        status: 'success'
      });
    }
    else{
    res.status(201).json({
      availabilities: HasUser.availabilities,
    });
    }
  } catch (err) {
    res.status(401).json(err.message);
  }
};

exports.updateAvailability = async (req, res) => {
  const { email, username, availabilities } = req.body;
  const query = { email: email, username: username };

  try {
    let HasUser = await Calender.findOne({ email: email });

    if (HasUser === null) {
      await createUser(email, username, req, res);
    }
    await Calender.updateOne(query, {
      $set: { availabilities: availabilities },
    });
    res.status(201).json({
      status: "success",
    });
  } catch (err) {
    res.status(401).json(err.message);
  }
};

exports.getAll = async (req, res) => {
  try {
    const all = await Calender.find({});
    res.status(201).json({
      allEntries: all,
    });
  } catch (err) {
    res.status(401).json(err.message);
  }
};

const createUser = async (email, username, req, res) => {
  try {
    await Calender.create({
      email: email,
      username: username,
      availabilities: [],
    });
  } catch (err) {}
};
