const User = require("../models/Users");

const createUser = async (req, res) => {
  const { username } = req.body;

  try {
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
    res.status(500).json({ error: err.message });

  }
};

const getAllUsers = async (req, res) => {
  try {
    const allUsers = await User.find({}, 'username');
    if (allUsers.length === 0) {
      return res.status(200).json({ message: `No user found!` });
    }
    res.status(200).json(allUsers);    
  } catch (error) {
    res.status(500).json({message: `server error`})
  }
};

const createUserExercise = async (req, res) => {
  const { _id } = req.params;
  const { description, duration, date } = req.body;
  console.log(req.body)
try {
  const isExistingUser = await User.findById({ _id });
  if (!isExistingUser) {
    return res.status(401).json({
      message: `user with id: ${_id} does not exist. Create a user first`,
    });
  }

  await User.findByIdAndUpdate({_id}, {$push : {
    log: {
      description, duration, date,
    }
  }}, {new: true})
    .then(newExercise => {
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
  res.status(500).json({message: `id: ${_id} is incorrect.`})

}
};


// @route  GET /api/users/:id/logs
// @description  Get a user and all their exercises. Exercisecan be filtered?
// by date using from and to queries
const getUserExercises = async (req, res) => {
  const { _id } = req.params;
  var filter = req.query;
  try {
    const isExistingUser = await User.findById({_id}, {"log._id": 0})
    if (!isExistingUser) {
      return res
        .status(404)
        .json({ error: `User does not exist. Create a user` });
    }

    const logFilter = isExistingUser.log.filter(doc => (filter.hasOwnProperty('from') && filter.hasOwnProperty('to')) 
    ? (doc.date >= new Date(filter.from) && doc.date <= new Date(filter.to)) : (filter.hasOwnProperty('from')) 
    ? (doc.date >= new Date(filter.from)) : (filter.hasOwnProperty('to')) 
    ? doc.date <= new Date(filter.to) : doc);

    const logLimit = (filter.hasOwnProperty('limit')) ? logFilter.splice(0, filter.limit) : logFilter;

        res.status(200).json({
          username: isExistingUser.username,
          count: isExistingUser.log.length,
          _id: isExistingUser._id,
          log: logLimit.map((doc) => ({
            description: doc.description,
            duuration: doc.duration,
            date: new Date(doc.date).toDateString(),
          })),});
    
  } catch (error) {
    console.log(error);
    res.status(500).json({message: error.message})
  }
};

module.exports = {
  createUser,
  getAllUsers,
  createUserExercise,
  getUserExercises,
};
