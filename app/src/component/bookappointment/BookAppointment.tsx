import { useState, useEffect, Fragment, useCallback, useMemo } from "react";
import { getAllSIT, getAllSITRequirements } from "../services/sitServices";
import { getMyAppointmentsByStudentID, updateAppointment, addAppointmentFiles, deleteAppointmendFile, getMyAppointmentsByDate } from "../services/appointmentsServices";
import { onMutateDateFormat } from "../services/mutation/date";
import { onMutateDateTimeFormat, onMutateTime } from "../services/mutation/date";
import { getListOfCountLimit } from "../services/mutation/countlimit";
import { base64toBlob } from "../services/mutation/base64";
import { ISITLevel, ISITRequirement, IStudent, IAppointment, IAppointmentFile, ISettings } from "../services/type.interface";
import { useDropzone } from 'react-dropzone';
import Button from 'react-bootstrap/Button';
import Modal from "../common/Modal";
import FullScreen from "../common/FullScreen";
import Calendar from "../calendar/Calendar";
import { Link } from "react-router-dom";
import { getSettings } from "../services/settingsServices";
import "./BookAppointment.scss";

export interface IBookAppointmentProps {
  user?: IStudent;
}

const BookAppointment = ({ user }: IBookAppointmentProps) => {
  const [SITLevels, setSITLevels] = useState<ISITLevel[]>([]);
  const [appointments, setAppointments] = useState<IAppointment[]>([]);
  const [SITRequirements, setSITRequirements] = useState<ISITRequirement[]>([]);
  const [currentAppointments, setCurrentAppointments] = useState<IAppointment[]>();
  const [slotlimits, setSlotLimits] = useState<number[]>();
  const [currentSITRequirements, setCurrentSITRequirements] = useState<ISITRequirement[]>([]);
  const [currentAppointment, setCurrentAppointment] = useState<IAppointment>();
  const [currentAppointmentFiles, setCurrentAppointmentFiles] = useState<IAppointmentFile[]>();
  const [deleteFiles, setDeleteFiles] = useState<IAppointmentFile[]>([]);
  const [showPreview, setShowPreview] = useState<boolean>(false);
  const [myBlob, setMyBlob] = useState<string>('');
  const [currentSIT, setCurrentSIT] = useState<ISITLevel>();
  const [successMessage, setSuccessMessage] = useState<string>("");
  const [errorMessage, setErrorMessage] = useState<string>();
  const [time, setTime] = useState<string>('');
  const [files, setFiles] = useState<File[] | undefined>();
  const [isFullScreen, setIsFullScreen] = useState<boolean>(false);
  const [settings, setSettings] = useState<ISettings>();

  const onDrop = useCallback((acceptedFiles: File[], fileRejections: any, events: any) => {
    setFiles(acceptedFiles);
  }, []);
  const { isDragActive, getRootProps, getInputProps } = useDropzone({
    accept: {
      files: [".pdf"]
    },
    onDrop
  });
  const [formData, setFormData] = useState({
    studentid: '',
    start: '',
    end: '',
    sitlevel: ''
  });
  const [formRejectData, setFormRejectData] = useState({
    note: ''
  });
  const { note } = formRejectData;
  const { studentid, start, end, sitlevel } = formData;
  const token = "";

  const onRemoveFile = (myfile: File) => {
    let newFiles: File[] = [];

    files?.forEach((file) => {
      if (file.name !== myfile.name) {
        newFiles.push(file);
      }
    });

    setFiles(newFiles);
  }

  const onResetForms = () => {
    setFormData({
      studentid: '',
      start: '',
      end: '',
      sitlevel: ''
    });
    setFormRejectData({
      note: ''
    });
    setCurrentAppointmentFiles([]);
    setCurrentAppointment(undefined);
    setDeleteFiles([]);
  }

  const getSITLevel = async () => {
    await getAllSIT(token).then((res: any) => {
      setSITLevels(res);
      setCurrentSIT(res[0]);
      getSITRequirements(res[0].id);
    }).catch((err) => {
      console.log("Error: ", err);
    });
  }

  const getSITRequirements = async (currentID: number) => {
    await getAllSITRequirements(token).then((res: any) => {
      setSITRequirements(res);
      const newRequirements = res.filter((req: any) => { return req.sitlevel === currentID });
      setCurrentSITRequirements(newRequirements);
    }).catch((err) => {
      console.log("Error: ", err);
    });
  }

  const onSelectSIT = (sit: ISITLevel) => {
    setCurrentSIT(sit);
    const newRequirements = SITRequirements.filter((req) => { return req.sitlevel === sit.id });
    setCurrentSITRequirements(newRequirements);
  }

  const getAppointments = async () => {
    if (user) {
      await getMyAppointmentsByStudentID(token, user?.id).then((res: any) => {
        setAppointments(res);
      }).catch((err) => {
        console.log("Error: ", err);
      });
    }
  }

  const onSubmitAppointment = async (e: any) => {
    e.preventDefault();

    if (currentAppointment?.status === "reject") {
      setErrorMessage("");

      const listOfTime = ["08:00-09:45", "10:00-11:45", "13:00-14:45", "15:00-16:45"];
      const myIndex = listOfTime.findIndex((mytime) => { return mytime === time });

      if ((slotlimits ? (settings ? settings.slotlimit : 25) - slotlimits[myIndex] : 0) <= 0) {
        setErrorMessage("Time slot is already full.");
        return;
      }

      const arrampmTime = time.split("-");
      const arrTime = arrampmTime[0].split(":");

      if (arrTime && Number(arrTime[0]) > 18) {
        setErrorMessage("Please select a time below 6 pm");
        return;
      }

      if (arrTime && Number(arrTime[0]) < 8) {
        setErrorMessage("Please select a time above 8 am");
        return;
      }

      if (!start) {
        setErrorMessage("Please select a date");
        return;
      }

      if (new Date(start) < new Date()) {
        setErrorMessage("Please select a date that is greater than or equals from today");
        return;
      }

      if (!time) {
        setErrorMessage("Please select a time");
        return;
      }

      const mystart = new Date(start);

        if(mystart.getDay() === 0) {
            setErrorMessage("Appointments can't be set on sunday.");
            return;
        }

        if(mystart.getDay() === 6 && !settings?.issaturdayopen) {
            setErrorMessage("Appointments can't be set on sunday.");
            return;
        }

      /*if(!files || files?.length === 0) {
          setErrorMessage("Please upload requirements");
          return;
      }*/
      try {
        let newHrs = arrTime[0];
        let newMins = (Number(arrTime[1]) + 30).toString();
        let newTime = '';

        if (Number(newMins) >= 60) {
          newHrs = (Number(newHrs) + 1).toString();
          newMins = (Number(newMins) - 60).toString();

          if (newMins.length === 1) {
            newMins = "0" + newMins;
          }
        }

        newTime = newHrs + ":" + newMins;

        const newDate = start + " " + arrampmTime[0];
        const newDateEnd = start + " " + arrampmTime[1];

        const newFormData = {
          studentid: user?.id,
          start: new Date(newDate).toString(),
          end: new Date(newDateEnd).toString(),
          sitlevel: Number(sitlevel),
          status: "pending"
        }


        const res = await updateAppointment(token, currentAppointment.id.toString(), newFormData).then((res: any) => {
          return res;
        }).catch((err) => {
          console.log("Error: ", err);
          setErrorMessage("An error occured.");
          return false;
        });

        if (res) {
          let newFiles: any[] = [];
          let myapps = appointments;
          let myapp = myapps.find((app) => { return app.id === currentAppointment.id });
          if (files) {
            for (let i = 0; i < files?.length; i++) {
              const fileres = await onUploadFile(res.id, files[i]).then((fileres) => {
                return fileres;
              }).catch((fileerr) => {
                console.log("Errro: ", fileerr);
                return false;
              });
              console.log("I a here: ", fileres);
              if (fileres) newFiles.push(fileres);
            }
          }

          deleteFiles.forEach((file) => {
            onDeleteFiles(file.id.toString()).then((dfileres) => {
            }).catch((dfileerr) => {
              console.log("Error: ", dfileerr);
            });
          });

          if (myapp) {
            let myappindex = myapps.findIndex((app) => { return app.id === currentAppointment.id });
            myapp = {
              ...myapp,
              ...res,
              appointmentsFiles: newFiles.concat(currentAppointmentFiles)
            }

            if (myapp) {
              myapps.splice(myappindex, 1, myapp);
              setAppointments(myapps);
            }
          }
          onResetForms();
          setShowPreview(false);
        }

        setSuccessMessage("Update was successful. Refreshing the page...");
        setTimeout(() => {
          window.location.href = "/bookappointment";
        }, 3000);
      } catch (err) {
        setErrorMessage("An error occured");
      }


    }
  }

  const onDeleteFiles = async (id: string) => {
    await deleteAppointmendFile(token, id).then((res) => {

    }).catch((err) => {
      console.log("Error: ", err);
    });
  }

  const onUploadFile = async (appointId: string, file: File) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = async () => {
      const myBase64 = reader.result;
      let newData
      newData = {
        id: appointId,
        filename: file.name,
        size: file.size,
        type: file.type,
        file: myBase64
      }

      await addAppointmentFiles(token, newData).then((res) => {
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

  const onClickAppointment = async (app: IAppointment) => {
    setDeleteFiles([]);
    const mystart = new Date(app.start);
    const myend = new Date(app.end);
    const newMonth = (mystart.getMonth() + 1).toString().length === 1 ? "0" + (mystart.getMonth() + 1).toString() : (mystart.getMonth() + 1).toString();
    const newDay = mystart.getDate().toString().length === 1 ? "0" + mystart.getDate().toString() : mystart.getDate().toString();
    const newStart = mystart.getFullYear().toString() + "-" + newMonth + "-" + newDay;
    const newHrs = mystart.getHours().toString().length === 1 ? "0" + mystart.getHours().toString() : mystart.getHours().toString();
    const newMins = mystart.getMinutes().toString().length === 1 ? "0" + mystart.getMinutes().toString() : mystart.getMinutes().toString();

    const newEndHrs = myend.getHours().toString().length === 1 ? "0" + myend.getHours().toString() : myend.getHours().toString();
    const newEndMins = myend.getMinutes().toString().length === 1 ? "0" + myend.getMinutes().toString() : myend.getMinutes().toString();
    setFormData({
      ...formData,
      start: newStart,
      sitlevel: app.sitlevel.toString()
    });
    setTime(newHrs + ":" + newMins + "-" + newEndHrs + ":" + newEndMins);
    setFormRejectData({
      ...formRejectData,
      note: app.note
    })
    setCurrentAppointment(app);
    setCurrentAppointmentFiles(app.appointmentsFiles);
    setShowPreview(true);
    const datestr = onMutateDateFormat(new Date(app.start));
    await fetchAppointments(datestr);
  }

  const onChangeSIT = (e: any) => {
    e.preventDefault();
    const sitid = e.target.value;
    setFormData({
      ...formData,
      sitlevel: sitid
    });
    const mySIT = SITLevels.find((sit) => { return Number(sitid) === sit.id });
    setCurrentSIT(mySIT);
    const newRequirements = SITRequirements.filter((req) => { return req.sitlevel === Number(sitid) });
    setCurrentSITRequirements(newRequirements);
  }

  const onOpenBlob = (val: string) => {
    setMyBlob(base64toBlob(val));
  }

  const onTimeChange = useCallback((e: any) => {

    setTime(e.target.value);
  }, [start]);

  const onClickRemoveFile = useCallback((myfile: IAppointmentFile) => {
    let listOfRemoveFile = deleteFiles;
    listOfRemoveFile.push(myfile);
    setDeleteFiles(listOfRemoveFile);
    let myAppointment = currentAppointmentFiles;
    if (myAppointment) {
      let newFiles: IAppointmentFile[] = [];
      myAppointment.forEach((file) => {
        if (file.id !== myfile.id) {
          newFiles.push(file);
        }
      });
      setCurrentAppointmentFiles(newFiles);
    }

  }, [currentAppointmentFiles, deleteFiles]);

  const fetchAppointments = async (date: string) => {
    await getMyAppointmentsByDate(token, date).then((res: any) => {
      setCurrentAppointments(res);
      const items = getListOfCountLimit(res);
      setSlotLimits(items);
    }).catch(err => {
      console.log("Error: ", err);
    });
  }

  const onDateChange = async (e: any) => {
    onChange(e);
    const date = new Date(e.target.value);
    const datestr = onMutateDateFormat(date);
    await fetchAppointments(datestr);
  }

  const fetchSettings = async () => {
    await getSettings(token).then((res: any) => {
      setSettings(res[0]);
    }).catch(err => {
      console.log("Error: ", err);
    })
  }

  const onChange = (e: any) => setFormData({ ...formData, [e.target.name]: e.target.value });

  useEffect(() => {
    if (user) {
      getSITLevel();
      getAppointments();
      fetchSettings();
    }
  }, [user]);

  return (
    <Fragment>
      {user ?
        <div className="book-appointment">

          <Fragment>
            {successMessage ?
              <div className="alert alert-success" role="alert">
                {successMessage}
              </div>
              : null}
            <Modal
              showSubmitBtn={true}
              isForm={true}
              cancelLabel=''
              submitLabel=''
              isDisplay={showPreview}
              mysize='lg'
              onClickClose={() => setShowPreview(false)}
              title='Student Appointment Preview'
            >
              <form onSubmit={onSubmitAppointment}>
                <div className="form-group">
                  <label htmlFor="dateappointment">Date of appointment</label>
                  {currentAppointment?.status === "reject" ?
                    <input
                      type="date"
                      className="form-control"
                      id="dateappointment"
                      name='start'
                      aria-describedby="emailHelp"
                      placeholder="Select a date"
                      value={start}
                      onChange={onDateChange}
                    />
                    :
                    <div><b>{start}</b></div>
                  }

                </div>
                <div className="form-group">
                  <label htmlFor="timeappointment">Preffered Time: </label>
                  {currentAppointment?.status === "reject" ?
                    <Fragment>
                      {
                        /*
                        <input
                        type="time"
                        className="form-control"
                        value={time}
                        onChange={onTimeChange}
                      />
                      */
                      }

                      <select className="form-control" name="sitlevel" id="sitlevel" value={time} onChange={onTimeChange}>
                        <option disabled value={""}> -- select a time -- </option>
                        <option value={"08:00-09:45"}>08:00am to 9:45am Slots available: {"(" + (slotlimits ? (settings ? settings.slotlimit : 25) - slotlimits[0] : 0) + ")"}</option>
                        <option value={"10:00-11:45"}>10:00am to 11:45am Slots available: {"(" + (slotlimits ? (settings ? settings.slotlimit : 25) - slotlimits[1] : 0) + ")"}</option>
                        <option value={"13:00-14:45"}>01:00pm to 2:45pm Slots available: {"(" + (slotlimits ? (settings ? settings.slotlimit : 25) - slotlimits[2] : 0) + ")"}</option>
                        <option value={"15:00-16:45"}>03:00pm to 04:45pm Slots available: {"(" + (slotlimits ? (settings ? settings.slotlimit : 25) - slotlimits[3] : 0) + ")"}</option>
                      </select>
                    </Fragment>


                    :
                    <div><b>{currentAppointment && onMutateTime(new Date(currentAppointment?.start))}</b></div>
                  }
                </div>
                <div className="form-group">
                  <label htmlFor="sitlevel">SIT Level: </label>
                  {currentAppointment?.status === "reject" ?
                    <select className="form-control" name="sitlevel" id="sitlevel" value={sitlevel} onChange={onChangeSIT}>
                      {SITLevels?.map((sit) => (
                        sit.enabled ?
                        <option key={"opt-" + sit.id} value={sit.id}>{sit.label}</option>
                        : null
                      ))}
                    </select>
                    :
                    <div><b>{currentAppointment?.sit?.label}</b></div>
                  }

                </div>

                {currentAppointment?.status === "reject" ?
                  <div className="form-group">
                    <label htmlFor="note">Note: </label>
                    <div><b>{currentAppointment?.note}</b></div>
                  </div>
                  : null}
                {/*
                      <textarea
                          id="note"
                          name="note"
                          className="form-control"
                          value={note}
                          onChange={onNoteChange}
                        /> 
                      */}
                {isFullScreen &&
                  <FullScreen isDisplay={isFullScreen} onClickClose={setIsFullScreen}>
                    <iframe width={"100%"} height={"100%"} src={myBlob} />
                  </FullScreen>
                }
                <h3>Files</h3>
                {
                  myBlob &&
                  <div className='viewer'>
                    <div className='close-container'>
                      <button type='button' className='btn btn-danger' onClick={() => setMyBlob('')}>
                        Close
                      </button>
                      <button type='button' className='btn btn-info' onClick={() => setIsFullScreen(true)}>
                        Full screen
                      </button>
                    </div>
                    <iframe width={"100%"} height={"500px"} src={myBlob} />
                  </div>
                }
                <div className='row files-container'>
                  {
                    currentAppointmentFiles?.map((file) => (
                      <div key={"file-" + file.id} className='file-requirement col col-md-3'>
                        <button type='button' className='btn' onClick={() => onOpenBlob(file.file)}>
                          <div className='icon'>
                            <i className="bi bi-file-pdf" />
                          </div>
                          <div className='label'>
                            <label>{file.filename}</label>
                          </div>
                        </button>
                        {currentAppointment?.status === "reject" ?
                          <div className="remove-btn">
                            <button type="button" className="btn btn-danger" onClick={() => onClickRemoveFile(file)}><i className="bi bi-x" /></button>
                          </div> : null}

                      </div>
                    ))
                  }
                </div>
                {currentAppointment?.status === "reject" ?
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
                  : null}
                {errorMessage ?
                  <div className="alert alert-danger" role="alert">
                    {errorMessage}
                  </div>
                  : null}

                <div className='sit-level-btn-container'>
                  <div className='divider' />
                  <Button variant="secondary" onClick={() => setShowPreview(false)}>
                    Close
                  </Button>
                  {currentAppointment?.status === "reject" ?
                    <Button variant="primary" type='submit'>
                      Submit
                    </Button>
                    : null}
                </div>
              </form>
            </Modal>
            <div className="row justify-content-md-center">
              <div className="col col-md-5">
                <h3>Book an Appointment</h3>
                <div className="card">
                  <div className="card-header">
                    <ul className="nav nav-tabs card-header-tabs">
                      {SITLevels?.map((sit) => (
                        sit.enabled ?
                        <li key={"level-" + sit.id} className="nav-item">
                          <button className={"nav-link" + (sit.id === currentSIT?.id ? " active" : "")} onClick={() => onSelectSIT(sit)}>{sit.label}</button>
                        </li>
                        : null
                      ))}
                    </ul>
                  </div>
                  <div className="card-body">
                    <ul className="">
                      {currentSITRequirements.map((req) => (
                        req.enabled ?
                        <li key={"requirement-" + req.id}>{req.label}</li>
                        : null
                      ))}
                    </ul>
                  </div>
                </div>
                <div className="card">
                  <div className="card-header">
                    <h4>Appointments</h4>
                  </div>
                  <div className="card-body">
                    <div className="row">
                      {
                        appointments.map((app) => (
                          <div key={"appointment-" + app.id} className="col col-md-12">
                            <div className="row">
                              <div className="col-12 student-appointment-list">
                                <button type="button" onClick={() => onClickAppointment(app)} className={"btn" + (app.status === "approve" ? " btn-primary" : "") + (app.status === "pending" ? " btn-secondary" : "") + (app.status === "reject" ? " btn-danger" : "") + (app.status === "success" ? " btn-success" : "")}>
                                  <label>
                                    {onMutateDateTimeFormat(new Date(app.start)) + " to " + onMutateDateTimeFormat(new Date(app.end))}
                                  </label>
                                  {" - "}
                                  <span>
                                    {app.status}
                                  </span>
                                </button>
                              </div>
                            </div>
                          </div>
                        ))
                      }
                      <div className="col col-md-12">

                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col col-md-7">

                <Fragment>
                  <Calendar />
                  <div className="btn-onsit-calendar">
                    <Link to="/bookanappointment" className='btn btn-primary' aria-current="page">
                      <span>Appointment</span>
                    </Link>
                  </div>
                </Fragment>


              </div>
            </div>
          </Fragment>

        </div>
        :
        <div className="row justify-content-md-center">
          <h3>Login required. Please login your account to proceed.</h3>
          <div className="login-btn-container">
            <Link to="/Login" className='btn btn-primary' aria-current="page">
              <span>Login</span>
            </Link>
          </div>
        </div>}
    </Fragment>
  )
}

export default BookAppointment;