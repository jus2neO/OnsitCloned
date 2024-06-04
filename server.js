var express = require('express');
var cors = require('cors');
var bodyParser = require('body-parser');
const fileUpload = require('express-fileupload');

var app = express();

var allowlist = ['http://localhost:3000', 'http://localhost:4000']
var corsOptionsDelegate = function (req, callback) {
  var corsOptions;
  if (allowlist.indexOf(req.header('Origin')) !== -1) {
    corsOptions = { origin: true } // reflect (enable) the requested origin in the CORS response
  } else {
    corsOptions = { origin: false } // disable CORS for this request
  }
  callback(null, corsOptions) // callback expects two parameters: error and options
}

app.use(cors(corsOptionsDelegate));
//app.use(bodyParser.urlencoded({ extended: true }));
//app.use(bodyParser.json('application/json'));

//app.use(bodyParser.json({limit: '50mb'}));
//app.use(bodyParser.urlencoded({limit: '50mb', extended: true}));
//app.use(express.json({ limit: '100mb' }));

app.use(bodyParser.urlencoded({
    parameterLimit: 100000,
    limit: '50mb',
    extended: true
  }));
app.use(bodyParser.json({limit: '50mb'}));

// Define Routes
app.use('/api/students/import-excel', require('./routes/api/importstudents'));
app.use('/api/staff/import-excel', require('./routes/api/importstaff'));
app.use('/api/students', require('./routes/api/students'));
app.use('/api/studentsitcompanyarchieve', require('./routes/api/studentsitcompanyarchieve'));
app.use('/api/auth', require('./routes/api/auth'));
app.use('/api/staff', require('./routes/api/staff'));
app.use('/api/sit', require('./routes/api/sit'));
app.use('/api/sitrequirements', require('./routes/api/sitrequirements'));
app.use('/api/appointment', require('./routes/api/appointment'));
app.use('/api/fileupload', require('./routes/api/AppointmentFile'));
app.use('/api/course', require('./routes/api/course'));
app.use('/api/yearsection', require('./routes/api/yearsection'));
app.use('/api/company', require('./routes/api/company'));
app.use('/api/companycourseprefer', require('./routes/api/companycourseprefer'));
app.use('/api/role', require('./routes/api/role'));
app.use('/api/sitgradefiles', require('./routes/api/sitgradefile'));
app.use('/api/settings', require('./routes/api/settings'));
app.use('/api/dtr', require('./routes/api/dtr'));
app.use('/api/notification', require('./routes/api/notification'));

app.listen(8081, () => {
    console.log("Listening...");
});