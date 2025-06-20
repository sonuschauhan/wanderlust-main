const express=require("express");
const router=express.Router();
const wrapAsync =require("../utils/wrapAsync");
const {listingSchema,reviewSchema}=require("../schema");
const Listing=require("../models/listing");
const ExpressError=require("../utils/ExpressError");
const {isLoggedIn, isOwner,validateListing}=require("../middleware");



//Index route
router.get("/",wrapAsync(async (req,res)=>{
    const allListings=await Listing.find();
    // console.log(allListings);
    res.render("listings/index.ejs",{allListings});

}))

//New Route
router.get("/new",isLoggedIn,wrapAsync(async(req,res)=>{
    // console.log(req.user);
    res.render("listings/new.ejs")
}))

//Show route
router.get("/:id",wrapAsync(async(req,res)=>{
    let {id}=req.params;
    const listing=await Listing.findById(id)
    .populate({
        path : "reviews",
        populate : {
            path:"author"
        }
    }).populate("owner");
    console.log(listing.reviews);
    if(!listing){
        req.flash("error","Listing you requested for does not exists");
        res.redirect("/listings");
    }else{
       res.render("listings/show.ejs",{listing});
    }
    
}))
//create route
router.post("/",isLoggedIn,validateListing,wrapAsync(async(req,res,next)=>{
   
    const newListing= Listing(req.body.listing);
    console.log(req.user);
    newListing.owner=req.user._id;
    await newListing.save();
    req.flash("success","New Listing Created!")
    res.redirect("/listings");
   
}))
// Edit route
router.get("/:id/edit",isLoggedIn,isOwner,wrapAsync(async(req,res)=>{
    let {id}=req.params;
    const listing=await Listing.findById(id);
    if(!listing){
        req.flash("error","Listing you requested for does not exists");
        res.redirect("/listings");
    }else{
    res.render("listings/edit.ejs",{listing});
    }
}))

//Update route
router.put("/:id",isLoggedIn,isOwner ,validateListing,wrapAsync(async(req,res)=>{
    let {id}=req.params;
    await Listing.findByIdAndUpdate(id,{...req.body.listing});
    req.flash("success","Listing Updated!")
    res.redirect(`/listings/${id}`);
}))

//delete route
router.delete("/:id",isOwner,isLoggedIn,wrapAsync(async(req,res)=>{
    let {id}=req.params;
    let deletedListing=await Listing.findByIdAndDelete(id);
    console.log(deletedListing);
    req.flash("success","Listing Deleted!")
    res.redirect("/listings");
}));

module.exports=router;
