const express = require("express");
const router = express.Router();
const userModel = require("../models/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
//for user registrstion
router.post("/auth/signup", async (req, res) => {
  const { email, fullname, password } = req.body;
  console.log("Signup data received:", req.body);

  try {
    let user = await userModel.findOne({ email });
    if (user) {
      console.log("user already exist!!");
      return res.status(500).send("user already exist!!");
    }
    bcrypt.genSalt(10, (err, salt) => {
      bcrypt.hash(password, salt, async (err, hash) => {
        let user = await userModel.create({
          fullname,
          email,
          password: hash,
        });
        let token = jwt.sign({ email, userid: user._id }, "$uperman");
        res.cookie("token", token);
        console.log("user crested in signup:",user);
        
        res.send(user);
      });
    });
  } catch (error) {
    console.log(error);
    res.send("error occured !!");
  }
});

//login page 

router.post("/auth/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    let user = await userModel.findOne({ email });
    if (!user) {
      return res.status(401).send("invalid credentials!!");
    }
    bcrypt.compare(password, user.password, (err, result) => {
      if (err) {
        return res.status(401).send("invalid credentials!!");
      }
      if (result) {
        let token = jwt.sign({ email, userid: user._id }, "$uperman");
        res.cookie("token", token);
        res.send(user)
        console.log("user crested in login:",user);
        // res.send({"message":"ypu can login !!"});
      }
    });
  } catch (error) {
    console.log(error);
    res.redirect("/login");
  }
});

router.get("/logout",(req,res)=>{
    res.cookie("token","");
    res.send({"message":"user loged out successfully"})
})

module.exports = router;
