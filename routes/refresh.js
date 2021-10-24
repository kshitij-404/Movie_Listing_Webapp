const express = require("express");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const Users = require("../models/user");
const { refreshTokens } = require("./signin");

const RefreshRouter = express.Router();

RefreshRouter.route("/").get((req, res) => {
  const refreshToken = req.body.token;

  if (!refreshToken || !refreshTokens.includes(refreshToken)) {
    return res.json({ message: "Refresh token not found, login again" });
  }

  jwt.verify(refreshToken, "refresh", (err, payload) => {
    if (!err) {
      const accessToken = jwt.sign({ email: email }, "access", {
        expiresIn: "120s",
      });
      return res.json({ success: true, accessToken });
    } else {
      return res.json({
        success: false,
        message: "Invalid refresh token",
      });
    }
  });
});

module.exports = RefreshRouter;
