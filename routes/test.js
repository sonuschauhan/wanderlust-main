const express = require("express");
const router = express.Router();

router.get("/testmap", (req, res) => {
  res.render("testmap"); // we’ll create this testmap.ejs
});

module.exports = router;
