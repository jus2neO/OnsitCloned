import { useCallback, useState, useEffect } from 'react';
import { useDropzone } from 'react-dropzone';
import { onUploadStudentExcel, getAllStudents, getAllStudentsWithCourseYearSection, changeStudentPassword, deleteStudent } from "../services/studentService";
import { IStudent, IStaff, IStudentWithCourseYearSection } from "../services/type.interface";
import { Link } from "react-router-dom";
import Modal from "../common/Modal";
import copy from "copy-to-clipboard";
import "./studentporta.scss";

export interface IStudentportalProps {
  staff?: IStaff;
}

const Studentportal = ({ staff }: IStudentportalProps) => {
  const [studentList, setStudentList] = useState<IStudentWithCourseYearSection[]>([]);
  const [currentStudent, setcurrentStudent] = useState<IStudentWithCourseYearSection>();
  const [currentStudentList, setcurrentStudentList] = useState<IStudentWithCourseYearSection[]>([]);
  const [selectedStudent, setSelectedStudent] = useState<IStudentWithCourseYearSection>();
  const [password, setPassword] = useState<string>();
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [isCopied, setIsCopied] = useState<boolean>(false);
  const [file, setFile] = useState<File | undefined>();
  const [isNameSort, setIsNameSort] = useState<boolean>(false);
  const [isCourseSort, setIsCourseSort] = useState<boolean>(false);
  const [showProceed, setShowProceed] = useState<boolean>(false);
  const [formData, setFormData] = useState({
    search: ''
  });

  const { search } = formData;

  const onDrop = useCallback((acceptedFiles: File[], fileRejections: any, events: any) => {
    setFile(acceptedFiles[0]);
  }, []);
  const { isDragActive, getRootProps, getInputProps } = useDropzone({
    maxFiles: 1,
    accept: {
      files: [".xlsx", ".xlt", ".xls"]
    },
    onDrop
  });
  const token = "";

  const onSubmitForm = async (e: React.SyntheticEvent) => {
    e.preventDefault();

    if (typeof file === 'undefined') return;

    const formData = new FormData();
    formData.append('excel', file);

    await onUploadStudentExcel("", formData).then((res: any) => {
      const mystudents = studentList;
      const successStudents = res.successData;
      const newStudents = mystudents.concat(successStudents);
      setStudentList(newStudents);
      setcurrentStudentList(newStudents);
    }).catch((err) => {
      console.log("Error: ", err.message);
    });
  }

  const onRemoveStudent = async () => {
    if (currentStudent) {
      await deleteStudent(token, currentStudent.id).then((res) => {
        setcurrentStudent(undefined);
        let newList: IStudentWithCourseYearSection[] = [];
        let newList2: IStudentWithCourseYearSection[] = [];
        studentList.forEach((stud) => {
          if (currentStudent.id !== stud.id) {
            newList.push(stud);
          }
        });
        currentStudentList.forEach((stud) => {
          if (currentStudent.id !== stud.id) {
            newList2.push(stud);
          }
        });
        setStudentList(newList);
        setcurrentStudentList(newList2);
        setShowProceed(false);
      }).catch((err) => {
        console.log("Error: ", err);
      });
    }
  }

  const onSelectStudent = async (student: IStudentWithCourseYearSection) => {
    setShowPassword(true);
    setSelectedStudent(student);
    await changeStudentPassword("", student.id).then((res: any) => {
      setPassword(res.password);
    }).catch((err) => {
      console.log("Error server: ", err.message);
    });
  }

  const onCopyPassword = useCallback(() => {
    setIsCopied(true);
    if (password) copy(password);

  }, [password]);

  const onRemoveFile = (e: any) => {
    e.preventDefault();

    setFile(undefined);
  }

  const getAllStudentWithCourseYearSection = async () => {
    await getAllStudentsWithCourseYearSection(token).then((res: any) => {
      setStudentList(res);
      setcurrentStudentList(res);
    }).catch(err => {
      console.log("Error: ", err);
    });
  }

  const onChange = (e: any) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });

    if (e.target.value) {
      const arr = studentList;
      const search = e.target.value;
      const res = arr.filter(str => str.id.includes(search) || str.fname.toLowerCase().includes(search.toLowerCase()) || str.lname.toLowerCase().includes(search.toLowerCase()) || str.mname.toLowerCase().includes(search.toLowerCase()) || str.mycourse?.title.toLowerCase().includes(search.toLowerCase()) || str.myyearsection?.title.toLowerCase().includes(search.toLowerCase()));
      setcurrentStudentList(res);
    } else {
      setcurrentStudentList(studentList);
    }

  };

  const onSortBy = (sortType: string) => {
    const myStudents = currentStudentList;
    switch (sortType) {
      case "name":
        setIsNameSort(!isNameSort);
        myStudents.sort((a, b) => {
          const nameA = (a.fname + " " + a.mname + " " + a.lname).toUpperCase(); // ignore upper and lowercase
          const nameB = (b.fname + " " + b.mname + " " + b.lname).toUpperCase(); // ignore upper and lowercase

          if (isNameSort) {
            if (nameA < nameB) {
              return -1;
            }
            if (nameA > nameB) {
              return 1;
            }
          } else {
            if (nameB < nameA) {
              return -1;
            }
            if (nameB > nameA) {
              return 1;
            }
          }
          return 0;
        });
        break;
      case "section":
        setIsCourseSort(!isCourseSort);
        myStudents.sort((a, b) => {
          const nameA = (a.mycourse?.title + " " + a.myyearsection?.title).toUpperCase(); // ignore upper and lowercase
          const nameB = (b.mycourse?.title + " " + b.myyearsection?.title).toUpperCase(); // ignore upper and lowercase

          if (isCourseSort) {
            if (nameA < nameB) {
              return -1;
            }
            if (nameA > nameB) {
              return 1;
            }
          } else {
            if (nameB < nameA) {
              return -1;
            }
            if (nameB > nameA) {
              return 1;
            }
          }
          return 0;
        });
        break;
      default:

    }
  }

  const onSubmitSearch = useCallback((e: any) => {
    e.preventDefault();
  }, []);

  useEffect(() => {
    //getAllStudent();
    getAllStudentWithCourseYearSection();
  }, []);

  return (
    <section className="upload-container">
      <Modal
        showSubmitBtn={true}
        isForm={false}
        title="Delete Student?"
        cancelLabel="Close"
        submitLabel="Remove"
        isDisplay={showProceed}
        mysize='sm'
        onClickClose={(bol) => {
          setShowProceed(bol);
        }}
        onClickSubmit={() => onRemoveStudent()}>
        <p>Are you sure you want to delete this student: {currentStudent?.fname + " " + currentStudent?.mname + " " + currentStudent?.lname}</p>
      </Modal>
      <Modal
        showSubmitBtn={false}
        isForm={false}
        title="Review Student"
        cancelLabel="Close"
        submitLabel="Submit"
        isDisplay={showPassword}
        mysize='lg'
        onClickClose={(bol) => {
          setShowPassword(bol);
          setIsCopied(false);
        }} onClickSubmit={() => setShowPassword(false)}>
        <label>Student: {selectedStudent?.fname + " " + selectedStudent?.mname + " " + selectedStudent?.lname}</label>
        <div />
        <span>Password: <input className='student-pass-input' id="student-pass" type='password' value={password} /><button className='btn' onClick={onCopyPassword}>{isCopied ? <i className="bi bi-clipboard-check"></i> : <i className="bi bi-clipboard"></i>}</button>{isCopied ? <span> Copied to clipboard! </span> : null}</span>
      </Modal>
      {staff && staff.role !== 3 ?
        <form onSubmit={onSubmitForm}>
          <div {...getRootProps({ className: 'dropzone' })}>
            <input {...getInputProps()} />
            {isDragActive ? <p>Drop it here</p> : <p>Drag 'n' drop some files here, or click to select files</p>}
            <span>Can only accept xlsx, xlt, xls files</span>
          </div>
          <aside>
            <h5>File</h5>
            {file?.name && file?.size && <span>{file?.name} - {file?.size} bytes <button type="button" className='btn btn-default' onClick={onRemoveFile}><i className='bi bi-x' /></button></span>}
          </aside>
          <button type='submit' className='btn btn-primary'>Submit File</button>
        </form>
        : null}


      <div className='student-list-container'>
        <form onSubmit={onSubmitSearch}>
          <div className="input-group mb-3">
            <input type="text" className="form-control" name="search" value={search} onChange={onChange} placeholder="Search student" aria-label="Search student" aria-describedby="button-addon2" />
            <button className="btn btn-outline-secondary" type="submit" id="button-addon2"><i className="bi bi-search"></i></button>
          </div>
        </form>
        <table>
          <tr>
            <th style={{ minWidth: "50px" }}></th>
            <th style={{ minWidth: "100px" }}>ID</th>
            <th style={{ minWidth: "200px" }} onClick={() => onSortBy("name")}>Name {isNameSort ? <i className="bi bi-arrow-up"></i> : <i className="bi bi-arrow-down"></i>}</th>
            <th style={{ minWidth: "100px" }} onClick={() => onSortBy("section")}>Course Year Section {isCourseSort ? <i className="bi bi-arrow-up"></i> : <i className="bi bi-arrow-down"></i>}</th>
            <th style={{ minWidth: "200px" }}>Email</th>
            <th style={{ minWidth: "100px" }}>Contact</th>
            <th style={{ minWidth: "100px" }}>Status</th>
            <th style={{ minWidth: "100px" }}></th>
            <th style={{ minWidth: "100px" }}></th>
          </tr>

          {currentStudentList.length > 0 ? currentStudentList.map((val, i) => (
            <tr key={"students-" + i}>
              <td>
                <Link to={"/studentprofile?id=" + val.id} className='btn btn-link' aria-current="page">
                  <span className='ms-3 d-none d-sm-inline'>View</span>
                </Link></td>
              <td>{val.id}</td>
              <td>{val.fname + " " + val.mname + " " + val.lname}</td>
              <td>{val.mycourse?.title} {val.myyearsection?.title}</td>
              <td>{val.email}</td>
              <td>{val.contact}</td>
              <td>{val.status}</td>
              <td>
                {staff && staff.role !== 3 ? <button type='button' className='btn btn-link' onClick={() => onSelectStudent(val)}>Change password</button> : null}
              </td>
              <td>
                {staff && staff.role !== 3 ?
                  <button className='btn color-red'
                    onClick={() => {
                      setShowProceed(true);
                      setcurrentStudent(val);
                    }}
                  ><i className="bi bi-trash"></i></button>
                  : null}
              </td>
            </tr>
          )) : <h5>No records</h5>}

        </table>
      </div>
    </section>
  )
}

export default Studentportal;