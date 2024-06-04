import { useEffect, useState, useMemo, Fragment, useCallback } from 'react';
import { useLocation } from 'react-router-dom';
import { getStudentById, getAllStudentSITCompanyArchieve, updateStudentPhoto, updateStudent } from "../services/studentService";
import { getAllCompany } from "../services/companyServices";
import { getAllSIT } from "../services/sitServices";
import { getCourseById, getYearSectionById, getAllCourse } from "../services/courseServices";
import BlankImg from "../../assets/blankimg.png";
import { IStudent, IStudentSITCompany, IStaff, IYearSection, ICourse, IStudentSITCompanyArchieve, ISIT, ICompany } from "../services/type.interface";
import Archieve from "./list/StudentSITComp";
import Button from 'react-bootstrap/Button';
import "./studentprofile.scss";
import { useDropzone } from 'react-dropzone';
import { CalculateAge } from "../services/mutation/age";
import { getAllYearSection } from "../services/courseServices";

export interface IStudentProfile {
    staff?: IStaff;
}

const StudentProfile = ({ staff }: IStudentProfile) => {
    const [student, setStudent] = useState<IStudent>();
    const [studentArchieve, setStudentArchieve] = useState<IStudentSITCompanyArchieve[]>();
    const [isEdit, setIsEdit] = useState<boolean>(false);
    const [sits, setSits] = useState<ISIT[]>();
    const [companies, setCompanies] = useState<ICompany[]>();
    const [mycourse, setMyCourse] = useState<ICourse>();
    const [courses, setCourses] = useState<ICourse[]>();
    const [yearSection, setYearSection] = useState<IYearSection>();
    const [studentPhoto, setStudentPhoto] = useState<string>("");
    const [errorMessage, setErrorMessage] = useState<string>("");
    const [successMessage, setSuccessMessage] = useState<string>("");
    const [yearSections, setYearSections] = useState<IYearSection[]>([]);
    const [currentYearSect, setcurrentYearSect] = useState<IYearSection[]>([]);
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const value = queryParams.get('id');
    const token = "";

    const [isSubmit, setisSubmit] = useState<boolean>(false);
    const [files, setFiles] = useState<File[] | undefined>();

    //Validation variables
    const [isFirstNameError, setisFirstNameError] = useState<boolean>(false);
    const [isMNameError, setisMNameError] = useState<boolean>(false);
    const [isLNameError, setisLNameError] = useState<boolean>(false);
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

    const onDrop = useCallback((acceptedFiles: File[], fileRejections: any, events: any) => {
        setFiles(acceptedFiles);
    }, []);
    const { isDragActive, getRootProps, getInputProps } = useDropzone({
        multiple: false,
        accept: {
            'image/jpeg': [],
            'image/png': [],
            'image/jpg': [],
            'image/svg': []
        },
        onDrop
    });

    const resetValidation = () => {
        setisFirstNameError(false);
        setisMNameError(false);
        setisLNameError(false);
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



    const [formData, setFormData] = useState({
        fname: student?.fname,
        mname: student?.mname,
        lname: student?.lname,
        address: student?.address,
        age: student?.age,
        birthdate: student?.birthdate.toString(),
        civilstatus: student?.civilstatus,
        collegedepartment: student?.collegedepartment,
        contact: student?.contact,
        course: student?.course,
        yearsection: student?.yearsection,
        email: student?.email,
        fathersaddress: student?.fathersaddress,
        fatherscontact: student?.fatherscontact,
        fathersname: student?.fathersname,
        mothersaddress: student?.mothersaddress,
        motherscontact: student?.motherscontact,
        mothersname: student?.mothersname,
        sex: student?.sex,
        status: student?.status,
        isInit: student?.isInit,
        weight: student?.weight,
        fullname: student?.lname,
        height: student?.height
    });

    const {
        fname,
        mname,
        lname,
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

    const getStudent = async () => {
        if (value) {
            await getStudentById(token, value).then((res: any) => {
                setFormData({
                    fname: res?.fname,
                    mname: res?.mname,
                    lname: res?.lname,
                    address: res?.address,
                    age: res?.age,
                    birthdate: res?.birthdate.toString(),
                    civilstatus: res?.civilstatus,
                    collegedepartment: res?.collegedepartment,
                    contact: res?.contact,
                    course: res?.course,
                    yearsection: res?.yearsection,
                    email: res?.email,
                    fathersaddress: res?.fathersaddress,
                    fatherscontact: res?.fatherscontact,
                    fathersname: res?.fathersname,
                    mothersaddress: res?.mothersaddress,
                    motherscontact: res?.motherscontact,
                    mothersname: res?.mothersname,
                    sex: res?.sex,
                    status: res?.status,
                    isInit: res?.isInit,
                    weight: res?.weight,
                    fullname: res?.lname,
                    height: res?.height
                });
                setStudent(res);
                setStudentPhoto(res?.studentphoto);
            }).catch((err) => {
                console.log("Error: ", err);
            });
        }
    }

    const getCourse = async () => {
        if (student && student?.course) {
            await getCourseById(token, student?.course?.toString()).then((res: any) => {
                setMyCourse(res);
            }).catch((err) => {
                console.log("Error: ", err);
            });
        }
    }

    const getYearSect = async () => {
        if (student && student?.course) {
            await getYearSectionById(token, "id", student?.yearsection?.toString()).then((res: any) => {
                setYearSection(res[0]);
            }).catch((err) => {
                console.log("Error: ", err);
            });
        }
    }

    const getSITLabelStringBySITID = useCallback((id: number) => {
        if (id) {
            const mySIT = sits?.find((sit) => { return sit.id === id });
            return "SIT " + mySIT?.label;
        }
        return "";
    }, [sits]);

    const getCompanyStringBySITID = useCallback((id: number) => {
        if (id) {
            const myCompany = companies?.find((sit) => { return sit.id === id });
            return myCompany?.name;
        }
        return "";
    }, [companies]);

    const getStudentArchieve = async () => {
        if (student) {
            await getAllStudentSITCompanyArchieve(token, student.id).then((res: any) => {
                setStudentArchieve(res);
            }).catch((err) => {
                console.log("Error: ", err);
            })
        }
    }

    const getCompanies = async () => {
        await getAllCompany(token).then((res: any) => {
            setCompanies(res);
        }).catch(err => {
            console.log("Error: ", err);
        });
    }

    const getSITs = async () => {
        await getAllSIT(token).then((res: any) => {
            setSits(res);
        }).catch(err => {
            console.log("Error: ", err);
        });
    }

    const onUpdatedCompanyAndUploadFile = async (studentId: string, file: File) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = async function () {
            const myBase64 = reader.result;
            //const arrStr = myBase64?.toString().split("data:application/pdf;base64,");
            //if(arrStr){
            let newData: any = {
                studentphoto: myBase64
            }
            if (myBase64) {
                setStudentPhoto(myBase64?.toString());
            }

            return await updateStudentPhoto(token, studentId, newData).then((res: any) => {
                setFiles(undefined);
                return res;
            }).catch((err: any) => {
                console.log("Error: ", err);
            });
        };
        reader.onerror = function () {
            console.log("Error: ", reader.error);
        };

    }

    const onSubmitForm = async (e: any) => {
        e.preventDefault();
        setSuccessMessage("");
        setErrorMessage("");

        resetValidation();

        let errorList = "";

        if (!fname) {
            setisFirstNameError(true);
            errorList += " *First name is required.";
        }

        if (!mname) {
            setisMNameError(true);
            errorList += " *Middle name is required.";
        }

        if (!lname) {
            setisLNameError(true);
            errorList += " *Last name is required.";
        }

        if (!address) {
            setisAddressError(true);
            errorList += " *Address is required.";
        }

        if (!contact) {
            setisContactError(true);
            errorList += " *Contact is required.";
        }

        if (!civilstatus) {
            setisCivilStatusError(true);
            errorList += " *Civil Status is required.";
        }

        if (!birthdate) {
            setisBirthdateError(true);
            errorList += " *Birthdate is required.";
        }

        if (!age) {
            setisAgeError(true);
            errorList += " *Age is required.";
        }

        if (!sex) {
            setisGenderError(true);
            errorList += " *Gender is required.";
        }

        if (!email) {
            setisEmailError(true);
            errorList += " *Email address is required.";
        }

        if (!height) {
            setisHeightError(true);
            errorList += " *Height is required.";
        }

        if (!weight) {
            setisWeightError(true);
            errorList += " *Weight is required.";
        }

        if (!collegedepartment) {
            setisCollegerError(true);
            errorList += " *College department is required.";
        }

        if (!course) {
            setisCourseError(true);
            errorList += " *Course is required.";
        }

        if (!yearsection) {
            setisYearSectionError(true);
            errorList += " *Year and Section is required.";
        }

        if (!fathersname) {
            setisFatherNameError(true);
            errorList += " *Father's name is required.";
        }

        if (!fathersaddress) {
            setisFathersAddressError(true);
            errorList += " *Father's address is required.";
        }

        if (!fatherscontact) {
            setisFathersContactError(true);
            errorList += " *Father's contact is required.";
        }

        if (!mothersname) {
            setisMothersNameError(true);
            errorList += " *Mother's name is required.";
        }

        if (!mothersaddress) {
            setisMothersAddressError(true);
            errorList += " *Mother's address is required.";
        }

        if (!motherscontact) {
            setisMothersContactError(true);
            errorList += " *Mother's contact is required.";
        }

        if (errorList) {
            setErrorMessage(errorList);
            return;
        }

        try {
            if (!isSubmit && student) {
                const newStudent = {
                    ...formData,
                    address: address ? address : student.address,
                    email: email ? email : student.email,
                    contact: contact ? contact : student.contact,
                    companyid: student.companyid,
                    SIT: student.SIT,
                    CompanyStatus: student.CompanyStatus
                }
                if (files && files?.length > 0) {
                    await onUpdatedCompanyAndUploadFile(student?.id, files[0]).then((res) => {
                        console.log("Successfully uploaded!!!");
                    }).catch((err) => {
                        console.log("Error: ", err);
                    })
                }

                await updateStudent(token, student?.id, newStudent).then((res: any) => {
                    const mynewStudent: any = {
                        ...newStudent,
                        lname: lname,
                        fname: fname,
                        mname: mname,
                        id: student.id,
                        CompanyStatus: student.CompanyStatus
                    }
                    setStudent(mynewStudent);
                    localStorage.setItem("currentStudent", JSON.stringify(mynewStudent));
                    setSuccessMessage("Successfully updated profile.");
                    setTimeout(() => {
                        setIsEdit(false);
                        setisSubmit(false);
                        setSuccessMessage("");
                    }, 2000);
                }).catch(err => {
                    console.log("Error: ", err);
                    setisSubmit(false);
                    setErrorMessage("An error occured. Please try again.");
                });
            }
        } catch (err) {
            console.log("Error: ", err);
            setisSubmit(false);
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
            if(courses){
                const myYearSects = res.filter((sects: any) => { return sects.courseid === courses[0]?.id });
                setcurrentYearSect(myYearSects);
            }
            
        }).catch((err) => {
            console.log("Error: ", err);
        });
    }

    const getSITStringBySITID = useCallback((id: number) => {
        if (id) {
            const mySIT = sits?.find((sit) => { return sit.id === id });
            return "SIT " + mySIT?.label + " Assignment: ";
        }
        return "";
    }, [sits]);

    const onBirthdateChange = useCallback((e: any) => {
        e.preventDefault();
    
        const age = CalculateAge(e.target.value);
    
        setFormData({ 
          ...formData, 
          [e.target.name]: e.target.value,
          age: age
        })
    
      }, [formData]);

    const onRemoveFile = (myfile: File) => {
        let newFiles: File[] = [];

        files?.forEach((file) => {
            if (file.name !== myfile.name) {
                newFiles.push(file);
            }
        });

        setFiles(newFiles);
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

    const onChange = (e: any) => setFormData({ ...formData, [e.target.name]: e.target.value });

    useMemo(() => {
        getYearSectionsByCourseID();
    }, [courses]);

    useMemo(() => {
        getCourses();
        getCourse();
        getYearSect();
        getStudentArchieve();
        getSITs();
        getCompanies();
    }, [student]);

    useEffect(() => {
        getStudent();
    }, []);

    return (
        <div className='student-profile-container'>


            {value ?
                <Fragment>
                    {staff && staff.role !== 3 ?
                        <div className='modify-btn-container'>
                            <button className='btn' aria-label='modify button container' onClick={() => setIsEdit(!isEdit)}>
                                {isEdit ? <i className="bi bi-x-circle"></i> : <i className="bi bi-pencil"></i>}
                            </button>
                        </div>
                        : null}
                    {isEdit ? <form onSubmit={onSubmitForm}>
                        <div className='student-profile-header'>
                            <div className='student-img'>
                                {studentPhoto ? <img src={studentPhoto} /> : <img src={BlankImg} />}
                                <div {...getRootProps({ className: 'dropzone' })}>
                                    <input {...getInputProps()} />
                                    <i className="bi bi-cloud-upload"></i>
                                    {isDragActive ? <p>Drop it here</p> : <p>Drag 'n' drop some files here, or click to select files</p>}
                                    <span>Can only accept .jpeg, .jpg, .png, .svg file</span>
                                </div>
                                {files && files?.length > 0 ? <h5>New Profile Image</h5> : null}
                                {files?.map((file) => (
                                    file?.name && file?.size &&
                                    <div key={"file-" + file.name} className="file-container col col-md-12">
                                        <div className="upload-icon">
                                            <img src={URL.createObjectURL(files[0])} />
                                        </div>
                                        <span>{file?.name} - {file?.size} bytes <button type="button" className='btn btn-default' onClick={() => onRemoveFile(file)}><i className='bi bi-x' /></button></span>
                                    </div>
                                ))}
                            </div>
                            <div className='student-personal-information'>
                                <div className="form-group">
                                    <label htmlFor="fname">First name:</label>
                                    <input
                                        type='text'
                                        className={"form-control" + (isCollegerError ? " error-border" : "")}
                                        id="fname"
                                        name='fname'
                                        placeholder="FIRST NAME"
                                        value={fname}
                                        onChange={onChange}
                                    />
                                    {isFirstNameError && <span className='error'>Field is required.</span>}
                                </div>
                                <div className="form-group">
                                    <label htmlFor="mname">Middle name:</label>
                                    <input
                                        type='text'
                                        className={"form-control" + (isCollegerError ? " error-border" : "")}
                                        id="mname"
                                        name='mname'
                                        placeholder="LAST NAME"
                                        value={mname}
                                        onChange={onChange}
                                    />
                                    {isMNameError && <span className='error'>Field is required.</span>}
                                </div>
                                <div className="form-group">
                                    <label htmlFor="lname">Last name:</label>
                                    <input
                                        type='text'
                                        className={"form-control" + (isCollegerError ? " error-border" : "")}
                                        id="lname"
                                        name='lname'
                                        placeholder="LAST NAME"
                                        value={lname}
                                        onChange={onChange}
                                    />
                                    {isLNameError && <span className='error'>Field is required.</span>}
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
                                    <select className={"form-control" + (isCourseError ? " error-border" : "")} name="course" id="course" defaultValue={course} value={course} 
                                    onChange={onCourseChange}
                                    >
                                        <option disabled selected value={0}> -- select a course -- </option>
                                        {courses?.map((c) => (
                                            c.enabled &&
                                            <option key={"opt-" + c.id} value={c.id}>{c.title}</option>
                                        ))
                                        }
                                    </select>
                                    {isCourseError && <span className='error'>Field is required.</span>}
                                </div>
                                <div className="form-group">
                                    <label htmlFor="yearsection">Year and Section</label>
                                    <select className={"form-control" + (isYearSectionError ? " error-border" : "")} name="yearsection" id="yearsection" defaultValue={yearsection} value={yearsection} onChange={onChange}>
                                        <option disabled value={0}> -- select a year section -- </option>
                                        {
                                        currentYearSect?.map((c) => (
                                            c.enabled &&
                                            <option key={"opt-" + c.id} value={c.id}>{c.title}</option>
                                        ))
                                        }
                                    </select>
                                    {isYearSectionError && <span className='error'>Field is required.</span>}
                                </div>
                            </div>
                            <div className='student-details'>
                                <div className='row'>
                                    <div className='col col-2'>
                                        <div>
                                            <label>Address: </label>
                                        </div>
                                    </div>
                                    <div className='col col-10'>
                                        <div className="form-group">
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
                                    </div>
                                </div>
                                <div className='row'>
                                    <div className='col col-2'>
                                        <div>
                                            <label>Contact Number: </label>
                                        </div>
                                    </div>
                                    <div className='col col-10'>
                                        <div className="form-group">
                                            <input
                                                type='text'
                                                className={"form-control" + (isContactError ? " error-border" : "")}
                                                id="contact"
                                                name='contact'
                                                maxLength={11}
                                                placeholder="MOBILE NO."
                                                value={contact}
                                                onChange={onChange}
                                            />
                                            {isContactError && <span className='error'>Field is required.</span>}
                                        </div>
                                    </div>
                                </div>
                                <div className='row'>
                                    <div className='col col-2'>
                                        <div>
                                            <label>Email: </label>
                                        </div>
                                    </div>
                                    <div className='col col-10'>
                                        <div className="form-group">
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
                                    </div>
                                </div>
                                <div className='row'>
                                    <div className='col col-2'>
                                        <div>
                                            <label>Civil Status: </label>
                                        </div>
                                    </div>
                                    <div className='col col-10'>
                                        <div className="form-group">
                                            <select className={"form-control" + (isGenderError ? " error-border" : "")} id="civilstatus" name='civilstatus' value={civilstatus} onChange={onChange}>
                                                <option disabled value={undefined}> -- select a gender -- </option>
                                                <option value="Single">Single</option>
                                                <option value="Married">Married</option>
                                                <option value="Annulled">Annulled</option>
                                                <option value="Separated">Separated</option>
                                                <option value="Widowed">Widowed</option>
                                            </select>
                                            {isGenderError && <span className='error'>Field is required.</span>}
                                            {/*
                                                <input
                                                    type='text'
                                                    className="form-control"
                                                    id="civilstatus"
                                                    name='civilstatus'
                                                    placeholder="CIVIL STATUS"
                                                    value={civilstatus}
                                                    onChange={onChange}
                                                />
                                                */}
                                        </div>
                                    </div>
                                </div>
                                <div className='row'>
                                    <div className='col col-2'>
                                        <div>
                                            <label>Birth date: </label>
                                        </div>
                                    </div>
                                    <div className='col col-10'>
                                        <div>
                                            <div className='row'>
                                                <div className='col col-md-3'>
                                                    <div className="form-group">
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
                                                </div>
                                                <div className='col col-md-2'>
                                                    <div className='row'>
                                                        <div className='col col-md-12'>
                                                            <div className="form-group inline">
                                                                <label>Age: </label>
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
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className='col col-md-2'>
                                                    <div className='row'>
                                                        <div className='col col-md-12'>
                                                            <div className="form-group inline">
                                                                <label htmlFor="sex">Sex</label>
                                                                <input
                                                                    type='text'
                                                                    className={"form-control" + (isGenderError ? " error-border" : "")}
                                                                    id="sex"
                                                                    name='sex'
                                                                    placeholder="SEX"
                                                                    value={sex}
                                                                    onChange={onChange}
                                                                />
                                                                {isGenderError && <span className='error'>Field is required.</span>}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className='row'>
                                    <div className='col col-2'>
                                        <div>
                                            <label>Height{"(cm)"}: </label>
                                        </div>
                                    </div>
                                    <div className='col col-10'>
                                        <div className="form-group">
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
                                    </div>
                                </div>
                                <div className='row'>
                                    <div className='col col-2'>
                                        <div>
                                            <label>Weight{"(kg)"}: </label>
                                        </div>
                                    </div>
                                    <div className='col col-10'>
                                        <div className="form-group">
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
                                    </div>
                                </div>
                                <div className='row'>
                                    {sits && companies && studentArchieve?.map((arc) => (
                                        <Fragment key={"archieve-" + arc.id}>
                                            <div className='col col-2'>
                                                <div>
                                                    <label>{getSITStringBySITID(arc.sitid)}</label>
                                                </div>
                                            </div>
                                            <div className='col col-10'>
                                                <div>
                                                    <span>{getCompanyStringBySITID(arc.companyid)}</span>
                                                </div>
                                            </div>
                                        </Fragment>
                                    ))}
                                </div>
                                <div className='row'>
                                    <div className='col col-2'>
                                        <div>
                                            <label>Father's Name: </label>
                                        </div>
                                    </div>
                                    <div className='col col-10'>
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
                                </div>
                                <div className='row'>
                                    <div className='col col-2'>
                                        <div>
                                            <label>Address: </label>
                                        </div>
                                    </div>
                                    <div className='col col-10'>
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
                                </div>
                                <div className='row'>
                                    <div className='col col-2'>
                                        <div>
                                            <label>Contact No.: </label>
                                        </div>
                                    </div>
                                    <div className='col col-10'>
                                        <div className="form-group">
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
                                    </div>
                                </div>
                                <div className='row'>
                                    <div className='col col-2'>
                                        <div>
                                            <label>Mother's Name: </label>
                                        </div>
                                    </div>
                                    <div className='col col-10'>
                                        <div className="form-group">
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
                                    </div>
                                </div>
                                <div className='row'>
                                    <div className='col col-2'>
                                        <div>
                                            <label>Address: </label>
                                        </div>
                                    </div>
                                    <div className='col col-10'>
                                        <div className="form-group">
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
                                    </div>
                                </div>
                                <div className='row'>
                                    <div className='col col-2'>
                                        <div>
                                            <label>Contact No.: </label>
                                        </div>
                                    </div>
                                    <div className='col col-10'>
                                        <div className="form-group">
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
                                    </div>
                                </div>
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
                            <div className='btn-container'>
                                <Button variant="secondary" type='button' onClick={() => setIsEdit(false)}>
                                    Cancel
                                </Button>
                                <Button disabled={isSubmit} variant="primary" type='submit'>
                                    Update
                                </Button>
                            </div>
                        </div>
                    </form> :
                        <div className='student-profile'>
                            <div className='student-profile-header'>
                                <div className='student-img'>
                                    {studentPhoto ? <img src={studentPhoto} /> : <img src={BlankImg} />}
                                </div>
                                <div className='student-personal-information'>
                                    <h2>{student?.fname + " " + student?.mname + " " + student?.lname}</h2>
                                    <h3>{student?.collegedepartment}</h3>
                                    <h3>{mycourse?.description}</h3>
                                    <h3>{mycourse?.title} {yearSection?.title}</h3>
                                </div>
                                <div className='student-details'>
                                    <div className='row'>
                                        <div className='col col-2'>
                                            <div>
                                                <label>Address: </label>
                                            </div>
                                            <div>
                                                <label>Contact Number: </label>
                                            </div>
                                            <div>
                                                <label>Email: </label>
                                            </div>
                                            <div>
                                                <label>Civil Status: </label>
                                            </div>
                                        </div>
                                        <div className='col col-10'>
                                            <div>
                                                <span>{student?.address}</span>
                                            </div>
                                            <div>
                                                <span>{student?.contact}</span>
                                            </div>
                                            <div>
                                                <span>{student?.email}</span>
                                            </div>
                                            <div>
                                                <span>{student?.civilstatus}</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className='row'>
                                        <div className='col col-2'>
                                            <div>
                                                <label>Birth date: </label>
                                            </div>
                                            <div>
                                                <label>Height: </label>
                                            </div>
                                            <div>
                                                <label>Weight: </label>
                                            </div>
                                        </div>
                                        <div className='col col-10'>
                                            <div>
                                                <div className='row'>
                                                    <div className='col col-md-3'>
                                                        <span>{student?.birthdate?.toString()}</span>
                                                    </div>
                                                    <div className='col col-md-2'>
                                                        <label>Age: </label><span> {student?.age}</span>
                                                    </div>
                                                    <div className='col col-md-2'>
                                                        <label>Sex: </label><span> {student?.sex}</span>
                                                    </div>
                                                </div>
                                            </div>
                                            <div>
                                                <span>{student?.height}cm</span>
                                            </div>
                                            <div>
                                                <span>{student?.weight}kg</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className='row'>
                                        <div className='col col-2'>
                                            <div>
                                                <label>Current Company and SIT assigment: </label>
                                            </div>
                                        </div>
                                        <div className='col col-10'>
                                            <div className='row'>
                                                <label>{getSITLabelStringBySITID(Number(student?.SIT))} {student?.companyid && getCompanyStringBySITID(student?.companyid)}</label>
                                            </div>
                                        </div>
                                    </div>
                                    <div className='row'>
                                        {sits && companies && studentArchieve?.map((arc) => (
                                            <Archieve key={"archieve-" + arc.id} staff={staff} arc={arc} sits={sits} companies={companies} token={token} courseID={student?.course} />
                                        ))}
                                    </div>
                                    <div className='row'>
                                        <div className='col col-2'>
                                            <div>
                                                <label>Father's Name: </label>
                                            </div>
                                            <div>
                                                <label>Address: </label>
                                            </div>
                                            <div>
                                                <label>Contact Number: </label>
                                            </div>
                                        </div>
                                        <div className='col col-10'>
                                            <div>
                                                <span>{student?.fathersname}</span>
                                            </div>
                                            <div>
                                                <span>{student?.fathersaddress}</span>
                                            </div>
                                            <div>
                                                <span>{student?.fatherscontact}</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className='row'>
                                        <div className='col col-2'>
                                            <div>
                                                <label>Mother's Name: </label>
                                            </div>
                                            <div>
                                                <label>Address: </label>
                                            </div>
                                            <div>
                                                <label>Contact Number: </label>
                                            </div>
                                        </div>
                                        <div className='col col-10'>
                                            <div>
                                                <span>{student?.mothersname}</span>
                                            </div>
                                            <div>
                                                <span>{student?.mothersaddress}</span>
                                            </div>
                                            <div>
                                                <span>{student?.motherscontact}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    }
                </Fragment>
                : <h1>No student ID has been provided</h1>}
        </div>
    )
}

export default StudentProfile;