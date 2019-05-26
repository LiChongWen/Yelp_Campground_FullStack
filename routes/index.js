var express = require("express");
var router = express.Router();
var passport = require("passport");
var User = require("../models/user");
var nodemailer = require("nodemailer");
var async = require("async");
var crypto = require("crypto");

router.get("/", (req, res) =>{
    res.render("landing");
});

//  Show register form
router.get("/register", (req, res)=>{
    res.render("register", {page: 'register'});
});

//  Handle register  
router.post("/register", (req, res)=>{
    var newUser = new User({username: req.body.username, email: req.body.email});
    if(req.body.adminCode === 'admincode'){
        newUser.isAdmin = true;
    }
    
    User.register(newUser, req.body.password, (err, user)=>{
        if(err){
            req.flash("error", err.message);
            //console.log(err);
            return res.redirect("/register");
        }
        // passport.authenticate("local")(req, res, ()=>{
        //     res.redirect("/campgrounds");
        // });
        req.login(user, function(err) {
            if (err) {
              console.log(err);
              return next(err);
            }
            req.flash("success", "Welecome to YelpCamp " + user.username);
            return res.redirect('/campgrounds');
        });

    });
});

//  Show Login form
router.get("/login", (req, res)=>{
    res.render("login", {page: 'login'});
});

//  Handle Login
router.post("/login", passport.authenticate("local",
    {
    successRedirect: "/campgrounds",
    failureRedirect: "/login"
    }) ,(req, res)=>{
});

//Logout
router.get("/logout", (req,res)=>{
    req.logout();
    req.flash("success", "Logged you out");
    res.redirect("/campgrounds");
});

//  FORGET PASSWORD
router.get("/forget", (req,res)=>{
    res.render("forget");
});

router.post("/forget", (req,res,next)=>{
    async.waterfall([
        function(done){
            crypto.randomBytes(20, (err, buf)=>{
                var token = buf.toString('hex');
                done(err, token);
            });
        },
        function(token, done) {
            User.findOne({email: req.body.email}, (err, user)=>{
                if(!user){
                    req.flash('error', "No account with that email address exists!");
                    res.redirect('/forget');
                }

                user.resetPasswordToken = token;
                user.resetPasswordExpires = Date.now() + 1800000;

                user.save((err)=>{
                    done(err, token, user);
                });
            });
        },
        function(token, user, done){
            var smtpTransport = nodemailer.createTransport({
                service: 'Gmail',
                auth: {
                    user: 'lichongwen1994@gmail.com',
                    pass: process.env.GMAILPW
                }
            });
            var mailOptions = {
                to: user.email,
                from: 'lichongwen1994@gmail.com',
                subject: 'Yelp Camp Password Reset',
                text: 'You are receiving this because you request a reset of password,'+
                    'click on the fllowing link: '+
                    req.headers.host+'/reset/'+token+'\n\n' +
                    'Ignore if you did not request this'
            };
            smtpTransport.sendMail(mailOptions, (err)=>{
                console.log('mail sent');
                req.flash('success', 'An e-mail has been sent to ' + user.email);
                done(err, 'done');
            });
        }
    ], (err)=>{
        if(err){
            return next(err);
        }
        res.redirect('/forget');
    })
});

router.get('/reset/:token', (req, res)=>{
    User.findOne({resetPasswordToken: req.params.token, resetPasswordExpires: { $gt: Date.now() }}, (err, user)=>{
        if(!user){
            req.flash('error', 'The link is invalid or expired');
            return res.redirect('/forget');
        }
        res.render('reset', {token: req.params.token});
    });
});

router.post('/reset/:token', (req,res)=>{   
    resetPassword(req,res);
});

async function resetPassword(req, res){
    let user = await User.findOne({ resetPasswordToken: req.params.token, resetPasswordExpires: { $gt: Date.now() } });
    if(!user){
        req.flash('error', 'The link is invalid or expired');
        return res.redirect('/forget');
    }else{
        if(req.body.password === req.body.confirm){
            await user.setPassword(req.body.password);
            user.resetPasswordToken = undefined;
            user.resetPasswordExpires = undefined;
            await user.save();
            req.logIn(user, (err)=>{
                if(err){
                    req.flash('error', 'Error!');
                    return res.redirect('back')
                }
                req.flash("success", 'Success! Your password has been changed');
                res.redirect('/campgrounds');
            });
        }else{
            req.flash('error', 'Passwords do not match!');
            return res.redirect('back');
        }
        var smtpTransport = await nodemailer.createTransport({
            service: 'Gmail',
            auth: {
            user: 'lichongwen1994@gmail.com',
            pass: process.env.GMAILPW
            }
        });
        var mailOptions = {
            to: user.email,
            from: 'lichongwen1994@gmail.com',
            subject: 'Yelp Camp Password has been changed',
            text: 'This is a confirmation that the password for your account ' + user.email + 'has been changed'
        };
        smtpTransport.sendMail(mailOptions, (err)=>{
            if(err){
                console.log('mail did not sent');
                return res.redirect('back')
            }
            
        });
    }
}
// function isLoggedIn(req, res, next){
//     if(req.isAuthenticated()){
//         return next();
//     }
//     res.redirect("/login");
// }

module.exports = router;