const express = require("express");
const userController = require("../Controllers/user.controller.js");
const { authentication } = require("../Middlewares/authentication.js");
const userRouter = express.Router();

userRouter.get("/list", authentication, userController.getAll);
userRouter.get("/:id/data", authentication, userController.getSingle);
userRouter.put(
  "/:id/update/access",
  authentication,
  userController.updateAccess
);
userRouter.delete("/:id/delete", authentication, userController.DeleteUser);
userRouter.post("/add/new", userController.signup);
userRouter.post("/login", userController.login);

module.exports = userRouter;
