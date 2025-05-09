const jwt = require("jsonwebtoken");
const userModel = require("../models/user");

module.exports = async (req, res, next) => {
  if (!req.cookies.token) {
    return res.redirect("/login");
  }
  try {
    let decoded = jwt.verify(req.cookies.token, "$uperman");
    let user = await userModel.findOne({ email: decoded.email }).select("-password");
    req.user = user;
    next();
  } catch (error) {
    console.log("error in middle ware ",error.message);
    res.redirect("/login");
  }
};
