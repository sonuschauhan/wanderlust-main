const express=require("express");
const router=express.Router();
const wrapAsync =require("../utils/wrapAsync");
const {listingSchema,reviewSchema}=require("../schema");
const Listing=require("../models/listing");
const ExpressError=require("../utils/ExpressError");
const {isLoggedIn, isOwner,validateListing}=require("../middleware");
const listingController=require("../controllers/listings");

router
    .route("/")
    .get(wrapAsync(listingController.index))
    .post(isLoggedIn,validateListing,wrapAsync(listingController.createListing))

//New Route
router.get("/new",isLoggedIn,wrapAsync(listingController.renderNewForm))

router
    .route("/:id")
    .get(wrapAsync(listingController.showListing))
    .put(isLoggedIn,isOwner ,validateListing,wrapAsync(listingController.       updateListing))
    .delete(isOwner,isLoggedIn,wrapAsync(listingController.destroyListing))




//Show route


// Edit route
router.get("/:id/edit",isLoggedIn,isOwner,wrapAsync(listingController.renderEditForm))

//Update route


//delete route


module.exports=router;
