const indexControl = (req, res) => {
  // res.render("index");
  res.sendFile(".../views/index.html");
};

module.exports = indexControl;
