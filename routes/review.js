const express=require("express");
const router=express.Router({mergeParams:true});
const wrapAsync =require("../utils/wrapAsync");
const {listingSchema,reviewSchema}=require("../schema");
const ExpressError=require("../utils/ExpressError");
const Listing=require("../models/listing");
const Review=require("../models/review");


const validateReview=(req,res,next)=>{
    let {error}= reviewSchema.validate(req.body);
    if(error){
        let errMsg=error.details.map((el)=>el.message).join(",");
        throw new ExpressError(400,errMsg);
    }
    {
        next();
    }
}

//Post review route
router.post("/",validateReview,wrapAsync(async (req,res)=>{
    let listing=await Listing.findById(req.params.id);
    console.log(req.body.review);
    let newReview= new Review(req.body.review);
    listing.reviews.push(newReview);
    await newReview.save();
    await listing.save();
    req.flash("success","New Review Created!")
    res.redirect(`/listings/${listing._id}`);
}));
//delete reviews route
router.delete("/:reviewId",wrapAsync(async(req,res)=>{
    let {id,reviewId}=req.params;
    await Review.findByIdAndDelete(reviewId);
    await Listing.findByIdAndUpdate(id,{$pull:{reviews:reviewId}});
    req.flash("success","Review Deleted!")
    res.redirect(`/listings/${id}`);
}))


module.exports=router;
