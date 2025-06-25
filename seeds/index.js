const mongoose = require("mongoose");
const cities = require("./cities");
const Campground = require('../models/campground');
const {places,descriptors} = require('./seedHelpers');
mongoose.connect('mongodb://127.0.0.1:27017/yelp-camp',{
})
  .then(() => {
    console.log("MongoDB connection open!");
  })
  .catch(err => {
    console.error(" MongoDB connection error:", err);
  });
  const sample = array => array[Math.floor(Math.random()*array.length)];
  const price = Math.floor(Math.random() * 20) + 10;
  const seedDB = async () => {
    await Campground.deleteMany({});
    for(let i=0; i<50; i++){
      const random1000 = Math.floor(Math.random()*1000);
     const camp = new Campground({
        author: '684e66859cd15345355dbe81',
        location: `${cities[random1000].city},${cities[random1000].state}`,
        title: `${sample(descriptors)} ${sample(places)}`,
        description: 'This is a Beautiful place!!!',
        price,
        geometry: {
          type: "Point",
          coordinates:  [
            cities[random1000].longitude,
            cities[random1000].latitude,
          ]
        },
        images:  [
              {
                url: 'https://res.cloudinary.com/dopixi5x7/image/upload/v1750227506/YelpCamp/zmiannv3cxqwn7l7hp6l.jpg',
                filename: 'YelpCamp/zmiannv3cxqwn7l7hp6l',                
              },
              {
                url: 'https://res.cloudinary.com/dopixi5x7/image/upload/v1750227509/YelpCamp/bu43fhmg6cnc4pfg9f0e.jpg',
                filename: 'YelpCamp/bu43fhmg6cnc4pfg9f0e',
              }
            ]
      })
      await camp.save();
    }
  }
  seedDB().then(() => {
    mongoose.connection.close();
});
