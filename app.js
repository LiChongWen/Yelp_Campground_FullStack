require('dotenv').config();
var express = require("express");
var app = express();
var bodyParser = require("body-parser");
var mongoose = require("mongoose");
var flash = require("connect-flash");
var passport = require("passport");
var LocalStrategy = require("passport-local").Strategy;
var methodOverride = require("method-override");
var Campground = require("./models/campground");
var Comment = require("./models/comment");
User = require("./models/user");
var seedDB = require("./seeds");

//==============
//  REQUIRING ROUTES
//==============
var commentRoutes = require("./routes/comments"),
    campgroundRoutes = require("./routes/campgrounds"),
    autoRoutes = require("./routes/index");

mongoose.set('useCreateIndex', true);
mongoose.set("useNewUrlParser", true);
mongoose.set('useFindAndModify', false);
mongoose.connect("mongodb://localhost/yelp_camp");
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine","ejs");
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));
app.use(flash());

//seedDB();
app.locals.moment = require('moment');
//==============
//  PASSPORT CONFIGUARTION
//==============
app.use(require("express-session")({
    secret: "This is for the encode",
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
//passport.use(new LocalStrategy(User.authenticate()));
//  将用username登陆改为了用email登陆
passport.use(User.createStrategy());

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req, res, next){
    res.locals.currentUser = req.user;
    res.locals.error = req.flash("error");
    res.locals.success = req.flash("success");
    next();
});



//==================
//  AUTH ROUTES
//==================
app.use("/", autoRoutes);
//==============
// CAMP ROUTES
//==============
app.use("/campgrounds", campgroundRoutes);
//=======================
//COMMENTS ROUTES
//=======================

app.use("/campgrounds/:id/comments", commentRoutes);

app.listen(3000, () =>{
    console.log("YelpCamp Server Started!!");
})