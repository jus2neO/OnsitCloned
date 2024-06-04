var express = require('express');
var router = express.Router();
const multer  = require('multer')
const upload = multer({ dest: 'uploads/' })
const Modelclass = require('../models/course.js');
const auth = require('../middleware/auth');

// @route   GET api/course
// @desc    Get all Course
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

// @route   GET api/course
// @desc    Get Course by ID
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

// @route   POST api/course
// @desc    Add Course
// @access  Private
router.post('/',upload.single('photo'), async (req, res, next) => {
    data = {title: req.body.title, description: req.body.description,created: new Date(), enabled: true}

    await Modelclass.create(data).then((val) => {
      return res.json(val);
    }).catch((err) => {
      console.log(error);
      return res.json(err);
    });
});

// @route   PUT api/course
// @desc    Update Course
// @access  Private
router.put('/:id',upload.single('photo'), async (req, res, next) => {

  data = {title: req.body.title, description: req.body.description,modified: new Date(), enabled: req.body.enabled}
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


// @route   DELETE api/course
// @desc    Delete Course
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