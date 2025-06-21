const Listing=require("../models/listing");
const axios = require("axios");
module.exports.index=async (req,res)=>{
    const allListings=await Listing.find();
    // console.log(allListings);
    res.render("listings/index.ejs",{allListings});
}

module.exports.renderNewForm=async(req,res)=>{
    // console.log(req.user);
    res.render("listings/new.ejs")
}

module.exports.showListing=async(req,res)=>{
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
    
}

module.exports.createListing = async (req, res, next) => {
  try {
    const { listing } = req.body;

    // Geocode location using OpenStreetMap's Nominatim
    const geoData = await axios.get('https://nominatim.openstreetmap.org/search', {
      params: {
        q: listing.location,
        format: 'json',
        limit: 1
      },
      headers: {
        'User-Agent': 'Wanderlust-App' // Required by Nominatim usage policy
      }
    });

    if (!geoData.data.length) {
      req.flash("error", "Location not found. Please enter a valid location.");
      return res.redirect("/listings/new");
    }

    const coordinates = [
      parseFloat(geoData.data[0].lon),
      parseFloat(geoData.data[0].lat)
    ];

    const newListing = new Listing({
      ...listing,
      owner: req.user._id,
      locationCoordinate: {
        type: "Point",
        coordinates: coordinates
      }
    });

    const result=await newListing.save();
    console.log(result);
    req.flash("success", "New Listing Created!");
    res.redirect("/listings");
  } catch (err) {
    next(err);
  }
};

module.exports.renderEditForm=async(req,res)=>{
    let {id}=req.params;
    const listing=await Listing.findById(id);
    if(!listing){
        req.flash("error","Listing you requested for does not exists");
        res.redirect("/listings");
    }else{
    res.render("listings/edit.ejs",{listing});
    }
}

module.exports.updateListing=async(req,res)=>{
    let {id}=req.params;
    await Listing.findByIdAndUpdate(id,{...req.body.listing});
    req.flash("success","Listing Updated!")
    res.redirect(`/listings/${id}`);
}

module.exports.destroyListing=async(req,res)=>{
    let {id}=req.params;
    let deletedListing=await Listing.findByIdAndDelete(id);
    console.log(deletedListing);
    req.flash("success","Listing Deleted!")
    res.redirect("/listings");
}