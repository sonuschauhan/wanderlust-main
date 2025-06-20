const mongoose=require("mongoose");
const {Schema}=require("mongoose");

const passportLocalMongoose = require('passport-local-mongoose');

const userSchema=new Schema({
    email:{
        type:String,
        required:false,
        username:String,
        googleId: String,
        profilePic: String
    },

});

userSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model('User', userSchema);