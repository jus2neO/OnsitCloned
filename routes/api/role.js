var express = require('express');
var router = express.Router();
const Modelclass = require('../models/role');
const auth = require('../middleware/auth');

// @route   GET api/role
// @desc    Get role
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

// @route   GET api/role
// @desc    Get role by id
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

// @route   POST api/role
// @desc    Add role
// @access  Private
router.post('/', async (req, res, next) => {
    data = {label: req.body.label, description: req.body.description,level: req.body.level,created: new Date(), enabled: true}

    await Modelclass.create(data).then((val) => {
      return res.json(val);
    }).catch((err) => {
      console.log(error);
      return res.json(err);
    });
});

// @route   POST api/role
// @desc    Modify role
// @access  Private
router.put('/:id', async (req, res, next) => {

  data = {label: req.body.label, description: req.body.description,level: req.body.level,modified: new Date(), enabled: req.body.enabled}
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


// @route   DELETE api/role
// @desc    Delete role
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