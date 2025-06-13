const express = require("express");
const app= express();
const mongoose=require("mongoose");
const Listing=require("./models/listing")
const Review=require("./models/review");
const path=require("path");
const methodOverride=require("method-override");
const ejsMate=require("ejs-mate");
const wrapAsync =require("./utils/wrapAsync");
const ExpressError=require("./utils/ExpressError");
const {listingSchema,reviewSchema}=require("./schema")
const listings= require("./routes/listing");
const reviews= require("./routes/review");


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




app.use("/listings",listings)
//Reviews
app.use("/listings/:id/reviews",reviews)




app.all('/*splat', (req, res, next) => {
    next(new ExpressError(404, "Page Not Found"));
});
//Error handling middlewares
app.use((err,req,res,next)=>{
    let {statusCode=500,message="something went wrong!"}=err;
    res.status(statusCode).render("error.ejs",{message});
})


app.listen(8080,()=>{
    console.log("app is listening to port 8080");
})