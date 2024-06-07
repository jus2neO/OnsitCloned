import { useEffect, useState } from "react";
import { Outlet, Link } from "react-router-dom";
import { getAllCompany, removeCompanyFromStudents } from "../services/companyServices";
import "./common.scss"

const Navigation = () => {
    const [isLogin, setIsLogin] = useState<boolean>(false);
    const token = "";

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
        const currentStaff = localStorage.getItem("currentStaff");
        if (!currentStaff) {
            window.location.href = "/login";
        } else {
            setIsLogin(true);
        }
    }, []);
    return (
        <div className='main-container'>
            <div className='container-fluid'>
                {isLogin ?
                    <div className='row'>
                        <div className='onsit-bg col-auto col-2 min-vh-100 d-flex justify-content-between flex-column'>
                            <div className="navigation">
                                <div>
                                    <a className='navbar-brand'>
                                        <span className='ms-1 fs-4'>ONSIT</span>
                                    </a>
                                    <hr className='text-secondary d-none d-sm-block' />
                                    <ul className='nav nav-pills flex-column mt-3 mt-sm-0'>
                                        <li className='nav-item text-white fs-4 my-1 py-2 py-sm-0'>
                                            <Link to="/" className='nav-link text-white fs-5' aria-current="page">
                                                <i className='bi bi-house' />
                                                <span className='ms-3 d-none d-sm-inline'>Homepage</span>
                                            </Link>
                                        </li>
                                        <li className='nav-item text-white fs-4 my-1 py-2 py-sm-0'>
                                            <Link to="appointments" className='nav-link text-white fs-5' aria-current="page">
                                                <i className="bi bi-calendar-event" />
                                                <span className='ms-3 d-none d-sm-inline'>Appointments</span>
                                            </Link>
                                        </li>
                                        <li className='nav-item text-white fs-4 my-1 py-2 py-sm-0'>
                                            <Link to="requirementscompanies" className='nav-link text-white fs-5' aria-current="page">
                                                <i className='bi bi-table' />
                                                <span className='ms-3 d-none d-sm-inline'>Requirements / Companies</span>
                                            </Link>
                                        </li>
                                        {/*
                                            <li className='nav-item text-white fs-4 my-1 py-2 py-sm-0'>
                                                <Link to="role" className='nav-link text-white fs-5' aria-current="page">
                                                    <i className='bi bi-grid' />
                                                    <span className='ms-3 d-none d-sm-inline'>Role</span>
                                                </Link>
                                            </li>
                                        */}

                                        <li className='nav-item text-white fs-4 my-1 py-2 py-sm-0'>
                                            <Link to="staffaccounts" className='nav-link text-white fs-5' aria-current="page">
                                                <i className='bi bi-people' />
                                                <span className='ms-3 d-none d-sm-inline'>Staff Accounts</span>
                                            </Link>
                                        </li>
                                        <li className='nav-item text-white fs-4 my-1 py-2 py-sm-0'>
                                            <Link to="activityoverview" className='nav-link text-white fs-5' aria-current="page">
                                                <i className='bi bi-grid' />
                                                <span className='ms-3 d-none d-sm-inline'>Activity Overview</span>
                                            </Link>
                                        </li>
                                        <li className='nav-item text-white fs-4 my-1 py-2 py-sm-0'>
                                            <Link to="studentportal" className='nav-link text-white fs-5' aria-current="page">
                                                <i className='bi bi-people' />
                                                <span className='ms-3 d-none d-sm-inline'>Student Portal</span>
                                            </Link>
                                        </li>
                                        <li className='nav-item text-white fs-4 my-1 py-2 py-sm-0'>
                                            <Link to="sitconfiguration" className='nav-link text-white fs-5' aria-current="page">
                                                <i className="bi bi-bank"></i>
                                                <span className='ms-3 d-none d-sm-inline'>SIT Configuration</span>
                                            </Link>
                                        </li>
                                        <li className='nav-item text-white fs-4 my-1 py-2 py-sm-0'>
                                            <Link to="courseportal" className='nav-link text-white fs-5' aria-current="page">
                                                <i className="bi bi-backpack" />
                                                <span className='ms-3 d-none d-sm-inline'>Course</span>
                                            </Link>
                                        </li>
                                        <li className='nav-item text-white fs-4 my-1 py-2 py-sm-0'>
                                            <Link to="company" className='nav-link text-white fs-5' aria-current="page">
                                                <i className="bi bi-building" />
                                                <span className='ms-3 d-none d-sm-inline'>Company</span>
                                            </Link>
                                        </li>
                                        <li className='nav-item text-white fs-4 my-1 py-2 py-sm-0'>
                                            <Link to="dtr" className='nav-link text-white fs-5' aria-current="page">
                                                <i className="bi bi-calendar-check-fill" />
                                                <span className='ms-3 d-none d-sm-inline'>DTR</span>
                                            </Link>
                                        </li>
                                    </ul>
                                </div>
                                <div className='secondary-nav'>
                                    <ul className='nav nav-pills flex-column mt-3 mt-sm-0'>
                                        <li className='nav-item text-white fs-4 my-1 py-2 py-sm-0'>
                                            <Link to="settings" className='nav-link text-white fs-5' aria-current="page">
                                                <i className="bi bi-gear" />
                                                <span className='ms-3 d-none d-sm-inline'>Settings</span>
                                            </Link>
                                        </li>
                                        <li className='nav-item text-white fs-4 my-1 py-2 py-sm-0'>
                                            <Link to="aboutus" className='nav-link text-white fs-5' aria-current="page">
                                                <i className='bi bi-file-person' />
                                                <span className='ms-3 d-none d-sm-inline'>About Us</span>
                                            </Link>
                                        </li>
                                        <li className='nav-item text-white fs-4 my-1 py-2 py-sm-0'>
                                            <Link to="logout" className='nav-link text-white fs-5' aria-current="page">
                                                <i className='bi bi-door-closed' />
                                                <span className='ms-3 d-none d-sm-inline'>Logout</span>
                                            </Link>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                        <div className='col-auto col-10 layout-container'>
                            <Outlet />
                        </div>
                    </div>
                    : null}
            </div>
        </div>
    )
}

export default Navigation;