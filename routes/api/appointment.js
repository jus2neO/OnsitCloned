const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const {check, validationResult} = require('express-validator/');
const Modelclass = require('../models/appointment');
const ModelFileClass = require('../models/appointmentFile');
const ModelStudentClass = require('../models/students');
const ModelSITClass = require('../models/sit');
const multer  = require('multer');
const upload = multer({ dest: 'uploads/' });
const db = require('../../db/db_connection.js');

// @route   GET api/appointment
// @desc    Get all Appointment
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

// @route   GET api/appointment
// @desc    Get all Appointment
// @access  Private
router.get('/getallappointmentbydate/:var/:id', async (req, res, next) => {
  const newVar = "%"+req.params.id+"%";
  await Modelclass.findAllLikeStr(req.params.var,newVar).then((value) => 
  {
    return res.json(value);
  })
  .catch((error) => {
    return res.json(error);
  });

});

// @route   GET api/appointment
// @desc    Get all Appointment with files and user
// @access  Private
router.get('/withfileswithstudent', async (req, res, next) => {
  try{
    const appointments = await Modelclass.get_all().then((value) => 
    {
      return value
    })
    .catch((error) => {
      return "error";
    });

    if(appointments === "error") res.status(400).json({msg: "Server error"});

    let newFiles = [];

    for(let i = 0; i < appointments.length; i++){
      const appointmentsFiles = await ModelFileClass.findAllByCol("appointmentid", appointments[i].id).then((value) => 
      {
          return value;
      })
      .catch((error) => {
          return "error";
      });

      const student = await ModelStudentClass.findStudentById(appointments[i].studentid).then((value) => 
      {
          return value;
      })
      .catch((error) => {
          return "error";
      });

      const sit = await ModelSITClass.find(appointments[i].sitlevel).then((val) => {
        return val;
      }).catch((err) => {
        return "error";
      });
      
      if(appointmentsFiles !== "error" && student !== "error" && sit !== "error"){
        newFiles.push({
          ...appointments[i],
          appointmentsFiles,
          student,
          sit: sit
        });
      }
    }

    return res.json(newFiles);
  } catch(err) {
    return res.status(400).json({msg: "Server error"});
  }
});

// @route   GET api/appointment
// @desc    Get all Appointment with files and user by student ID
// @access  Private
router.get('/withfileswithstudentbystudentid/:id', async (req, res, next) => {
  try{
    const appointments = await Modelclass.findByStudentID(req.params.id).then((value) => 
    {
      return value
    })
    .catch((error) => {
      return "error";
    });

    if(appointments === "error") res.status(400).json({msg: "Server error"});

    let newFiles = [];

    for(let i = 0; i < appointments.length; i++){
      const appointmentsFiles = await ModelFileClass.findAllByCol("appointmentid", appointments[i].id).then((value) => 
      {
          return value;
      })
      .catch((error) => {
          return "error";
      });

      const student = await ModelStudentClass.findStudentById(appointments[i].studentid).then((value) => 
      {
          return value;
      })
      .catch((error) => {
          return "error";
      });

      const sit = await ModelSITClass.find(appointments[i].sitlevel).then((val) => {
        return val;
      }).catch((err) => {
        return "error";
      });
      
      if(appointmentsFiles !== "error" && student !== "error" && sit !== "error"){
        newFiles.push({
          ...appointments[i],
          appointmentsFiles,
          student,
          sit: sit
        });
      }
    }

    return res.json(newFiles);
  } catch(err) {
    return res.status(400).json({msg: "Server error"});
  }
});

// @route   GET api/appointment
// @desc    Get all Appointment with files and user by student ID
// @access  Private
router.get('/activeappointment/:id', async (req, res, next) => {
    const appointments = await Modelclass.findAppointmentStatus(req.params.id).then((value) => 
    {
      return value
    })
    .catch((error) => {
      return "error";
    });

    if(appointments === "error") return res.status(400).json({msg: "Server error"});

    return res.json(appointments);
});

// @route   GET api/sit
// @desc    Get all SIT
// @access  Private
/*router.get('/', auth, async (req, res, next) => {
  
  await Modelclass.get_all().then((value) => 
  {
    res.json(value);
  })
  .catch((error) => {
    res.json(error);
  });

});*/

// @route   GET api/appointment
// @desc    Get Appointment by id
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

// @route   GET api/appointment
// @desc    Add appointment
// @access  Private
router.post('/',upload.single('photo'), async (req, res, next) => {
    data = {studentid: req.body.studentid, start: req.body.start, end: req.body.end, sitlevel: req.body.sitlevel,created: new Date(), status: "pending"}
    await Modelclass.create(data).then((val) => {
      return res.json(val);
    }).catch((err) => {
      console.log(error);
      return res.json(err);
    });
});

// @route   GET api/appointment
// @desc    Update Appointment
// @access  Private
router.put('/:id',upload.single('photo'), async (req, res, next) => {

  data = {start: req.body.start, end: req.body.end, sitlevel: req.body.sitlevel, status: req.body.status, modified: new Date()}
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

// @route   GET api/appointment
// @desc    Update Appointment
// @access  Private
router.put('/status/:id',upload.single('photo'), async (req, res, next) => {

  data = {start: req.body.start, end: req.body.end, status: req.body.status, note: req.body.note, modified: new Date()}
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


// @route   GET api/appointment
// @desc    Delete Appointment
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