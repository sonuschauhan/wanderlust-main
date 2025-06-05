const express = require("express");
const app= express();
const mongoose=require("mongoose");
const Listing=require("./models/listing")
const path=require("path");
const methodOverride=require("method-override");

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

app.get("/",(req,res)=>{
    res.send("Hi, I'm root");
})

//Index route
app.get("/listings",async (req,res)=>{
    const allListings=await Listing.find();
    // console.log(allListings);
    res.render("listings/index.ejs",{allListings});

})

//New Route
app.get("/listings/new",async(req,res)=>{
    res.render("listings/new.ejs")
})

//Show route
app.get("/listings/:id",async(req,res)=>{
    let {id}=req.params;
    const listing=await Listing.findById(id);
    res.render("listings/show.ejs",{listing});
})
//create route
app.post("/listings",async(req,res)=>{
    const newListing= Listing(req.body.listing);
    await newListing.save();
    res.redirect("/listings");
})
// Edit route
app.get("/listings/:id/edit",async(req,res)=>{
    let {id}=req.params;
    const listing=await Listing.findById(id);
    res.render("listings/edit.ejs",{listing});
})

//Update route
app.put("/listings/:id",async(req,res)=>{
    let {id}=req.params;
    await Listing.findByIdAndUpdate(id,{...req.body.listing});
    res.redirect(`/listings/${id}`);
})

//delete route
app.delete("/listings/:id",async(req,res)=>{
    let {id}=req.params;
    let deletedListing=await Listing.findByIdAndDelete(id);
    console.log(deletedListing);
    res.redirect("/listings");
})



// app.get("/testListing",async (req,res)=>{
//     let sampleListing = new Listing({
//         title:"My new Villa",
//         description:"by the beach",
//         price : 1200,
//         location:"Noida",
//         country:"India"
//     });
//     await sampleListing.save();
//     console.log("sample was saved"),
//     res.send("successful testing")
// })

app.listen(8080,()=>{
    console.log("app is listening to port 8080");
})