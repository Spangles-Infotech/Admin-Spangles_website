const Enquiries = require("../Models/contact.model.js");

const enquiresController = {
  getAll: async (req, res) => {
    const { page = 1, limit = 15, search = "", status, from, to } = req.query;

    // Ensure page and limit are numbers
    const pageNum = parseInt(page, 10);
    const limitNum = parseInt(limit, 10);

    // Prepare search conditions
    const searchConditions = [];

    if (search) {
      searchConditions.push({ name: { $regex: search, $options: "i" } });
    }
    if (status) {
      searchConditions.push({ status });
    }
    if (from && to) {
      searchConditions.push({
        received_on: { $gte: new Date(from), $lte: new Date(to) },
      });
    }

    const queryConditions = searchConditions.length
      ? { $and: searchConditions }
      : {};

    try {
      const enquiries = await Enquiries.aggregate([
        { $match: queryConditions },
        { $sort: { _id: -1 } },
        {
          $facet: {
            statusNull: [
              { $match: { status: "New" } },
              //   { $skip: (pageNum - 1) * limitNum },
              //   { $limit: limitNum },
            ],
            statusSeen: [
              { $match: { status: "Seen" } },
              //   { $skip: (pageNum - 1) * limitNum },
              //   { $limit: limitNum },
            ],
          },
        },
        {
          $project: {
            enquiries: { $concatArrays: ["$statusNull", "$statusSeen"] },
          },
        },
        { $unwind: "$enquiries" },
        { $replaceRoot: { newRoot: "$enquiries" } },
        { $skip: (pageNum - 1) * limitNum },
        { $limit: limitNum },
      ]);

      //   return console.log(enquiries);
      const totalItems = await Enquiries.countDocuments(queryConditions); // Get total count of matching documents
      const TotalPages = Math.ceil(totalItems / limitNum);
      return res.status(200).json({
        message: "Data Fetched Successfully",
        enquiries,
        totalItems,
        TotalPages,
        CurrentPage: parseInt(page),
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
      const enquiries = await Enquiries.findById(req.params.id);
      if (!enquiries) {
        return res.status(404).json({
          message: "Enquiries not found",
        });
      }
      return res.status(200).json({
        message: "Data Fetched Successfully",
        enquiries,
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
      const newEnquiries = new Enquiries(req.body);
      await newEnquiries.save();
      return res.status(201).json({
        message: "Message Sented successfully",
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
      const enquiries = await Enquiries.findById(req.params.id);
      if (!enquiries) {
        return res.status(404).json({
          message: "Enquiries not found",
        });
      }
      const updateEnquiries = await Enquiries.findByIdAndUpdate(
        enquiries._id,
        req.body
      );
      return res.status(201).json({
        message: "Status updated successfully",
      });
    } catch (error) {
      console.log(error);
      return res.status(500).json({
        message: "Internal Server Error",
      });
    }
  },
};
module.exports = enquiresController;
