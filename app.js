require("dotenv").config();  
const express = require("express");
const app= express();
const mongoose=require("mongoose");
const path=require("path");
const methodOverride=require("method-override");
const ejsMate=require("ejs-mate");
const ExpressError=require("./utils/ExpressError");


const session = require('express-session');
const flash = require('connect-flash');
const passport=require("passport");
const LocalStrategy =require("passport-local");
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const User=require("./models/user");

const listingRouter= require("./routes/listing");
const reviewRouter= require("./routes/review");
const userRouter=require("./routes/user")

const testRoutes = require("./routes/test");





main().then(()=>{
    console.log("connected to DB");
}).catch((err)=>{
    console.log(err);
})

async function main(){
    await mongoose.connect('mongodb://127.0.0.1:27017/wanderlust-test');
}

app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));
app.use(express.urlencoded({extended:true}));
app.use(methodOverride("_method"));
app.engine("ejs",ejsMate);
app.use(express.static(path.join(__dirname,"/public")));

app.get("/",(req,res)=>{
    res.send("Hi, I'm root");
})

const sessionOptions={
     secret: "mysupersecretstring", 
     resave: false, 
     saveUninitialized: true, 
     cookie:{
        expires:Date.now()+7*24*60*60*1000,
        maxAge:7*24*60*60*1000,
        httpOnly:true
     }
      };

app.use(session(sessionOptions));
app.use(flash());

// Passport config
app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(User.authenticate()));  // Comes from passport-local-mongoose

passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,        // or paste directly
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: "/auth/google/callback"
},
async (accessToken, refreshToken, profile, done) => {
    try {
        let existingUser = await User.findOne({ googleId: profile.id });
        if (existingUser) return done(null, existingUser);

        let newUser = new User({
            googleId: profile.id,
            username: profile.displayName,
            profilePic: profile.photos[0].value
        });

        await newUser.save();
        done(null, newUser);
    } catch (err) {
        done(err, null);
    }
}));


passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req,res,next)=>{
    res.locals.success=req.flash("success");
    res.locals.error=req.flash("error");
    res.locals.currUser=req.user;
    res.locals.googleMapsKey = process.env.GOOGLE_GEOCODE_KEY;
    next();
})

app.get("/demouser",async (req,res)=>{
    let fakeUser=new User({
        email:"123@gmail.com",
        username:"delta-student"
    });
    let registeredUser=await User.register(fakeUser,"helloworld");
    res.send(registeredUser);

})



//listings
app.use("/listings",listingRouter)
//Reviews
app.use("/listings/:id/reviews",reviewRouter)
// /users
app.use("/",userRouter);


app.use("/", testRoutes);




app.all('/*splat', (req, res, next) => {
    next(new ExpressError(404, "Page Not Found"));
});
// Error handling middlewares
app.use((err,req,res,next)=>{
    let {statusCode=500,message="something went wrong!"}=err;
    res.status(statusCode).render("error.ejs",{message});
})


app.listen(8080,()=>{
    console.log("app is listening to port 8080");
})