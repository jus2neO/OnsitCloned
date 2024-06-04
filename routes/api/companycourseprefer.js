var express = require('express');
var router = express.Router();
const multer  = require('multer')
const upload = multer({ dest: 'uploads/' })
const Modelclass = require('../models/companycourseprefer.js');
const auth = require('../middleware/auth');

// @route   GET api/Company preferred course
// @desc    Get all Company preferred course
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

// @route   GET api/Company preferred course
// @desc    Get Company preferred course by ID
// @access  Private
router.get('/:id', async (req, res, next) => {
  
  await Modelclass.find(req.params.id).then((value) => 
  {
    return res.json(value);
  })
  .catch((error) => {
    console.log(error);
    return res.json(error);
  });

});

// @route   POST api/Company preferred course
// @desc    Add Company preferred course
// @access  Private
router.post('/',upload.single('photo'), async (req, res, next) => {
    data = {companyid: req.body.companyid, courseid: req.body.courseid,created: new Date()}

    await Modelclass.create(data).then((val) => {
      return res.json(val);
    }).catch((err) => {
      console.log(error);
      return res.json(err);
    });
});

// @route   PUT api/Company preferred course
// @desc    Update Company preferred course
// @access  Private
router.put('/:id',upload.single('photo'), async (req, res, next) => {

  data = {companyid: req.body.companyid, courseid: req.body.courseid,modified: new Date()}
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


// @route   DELETE api/Company preferred course
// @desc    Delete Company preferred course
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

// @route   DELETE api/course
// @desc    Delete Course
// @access  Private
router.delete('/deletebyvar/:var/:id', async (req, res, next) => {

  await Modelclass.deleteByVar(req.params.var, req.params.id).then((value) => 
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