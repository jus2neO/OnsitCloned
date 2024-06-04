import { useState, useEffect, useCallback, useMemo } from 'react';
import { getAllAppointmentWithFilesAndStudent, updateAppointmentStatus, getMyAppointmentsByDate } from "../services/appointmentServices";
import { getSITRequirementsById } from "../services/sitServices";
import { IAppointment, IAppointmentFile, ISITRequirement, ISITRequirementOptions, ISettings } from "../services/type.interface";
import { getListOfCountLimit } from "../services/mutation/countlimit";
import { getSettings } from "../services/settingsServices";
import { onMutateDateFormat } from "../services/mutation/date";
import { addNotification } from "../services/notificationServices";
import Modal from "../common/Modal";
import FullScreen from "../common/FullScreen";
import Button from 'react-bootstrap/Button';
import "./Request.scss";
import { Link } from "react-router-dom";

const Request = () => {
  const [appointments, setAppointments] = useState<IAppointment[]>();
  const [SITRequirements, setSITRequirements] = useState<ISITRequirement[]>();
  const [SITRequirementsOptions, setSITRequirementsOptions] = useState<ISITRequirementOptions[]>();
  const [currentAppointment, setCurrentAppointment] = useState<IAppointment>();
  const [showPreview, setShowPreview] = useState<boolean>(false);
  const [showRejectForm, setShowRejectForm] = useState<boolean>(false);
  const [time, setTime] = useState<string>('');
  const [currentAppointments, setCurrentAppointments] = useState<IAppointment[]>();
  const [slotlimits, setSlotLimits] = useState<number[]>();
  const [settings, setSettings] = useState<ISettings>();
  const [myBlob, setMyBlob] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string>();
  const [isFullScreen, setIsFullScreen] = useState<boolean>(false);
  const [formData, setFormData] = useState({
    studentid: '',
    start: '',
    end: '',
    sitlevel: ''
  });
  const [formRejectData, setFormRejectData] = useState({
    note: ''
  });
  const token = "";
  const { note } = formRejectData;
  const { studentid, start, end, sitlevel } = formData;

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

  const getAppointments = async () => {
    await getAllAppointmentWithFilesAndStudent(token).then((res: any) => {
      setAppointments(res);
    }).catch((err) => {
      console.log("Error: ", err);
    });
  }

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
    setShowPreview(true);
    const datestr = onMutateDateFormat(new Date(app.start));
    await fetchAppointments(datestr);
  }

  const onSubmitAppointment = async (e: any) => {
    setErrorMessage("");
    e.preventDefault();

    const listOfTime = ["08:00-09:45", "10:00-11:45", "13:00-14:45", "15:00-16:45"];
    const myIndex = listOfTime.findIndex((mytime) => { return mytime.includes(time)});

    if ((slotlimits ? (settings ? settings.slotlimit : 25) - slotlimits[myIndex] : 0) <= 0) {
      setErrorMessage("Time slot is already full.");
      return;
    }
    
    const arrampmTime = time.split("-");
    const arrTime = arrampmTime[0].split(":");
    const getFalse = SITRequirementsOptions?.filter((req) => { return !req.isChecked });

    if (getFalse && getFalse.length > 0) {
      setErrorMessage("Requirements must be completed");
      return;
    }

    if (arrTime && Number(arrTime[0]) > 18) {
      setErrorMessage("Please select a time between 8 am to 6 pm");
      return;
    }

    if (arrTime && Number(arrTime[0]) < 8) {
      setErrorMessage("Please select a time between 8 am to 6 pm");
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
      start: new Date(newDate).toString(),
      end: new Date(newDateEnd).toString(),
      status: "approve"
    }
    
    if (currentAppointment) {
      const newNotification = {
        studentid: currentAppointment.studentid,
        description: "Appointment has been approved! Please wait for the date that you are appointed to.",
        link: "/bookappointment",
        isread: false,
      }
      await addNotification(token, newNotification).then((res) => {

      }).catch(err => {
        console.log("Error: ", err);
      });
      await updateAppointmentStatus(token, currentAppointment.id.toString(), newFormData)
        .then((res) => {
          let newApp: IAppointment[] = [];
          appointments?.forEach((app) => {
            if (app.id === currentAppointment.id) {
              app.status = "approve";
            }
            newApp.push(app);
          });
          setAppointments(newApp);
          setCurrentAppointment(undefined);
          setShowPreview(false);
          onResetForms();
        })
        .catch((err) => {
          console.log("Error: ", err);
        });
    }
  }

  const onClickSubmitReject = async (e: any) => {
    e.preventDefault();
    if (currentAppointment) {
      const newNotification = {
        studentid: currentAppointment.studentid,
        description: "Appointment has been rejected! Please see note for more details.",
        link: "/bookappointment",
        isread: false,
      }
      await addNotification(token, newNotification).then((res) => {

      }).catch(err => {
        console.log("Error: ", err);
      });
      
      await updateAppointmentStatus(token, currentAppointment.id.toString(), { start: currentAppointment.start, end: currentAppointment.end, status: "reject", note })
        .then((res) => {
          let newApp: IAppointment[] = [];
          appointments?.forEach((app) => {
            if (app.id === currentAppointment.id) {
              app.status = "reject";
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

  const onClickReject = (app?: IAppointment) => {
    let myApp = app;
    if (currentAppointment) {
      myApp = currentAppointment;
    }
    setCurrentAppointment(myApp);
    setShowPreview(false);
    setShowRejectForm(true);
  }

  const onTimeChange = useCallback((e: any) => {
    setTime(e.target.value);
  }, [start]);

  const onOpenBlob = (val: IAppointmentFile) => {
    setMyBlob(base64toBlob(val.file));
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

  const getSITRequirements = async () => {
    if (currentAppointment) {
      await getSITRequirementsById(token, "sitlevel", currentAppointment?.sitlevel.toString()).then((res: any) => {
        const newSITR: any[] = [];
        res.forEach((r: any) => {
          if (r.enabled) {
            newSITR.push({
              id: r.id,
              isChecked: false,
              label: r.label
            });
          }
        });
        setSITRequirementsOptions(newSITR);
        setSITRequirements(res);
      }).catch(err => {
        console.log("Error: ", err);
      });
    }
  }

  const onCheckRequirements = (sitr: ISITRequirementOptions) => {
    let mysitindex = SITRequirementsOptions?.findIndex((sit) => { return sitr.id === sit.id });
    if (mysitindex?.toString() && SITRequirementsOptions) {
      SITRequirementsOptions[mysitindex].isChecked = !SITRequirementsOptions[mysitindex].isChecked;
    }
  }

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
  const onNoteChange = (e: any) => setFormRejectData({ ...formRejectData, [e.target.name]: e.target.value });

  useMemo(() => {
    if (currentAppointments) {
      getSITRequirements();
    }
  }, [currentAppointments]);

  useEffect(() => {
    getAppointments();
    fetchSettings();
  }, []);

  return (
    <section>

      <div className='Calendar'>
        <Link to="/appointments" className='btn btn-primary' aria-current="page">
          Calendar
        </Link>
      </div>
      <div className="card">
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
              <h5>{currentAppointment?.student?.fname + " " + currentAppointment?.student?.mname + " " + currentAppointment?.student?.lname}</h5>
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
            <div className="form-group">
              <label htmlFor="sitlevel">SIT Level: </label>
              <div><b>{currentAppointment?.sit?.label}</b></div>
            </div>
            {isFullScreen &&
              <FullScreen isDisplay={isFullScreen} onClickClose={setIsFullScreen}>
                <iframe width={"100%"} height={"100%"} src={myBlob} />
              </FullScreen>
            }

            <h4>Files</h4>
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
            <div className='row'>
              <div className='col col-md-7'>
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
              </div>
              <div className='col col-md-5'>
                <label>
                  List of requirements
                </label>
                <div className='requirements-list'>
                  <div className="form-group">
                    {SITRequirementsOptions?.map((sit, i) => (
                      <div key={"cb-" + i} className="form-check">
                        <input className="form-check-input" type="checkbox" onChange={() => onCheckRequirements(sit)} value={sit.id} name={"requirements-" + sit.id} id={"requirements-" + sit.id} />
                        <label className="form-check-label" htmlFor={"requirements-" + sit.id}>
                          {sit.label}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

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
              {currentAppointments &&
                <Button variant="primary" onClick={() => onClickReject()}>
                  Reject
                </Button>
              }
              <Button variant="primary" type='submit'>
                Submit
              </Button>
            </div>
          </form>
        </Modal>
        {/* Reject form */}
        <Modal
          showSubmitBtn={true}
          isForm={true}
          cancelLabel=''
          submitLabel=''
          isDisplay={showRejectForm}
          mysize='sm'
          onClickClose={() => setShowRejectForm(false)}
          title='Reject Student Appointment'
        >
          <form onSubmit={onClickSubmitReject}>
            <div className="form-group">
              <div className="form-group">
                <label htmlFor="note">Note: </label>
                <textarea
                  id="note"
                  name="note"
                  className="form-control"
                  value={note}
                  onChange={onNoteChange}
                />
              </div>
            </div>
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
        <div className="card-header">
          Student Request Appointment
        </div>
        <div className="card-body">
          <div className='row'>
            <div className='col-3'>
              Name
            </div>
            <div className='col-3'>
              ID Number
            </div>
            <div className='col-2'>
              Requirement
            </div>
            <div className='col-2'>
              Date of Appointment
            </div>
            <div className='col-2'>
              Status
            </div>
          </div>
          {appointments?.map((app) => (
            app.status === "pending" &&
            <div key={"appointment-" + app.id} className='row'>
              <div className='col-3'>
                <button className='btn btn-link' onClick={() => onClickCheck(app)}>
                  {app?.student?.lname + ", " + app?.student?.fname + " " + app?.student?.mname}
                </button>
              </div>
              <div className='col-3'>
                {app.student.id}
              </div>
              <div className='col-2'>
                {app.status}
              </div>
              <div className='col-2'>
                {new Date(app.start).getDate().toString() + "/" +
                  (new Date(app.start).getMonth() + 1).toString() + "/" +
                  new Date(app.start).getFullYear().toString() + " " +
                  new Date(app.start).getHours().toString() + ":" +
                  new Date(app.start).getMinutes().toString()}
              </div>
              <div className='col-2'>
                <button type='button' className='btn btn-primary' onClick={() => onClickCheck(app)}>
                  <i className="bi bi-eye"></i>
                </button>
              </div>
            </div>
          ))}

        </div>
      </div>
    </section>
  )
}

export default Request;