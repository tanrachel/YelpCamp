var express= require("express"),
	router = express.Router();

var passport = require("passport");
var User = require("../models/user"); 


router.get("/", function(req, res){
	res.render("landing")
});


// ==================================================================================
// AUTHENTICATION
// ==================================================================================
// SIGN UP --------------------------------------------------------------------------
router.get("/register",function(req,res){
	res.render("auth/register")
})

router.post("/register",function(req,res){
	var newUser = new User({username:req.body.username});
	User.register(newUser,req.body.password,function(err,user){
		if(err){
			console.log(err);
			req.flash("error",err.message);
			res.redirect("back");
		}else{
			passport.authenticate("local")(req,res,function(){
				req.flash("success","Welcome to Yelpcamp, " + user.username);
				res.redirect("/campgrounds");
			})
		}
	})
})
// LOGIN ----------------------------------------------------------------------------
router.get("/login",function(req,res){
	res.render("auth/login")
})

router.post("/login",passport.authenticate("local",{successRedirect:"/campgrounds",failureRedirect:"/login",successFlash: "Logged In", failureFlash: "The username and password doesn't match our records."}),function(req,res){
	res.redirect("/campgrounds")
})
// LOGOUT----------------------------------------------------------------------------
router.get("/logout",function(req,res){
	req.logout();
	req.flash("success","Logged you out");
	res.redirect("/");
})


module.exports = router;