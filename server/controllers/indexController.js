const path = require("path");

const indexControl = (req, res) => {
  // res.render("index");
  res.sendFile(path.resolve("./views/index.html"));
};

module.exports = indexControl;
