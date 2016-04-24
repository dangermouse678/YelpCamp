// --------
// SETUP
// --------
var express    = require("express");
var router     = express.Router();
var Campground = require("../models/campground.js");
var middleware = require("../middleware");
// NOTE: The above require is the equivalent of require("../middleware/index.js");
//       This is because "index.js" is a default name that Node.js will look for
//       when requiring a package.


// INDEX - Campgrounds (GET) Route
router.get("/", function(req, res) {
   
   // Get all campgrounds from the DB
   Campground.find({}, function(err, allCampgrounds) {
      if (err) {
         console.log(err);
      } else {
         res.render("campgrounds/index.ejs", { campgrounds: allCampgrounds });
      }
   });
   
});

// CREATE - Campgrounds (POST) Route
router.post("/", middleware.isLoggedIn, function(req, res) {
   
   // Get data from form and add to campgrounds array
   var name = req.body.name;
   var image = req.body.image;
   var description = req.body.description;
   var author = {
      id:       req.user._id,
      username: req.user.username
   };
   var newCampground = {
      name:        name,
      image:       image,
      description: description,
      author:      author
   };
   
   // Create new campground and save to database
   Campground.create(newCampground, function(err, newlyCreated) {
      if (err) {
         console.log(err);
      } else {
         // Redirect back to campgrounds array
         res.redirect("/campgrounds");
      }
   });
   
});

// NEW - Create new campground and add it to the list
router.get("/new", middleware.isLoggedIn, function(req, res) {
   res.render("campgrounds/new.ejs");
});

// SHOW - Show info about a specific Campground
router.get("/:id", function(req, res) {
   
   // Find the campground with the provided ID
   Campground.findById(req.params.id).populate("comments").exec(function(err, foundCampground) {
      if (err) {
         console.log(err);
      } else {
         res.render("campgrounds/show.ejs", {campground: foundCampground});
      }
   });
   
});

// EDIT - Show form for editing an existing campground
router.get("/:id/edit", middleware.checkCampgroundOwnership, function(req, res) {
   
   // Locate specified campground
   Campground.findById(req.params.id, function(err, foundCampground) {
      if (err) {
         req.flash("error", "Campground was not found in the database");
      } else {
         res.render("campgrounds/edit.ejs", {campground: foundCampground});
      }
   });
      
});

// UPDATE - Submit edited campground
router.put("/:id", middleware.checkCampgroundOwnership, function(req, res) {
   
   // Find and update the correct campground then redirect to SHOW page
   Campground.findByIdAndUpdate(req.params.id, req.body.campground, function(err, updatedCampground) {
      if (err) {
         console.log(err);
         res.redirect("/campgrounds");
      } else {
         res.redirect("/campgrounds/" + req.params.id);
      }
   });
   
});

// DESTROY - Remove a campground
router.delete("/:id", middleware.checkCampgroundOwnership, function(req, res) {
   
   // Find the campground and delete it
   Campground.findByIdAndRemove(req.params.id, function(err) {
      if (err) {
         console.log(err);
      }
      res.redirect("/campgrounds");
   });
   
});


// EXPORT ROUTER DATA
module.exports = router;