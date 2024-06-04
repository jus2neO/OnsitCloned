import { useState, useEffect, Fragment } from 'react';
import MyModal from "../common/Modal";
import Button from 'react-bootstrap/Button';
import { addSITLevel, getAllSIT, updateSITLevel, addSITRequirement, updateSITRequirement, getSITRequirementsById } from "../services/sitServices";
import { ISIT, ISITRequirement, IStaff } from "../services/type.interface";

import "./sit.scss";

export interface ISitComponentProps {
    staff?: IStaff;
}

const SitComponent = ({ staff }: ISitComponentProps) => {
    const [onShowLevel, setOnShowLevel] = useState<boolean>(false);
    const [onShowRequirements, setOnShowRequirements] = useState<boolean>(false);
    const [SITLevel, setSITLevel] = useState<ISIT[]>([]);
    const [SITRequirement, setSITRequirement] = useState<ISITRequirement[]>([]);
    const [selectedSITLevel, setSelectedSITLevel] = useState<ISIT>();
    const [selectedSITRequirement, setSelectedSITRequirement] = useState<ISITRequirement>();
    const [formData, setFormData] = useState({
        label: '',
        description: '',
        enabled: true
    });
    const [formDataRequirement, setFormDataRequirement] = useState({
        sitlevel: 0,
        label: '',
        description: '',
        enabled: true
    });

    const { label, description } = formData;

    const token = "";

    const removeFormData = () => {
        setFormData({
            label: '',
            description: '',
            enabled: true
        });

        setFormDataRequirement({
            sitlevel: 0,
            label: '',
            description: '',
            enabled: true
        });
    }

    const onSubmitSIT = async (e: any) => {
        e.preventDefault();
        if (selectedSITLevel) {
            await updateSITLevel(token, selectedSITLevel.id.toString(), formData)
                .then((res) => {
                    let mysit = SITLevel;
                    const mysitIndex = mysit.findIndex((val) => { return val.id === selectedSITLevel.id });
                    mysit[mysitIndex].label = formData.label;
                    mysit[mysitIndex].description = formData.description;
                    setSITLevel(mysit);
                    setSelectedSITLevel(undefined);
                    removeFormData();
                    setOnShowLevel(false);
                })
                .catch((err) => {
                    console.log("Error: ", err.message);
                });
        } else {
            await addSITLevel(token, formData).then((res: any) => {
                const mysit = SITLevel;
                mysit.push(res);
                setSITLevel(mysit);
                removeFormData();
                setOnShowLevel(false);
            }).catch((err) => {
                console.log("Error: ", err.message);
            });
        }
    }

    const onSubmitSITRequirement = async (e: any) => {
        e.preventDefault();

        if (selectedSITRequirement) {
            await updateSITRequirement(token, selectedSITRequirement.id.toString(), formDataRequirement)
                .then((res) => {
                    let mysit = SITRequirement;
                    const mysitIndex = mysit.findIndex((val) => { return val.id === selectedSITRequirement.id });
                    mysit[mysitIndex].label = formDataRequirement.label;
                    mysit[mysitIndex].description = formDataRequirement.description;
                    setSITRequirement(mysit);
                    setSelectedSITRequirement(undefined);
                    removeFormData();
                    setOnShowRequirements(false);
                })
                .catch((err) => {
                    console.log("Error: ", err.message);
                });
        } else {

            let myform = formDataRequirement;
            if (selectedSITLevel) myform.sitlevel = selectedSITLevel.id;
            await addSITRequirement(token, formDataRequirement).then((res: any) => {
                const mysit = SITRequirement;
                mysit.push(res);
                setSITRequirement(mysit);
                removeFormData();
                setOnShowRequirements(false);
            }).catch((err) => {
                console.log("Error: ", err.message);
            });
        }
    }

    const onDisableSITLevel = async (id: Number) => {
        let mysits = SITLevel;
        let mysit = mysits.find((val) => { return val.id === id });
        const mysitIndex = mysits.findIndex((val) => { return val.id === id });
        if (mysit) mysit.enabled = false;

        await updateSITLevel(token, id.toString(), mysit)
            .then((res) => {
                let newSIT: ISIT[] = [];
                mysits[mysitIndex].enabled = false;
                mysits.forEach((val) => {
                    newSIT.push(val);
                });
                setSITLevel(newSIT);
                setSelectedSITLevel(undefined);
                removeFormData();
            })
            .catch((err) => {
                console.log("Error: ", err.message);
            });
    }

    const onDisableSITRequirement = async (id: Number) => {
        let mysits = SITRequirement;
        let mysit = mysits.find((val) => { return val.id === id });
        const mysitIndex = mysits.findIndex((val) => { return val.id === id });
        if (mysit) mysit.enabled = false;

        await updateSITRequirement(token, id.toString(), mysit)
            .then((res) => {
                let newSIT: ISITRequirement[] = [];
                mysits[mysitIndex].enabled = false;
                mysits.forEach((val) => {
                    newSIT.push(val);
                });
                setSITRequirement(newSIT);
                removeFormData();
            })
            .catch((err) => {
                console.log("Error: ", err.message);
            });
    }

    const onSelectEdit = (sit: ISIT) => {
        setSelectedSITLevel(sit);
        setOnShowLevel(true);
        setFormData({
            label: sit.label,
            description: sit.description,
            enabled: sit.enabled
        });
    }

    const onSelectEditRequirement = (sit: ISITRequirement) => {
        setSelectedSITRequirement(sit);
        setOnShowRequirements(true);
        setFormDataRequirement({
            sitlevel: sit.sitlevel,
            label: sit.label,
            description: sit.description,
            enabled: sit.enabled
        });
    }

    const onSelectLevel = (sit: ISIT) => {
        setSelectedSITLevel(sit);
        getSITRequireByID(sit.id);
    }

    const onOpenSITLevelModal = () => {
        setSelectedSITLevel(undefined);
        removeFormData();
        setOnShowLevel(true);
    }

    const getSITLevels = async () => {
        await getAllSIT(token)
            .then((val: any) => {
                if (val.length > 0) {
                    const valInd = val.findIndex((res: any) => { return res.enabled })
                    if (valInd > -1) {
                        setSelectedSITLevel(val[valInd]);
                        getSITRequireByID(val[valInd].id);
                    }
                    setSITLevel(val);
                }
            })
            .catch((err) => {
                console.log("Error: ", err);
            });
    }

    const getSITRequireByID = async (id: number) => {
        await getSITRequirementsById(token, "sitlevel", id.toString())
            .then((res: any) => {
                if (res) setSITRequirement(res);
            })
            .catch((err) => {
                console.log("Error: ", err);
            });
    }

    const onChange = (e: any) => setFormData({ ...formData, [e.target.name]: e.target.value });
    const onChangeRequirement = (e: any) => setFormDataRequirement({ ...formDataRequirement, [e.target.name]: e.target.value });

    useEffect(() => {
        getSITLevels();
    }, []);

    return (
        <div className='sit-configuration-container'>
            <MyModal
                showSubmitBtn={true}
                isForm={true}
                cancelLabel=''
                submitLabel=''
                isDisplay={onShowLevel}
                onClickClose={() => setOnShowLevel(false)}
                title='Create SIT Level'
                mysize='lg'
            >
                <form onSubmit={onSubmitSIT}>
                    <div className="form-group">
                        <label htmlFor="sitlabel">Label</label>
                        <input
                            type="text"
                            className="form-control"
                            id="sitlabel"
                            name='label'
                            aria-describedby="emailHelp"
                            placeholder="Enter label for SIT Level"
                            value={label}
                            onChange={onChange}
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="sitdescription">Description</label>
                        <textarea
                            className="form-control"
                            id="sitdescription"
                            name='description'
                            value={description}
                            placeholder="Enter description for SIT Level"
                            onChange={onChange}
                        />
                    </div>
                    <div className='sit-level-btn-container'>
                        <div className='divider' />
                        <Button variant="secondary" onClick={() => setOnShowLevel(false)}>
                            Close
                        </Button>
                        <Button variant="primary" type='submit'>
                            Submit
                        </Button>
                    </div>
                </form>
            </MyModal>

            <MyModal
                showSubmitBtn={true}
                isForm={true}
                cancelLabel=''
                submitLabel=''
                isDisplay={onShowRequirements}
                onClickClose={() => setOnShowRequirements(false)}
                title={`Create SIT Level ${selectedSITLevel?.label} requirement`}
                mysize='lg'
            >
                <form onSubmit={onSubmitSITRequirement}>
                    <div className="form-group">
                        <label htmlFor="sitlabel">Label</label>
                        <input
                            type="text"
                            className="form-control"
                            id="sitlabel"
                            name='label'
                            aria-describedby="emailHelp"
                            placeholder="Enter label for SIT requirement"
                            value={formDataRequirement.label}
                            onChange={onChangeRequirement}
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="sitdescription">Description</label>
                        <textarea
                            className="form-control"
                            id="sitdescription"
                            name='description'
                            placeholder="Enter description for SIT requirement"
                            value={formDataRequirement.description}
                            onChange={onChangeRequirement}
                        />
                    </div>
                    <div className='sit-level-btn-container'>
                        <div className='divider' />
                        <Button variant="secondary" onClick={() => setOnShowRequirements(false)}>
                            Close
                        </Button>
                        <Button variant="primary" type='submit'>
                            Submit
                        </Button>
                    </div>
                </form>
            </MyModal>
            <div>
                <h1>SIT Configuration</h1>
                <div className='row'>
                    <div className='col col-md-2 sit-level-container'>
                        <label>Level</label>
                        <div className='sit-level-list'>
                            {SITLevel?.map((sit) => (
                                <Fragment key={"level-" + sit.id}>
                                    {sit.enabled ? (
                                        <div className='sit-level'>
                                            <button className={'btn' + (selectedSITLevel?.id === sit.id ? " active" : "")} onClick={() => onSelectLevel(sit)}>
                                                <label>{sit.label}</label>
                                            </button>
                                            {staff && staff.role !== 3 ? <Fragment>
                                                <button className='btn' onClick={() => onSelectEdit(sit)}>
                                                    <i className='bi bi-pencil' />
                                                </button>
                                                <button className='btn' onClick={() => onDisableSITLevel(sit.id)}>
                                                    <i className='bi bi-x' />
                                                </button>
                                            </Fragment> : null}

                                        </div>
                                    ) : null}
                                </Fragment>
                            ))}
                        </div>
                        <div>
                            {staff && staff.role !== 3 ? <button type='button' className='btn add-btn' aria-label='add SIT level' onClick={() => onOpenSITLevelModal()}>
                                <i className='bi bi-plus' />
                            </button> : null}

                        </div>
                    </div>
                    <div className='col col-md-10'>
                        <label>Requirements</label>
                        <div className='sit-requirements-list'>
                            {SITRequirement.map((sit) => (
                                <Fragment key={"requirement-" + sit.id}>
                                    {sit.enabled ? (
                                        <div className='sit-level'>
                                            <button className={'btn'}>
                                                <label>{sit.label}</label>
                                            </button>
                                            {staff && staff.role !== 3 ? <Fragment>
                                                <button className='btn' onClick={() => onSelectEditRequirement(sit)}>
                                                    <i className='bi bi-pencil' />
                                                </button>
                                                <button className='btn' onClick={() => onDisableSITRequirement(sit.id)}>
                                                    <i className='bi bi-x' />
                                                </button>
                                            </Fragment> : null}
                                        </div>
                                    ) : null}
                                </Fragment>
                            ))}
                            {staff && staff.role !== 3 ? <button type='button' className='btn add-btn' aria-label='add SIT requirement' onClick={() => setOnShowRequirements(true)}>
                                <i className='bi bi-plus' />
                            </button> : null}

                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default SitComponent;