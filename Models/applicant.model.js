const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config();

const applicantSchema = new mongoose.Schema({
  name: String,
  email: String,
  mobile_number: String,
  alternative_mobile_number: String,
  category: String,
  designation: String,
  skills: String,
  experience: String,
  resume: String,
  salary_expectation: String,
  description: String,
  applied_on: { type: Date, default: new Date() },
  status: { type: String, default: "View" },
});

const Applicant = mongoose.model(
  process.env.DB_COLLECTION_FIVE,
  applicantSchema
);

module.exports = Applicant;
