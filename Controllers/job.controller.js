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
    const pageNum = parseInt(page, 10);
    const limitNum = parseInt(limit, 10);

    // Prepare search conditions
    const searchConditions = [];

    if (search) {
      searchConditions.push({
        $or: [
          { category: { $regex: search, $options: "i" } },
          { designation: { $regex: search, $options: "i" } },
          { work_experience: { $regex: search, $options: "i" } },
          { status: { $regex: search, $options: "i" } },
          { posted_on_str: { $regex: search, $options: "i" } },
        ],
      });
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
    //   const fromDate = new Date(from);
    //   const toDate = new Date(to);

    //   if (fromDate.getTime() === toDate.getTime()) {
    //     // When the `from` and `to` dates are the same, include all events on that day
    //     searchConditions.push({
    //       posted_on: {
    //         $gte: fromDate,
    //         $lt: new Date(fromDate.getTime() + 24 * 60 * 60 * 1000), // Include until the end of the day
    //       },
    //     });
    //   } else {
    //     // When `from` and `to` dates are different, adjust the range
    //     searchConditions.push({
    //       posted_on: {
    //         $gte: fromDate,
    //         $lte: new Date(toDate.getTime() + 24 * 60 * 60 * 1000 - 1), // Include until the end of the `toDate`
    //       },
    //     });
    //   }
    // }

    const queryConditions = searchConditions.length
      ? { $and: searchConditions }
      : {};

    try {
      const jobs = await Jobs.aggregate([
        {
          $addFields: {
            posted_on_str: {
              $dateToString: {
                format: "%d-%m-%Y", // Adjust the format as needed
                date: "$posted_on",
              },
            },
          },
        },
        { $match: queryConditions },
        {
          $project: {
            posted_on_str: 0, // Optionally remove the posted_on_str field from the result
          },
        },
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
      const job = await Jobs.find().sort({ _id: -1 }).select("category");
      const category = [...new Set(job.map((item) => item.category))];
      return res.status(200).json({
        message: "Data Fetched Successfully",
        jobs,
        category,
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
