import mongoose from "mongoose";

const monvieSchema = new mongoose.Schema({

    _id:{type:String,required:true},
    title:{type:String,required:true},
    overview:{type:String,required:true},
    poster_path:{type:String,required:true},
    backdrop_path:{type:String,required:true},
    release_date:{type:String,required:true},
    original_language:{type:String},
    tagline:{type:String},
    genres:{type:Array,required:true},
    cast:{type:Array,required:true},
    vote_avg:{type:Number,required:true},
    runtime:{type:Number,required:true},

},{timestamps:true}
)

const Movie=mongoose.model("Movie",monvieSchema);

export default Movie;