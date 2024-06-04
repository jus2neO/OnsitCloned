import { useState, useEffect } from "react";
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import 'react-big-calendar/lib/addons/dragAndDrop/styles.css';
import 'react-calendar/dist/Calendar.css';
import "react-big-calendar/lib/css/react-big-calendar.css";
import './App.scss';

import Navigation from "./component/common/Navigation";
import Requirements from './component/Requirements/Requirements';
import Companies from './component/companies/Companies';
import Logout from "./component/common/Logout";
import NoPage from "./component/common/NoPage";
import Homepage from "./component/Homepage/Homepage";
import BookAppointment from './component/bookappointment/BookAppointment';
import Profile from "./component/profile/Profile";
import Login from "./component/login/Login";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { IStudent } from "./component/services/type.interface";
import Bookanappointment from "./component/bookappointment/BookAnAppointment";
import Register from "./component/register/Register";

function App() {
  const [isLogin, setIsLogin] = useState<boolean>(false);
  const [currentStudent, setCurrentStudent] = useState<IStudent>();

  const onRedirect = () => {
    const currentStudent = localStorage.getItem("currentStudent");
    if(currentStudent) setCurrentStudent(JSON.parse(currentStudent));
    setIsLogin(true);
  }

  useEffect(() => {
    const currentStudent = localStorage.getItem("currentStudent");
    if(currentStudent) {
      setCurrentStudent(JSON.parse(currentStudent));
      setIsLogin(true);
    }
  }, []);

  return (
    <div className="Main">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Navigation isLogin={isLogin} currentStudent={currentStudent} />}>
            <Route index element={<Homepage />} />
            <Route path="requirements" element={<Requirements />} />
            <Route path="companies" element={<Companies studentId={currentStudent?.id} />} />
            <Route path="bookappointment" element={<BookAppointment user={currentStudent} />} />
            <Route path="bookanappointment" element={<Bookanappointment currentStudent={currentStudent} />} />
            <Route path="register" element={<Register />} />
            <Route path="profile" element={<Profile student={currentStudent} />} />
            <Route path="Login" element={<Login onRedirect={onRedirect} />} />
            <Route path="Logout" element={<Logout />} />
            <Route path="register" element={<Register />} />
            <Route path="*" element={<NoPage />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
