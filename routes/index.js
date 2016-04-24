// --------
// SETUP
// --------
var express    = require("express");
var router     = express.Router();
var passport   = require("passport");
var User       = require("../models/user.js");

// ---------------------------
// ROOT ROUTE / LANDING PAGE
// ---------------------------

router.get("/", function(req, res) {
   res.render("landing");
});

// -----------------------
// REGISTRATION ROUTES
// -----------------------

// Show Register Form
router.get("/register", function(req, res) {
   res.render("register.ejs");
});

// Handle Signup Logic
router.post("/register", function(req, res) {
   
   var newUser = new User({username: req.body.username});
   User.register(newUser, req.body.password, function(err, user) {
      if (err) {
         req.flash("error", err.message);
         return res.redirect("back");
      }
      
      passport.authenticate("local")(req, res, function() {
         req.flash("success", "Welcome to YelpCamp " + user.username + "!");
         res.redirect("/campgrounds");
      });
      
   });
   
});


// --------------------
// LOGIN/LOGOUT ROUTES
// --------------------

// Show login form
router.get("/login", function(req, res) {
   res.render("login.ejs");
});

// Handle login logic
router.post("/login", passport.authenticate("local",
   {
      successRedirect: "/campgrounds",
      failureRedirect: "/login"
   }), function(req, res) {
      // No callback functionality needed -- login authentication is handled by
      // middleware call to passport.authenticate()
});

// Handle logout logic
router.get("/logout", function (req, res) {
   req.logout();
   req.flash("success", "Logged you out!");
   res.redirect("/campgrounds");
});


// EXPORT ROUTER DATA
module.exports = router;