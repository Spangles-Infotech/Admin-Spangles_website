const Applicant = require("../Models/applicant.model.js");

const applicantController = {
  getAll: async (req, res) => {
    const {
      page = 1,
      limit = 15,
      search = "",
      category,
      designation,
      status,
      from,
      to,
    } = req.query;
    // Ensure page and limit are numbers
    const pageNum = parseInt(page, 10);
    const limitNum = parseInt(limit, 10);

    // Prepare search conditions
    const searchConditions = [];

    if (search) {
      searchConditions.push({ name: { $regex: search, $options: "i" } });
    }
    if (category) {
      searchConditions.push({ category });
    }
    if (designation) {
      searchConditions.push({ designation });
    }
    if (status) {
      searchConditions.push({ status });
    }
    if (from && to) {
      searchConditions.push({
        applied_on: { $gte: new Date(from), $lte: new Date(to) },
      });
    }
    const queryConditions = searchConditions.length
    ? { $and: searchConditions }
    : {};

    try {
      const applicants = await Applicant.aggregate([
        { $match: queryConditions },
        { $sort: { _id: -1 } },
        { $skip: (pageNum - 1) * limitNum },
        { $limit: limitNum },
      ]);

      const totalItems = await Applicant.countDocuments(queryConditions); // Get total count of matching documents
      const TotalPages = Math.ceil(totalItems / limitNum);
      const list = await Applicant.find().select("category designation");
      const categories = [...new Set(list.map((item) => item.category))];
      const designations = [...new Set(list.map((item) => item.designation))];
      return res.status(200).json({
        message: "Data Fetched Successfully",
        applicants,
        totalItems,
        TotalPages,
        CurrentPage: parseInt(page),
        categories,
        designations,
      });
    } catch (error) {
      console.log(error);
      return res.status(500).json({
        message: "Internal Server Error",
      });
    }
  },
  getSingle: async (req, res) => {
    try {
      const applicants = await Applicant.findById(req.params.id);
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
  addNew: async (req, res) => {
    try {
      if (req.file == undefined) {
        return res.status(400).json({ message: "No file selected" });
      }
      req.body.resume = req.file.path;
      const newApplicant = new Applicant(req.body);
      await newApplicant.save();
      return res.status(201).json({
        message: "Applicant created successfully",
      });
    } catch (error) {
      console.log(error);
      return res.status(500).json({
        message: "Internal Server Error",
      });
    }
  },
  update: async (req, res) => {
    try {
      const applicants = await Applicant.findById(req.params.id);
      if (!applicants) {
        return res.status(404).json({
          message: "Applicant not found",
        });
      }
      const updateApplicant = await Applicant.findByIdAndUpdate(
        applicants._id,
        req.body
      );
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
};
module.exports = applicantController;
