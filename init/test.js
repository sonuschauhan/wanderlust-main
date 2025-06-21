const mongoose = require("mongoose");
const Listing = require("../models/listing");
const initData = require("./data");
const axios = require("axios");
require("dotenv").config();

main().then(() => {
  console.log("connected to DB");
}).catch((err) => {
  console.log(err);
});

async function main() {
  await mongoose.connect("mongodb://127.0.0.1:27017/wanderlust-test");
}



async function getCoordinates(location) {
  const response = await axios.get('https://nominatim.openstreetmap.org/search', {
    params: {
      q: location,
      format: 'json',
      limit: 1
    },
    headers: {
      'User-Agent': 'wanderlust-app (your-email@example.com)'
    }
  });

  if (response.data.length === 0) {
    return null;
  }

  const { lat, lon } = response.data[0];
  console.log(response.data);
  return [parseFloat(lon), parseFloat(lat)];
}

getCoordinates("");
