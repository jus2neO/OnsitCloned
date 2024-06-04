var express = require('express');
var router = express.Router();
const Modelclass = require('../models/appointmentFile');
const multer  = require('multer');
const upload = multer({ dest: 'uploads/', limits:{fieldSize: 100 * 1024 * 1024} });



/*const fs = require('fs');

const fileUpload = require('express-fileupload');
const uploadOpts = {
    useTempFiles: true,
    tempFileDir: '/tmp/'
}*/

// @route   GET api/appointmentFile
// @desc    Add appointment files
// @access  Private
router.get('/getbyappid/:id', async (req, res, next) => {
    try{
        await Modelclass.findAllByCol("appointmentid", req.params.id).then((value) => 
        {
            return res.json(value);
        })
        .catch((error) => {
            console.log(error);
            return res.json(error);
        });
    } catch(err) {
        console.log("Error: ", err);
        return res.status(400).json({msg: "Cannot complete query."});
    }
});

// @route   POST api/appointmentFile
// @desc    Add appointment files
// @access  Private
router.post('/',upload.single('photo'), async (req, res, next) => {
    try{
        const { id, filename, size, type, file } = req.body;
        const mydata = {appointmentid: id, filename: filename, size: size, type: type,file: file,created: new Date()}

        await Modelclass.create(mydata).then((val) => {
            return res.json(val);
        }).catch((err) => {
            console.log("Error: ", err);
            return res.status(400).json({msg: "Server error"});
        });

    } catch(err) {
        console.log("Error: ", err);
        return res.status(400).json({msg: "Cannot complete query."});
    }
});

// @route   POST api/appointment/fileupload
// @desc    Add appointment files
// @access  Private
/*router.post('/',fileUpload(uploadOpts), async (req, res, next) => {
    try{
        const { id, filename, size, type, file } = req.body;
        

        const mydata = {appointmentid: id, filename: filename, size: size, type: type,file: file,created: new Date()}

        await Modelclass.create(mydata).then((val) => {
            res.json(val);
        }).catch((err) => {
            console.log("Error: ", err);
            res.status(400).json({msg: "Server error"});
        });

    } catch(err) {
        console.log("Error: ", err);
        return res.status(400).json({msg: "Cannot complete query."});
    }
});*/

// @route   GET api/appointment
// @desc    Delete Appointment
// @access  Private
router.delete('/:id', async (req, res, next) => {
    try{
        await Modelclass.delete(req.params.id).then((value) => 
        {
            return res.json(value);
        })
        .catch((error) => 
        {
            return res.json(error);
        });
    } catch(err){
        console.log("Error: ", err);
        return res.status(400).json({msg: "Cannot complete query."});
    };
  });

module.exports = router;