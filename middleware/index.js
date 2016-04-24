var Campground = require("../models/campground.js");
var Comment    = require("../models/comment.js");

// All Middleware Goes Here
var middlewareObj = {};

// ----------------------------------------------------------
// MIDDLEWARE TO DETERMINE IF USER OWNERSHIP OF A CAMPGROUND
// ----------------------------------------------------------
middlewareObj.checkCampgroundOwnership = function(req, res, next) {
   
   // Is User logged in
   if (req.isAuthenticated()) {
      
      // Locate specified campground
      Campground.findById(req.params.id, function(err, foundCampground) {
         if (err) {
            console.log(err);
            req.flash("error", "Campground not found in database");
            res.redirect("back");
         } else {
            
            // Does this User own the Campground
            if (foundCampground.author.id.equals(req.user._id)) {
               next();
            } else {
               req.flash("error", "You don't have permission to do that!");
               res.redirect("back");
            }
            
         }
      });
      
   } else {
      req.flash("error", "You need to be logged in to do that");
      res.redirect("back");
   }
   
};

// ----------------------------------------------------------
// MIDDLEWARE TO DETERMINE IF USER OWNERSHIP OF A CAMPGROUND
// ----------------------------------------------------------
middlewareObj.checkCommentOwnership = function (req, res, next) {
   
   // Is User logged in
   if (req.isAuthenticated()) {
      
      // Locate specified Comment
      Comment.findById(req.params.comment_id, function(err, foundComment) {
         if (err) {
            console.log(err);
            req.flash("error", "Could not find Comment in the database");
            res.redirect("back");
         } else {
            
            // Does this User own the Comment
            if (foundComment.author.id.equals(req.user._id)) {
               next();
            } else {
               req.flash("error", "You don't have permission to do that");
               res.redirect("back");
            }
            
         }
      });
      
   } else {
      req.flash("error", "You need to be logged in to do that");
      res.redirect("back");
   }
   
};

// ---------------------------------------------
// MIDDLEWARE TO DETERMINE IF USER IS LOGGED IN
// ---------------------------------------------
middlewareObj.isLoggedIn = function (req, res, next) {
   
   if (req.isAuthenticated()) {
      return next();
   }
   
   req.flash("error", "You need to be logged in to do that");
   res.redirect("/login");
   
};


module.exports = middlewareObj;