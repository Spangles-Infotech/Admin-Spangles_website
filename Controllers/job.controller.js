const Jobs = require("../Models/job.model.js");

const jobController = {
  getAll: async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 15;
    try {
      const jobs = await Jobs.find()
        .sort({ _id: -1 })
        .skip((page - 1) * limit)
        .limit(limit);
      const totalItems = await Jobs.countDocuments();
      const TotalPages = Math.ceil(totalItems / limit);
      return res.status(200).json({
        message: "Data Fetched Successfully",
        jobs,
        totalItems,
        TotalPages,
        CurrentPage: page,
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
      const category = [];
      jobs.forEach((job) => {
        if (!category.includes(job.category)) {
          category.push(job.category);
        }
      });
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
