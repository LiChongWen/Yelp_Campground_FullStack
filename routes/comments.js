var express = require("express");
//                          access the params from the parent router.
//                          campground
var router = express.Router({mergeParams: true});
var Campground = require("../models/campground");
var Comment = require("../models/comment");
var middleware = require("../middleware");


//  COMMENTS NEW
router.get("/new", middleware.isLoggedIn, (req,res) =>{
    Campground.findById(req.params.id, (err, foundCampground) =>{
        if(err){
            console.log(err);
        }else{
            res.render("comments/new", {campground: foundCampground});
        }
    });
    
});

//  COMMENTS CREATE
router.post("/", middleware.isLoggedIn, (req,res)=>{
    Campground.findById(req.params.id).populate("comments").exec( (err, foundCampground) =>{
        if(err){
            console.log(err);
        }else{
            Comment.create(req.body.comment, (err, newComment)=>{
                if(err){
                    req.flash("error", "Something went wrong !!!");
                    console.log(err);
                }else{
                    console.log(newComment);
                    //Add Username and id to comment before push it into campgrounds
                    newComment.author.id = req.user._id;
                    newComment.author.username = req.user.username;
                    newComment.save();
                    
                    //Save it into campground
                    foundCampground.comments.push(newComment);
                    
                    foundCampground.ratings = calculateAverage(foundCampground.comments);
                    console.log(foundCampground.ratings);
                    foundCampground.save();
                    console.log("****************");
                    // console.log(newComment);
                    req.flash("success", "Successfully added comment!!!");
                    res.redirect("/campgrounds/" + req.params.id);
                }
            });
            
        }
    });
});

//  COMMENT EDIT FORM
router.get("/:comment_id/edit", middleware.checkCommentOwnership, (req, res)=>{
    Comment.findById(req.params.comment_id, (err, foundComment)=>{
        if(!foundComment || err){
            console.log(err);
            res.redirect("back");
        }else{
            res.render("comments/edit", {comment:foundComment, campground_id: req.params.id});
        }
    });
});

//  COMMENT UPDATED
router.put("/:comment_id", middleware.checkCommentOwnership, (req,res)=>{
    Comment.findByIdAndUpdate(req.params.comment_id, req.body.updateComment, (err, updateComm)=>{
        if(err){
            console.log(err);
            res.redirect("back");
        }else{
            //console.log(req.body.updateComment);
            Campground.findById(req.params.id).populate("comments").exec((err, foundCampground) =>{
                if(err){
                    req.flash("error", err.message);
                    return res.redirect("back");
                }
                foundCampground.ratings = calculateAverage(foundCampground.comments);

                foundCampground.save();
                req.flash("success", "Your comment was successfully edited.");
                res.redirect("/campgrounds/" + req.params.id);
            });
            
        }
    })
})


//  COMMENT DESTORY
router.delete("/:comment_id", middleware.checkCommentOwnership, (req,res)=>{
    Comment.findByIdAndRemove(req.params.comment_id, (err)=>{
        if(err){
            console.log(err);
            res.redirect("back");
        }else{
            //Remove deleted comment from campground database
            Campground.findByIdAndUpdate(req.params.id, 
                {
                    $pull: {
                        comments:req.params.comment_id
                    }
                }, (err, foundCampground)=>{
                    if(err){
                        console.log(err);
                        res.redirect("back");
                    }else{
                        req.flash("succss", "Comment deleted!!!");
                        res.redirect("/campgrounds/" + req.params.id);
                    }
            });
        }
    });
});

function calculateAverage(comments) {
    if (comments.length === 0) {
        return 0;
    }
    var sum = 0;
    comments.forEach(function (comment) {
        sum += comment.rating;
    });
    return sum / comments.length;
}

// function isLoggedIn(req, res, next){
//     if(req.isAuthenticated()){
//         return next();
//     }
//     res.redirect("/login");
// }

// async function checkCommentOwnership

module.exports = router;