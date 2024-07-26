const Jobs = require("../Models/job.model.js");

const jobController = {
  getAll: async (req, res) => {
    const {
      page = 1,
      limit = 15,
      search = "",
      category,
      designation,
      status,
      // from,
      // to,
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
    // if (from && to) {
    //   searchConditions.push({
    //     applied_on: { $gte: new Date(from), $lte: new Date(to) },
    //   });
    // }
    const queryConditions = searchConditions.length
      ? { $and: searchConditions }
      : {};

    try {
      const jobs = await Jobs.aggregate([
        { $match: queryConditions },
        { $sort: { _id: -1 } },
        { $skip: (pageNum - 1) * limitNum },
        { $limit: limitNum },
      ]);

      const totalItems = await Jobs.countDocuments(queryConditions); // Get total count of matching documents
      const TotalPages = Math.ceil(totalItems / limitNum);
      const list = await Jobs.find().select("category designation");
      const categories = [...new Set(list.map((item) => item.category))];
      const designations = [...new Set(list.map((item) => item.designation))];
      return res.status(200).json({
        message: "Data Fetched Successfully",
        jobs,
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
      const jobs = await Jobs.findById(req.params.id);
      if (!jobs) {
        return res.status(404).json({
          message: "Job not found",
        });
      }
      return res.status(200).json({
        message: "Data Fetched Successfully",
        jobs,
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
      const newJob = new Jobs(req.body);
      await newJob.save();
      return res.status(201).json({
        message: "Job created successfully",
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
      const jobs = await Jobs.findById(req.params.id);
      if (!jobs) {
        return res.status(404).json({
          message: "Job not found",
        });
      }
      const updateJob = await Jobs.findByIdAndUpdate(jobs._id, req.body);
      return res.status(201).json({
        message: "Job updated successfully",
      });
    } catch (error) {
      console.log(error);
      return res.status(500).json({
        message: "Internal Server Error",
      });
    }
  },
  getAllCatogory: async (req, res) => {
    try {
      const jobs = await Jobs.find().sort({ _id: -1 }).select("category");
      const category = [...new Set(jobs.map((item) => item.category))];
      return res.status(200).json({
        message: "Data Fetched Successfully",
        category,
      });
    } catch (error) {
      console.log(error);
      return res.status(500).json({
        message: "Internal Server Error",
      });
    }
  },
};
module.exports = jobController;
