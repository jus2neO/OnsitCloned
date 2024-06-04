var express = require('express');
var router = express.Router();
const multer = require('multer');
const upload = multer({ dest: 'uploads/' });
const Modelclass = require('../models/students.js');
const SecretModelClass = require('../models/secret.js');
const CourseModelClass = require('../models/course.js');
const YearSectionClass = require('../models/yearsection.js');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

//get secrets
const getAllSecret = async () => {
  try {
    return new Promise((myResolve, myReject) => {
      SecretModelClass.get_all().then((value) => {
        return myResolve(value);
      })
        .catch((error) => {
          return myReject(error);
        });
    });
  } catch (err) {
    return err;
  }
}

function makeid(length) {
  let result = '';
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  const charactersLength = characters.length;
  let counter = 0;
  while (counter < length) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
    counter += 1;
  }
  return result;
}

//get course
const getCourse = async (id) => {
  try {
    return new Promise((myResolve, myReject) => {
      CourseModelClass.find(id).then((value) => {
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

//get year section
const getYearSection = async (id) => {
  try {
    return new Promise((myResolve, myReject) => {
      YearSectionClass.find(id).then((value) => {
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

//get students
const getStudents = async () => {
  try {
    return new Promise((myResolve, myReject) => {
      Modelclass.findAllStudent().then((value) => {
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

// @route   GET api/student
// @desc    Get all students with course and year section
// @access  Public
router.get('/withcoursesection', async (req, res, next) => {

  const students = await getStudents();
  let newStudents = [];
  if (students !== "error") {
    for (let i = 0; i < students.length; i++) {
      const course = await getCourse(students[i].course);
      const yearsection = await getYearSection(students[i].yearsection);
      newStudents.push({
        ...students[i],
        mycourse: course !== "error" ? course : null,
        myyearsection: yearsection !== "error" ? yearsection : null
      })
    }
    return res.json(newStudents);
  } else {
    return res.status(400).json("Server error");
  }
});

// @route   GET api/student
// @desc    Get all students
// @access  Public
router.get('/', async (req, res, next) => {

  await Modelclass.findAllStudent().then((value) => {
    return res.json(value);
  })
    .catch((error) => {
      return res.status(400).json(error);
    });

});

// @route   GET api/student
// @desc    Change password
// @access  Public
router.get('/:id/changepassword', async (req, res, next) => {
  const mysecret = await getAllSecret().then((res) => {
    return res[0].secret;
  }).catch((err) => { return "error" });

  if (mysecret === "error") {
    return res.status(400).json("Server error");
  }

  const generatedPassword = makeid(8);
  const salt = await bcrypt.genSalt(10);
  const newPassword = await bcrypt.hash(generatedPassword, salt);

  data = { password: newPassword, status: "changepassword" }

  await Modelclass.update(req.params.id, data).then((value) => {
    const newValue = value;
    newValue.password = generatedPassword;
    return res.json(value);
  })
    .catch((error) => {
      console.log("error: ", error);
      return res.status(400).json(error);
    });

  /*const payload = {
    user: {
      id: req.params.id
    }
  }

  jwt.sign(payload,
    mysecret,
    { expiresIn: 360000 },
    (err, token) => {
      if(err) throw err;
      return res.json({token});
    });*/
});

// @route   GET api/student
// @desc    Get student by id
// @access  Private
router.get('/:id', async (req, res, next) => {

  await Modelclass.findStudentById(req.params.id).then((value) => {
    return res.json(value);
  })
    .catch((error) => {
      console.log(error);
      return res.status(400).json(error);
    });

});

// @route   GET api/student
// @desc    Get student by id
// @access  Private
router.get('/photo/:id', async (req, res, next) => {

  await Modelclass.findStudentPhotoById(req.params.id).then((value) => {
    return res.json(value);
  })
    .catch((error) => {
      console.log(error);
      return res.status(400).json(error);
    });

});

// @route   POST api/student
// @desc    Add student
// @access  Private
router.post('/', upload.single('photo'), async (req, res, next) => {
  data = { id: req.body.id, fname: req.body.fname, lname: req.body.lname, mname: req.body.mname, email: req.body.email, address: req.body.address, contact: req.body.contact, password: req.body.password, status: req.body.status, isInit: 1 }

  await Modelclass.create(data).then((val) => {
    const myres = val;
    delete myres.password;
    return res.json(myres);
  }).catch((err) => {
    console.log(error);
    return res.status(400).json(err);
  });
});

// @route   PUT api/student
// @desc    Update student
// @access  Private
router.put('/uploadimage/:id', upload.single('photo'), async (req, res, next) => {
  data = {
    studentphoto: req.body.studentphoto,
    modified: new Date()
  }
  await Modelclass.update(req.params.id, data).then((value) => {
    const myres = value;
    delete myres.password;
    return res.json(myres);
  })
    .catch((error) => {
      console.log(error);
      return res.status(400).json(error);
    });

});

// @route   PUT api/student
// @desc    Update student
// @access  Private
router.put('/:id', upload.single('photo'), async (req, res, next) => {
  const myCompStatDate = req.body.companystatusdate === "newdate" ? new Date() : req.body.companystatusdate;
  data = {
    email: req.body.email,
    address: req.body.address,
    contact: req.body.contact,
    isInit: req.body.isInit,
    civilstatus: req.body.civilstatus,
    birthdate: req.body.birthdate,
    age: req.body.age,
    sex: req.body.sex,
    height: req.body.height,
    weight: req.body.weight,
    collegedepartment: req.body.collegedepartment,
    course: req.body.course,
    companyid: req.body.companyid,
    CompanyStatus: req.body.CompanyStatus,
    companystatusdate: myCompStatDate,
    SIT: req.body.SIT,
    yearsection: req.body.yearsection,
    fathersname: req.body.fathersname,
    fathersaddress: req.body.fathersaddress,
    fatherscontact: req.body.fatherscontact,
    mothersname: req.body.mothersname,
    mothersaddress: req.body.mothersaddress,
    motherscontact: req.body.motherscontact,
    modified: new Date()
  }
  await Modelclass.update(req.params.id, data).then((value) => {
    const myres = value;
    delete myres.password;
    return res.json(myres);
  })
    .catch((error) => {
      console.log(error);
      return res.status(400).json(error);
    });

});


// @route   DELETE api/student
// @desc    Delete student
// @access  Private
router.delete('/:id', async (req, res, next) => {

  await Modelclass.delete(req.params.id).then((value) => {
    return res.json(value);
  })
    .catch((error) => {
      console.log(error);
      return res.status(400).json(error);
    });

});


module.exports = router;