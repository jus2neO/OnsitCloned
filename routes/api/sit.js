var express = require('express');
var router = express.Router();
const multer  = require('multer')
const upload = multer({ dest: 'uploads/' })
const Modelclass = require('../models/sit.js');
const auth = require('../middleware/auth');

//get all users
router.get('/', async (req, res, next) => {
  
    await Modelclass.get_all().then((value) => 
    {
      return res.json(value);
    })
    .catch((error) => {
      return res.json(error);
    });

});

// @route   GET api/sit
// @desc    Get all SIT
// @access  Private
/*router.get('/', auth, async (req, res, next) => {
  
  await Modelclass.get_all().then((value) => 
  {
    return res.json(value);
  })
  .catch((error) => {
    return res.json(error);
  });

});*/

//get user
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

//insert user
router.post('/',upload.single('photo'), async (req, res, next) => {
    data = {label: req.body.label, description: req.body.description,created: new Date(), enabled: true}

    await Modelclass.create(data).then((val) => {
      return res.json(val);
    }).catch((err) => {
      console.log(error);
      return res.json(err);
    });
});

//update user
router.put('/:id',upload.single('photo'), async (req, res, next) => {

  data = {label: req.body.label, description: req.body.description,modified: new Date(), enabled: req.body.enabled}
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


//delete user
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