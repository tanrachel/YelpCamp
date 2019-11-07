var express= require("express"),
	router = express.Router({mergeParams:true});

var Campground = require("../models/campground");
var middleware = require("../middleware");
//INDEX-show all campgrounds---------------------------------------------------------

router.get("/",function(req,res){
	Campground.find({},function(err, allCampgrounds){
		if(err){
			console.log(err);
		}else{
			res.render("campgrounds/campgrounds", {campgrounds:allCampgrounds});
		}
	})
});

//NEW - show form to create route---------------------------------------------------------
router.get("/new",middleware.isLoggedIn,function(req, res){
	res.render("campgrounds/new")
});

// CREATE -- add new campgrounds to DB---------------------------------------------------------
router.post("/",function(req, res){
	var newCampground = req.body.campground;
// 	create new campground and save to database 
	Campground.create(newCampground, function(err,newlycreated){
		if(err){
			console.log(err);
		}else{
			newlycreated.author.id = req.user._id;
			newlycreated.author.username = req.user.username;
			newlycreated.save();
			res.redirect("/campgrounds");
		};
	})
});


// SHOW -------------------------------------------------------------------------------------
router.get("/:id", function(req, res){
	Campground.findById(req.params.id).populate("comments").exec( function(err,foundCampground){
		if(err || !foundCampground){
			console.log(err);
			req.flash("error", "Campground not found");
			res.redirect("/campgrounds")
		}else{ 
			res.render("campgrounds/show",{campground:foundCampground});
		}
	});

})
// EDIT -------------------------------------------------------------------------------------
router.get("/:id/edit",middleware.checkCampgroundOwnership, function(req,res){
	Campground.findById(req.params.id, function(err,foundCampground){
		if(err){
			console.log(err)
		}else{
			res.render("campgrounds/edit", {campground: foundCampground})
		}
	});
})
// UPDATE -------------------------------------------------------------------------------------
router.put("/:id",middleware.checkCampgroundOwnership,function(req,res){
		Campground.findByIdAndUpdate(req.params.id,req.body.campground, function(err,updatedCampground){
		if(err){
			console.log(err);
			res.redirect("/campgrounds");
		}else{ 
			res.redirect("/campgrounds/"+ req.params.id);
		}
	});
})
// DESTROY -------------------------------------------------------------------------------------
router.delete("/:id",middleware.checkCampgroundOwnership,function(req,res){
	Campground.findByIdAndRemove(req.params.id, function(err){
		if(err){
			res.redirect("/campgrounds")
		}else{
			res.redirect("/campgrounds")
		}
	})
})
// MIDDLEWARE-------------------------------------------------------------------------
// function isLoggedIn(req,res,next){
//     if(req.isAuthenticated()){
//         return next()
//     }
//     res.redirect("/login")
// }

// function checkCampgroundOwnership(req,res,next){
// 	if(req.isAuthenticated()){
// 		Campground.findById(req.params.id,function(err,foundCampground){
// 			if(err){
// 				res.redirect("back")
// 			}else{ 
// 				if(foundCampground.author.id.equals(req.user._id)){
// 					next();
// 				}else{
// 					res.redirect("back")
// 				}
// 			}	
// 		})
// 	}else{
// 		res.redirect("back")
// 	}
// }

module.exports = router;