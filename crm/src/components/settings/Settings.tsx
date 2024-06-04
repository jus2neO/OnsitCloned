import { useState, useEffect } from 'react';
import { getSettings, updateSettings } from "../services/settingsServices";
import { ISettings } from "../services/type.interface";
import Button from 'react-bootstrap/Button';
import "./settings.scss";

const Settings = () => {
    const [settings, setSettings] = useState<ISettings>();
    const [errorMessage, seterrorMessage] = useState<string>("");
    const [successMessage, setSuccessMessage] = useState<string>("");
    const Token = "";
    const [formData, setFormData] = useState({
        start: '',
        end: '',
        enabled: false,
        issaturdayopen: false,
        slotlimit: 0
    });
    const { start, end, enabled, issaturdayopen, slotlimit } = formData;

    const fetchSettings = async () => {
        await getSettings(Token).then((res: any) => {
            setSettings(res[0]);
            const mystart = new Date(res[0].start);
            const newMonth = (mystart.getMonth() + 1).toString().length === 1 ? "0" + (mystart.getMonth() + 1).toString() : (mystart.getMonth() + 1).toString();
            const newDay = mystart.getDate().toString().length === 1 ? "0" + mystart.getDate().toString() : mystart.getDate().toString();
            const newStart = mystart.getFullYear().toString() + "-" + newMonth + "-" + newDay;

            const myend = new Date(res[0].end);
            const newEndMonth = (myend.getMonth() + 1).toString().length === 1 ? "0" + (myend.getMonth() + 1).toString() : (myend.getMonth() + 1).toString();
            const newEndDay = myend.getDate().toString().length === 1 ? "0" + myend.getDate().toString() : myend.getDate().toString();
            const newEnd = myend.getFullYear().toString() + "-" + newEndMonth + "-" + newEndDay;
            setFormData({
                start: newStart,
                end: newEnd,
                enabled: res[0].enabled,
                slotlimit: res[0].slotlimit,
                issaturdayopen: res[0].issaturdayopen
            });
        }).catch(err => {
            console.log("Error: ", err);
        })
    }

    const onSubmitSettings = async (e: any) => {
        setSuccessMessage("");
        seterrorMessage("");
        e.preventDefault();
        if(settings){
            const newNumber = parseInt(slotlimit.toString());
            formData.slotlimit = newNumber;
            await updateSettings(Token, settings?.id.toString(), formData).then((res) => {
                setSuccessMessage("Successfully saved.");
                setTimeout(() => {
                    setSuccessMessage("");
                }, 3000);
            }).catch(err => {
                console.log("Error: ", err);
                seterrorMessage("Something went wrong, please try again later.");
                setTimeout(() => {
                    seterrorMessage("");
                }, 3000);
            })
        }
    }

    const onSwitchSaturdayChange = (e: any) => {
        setFormData({ ...formData, [e.target.name]: !issaturdayopen });
    }

    const onSwitchChange = (e: any) => {
        setFormData({ ...formData, [e.target.name]: !enabled });
    }

    const onChange = (e: any) => {
        setFormData({ ...formData, [e.target.name]: e.target.value })
    };

    useEffect(() => {
        fetchSettings();
    }, []);

    return (
        <section>
            <div className='settings-container'>
                <h3>Settings</h3>
                <div className='settings'>
                    <form onSubmit={onSubmitSettings}>
                        <div className="form-group">
                            <label htmlFor="start">Appointment Start Date</label>
                            <input
                                type="date"
                                className="form-control"
                                id="start"
                                name='start'
                                aria-label="Appointment Start Date"
                                placeholder="Select a date"
                                value={start}
                                onChange={onChange}
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="end">Appointment End Date</label>
                            <input
                                type="date"
                                className="form-control"
                                id="end"
                                name='end'
                                aria-label="Appointment End Date"
                                placeholder="Select a date"
                                value={end}
                                onChange={onChange}
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="slotlimit">Limit per slot</label>
                            <input
                                type="number"
                                className="form-control"
                                id="slotlimit"
                                name='slotlimit'
                                aria-label="Limit per slot"
                                placeholder="Enter number"
                                value={slotlimit}
                                onChange={onChange}
                            />
                        </div>
                        <div className="form-group">
                            <label className="form-check-label" htmlFor="issaturdayopen">Open in saturday</label>
                            <div className="form-check form-switch">
                                <input className="form-check-input" type="checkbox" role="switch" name="issaturdayopen" checked={issaturdayopen} id="issaturdayopen" onChange={onSwitchSaturdayChange} />
                            </div>
                        </div>
                        <div className="form-group">
                            <label className="form-check-label" htmlFor="enabled">Active</label>
                            <div className="form-check form-switch">
                                <input className="form-check-input" type="checkbox" role="switch" name="enabled" checked={enabled} id="enabled" onChange={onSwitchChange} />
                            </div>
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
                            Save
                        </Button>
                    </form>
                </div>
            </div>
        </section>
    )
}

export default Settings;