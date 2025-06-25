const mongoose = require("mongoose");
const Review = require('./review');
const { coordinates } = require("@maptiler/client");
const Schema = mongoose.Schema;
const ImageSchema = new Schema({
      url: String,
      filename: String
    })
    
    ImageSchema.virtual('thumbnail').get(function(){
      return this.url.replace('/upload','upload/w_200')
    })
    const opt = { toJSON: {virtuals: true}};
 const campGroundSchema = new Schema({
    title:{
        type:String
    },
    images: [ImageSchema],
    geometry: {
      type: {
        type: String,
        enum: ['Point'],
        required: true
      },
      coordinates: {
        type: [Number],
        required: true
      }

    },
    price: {
        type:Number
    }
    ,description:{
        type: String
    },
    location: {
        type:String
    },
    author: {
      type: Schema.Types.ObjectId,
      ref: 'User'
    },
    reviews: [{
        type: Schema.Types.ObjectId,
        ref: 'Review'
    }],
 },opt)
campGroundSchema.virtual('properties.popUpMarkup').get(function(){
  return `<a href="/campgrounds/${this._id}">${this.title}</a>`;
});

 campGroundSchema.post('findOneAndDelete',async function(doc){
    if(doc){
        await Review.deleteMany({
            id: {
                $in: doc.reviews
            }
        })
    }
 })
 module.exports = mongoose.model('Campground',campGroundSchema);