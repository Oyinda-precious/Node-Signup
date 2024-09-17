const express = require("express");
const app = express();
const ejs = require("ejs");
const mongoose = require("mongoose");

// CRUD CREATE READ UPDATE DELETE
//middleware
app.use(express.urlencoded({ extended: true }));
app.set("view engine", "ejs");

let userarray = [];
let todoarray = [];
let errormessage = "";

const userschema = mongoose.Schema({
  firstname: { type: String },
  lastname: { type: String },
  email: { type: String },
  password: { type: Number },
});

const usermodel = mongoose.model("user_collection", userschema);

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

app.post("/register", async (req, res) => {
  try {
    console.log(req.body);
    const createuser = await usermodel.create(req.body);
    if (createuser) {
      console.log("user created successfully");
    } else {
      console.log("unable to create user");
    }
  } catch (error) {
    console.log(error);
  }

  // let existuser = userarray.find((user) => user.email === req.body.email);
  // if (existuser) {
  //   errormessage = "user already exit";
  //   res.redirect("/");
  // } else {
  //   errormessage = "";
  //   userarray.push(body);
  //   console.log(userarray);
  //   res.redirect("/login");
  // }
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
  const { index } = req.body;
  // let index = req.body.index;
  todoarray.splice(index, 1);
  res.redirect("/todo");
});

app.get("/edit/:index", (req, res) => {
  console.log(req.params.index);
  const { index } = req.params;
  let onetodo = todoarray[index];
  res.render("edit", { onetodo, index });
});

app.post("/edittodo/:index", (req, res) => {
  console.log(req.body);
  const { index } = req.params;
  console.log(todoarray[index]);
  todoarray[index] = req.body;
  res.redirect("/todo");
});

const uri =
  "mongodb+srv://oyinda:oyinda123@cluster0.mqvo7.mongodb.net/septemberClass?retryWrites=true&w=majority&appName=Cluster0";

const db_connect = async () => {
  try {
    // mongoose.connect(uri).then((res) => {
    //   console.log("connected to database");
    // });
    const connection = await mongoose.connect(uri);
    if (connection) {
      console.log("connected to database");
    }
  } catch (error) {
    console.log(error);
  }
};

db_connect();

const port = 8003;
//is a function that require a call back function
app.listen(port, () => {
  console.log(`app started on port ${port} `);
});
