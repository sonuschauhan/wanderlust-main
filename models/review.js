const mongoose=require("mongoose");
const {Schema}=require("mongoose");

const reviewSchema=new Schema({
    comment:String,
    rating:{
        type:String,
        min:1,
        max:5
    },
    createdAt:{
        type:Date,
        default:Date.now()
    }
})

module.exports= mongoose.model("Review",reviewSchema);