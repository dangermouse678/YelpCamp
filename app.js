// USER 1 ADDING NEW COMMENT
// USER 1 ADDING MORE NEW CODE
// USER 1 FINAL NEW CODE

// ----------------------
// INITIALIZATION / SETUP
//-----------------------
// Requires
var express        = require("express"),
    app            = express(),
    bodyParser     = require("body-parser"),
    mongoose       = require("mongoose"),
    flash          = require("connect-flash"),
    passport       = require("passport"),
    LocalStrategy  = require("passport-local"),
    methodOverride = require("method-override"),
    Campground     = require("./models/campground.js"),
    Comment        = require("./models/comment.js"),
    User           = require("./models/user.js"),
    seedDB         = require("./seeds.js");

// Requiring Routes
var commentRoutes    = require("./routes/comments.js"),
    campgroundRoutes = require("./routes/campgrounds.js"),
    indexRoutes      = require("./routes/index.js");

// MISC "USE" CLAUSES
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));
app.use(flash());
app.set("view engine", "ejs");
mongoose.connect("mongodb://localhost/yelp_camp_11");

// Seed the Database for testing
// seedDB();

// PASSPORT CONFIGURATION
app.use(require("express-session")({
   secret: "Madeline Samantha Alexander",
   resave: false,
   saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// MIDDLEWARE PRIOR TO EXECUTING ROUTES
app.use(function(req, res, next) {
   res.locals.currentUser = req.user;
   res.locals.error       = req.flash("error");
   res.locals.success     = req.flash("success");
   next();
});

// -------------------
// ROUTES
// -------------------
app.use(indexRoutes);
app.use("/campgrounds", campgroundRoutes);
app.use("/campgrounds/:id/comments", commentRoutes);


// -------------------
// RUN SERVER / LISTEN
// -------------------
app.listen(process.env.PORT, process.env.IP, function() {
   console.log("YelpCamp Server started...");
});
