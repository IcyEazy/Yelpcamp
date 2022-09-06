var express = require("express");
var router  = express.Router();
var Campground = require("../models/campground");
var middleware = require("../middleware");

// INDEX ROUTE -- show all campground
router.get("/", function(req, res){
    //Get all campgrounds from DB
    Campground.find({}, function(err, allCampgrounds){
        if(err){
            console.log(err);
        }
        else{
            res.render("campgrounds/index", {campgrounds: allCampgrounds});
        }
    });
});

//NEW ROUTE--- Show Form to create a new campground
router.get("/new", middleware.isLoggedIn, function(req, res){
    res.render("campgrounds/new");
});

//CREATE ROUTE-- Add new campground to DB
router.post("/", middleware.isLoggedIn, function(req, res){
    //Get all the campground data from the form page(new) & Create a new campground and save to DB
    var name = req.body.name;
    var price = req.body.price;
    var image = req.body.image;
    var desc = req.body.description;
    var author = {
        id: req.user._id,
        username: req.user.username
    }
    var newCampground = {name: name, price: price, image: image, description: desc, author: author}
    Campground.create(newCampground, function(err, newlyCreated){
        if(err){
            console.log(err);
        }
        else{
            console.log(newlyCreated);
            //redirect to the campgrounds page
            res.redirect("/campgrounds");
        }
    })
});

//SHOW --- shows more info about one campground
router.get("/:id", function(req, res){
    //Find the campground with provided ID
    Campground.findById(req.params.id).populate("comments").exec(function(err, foundCampground){
        if(err){
            console.log(err);
        }
        else{
            console.log(foundCampground);
            //Render show template with that campground
            res.render("campgrounds/show", {campground: foundCampground});
        }
    });
});

//EDIT ROUTE
router.get("/:id/edit", middleware.checkCampgroundOwnership, function(req, res){
    Campground.findById(req.params.id, function(err, foundCampground){
        res.render("campgrounds/edit", {campground: foundCampground});
    });
});

//UPDATE ROUTE
router.put("/:id", middleware.checkCampgroundOwnership, function(req, res){
    Campground.findByIdAndUpdate(req.params.id, req.body.campground, function(err, updatedCampground){
        if(err){
            res.redirect("/campgrounds");
        }
        else{
            res.redirect("/campgrounds/" + req.params.id);
        }
    });
});

//DELETE ROUTE
router.delete("/:id", middleware.checkCampgroundOwnership, function(req, res){
    Campground.findByIdAndRemove(req.params.id, function(err){
        if(err){
            res.redirect("/campgrounds")
        }
        else{
            res.redirect("/campgrounds");
        }
    });
});

module.exports = router;