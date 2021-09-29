const indexControl = (req, res) => {
  // res.render("index");
  res.sendFile("./index.html");
};

module.exports = indexControl;
