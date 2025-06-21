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

const axios = require('axios');

async function getCoordinates(location) {
  try {
    const res = await axios.get("https://nominatim.openstreetmap.org/search", {
      params: {
        q: location,
        format: "json",
        limit: 1
      },
      headers: {
        'User-Agent': 'wanderlust-app'
      }
    });

    if (res.data.length === 0) return null;

    const { lon, lat } = res.data[0];
    return [parseFloat(lon), parseFloat(lat)];
  } catch (e) {
    console.log("Geocoding error:", e.message);
    return null;
  }
}


async function initDB() {
  await Listing.deleteMany({});
  const updatedData = [];

  for (let obj of initData.data) {
    console.log(1);
    const fullLocation = `${obj.location}, ${obj.country}`;
    const coords = await getCoordinates(fullLocation);
    if (!coords) continue;

    obj.owner = '6855b05b3043a566e19a6b18';
    obj.locationCoordinate = {
      type: "Point",
      coordinates: coords
    };
    updatedData.push(obj);
  }

  await Listing.insertMany(updatedData);
  console.log("Data was initialized with coordinates.");
}


initDB();