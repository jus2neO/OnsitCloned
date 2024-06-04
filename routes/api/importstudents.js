var express = require('express');
var router = express.Router();
const multer  = require('multer')
const upload = multer({ dest: 'uploads/' })
const Modelclass = require('../models/students.js');

const XLSX = require('xlsx');
const fs = require('fs');

const fileUpload = require('express-fileupload');
const uploadOpts = {
    useTempFiles: true,
    tempFileDir: '/tmp/'
}

// @route   POST api/import-student
// @desc    Import students excel route
// @access  Private
router.post('/',fileUpload(uploadOpts), async (req, res, next) => {
    try{
        const { excel } = req.files;
        if(excel.mimetype !== 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'){
            fs.unlinkSync(excel.tempFilePath);
            return res.status(400).json({msg: 'File is invalid.'});
        } 
        const workbook = XLSX.readFile(excel.tempFilePath);
        const sheetName = workbook.SheetNames[0];
        const data = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName]);

        let successData = [];
        let failureData = [];

        for(let i = 0; i < data.length; i++){
            const {ID, FirstName, LastName, MiddleName, EmailAddress, ContactNo, Address} = data[i];

            const mydata = {id: ID, fname: FirstName,lname: LastName,mname: MiddleName,email: EmailAddress,address: Address,contact: ContactNo,status: "pending", isInit: 1, created: new Date()}

            await Modelclass.create(mydata).then((val) => {
                successData.push(mydata);
            }).catch((err) => {
                failureData.push(data[i]);
            });
        }
        fs.unlinkSync(excel.tempFilePath);
        return res.json({msg: 'OK', data: {successData, failureData}});
    } catch(err) {
        return res.status(400).json({msg: "Cannot complete query."});
    }
});

module.exports = router;