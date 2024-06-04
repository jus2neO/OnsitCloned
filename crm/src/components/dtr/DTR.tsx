import { useEffect, useState, useCallback } from 'react';
import { getAllDTRByDate } from "../services/dtrServices";
import { getAllStudents } from "../services/studentService";
import { getAllSIT } from "../services/sitServices";
import { IDTR, ISIT, IStudent } from "../services/type.interface";
import { onMutateDateFormat, onMutateDateTimeFormat } from "../services/mutation/date";
import "./DTR.scss";

const DTR = () => {
    const [dtrs, setDtrs] = useState<IDTR[]>();
    const [Students, setStudents] = useState<IStudent[]>();
    const [SITs, setSITs] = useState<ISIT[]>();
    const token = "";

    const onFetchAllSIT = async () => {
        await getAllSIT(token).then((res: any) => {
            setSITs(res);
        }).catch(err => {
            console.log("Error: ", err);
        });
    }

    const onFetchAllStudents = async () => {
        await getAllStudents(token).then((res: any) => {
            setStudents(res);
        }).catch(err => {
            console.log("Error: ", err);
        });
    }

    const onFetchAllDTRByDate = async (date: string) => {
        await getAllDTRByDate(token, "created", date).then((res: any) => {
            setDtrs(res);
        }).catch(err => {
            console.log("Error: ", err);
        });
    }

    const organizeList = useCallback((dtr: IDTR) => {
        let mystudent = "";
        let mySIT = "";
        if (Students) {
            const student = Students.find((s) => { return s.id === dtr.studentid });
            mystudent = student ? student?.fname + " " + student?.mname + " " + student.lname : "";
        }
        if (SITs) {
            const sit = SITs.find((s) => { return s.id === dtr.sitid });
            mySIT = sit ? sit.label : "";
        }

        return <div key={"dtr" + dtr.id} className='dtr'>
            <div className='row'>
                <div className='col col-mid-4'>
                    <div className='details'>
                        <label>{onMutateDateFormat(new Date(dtr.created))}</label>
                        <label>Student: {mystudent}</label>
                        <label>SIT: {mySIT}</label>
                    </div>
                </div>
                <div className='col col-mid-6'>
                    <div className='description'>
                        <label>Description: </label>
                        <p>{dtr.description}</p>
                    </div>
                </div>
            </div>
        </div>
    }, [Students, SITs, dtrs]);

    const onDateCahnge = (e: any) => {
        const mydate = new Date(e.target.value);
        let newDate = mydate.getFullYear().toString() + "-" + (mydate.getMonth() + 1).toString() + "-" + mydate.getDate().toString();
        onFetchAllDTRByDate(newDate);
    }

    useEffect(() => {
        const mydate = new Date();
        let newDate = mydate.getFullYear().toString() + "-" + (mydate.getMonth() + 1).toString() + "-" + mydate.getDate().toString();
        onFetchAllDTRByDate(newDate);
        onFetchAllStudents();
        onFetchAllSIT();
    }, []);
    return (
        <section>
            <div className='dtr-container'>
                <h2>DTR List</h2>
                <div className='row'>
                    <h5>Sort by</h5>
                    <div className='col col-sm-2'>
                        <input
                            type='date'
                            className="form-control"
                            aria-label='Date Sort'
                            onChange={onDateCahnge}
                        />
                    </div>
                </div>
                <div className='dtr-list-container'>
                    {dtrs && dtrs?.map((dtr) => (
                        organizeList(dtr)
                    ))}
                </div>
            </div>
        </section>
    )
}

export default DTR;