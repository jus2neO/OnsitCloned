var express = require('express');
var router = express.Router();
const multer = require('multer')
const upload = multer({ dest: 'uploads/' })
const Modelclass = require('../models/dtr');
const auth = require('../middleware/auth');

// @route   GET api/course
// @desc    Get all Course
// @access  Private
router.get('/', async (req, res, next) => {

  await Modelclass.get_all().then((value) => {
    return res.json(value);
  })
    .catch((error) => {
      return res.json(error);
    });

});

// @route   GET api/course
// @desc    Get Course by ID
// @access  Private
router.get('/:id', async (req, res, next) => {

  await Modelclass.find(req.params.id).then((value) => {
    return res.json(value);
  })
    .catch((error) => {
      console.log(error);
      return res.json(error);
    });

});

// @route   POST api/course
// @desc    Add Course
// @access  Private
router.post('/', upload.single('photo'), async (req, res, next) => {
  data = { start: req.body.start, end: req.body.end, description: req.body.description, studentid: req.body.studentid, appoinrmentid: req.body.appoinrmentid, sitid: req.body.sitid, created: new Date() }

  await Modelclass.create(data).then((val) => {
    return res.json(val);
  }).catch((err) => {
    console.log(error);
    return res.json(err);
  });
});

// @route   GET api/DTR
// @desc    Get all DTR
// @access  Private
router.get('/getallDTRbydate/:var/:id', async (req, res, next) => {
  const newVar = req.params.id;
  await Modelclass.findAllByCol(req.params.var, newVar).then((value) => {
    return res.json(value);
  })
    .catch((error) => {
      return res.json(error);
    });

});

// @route   PUT api/course
// @desc    Update Course
// @access  Private
router.put('/:id', upload.single('photo'), async (req, res, next) => {

  data = { start: req.body.start, end: req.body.end, description: req.body.description, studentid: req.body.studentid, appoinrmentid: req.body.appoinrmentid, sitid: req.body.sitid, modified: new Date() }
  await Modelclass.update(req.params.id, data).then((value) => {
    return res.json(value);
  })
    .catch((error) => {
      console.log(error);
      return res.json(error);
    });

});


// @route   DELETE api/course
// @desc    Delete Course
// @access  Private
router.delete('/:id', async (req, res, next) => {

  await Modelclass.delete(req.params.id).then((value) => {
    return res.json(value);
  })
    .catch((error) => {
      console.log(error);
      return res.json(error);
    });

});


module.exports = router;