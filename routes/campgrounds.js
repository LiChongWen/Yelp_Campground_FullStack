var express = require("express");
var router = express.Router();
var Campground = require("../models/campground");
var Comment = require("../models/comment");
var middleware = require("../middleware");

var NodeGeocoder = require('node-geocoder');
 
var options = {
  provider: 'google',
  httpAdapter: 'https',
  apiKey: process.env.GEOCODER_API_KEY,
  formatter: null
};
 
var geocoder = NodeGeocoder(options);

//INDEX     GET     Display a list of all from DB
//  SHOW ALL CAMPS
router.get("/", (req, res)=>{
    // eval(require('locus'));
    if(req.query.search) { 
        const regex = new RegExp(escapeRegex(req.query.search), 'gi');
        Campground.find({ name: regex }, (err, matchingCampgrounds)=>{
            if(err){
                console.log(err);
            }else{
                if(matchingCampgrounds.length === 0){
                    req.flash('error', 'Sorry! No Campground match your request.');
                    return res.redirect('/campgrounds');
                }
                res.render("campgrounds/index",{campgrounds: matchingCampgrounds, page: 'campgrounds'});
            }
        });
    }else{
        //  GET all file from db
        Campground.find({}, (err, allcampgrounds)=>{
            if(err){
                console.log(err);
            }else{
                res.render("campgrounds/index",{campgrounds: allcampgrounds, page: 'campgrounds'});
            }
        });
    }
    
})

//CREAT     POST    Add new to DB
//  CREAT NEW CAMP
router.post("/", middleware.isLoggedIn, (req, res) =>{
    var author = {
        id: req.user._id,
        username: req.user.username
    }
    console.log(req.body.newCampground);
    req.body.newCampground.author = author;
    geocoder.geocode(req.body.newCampground.location, function (err, data) {
        if (err || !data.length) {
          console.log(err);
          req.flash('error', 'Invalid address');
          return res.redirect('back');
        }
        req.body.newCampground.lat = data[0].latitude;
        req.body.newCampground.lng = data[0].longitude;
        req.body.newCampground.location = data[0].formattedAddress;
        //var newCampground = {name: name, image: image, description: desc, author:author, location: location, lat: lat, lng: lng};
        // Create a new campground and save to DB
        Campground.create(req.body.newCampground, function(err, newlyCreated){
            if(err){
                console.log(err);
            } else {
                //redirect back to campgrounds page
                console.log(newlyCreated);
                res.redirect("/campgrounds");
            }
        });
      });
    
});

//NEW   GET     Displays form to make a new 
//  CREATE NEW CAMP's FORM
router.get("/new", middleware.isLoggedIn, (req, res) =>{
    res.render("campgrounds/new.ejs");
});

//SHOW  /campgrounds/id:    GET Shows info about one campground 
//  Shows info about one campground 
router.get("/:id", (req, res) =>{
    var id = req.params.id;
    Campground.findById(id).populate("comments").exec((err, foundCampground) =>{
        if(!foundCampground || err){
            req.flash("error", "You don't have the permission!");
            res.redirect("/campgrounds");
        }else{
            res.render("campgrounds/show",{campground: foundCampground});
        }
    });
    
});

//  FORM FOR EDIT CAMPGROUND ROUTE
router.get("/:id/edit", middleware.checkCampOwnership ,(req, res)=>{
        Campground.findById(req.params.id, (err, foundCampground)=>{
            if(!foundCampground || err){
                console.log(err);
            }else{               
                res.render("campgrounds/edit", {campground: foundCampground});  
            }
        });    
});


//  UPDATE CAMPGROUND
router.put("/:id", middleware.checkCampOwnership, (req,res)=>{
    geocoder.geocode(req.body.updatedCamp.location, function (err, data) {
        if (err || !data.length) {
          req.flash('error', 'Invalid address');
          return res.redirect('back');
        }
        req.body.updatedCamp.lat = data[0].latitude;
        req.body.updatedCamp.lng = data[0].longitude;
        req.body.updatedCamp.location = data[0].formattedAddress;
    
        Campground.findByIdAndUpdate(req.params.id, req.body.updatedCamp, function(err, campground){
            if(err){
                req.flash("error", err.message);
                res.redirect("back");
            } else {
                req.flash("success","Successfully Updated!");
                res.redirect("/campgrounds/" + campground._id);
            }
        });
      });
});

//  DESTORY CAMPGROUND
router.delete("/:id", middleware.checkCampOwnership, (req,res)=>{
    Campground.findByIdAndRemove(req.params.id, (err, removedCamp)=>{
        if(err){
            res.redirect("/campgrounds/" + req.params.id);
        }else{
            Comment.deleteMany({_id: { $in: removedCamp.comments}},(err)=>{
                if(err){
                    console.log(err);
                }
                res.redirect("/campgrounds");
            });
        }
    });
});

function escapeRegex(text) {
    return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
}
// function isLoggedIn(req, res, next){
//     if(req.isAuthenticated()){
//         return next();
//     }
//     res.redirect("/login");
// }
    //Is the user logged in?
        //does the user published this camp
        //otherwise, redirect
    //if not, redirect
    
// async function checkCampOwnership(req, res, next){

// }

module.exports = router;
