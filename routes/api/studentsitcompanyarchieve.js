var express = require('express');
var router = express.Router();
const multer  = require('multer')
const upload = multer({ dest: 'uploads/' })
const Modelclass = require('../models/studentsitcompanyarchieve.js');

//get student archieve
const getStudentArchieve = async (studentId) => {
  try{
    return new Promise((myResolve, myReject) => {
      Modelclass.findAllByCol("studentid", studentId).then((value) => 
      {
        return myResolve(value);
      })
      .catch((error) => {
        console.log("Error: ", error);
        return myReject("error");
      });
    }); 
  } catch(err) {
      return "error";
  }
}

// @route   GET api/student
// @desc    Get all studentsitcompanyarchieve
// @access  Private
router.get('/', async (req, res, next) => {
  
    await Modelclass.get_all().then((value) => 
    {
      return res.json(value);
    })
    .catch((error) => {
      return res.json(error);
    });

});

// @route   GET api/student
// @desc    Get all studentsitcompanyarchieve by var and val
// @access  Private
router.get('/:var/:val', async (req, res, next) => {
  await Modelclass.findAllByCol(req.params.var, req.params.val).then((value) => 
  {
    return res.json(value);
  })
  .catch((error) => {
    console.log(error);
    return res.json(error);
  });

});



// @route   POST api/student
// @desc    Add studentsitcompanyarchieve
// @access  Private
router.post('/',upload.single('photo'), async (req, res, next) => {

    //Check if sit exist
    const archieve = await getStudentArchieve(req.body.studentid);
    if(archieve === "error") return res.status(400).json("Server error.");

    if(archieve){
      const myarch = archieve.find((arc) => {return arc.sitid === Number(req.body.sitid)});
      if(myarch) return res.status(400).json("SIT already exists.");
    }

    data = {studentid: req.body.studentid, companyid: req.body.companyid,sitid: req.body.sitid,created: new Date()}

    await Modelclass.create(data).then((val) => {
      return res.json(val);
    }).catch((err) => {
      console.log(error);
      return res.json(err);
    });
});

// @route   PUT api/student
// @desc    Update studentsitcompanyarchieve
// @access  Private
router.put('/:id',upload.single('photo'), async (req, res, next) => {

  data = {studentid: req.body.studentid, companyid: req.body.companyid,sitid: req.body.sitid,modified: new Date()}
  await Modelclass.update(req.params.id,data).then((value) => 
  {
    return res.json(value);
  })
  .catch((error) => 
  {
    console.log(error);
    return res.json(error);
  });

});


// @route   DELETE api/student
// @desc    Delete studentsitcompanyarchieve
// @access  Private
router.delete('/:id', async (req, res, next) => {

  await Modelclass.delete(req.params.id).then((value) => 
  {
    return res.json(value);
  })
  .catch((error) => 
  {
    console.log(error);
    return res.json(error);
  });

});


module.exports = router;