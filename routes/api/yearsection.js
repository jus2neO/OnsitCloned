var express = require('express');
var router = express.Router();
const multer  = require('multer')
const upload = multer({ dest: 'uploads/' })
const Modelclass = require('../models/yearsection.js');

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

//get user
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

//insert user
router.post('/',upload.single('photo'), async (req, res, next) => {
    data = {courseid: req.body.courseid, title: req.body.title,created: new Date(), enabled: true}

    await Modelclass.create(data).then((val) => {
      return res.json(val);
    }).catch((err) => {
      console.log(error);
      return res.json(err);
    });
});

//update user
router.put('/:id',upload.single('photo'), async (req, res, next) => {

  data = {title: req.body.title,modified: new Date(), enabled: req.body.enabled}
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