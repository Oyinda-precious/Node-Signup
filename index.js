const express = require("express");
const app = express();
const ejs = require("ejs");
const mongoose = require("mongoose");

// CRUD CREATE READ(read is to collect back information) UPDATE DELETE
//middleware
app.use(express.urlencoded({ extended: true }));
app.set("view engine", "ejs");

let userarray = [];
let todoarray = [];
let errormessage = "";

const userschema = mongoose.Schema({
  //trim is used go clear space, required and unique to validate information.
  firstname: { type: String, trime: true, required: true },
  lastname: { type: String, trim: true, required: true },
  email: { type: String, unique: true, trim: true, required: true },
  password: { type: Number, trim: true, required: true },
});

const usermodel = mongoose.model("user_collection", userschema);

const todoschema = mongoose.Schema(
  {
    title: { type: String, trim: true, required: true },
    content: { type: String, trim: true, required: true },
  },
  { timestamps: true }
);
const todomodel = mongoose.model("todo_collection", todoschema);

app.get("/", (request, response) => {
  response.render("signup", { errormessage });
});

app.get("/login", (req, res) => {
  res.render("login");
});

app.get("/dashboard", (req, res) => {
  res.render("dashboard");
});

app.get("/todo", async (req, res) => {
  const alltodo = await todomodel.find();
  console.log(alltodo);

  res.render("todo", { alltodo });
});

app.post("/register", async (req, res) => {
  try {
    console.log(req.body);
    const createuser = await usermodel.create(req.body);
    res.redirect("/login");
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
//destructure is used for array and object
//find returns an array and object useful for multiple data while findOne returns only object useful for one data.
app.post("/onlinelogin", async (req, res) => {
  console.log(req.body);
  const { email, password } = req.body;
  try {
    const user = await usermodel.findOne({ email: email });
    console.log(user);
    if (user && user.password == password) {
      console.log("login successful");
      res.redirect("/todo");
    } else {
      console.log("invalid user");
      res.redirect("/login");
    }
  } catch (error) {
    console.log(error);
    res.redirect("/login");
  }
  // /this is to have access to what user is sending
  // let body = req.body;
  // const existuser = userarray.find((user) => user.email == req.body.email);
  // console.log(existuser);
  // if (!existuser) {
  //   console.log("you are not a registered user ; please sign up");
  // } else {
  //   if (existuser.password == req.body.password) {
  //     console.log("login successful");
  //     res.redirect("/dashboard");
  //   } else {
  //     console.log("invalid password");
  //   }
  // }
});
app.post("/addtodo", async (req, res) => {
  console.log(req.body);
  try {
    const todo = await todomodel.create(req.body);
    if (todo) {
      console.log("todo created successfully");
      res.redirect("/todo");
    } else {
      console.log("error occured");
    }
  } catch (error) {
    console.log(error);
  }
  // todoarray.push(req.body);
});
// const Todo = require("./todo.model");

app.post("/delete", async (req, res) => {
  console.log(req.body);
  try {
    const deleteTodo = await todomodel.findOneAndDelete(req.body);
    if (deleteTodo) {
      console.log("Todo deleted succesfully");
    } else {
      console.log("Todo not found");
    }
  } catch (error) {
    console.log(error);
  }
  res.redirect("/todo");
  //   try {
  //     const deleteTodo = await todomodel.findOneAndDelete(req.body);
  //     if (deleteTodo) {
  //       console.log("Todo successfully deleted");

  //       const { index } = req.body;
  //       if (index !== undefined && index >= 0 && index < todoarray.length) {
  //         todoarray.splice(index, 1);
  //         console.log("Todo successfully deleted");
  //       } else {
  //         console.log(" could not delete ");
  //       }
  //     }
  //   } catch (error) {
  //     console.log(error);
  //   }
  //   res.redirect("/todo");
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
