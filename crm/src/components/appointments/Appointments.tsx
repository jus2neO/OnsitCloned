import { useEffect, useState, Fragment, useCallback } from "react";
import Calendar from "../calendar/Calendar";
import { getAllAppointment, getAllAppointmentWithFilesAndStudent, updateAppointmentStatus, getMyAppointmentsByDate } from "../services/appointmentServices";
import { getAppointmentFileByAppId } from "../services/appointmentFileServices";
import { addDTR } from "../services/dtrServices";
import Modal from "../common/Modal";
import { getListOfCountLimit } from "../services/mutation/countlimit";
import { onMutateDateFormat } from "../services/mutation/date";
import { getSettings } from "../services/settingsServices";
import { IAppointment, IAppointmentFile, ISettings, IDTR } from "../services/type.interface";
import FullScreen from "../common/FullScreen";
import Button from 'react-bootstrap/Button';
import { Link } from "react-router-dom";
import { addNotification } from "../services/notificationServices";
import "./appointments.scss";

const Appointments = () => {
  const [appointments, setAppointments] = useState<IAppointment[]>();
  const [showResched, setShowReSched] = useState<boolean>(false);
  const [showRejectForm, setShowRejectForm] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>();
  const [currentAppointment, setCurrentAppointment] = useState<IAppointment>();
  const [isFullScreen, setIsFullScreen] = useState<boolean>(false);
  const [myBlob, setMyBlob] = useState<string>('');
  const [time, setTime] = useState<string>('');
  const [currentAppointments, setCurrentAppointments] = useState<IAppointment[]>();
  const [slotlimits, setSlotLimits] = useState<number[]>();
  const [settings, setSettings] = useState<ISettings>();
  const [formData, setFormData] = useState({
    studentid: '',
    start: '',
    end: '',
    sitlevel: ''
  });
  const [formRejectData, setFormRejectData] = useState({
    note: ''
  });
  const { studentid, start, end, sitlevel } = formData;
  const { note } = formRejectData;
  const token = "";

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
  }

  const onSubmitAppointment = async (e: any) => {
    setErrorMessage("");
    e.preventDefault();
    if (currentAppointment) {
      const newFormData = {
        start: currentAppointment.start,
        end: currentAppointment?.end,
        status: "complete"
      }

      const newDTR: IDTR = {
        id: 0,
        description: "Appointment Completion",
        start: currentAppointment.start,
        end: currentAppointment.end,
        appoinrmentid: currentAppointment.id,
        sitid: currentAppointment.sitlevel,
        studentid: currentAppointment.studentid,
        created: new Date(),
        modified: new Date()
      }

      await addDTR(token, newDTR).then((res) => {

      }).catch((err) => {
        console.log("Error: ", err);
      });
      await updateAppointmentStatus(token, currentAppointment.id.toString(), newFormData)
        .then((res) => {
          let newApp: IAppointment[] = [];
          appointments?.forEach((app) => {
            if (app.id === currentAppointment.id) {
              app.status = "complete";
            }
            newApp.push(app);
          });
          setAppointments(newApp);
          setCurrentAppointment(undefined);
          setShowReSched(false);
          onResetForms();
        })
        .catch((err) => {
          console.log("Error: ", err);
        });
    }
  }

  const onOpenBlob = (val: IAppointmentFile) => {
    setMyBlob(base64toBlob(val.file));
  }

  const onClickReject = (app?: IAppointment) => {
    let myApp = app;
    if (currentAppointment) {
      myApp = currentAppointment;
    }
    setCurrentAppointment(myApp);
    setShowReSched(false);
    setShowRejectForm(true);
  }

  const base64toBlob = (data: string) => {
    // Cut the prefix `data:application/pdf;base64` from the raw base 64
    const base64WithoutPrefix = data.substr('data:application/pdf;base64,'.length);

    const bytes = atob(base64WithoutPrefix);
    let length = bytes.length;
    let out = new Uint8Array(length);

    while (length--) {
      out[length] = bytes.charCodeAt(length);
    }

    return URL.createObjectURL(new Blob([out], { type: 'application/pdf' }));
  };

  const onClickCheck = async (app: IAppointment) => {
    setErrorMessage("");
    const mystart = new Date(app.start);
    const myend = new Date(app.end);
    const newMonth = (mystart.getMonth() + 1).toString().length === 1 ? "0" + (mystart.getMonth() + 1).toString() : (mystart.getMonth() + 1).toString();
    const newDay = mystart.getDate().toString().length === 1 ? "0" + mystart.getDate().toString() : mystart.getDate().toString();
    const newStart = mystart.getFullYear().toString() + "-" + newMonth + "-" + newDay;
    const newHrs = mystart.getHours().toString().length === 1 ? "0" + mystart.getHours().toString() : mystart.getHours().toString();
    const newMins = mystart.getMinutes().toString().length === 1 ? "0" + mystart.getMinutes().toString() : mystart.getMinutes().toString();

    const newEndHrs = myend.getHours().toString().length === 1 ? "0" + myend.getHours().toString() : myend.getHours().toString();
    const newEndMins = myend.getMinutes().toString().length === 1 ? "0" + myend.getMinutes().toString() : myend.getMinutes().toString();
    setCurrentAppointment(app);
    setFormData({
      ...formData,
      start: newStart
    });
    setTime(newHrs + ":" + newMins + "-" + newEndHrs + ":" + newEndMins);
    setShowReSched(true);
    const datestr = onMutateDateFormat(new Date(app.start));
    await fetchAppointments(datestr);
  }

  const onClickSubmitReSched = async (e: any) => {
    setErrorMessage("");
    e.preventDefault();

    const listOfTime = ["08:00-09:45", "10:00-11:45", "13:00-14:45", "15:00-16:45"];
    const myIndex = listOfTime.findIndex((mytime) => { return mytime.includes(time) });

    if ((slotlimits ? (settings ? settings.slotlimit : 25) - slotlimits[myIndex] : 0) <= 0) {
      setErrorMessage("Time slot is already full.");
      return;
    }

    const arrampmTime = time.split("-");
    const arrTime = arrampmTime[0].split(":");

    if (arrTime && Number(arrTime[0]) > 18) {
      setErrorMessage("Please select a time between 8 am to 6 pm");
      return;
    }

    if (arrTime && Number(arrTime[0]) < 8) {
      setErrorMessage("Please select a time between 8 am to 6 pm");
      return;
    }

    const mystart = new Date(start);

    if (mystart.getDay() === 0) {
      setErrorMessage("Appointments can't be set on sunday.");
      return;
    }

    if (mystart.getDay() === 6 && !settings?.issaturdayopen) {
      setErrorMessage("Appointments can't be set on sunday.");
      return;
    }

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

    if (currentAppointment) {
      const newNotification = {
        studentid: currentAppointment.studentid,
        description: "Your appointment has been rescheduled! Please see new schedule.",
        link: "/bookappointment",
        isread: false,
      }
      await addNotification(token, newNotification).then((res) => {

      }).catch(err => {
        console.log("Error: ", err);
      });

      await updateAppointmentStatus(token, currentAppointment.id.toString(), { start: new Date(newDate).toString(), end: new Date(newDateEnd).toString(), status: "approve" })
        .then((res) => {
          let newApp: IAppointment[] = [];
          appointments?.forEach((app) => {
            if (app.id === currentAppointment.id) {
              app.status = "approve";
              app.start = new Date(newDate).toString();
              app.end = new Date(newDateEnd).toString();
            }
            newApp.push(app);
          });
          setAppointments(newApp);
          setCurrentAppointment(undefined);
          setShowRejectForm(false);
          onResetForms();
        })
        .catch((err) => {
          console.log("Error: ", err);
        });
    }
  }

  const onTimeChange = useCallback((e: any) => {
    setTime(e.target.value);
  }, [start]);

  const getAppointmentWithFilesStudent = async () => {
    await getAllAppointmentWithFilesAndStudent(token).then((res: any) => {
      setAppointments(res);
    }).catch((err) => {
      console.log("Error: ", err);
    });
  }

  const organizeTodaysAppointment = () => {
    let myappointments: IAppointment[] = [];
    const date = new Date();
    const newDate = new Date(date.getMonth().toString() + "-" + date.getDate().toString() + "-" + date.getFullYear().toString());
    appointments?.forEach((app) => {
      const mydate = new Date(app.start);
      const newMyDate = new Date(mydate.getMonth().toString() + "-" + mydate.getDate().toString() + "-" + mydate.getFullYear().toString());
      /*if ((date.getFullYear().toString() + "-" + date.getDate().toString() + "-" + date.getMonth().toString())
        ===
        (mydate.getFullYear().toString() + "-" + mydate.getDate().toString() + "-" + mydate.getMonth().toString())
        &&
        app.status === "approve"
      ) {
        myappointments.push(app);
      }*/
      if (newDate >= newMyDate && app.status === "approve") {
        myappointments.push(app);
      }
    });

    return <Fragment>
      {myappointments && myappointments.map((app) => (
        <div key={"student-" + app.id} className="student-request-list">
          <button
            key={"student-" + app.id}
            type="button"
            className="btn btn-primary"
            onClick={() => {
              onClickCheck(app);
            }
            }
          >{app.student?.fname + " " + app.student?.mname + " " + app.student?.lname}</button>
        </div>
      ))}
    </Fragment>
  };

  const fetchAppointments = async (date: string) => {
    await getMyAppointmentsByDate(token, date).then((res: any) => {
      setCurrentAppointments(res);
      const items = getListOfCountLimit(res);
      console.log("I am here: ", items);
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
    getAppointmentWithFilesStudent();
    fetchSettings();
  }, []);

  return (
    <div className="appointment-container">
      {showResched ?
        <Modal
          isDisplay={showResched}
          isForm={true}
          title="Appoinment"
          onClickClose={() => setShowReSched(false)}
          mysize="xl"
          showSubmitBtn={false}
          submitLabel="Proceed"
          cancelLabel="close" >
          <form onSubmit={onSubmitAppointment}>
            <div className="form-group">
              <h5>{currentAppointment?.student?.fname + " " + currentAppointment?.student?.mname + " " + currentAppointment?.student?.lname}</h5>
            </div>
            <div className="form-group">
              <label htmlFor="dateappointment">Date of appointment</label>
              <input
                type="date"
                disabled={true}
                className="form-control"
                id="dateappointment"
                name='start'
                aria-describedby="emailHelp"
                placeholder="Select a date"
                value={start}
              //onChange={onChange}
              />
            </div>
            <div className="form-group">
              <label htmlFor="timeappointment">Preffered Time: </label>
              <select className="form-control" name="sitlevel" id="sitlevel" disabled={true} value={time}>
                <option disabled value={""}> -- select a time -- </option>
                <option value={"08:00-09:45"}>08:00am to 9:45am</option>
                <option value={"10:00-11:45"}>10:00am to 11:45am</option>
                <option value={"13:00-14:45"}>01:00pm to 2:45pm</option>
                <option value={"15:00-16:45"}>03:00pm to 04:45pm</option>
              </select>
              {
                /*
                <input
                type="time"
                disabled={true}
                className="form-control"
                value={time}
              />
                */
              }
            </div>
            <div className="form-group">
              <label htmlFor="sitlevel">SIT Level: </label>
              <div><b>{currentAppointment?.sit?.label}</b></div>
            </div>
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
                currentAppointment?.appointmentsFiles.map((file) => (
                  <div key={"file-" + file.id} className='file-requirement col col-md-3'>
                    <button type='button' className='btn' onClick={() => onOpenBlob(file)}>
                      <div className='icon'>
                        <i className="bi bi-file-pdf" />
                      </div>
                      <div className='label'>
                        <label>{file.filename}</label>
                      </div>
                    </button>
                  </div>
                ))
              }

            </div>
            {errorMessage ?
              <div className="alert alert-danger" role="alert">
                {errorMessage}
              </div>
              : null}
            <div className='sit-level-btn-container'>
              <div className='divider' />
              <Button variant="secondary" onClick={() => setShowReSched(false)}>
                Close
              </Button>
              {currentAppointment &&
                <Button variant="info" onClick={() => onClickReject()}>
                  Reschedule
                </Button>
              }
              <Button variant="primary" type='submit'>
                Completed
              </Button>
            </div>
          </form>
        </Modal>
        : null}
      <Modal
        showSubmitBtn={true}
        isForm={true}
        cancelLabel=''
        submitLabel=''
        isDisplay={showRejectForm}
        mysize='xl'
        onClickClose={() => setShowRejectForm(false)}
        title='Reschedule Student Appointment'
      >
        <form onSubmit={onClickSubmitReSched}>
          <div className="form-group">
            <h5>{currentAppointment?.student?.fname + " " + currentAppointment?.student?.mname + " " + currentAppointment?.student?.lname}</h5>
          </div>
          <div className="form-group">
            <label htmlFor="dateappointment">Date of appointment</label>
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
          </div>
          <div className="form-group">
            <label htmlFor="timeappointment">Preffered Time: </label>
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
          </div>
          {errorMessage ?
            <div className="alert alert-danger" role="alert">
              {errorMessage}
            </div>
            : null}
          <div className='sit-level-btn-container'>
            <div className='divider' />
            <Button variant="secondary" onClick={() => setShowRejectForm(false)}>
              Close
            </Button>
            <Button variant="primary" type='submit'>
              Submit
            </Button>
          </div>
        </form>
      </Modal>
      <div className="row">
        <div className="col-auto col-md-12 search-btn">
          <Link to="/request" className='btn' aria-current="page">
            <i className='bi bi-search' />
          </Link>
        </div>
      </div>
      <div className="row">
        <div className="col-auto col-md-3 min-vh-100 new-request-list">
          <div className="row">
            <div className="col-md-12">
              <Link to="/request" className='btn' aria-current="page">
                <div className="card">
                  <div className="card-header">
                    Pending request
                  </div>
                  <div className="card-body body-request-list">
                    {appointments && appointments.map((app) => (
                      app.status === "pending" &&
                      <div key={"student-" + app.id} className="student-request-list">
                        <button key={"student-" + app.id} type="button" className="btn btn-primary">{app?.student?.fname + " " + app?.student?.mname + " " + app?.student?.lname}</button>
                      </div>
                    ))}
                  </div>
                </div>
              </Link>
            </div>
            <div className="col-md-12">
              <div className="card">
                <div className="card-header">
                  Ongoing Appointments
                </div>
                <div className="card-body body-request-list">
                  {organizeTodaysAppointment()}
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="col-auto col-md-9 min-vh-100 d-flex justify-content-between flex-column">
          <Calendar />
        </div>
      </div>
    </div>
  )
}

export default Appointments;