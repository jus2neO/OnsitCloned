import { useState, useEffect, useMemo, useCallback, Fragment } from 'react';
import { getAllCompany, getAllCompanyPrefCourse, getNumberOfStudentsFromCompany } from "../services/companyServices";
import { getStudentByID, updateProfile } from "../services/studentServices";
import { getAllSIT } from "../services/sitServices";
import { ICompany, IStudent, ICompanyCoursePref, ISIT } from "../services/type.interface";
import { monthDiff } from "../helper/monthDiff";
import { onMutateDateFormat } from "../services/mutation/date";
import Modal from "../common/Modal";
import NoImage from "../../assets/noimage.jpg";
import "./Company.scss";

export interface ICompaniesProps {
  studentId?: string;
}

const Companies = ({ studentId }: ICompaniesProps) => {
  const [mystudent, setMyStudent] = useState<IStudent>();
  const [SITs, setSITs] = useState<ISIT[]>();
  const [currentSITID, setCurrentSITID] = useState<number>(0)
  const [companies, setCompanies] = useState<ICompany[]>();
  const [companyIDs, setCompanyIDs] = useState<number[]>([]);
  const [companycourseprefs, setCompanycourseprefs] = useState<ICompanyCoursePref[]>();
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [successMessage, setSuccessMessage] = useState<string>("");
  const [numberOfStudents, setnumberOfStudents] = useState<any>();
  const [showModal, setShowModal] = useState<boolean>(false);
  const [currentCompanyID, setCurrentCompanyID] = useState<number>(0);
  const token = "";

  const fetchCompanies = async () => {
    await getAllCompany(token).then((res: any) => {
      setCompanies(res);
      let newIDs: any[] = [];

      res?.forEach((comp: any) => {
        newIDs.push(comp.id);
      });

      setCompanyIDs(newIDs);
    }).catch(err => {
      console.log("Error: ", err);
    });
  }

  const getSITLevel = async () => {
    await getAllSIT(token).then((res: any) => {
      setSITs(res);
    }).catch((err) => {
      console.log("Error: ", err);
    });
  }

  const fetchStudentDetails = async (id: string) => {
    await getStudentByID(token, id).then((res: any) => {
      if (res) {
        setMyStudent(res);
      }
    }).catch((err) => {
      console.log("Error: ", err);
    });
  }

  const fetchCompanyPref = async () => {
    await getAllCompanyPrefCourse(token).then((res: any) => {
      setCompanycourseprefs(res);
    }).catch(err => {
      console.log("Error: ", err);
    });
  }


  const onApplyToCompany = async (e: any) => {
    e.preventDefault();
    setErrorMessage("");
    setSuccessMessage("");
    if ((mystudent?.CompanyStatus === "deny" || mystudent?.CompanyStatus === "approve") || (mystudent && mystudent?.companyid !== currentCompanyID)) {
      const newStudent = {
        ...mystudent,
        companyid: currentCompanyID,
        CompanyStatus: "pending",
        SIT: `${currentSITID}`
      }
      await updateProfile(token, mystudent?.id, { ...newStudent, companystatusdate: "newdate" }).then((res: any) => {
        setMyStudent(newStudent);
        localStorage.setItem("currentStudent", JSON.stringify(newStudent));
        setSuccessMessage("Successfully applied to the company.");
        setCurrentSITID(0);
        setTimeout(() => {
          setSuccessMessage("");
        }, 5000);
      }).catch(err => {
        console.log("Error: ", err);
        setErrorMessage("An error occured. Please try again.");
      });
    }
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

  const onChangeSIT = (e: any) => {
    e.preventDefault();
    const sitid = e.target.value;

    setCurrentSITID(Number(sitid));
  }

  const organizeApplyBtn = useCallback((comp: ICompany, monthCount: number, expireDate: string) => {
    let isCompPref = false;
    const mycomppref = companycourseprefs?.find((pref) => { return comp.id === pref.companyid && pref.courseid === mystudent?.course });
    let isCompSlotFull = false;

    if (!numberOfStudents) return;

    if (numberOfStudents[comp.id].length >= comp.slot) {
      isCompSlotFull = true;
    }

    if (mycomppref) {
      if (comp.id === mycomppref.companyid) {
        isCompPref = true;
      }
    }

    return mystudent && isCompPref ?
      <div className='card-botton-container'>
        <p className="card-text">
          <small className="text-body-secondary">
            {!isCompSlotFull ?
              <button
                disabled={mystudent.CompanyStatus !== "approve" && mystudent.CompanyStatus !== "deny" && mystudent?.companyid === comp.id}
                type="button"
                className="btn btn-link"
                onClick={() => {
                  setCurrentCompanyID(comp.id);
                  setShowModal(true);
                }}>Apply to this company</button> :
              <span>Slot are full</span>
            }
          </small>
          {monthCount <= 3 && expireDate ?
            <span className='error'>Expire: {expireDate}</span>
            : null}
        </p>
      </div> : null
  }, [numberOfStudents, companycourseprefs, mystudent]);

  const organizeCompany = (comp: ICompany) => {
    const nowDate = new Date();
    const companyExpirationDate = new Date(comp.expiration);
    let monthCount = 0;
    let expireDate = "";
    let isExpired = false;
    if (comp.expiration) {
      monthCount = monthDiff(nowDate, companyExpirationDate);
      expireDate = onMutateDateFormat(companyExpirationDate);
      if(nowDate >= companyExpirationDate ){
        isExpired = true;
      }

      if(!comp.enabled){
        isExpired = true;
      }
    } else if(!comp.enabled){
      isExpired = true;
    }

    return (
      <Fragment key={"company-" + comp.id}>
        {!isExpired ?
          <div key={"company-" + comp.id} className='col col-md-6'>
            <div className="card mb-3">
              <div className="row g-0">
                <div className="col-md-4">
                  {comp?.icon ?
                    <img src={comp.icon} className="img-fluid rounded-start" alt={comp.name} /> :
                    <img src={NoImage} className="img-fluid rounded-start" alt={comp.name} />
                  }
                </div>
                <div className="col-md-8">
                  <div className="company card-body">
                    <div className='card-details-container'>
                      <h5 className="card-title">{comp.name}</h5>
                      <p className="card-text">{comp.description}</p>
                    </div>
                    {organizeApplyBtn(comp, monthCount, expireDate)}
                  </div>
                </div>
              </div>
            </div>
          </div>
          : null}
      </Fragment>
    )
  }

  useMemo(() => {
    if (companyIDs.length > 0) {
      onNumberOfStudentsFromCompany();
    }
  }, [companyIDs]);

  useEffect(() => {
    fetchCompanies();
    fetchCompanyPref();
    getSITLevel();
    if (studentId) {
      fetchStudentDetails(studentId);
    }
  }, [studentId]);

  return (
    <div className='row'>
      <Modal
        showSubmitBtn={false}
        isForm={true}
        cancelLabel=''
        submitLabel=''
        isDisplay={showModal}
        mysize='lg'
        onClickClose={() => setShowModal(false)}
        title='Student Appointment Preview'
      >
        <form onSubmit={onApplyToCompany}>
          <div className="form-group">
            <label htmlFor="sitlevel">SIT Level: </label>
            <select className="form-control" name="sitlevel" id="sitlevel" value={currentSITID} onChange={onChangeSIT}>
              {SITs?.map((sit) => (
                <option key={"opt-" + sit.id} value={sit.id}>{sit.label}</option>
              ))}
            </select>
          </div>
          <div className='submit-btn-container'>
            <button type='button' className='btn' onClick={() => setShowModal(false)}>
              Close
            </button>
            <button type='submit' className='btn btn-primary'>
              Submit
            </button>
          </div>

        </form>
      </Modal>
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
      {companies && companies.map((comp) => (
        organizeCompany(comp)
      ))}
    </div>
  )
}

export default Companies;