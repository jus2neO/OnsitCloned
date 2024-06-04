export const MyEndPoints = {
    Authentication: {
      login: "/api/auth/login"
    },
    Students: {
        Students: "/api/students",
        StudentUploadPhoto: "/api/students/uploadimage",
        StudentPhoto: "/api/students/photo",
        ExcelStudents: "/api/students/import-excel",
        Archieve: "/api/studentsitcompanyarchieve"
    },
    Staff: {
        Staff: "/api/staff"
    },
    SIT: {
      SIT: "/api/sit",
      SITRequirement: "/api/sitrequirements"
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
    Appointment: {
      Appointment: "/api/appointment",
      AppointmentFile: "/api/fileupload",
      AppointmentWithFilesFindByID: "/api/appointment/withfileswithstudentbystudentid",
      AppointmentActive: "/api/appointment/activeAppointment",
      Getallappointmentbydate: "/api/appointment/getallappointmentbydate"
    },
    Notification: {
      notification: "/api/notification",
      notificationByStudentId: "/api/notification/getbystudentid",
      setnotificationByStudentId: "/api/notification/setreadnotification"
    },
    Settings: {
      Settings: "/api/settings"
    }
  };