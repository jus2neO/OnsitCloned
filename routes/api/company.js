var express = require('express');
var router = express.Router();
const multer = require('multer')
const upload = multer({ dest: 'uploads/' })
const Modelclass = require('../models/company.js');
const StudentModelClass = require('../models/students.js');
const CourseModelClass = require('../models/course.js');
const YearSectionClass = require('../models/yearsection.js');
const auth = require('../middleware/auth');

//get course
const getCourse = async (id) => {
  try{
    return new Promise((myResolve, myReject) => {
      CourseModelClass.find(id).then((value) => 
      {
        return myResolve(value);
      })
      .catch((error) => {
        return myReject("error");
      });
    }); 
  } catch(err) {
      return "error";
  }
}

//get year section
const getYearSection = async (id) => {
  try{
    return new Promise((myResolve, myReject) => {
      YearSectionClass.find(id).then((value) => 
      {
        return myResolve(value);
      })
      .catch((error) => {
        return myReject("error");
      });
    }); 
  } catch(err) {
      return "error";
  }
}

//get number of students by company id
const getStudentsByCompanyId = async (id) => {
  try {
    return new Promise((myResolve, myReject) => {
      StudentModelClass.fetchStudentsByCompanyStatAndVar("companyid", id).then((value) => {
        return myResolve(value);
      })
        .catch((error) => {
          return myReject("error");
        });
    });
  } catch (err) {
    return "error";
  }
}

// @route   GET api/Company
// @desc    Get all Company
// @access  Private
router.get('/', async (req, res, next) => {

  await Modelclass.get_all().then((value) => {
    return res.json(value);
  })
    .catch((error) => {
      return res.json(error);
    });

});

// @route   GET api/Company
// @desc    Get Company by ID
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

// @route   POST api/Company
// @desc    Post all Company
// @access  Private
router.post('/companystudents', async (req, res, next) => {
  let newList = {};
  try {
    const { companyIDs } = req.body;

    for (let i = 0; i < companyIDs.length; i++) {
      const mystudent = await getStudentsByCompanyId(companyIDs[i]);

      let newStudent = [];

      if(mystudent && mystudent !== "error"){
        
        for(let o = 0; o < mystudent.length; o++){
          let newCourse;
          let newYearSection;
          const mycourse = await getCourse(mystudent[o]?.course);
          const myyearsection = await getYearSection(mystudent[o]?.yearsection);

          if(mycourse && mycourse !== "error"){
            newCourse = mycourse;
          }
          if(myyearsection && myyearsection !== "error"){
            newYearSection = myyearsection;
          }

          newStudent.push({
            ...mystudent[o],
            mycourse: newCourse,
            myyearsection: newYearSection
          });
        }
      }

      if(mystudent !== "error"){
        newList = {
          ...newList,
          [companyIDs[i]]: newStudent
        };
      }
    }

    return res.json(newList);
  } catch (err) {
    console.log("Error: ", err);
    return res.status(400).json({ msg: "Server error" });
  }

  /*await Modelclass.get_all().then((value) => 
  {
    return res.json(value);
  })
  .catch((error) => {
    return res.json(error);
  });*/

});

// @route   POST api/Company
// @desc    Add Company
// @access  Private
router.post('/', upload.single('photo'), async (req, res, next) => {
  data = { name: req.body.name, description: req.body.description, slot: req.body.slot, iconname: req.body.iconname, size: req.body.size, filetype: req.body.filetype, expiration: req.body.expiration, icon: req.body.icon, created: new Date(), enabled: true }
  await Modelclass.create(data).then((val) => {
    return res.json(val);
  }).catch((err) => {
    console.log(error);
    return res.json(err);
  });
});

// @route   PUT api/Company
// @desc    Update Company
// @access  Private
router.put('/:id', upload.single('photo'), async (req, res, next) => {
  data = { name: req.body.name, description: req.body.description, slot: req.body.slot, iconname: req.body.iconname, size: req.body.size, expiration: req.body.expiration, filetype: req.body.filetype, icon: req.body.icon, enabled: req.body.enabled, modified: new Date(), enabled: req.body.enabled }
  await Modelclass.update(req.params.id, data).then((value) => {
    return res.json(value);
  })
    .catch((error) => {
      console.log(error);
      return res.json(error);
    });

});

// @route   PUT api/students
// @desc    Update Students and remove company on them
// @access  Private
router.put('/removecompanyfromstudents/:id', upload.single('photo'), async (req, res, next) => {
  data = { CompanyStatus: req.body.CompanyStatus, companyid: req.body.companyid };
  await StudentModelClass.updateByVar(data.CompanyStatus, data.companyid, {CompanyStatus:null,companyid:null, modified: new Date()}).then((value) => {
    return res.json(value);
  })
    .catch((error) => {
      console.log("Error here: ", error);
      return res.json(error);
    });

});

// @route   DELETE api/Company
// @desc    Delete Company
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