import { useState, useEffect, useCallback, Fragment, useMemo } from "react";
import { getAllSIT, getAllSITRequirements } from "../services/sitServices";
import { addAppointmentFiles, addAppointment, getActiveAppointmentsByStudentID, getMyAppointmentsByStudentID, getMyAppointmentsByDate } from "../services/appointmentsServices";
import { ISITLevel, ISITRequirement, IStudent, IAppointment, ISettings } from "../services/type.interface";
import { onMutateDateFormat } from "../services/mutation/date";
import { getListOfCountLimit } from "../services/mutation/countlimit";
import { useDropzone } from 'react-dropzone';
import Button from 'react-bootstrap/Button';
import { Link } from "react-router-dom";
import { getSettings } from "../services/settingsServices";
import "./BookAppointment.scss";

export interface IBookAnAppointmentProps {
    currentStudent?: IStudent;
}

const BookAnAppointment = ({ currentStudent }: IBookAnAppointmentProps) => {

    const [SITLevels, setSITLevels] = useState<ISITLevel[]>([]);
    const [SITRequirements, setSITRequirements] = useState<ISITRequirement[]>([]);
    const [currentAppointments, setCurrentAppointments] = useState<IAppointment[]>();
    const [slotlimits, setSlotLimits] = useState<number[]>();
    const [currentSITRequirements, setCurrentSITRequirements] = useState<ISITRequirement[]>([]);
    const [currentSIT, setCurrentSIT] = useState<ISITLevel>();
    const [time, setTime] = useState<string>('');
    const [errorMessage, setErrorMessage] = useState<string>();
    const [successMessage, setSuccessMessage] = useState<string>("");
    const [currentSelectedSIT, setCurrentSelectedSIT] = useState<ISITLevel>();
    const [hasActiveAppointment, setHasActiveAppointment] = useState<boolean>(true);
    const [files, setFiles] = useState<File[] | undefined>();
    const [settings, setSettings] = useState<ISettings>();
    const [canSetAppointment, setCanSetAppointment] = useState<boolean>(false);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const onDrop = useCallback((acceptedFiles: File[], fileRejections: any, events: any) => {
        setFiles(acceptedFiles);
    }, []);
    const [formData, setFormData] = useState({
        studentid: '',
        start: '',
        end: '',
        sitlevel: ''
    });
    const { isDragActive, getRootProps, getInputProps } = useDropzone({
        accept: {
            files: [".pdf"]
        },
        onDrop
    });
    const token = '';

    const { studentid, start, end, sitlevel } = formData;

    const onRemoveFile = (myfile: File) => {
        let newFiles: File[] = [];

        files?.forEach((file) => {
            if (file.name !== myfile.name) {
                newFiles.push(file);
            }
        });

        setFiles(newFiles);
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

    const getSITLevel = async () => {
        await getAllSIT(token).then((res: any) => {
            setSITLevels(res);
            setCurrentSIT(res[0]);
            getSITRequirements(res[0].id);
            setFormData({
                ...formData,
                sitlevel: res[0].id
            })
        }).catch((err) => {
            console.log("Error: ", err);
        });
    }

    const getActiveAppointment = async () => {

        try {
            if (currentStudent) {
                await getActiveAppointmentsByStudentID(token, currentStudent?.id).then((res: any) => {
                    if (res.length > 0) {
                        setHasActiveAppointment(true);
                    } else {
                        setHasActiveAppointment(false);
                    }
                }).catch(err => {
                    console.log("Errors: ", err);
                    setHasActiveAppointment(false);
                });
            }
        } catch (err) {
            setHasActiveAppointment(false);
        }

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
        setFormData({
            ...formData,
            sitlevel: sit.id.toString()
        });
        setCurrentSIT(sit);
        const newRequirements = SITRequirements.filter((req) => { return req.sitlevel === sit.id });
        setCurrentSITRequirements(newRequirements);
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

    const onSubmitForm = async (e: React.SyntheticEvent) => {
        e.preventDefault();
        setErrorMessage("");

        const listOfTime = ["08:00-09:45", "10:00-11:45", "13:00-14:45", "15:00-16:45"];
        const myIndex = listOfTime.findIndex((mytime) => {return mytime === time});

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

        const mystart = new Date(start);

        if(mystart.getDay() === 0) {
            setErrorMessage("Appointments can't be set on sunday.");
            return;
        }

        if(mystart.getDay() === 6 && !settings?.issaturdayopen) {
            setErrorMessage("Appointments can't be set on saturday.");
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

        if (!files || files?.length === 0) {
            setErrorMessage("Please upload requirements");
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

        if (Number(newHrs) < 8 && Number(newMins) > 0) {
            setErrorMessage("Please select a time between 8 am to 6 pm");
            return;
        }

        let myAppointments;
        let isAddOkay = false;

        if (currentStudent) {
            myAppointments = await getMyAppointmentsByStudentID(token, currentStudent?.id).then((res: any) => {
                return {
                    status: "OK",
                    res: res
                };
            }).catch((err) => {
                console.log("Error: ", err);
                return {
                    status: "error",
                    res: err
                };
            });
        }

        if (myAppointments?.status === "OK") {
            const myStat = myAppointments.res.find((app: IAppointment) => { return app.status === "reject" || app.status === "approve" || app.status === "pending" });

            if (myStat) {
                isAddOkay = false;
            } else {
                isAddOkay = true;
            }

        } else {
            setErrorMessage("An error occured. Plase try again later.");
            return;
        }

        if (!isAddOkay) {
            setErrorMessage("An appointment is current active, Please finish all of the appointment before you can add another.");
            return;
        }

        newTime = newHrs + ":" + newMins;

        const newDate = start + " " + arrampmTime[0];
        const newDateEnd = start + " " + arrampmTime[1];

        const newFormData = {
            studentid: currentStudent?.id,
            start: new Date(newDate).toString(),
            end: new Date(newDateEnd).toString(),
            sitlevel: sitlevel
        }


        await addAppointment(token, newFormData).then((res: any) => {
            if (res) {
                files.forEach((file) => {
                    onUploadFile(res.id, file);
                });
                setSuccessMessage("Submittion was successful. Redirecting now.");
                setTimeout(() => {
                    window.location.href = "/bookappointment";
                }, 3000);
            }
        }).catch((err) => {
            console.log("Error: ", err);
            setErrorMessage("An error occured.");
        });
        
        //const formData = new FormData();
        //formData.append('excel', file);
    }

    const onUploadFile = async (appointId: string, file: File) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = async function () {
            const myBase64 = reader.result;
            //const arrStr = myBase64?.toString().split("data:application/pdf;base64,");
            let newData
            //if(arrStr){
            newData = {
                id: appointId,
                filename: file.name,
                size: file.size,
                type: file.type,
                file: myBase64
            }
            //}

            await addAppointmentFiles(token, newData).then((res) => {
            }).catch((err) => {
                console.log("Error: ", err);
            });
        };
        reader.onerror = function () {
            console.log("Error: ", reader.error);
        };

    }

    const onTimeChange = useCallback((e: any) => {
        setTime(e.target.value);
    }, [start]);

    const fetchSettings = async () => {
        await getSettings(token).then((res: any) => {
            setSettings(res[0]);
        }).catch(err => {
            console.log("Error: ", err);
        })
    }

    const onDateChange = async (e: any) => {
        onChange(e);
        const date = new Date(e.target.value);
        const datestr = onMutateDateFormat(date);
        await fetchAppointments(datestr);
    }

    const onChange = (e: any) => setFormData({ ...formData, [e.target.name]: e.target.value });

    useMemo(() => {
        if (settings) {
            const date = new Date();
            if (settings.enabled && date >= new Date(settings.start) && date <= new Date(settings.end)) {
                setCanSetAppointment(true);
                setIsLoading(false);
            }
            else {
                setCanSetAppointment(false);
                setIsLoading(false);
            }
        }
    }, [settings]);

    useMemo(() => {
        if (currentStudent) {
            getActiveAppointment();
        }
    }, [currentStudent])

    useEffect(() => {
        getSITLevel();
        fetchSettings();
    }, []);

    return (
        <Fragment>
            {currentStudent ?
                <div className="book-appointment">
                    {isLoading ? <h1>Loading...</h1> :
                        canSetAppointment ?
                            <Fragment>
                                {hasActiveAppointment ? <div className="alert alert-warning" role="alert">
                                    Cannot submit an appointment until active request has been settled.
                                </div> : null}

                                <div className="row justify-content-md-center">
                                    <div className="col col-md-5">
                                        <h3>Upload Requirements</h3>
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
                                                <div className="sit-list-container">
                                                    <ul className="">
                                                        {currentSITRequirements.map((req) => (
                                                            req.enabled ?
                                                            <li key={"requirement-" + req.id}>{req.label}</li>
                                                            : null
                                                        ))}
                                                    </ul>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col col-md-7">
                                        <div className="book-appoint-form-container">
                                            <form onSubmit={onSubmitForm}>
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
                                                    {/*
                                                        <input
                                                        type="time"
                                                        className="form-control"
                                                        value={time}
                                                        onChange={onTimeChange}
                                                    />
                                                    */}
                                                    <select className="form-control" name="sitlevel" id="sitlevel" value={time} onChange={onTimeChange}>
                                                        <option disabled value={""}> -- select a time -- </option>
                                                        <option value={"08:00-09:45"}>08:00am to 9:45am Slots available: {"("+(slotlimits ? (settings ? settings.slotlimit : 25) - slotlimits[0] : 0) +")"}</option>
                                                        <option value={"10:00-11:45"}>10:00am to 11:45am Slots available: {"("+(slotlimits ? (settings ? settings.slotlimit : 25) - slotlimits[1] : 0) +")"}</option>
                                                        <option value={"13:00-14:45"}>01:00pm to 2:45pm Slots available: {"("+(slotlimits ? (settings ? settings.slotlimit : 25) - slotlimits[2] : 0) +")"}</option>
                                                        <option value={"15:00-16:45"}>03:00pm to 04:45pm Slots available: {"("+(slotlimits ? (settings ? settings.slotlimit : 25) - slotlimits[3] : 0) +")"}</option>
                                                    </select>
                                                </div>
                                                <div className="form-group">
                                                    <label htmlFor="sitlevel">SIT Level: </label>
                                                    <select className="form-control" name="sitlevel" id="sitlevel" value={sitlevel} onChange={onChangeSIT}>
                                                        {SITLevels?.map((sit) => (
                                                            sit.enabled ?
                                                            <option key={"opt-" + sit.id} value={sit.id}>{sit.label}</option>
                                                            : null
                                                        ))}
                                                    </select>
                                                </div>

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
                                                                <div className="upload-icon">
                                                                    <i className="bi bi-file-earmark-pdf" />
                                                                </div>
                                                                <span>{file?.name} - {file?.size} bytes <button type="button" className='btn btn-default' onClick={() => onRemoveFile(file)}><i className='bi bi-x' /></button></span>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </aside>
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
                                                <div className="btn-onsit-calendar">
                                                    <Link to="/bookappointment" className='btn btn-secondary' aria-current="page">
                                                        <span>Back</span>
                                                    </Link>
                                                    {//hasActiveAppointment ? null : 

                                                        <Button variant="primary" type='submit'>
                                                            Submit and Book
                                                        </Button>
                                                    }
                                                </div>

                                            </form>
                                        </div>
                                    </div>
                                </div>
                            </Fragment>
                            :
                            <h3>Making an appointment is currently closed.</h3>

                    }

                </div>
                :
                <div className="row justify-content-md-center">
                    <h3>Login required. Please login your account to proceed.</h3>
                    <div className="login-btn-container">
                        <Link to="/Login" className='btn btn-primary' aria-current="page">
                            <span>Login</span>
                        </Link>
                    </div>
                </div>
            }
        </Fragment>
    )
}

export default BookAnAppointment;