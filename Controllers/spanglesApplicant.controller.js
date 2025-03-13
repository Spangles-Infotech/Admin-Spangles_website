const SpanglesApplicant = require("../Models/spanglesApplicant.model.js");

const spanglesApplicantController = {
  getAll: async (req, res) => {
    const {
      page = 1,
      limit = 15,
      search = "",
      status,
      from,
      to,
    } = req.query;
  
    const pageNum = parseInt(page, 10);
    const limitNum = parseInt(limit, 10);
  
    const searchConditions = [];
  
    if (search) {
      searchConditions.push({
        $or: [
          { name: { $regex: search, $options: "i" } },
          { email: { $regex: search, $options: "i" } },
          { mobile_number: { $regex: search, $options: "i" } },
          { college_name: { $regex: search, $options: "i" } },
          { position_applied_for: { $regex: search, $options: "i" } },
          { preferred_job_location: { $regex: search, $options: "i" } },
          { status: { $regex: search, $options: "i" } },
          { applied_on_str: { $regex: search, $options: "i" } },
        ],
      });
    }
  
    if (status) {
      searchConditions.push({ status });
    }
  
    if (from && to) {
      const fromDate = new Date(from);
      const toDate = new Date(to);
  
      if (fromDate.getTime() === toDate.getTime()) {
        searchConditions.push({
          applied_on: {
            $gte: fromDate,
            $lt: new Date(fromDate.getTime() + 24 * 60 * 60 * 1000),
          },
        });
      } else {
        searchConditions.push({
          applied_on: {
            $gte: fromDate,
            $lte: new Date(toDate.getTime() + 24 * 60 * 60 * 1000 - 1),
          },
        });
      }
    }
  
    const queryConditions = searchConditions.length
      ? { $and: searchConditions }
      : {};
  
    try {
      const applicants = await SpanglesApplicant.aggregate([
        {
          $addFields: {
            applied_on_str: {
              $dateToString: {
                format: "%d-%m-%Y",
                date: "$applied_on",
              },
            },
          },
        },
        { $match: queryConditions },
        { $project: { applied_on_str: 0 } },
        { $sort: { _id: -1 } },
        { $skip: (pageNum - 1) * limitNum },
        { $limit: limitNum },
      ]);
  
      const totalItems = await SpanglesApplicant.countDocuments(queryConditions);
      const TotalPages = Math.ceil(totalItems / limitNum);
      
      return res.status(200).json({
        message: "Data Fetched Successfully",
        applicants,
        totalItems,
        TotalPages,
        CurrentPage: pageNum,
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Internal Server Error" });
    }
  },

  getSingle: async (req, res) => {
    try {
      console.log(req,"req")
      const applicants = await SpanglesApplicant.findById(req.params.id);
      console.log(applicants,"applicants");
      if (!applicants) {
        return res.status(404).json({
          message: "Applicant not found",
        });
      }
      return res.status(200).json({
        message: "Data Fetched Successfully",
        applicants,
      });
    } catch (error) {
      console.log(error);
      return res.status(500).json({
        message: "Internal Server Error",
      });
    }
  },
  applicant_status: async (req, res) => {
    const { status, ReasonForStatus } = req.body;
  
    try {
      const applicant = await SpanglesApplicant.findById({_id:req.params.id});
      if (!applicant) {
        return res.status(404).json({
          message: "Applicant not found",
        });
      }
 
  
      // Push new ReasonForStatus object into the array
      if (ReasonForStatus) {
        applicant.ReasonForStatus.push({
          status:ReasonForStatus.status,
          message:ReasonForStatus.message,
        });
      }
  
      // Update other applicant fields
      applicant.status = status ;
      console.log(applicant.status);
      
      await applicant.save();
  
      return res.status(201).json({
        message: "Applicant updated successfully",
      });
    } catch (error) {
      console.log(error);
      return res.status(500).json({
        message: "Internal Server Error",
      });
    }
  },
  update: async (req, res) => {
    const { status } = req.body;
 
    try {
      const applicant = await SpanglesApplicant.findByIdAndUpdate(
        {_id:req.params.id},
        { status: status },
        { new: true }
      );
      
      await applicant.save();
  
      return res.status(201).json({
        message: "seen updated successfully",
      });
    } catch (error) {
      // console.log(error);
      return res.status(500).json({
        message: "Internal Server Error",
      });
    }
  },
  

  addNew: async (req, res) => {
    try {

  
      const latestApplicant = await SpanglesApplicant.findOne()
        .sort({ spanglesApplicantId: -1 }) // Sort in descending order
        .lean(); 
  
      let newApplicantId = "sp0001";
      if (latestApplicant && latestApplicant.spanglesApplicantId) {
        const lastIdNumber = parseInt(latestApplicant.spanglesApplicantId.replace("sp", ""), 10);
        newApplicantId = `sp${String(lastIdNumber + 1).padStart(4, "0")}`;
      }
  
      req.body.spanglesApplicantId = newApplicantId;
  
      const newApplicant = new SpanglesApplicant(req.body);
      await newApplicant.save();
  
      return res.status(201).json({
        message: "Applicant created successfully",
        spanglesApplicantId: newApplicantId,
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({
        message: "Internal Server Error",
      });
    }
  }
  
};
module.exports = spanglesApplicantController;
