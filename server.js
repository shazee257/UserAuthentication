const express = require("express");
const session = require("express-session");
const bcrypt = require("bcrypt");

const app = express();
app.use(express.json());
app.use(
  session({
    secret: "adfsdlfjsl1",
    resave: false,
    saveUninitialized: true,
  })
);

const users = [];

app.get("/users", (req, res) => {
  res.json(users);
});

app.post("/users", async (req, res) => {
  try {
    const hashPassword = await bcrypt.hash(req.body.password, 10);
    const user = {
      name: req.body.name,
      password: hashPassword,
    };
    users.push(user);
    res.status(201).send();
  } catch (e) {
    res.status(500).send();
  }
});

app.post("/users/login", async (req, res) => {
  const user = users.find((user) => user.name === req.body.name);
  if (user == null) {
    return res.status(400).send("Cannot find user");
  }
  try {
    if (await bcrypt.compare(req.body.password, user.password)) {
      req.session.name = user.name;
      res.send("Success");
    } else {
      res.send("Not Allowed");
    }
  } catch {
    res.status(500).send();
  }
});

app.get("/dashboard", (req, res) => {
  if (req.session.name) {
    res.json("Welcome in dashboard!");
  } else {
    res.json("Welcome in Login!");
  }
});

app.listen(3000);
