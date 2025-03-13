const express = require("express");
const applicantController = require("../Controllers/spanglesApplicant.controller.js");
const { authentication } = require("../Middlewares/authentication.js");
// const { uploadResume } = require("../Utilities/uploads.js");
const spanglesApplicantRouter = express.Router();

spanglesApplicantRouter.get("/list", authentication, applicantController.getAll);
spanglesApplicantRouter.get("/:id/data", applicantController.getSingle);
spanglesApplicantRouter.post(
  "/apply",
  // uploadResume.single("resume"),
  applicantController.addNew
); 
spanglesApplicantRouter.put(
  "/:id/status/update",
  authentication,
  applicantController.update
);
spanglesApplicantRouter.put(
  "/:id/applicant_status/update",
  authentication,
  applicantController.applicant_status
);

module.exports = spanglesApplicantRouter;
