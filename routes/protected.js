const express = require("express");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const Users = require("../models/user");

const ProtectedRouter = express.Router();

ProtectedRouter.route("/").get((req, res) => {
  // const {token} = req.cookies;
  // let token = req.headers["authorization"];
  // token = token.split(" ")[1];
  let token = req.body.refreshToken;

  if (token) {
    // jwt.verify(token,process.env.JWT_SECRET,(err,payload)=>{
    jwt.verify(token, "access", (err, payload) => {
      if (err) return res.status(401).json(null);

      const { _id } = payload;
      Users.findById(_id).then((userdata) => {
        res.json({ token, userdata });
      });
    });
  } else res.json(null);
  // if (token) {
  //   token = token.split(" ")[1];
  //   // jwt.verify(token,process.env.JWT_SECRET,(err,payload)=>{
  //   jwt.verify(token, "access", (err, payload) => {
  //     if (err.message === "jwt expired") {
  //       return res.json({
  //         success: false,
  //         message: "Access Token Expired",
  //       });
  //     } else if (err)
  //       return res.status(401).json({ err, message: "User not authenticated" });

  //     const { _id } = payload;
  //     Users.findById(_id).then((userdata) => {
  //       res.json({ token, userdata });
  //     });
  //   });
  // } else res.json(null);
});

module.exports = ProtectedRouter;
