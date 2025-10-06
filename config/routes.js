const express = require("express");
const usersRoute = require("../routes/users");
const coursesRoute = require("../routes/courses");
const favoritesRoute = require("../routes/favorites");
const addToCartRoute = require("../routes/addToCart");

module.exports = function (app) {
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use("/users", usersRoute);
  app.use("/courses", coursesRoute);
  app.use("/favorites", favoritesRoute);
  app.use("/cart", addToCartRoute);
};
