import { useState, useEffect, Fragment } from "react";
import './common.scss';
import { Outlet, Link } from "react-router-dom";
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';
import { IStudent, INotification, ICompany } from "../services/type.interface";
import { getAllNotificationByStudentId, updateNotificationRead } from "../services/notificationServices";
import { getAllCompany } from "../services/companyServices";
import { removeCompanyFromStudents } from "../services/companyServices";

export interface INavigationProps {
    isLogin: boolean;
    currentStudent?: IStudent;
}

const Navigation = ({ isLogin, currentStudent }: INavigationProps) => {
    const [notification, setNotification] = useState<INotification[]>();
    const [company, setCompany] = useState<ICompany[]>();
    const [hasNew, sethasNew] = useState<boolean>(false);
    const token = "";

    const fetchNotification = async () => {
        if (currentStudent) {
            await getAllNotificationByStudentId(token, currentStudent.id).then((res: any) => {
                const newRes = res.sort(function(a: any, b: any) {
                    const newA = a.id;
                    const newB = b.id;
                    return newB - newA;
                  });
                setNotification(newRes);
                const mynotif = res.find((not: any) => { return not.isread === 0 });

                sethasNew(mynotif);
            }).catch(err => {
                console.log("Error: ", err);
            });
        }
    }

    const onNotificationClick = async (id: number) => {
        const data = {
            isread: true
        };
        await updateNotificationRead(token, id.toString(), { isread: true }).then((res) => {
            const mynotification = notification?.find((not) => { return not.id === id });
            if (mynotification) {
                mynotification.isread = false;
            }

            const mynotif = notification?.find((not: any) => { return not.isread === 0 });
            sethasNew(mynotif ? true : false);
        }).catch(err => {

        });
    }

    const onFetchCompanies = async () => {
        await getAllCompany(token).then((res: any) => {
            if(res){
                res.forEach((comp: any) => {
                    if(comp?.expiration){
                        const expiration = new Date(comp.expiration);
                        if(new Date() >= expiration){
                            removeCompanyFromStudents(token, comp.id.toString(), { companyid: comp.id, CompanyStatus: "pending" }).then(res => {
                                Promise.resolve(true);
                              }).catch((err) => {
                                console.log("Error: ", err);
                              });
                        }
                    }
                });
            }
        }).catch(err => {
            console.log("Error: ", err);
        });
    }

    useEffect(() => {
        onFetchCompanies();
    }, []);

    useEffect(() => {
        if (currentStudent) {
            fetchNotification();
        }
    }, [currentStudent]);
    return (
        <div className='layout'>
            <Navbar expand="lg" style={{ backgroundColor: "#B72447" }}>
                <Link to="/" className='navbar-brand' aria-current="page">
                    <span>ONSIT</span>
                </Link>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="me-auto">
                        <Link to="/" className='nav-link' aria-current="page">
                            <span>Home</span>
                        </Link>
                        <Link to="/requirements" className='nav-link' aria-current="page">
                            <span>Requirements</span>
                        </Link>
                        <Link to="/companies" className='nav-link' aria-current="page">
                            <span>Companies</span>
                        </Link>
                        <Link to="/bookappointment" className='nav-link' aria-current="page">
                            <span>Book Appointment</span>
                        </Link>
                    </Nav>
                </Navbar.Collapse>
                <Navbar.Collapse className="justify-content-end">
                    {isLogin ?
                        <div className="user-nav">
                            <NavDropdown title={<div className="notif-bell"><i className="bi bi-bell-fill" />{hasNew ? <div className="dot"></div> : null}</div>}
                                id={`notification-dropdown`}
                                align="end"
                            >
                                <div className="notification-container">
                                    {notification?.map((not) => (
                                        <Link
                                            to={not.link}
                                            data-rr-ui-dropdown-item
                                            className='dropdown-item'
                                            aria-current="page"
                                            onClick={() => onNotificationClick(not.id)}
                                        >
                                            <div className="notification">
                                                <div className="icon-container">
                                                    <i className="bi bi-calendar-event" />
                                                </div>
                                                <div className="para-container">
                                                    <p>{not.description}</p>
                                                </div>
                                            </div>
                                        </Link>
                                    ))}
                                </div>
                            </NavDropdown>
                            <NavDropdown title={<i className="bi bi-person-circle"></i>}
                                id={`dropdown-button-drop-start`}
                                align="end"
                            >
                                <Link to="/profile" data-rr-ui-dropdown-item className='dropdown-item' aria-current="page">
                                    <span>Profile</span>
                                </Link>
                                <NavDropdown.Divider />
                                <Link to="/logout" data-rr-ui-dropdown-item className='dropdown-item' aria-current="page">
                                    <span>Logout</span>
                                </Link>
                            </NavDropdown>
                        </div>

                        : (
                            <Link to="/login" className='nav-link' aria-current="page">
                                <span>Login</span>
                            </Link>
                        )}
                </Navbar.Collapse>
            </Navbar>
            <div className='col-auto col-md-12 layout-container'>
                <Outlet />
            </div>
        </div>
    )
}

export default Navigation;