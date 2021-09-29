const User = require("../models/Users");
const { authUser, authExercise } = require("../auth/validate_model");

// ----------------------------------------------------createUser------------------------
const createUser = async (req, res, next) => {
  try {
    const username = await authUser.validateAsync(req.body);
    const user = await new User({
      username,
    });

    user
      .save()
      .then((doc) => {
        res.status(200).json({
          username: doc.username,
          _id: doc._id,
        });
      })
      .catch((err) => {
        res.status(500).json({ error: err.message });
      });
  } catch (error) {
    if (error.isJoi) error.status = 422;
    next(error);
  }
};

// -----------------------------------------------------getAllUser-----------------------------
const getAllUsers = async (req, res, next) => {
  try {
    const allUsers = await User.find({}, "username");
    if (allUsers.length === 0) {
      return res.status(200).json({ message: `No user found!` });
    }
    res.status(200).json(allUsers);
  } catch (error) {
    next(error);
  }
};

// ----------------------------------------------createUserExercise----------------------------
const createUserExercise = async (req, res, next) => {
  const { _id } = req.params;
  try {
    const { description, duration, date } = await authExercise.validateAsync(
      req.body
    );
    const isExistingUser = await User.findById({ _id });
    if (!isExistingUser) {
      return res.status(401).json({
        message: `user with id: ${_id} does not exist. Create a user first`,
      });
    }

    await User.findByIdAndUpdate(
      { _id },
      {
        $push: {
          log: {
            description,
            duration,
            date,
          },
        },
      },
      { new: true }
    )
      .then((newExercise) => {
        const log = newExercise.log[newExercise.log.length - 1];
        res.status(200).json({
          _id: newExercise._id,
          username: newExercise.username,
          description: log.description,
          duration: log.duration,
          date: new Date(log.date).toDateString(),
        });
      })
      .catch((error) => res.status(500).json({ message: error.message }));
  } catch (error) {
    next(error);
  }
};

// -------------------------------------------------GetUserExercise--------------------------------
// @route  GET /api/users/:id/logs
// @description  Get a user and all their exercises. Exercisecan be filtered?
// by date using from and to queries
const getUserExercises = async (req, res) => {
  const { _id } = req.params;
  var filter = req.query;
  try {
    const isExistingUser = await User.findById({ _id }, { "log._id": 0 });
    if (!isExistingUser) {
      return res
        .status(404)
        .json({ error: `User does not exist. Create a user` });
    }

    const logFilter = isExistingUser.log.filter((doc) =>
      filter.hasOwnProperty("from") && filter.hasOwnProperty("to")
        ? doc.date >= new Date(filter.from) && doc.date <= new Date(filter.to)
        : filter.hasOwnProperty("from")
        ? doc.date >= new Date(filter.from)
        : filter.hasOwnProperty("to")
        ? doc.date <= new Date(filter.to)
        : doc
    );

    const logLimit = filter.hasOwnProperty("limit")
      ? logFilter.splice(0, filter.limit)
      : logFilter;

    res.status(200).json({
      username: isExistingUser.username,
      count: isExistingUser.log.length,
      _id: isExistingUser._id,
      log: logLimit.map((doc) => ({
        description: doc.description,
        duuration: doc.duration,
        date: new Date(doc.date).toDateString(),
      })),
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createUser,
  getAllUsers,
  createUserExercise,
  getUserExercises,
};
