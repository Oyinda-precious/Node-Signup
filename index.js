const express = require("express");
const app = express();
const ejs = require("ejs");
app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }));

let userarray = [];
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
  let body = req.body;
  userarray.push(body);
  console.log(userarray);
  res.redirect("/dashboard");
});

const port = 8003;
//is a function that require a call back function
app.listen(port, () => {
  console.log(`app started on port ${port} `);
});
