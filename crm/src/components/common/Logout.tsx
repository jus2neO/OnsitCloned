import { useEffect } from 'react';

const Logout = () => {
    useEffect(() => {
        localStorage.removeItem("currentStaff");
        window.location.href = "/login";
    },[]);
    return (
        <div>logging out...</div>
    )
}

export default Logout;