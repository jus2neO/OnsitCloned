export const MyEndPoints = {
    Authentication: {
      token: "/api/auth",
      login: "/api/auth/staff/login"
    },
    Students: {
      Students: "/api/students",
      ExcelStudents: "/api/students/import-excel",
      Archieve: "/api/studentsitcompanyarchieve",
      StudentsWithCourseYearSection: "/api/students/withcoursesection",
      StudentUploadPhoto: "/api/students/uploadimage",
    },
    Staff: {
        Staff: "/api/staff",
        ExcelStaff: "/api/staff/import-excel",
    },
    SIT: {
      SIT: "/api/sit",
      SITRequirement: "/api/sitrequirements",
      sitgradefiles: "/api/sitgradefiles"
    },
    Appointment: {
      Appointment: "/api/appointment",
      AppointmentStatus: "/api/appointment/status",
      AppointmentFile: "/api/fileupload",
      AppointmentByAppID: "/api/fileupload/getbyappid",
      AppointmentsWithFilesAndStudent: "/api/appointment/withfileswithstudent",
      Getallappointmentbydate: "/api/appointment/getallappointmentbydate"
    },
    Course: {
      Course: "/api/course",
      YearSection: "/api/yearsection"
    },
    Company: {
      Company: "/api/company",
      StudentsNumber: "/api/company/companystudents",
      RemoveCompanyFromStudent: "/api/company/removecompanyfromstudents"
    },
    CompanyPreferredCourse: {
      CompanyPref: "/api/companycourseprefer",
      CompanyPrefDelVar: "/api/companycourseprefer/deletebyvar"
    },
    DTR: {
      dtr: "/api/dtr",
      dtrByDate: "/api/dtr/getallDTRbydate"
    },
    Notification: {
      notification: "/api/notification"
    },
    Role: {
      Role: "/api/role"
    },
    Settings: {
      Settings: "/api/settings"
    }
  };