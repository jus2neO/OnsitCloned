import { useEffect } from 'react';

const Logout = () => {
    useEffect(() => {
        localStorage.removeItem("currentStudent");
        window.location.href = "/";
    },[]);
    return (
        <div>logging out...</div>
    )
}

export default Logout;