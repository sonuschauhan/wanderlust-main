const express=require("express");
const router=express.Router({mergeParams:true});
const wrapAsync =require("../utils/wrapAsync");
const Listing=require("../models/listing");
const Review=require("../models/review");
const { validateReview, isLoggedIn,isAuthor } = require("../middleware");




//Post review route
router.post("/",isLoggedIn,validateReview,wrapAsync(async (req,res)=>{
    let listing=await Listing.findById(req.params.id);
    console.log(req.body.review);
    let newReview= new Review(req.body.review);
    newReview.author = req.user._id;
    console.log(newReview);
    listing.reviews.push(newReview);
    await newReview.save();
    await listing.save();
    req.flash("success","New Review Created!")
    res.redirect(`/listings/${listing._id}`);
}));
//delete reviews route
router.delete("/:reviewId",isLoggedIn,isAuthor,wrapAsync(async(req,res)=>{
    let {id,reviewId}=req.params;
    await Review.findByIdAndDelete(reviewId);
    await Listing.findByIdAndUpdate(id,{$pull:{reviews:reviewId}});
    req.flash("success","Review Deleted!")
    res.redirect(`/listings/${id}`);
}))


module.exports=router;
