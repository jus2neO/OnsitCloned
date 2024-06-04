import { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import 'react-big-calendar/lib/addons/dragAndDrop/styles.css';
import 'react-calendar/dist/Calendar.css';
import "react-big-calendar/lib/css/react-big-calendar.css";

import './components/common/Navigation';
import './App.scss';
import Navigation from "./components/common/Navigation";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Dashboard from "./components/dashboard/Dashboard";
import Appointments from "./components/appointments/Appointments";
import ActivityOverview from "./components/activityoverview/activityoverview";
import RequirementsCompanies from "./components/requirementscompanies/Requirementscompanies";
import StaffAccounts from "./components/staffaccounts/Staffaccounts";
import AboutUs from "./components/aboutus/aboutus";
import Login from "./components/login/Login";
import Logout from "./components/common/Logout";
import NoPage from "./components/common/nopage";
import Studentportal from "./components/studentportal/Studentportal";
import Request from './components/request/Request';
import SIT from "./components/sit/SITComponent";
import Course from "./components/course/Course";
import Company from "./components/company/Company";
import StudentProfile from "./components/studentprofile/StudentProfile";
import PrintCompany from "./components/company/print/Print";
import PrintCourse from "./components/course/print/Print";
import Approval from "./components/course/Approval";
import Settings from "./components/settings/Settings";
import BookletViewer from "./components/course/print/BookletViewer";
import DTR from "./components/dtr/DTR";
import { getStaffById } from "./components/services/staffServices";
import { IStaff } from "./components/services/type.interface";

function App() {
  const [isLogin, setIsLogin] = useState<boolean>(false);
  const [currentStaff, setCurrentStaff] = useState<IStaff>();
  const token = "";

  const onRedirect = () => {
    const currentStaff = localStorage.getItem("currentStaff");
    if (currentStaff) setCurrentStaff(JSON.parse(currentStaff));
    setIsLogin(true);
  }

  const onGetStaff = async (id: number) => {
    await getStaffById(token, id).then((res: any) => {
      const newUser = res[0];
      
      localStorage.setItem("currentStaff", JSON.stringify(newUser));
    }).catch((err) => {
      console.log("Error: ", err);
    });
  }

  useEffect(() => {
    const currentStaff = localStorage.getItem("currentStaff");
    if (currentStaff) {
      const myStaff = JSON.parse(currentStaff);
      onGetStaff(myStaff.id);
      setCurrentStaff(JSON.parse(currentStaff));
      setIsLogin(true);
    }
  }, []);

  return (
    <div className="Main">
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login onRedirect={onRedirect} />} />
          <Route path="/" element={<Navigation />}>
            <Route index element={<Dashboard />} />
            <Route path="appointments" element={<Appointments />} />
            <Route path="requirementscompanies" element={<RequirementsCompanies />} />
            <Route path="staffaccounts" element={<StaffAccounts staff={currentStaff} />} />
            <Route path="activityoverview" element={<ActivityOverview />} />
            <Route path="studentportal" element={<Studentportal staff={currentStaff} />} />
            <Route path="sitconfiguration" element={<SIT staff={currentStaff} />} />
            <Route path="aboutus" element={<AboutUs />} />
            <Route path="request" element={<Request />} />
            <Route path="courseportal" element={<Course staff={currentStaff} />} />
            <Route path="company" element={<Company staff={currentStaff} />} />
            <Route path="studentprofile" element={<StudentProfile staff={currentStaff} />} />
            <Route path="pendingcompanyapproval" element={<Approval />} />
            <Route path="dtr" element={<DTR /> } />
            <Route path="Settings" element={<Settings/>} />
            <Route path="logout" element={<Logout />} />
            <Route path="*" element={<NoPage />} />
          </Route>
          <Route path="bookletviewer" element={<BookletViewer />} />
          <Route path="printcompany" element={<PrintCompany />} />
          <Route path="printcourse" element={<PrintCourse />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
