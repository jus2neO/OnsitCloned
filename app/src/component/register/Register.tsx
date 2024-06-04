import { useEffect, useState, useMemo, useCallback } from 'react';
import { updateProfile } from "../services/studentServices";
import { getAllCourse, getAllYearSection, } from "../services/courseServices";
import Button from 'react-bootstrap/Button';
import { ICurrentStudent, ICourse, IYearSection } from "../services/type.interface";
import { CalculateAge } from "../services/mutation/age";
import "./register.scss";

const Register = () => {
  const [currentStudent, setCurrentStudent] = useState<ICurrentStudent>();
  const [courses, setCourses] = useState<ICourse[]>([]);
  const [yearSections, setYearSections] = useState<IYearSection[]>([]);
  const [currentYearSect, setcurrentYearSect] = useState<IYearSection[]>([]);
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [successMessage, setSuccessMessage] = useState<string>("");
  const [formData, setFormData] = useState({
    address: currentStudent?.address,
    age: 0,
    birthdate: "",
    civilstatus: "",
    collegedepartment: "",
    contact: currentStudent?.contact,
    course: 0,
    yearsection: 0,
    email: currentStudent?.email,
    fathersaddress: "",
    fatherscontact: "",
    fathersname: "",
    mothersaddress: "",
    motherscontact: "",
    mothersname: "",
    sex: "",
    status: currentStudent?.status,
    isInit: 0,
    weight: 0,
    fullname: currentStudent?.lname,
    height: 0
  });

  //Validation variables
  const [isAddressError, setisAddressError] = useState<boolean>(false);
  const [isContactError, setisContactError] = useState<boolean>(false);
  const [isCivilStatusError, setisCivilStatusError] = useState<boolean>(false);
  const [isBirthdateError, setisBirthdateError] = useState<boolean>(false);
  const [isAgeError, setisAgeError] = useState<boolean>(false);
  const [isGenderError, setisGenderError] = useState<boolean>(false);
  const [isEmailError, setisEmailError] = useState<boolean>(false);
  const [isHeightError, setisHeightError] = useState<boolean>(false);
  const [isWeightError, setisWeightError] = useState<boolean>(false);
  const [isCollegerError, setisCollegerError] = useState<boolean>(false);
  const [isCourseError, setisCourseError] = useState<boolean>(false);
  const [isYearSectionError, setisYearSectionError] = useState<boolean>(false);
  const [isFatherNameError, setisFatherNameError] = useState<boolean>(false);
  const [isFathersContactError, setisFathersContactError] = useState<boolean>(false);
  const [isFathersAddressError, setisFathersAddressError] = useState<boolean>(false);
  const [isMothersNameError, setisMothersNameError] = useState<boolean>(false);
  const [isMothersContactError, setisMothersContactError] = useState<boolean>(false);
  const [isMothersAddressError, setisMothersAddressError] = useState<boolean>(false);

  const {
    address,
    age,
    birthdate,
    civilstatus,
    collegedepartment,
    contact,
    course,
    yearsection,
    email,
    fathersaddress,
    fatherscontact,
    fathersname,
    mothersaddress,
    motherscontact,
    mothersname,
    sex,
    status,
    isInit,
    weight,
    fullname,
    height } = formData;

  //const token = currentUser?.token;
  const token = "";

  const resetValidation = () => {
    setisAddressError(false);
    setisContactError(false);
    setisCivilStatusError(false);
    setisBirthdateError(false);
    setisAgeError(false);
    setisGenderError(false);
    setisEmailError(false);
    setisHeightError(false);
    setisWeightError(false);
    setisCollegerError(false);
    setisCourseError(false);
    setisYearSectionError(false);
    setisFatherNameError(false);
    setisFathersContactError(false);
    setisFathersAddressError(false);
    setisMothersNameError(false);
    setisMothersContactError(false);
    setisMothersAddressError(false);
  }

  const onClickSubmitProfile = async (e: any) => {
    e.preventDefault();
    resetValidation();
    setErrorMessage("");

    let errorList = "";

    if (!address) {
      setisAddressError(true);
      errorList +=  " *Address is required.";
    }

    if (!contact) {
      setisContactError(true);
      errorList +=  " *Contact is required.";
    }

    if (!civilstatus) {
      setisCivilStatusError(true);
      errorList +=  " *Civil Status is required.";
    }

    if (!birthdate) {
      setisBirthdateError(true);
      errorList +=  " *Birthdate is required.";
    }

    if (!age) {
      setisAgeError(true);
      errorList +=  " *Age is required.";
    }

    if (!sex) {
      setisGenderError(true);
      errorList +=  " *Gender is required.";
    }

    if (!email) {
      setisEmailError(true);
      errorList +=  " *Email address is required.";
    }

    if (!height) {
      setisHeightError(true);
      errorList +=  " *Height is required.";
    }

    if (!weight) {
      setisWeightError(true);
      errorList +=  " *Weight is required.";
    }

    if (!collegedepartment) {
      setisCollegerError(true);
      errorList +=  " *College department is required.";
    }

    if (!course) {
      setisCourseError(true);
      errorList +=  " *Course is required.";
    }

    if (!yearsection) {
      setisYearSectionError(true);
      errorList +=  " *Year and Section is required.";
    }

    if (!fathersname) {
      setisFatherNameError(true);
      errorList +=  " *Father's name is required.";
    }

    if (!fathersaddress) {
      setisFathersAddressError(true);
      errorList +=  " *Father's address is required.";
    }

    if (!fatherscontact) {
      setisFathersContactError(true);
      errorList +=  " *Father's contact is required.";
    }

    if (!mothersname) {
      setisMothersNameError(true);
      errorList +=  " *Mother's name is required.";
    }

    if (!mothersaddress) {
      setisMothersAddressError(true);
      errorList +=  " *Mother's address is required.";
    }

    if (!motherscontact) {
      setisMothersContactError(true);
      errorList +=  " *Mother's contact is required.";
    }

    if(errorList){
      setErrorMessage(errorList);
      return;
    }

    try {
      if (currentStudent) {
        const newStudent = {
          ...formData,
          address: address ? address : currentStudent.address,
          email: email ? email : currentStudent.email,
          contact: contact ? contact : currentStudent.contact
        }
        await updateProfile(token, currentStudent?.id, newStudent).then((res: any) => {
          const newmyStudent = {
            ...formData,
            address: address ? address : currentStudent.address,
            email: email ? email : currentStudent.email,
            contact: contact ? contact : currentStudent.contact,
            fname: currentStudent.fname,
            lname: currentStudent.lname,
            mname: currentStudent.mname,
            id: currentStudent.id
          }
          localStorage.setItem("currentStudent", JSON.stringify(newmyStudent));
          setSuccessMessage("Successfully updated profile, redirecting now.");
          setTimeout(() => {
            window.location.href = "/bookappointment";
          }, 2000);
        }).catch(err => {
          console.log("Error: ", err);
          setErrorMessage("An error occured. Please try again.");
        });
      }
    } catch (err) {
      console.log("Error: ", err);
      setErrorMessage("An error occured. Please try again.");
    }
  }

  const getCourses = async () => {
    await getAllCourse(token).then((res: any) => {
      if (res) {
        setCourses(res);
      }
    }).catch((err) => {
      console.log("Error: ", err);
    });
  }

  const getYearSectionsByCourseID = async () => {
    await getAllYearSection(token).then((res: any) => {
      setYearSections(res);
      const myYearSects = res.filter((sects: any) => { return sects.courseid === courses[0]?.id });
      setcurrentYearSect(myYearSects);
    }).catch((err) => {
      console.log("Error: ", err);
    });
  }

  const onCourseChange = (e: any) => {
    e.preventDefault();
    const courseID = e.target.value;
    const newYearSect = yearSections.filter((ys) => { return ys.courseid.toString() === courseID });
    setcurrentYearSect(newYearSect);
    setFormData({
      ...formData,
      course: Number(courseID),
      yearsection: 0
    });
  }

  const onBirthdateChange = useCallback((e: any) => {
    e.preventDefault();

    const age = CalculateAge(e.target.value);

    setFormData({ 
      ...formData, 
      [e.target.name]: e.target.value,
      age: age
    })

  }, [formData]);

  const onChange = (e: any) => setFormData({ ...formData, [e.target.name]: e.target.value });

  useMemo(() => {
    if (courses) {
      getYearSectionsByCourseID();
    }
  }, [courses]);

  useEffect(() => {
    const currentStudent = localStorage.getItem("currentStudent");
    if (currentStudent) {
      const newuser = JSON.parse(currentStudent);
      setCurrentStudent(newuser);
      setFormData({
        ...formData,
        fullname: newuser.lname + ", " + newuser.fname + " " + newuser.mname,
        address: newuser.address,
        contact: newuser.contact,
        email: newuser.email,
        status: newuser.status
      });
    }

    getCourses();
  }, []);

  return (

    <div className='register-container'>
      <div className="container">
        <div className="row justify-content-md-center">
          <div className="card" style={{ width: "28rem" }}>
            <div className="card-body">
              <h5 className="card-title">Student Information Form</h5>
              <form onSubmit={onClickSubmitProfile}>
                <div className="form-group">
                  <label htmlFor="fullname">Student Name</label>
                  <input
                    disabled={true}
                    className="form-control"
                    id="fullname"
                    name='fullname'
                    aria-describedby="nameHelp"
                    placeholder="NAME (LAST NAME, FIRST NAME, MIDDLE NAME)"
                    value={fullname}
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="address">Address</label>
                  <textarea
                    className={"form-control" + (isAddressError ? " error-border" : "")}
                    id="address"
                    name='address'
                    placeholder="ADDRESS"
                    value={address}
                    onChange={onChange}
                  />
                  {isAddressError && <span className='error'>Field is required.</span>}
                </div>
                <div className="form-group">
                  <label htmlFor="contact">Contact No.</label>
                  <input
                    type='text'
                    className={"form-control" + (isContactError ? " error-border" : "")}
                    id="contact"
                    name='contact'
                    placeholder="MOBILE NO."
                    maxLength={11}
                    value={contact}
                    onChange={onChange}
                  />
                  {isContactError && <span className='error'>Field is required.</span>}
                </div>
                <div className="form-group">
                  <label htmlFor="civilstatus">Civil Status</label>
                  <select className={"form-control" + (isCivilStatusError ? " error-border" : "")} id="civilstatus" name='civilstatus' value={civilstatus} onChange={onChange}>
                    <option disabled value={""}> -- select a status -- </option>
                    <option value="Single">Single</option>
                    <option value="Married">Married</option>
                    <option value="Annulled">Annulled</option>
                    <option value="Separated">Separated</option>
                    <option value="Widowed">Widowed</option>
                  </select>
                  {isCivilStatusError && <span className='error'>Field is required.</span>}
                </div>
                <div className="form-group">
                  {/*<input
                    type='text'
                    className="form-control"
                    id="civilstatus"
                    name='civilstatus'
                    placeholder="CIVIL STATUS"
                    value={civilstatus}
                    onChange={onChange}
                    />*/
                  }
                </div>
                <div className="form-group">
                  <label htmlFor="birthdate">Birth Date</label>
                  <input
                    type="date"
                    className={"form-control" + (isBirthdateError ? " error-border" : "")}
                    id="birthdate"
                    name='birthdate'
                    aria-describedby="birthdateHelp"
                    placeholder="BIRTH DATE"
                    value={birthdate}
                    onChange={onBirthdateChange}
                  />
                  {isBirthdateError && <span className='error'>Field is required.</span>}
                </div>
                <div className="form-group">
                  <label htmlFor="age">Age</label>
                  <input
                    type='number'
                    disabled={true}
                    className={"form-control" + (isAgeError ? " error-border" : "")}
                    id="age"
                    name='age'
                    placeholder="AGE"
                    value={age}
                  />
                  {isAgeError && <span className='error'>Field is required.</span>}
                </div>
                <div className="form-group">
                  <label htmlFor="sex">Sex</label>
                  <input
                    type='text'
                    className={"form-control" + (isGenderError ? " error-border" : "")}
                    id="sex"
                    name='sex'
                    placeholder="Gender"
                    value={sex}
                    onChange={onChange}
                  />
                  {isGenderError && <span className='error'>Field is required.</span>}
                </div>
                <div className="form-group">
                  <label htmlFor="email">Email Address</label>
                  <input
                    type='text'
                    className={"form-control" + (isEmailError ? " error-border" : "")}
                    id="email"
                    name='email'
                    placeholder="EMAIL ADDRESS"
                    value={email}
                    onChange={onChange}
                  />
                  {isEmailError && <span className='error'>Field is required.</span>}
                </div>
                <div className="form-group">
                  <label htmlFor="height">Height{"(cm)"}</label>
                  <input
                    type='number'
                    className={"form-control" + (isHeightError ? " error-border" : "")}
                    id="height"
                    name='height'
                    placeholder="HEIGHT."
                    value={height}
                    onChange={onChange}
                  />
                  {isHeightError && <span className='error'>Field is required.</span>}
                </div>
                <div className="form-group">
                  <label htmlFor="weight">Weight{"(kg)"}</label>
                  <input
                    type='number'
                    className={"form-control" + (isWeightError ? " error-border" : "")}
                    id="weight"
                    name='weight'
                    placeholder="WEIGHT"
                    value={weight}
                    onChange={onChange}
                  />
                  {isWeightError && <span className='error'>Field is required.</span>}
                </div>
                <div className="form-group">
                  <label htmlFor="collegedepartment">College Department</label>
                  <input
                    type='text'
                    className={"form-control" + (isCollegerError ? " error-border" : "")}
                    id="collegedepartment"
                    name='collegedepartment'
                    placeholder="COLLEGE DEPARTMENT"
                    value={collegedepartment}
                    onChange={onChange}
                  />
                  {isCollegerError && <span className='error'>Field is required.</span>}
                </div>
                <div className="form-group">
                  <label htmlFor="course">Course</label>
                  <select className={"form-control" + (isCourseError ? " error-border" : "")} name="course" id="course" defaultValue={course} value={course} onChange={onCourseChange}>
                    <option disabled selected value={0}> -- select a course -- </option>
                    {courses?.map((c) => (
                      c.enabled &&
                      <option key={"opt-" + c.id} value={c.id}>{c.title}</option>
                    ))}
                  </select>
                  {isCourseError && <span className='error'>Field is required.</span>}
                </div>
                <div className="form-group">
                  <label htmlFor="yearsection">Year and Section</label>
                  <select className={"form-control" + (isYearSectionError ? " error-border" : "")} name="yearsection" id="yearsection" defaultValue={yearsection} value={yearsection} onChange={onChange}>
                    <option disabled value={0}> -- select a year section -- </option>
                    {currentYearSect?.map((c) => (
                      c.enabled &&
                      <option key={"opt-" + c.id} value={c.id}>{c.title}</option>
                    ))}
                  </select>
                  {isYearSectionError && <span className='error'>Field is required.</span>}
                </div>
                <div className="form-group">
                  <label htmlFor="fathersname">Father's Name</label>
                  <input
                    type='text'
                    className={"form-control" + (isFatherNameError ? " error-border" : "")}
                    id="fathersname"
                    name='fathersname'
                    placeholder="FATHER'S NAME."
                    value={fathersname}
                    onChange={onChange}
                  />
                  {isFatherNameError && <span className='error'>Field is required.</span>}
                </div>
                <div className="form-group">
                  <label htmlFor="fathersaddress">Address</label>
                  <textarea
                    className={"form-control" + (isFathersAddressError ? " error-border" : "")}
                    id="fathersaddress"
                    name='fathersaddress'
                    placeholder="ADDRESS"
                    value={fathersaddress}
                    onChange={onChange}
                  />
                  {isFathersAddressError && <span className='error'>Field is required.</span>}
                </div>
                <div className="form-group">
                  <label htmlFor="fatherscontact">Contact No.</label>
                  <input
                    type='text'
                    className={"form-control" + (isFathersContactError ? " error-border" : "")}
                    id="fatherscontact"
                    name='fatherscontact'
                    placeholder="MOBILE NO."
                    maxLength={11}
                    value={fatherscontact}
                    onChange={onChange}
                  />
                  {isFathersContactError && <span className='error'>Field is required.</span>}
                </div>
                <div className="form-group">
                  <label htmlFor="mothersname">Mother's Name</label>
                  <input
                    type='text'
                    className={"form-control" + (isMothersNameError ? " error-border" : "")}
                    id="mothersname"
                    name='mothersname'
                    placeholder="MOTHER'S NAME"
                    value={mothersname}
                    onChange={onChange}
                  />
                  {isMothersNameError && <span className='error'>Field is required.</span>}
                </div>
                <div className="form-group">
                  <label htmlFor="mothersaddress">Address</label>
                  <textarea
                    className={"form-control" + (isMothersAddressError ? " error-border" : "")}
                    id="mothersaddress"
                    name='mothersaddress'
                    placeholder="ADDRESS"
                    value={mothersaddress}
                    onChange={onChange}
                  />
                  {isMothersAddressError && <span className='error'>Field is required.</span>}
                </div>
                <div className="form-group">
                  <label htmlFor="motherscontact">Contact No.</label>
                  <input
                    type='text'
                    className={"form-control" + (isMothersContactError ? " error-border" : "")}
                    id="motherscontact"
                    name='motherscontact'
                    placeholder="CONTACT NO."
                    maxLength={11}
                    value={motherscontact}
                    onChange={onChange}
                  />
                  {isMothersContactError && <span className='error'>Field is required.</span>}
                </div>
                {errorMessage ?
                  <div className="alert alert-danger" role="alert">
                    {errorMessage}
                  </div>
                  : null}
                {successMessage ?
                  <div className="alert alert-success" role="alert">
                    {successMessage}
                  </div>
                  : null}
                <div className='sit-level-btn-container'>
                  <Button variant="primary" type='submit'>
                    Update
                  </Button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Register;