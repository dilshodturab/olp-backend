const express = require("express");
const usersRoute = require("../routes/users");

module.exports = function (app) {
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use("/users", usersRoute);
};
