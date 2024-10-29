const { where, Model } = require("sequelize");
const bcrypt = require('bcrypt');
const jwt = require("jsonwebtoken")
const { Auths, Users } = require("../models");

const register = async (req, res, next) => {
  try {
    res.status(201).json({
      status: "Success",
      data: {},
    });
  } catch (err) {}
};

const login = async (req, res, next) => {
  try {
    const { email, password} = req.body;

    const data = await Auths.findOne({
      include :[{
        model: Users,
        as :"user",
      }], 
      
      where: {
        email,
      }
    });

    if(!data){
      return res.status(404).json({
        status: "Failed",
        message: "Email not registered",
        isSucces: false,
        data: null,
      });
    }
    if(data && bcrypt.compareSync(password, data.password)){
      const token = jwt.sign(
      {
        id: data.id,
        username: data.user.name,
        email : data.email,
        userId: data.user.id
      }
      , process.env.JWT_SECRET,
      {
        expiresIn : process.env.JWT_EXPIRED,
      }
    );
      res.status(200).json({
        status: "Success",
        message: "Login success",
        isSuccess: true,
        data: 
        {
          username: data.user.name,
          token
        },
      });
    }else{
      res.status(401).json({
        status: "Failed",
        message: "Wrong Password",
        isSuccess: false,
        data: null,
      });
    }

  } catch (err) {
    res.status(500).json({
      status: "Success",
      message: "Login failed",
      isSuccess: true,
      data: null,
    });
  }
};

const authenticate = async (req, res) => {
  try {
    res.status(200).json({
      status: "Success",
      data: {
        user: req.user,
      },
    });
  } catch (err) {

  }
};

module.exports = {
  register,
  login,
  authenticate,
};
