var express		 = require("express"),
	app 		 = express(),
	bodyParser 	 = require("body-parser"),
	mongoose 	 = require("mongoose"),
	Campground 	 = require("./models/campground"), 
	seedDB 		 = require("./seeds"), 
	Comment      = require("./models/comment"),
	passport 			  = require("passport"),
	LocalStrategy		  = require("passport-local"),
	passportLocalMongoose = require("passport-local-mongoose"),
	User				  = require("./models/user"), 
	methodOverride 		  = require("method-override"),
	flash 				  = require("connect-flash");

var commentRoutes = require("./routes/comments"),
	campgroundRoutes = require("./routes/campgrounds"),
	indexRoutes = require("./routes/index"); 

// mongoose.connect("mongodb+srv://admin:EAwx9u9r3MUvmnhf@cluster0-lxszr.mongodb.net/test?retryWrites=true&w=majority",{useNewUrlParser: true, useUnifiedTopology: true,useCreateIndex:true}).then(() =>{
// 	console.log("Connected to DB!")
// }).catch(err => {
// 	console.log("ERROR:",err.message)
// });

// mongoose.connect("mongodb://localhost/yelp_camp",{useNewUrlParser: true, useUnifiedTopology: true,useCreateIndex:true}).then(() =>{
// 	console.log("Connected to DB!")
// }).catch(err => {
// 	console.log("ERROR:",err.message)
// });

mongoose.connect(process.env.DATABASEURL,{useNewUrlParser: true, useUnifiedTopology: true,useCreateIndex:true}).then(() =>{
	console.log("Connected to DB!")
}).catch(err => {
	console.log("ERROR:",err.message)
});


app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(__dirname+"/public"));
app.set("view engine", "ejs");
app.use(methodOverride("_method"));
app.use(flash()); 

app.use(require("express-session")({
	secret: "Corgis are the best", 
	resave:false,
	saveUninitialized:false
}));
app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


app.use(function(req,res,next){
	res.locals.currentUser = req.user;
	res.locals.error = req.flash("error");
	res.locals.success = req.flash("success");
	next();
})
// seedDB();
app.use(indexRoutes);
app.use("/campgrounds/:id/comments",commentRoutes);
app.use("/campgrounds",campgroundRoutes);

app.listen(process.env.PORT || 3000, process.env.IP, function(){
	console.log("YelpCamp Server has started!")
}); 























