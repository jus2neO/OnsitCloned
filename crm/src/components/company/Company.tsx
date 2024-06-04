import { useState, useEffect, Fragment, useCallback, useMemo } from 'react';
import { ICompany, ICheckBox, ICompanyPrefer, ISIT, IStaff } from "../services/type.interface";
import { getAllSIT } from "../services/sitServices";
import { addCompany, getAllCompany, addCompanyCourseRef, getAllCompanyPrefCourse, updateCompany, removeCompanyFromStudents, deleteCompanyPrefById, getNumberOfStudentsFromCompany } from "../services/companyServices";
import Button from 'react-bootstrap/Button';
import { getAllCourse } from "../services/courseServices";
import { monthDiff } from "../helpers/monthDiff";
import { useDropzone } from 'react-dropzone';
import { onMutateDateFormat } from "../services/mutation/date";
import { CSVLink } from "react-csv";
import "./company.scss";

export interface ICompanyProps {
  staff?: IStaff;
}

const Company = ({ staff }: ICompanyProps) => {
  const [companiesList, setCompaniesList] = useState<ICompany[]>([]);
  const [companies, setCompanies] = useState<ICompany[]>([]);
  const [companyIDs, setCompanyIDs] = useState<number[]>([]);
  const [selectedCompany, setselectedCompany] = useState<ICompany>();
  const [compPrefer, setCompPrefer] = useState<ICompanyPrefer[]>([]);
  const [CoursesOpt, setCoursesOpt] = useState<ICheckBox[]>([]);
  const [sits, setSITS] = useState<ISIT[]>([]);
  const [showCompanyForm, setShowCompanyForm] = useState<boolean>(false);
  const [showListOfStudents, setShowListOfStudents] = useState<boolean>(false);
  const [isUpdate, setisUpdate] = useState<boolean>(false);
  const [files, setFiles] = useState<File[] | undefined>();
  const [errorMessage, seterrorMessage] = useState<string>("");
  const [successMessage, setSuccessMessage] = useState<string>("");
  const [numberOfStudents, setnumberOfStudents] = useState<any>();
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
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    slot: 0,
    expiration: "",
  });
  const [searchformData, setsearchformData] = useState({
    search: ''
  });

  const { search } = searchformData;
  const { name, description, slot, expiration } = formData;
  const [myCSVData, setMyCSVData] = useState<any[]>([]);

  const token = "";

  const onResetForm = useCallback(() => {
    setFormData({
      name: '',
      description: '',
      slot: 0,
      expiration: ""
    });

    const newOpt: ICheckBox[] = [];
    CoursesOpt.forEach((comp: any) => {
      newOpt.push({
        ...comp,
        isSelected: false
      });
    });
    setCoursesOpt(newOpt);
    setFiles(undefined);
    setselectedCompany(undefined);
    setSuccessMessage("");
    seterrorMessage("");
  }, [CoursesOpt]);


  const onClickAddCompany = () => {
    onResetForm();
    setShowCompanyForm(true);
    setisUpdate(false);
    setShowListOfStudents(false);
  }

  const onEditCompany = useCallback((company: ICompany) => {
    setSuccessMessage("");
    seterrorMessage("");
    setisUpdate(true);
    setselectedCompany(company);
    setShowCompanyForm(true);
    setShowListOfStudents(false);
    let newOpts: ICheckBox[] = [];
    CoursesOpt.forEach((opt) => {
      const mycourse = compPrefer.find((cpmf) => { return cpmf.companyid === company.id && cpmf.courseid === Number(opt.value) });
      if (mycourse) {
        newOpts.push({
          ...opt,
          isSelected: true
        });
      } else {
        newOpts.push({
          ...opt,
          isSelected: false
        });
      }
    });
    setCoursesOpt(newOpts);
    let mystart;
    let newMonth;
    let newDay;
    let newStart = "";

    if(company.expiration){
      mystart = new Date(company.expiration.toString());
      newMonth = (mystart.getMonth() + 1).toString().length === 1 ? "0" + (mystart.getMonth() + 1).toString() : (mystart.getMonth() + 1).toString();
      newDay = mystart.getDate().toString().length === 1 ? "0" + mystart.getDate().toString() : mystart.getDate().toString();
      newStart = mystart.getFullYear().toString() + "-" + newMonth + "-" + newDay;
    }

    setFormData({
      name: company.name,
      slot: company.slot,
      description: company.description,
      expiration: newStart
    })
  }, [CoursesOpt, compPrefer]);

  const onSelectCompany = useCallback((company: ICompany) => {
    setShowListOfStudents(true);
    setShowCompanyForm(false);
    setselectedCompany(company);

  }, []);

  const onDisableSITLevel = async (comp: ICompany) => {
    let newComp: ICompany = {
      ...comp,
      enabled: false
    }
    const company = await updateCompany(token, comp.id.toString(), newComp).then((res) => {
      let newComps: ICompany[] = [];
      companies.forEach((cmp) => {
        if (cmp.id === comp.id) {
          newComps.push({
            ...cmp,
            enabled: false
          })
        } else {
          newComps.push(cmp);
        }
      });
      setCompaniesList(newComps);
      setCompanies(newComps);
      Promise.resolve(true);
    }).catch(err => {
      console.log("Error: ", err);
      Promise.reject(false);
      seterrorMessage("An error occured. Please try again.");
    });

    const students = await removeCompanyFromStudents(token, comp.id.toString(), { companyid: comp.id, CompanyStatus: "pending" }).then(res => {
      Promise.resolve(true);
    }).catch((err) => {
      console.log("Error: ", err);
      seterrorMessage("An error occured. Please try again.");
    });

    Promise.all([company, students]).then((res) => {
      setSuccessMessage("Successfully updated!!!");
      setTimeout(() => {
        setSuccessMessage("");
      }, 5000);
    }).catch((err) => {
      seterrorMessage("An error occured. Please try again.");
      setTimeout(() => {
        seterrorMessage("");
      }, 5000);
    });
  }

  const getCourse = async () => {
    await getAllCourse(token).then((res: any) => {
      if (res) {
        const newCompanies = res.filter((comp: any) => { return comp.enabled });
        const newOpt: ICheckBox[] = [];
        newCompanies.forEach((comp: any) => {
          newOpt.push({
            value: comp.id,
            isSelected: false,
            label: comp.title
          });
        });
        setCoursesOpt(newOpt);
      }
    }).catch((err) => {
      console.log("Error: ", err);
    });
  }

  const onCheckChange = (e: any, opt: ICheckBox) => {
    let newCourseOpt: ICheckBox[] = [];
    CoursesOpt.forEach((myopt) => {
      if (opt.value === myopt.value) {
        newCourseOpt.push({
          ...myopt,
          isSelected: !opt.isSelected
        });
      } else {
        newCourseOpt.push(myopt);
      }
    });

    setCoursesOpt(newCourseOpt);
  }

  const onSubmitCompany = async (e: any) => {
    e.preventDefault();
    if (isUpdate) {
      if (selectedCompany) {
        let newComp: ICompany = selectedCompany;
        newComp.name = name;
        newComp.slot = slot;
        newComp.description = description;
        newComp.expiration = new Date(expiration);

        const myCompPref = compPrefer.filter((compf) => { return compf.companyid === selectedCompany.id });
        let removePrefList: number[] = [];
        let addPrefList: ICheckBox[] = [];

        CoursesOpt.forEach((opt) => {
          if (opt.isSelected) {
            const myopt = myCompPref.find((comp) => { return comp.courseid === Number(opt.value) });
            if (!myopt) {
              addPrefList.push(opt);
            }
          } else {
            const myopt = myCompPref.find((comp) => { return comp.courseid === Number(opt.value) });
            if (myopt) {
              removePrefList.push(myopt.id);
            }
          }
        });

        await AddCoursePref(selectedCompany.id.toString(), addPrefList).then((res) => {

        }).catch((err) => {
          console.log("Error: ", err);
        });

        //deleteCompanyPrefById
        let newCompPrefer = compPrefer;
        for (let i = 0; i < removePrefList.length; i++) {
          await deleteCompanyPrefById(token, removePrefList[i].toString()).then((res) => {
            const myCompPIndex = compPrefer.findIndex((compP) => { return compP.id === removePrefList[i] });
            newCompPrefer.splice(myCompPIndex, 1);
          }).catch((err) => {
            console.log("Error: ", err);
            seterrorMessage("An error occured. Please try again.");
          });
        }
        setCompPrefer(newCompPrefer);

        if (files) {
          await onUpdatedCompanyAndUploadFile(newComp, files[0]).then((res) => {
            setSuccessMessage("Successfully updated!!!");
            setFiles(undefined);
          }).catch((err) => {
            console.log("Error: ", err);
            seterrorMessage("An error occured. Please try again.");
          });
        } else {
          await updateCompany(token, selectedCompany.id.toString(), newComp).then((res) => {
            let newComps: ICompany[] = [];
            companies.forEach((cmp) => {
              if (cmp.id === selectedCompany.id) {
                newComps.push(newComp)
              } else {
                newComps.push(cmp);
              }
            });
            setCompaniesList(newComps);
            setCompanies(newComps);
            setSuccessMessage("Successfully updated!!!");
          }).catch(err => {
            console.log("Error: ", err);
            seterrorMessage("An error occured. Please try again.");
          });
        }
      }
    } else {
      if (files) {
        await onAddCompanyAndUploadFile(formData, files[0]).then((res) => {
          onResetForm();
          setShowCompanyForm(false);
          setFiles(undefined);
        }).catch((err) => {
          console.log("Error: ", err);
          seterrorMessage("An error occured. Please try again.");
        });
      } else {
        await addCompany(token, formData).then((res: any) => {
          onResetForm();
          const mycompany: ICompany[] = [];
          companies.forEach((comp) => {
            mycompany.push(comp);
          });
          mycompany.push(res);
          setCompaniesList(mycompany);
          setCompanies(mycompany);
          onAddCoursePref(res.id);
          setShowCompanyForm(false);
        }).catch((err) => {
          console.log("Error: ", err);
          seterrorMessage("An error occured. Please try again.");
        });
      }
    }
  }

  const onAddCoursePref = async (companyid: string) => {
    const compref = CoursesOpt.filter((opt) => { return opt.isSelected });

    await AddCoursePref(companyid, compref);
  }

  const AddCoursePref = async (companyid: string, compref: ICheckBox[]) => {

    for (let i = 0; i < compref.length; i++) {
      const newData = {
        companyid: companyid,
        courseid: compref[i].value
      }
      await addCompanyCourseRef(token, newData).then((res: any) => {
        let newCompPref = compPrefer;
        newCompPref.push(res);
        setCompPrefer(newCompPref);
      }).catch(err => {
        console.log("Error: ", err);
        seterrorMessage("An error occured. Please try again.");
      });
    }
  }

  const onAddCompanyAndUploadFile = async (data: any, file: File) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = async function () {
      const myBase64 = reader.result;
      //const arrStr = myBase64?.toString().split("data:application/pdf;base64,");
      let newData
      //if(arrStr){
      newData = {
        ...data,
        iconname: file.name,
        size: file.size,
        filetype: file.type,
        icon: myBase64
      }
      //}

      return await addCompany(token, newData).then((res: any) => {
        const mycompany: ICompany[] = [];
        companies.forEach((comp) => {
          mycompany.push(comp);
        });
        mycompany.push(res);
        setCompaniesList(mycompany);
        setCompanies(mycompany);
        onAddCoursePref(res.id);
        return res;
      }).catch((err) => {
        console.log("Error: ", err);
        seterrorMessage("An error occured. Please try again.");
      });
    };
    reader.onerror = function () {
      console.log("Error: ", reader.error);
    };

  }

  const onUpdatedCompanyAndUploadFile = async (data: any, file: File) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = async function () {
      const myBase64 = reader.result;
      //const arrStr = myBase64?.toString().split("data:application/pdf;base64,");
      //if(arrStr){
      let newData: any = {
        ...data,
        iconname: file.name,
        size: file.size,
        filetype: file.type,
        icon: myBase64
      }
      //}
      if (selectedCompany) {
        return await updateCompany(token, selectedCompany.id.toString(), newData).then((res: any) => {
          let newComps: ICompany[] = [];
          setselectedCompany(newData);
          companies.forEach((cmp) => {
            if (cmp.id === selectedCompany.id) {
              newComps.push(newData);
            } else {
              newComps.push(cmp);
            }
          });
          setCompaniesList(newComps);
          setCompanies(newComps);
          return res;
        }).catch((err) => {
          console.log("Error: ", err);
          seterrorMessage("An error occured. Please try again.");
        });
      }
    };
    reader.onerror = function () {
      console.log("Error: ", reader.error);
    };

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

  const getCompanies = async () => {
    await getAllCompany(token).then((res: any) => {
      setCompaniesList(res);
      setCompanies(res);
      let newIDs: any[] = [];

      res?.forEach((comp: any) => {
        newIDs.push(comp.id);
      });

      setCompanyIDs(newIDs);
    }).catch(err => {
      console.log("Error: ", err);
    })
  }

  const getCompaniesPrefCourse = async () => {
    await getAllCompanyPrefCourse(token).then((res: any) => {
      setCompPrefer(res);
    }).catch(err => {
      console.log("Error: ", err);
    })
  }

  const onNumberOfStudentsFromCompany = async () => {
    const data = {
      companyIDs: companyIDs
    };
    await getNumberOfStudentsFromCompany(token, data).then((res: any) => {
      setnumberOfStudents(res);
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

  const onGetSIT = useCallback((id: string) => {
    const mySIT = sits.find((sit) => { return sit.id.toString() === id });
    return mySIT?.label;
  }, [sits]);

  const organizeCompany = (comp: ICompany) => {
    const nowDate = new Date();
    const companyExpirationDate = new Date(comp.expiration);
    let monthCount = 0;
    let expireDate = "";
    if(comp.expiration){
      monthCount = monthDiff(nowDate, companyExpirationDate);
      expireDate = onMutateDateFormat(companyExpirationDate);
    }
    return <Fragment key={"company-" + comp.id}>
      {comp.enabled ? (
        <div className='company'>
          <button className={'btn' + (selectedCompany?.id === comp.id ? " active" : "")} onClick={() => onSelectCompany(comp)}>
            <label>{comp.name}</label>
            {
              numberOfStudents && numberOfStudents[comp.id] && "(" + numberOfStudents[comp.id].length + ")"
            }
          </button>
          {staff && staff.role !== 3 ?
            <Fragment>
              <button className='btn' onClick={() => onEditCompany(comp)}>
                <i className='bi bi-pencil' />
              </button>
              <CSVLink
                data={myCSVData}
                filename={comp.name + "-" + (new Date().getFullYear().toString() + "-" + (new Date().getMonth() + 1).toString() + "-" + new Date().getDate().toString()).toString() + ".csv"}
                asyncOnClick={true}
                onClick={() => onClickPrint(comp)}
              >
                <i className="bi bi-printer"></i>
              </CSVLink>
              <button className='btn' onClick={() => onDisableSITLevel(comp)}>
                <i className='bi bi-x' />
              </button>
              {monthCount <= 3 && expireDate?
              <span className='color-red'>Expire: {expireDate}</span>
              : null}
            </Fragment> : null}

        </div>
      ) : null}
    </Fragment>
  }

  const onChange = (e: any) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmitSearch = useCallback((e: any) => {
    e.preventDefault();
    if (search) {
      const arr = companiesList;
      const res = arr.filter(str => str.name.toLowerCase().includes(search.toLowerCase()) || str.description.toLowerCase().includes(search.toLowerCase()));
      setCompanies(res);
    } else {
      setCompanies(companiesList);
    }

  }, [search]);

  const onClickPrint = async (company: ICompany) => {
    let csvData: any = [];
    csvData.push([company.name, ""]);
    numberOfStudents[company.id].forEach((stud: any) => {
      csvData.push(["", stud.fname + " " + stud.mname + " " + stud.lname]);
    });

    setMyCSVData(csvData);
  }

  const onSearchChange = (e: any) => {
    setsearchformData({ ...searchformData, [e.target.name]: e.target.value });
  };

  useMemo(() => {
    if (companyIDs.length > 0) {
      onNumberOfStudentsFromCompany();
    }
  }, [companyIDs]);

  useEffect(() => {
    getCompanies();
    getCompaniesPrefCourse();
    getCourse();
    getSITs();
  }, []);

  return (
    <div className='company-configuration-container'>
      {
        /*
          <div className='print-pdf-container'>
            <a href='printcompany' target='_blank'>
              <i className="bi bi-printer"></i> Print/Export
            </a>
          </div>
        */
      }

      <div>
        <h1>Company Configuration</h1>
        <form onSubmit={onSubmitSearch}>
          <div className="input-group mb-3">
            <input type="text" className="form-control" name="search" value={search} onChange={onSearchChange} placeholder="Search Company" aria-label="Search Company" aria-describedby="button-addon2" />
            <button className="btn btn-outline-secondary" type="submit" id="button-addon2"><i className="bi bi-search"></i></button>
          </div>
        </form>
        <div className='row'>
          <div className='col col-4 company-container'>
            <label>Companies</label>
            <div className='company-list'>
              {companies?.map((comp) => (
                organizeCompany(comp)
              ))}
            </div>
            <div>
              {staff && staff.role !== 3 ? <button type='button' className='btn add-btn' aria-label='add Company' onClick={onClickAddCompany}>
                <i className='bi bi-plus' />
              </button> : null}
            </div>
          </div>
          <div className='col col-8 company-form'>
            {showListOfStudents ?
              <Fragment>
                <div className='row'>
                  <div className='col col-5'>
                    <b>Student Name</b>
                  </div>
                  <div className='col col-2'>
                    <b>SIT #</b>
                  </div>
                  <div className='col col-5'>
                    <b>Course Year and Section</b>
                  </div>
                </div>
                {
                  numberOfStudents && selectedCompany && numberOfStudents[selectedCompany?.id] ?
                    numberOfStudents[selectedCompany.id].map((student: any) => (
                      <div key={"student-" + student.id} className='row'>
                        <div className='col col-5'>
                          {student.lname + ", " + student.fname + " " + student.mname}
                        </div>
                        <div className='col col-2'>
                          {
                            onGetSIT(student.SIT)
                          }
                        </div>
                        <div className='col col-5'>
                          {
                            (student?.mycourse?.title ? student?.mycourse?.title : "") + " " + (student.myyearsection?.title ? student.myyearsection?.title : "")
                          }
                        </div>
                      </div>
                    ))
                    : null
                }
              </Fragment>
              : null}
            {showCompanyForm ?
              <Fragment>
                <h4>Company configuration</h4>
                <form onSubmit={onSubmitCompany}>
                  <div className="form-group">
                    <label htmlFor="name">Company Name</label>
                    <input
                      type="text"
                      className="form-control"
                      id="name"
                      name='name'
                      aria-describedby="emailHelp"
                      placeholder="Enter Company Name"
                      value={name}
                      onChange={onChange}
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="name">Company Description</label>
                    <textarea
                      className="form-control"
                      id="description"
                      name='description'
                      aria-describedby="emailHelp"
                      placeholder="Enter Company Name"
                      value={description}
                      onChange={onChange}
                    >

                    </textarea>
                  </div>
                  <div className="form-group">
                    <label htmlFor="slot">Number of slot</label>
                    <input
                      className="form-control"
                      type='number'
                      id="slot"
                      name='slot'
                      placeholder="Enter number of slot"
                      value={slot}
                      onChange={onChange}
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="expiration">Contract Expiration</label>
                    <input
                      type="date"
                      className="form-control"
                      id="expiration"
                      name='expiration'
                      aria-describedby="emailHelp"
                      placeholder="Select a date"
                      value={expiration.toString()}
                      onChange={onChange}
                    />
                  </div>
                  <div {...getRootProps({ className: 'dropzone' })}>
                    <input {...getInputProps()} />
                    <i className="bi bi-cloud-upload"></i>
                    {isDragActive ? <p>Drop it here</p> : <p>Drag 'n' drop some files here, or click to select files</p>}
                    <span>Can only accept .jpeg, .jpg, .png, .svg file</span>
                  </div>
                  <aside>
                    <div className="row">
                      {selectedCompany?.iconname ?
                        <div>
                          <h5>Company Icon</h5>
                          <div className="upload-icon">
                            <img src={selectedCompany.icon} />
                          </div>
                        </div>
                        : null}
                      {files && files?.length > 0 ? <h5>New Company Icon</h5> : null}
                      {files?.map((file) => (
                        file?.name && file?.size &&
                        <div key={"file-" + file.name} className="file-container col col-md-3">
                          <div className="upload-icon">
                            <img src={URL.createObjectURL(files[0])} />
                          </div>
                          <span>{file?.name} - {file?.size} bytes <button type="button" className='btn btn-default' onClick={() => onRemoveFile(file)}><i className='bi bi-x' /></button></span>
                        </div>
                      ))}
                    </div>
                  </aside>
                  <div className="form-group">
                    <label htmlFor="slot">Preferred</label>
                    {CoursesOpt.map((opt) => (
                      <div key={"opt-" + opt.value} className="form-check">
                        <input className="form-check-input" type="checkbox" value="" id={"flexCheckDefault-" + opt.value} onChange={(e) => onCheckChange(e, opt)} checked={opt.isSelected} />
                        <label className="form-check-label" htmlFor={"flexCheckDefault-" + opt.value}>
                          {opt.label}
                        </label>
                      </div>
                    ))}
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
                  <Button variant="primary" type='submit'>
                    {isUpdate ? "Update" : "Create"}
                  </Button>
                </form>
              </Fragment>
              : null}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Company;