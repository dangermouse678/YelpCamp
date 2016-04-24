// --------
// SETUP
// --------
var express    = require("express");
var router     = express.Router({mergeParams: true});
var Campground = require("../models/campground.js");
var Comment    = require("../models/comment.js");
var middleware = require("../middleware");
// NOTE: The above require is the equivalent of require("../middleware/index.js");
//       This is because "index.js" is a default name that Node.js will look for
//       when requiring a package.


// NEW - Show form to create a new comment
router.get("/new", middleware.isLoggedIn, function(req, res) {
   
   // Find the Campground by ID
   Campground.findById(req.params.id, function(err, campground) {
      if (err) {
         console.log(err);
      } else {
         res.render("comments/new.ejs", {campground: campground});
      }
   });
   
});

// CREATE - Add a new comment to the database
router.post("/", middleware.isLoggedIn, function(req, res) {
   
   // Look up the campground using ID
   Campground.findById(req.params.id, function(err, campground) {
      if (err) {
         console.log(err);
         res.redirect("/campgrounds");
      } else {
         
         // Create new comment
         Comment.create(req.body.comment, function(err, comment) {
            if (err) {
               console.log(err);
               req.flash("error", "Something went wrong...");
            } else {
               
               // Add Username and ID to Comment
               comment.author.id       = req.user._id;
               comment.author.username = req.user.username;
               comment.save();
               
               // Connect new comment to campground
               campground.comments.push(comment);
               campground.save(function (err) {
                  if (err) {
                     console.log(err);
                  }
               });
               req.flash("success", "Successfully added comment");
               res.redirect("/campgrounds/" + campground._id);
            }
         });
      }
   });
   
});

// EDIT - Show edit form for a comment
router.get("/:comment_id/edit", middleware.checkCommentOwnership, function(req, res) {
   
   // Retrieve the comment from the database
   Comment.findById(req.params.comment_id, function(err, foundComment) {
      if (err) {
         console.log(err);
         res.redirect("back");
      } else {
         res.render("comments/edit.ejs", {
            campground_id: req.params.id,
            comment:       foundComment
         });
      }
   });
   
});

// UPDATE - Update the comment in the database and redirect
router.put("/:comment_id", middleware.checkCommentOwnership, function(req, res) {
   
   // Find and update comment in the database
   Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function(err, updatedComment) {
      if (err) {
         console.log(err);
         res.redirect("back");
      } else {
         res.redirect("/campgrounds/" + req.params.id);
      }
   });
   
});

// DESTROY - Delete a comment
router.delete("/:comment_id", middleware.checkCommentOwnership ,function(req, res) {
   
   // Locate the comment and delete it
   Comment.findByIdAndRemove(req.params.comment_id, function(err) {
      if (err) {
         console.log(err);
         res.redirect("back");
      } else {
         req.flash("success", "Comment deleted");
         res.redirect("/campgrounds/" + req.params.id);
      }
   });
   
});


// EXPORT ROUTER DATA
module.exports = router;