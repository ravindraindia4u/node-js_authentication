if(process.env.NODE_ENV !== 'production'){
  require('dotenv').config()
}
var express = require("express");
var app = express();
var bodyParser = require("body-parser");
var bcrypt = require("bcrypt");
var passport = require('passport');
const session = require('express-session');
const flash = require("express-flash");

var initializePassport = require('./passport-config');
initializePassport(passport,
  email=> users.find((user)=>user.email === email),
  id => users.find(user => user.id === id)
);
var users = [];
app.set("view-engine", "ejs");
app.use(bodyParser());
app.use(flash());
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(methodOverride('_method'))

app.get("/",checkAuthenticated, (req, res) => {
  res.render("index.ejs", { name: "Vanshu" });
});

app.get("/login",checkAuthenticated, (req, res) => {
  res.render("login.ejs");
});

app.post('/login',passport.authenticate('local',{
  successRedirect:'/',
  failureRedirect:'/login',
  failureFlash:true
}))

app.get("/register",checkAuthenticated, (req, res) => {
  res.render("register.ejs", { name: "Vanshu" });
});

app.post("/login", (req, res) => {
  let { email, password } = req.body;

  let foundEmail = users.find((user) => {
    return user.email === email;
  });
  console.log("Found Email is ", foundEmail);
  // Find the email in the array

  // If Found compare the passwords entered and password
  //entered while signing up

  // if not Found then show user error
  //You are not registered
});

app.post("/register", async (req, res) => {
  try {
    let hashPassword = await bcrypt.hash(req.body.password, 10);
    let { name, email } = req.body;
    //Check if user already exists
    let foundEmail = users.find((user) => {
      return user.email === email;
    });
    if (foundEmail) {
      res.redirect("/register", { error: "You are already registers" });
    }

    //insert into database
    else {
      users.push({
        name,
        email,
        password: hashPassword,
      });
      res.redirect("/login");
    }
  } catch (error) {
    res.redirect("/register");
  }
});

app.listen(3000,()=>{
  console.log(`Server is running on http://localhost:3000/`);
})