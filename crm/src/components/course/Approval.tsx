import { useState, useEffect, Fragment } from 'react';
import { getAllStudentsWithCourseYearSection } from "../services/studentService";
import { getAllSIT } from "../services/sitServices";
import { getAllCompany, getAllCompanyPref } from "../services/companyServices";
import { ICompany, IStudentWithCourseYearSection, ISIT, ICompanyPrefer } from "../services/type.interface";
import { updateStudent } from "../services/studentService";
import "./course.scss";

const Approval = () => {
    const [studentList, setStudentList] = useState<IStudentWithCourseYearSection[]>([]);
    const [sits, setSITS] = useState<ISIT[]>([]);
    const [companies, setCompanies] = useState<ICompany[]>([]);
    const [errorMessage, seterrorMessage] = useState<string>("");
    const [successMessage, setSuccessMessage] = useState<string>("");
    

    const token = "";

    const getAllStudentWithCourseYearSection = async () => {
        await getAllStudentsWithCourseYearSection(token).then((res: any) => {
            const newSortArr = res.sort((a: any, b: any) => {
                const dateA = a.companystatusdate;
                const dateB = b.companystatusdate;

                if (dateA < dateB) {
                    return -1;
                }

                if (dateA > dateB) {
                    return 1;
                }

                return 0;
            });
            const newStudents = newSortArr.filter((stud: any) => {return stud.CompanyStatus === "pending"})
            setStudentList(newStudents);
        }).catch(err => {
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

    const onUpdateStudentSIT = async (studentId: string, sitId: string, companyid: string) => {
        seterrorMessage("");
        //if (staff && staff.role !== 3) {
        const myStudent = studentList.find((stu) => { return stu.id === studentId });
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
        let newStudents: IStudentWithCourseYearSection[] = [];
        studentList.forEach((stu) => {
            if (stu.id === studentId) {
                newStudents.push(newStudent);
            } else {
                newStudents.push(stu);
            }
        });
        setStudentList(newStudents);
        //}).catch(err => {
        //    console.log("Error: ", err);
        //});
        //}
    }

    const getCompanies = async () => {
        await getAllCompany(token).then((res: any) => {
            const newCompanies = res.filter((comp: any) => { return comp.enabled });
            setCompanies(newCompanies);
        }).catch(err => {
            console.log("Error: ", err);
        });
    }

    const organizeCompany = (courseId: number | null) => {
        const mycompany = companies.find((comp) => { return courseId === comp.id });

        return <Fragment>
            <span>{mycompany?.name}</span>
        </Fragment>
    }

    const onUpdateStudent = async (status: string, student: IStudentWithCourseYearSection) => {
        setSuccessMessage("");
        seterrorMessage("");
        let newStudent: any;
        const myStudent = studentList.find((stu) => { return stu.id === student.id });

        newStudent = {
            ...myStudent,
            CompanyStatus: status
        };

        await updateStudent(token, student.id, newStudent).then((res) => {
            let newStudents: IStudentWithCourseYearSection[] = [];

            studentList.forEach((stu) => {
                if (stu.id === student.id) {
                    newStudents.push(newStudent);
                } else {
                    newStudents.push(stu);
                }
            });
            setStudentList(newStudents);
            setSuccessMessage("Record has successfully saved.");

            setTimeout(() => {
                setSuccessMessage("");
            }, 5000);
        }).catch(err => {
            console.log("Error: ", err);
            seterrorMessage(err.response.data);
            setTimeout(() => {
                seterrorMessage("");
            }, 5000);
        });
    }

    const ApproveAll = async (status: string) => {
        setSuccessMessage("");
        seterrorMessage("");
        let newStudents: IStudentWithCourseYearSection[] = [];
        for (let i = 0; i < studentList.length; i++) {
            if (studentList[i].CompanyStatus === "pending") {
                let newStudent: any;

                newStudent = {
                    ...studentList[i],
                    CompanyStatus: status
                };

                newStudents.push(newStudent);

                setStudentList(newStudent);
                await updateStudent(token, studentList[i].id, newStudent).then((res) => {

                    setSuccessMessage("Record has successfully saved.");

                    setTimeout(() => {
                        setSuccessMessage("");
                    }, 5000);
                }).catch(err => {
                    console.log("Error: ", err);
                    seterrorMessage(err.response.data);
                    setTimeout(() => {
                        seterrorMessage("");
                    }, 5000);
                });
            }
        }

    }

    useEffect(() => {
        getSITs();
        getCompanies();
        getAllStudentWithCourseYearSection();
    }, []);

    return (
        <section className='pending-company-approval-container'>
            <div className="card">
                <h1 className="card-header">Pending company approval</h1>
                <div className="card-body">
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
                    {studentList && studentList?.length > 0 ?
                        <div className='course'>
                            <div className='row'>
                                <div className='col col-4'>
                                </div>
                                <div className='col col-2'>
                                </div>
                                <div className='col col-1'>
                                </div>
                                <div className='col col-2'>
                                </div>
                                <div className='col col-3'>
                                    <div className='stat-btn-container'>
                                        <button className='btn btn-primary' onClick={() => ApproveAll("approve")}>
                                            Approve All
                                        </button>
                                        <button className='btn btn-secondary' onClick={() => ApproveAll("deny")}>
                                            Deny All
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                        : null}
                    {studentList && studentList?.length > 0 && studentList?.map((student) => (
                        student.CompanyStatus === "pending" ?
                            <Fragment key={"student-" + student.id}>
                                <div className='course'>
                                    <div className='row'>
                                        <div className='col col-4'>
                                            <span>{student.lname + ", " + student.fname + " " + student.mname}</span>
                                        </div>
                                        <div className='col col-2'>
                                            <span>{student.mycourse.title + " " + student.myyearsection.title}</span>
                                        </div>
                                        <div className='col col-1'>
                                            <select className="form-control" name="sit" id="sit" defaultValue={student.SIT ? student.SIT : 0} onChange={(e) => onUpdateStudentSIT(student.id.toString(), e.target.value, "")}>
                                                <option disabled value={0}> -- select an SIT -- </option>
                                                {sits?.map((c) => (
                                                    c.enabled &&
                                                    <option key={"optsit-" + c.id} value={c.id}>{c.label}</option>
                                                ))}
                                            </select>
                                        </div>
                                        <div className='col col-2'>
                                            {organizeCompany(student.companyid)}
                                        </div>
                                        <div className='col col-3'>
                                            <div className='stat-btn-container'>
                                                <button className='btn btn-primary' onClick={() => onUpdateStudent("approve", student)}>
                                                    Approve
                                                </button>
                                                <button className='btn btn-secondary' onClick={() => onUpdateStudent("deny", student)}>
                                                    Deny
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </Fragment>
                            : null
                    ))}
                </div>
            </div>
        </section>
    )
}

export default Approval;