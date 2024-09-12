const express = require("express");
const app = express();
const ejs = require("ejs");
app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }));

let userarray = [];
let todoarray = [];
let errormessage = "";

app.get("/", (request, response) => {
  response.render("signup", { errormessage });
});

app.get("/login", (req, res) => {
  res.render("login");
});

app.get("/dashboard", (req, res) => {
  res.render("dashboard");
});

app.get("/todo", (req, res) => {
  res.render("todo", { todoarray });
});

app.post("/register", (req, res) => {
  console.log(req.body);
  let body = req.body;
  let existuser = userarray.find((user) => user.email === req.body.email);
  if (existuser) {
    errormessage = "user already exit";
    res.redirect("/");
  } else {
    errormessage = "";
    userarray.push(body);
    console.log(userarray);
    res.redirect("/login");
  }
});

app.post("/onlinelogin", (req, res) => {
  console.log(req.body);
  // /this is to have access to what user is sending
  // let body = req.body;
  const existuser = userarray.find((user) => user.email == req.body.email);
  console.log(existuser);
  if (!existuser) {
    console.log("you are not a registered user ; please sign up");
  } else {
    if (existuser.password == req.body.password) {
      console.log("login successful");
      res.redirect("/dashboard");
    } else {
      console.log("invalid password");
    }
  }
});
app.post("/addtodo", (req, res) => {
  console.log(req.body);
  todoarray.push(req.body);
  res.redirect("/todo");
});

app.post("/delete", (req, res) => {
  console.log(req.body);
  todoarray.splice(req.body, 1);
  res.redirect("/todo");
});

app.post("/edit", (req, res) => {
  console.log(req.body);

  res.redirect("/todo");
});

const port = 8003;
//is a function that require a call back function
app.listen(port, () => {
  console.log(`app started on port ${port} `);
});
