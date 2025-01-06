const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config();
const gallerySchema = new mongoose.Schema({
  name: {
    type: String,
  },
  path: {
    type: String,
    required: true,
  },
  size: {
    type: Number,
  },
  mimetype: {
    type: String,
  },
  upload_on: {
    type: Date,
    required: true,
    default: new Date(),
  },
  thumbnailName:{
    type:String
  },
  thumbnailPath:{
    type:String
  },
  thumbnailSize:{
    type:Number
  }
});

const gallery = mongoose.model(process.env.DB_COLLECTION_FOUR, gallerySchema);

module.exports = gallery;
