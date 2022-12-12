const express = require("express");
require("dotenv").config();
const jwt = require("jsonwebtoken");

const todoRouter = require("./Routes/todo.route");
const connection = require("./Config/db");
const UserModel = require("./Model/User.model");
const validator = require("./Middlewares/authentication");

const server = express();
server.use(express.json());

server.get("/", (req, res) => {
  res.send({ msg: "Welcome to todo API" });
});

server.post("/signup", async (req, res) => {
  let data = req.body;

  try {
    if (data.name && data.email && data.password) {
      let newUser = new UserModel(data);
      await newUser.save();
      res.send({ msg: "Signup Successful" });
    } else {
      res.send({ msg: "Incorrect user details" });
    }
  } catch (err) {
    res.send({ msg: "Something went wrong somewhere" });
  }
});

server.post("/login", async (req, res) => {
  let data = req.body;

  try {
    if (data.email && data.password) {
      let { email, password } = data;

      let user = await UserModel.findOne({ $and: [{ email, password }] });
      if (user) {
        let token = jwt.sign({ UserId: user._id }, process.env.SECRET_KEY);

        res.send({ msg: "Login Successful", token });
      } else {
        res.send({ msg: "Incorrect user details" });
      }
    } else {
      res.send({ msg: "Incorrect user details" });
    }
  } catch (err) {
    res.send({ msg: "Something went wrong somewhere" });
    console.log(err);
  }
});
server.use(validator);
server.use("/todo", todoRouter);

server.listen(process.env.PORT, async () => {
  try {
    await connection;
    console.log("db is connected successfully");
  } catch (err) {
    console.log("db is connected");
    console.log(err);
  }

  console.log(`Server listning on http://localhost:${process.env.PORT}`);
});
