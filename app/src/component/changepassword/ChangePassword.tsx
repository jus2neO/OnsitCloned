import {useEffect, useState} from 'react';
import {changePassword} from "../services/studentServices";
import "./changepassword.scss";
import Button from 'react-bootstrap/Button';

const ChangePassword = () => {
    const [errorMessage, seterrorMessage] = useState<string>("");
    const [successMessage, setSuccessMessage] = useState<string>("");
    const [formData, setFormData] = useState({
        password: '',
        passwordverify: ''
    });

    const { password, passwordverify } = formData;

    const onSubmitForm = async () => {

    }

    const onChange = (e: any) => setFormData({...formData, [e.target.name]: e.target.value});

    return (
        <div className='login-container'>
            <div className="container">
                <div className="row justify-content-md-center">
                    <div className="card" style={{width: "18rem"}}>
                        <div className="card-body">
                            <h5 className="card-title">Student Login</h5>
                            <form onSubmit={onSubmitForm}>
                                <div className="form-group">
                                    <label htmlFor="password">Password</label>
                                    <input
                                        className="form-control" 
                                        id="password"
                                        type='password'
                                        name='password'
                                        placeholder="Enter password"
                                        value={password}
                                        onChange={onChange}
                                    />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="passwordverify">Verify Password</label>
                                    <input
                                        className="form-control" 
                                        id="passwordverify"
                                        type='password'
                                        name='passwordverify'
                                        placeholder="Verify password"
                                        value={passwordverify}
                                        onChange={onChange}
                                    />
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
                                {!successMessage ? <div className='sit-level-btn-container'>
                                    <Button variant="primary" type='submit'>
                                        Submit
                                    </Button>
                                </div> : null}
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ChangePassword;