const express = require("express");
const path = require("path");

module.exports = (app) => {
  app.use(express.static(path.join(__dirname, "/../public/main")));
  app.use("/board/:id", express.static(path.join(__dirname, "/../public/paint")));
  app.use("/err", express.static(path.join(__dirname, "/../public/serverErr")));
  app.get("*", (req, res) => {
    res.status(404).sendFile(path.join(__dirname, "/../", "/public/404/404.html"));
  });
};
