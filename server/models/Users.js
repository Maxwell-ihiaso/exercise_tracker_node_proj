const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const UserSchema = new Schema({
  username: {
    type: String,
    required: true,
    trim: true,
  },
  log: [{
    description: {type:String, required: true},
    duration: {type:Number, required: true},
    date: {
      type: Date,
      default: Date.now,      
    }
  }],
});

module.exports = mongoose.model("User", UserSchema);
