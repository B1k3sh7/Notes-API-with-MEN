const User = require("../models/user.model");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { validationResult } = require("express-validator");
const globalEmitter = require("../emitter/globalEmitter");
require("dotenv").config();

async function signUp(req, res) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      error: errors.array(),
    });
  }

  let { name, email, password } = req.body;
  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        error: "User already exists",
      });
    }

    const result = await User.create({
      name,
      email,
      password,
    });

    const token = jwt.sign(
      {
        email: result.email,
        id: result._id,
      },
      process.env["SECRET_KEY"],
      {
        expiresIn: "20m",
      }
    );
    res.json({
      token: token,
    });
    globalEmitter.emit("signup", result._id);
  } catch (error) {
    console.log(error.message);
    res.status(500).json({
      error: "Internal server error",
    });
  }
}

async function login(req, res) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      error: errors.array(),
    });
  }

  let { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({
        error: "User doesn't exist",
      });
    }

    const passwordCompare = await bcrypt.compare(password, user.password);
    if (!passwordCompare) {
      return res.status(400).json({
        error: "Invalid credentials",
      });
    }
    const token = jwt.sign(
      {
        email: user.email,
        id: user._id,
      },
      process.env["SECRET_KEY"],
      {
        expiresIn: "20m",
      }
    );
    res.json({
      token: token,
    });
    globalEmitter.emit("login", user._id);
  } catch (error) {
    console.log(error.message);
    res.status(500).json({
      error: "Internal server error",
    });
  }
}

module.exports = { signUp, login };
