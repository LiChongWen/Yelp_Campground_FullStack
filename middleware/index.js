// All the middle ware here
var Campground = require("../models/campground");
var Comment = require("../models/comment");
var middlewareObj ={};

middlewareObj.checkCampOwnership = async function(req, res, next){
    if(req.isAuthenticated()){
        let foundCampground = await Campground.findById(req.params.id);
        if(foundCampground && foundCampground.author.id.equals(req.user.id) || (foundCampground && req.user.isAdmin)){
            next();
        }else{
            req.flash("error", "You don't have permission!!!");
            res.redirect("back");
        }
        // Campground.findById(req.params.id, (err, foundCampground)=>{
        //     if(err){
        //         console.log(err);
        //         res.redirect("back")
        //     }else{
        //         //does user own the campground?
        //         if(foundCampground.author.id.equals(req.user.id) ){
        //             next();
        //         }else{
        //             res.redirect("back");
        //         }    
        //     }
        // });
    }else{
        req.flash("error", "You Need Log In First!!!");
        res.redirect("back");
    }
}

middlewareObj.checkCommentOwnership = async function(req, res, next){
    if(req.isAuthenticated()){
        let foundComment = await Comment.findById(req.params.comment_id);
        if((foundComment && foundComment.author.id.equals(req.user.id)) || (foundComment && req.user.isAdmin)){
            next();
        }else{
            req.flash("error", "You don't have permission!!!");
            res.redirect("back");
        }
    }else{
        req.flash("error", "You Need Log In First!!!");
        res.redirect("back");
    }
}

middlewareObj.isLoggedIn = function(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    req.flash("error", "You Need Log In First!!!");
    res.redirect("/login");
}

module.exports = middlewareObj;