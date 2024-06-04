import { useState, Fragment, useCallback, useEffect } from 'react';
import { getAllCompanyPref } from "../../services/companyServices";
import { updateStudentSITCompanyArchieve } from "../../services/studentService";
import { getArchieveFilesById } from "../../services/sitgradeupload";
import { IStudentSITCompanyArchieve, ISIT, ICompany, ICompanyPrefer, IStaff, ISITGrade } from "../../services/type.interface";
import Button from 'react-bootstrap/Button';
import Modal from "../../common/Modal";
import FullScreen from "../../common/FullScreen";
import "./studentsitcomp.scss";

export interface IStudentSITCompProp {
    arc: IStudentSITCompanyArchieve;
    sits: ISIT[];
    companies: ICompany[];
    token: string;
    courseID?: number;
    staff?: IStaff;
}

const StudentSITComp = ({ arc, sits, companies, token, courseID, staff }: IStudentSITCompProp) => {
    const [errorMessage, seterrorMessage] = useState<string>("");
    const [successMessage, setSuccessMessage] = useState<string>("");
    const [myArc, setmyArc] = useState<IStudentSITCompanyArchieve>(arc);
    const [SITGrades, setSITGrades] = useState<ISITGrade[]>();
    const [companiesPref, setCompaniesPref] = useState<ICompanyPrefer[]>([]);
    const [showInput, setShowInput] = useState<boolean>(false);
    const [showFiles, setShowFiles] = useState<boolean>(false);
    const [isFullScreen, setIsFullScreen] = useState<boolean>(false);
    const [myBlob, setMyBlob] = useState<string>('');
    const [formData, setFormData] = useState({
        sit: arc.sitid,
        companyid: arc.companyid
    });

    const onUpdateStudentSIT = async (sitId: number, companyid: number) => {
        if (sitId > 0) {
            setFormData({
                ...formData,
                sit: sitId
            });
        }
        if (companyid > 0) {
            setFormData({
                ...formData,
                companyid: companyid
            });
        }
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

    const getSITStringBySITID = useCallback((id: number) => {
        if (id) {
            const mySIT = sits?.find((sit) => { return sit.id === id });
            return "SIT " + mySIT?.label + " Assignment: ";
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

    const getCompanyPrefs = async () => {
        await getAllCompanyPref(token).then((res: any) => {
            setCompaniesPref(res);
        }).catch((err) => {
            console.log("Error: ", err);
        });
    }

    const onSubmitForm = async (e: any) => {
        e.preventDefault();
        seterrorMessage("");
        setSuccessMessage("");
        const newArc = {
            ...myArc,
            sitid: formData.sit,
            companyid: formData.companyid
        };

        await updateStudentSITCompanyArchieve(token, myArc.id.toString(), newArc).then((res) => {
            setmyArc(newArc);
            setShowInput(false);
            setSuccessMessage("Successfully updated!!!");

            setTimeout(() => {
                setSuccessMessage("");
            }, 5000);
        }).catch(err => {
            console.log("Error: ", err);
            seterrorMessage("An error occured. Please try again later.");
        });
    }

    const getSITGrades = async () => {
        await getArchieveFilesById(token, arc.id.toString()).then((res: any) => {
            setSITGrades(res);
        }).catch((err) => {
            console.log("Error: ", err);
        });
    }

    const onOpenBlob = (val: ISITGrade) => {
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

    useEffect(() => {
        getSITGrades();
        getCompanyPrefs();
    }, []);

    return (
        <Fragment>
            <Modal
                isDisplay={showFiles}
                isForm={true}
                title="Appoinment"
                onClickClose={() => setShowFiles(false)}
                mysize="xl"
                showSubmitBtn={false}
                submitLabel="Proceed"
                cancelLabel="close" >
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
                        SITGrades?.map((file) => (
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
                    <Button variant="secondary" onClick={() => setShowFiles(false)}>
                        Close
                    </Button>
                </div>
            </Modal>
            {showInput ?
                <form onSubmit={onSubmitForm}>
                    <div className='row'>
                        <div className='col col-2'>
                            <div>
                                <label>{getSITStringBySITID(myArc.sitid)}</label>
                                {/*
                                <select className="form-control" name="sit" id="sit" defaultValue={arc.sitid ? arc.sitid : 0} onChange={(e) => onUpdateStudentSIT(Number(e.target.value), -1)}>
                                    <option disabled value={0}> -- select an SIT -- </option>
                                    {sits?.map((c) => (
                                        c.enabled &&
                                        <option key={"optsit-" + c.id} value={c.id}>{c.label}</option>
                                    ))}
                                </select>
                                */}
                            </div>
                        </div>
                        <div className='col col-10'>
                            <div className='sit-comp-container'>
                                <div className='sit-comp-input-container'>
                                    <select className="form-control" name="company" id="company" defaultValue={arc.companyid ? arc.companyid : 0} onChange={(e) => onUpdateStudentSIT(-1, Number(e.target.value))} >
                                        <option disabled value={0}> -- select a company -- </option>
                                        {organizeCompany(courseID ? courseID : 0)}
                                    </select>
                                    <button className='btn btn-primary' type='submit'>
                                        Submit
                                    </button>
                                </div>
                                <div className='sit-comp-btn-container'>

                                    {staff && staff.role !== 3 ? <Fragment>
                                        <button className='btn' onClick={() => setShowInput(!showInput)}>
                                            {showInput ? <i className='bi bi-x-circle color-red' /> : <i className='bi bi-pencil' />}
                                        </button>
                                    </Fragment> : null}
                                </div>
                            </div>
                        </div>
                        {errorMessage ? <span className={'color-red'}>{errorMessage}</span> : null}
                        {successMessage ? <span className={'color-green'}>{successMessage}</span> : null}
                    </div>
                </form>
                :
                <div className='row'>
                    <div className='col col-2'>
                        <div>
                            <label>{getSITStringBySITID(myArc.sitid)}</label>
                        </div>
                    </div>
                    <div className='col col-10'>
                        <div className='sit-comp-container'>
                            <div className='sit-comp-input-container'>
                                <span>{getCompanyStringBySITID(myArc.companyid)}</span>
                            </div>
                            <div className='sit-comp-btn-container'>
                                <button className='btn' onClick={() => {
                                    setShowFiles(true);
                                }}>
                                    <i className="bi bi-archive"></i>
                                </button>
                                {staff && staff.role !== 3 ? <Fragment>
                                    <button className='btn' onClick={() => setShowInput(!showInput)}>
                                        {showInput ? <i className='bi bi-x-circle' /> : <i className='bi bi-pencil' />}
                                    </button>
                                </Fragment> : null}
                            </div>
                        </div>
                    </div>
                    {successMessage ? <span className={'color-green'}>{successMessage}</span> : null}
                </div>
            }

        </Fragment>
    )
}

export default StudentSITComp;