const User = require("../models/Users");
const { authUser, authExercise } = require("../auth/validate_model");
const createError = require("http-errors");

// ----------------------------------------------------createUser------------------------
const createUser = async (req, res, next) => {
  try {
    const username = await authUser.validateAsync(req.body);
    const user = new User(username);

    await user
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
      throw createError.NotFound();
    }
    res.status(200).json(allUsers);
  } catch (error) {
    next(error);
  }
};

// ----------------------------------------------createUserExercise----------------------------
const createUserExercise = async (req, res, next) => {
  const { _id } = req.params;
  delete req.body._id;
  try {
    const { description, duration, date } = await authExercise.validateAsync(
      req.body
    );
    const isExistingUser = await User.findById({ _id });
    if (!isExistingUser) {
      throw createError.NotFound(
        `user with id: ${_id} does not exist. Create a user first`
      );
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
        const newLog = newExercise.log[newExercise.log.length - 1];
        res.status(200).json({
          _id: newExercise._id,
          username: newExercise.username,
          description: newLog.description,
          duration: newLog.duration,
          date: new Date(newLog.date).toDateString(),
        });
      })
      .catch((error) => res.status(500).json({ message: error.message }));
  } catch (error) {
    next(error);
  }
};

// -------------------------------------------------GetUserExercise--------------------------------
// @route  GET /api/users/:id/logs
// @desc  Get a user and all their exercises. Exercise can be filtered?
//         by date using from and to queries
const getUserExercises = async (req, res, next) => {
  const { _id } = req.params;
  var filter = req.query;
  try {
    const isExistingUser = await User.findById({ _id }, { "log._id": 0 });
    if (!isExistingUser) {
      throw createError.NotFound(`user does not exist`);
    }
    // logic for filtering dates baseed on given query {from & to}
    const logFilter = isExistingUser.log.filter((doc) =>
      filter.hasOwnProperty("from") && filter.hasOwnProperty("to")
        ? doc.date >= new Date(filter.from) && doc.date <= new Date(filter.to)
        : filter.hasOwnProperty("from")
        ? doc.date >= new Date(filter.from)
        : filter.hasOwnProperty("to")
        ? doc.date <= new Date(filter.to)
        : doc
    );
    // Logic to llimit what has been filtered based on limit query
    const logLimit = filter.hasOwnProperty("limit")
      ? logFilter.splice(0, filter.limit)
      : logFilter;

    res.status(200).json({
      username: isExistingUser.username,
      count: isExistingUser.log.length,
      _id: isExistingUser._id,
      log: logLimit.map((doc) => ({
        description: doc.description,
        duration: doc.duration,
        date: new Date(doc.date).toDateString(),
      })),
    });
  } catch (error) {
    console.log(error);
    next(error);
  }
};

module.exports = {
  createUser,
  getAllUsers,
  createUserExercise,
  getUserExercises,
};
