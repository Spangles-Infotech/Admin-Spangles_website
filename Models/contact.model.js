const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config();

const enquiriesSchema = new mongoose.Schema({
  name: String,
  email: String,
  message: String,
  mobile:{type:String},
  received_on: { type: Date, default: new Date() },
  type:{ 
    type:String, 
    enum: ["contact", "service", "schedule demo", "buy now"],
    default:"contact"
  },
  status: { type: String, default: "New" },
});

const Enquiries = mongoose.model(
  process.env.DB_COLLECTION_SIX,
  enquiriesSchema
);

module.exports = Enquiries;
