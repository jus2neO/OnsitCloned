const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const bcrypt = require('bcryptjs');
const {check, validationResult} = require('express-validator/');
const jwt = require('jsonwebtoken');
const Modelclass = require('../models/students.js');
const StaffModelClass = require('../models/staff.js');

//get secrets
const getAllSecret = async () => {
    try{
      return new Promise((myResolve, myReject) => {
        SecretModelClass.get_all().then((value) => 
        {
          return myResolve(value);
        })
        .catch((error) => {
          return myReject(error);
        });
      }); 
    } catch(err) {
        return err;
    }
  }

// @route   GET api/auth
// @desc    Test route
// @access  Public
router.get('/', (req, res) => res.send('Auth route'));

// @route   POST api/auth
// @desc    Login
// @access  Public
router.post('/login',[
    check('id', 'Please provide valid student ID').isLength({min: 3}),
    check('password', 'Please enter a password with 6 or more characters').isLength({min: 6})
]
, async (req, res) => {
    const {id, password} = req.body;
    const errors = validationResult(req);
    if(!errors.isEmpty()) return res.status(400).json({errors: errors.array()});

    const mysecret = await getAllSecret().then((res) => {
        return res[0].secret;
    }).catch((err) => {return "error"});

    const mystudent = await Modelclass.find(id).then((value) => 
    {
        return value;
    })
    .catch((error) => {
        console.log(error);
        return res.status(400).json("Server error.");
    });

    if(!mystudent) return res.status(400).json("Invalid Credentials");

    const isMatch = await bcrypt.compare(password, mystudent.password);

    if(!isMatch) return res.status(400).json("Invalid Credentials");

    const payload = {
        user: {
          id: id
        }
    }
    
    jwt.sign(payload,
    mysecret,
    { expiresIn: 360000 },
    (err, token) => {
        if(err) throw err;
        return res.json({
          id: mystudent.id,
          fname: mystudent.fname,
          mname: mystudent.mname,
          lname: mystudent.lname,
          email: mystudent.email,
          contact: mystudent.contact,
          address: mystudent.address,
          created: mystudent.created,
          isInit: mystudent.isInit,
          status: mystudent.status,
          civilstatus: mystudent.civilstatus,
          birthdate: mystudent.birthdate,
          age: mystudent.age,
          sex: mystudent.sex,
          height: mystudent.height,
          weight: mystudent.weight,
          collegedepartment: mystudent.collegedepartment,
          SIT: mystudent.SIT,
          companyid: mystudent.companyid,
          course: mystudent.course,
          yearsection: mystudent.yearsection,
          fathersname: mystudent.fathersname,
          fathersaddress: mystudent.fathersaddress,
          fatherscontact: mystudent.fatherscontact,
          mothersname: mystudent.mothersname,
          mothersaddress: mystudent.mothersaddress,
          motherscontact: mystudent.motherscontact, 
          motherscontact: mystudent.motherscontact, 
          token
        });
    });
});

// @route   POST api/auth
// @desc    Login
// @access  Public
router.post('/staff/login',[
  check('email', 'Please provide valid staff email').isLength({min: 8}),
  check('password', 'Please enter a password with 6 or more characters').isLength({min: 6})
]
, async (req, res) => {
  const {email, password} = req.body;
  const errors = validationResult(req);
  if(!errors.isEmpty()) return res.status(400).json({errors: errors.array()});

  const mysecret = await getAllSecret().then((res) => {
      return res[0].secret;
  }).catch((err) => {return "error"});

  const staff = await StaffModelClass.findByEmail(email).then((value) => 
  {
      return value;
  })
  .catch((error) => {
      console.log(error);
      return res.status(400).json("Server error.");
  });

  if(!staff) return res.status(400).json("Invalid Credentials");
  if(staff.status === "inactive") return res.status(400).json("Invalid Credentials");

  const isMatch = await bcrypt.compare(password, staff.password);

  if(!isMatch) return res.status(400).json("Invalid Credentials");

  const payload = {
      user: {
        id: staff.id
      }
  }
  
  jwt.sign(payload,
  mysecret,
  { expiresIn: 360000 },
  (err, token) => {
      if(err) throw err;
      return res.json({
        id: staff.id,
        fname: staff.fname,
        mname: staff.mname,
        lname: staff.lname,
        email: staff.email,
        contact: staff.contact,
        status: staff.status,
        role: staff.role,
        created: staff.created,
        modified: staff.modified,
        token
      });
  });
});

module.exports = router;