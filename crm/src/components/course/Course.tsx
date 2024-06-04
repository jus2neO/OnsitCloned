import { useState, useEffect, Fragment, useMemo, useCallback } from 'react';
import MyModal from "../common/Modal";
import Button from 'react-bootstrap/Button';
import { addCourse, addYearSection, getAllCourse, getAllYearSection, updateCourse, updateYearSection } from "../services/courseServices";
import { getAllSIT } from "../services/sitServices";
import { getAllCompany, getAllCompanyPref } from "../services/companyServices";
import { getAllStudents, updateStudent, addStudentSITCompanyArchieve } from "../services/studentService";
import { addSITGradeFiles } from "../services/sitgradeupload";
import { ICourse, IYearSection, IStudent, ISIT, ICompany, ICompanyPrefer, IStaff } from "../services/type.interface";
import { Link } from "react-router-dom";
import { useDropzone } from 'react-dropzone';
import { CSVLink } from "react-csv";

import "./course.scss";

export interface ICourseProps {
    staff?: IStaff;
}

const Course = ({ staff }: ICourseProps) => {
    const [students, setStudents] = useState<IStudent[]>([]);
    const [currentstudents, setCurrentStudents] = useState<IStudent[]>([]);
    const [currentstudent, setCurrentStudent] = useState<IStudent>();
    const [sits, setSITS] = useState<ISIT[]>([]);
    const [companies, setCompanies] = useState<ICompany[]>([]);
    const [companiesPref, setCompaniesPref] = useState<ICompanyPrefer[]>([]);
    const [onShowCourse, setOnShowCourse] = useState<boolean>(false);
    const [onShowYearSection, setOnShowYearSection] = useState<boolean>(false);
    const [Courses, setCourses] = useState<ICourse[]>([]);
    const [AllYearSection, setAllYearSection] = useState<IYearSection[]>([]);
    const [YearSection, setYearSection] = useState<IYearSection[]>([]);
    const [selectedCourse, setSelectedCourse] = useState<ICourse>();
    const [selectedYearSection, setSelectedYearSection] = useState<IYearSection>();
    const [errorMessage, seterrorMessage] = useState<string>("");
    const [successMessage, setSuccessMessage] = useState<string>("");
    const [isCSVLoading, setIsCSVLoading] = useState<boolean>(true);
    const [showApproveModal, setShowApproveModal] = useState<boolean>(false);
    const [files, setFiles] = useState<File[] | undefined>();
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        enabled: true
    });
    const [formDataYearSection, setFormDataYearSection] = useState({
        courseid: 0,
        title: '',
        enabled: true
    });

    const [myCSVData, setMyCSVData] = useState<any[]>([]);

    const { title, description } = formData;

    const onDrop = useCallback((acceptedFiles: File[], fileRejections: any, events: any) => {
        setFiles(acceptedFiles);
    }, []);
    const { isDragActive, getRootProps, getInputProps } = useDropzone({
        accept: {
            files: [".pdf"]
        },
        onDrop
    });

    const token = "";

    const camelCase = (str: string) => {
        return str.substring(0, 1).toUpperCase() + str.substring(1);
    };

    const filterColumns = (data: any) => {
        // Get column names
        const columns = Object.keys(data[0]);
        let headers: any[] = [];
        columns.forEach((col, idx) => {
            if (col !== "firstname") {
                // OR if (idx !== 0)
                headers.push({ label: camelCase(col), key: col });
            }
        });

        return headers;
    };

    const removeFormData = () => {
        setFormData({
            title: '',
            description: '',
            enabled: true
        });

        setFormDataYearSection({
            courseid: 0,
            title: '',
            enabled: true
        });
    }

    const onSubmitSIT = async (e: any) => {
        e.preventDefault();
        if (selectedCourse) {
            await updateCourse(token, selectedCourse.id.toString(), formData)
                .then((res) => {
                    let mysit = Courses;
                    const mycourseIndex = mysit.findIndex((val) => { return val.id === selectedCourse.id });
                    mysit[mycourseIndex].title = formData.title;
                    mysit[mycourseIndex].description = formData.description;
                    setCourses(mysit);
                    setSelectedCourse(undefined);
                    removeFormData();
                    setOnShowCourse(false);
                })
                .catch((err) => {
                    console.log("Error: ", err.message);
                });
        } else {
            await addCourse(token, formData).then((res: any) => {
                const mycourses = Courses;
                mycourses.push(res);
                setCourses(mycourses);
                removeFormData();
                setOnShowCourse(false);
            }).catch((err) => {
                console.log("Error: ", err.message);
            });
        }
    }

    const onSubmitYearSection = async (e: any) => {
        e.preventDefault();

        if (selectedYearSection) {
            await updateYearSection(token, selectedYearSection.id.toString(), formDataYearSection)
                .then((res) => {
                    let myyearsections = YearSection;
                    let myAllYearSections = AllYearSection;
                    const mysitIndex = myyearsections.findIndex((val) => { return val.id === selectedYearSection.id });
                    const myysIndex = AllYearSection.findIndex((val) => { return val.id === selectedYearSection.id });
                    myyearsections[mysitIndex].title = formDataYearSection.title;
                    myyearsections[mysitIndex].courseid = formDataYearSection.courseid;
                    setYearSection(myyearsections);
                    myAllYearSections[myysIndex].title = formDataYearSection.title;
                    myAllYearSections[myysIndex].courseid = formDataYearSection.courseid;
                    setAllYearSection(myAllYearSections);
                    setSelectedYearSection(undefined);
                    removeFormData();
                    setOnShowYearSection(false);
                })
                .catch((err) => {
                    console.log("Error: ", err.message);
                });
        } else {

            let myform = formDataYearSection;
            if (selectedCourse) myform.courseid = selectedCourse.id;
            await addYearSection(token, formDataYearSection).then((res: any) => {
                const myyearsection = YearSection;
                const myAllYearSections = AllYearSection;
                myyearsection.push(res);
                myAllYearSections.push(res);
                setYearSection(myyearsection);
                setAllYearSection(myAllYearSections);
                removeFormData();
                setOnShowYearSection(false);
            }).catch((err) => {
                console.log("Error: ", err.message);
            });
        }
    }

    const onDisableYearSection = async (id: Number) => {
        let myyearsection = YearSection;
        let myAllYearSections = AllYearSection;
        let mysit = myyearsection.find((val) => { return val.id === id });
        const myyearsectionIndex = myyearsection.findIndex((val) => { return val.id === id });
        const myysIndex = AllYearSection.findIndex((val) => { return val.id === id });
        if (mysit) mysit.enabled = false;

        await updateYearSection(token, id.toString(), mysit)
            .then((res) => {
                let newSIT: IYearSection[] = [];
                let newAllSIT: IYearSection[] = [];
                myyearsection[myyearsectionIndex].enabled = false;
                myAllYearSections[myysIndex].enabled = false;
                myyearsection.forEach((val) => {
                    newSIT.push(val);
                });
                myAllYearSections.forEach((val) => {
                    newAllSIT.push(val);
                });
                setYearSection(newSIT);
                setAllYearSection(newAllSIT);
                removeFormData();
            })
            .catch((err) => {
                console.log("Error: ", err.message);
            });
    }

    const onSelectEditRequirement = (yearsection: IYearSection) => {
        seterrorMessage("");
        setSuccessMessage("");
        setSelectedYearSection(yearsection);
        setOnShowYearSection(true);
        setFormDataYearSection({
            courseid: yearsection.courseid,
            title: yearsection.title,
            enabled: yearsection.enabled
        });
    }

    const onOpenCourseModal = () => {
        seterrorMessage("");
        setSuccessMessage("");
        setSelectedCourse(undefined);
        removeFormData();
        setOnShowCourse(true);
    }

    const onDisableSITLevel = async (id: Number) => {
        let mycourses = Courses;
        let mycourse = mycourses.find((val) => { return val.id === id });
        const mycourseIndex = mycourses.findIndex((val) => { return val.id === id });
        if (mycourse) mycourse.enabled = false;

        await updateCourse(token, id.toString(), mycourse)
            .then((res) => {
                let newCourse: ICourse[] = [];
                mycourses[mycourseIndex].enabled = false;
                mycourses.forEach((val) => {
                    newCourse.push(val);
                });
                setCourses(newCourse);
                setSelectedCourse(undefined);
                removeFormData();
            })
            .catch((err) => {
                console.log("Error: ", err.message);
            });
    }

    const onSelectEdit = (course: ICourse) => {
        seterrorMessage("");
        setSuccessMessage("");
        setSelectedCourse(course);
        setOnShowCourse(true);
        setFormData({
            title: course.title,
            description: course.description,
            enabled: course.enabled
        });
    }

    const onSelectCourse = (course: ICourse) => {
        seterrorMessage("");
        setSuccessMessage("");
        setSelectedCourse(course);
        getYearSectionByCourseId(AllYearSection, course.id);
    }

    const getYearSectionByCourseId = (yearSec: IYearSection[], id: number) => {
        const myYearSection = yearSec.filter((ys) => { return ys.courseid === id });
        setYearSection(myYearSection);
    };

    const fetchAllYearSection = async () => {
        await getAllYearSection(token).then((res: any) => {
            setAllYearSection(res);
            const courseIndex = Courses.findIndex((res: any) => { return res.enabled });
            if (Courses[courseIndex].enabled) {
                getYearSectionByCourseId(res, Courses[courseIndex].id);
            }
        })
            .catch((err) => {
                console.log("Error: ", err);
            });
    }

    const getCourses = async () => {
        await getAllCourse(token)
            .then((val: any) => {
                if (val.length > 0) {
                    const valInd = val.findIndex((res: any) => { return res.enabled });
                    if (valInd > -1) {
                        setSelectedCourse(val[valInd]);
                    }
                    setCourses(val);
                }
            })
            .catch((err) => {
                console.log("Error: ", err);
            });
    }

    const getStudents = async () => {
        await getAllStudents(token).then((res: any) => {
            setStudents(res);
        }).catch((err) => {
            console.log("Error: ", err);
        });
    }

    const getSITs = async () => {
        await getAllSIT(token).then((res: any) => {
            const newSITS = res.filter((sit: any) => { return sit.enabled });
            setSITS(newSITS);
        }).catch(err => {
            console.log("Error: ", err);
        });
    }

    const getCompanies = async () => {
        await getAllCompany(token).then((res: any) => {
            const newCompanies = res.filter((comp: any) => { return comp.enabled });
            setCompanies(newCompanies);
        }).catch(err => {
            console.log("Error: ", err);
        });
    }

    const getCompanyPrefs = async () => {
        await getAllCompanyPref(token).then((res: any) => {
            setCompaniesPref(res);
        }).catch((err) => {
            console.log("Error: ", err);
        });
    }

    const organizeCompany = (courseId: number) => {
        const newCompPref = companiesPref.filter((compPref) => { return compPref.courseid === courseId });
        let newCompanies: ICompany[] = [];

        newCompPref.forEach((cmppf) => {
            const newComp = companies.find((cmp) => { return cmp.id === cmppf.companyid });
            if (newComp) newCompanies.push(newComp);
        });

        return <Fragment>
            {newCompanies?.map((c) => (
                c.enabled &&
                <option key={"optcompany-" + c.id} value={c.id}>{c.name}</option>
            ))}
        </Fragment>
    }

    const onArchieveSubmit = (student: IStudent) => {
        setCurrentStudent(student);
        setShowApproveModal(true);
    }

    const onArchieve = async (student: IStudent) => {
        setSuccessMessage("");
        seterrorMessage("");

        //const myYS = selectedYearSection;
        //const mycurrentstudents = currentstudents;
        //setSelectedYearSection(undefined);
        //setCurrentStudents([]);

        if (!student.SIT) {
            seterrorMessage("SIT level required.");
            return {
                status: "Error",
                res: "SIT level required."
            }
        }
        if (!student.companyid) {
            seterrorMessage("SIT level required.");
            return {
                status: "Error",
                res: "SIT level required."
            }
        }

        const newData = {
            studentid: student.id,
            companyid: student.companyid,
            sitid: student.SIT,
        }

        const myStudent = students.find((stu) => { return stu.id === student.id });
        let newStudent: any;
        if (myStudent && student.SIT) {
            newStudent = {
                ...myStudent,
                SIT: student.SIT
            };
        }
        if (myStudent && student.companyid) {
            newStudent = {
                ...myStudent,
                companyid: student.companyid
            };
        }

        const myres = await addStudentSITCompanyArchieve(token, newData).then((res) => {
            updateStudent(token, student.id, newStudent).then((res) => {
                setSuccessMessage("Record has successfully saved.");
                setTimeout(() => {
                    setSuccessMessage("");
                }, 5000);
                return {
                    status: "OK",
                    res: res
                }
            }).catch(err => {
                console.log("Error: ", err);
                //seterrorMessage("An error occured.");
                return {
                    status: "Error",
                    res: err
                }
            });
            return {
                status: "OK",
                res: res
            }
        }).catch((err) => {
            console.log("Error: ", err);
            seterrorMessage(err.response.data);
            setTimeout(() => {
                seterrorMessage("");
            }, 5000);
            return {
                status: "Error",
                res: err
            }
        });

        return myres;
    }

    const onUpdateStudent = async (status: string, student: IStudent) => {
        let newStudent: any;
        const myStudent = students.find((stu) => { return stu.id === student.id });
        const mycurrentstudents = currentstudents;
        const myYS = selectedYearSection;

        newStudent = {
            ...myStudent,
            CompanyStatus: status
        };

        await updateStudent(token, student.id, newStudent).then((res) => {
            let newStudents: IStudent[] = [];
            let newCurStudents: IStudent[] = [];

            students.forEach((stu) => {
                if (stu.id === student.id) {
                    newStudents.push(newStudent);
                } else {
                    newStudents.push(stu);
                }
            });
            mycurrentstudents.forEach((stu) => {
                if (stu.id === student.id) {
                    newCurStudents.push(newStudent);
                } else {
                    newCurStudents.push(stu);
                }
            });

            setStudents(newStudents);

            setTimeout(() => {
                setSelectedYearSection(myYS);
                setCurrentStudents(newCurStudents);
            }, 500);
        }).catch(err => {
            console.log("Error: ", err);
        });
    }

    const onUpdateStudentSIT = async (studentId: string, sitId: string, companyid: string) => {
        /*seterrorMessage("");
        //if (staff && staff.role !== 3) {
        const myStudent = students.find((stu) => { return stu.id === studentId });
        let newStudent: any;
        if (myStudent && sitId) {
            newStudent = {
                ...myStudent,
                SIT: sitId
            };
        }
        if (myStudent && companyid) {
            newStudent = {
                ...myStudent,
                companyid: companyid
            };
        }
        //await updateStudent(token, studentId, newStudent).then((res) => {
        let newStudents: IStudent[] = [];
        let newCurStudents: IStudent[] = [];
        students.forEach((stu) => {
            if (stu.id === studentId) {
                newStudents.push(newStudent);
            } else {
                newStudents.push(stu);
            }
        });
        currentstudents.forEach((stu) => {
            if (stu.id === studentId) {
                newCurStudents.push(newStudent);
            } else {
                newCurStudents.push(stu);
            }
        });
        setStudents(newStudents);
        setCurrentStudents(newCurStudents);
        //}).catch(err => {
        //    console.log("Error: ", err);
        //});
        //}*/
    }

    const onRemoveFile = (myfile: File) => {
        let newFiles: File[] = [];

        files?.forEach((file) => {
            if (file.name !== myfile.name) {
                newFiles.push(file);
            }
        });

        setFiles(newFiles);
    }

    const onChange = (e: any) => setFormData({ ...formData, [e.target.name]: e.target.value });
    const onChangeYearSection = (e: any) => setFormDataYearSection({ ...formDataYearSection, [e.target.name]: e.target.value });

    const organizeStudentListInCourse = () => {
        /*const csvData = [
            ["firstname", "lastname", "email"],
            ["Ahmed", "Tomi", "ah@smthing.co.com"],
            ["Raed", "Labes", "rl@smthing.co.com"],
            ["Yezzi", "Min l3b", "ymin@cocococo.com"]
        ];*/
        let csvData: any = [];
        Courses.forEach((c) => {
            if (c.enabled) {
                const myys = AllYearSection.filter((ys) => { return ys.enabled && ys.courseid === c.id });
                myys.forEach((ys) => {
                    csvData.push([c.title + " " + ys.title, ""]);
                    const mystudent = students.filter((stud) => { return stud.course === c.id && stud.yearsection === ys.id });
                    mystudent.forEach((stud) => {
                        csvData.push(["", stud.fname + " " + stud.mname + " " + stud.lname]);
                    });
                });
            }
        });

        setMyCSVData(csvData);
        setIsCSVLoading(false);
    }

    const onSubmitApprove = async (e: any) => {
        e.preventDefault();
        seterrorMessage("");
        if (files && currentstudent?.id && currentstudent?.companyid && currentstudent?.SIT) {
            const myres: any = await onArchieve(currentstudent);
            if (myres.res && myres?.status === "OK") {
                for (let i = 0; i < files?.length; i++) {
                    await onUploadFile(currentstudent?.id, myres.res.id, files[i]).then((fileres) => {
                        return fileres;
                    }).catch((fileerr) => {
                        console.log("Errro: ", fileerr);
                        seterrorMessage("An error occured, Please try again later.");
                        return false;
                    });
                }
                setFiles(undefined);
                setShowApproveModal(false);
                localStorage.setItem("currentstudent", JSON.stringify(currentstudent));
                window.open("/bookletviewer", "_blank");
            }
        } else {
            seterrorMessage("Please make sure SIT, Company and SIT Grades are present.");
        }
    }

    const onUploadFile = async (studentid: string, studentarchieceid: number, file: File) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = async () => {
            const myBase64 = reader.result;
            let newData
            newData = {
                studentid,
                studentarchieceid,
                filename: file.name,
                size: file.size,
                type: file.type,
                file: myBase64
            }

            await addSITGradeFiles(token, newData).then((res) => {
                return res;
            }).catch((err) => {
                console.log("Error: ", err);
                return false;
            });
        };
        reader.onerror = function () {
            console.log(reader.error);
        };

    }

    useMemo(() => {
        if (selectedCourse && selectedYearSection) {
            const newCurrentStudent = students.filter((student) => { return student.course === selectedCourse.id && student.yearsection === selectedYearSection.id });
            setCurrentStudents(newCurrentStudent);
        }
    }, [selectedCourse, selectedYearSection]);

    useMemo(() => {
        setIsCSVLoading(true);
        if (students && Courses && AllYearSection) {
            organizeStudentListInCourse();
        }
    }, [students, Courses, AllYearSection]);

    useMemo(() => {
        if (Courses.length > 0) {
            fetchAllYearSection();
        }
    }, [Courses]);

    useEffect(() => {
        getCourses();
        getStudents();
        getSITs();
        getCompanies();
        getCompanyPrefs();
    }, []);

    return (
        <div className='course-configuration-container'>
            {
                /*
                <div className='print-pdf-container'>
                    <a href='printcourse' target='_blank'>
                        <i className="bi bi-printer"></i> Print/Export
                    </a>
                </div>
                */
            }
            {students?.length > 0 && Courses?.length > 0 && YearSection?.length > 0 ?
                isCSVLoading ? "Loading..." :
                    <CSVLink data={myCSVData} filename={"Student List-" + (new Date().getFullYear().toString() + "-" + (new Date().getMonth() + 1).toString() + "-" + new Date().getDate().toString()).toString() + ".csv"}>
                        <i className="bi bi-printer"></i> Print/Export
                    </CSVLink>
                : null
            }
            <MyModal
                showSubmitBtn={true}
                isForm={true}
                cancelLabel=''
                submitLabel=''
                isDisplay={showApproveModal}
                onClickClose={() => setShowApproveModal(false)}
                title={`SIT Grade Upload`}
                mysize='lg'
            >
                <form onSubmit={onSubmitApprove}>
                    <div className="form-group">
                        <div {...getRootProps({ className: 'dropzone' })}>
                            <input {...getInputProps()} />
                            <i className="bi bi-cloud-upload"></i>
                            {isDragActive ? <p>Drop it here</p> : <p>Drag 'n' drop some files here, or click to select files</p>}
                            <span>Can only accept .pdf files</span>
                        </div>
                        <aside>
                            <div className="row">
                                {files && files?.length > 0 ? <h5>Files</h5> : null}
                                {files?.map((file) => (
                                    file?.name && file?.size &&
                                    <div key={"file-" + file.name} className="file-container col col-md-3">
                                        <div className="icon">
                                            <i className="bi bi-file-earmark-pdf" />
                                        </div>
                                        <span>{file?.name} - {file?.size} bytes</span>
                                        <div className="remove-btn">
                                            <button type="button" className="btn btn-danger" onClick={() => onRemoveFile(file)}><i className='bi bi-x' /></button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </aside>
                    </div>
                    {errorMessage ?
                        <div className="alert alert-danger" role="alert">
                            {errorMessage}
                        </div>
                        : null}
                    <div className='course-level-btn-container'>
                        <div className='divider' />
                        <Button variant="secondary" onClick={() => setOnShowYearSection(false)}>
                            Close
                        </Button>
                        <Button variant="primary" type='submit'>
                            Submit
                        </Button>
                    </div>
                </form>
            </MyModal>
            <MyModal
                showSubmitBtn={true}
                isForm={true}
                cancelLabel=''
                submitLabel=''
                isDisplay={onShowCourse}
                onClickClose={() => setOnShowCourse(false)}
                title='Create SIT Level'
                mysize='lg'
            >
                <form onSubmit={onSubmitSIT}>
                    <div className="form-group">
                        <label htmlFor="courselabel">Label</label>
                        <input
                            type="text"
                            className="form-control"
                            id="courselabel"
                            name='title'
                            aria-describedby="courselabel"
                            placeholder="Enter label for course"
                            value={title}
                            onChange={onChange}
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="coursedescription">Description</label>
                        <textarea
                            className="form-control"
                            id="coursedescription"
                            name='description'
                            value={description}
                            placeholder="Enter description for course"
                            onChange={onChange}
                        />
                    </div>
                    <div className='course-btn-container'>
                        <div className='divider' />
                        <Button variant="secondary" onClick={() => setOnShowCourse(false)}>
                            Close
                        </Button>
                        <Button variant="primary" type='submit'>
                            Submit
                        </Button>
                    </div>
                </form>
            </MyModal>
            <MyModal
                showSubmitBtn={true}
                isForm={true}
                cancelLabel=''
                submitLabel=''
                isDisplay={onShowYearSection}
                onClickClose={() => setOnShowYearSection(false)}
                title={`Create Course ${selectedCourse?.title} Year and section`}
                mysize='lg'
            >
                <form onSubmit={onSubmitYearSection}>
                    <div className="form-group">
                        <label htmlFor="title">Label</label>
                        <input
                            type="text"
                            className="form-control"
                            id="title"
                            name='title'
                            aria-describedby="emailHelp"
                            placeholder="Enter label for course year section"
                            value={formDataYearSection.title}
                            onChange={onChangeYearSection}
                        />
                    </div>
                    <div className='course-level-btn-container'>
                        <div className='divider' />
                        <Button variant="secondary" onClick={() => setOnShowYearSection(false)}>
                            Close
                        </Button>
                        <Button variant="primary" type='submit'>
                            Submit
                        </Button>
                    </div>
                </form>
            </MyModal>
            <div>
                <h1>Course Configuration</h1>
                <Link to="/pendingcompanyapproval" className='btn btn-primary' aria-current="page">
                    <i className='bi bi-speedometer2' />
                    <span className='ms-3 d-none d-sm-inline'>Pending requests</span>
                </Link>
                <div className='row'>
                    <div className='col col-md-2 course-container'>
                        <label>Courses</label>
                        <div className='course-list'>
                            {Courses?.map((course) => (
                                <Fragment key={"level-" + course.id}>
                                    {course.enabled ? (
                                        <div className='course'>
                                            <button className={'btn' + (selectedCourse?.id === course.id ? " active" : "")} onClick={() => onSelectCourse(course)}>
                                                <label>{course.title}</label>
                                            </button>
                                            {staff && staff.role !== 3 ? <Fragment>
                                                <button className='btn' onClick={() => onSelectEdit(course)}>
                                                    <i className='bi bi-pencil' />
                                                </button>
                                                <button className='btn' onClick={() => onDisableSITLevel(course.id)}>
                                                    <i className='bi bi-x' />
                                                </button>
                                            </Fragment> : null}

                                        </div>
                                    ) : null}
                                </Fragment>
                            ))}
                        </div>
                        <div>
                            {staff && staff.role !== 3 ? <Fragment>
                                <button type='button' className='btn add-btn' aria-label='add SIT level' onClick={() => onOpenCourseModal()}>
                                    <i className='bi bi-plus' />
                                </button>
                            </Fragment> : null}
                        </div>
                    </div>
                    <div className='col col-md-2'>
                        <label>Year and Section</label>
                        <div className='year-section-list'>
                            {YearSection.map((yearsection) => (
                                <Fragment key={"yearsection-" + yearsection.id}>
                                    {yearsection.enabled ? (
                                        <div className='course'>
                                            <button className={'btn' + (selectedYearSection?.id === yearsection.id ? " active" : "")} onClick={() => { setSelectedYearSection(yearsection); setSuccessMessage(""); seterrorMessage(""); }}>
                                                <label>{yearsection.title}</label>
                                            </button>
                                            {staff && staff.role !== 3 ? <Fragment>
                                                <button className='btn' onClick={() => onSelectEditRequirement(yearsection)}>
                                                    <i className='bi bi-pencil' />
                                                </button>
                                                <button className='btn' onClick={() => onDisableYearSection(yearsection.id)}>
                                                    <i className='bi bi-x' />
                                                </button>
                                            </Fragment> : null}

                                        </div>
                                    ) : null}
                                </Fragment>
                            ))}
                            {staff && staff.role !== 3 ? <Fragment>
                                <button type='button' className='btn add-btn' aria-label='add SIT requirement' onClick={() => {
                                    setOnShowYearSection(true);
                                    seterrorMessage("");
                                    setSuccessMessage("");
                                }}>
                                    <i className='bi bi-plus' />
                                </button>
                            </Fragment> : null}

                        </div>
                    </div>
                    <div className='col col-md-8'>
                        {successMessage ?
                            <div className="alert alert-success" role="alert">
                                {successMessage}
                            </div>
                            : null}
                        {errorMessage ?
                            <div className="alert alert-danger" role="alert">
                                {errorMessage}
                            </div>
                            : null}
                        <div className='row'>
                            <div className='col col-4'>
                                <span>Student Name</span>
                            </div>
                            <div className='col col-1'>
                                <span>SIT #</span>
                            </div>
                            <div className='col col-3'>
                                <span>Company</span>
                            </div>
                        </div>
                        <div className='year-section-list'>
                            {currentstudents.map((student) => (
                                <Fragment key={"student-" + student.id}>
                                    <div className='course'>
                                        <div className='row'>
                                            <div className='col col-4'>
                                                <span>{student.lname + ", " + student.fname + " " + student.mname}</span>
                                            </div>
                                            <div className='col col-1'>
                                                <select disabled={true} className="form-control" name="sit" id="sit" defaultValue={student.SIT ? student.SIT : 0} onChange={(e) => onUpdateStudentSIT(student.id.toString(), e.target.value, "")}>
                                                    <option disabled value={0}> -- select an SIT -- </option>
                                                    {sits?.map((c) => (
                                                        c.enabled &&
                                                        <option key={"optsit-" + c.id} value={c.id}>{c.label}</option>
                                                    ))}
                                                </select>
                                            </div>
                                            <div className='col col-3'>
                                                <select disabled={true} className="form-control" name="company" id="company" defaultValue={student.companyid ? student.companyid : 0} onChange={(e) => onUpdateStudentSIT(student.id.toString(), "", e.target.value)} >
                                                    <option disabled value={0}> -- select a company -- </option>
                                                    {organizeCompany(student.course)}
                                                </select>
                                            </div>
                                            {
                                                student.CompanyStatus === "approve" ?
                                                    <div className='col col-2'>
                                                        <button className='btn btn-primary' onClick={() => onArchieveSubmit(student)}>
                                                            Save
                                                        </button>
                                                    </div> :
                                                    student.CompanyStatus === "pending" ?
                                                        <Fragment>
                                                            <div className='col col-4'>
                                                                <div className='stat-btn-container'>
                                                                    <button className='btn btn-primary' onClick={() => onUpdateStudent("approve", student)}>
                                                                        Approve
                                                                    </button>
                                                                    <button className='btn btn-secondary' onClick={() => onUpdateStudent("deny", student)}>
                                                                        Deny
                                                                    </button>
                                                                </div>
                                                            </div>
                                                        </Fragment>
                                                        :
                                                        !student.companyid ?
                                                            <div className='col col-4'>
                                                                <span className='no-company-info'>
                                                                    Student haven't selected a company.
                                                                </span>
                                                            </div>
                                                            :
                                                            <div className='col col-4'>
                                                                <div className='btn btn-info'>
                                                                    Company has been denied
                                                                </div>
                                                            </div>
                                            }
                                        </div>
                                    </div>
                                </Fragment>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Course;