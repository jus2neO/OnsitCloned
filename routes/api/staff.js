const express = require('express');
const Modelclass = require('../models/staff');
const SecretModelClass = require('../models/secret.js');
const bcrypt = require('bcryptjs');
const router = express.Router();

//get secrets
const getAllSecret = async () => {
    try{
      return new Promise((myResolve, myReject) => {
        SecretModelClass.get_all().then((value) => 
        {
          return myResolve(value);
        })
        .catch((error) => {
            console.log("Error: ", error);
          return myReject(error);
        });
      }); 
    } catch(err) {
        console.log("Error: ", err);
        return err;
    }
  }

  function makeid(length) {
    let result = '';
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const charactersLength = characters.length;
    let counter = 0;
    while (counter < length) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
      counter += 1;
    }
    return result;
  }

// @route   GET api/staff
// @desc    Get all staff
// @access  Private
router.get('/', async (req, res, next) => {
  
  await Modelclass.findAllStaff().then((value) => 
  {
    return res.json(value);
  })
  .catch((error) => {
    return res.status(400).json(error);
  });

});

// @route   GET api/staff
// @desc    Get all staff
// @access  Private
router.get('/:id', async (req, res, next) => {
  
  await Modelclass.findStaffById(req.params.id).then((value) => 
  {
    return res.json(value);
  })
  .catch((error) => {
    return res.status(400).json(error);
  });

});

// @route   POST api/student
// @desc    Modify staff
// @access  Public
router.put('/:id', async (req, res, next) => {

  data = {fname: req.body.fname, lname: req.body.lname, mname: req.body.mname,contact: req.body.contact,email: req.body.email,role: req.body.role,modified: new Date()}
  await Modelclass.update(req.params.id,data).then((value) => 
  {
    return res.json({
      contact: value.contact,
      created: value.created,
      email: value.email,
      fname: value.fname,
      id: value.id,
      lname: value.lname,
      mname: value.mname,
      modified: value.modified,
      role: value.role,
      status: value.status,
    });
  })
  .catch((error) => 
  {
    console.log(error);
    return res.json(error);
  });

});

// @route   GET api/student
// @desc    Change password
// @access  Public
router.get('/:id/changepassword', async (req, res, next) => {
    const mysecret = await getAllSecret().then((res) => {
      return res[0].secret;
    }).catch((err) => {
        console.log("Error: ", err);
        return "error";
    });
    
    if(mysecret === "error"){
      return res.status(400).json("Server error");
    }
  
    const generatedPassword = makeid(8);
    const salt = await bcrypt.genSalt(10);
    const newPassword = await bcrypt.hash(generatedPassword, salt);
  
    data = {password: newPassword, status: "active"}
  
    await Modelclass.update(req.params.id,data).then((value) => 
    {
      const newValue = value;
      newValue.password = generatedPassword;
      return res.json(value);
    })
    .catch((error) => 
    {
      console.log("error: ", error);
      return res.status(400).json(error);
    });
  });

module.exports = router;