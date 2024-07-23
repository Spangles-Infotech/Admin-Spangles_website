const { generateToken } = require("../Middlewares/authentication.js");
const User = require("../Models/user.model.js");
const { comparePassword, hashPassword } = require("../Utilities/hashing.js");

const userController = {
  signup: async (req, res) => {
    const { username } = req.body;
    try {
      const user = await User.find({ username });
      if (user.length !== 0) {
        return res.status(400).json({
          message: "Username already exists",
        });
      } else {
        const encryptedPassword = hashPassword(req.body.password);
        req.body.password = encryptedPassword;
        const newUser = new User(req.body);
        await newUser.save();
        return res.status(201).json({
          message: "User created successfully",
        });
      }
    } catch (error) {
      console.log(error);
      return res.status(500).json({
        message: "Internal Server Error",
      });
    }
  },
  login: async (req, res) => {
    const { username, password } = req.body;
    try {
      const user = await User.findOne({ username });
      if (!user) {
        return res.status(404).json({
          message: "User not found",
        });
      } else {
        const verify = comparePassword(user.password);
        if (verify !== password) {
          return res.status(400).json({
            message: "Invalid Credentials",
          });
        } else {
          const token = await generateToken(user);
          return res.status(200).json({
            message: "Login Successful",
            user: {
              name: user.name,
              access_to: user.access_to,
              isAdmin: user.isAdmin,
            },
            token,
          });
        }
      }
    } catch (error) {
      console.log(error);
      return res.status(500).json({
        message: "Internal Server Error",
      });
    }
  },
  getAll: async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 15;
    try {
      const user = await User.find({ isAdmin: false })
        .sort({ _id: -1 })
        .skip((page - 1) * limit)
        .limit(limit);
      const totalItems = await User.countDocuments({ isAdmin: false });
      const TotalPages = Math.ceil(totalItems / limit);
      return res.status(200).json({
        message: "Data Fetched Successfully",
        user,
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
      const user = await User.findById(req.params.id);
      if (!user) {
        return res.status(404).json({
          message: "User not found",
        });
      }
      return res.status(200).json({
        message: "Data Fetched Successfully",
        user,
      });
    } catch (error) {
      console.log(error);
      return res.status(500).json({
        message: "Internal Server Error",
      });
    }
  },
  updateAccess: async (req, res) => {
    const { id } = req.params;
    try {
      const user = await User.findById(id);
      if (!user) {
        return res.status(404).json({
          message: "User not found",
        });
      } else {
        user.access_to = req.body.access_to;
        await user.save();
        return res.status(200).json({
          message: "User Access Updated Successfully",
        });
      }
    } catch (error) {
      console.log(error);
      return res.status(500).json({
        message: "Internal Server Error",
      });
    }
  },
};
module.exports = userController;
