const express=require("express");
const router=express.Router({mergeParams:true});
const wrapAsync =require("../utils/wrapAsync");
const Listing=require("../models/listing");
const Review=require("../models/review");
const { validateReview, isLoggedIn,isAuthor } = require("../middleware");
const reviewController=require("../controllers/reviews");



//Post review route
router.post("/",isLoggedIn,validateReview,wrapAsync(reviewController.createReview));
//delete reviews route
router.delete("/:reviewId",isLoggedIn,isAuthor,wrapAsync(reviewController.destroyReview))


module.exports=router;
