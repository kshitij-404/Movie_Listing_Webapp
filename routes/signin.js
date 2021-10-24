const express = require("express");
const mongoose = require("mongoose");
const Users = require("../models/user");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const SignInRouter = express.Router();

let refreshTokens = [];

SignInRouter.use(express.json());

SignInRouter.route("/").post((req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(422).json({ error: "Fill each Detail" });
  }
  Users.findOne({ email: email })
    .then((savedperson) => {
      if (!savedperson) {
        return res.status(422).json({ error: "Invalid Credentials" });
      }

      bcrypt
        .compare(password, savedperson.password)
        .then((match) => {
          if (match) {
            // const token = jwt.sign({_id:savedperson._id},process.env.JWT_SECRET);
            // res.cookie('token', token, { httpOnly: true });
            // res.status(200).json({token , savedperson})
            let accessToken = jwt.sign({ email }, "access", {
              expiresIn: "120s",
            });
            let refreshToken = jwt.sign({ email }, "refresh", {
              expiresIn: "7d",
            });
            refreshTokens.push(refreshToken);

            return res.status(201).json({
              accessToken,
              refreshToken,
            });
          } else {
            return res.status(400).json({ error: "Invalid Credentials" });
          }
        })
        .catch((err) => {
          console.log(err, "error in finding match");
        });
    })
    .catch((err) => console.log(err, "error in finding user"));
  console.log(req);
});
module.exports = refreshTokens;
module.exports = SignInRouter;
