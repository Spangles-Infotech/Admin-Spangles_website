const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config();

const spanglesApplicantSchema = new mongoose.Schema({
  spanglesApplicantId:{ type: String, required: true },
  name: { type: String, required: true },
  email: { type: String, required: true },
  mobile_number: { type: String, required: true },
  college_name: { type: String, required: true },
  position_applied_for: { type: String, required: true },
  preferred_job_location: { type: String, required: true },
  willing_to_relocate: { type: String, required: true },
  interested_in: { type: String, required: true },
  applied_on: { type: Date, default: Date.now },
  status: {
    type: String,
    enum: ['On Hold', 'Shortlisted', 'Rejected', 'Seen', 'View'],
    default: 'View'
  },
  ReasonForStatus: [{ type: Object }]
});

const SpanglesApplicant = mongoose.model(
  process.env.DB_COLLECTION_SEVEN,
  spanglesApplicantSchema
);

module.exports = SpanglesApplicant;
