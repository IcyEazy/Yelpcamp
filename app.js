var express                 = require("express"),
    bodyParser              = require("body-parser"),
    methodOverride          = require("method-override"),
    mongoose                = require("mongoose"),
    passport                = require("passport"),
    LocalStrategy           = require("passport-local"),
    passportLocalMongoose   = require("passport-local-mongoose"),
    expressSession          = require("express-session"),
    flash                   = require("connect-flash"),
    User                    = require("./models/user"),
    Campground              = require("./models/campground"),
    Comment                 = require("./models/comment"),
    seedDB                  = require("./seeds"),
    app                     = express();

const port = Process.env.PORT || 3000 ;
//Requiring Routes
var commentRoutes           = require("./routes/comments"),
    campgroundRoutes        = require("./routes/campgrounds"),
    indexRoutes             = require("./routes/index");
    
//mongoose.connect("mongodb://localhost:27017/yelp_camp_deployed");
mongoose.connect("mongodb+srv://IcEazy:Heddyeazy4real@yelpcamp.vspfvoz.mongodb.net/test");
//102.89.42.245/32

//App Config
app.use(express.static(__dirname + "/public"));
app.use(bodyParser.urlencoded({extended: true}));
app.use(methodOverride("_method"));
app.set("view engine", "ejs");
app.use(flash());

//seedDB(); //seed database

//Passport Configuration
app.use(expressSession({
    secret: "Israel is gonna be great!!!",
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req, res, next){
    res.locals.currentUser = req.user;
    res.locals.error = req.flash("error");
    res.locals.success = req.flash("success");
    next();
});

//Using the Routes Required
app.use(indexRoutes);
app.use("/campgrounds/:id/comments", commentRoutes);
app.use("/campgrounds", campgroundRoutes);

//Creating a new campground
//Campground.create({
//    name: "Shasta campsite",
//    image: "https://pixabay.com/get/gcb7da04323996b7345ba89a1e39d6273d7cd4721bf54f93dcc1e1108941a194b15eeaf4c5310e73cf08518648bf9e26d_340.jpg",
//    description: "This is a nice Shasta campsite with a lot comfy feeling."
//}, function(err, campground){
//    if(err){
//        console.log(err);
//    }
//    else{
//        console.log("Newly Created Campground: ");
//        console.log(campground);
//    }
//});

// app.listen(3000, function(){
//     console.log("The YelpCamp ServerV11Deployed Has Started!!!");
// });

app.listen(port, () => console.log(`Example app listening on port ${port}!`));