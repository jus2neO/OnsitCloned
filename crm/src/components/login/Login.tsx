import { useState } from 'react';
import { ILogin } from "../services/type.interface";
import { loginStaff } from "../services/authServices";
import Button from 'react-bootstrap/Button';
import "./login.scss";

export interface ILoginProps {
    onRedirect: () => void;
}

const Login = ({ onRedirect }: ILoginProps) => {
    const [errorMessage, seterrorMessage] = useState<string>("");
    const [successMessage, setSuccessMessage] = useState<string>("");
    const [formData, setFormData] = useState<ILogin>({
        email: '',
        password: ''
    });

    const { email, password } = formData;

    const onSubmitForm = async (e: any) => {
        e.preventDefault();
        seterrorMessage("");
        setSuccessMessage("");
        await loginStaff(formData).then((res: any) => {
            const newUser = res;
            localStorage.setItem("currentStaff", JSON.stringify(newUser));
            setSuccessMessage("Successfully logged in, redirecting now.");
            onRedirect();
            setTimeout(() => {
                window.location.href = "/";
            }, 2000);
        }).catch((err) => {

            if (err?.response?.data?.errors) {
                let newError = "";
                err?.response?.data?.errors.forEach((er: any, index: number) => {
                    newError += (index === 0 ? "" : ", ") + er.msg;
                });
                seterrorMessage(newError);
            } else if (err?.response?.data) {
                seterrorMessage(err.response.data);
            }

            console.log("Error login: ", err);
        });
    }

    const onChange = (e: any) => setFormData({ ...formData, [e.target.name]: e.target.value });

    return (
        <div className='login-container'>
            <div className="container">
                <div className="row justify-content-md-center">
                    <div className="card" style={{ width: "18rem" }}>
                        <div className="card-body">
                            <h5 className="card-title">Staff Login</h5>
                            <form onSubmit={onSubmitForm}>
                                <div className="form-group">
                                    <label htmlFor="studentID">Email</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        id="studentID"
                                        name='email'
                                        aria-describedby="emailHelp"
                                        placeholder="Enter Staff Email"
                                        value={email}
                                        onChange={onChange}
                                    />
                                </div>
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
                                        Login
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

export default Login;