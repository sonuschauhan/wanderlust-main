const express=require("express");
const router=express.Router();
const wrapAsync =require("../utils/wrapAsync");
const {listingSchema,reviewSchema}=require("../schema");
const Listing=require("../models/listing");
const ExpressError=require("../utils/ExpressError");


const validateListing=(req,res,next)=>{
    let {error}= listingSchema.validate(req.body);
    
    if(error){
        let errMsg=error.details.map((el)=>el.message).join(",");
        throw new ExpressError(400,errMsg);
    }
    {
        next();
    }
}

//Index route
router.get("/",wrapAsync(async (req,res)=>{
    const allListings=await Listing.find();
    // console.log(allListings);
    res.render("listings/index.ejs",{allListings});

}))

//New Route
router.get("/new",wrapAsync(async(req,res)=>{
    res.render("listings/new.ejs")
}))

//Show route
router.get("/:id",wrapAsync(async(req,res)=>{
    let {id}=req.params;
    const listing=await Listing.findById(id).populate("reviews");
    res.render("listings/show.ejs",{listing});
}))
//create route
router.post("/",validateListing,wrapAsync(async(req,res,next)=>{
   
    const newListing= Listing(req.body.listing);
    await newListing.save();
    res.redirect("/listings");
   
}))
// Edit route
router.get("/:id/edit",wrapAsync(async(req,res)=>{
    let {id}=req.params;
    const listing=await Listing.findById(id);
    res.render("listings/edit.ejs",{listing});
}))

//Update route
router.put("/:id",validateListing,wrapAsync(async(req,res)=>{
    let {id}=req.params;
    await Listing.findByIdAndUpdate(id,{...req.body.listing});
    res.redirect(`/listings/${id}`);
}))

//delete route
router.delete("/:id",wrapAsync(async(req,res)=>{
    let {id}=req.params;
    let deletedListing=await Listing.findByIdAndDelete(id);
    console.log(deletedListing);
    res.redirect("/listings");
}));

module.exports=router;
