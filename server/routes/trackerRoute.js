const express = require("express");
const {
  createUser,
  getAllUsers,
  createUserExercise,
  getUserExercises,
} = require("../controllers/trackerController");
const router = express.Router();

router.get("/users", getAllUsers);
router.post("/users", createUser);
router.post("/users/:_id/exercises", createUserExercise);
router.get("/users/:_id/logs", getUserExercises);

module.exports = router;
