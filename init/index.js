const mongoose =require("mongoose");
const Listing=require("../models/listing");
const initData=require("./data");


main().then(()=>{
    console.log("connected to DB");
}).catch((err)=>{
    console.log(err);
})

async function main(){
    await mongoose.connect('mongodb://127.0.0.1:27017/wanderlust-test');
}

async function initDB(){
    await Listing.deleteMany({});
    await Listing.insertMany(initData.data);
    console.log("data was initialized ");
}

initDB();