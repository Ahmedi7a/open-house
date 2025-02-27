// models/listing.js

const mongoose = require('mongoose');

const listingSchema = new mongoose.Schema({
  streetAddress: {
    type: String,
    required: true,
  },
  city: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
    min: 0,
  },
  size: {
    type: Number,
    required: true,
    min: 0,
  },
  imgUrl: {
    type: String,
    default: 'https://images.pexels.com/photos/106399/pexels-photo-106399.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
  },
  //link with the user model, will grab user id when logged in
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  favoriteByUsers: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }]

}, { timestamps: true });


// ... listingSchema located above
const Listing = mongoose.model('Listing', listingSchema);

module.exports = Listing;