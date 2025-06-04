import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { readToken, logout } from "../scripts/token";

function Profile() {
    const navigate = useNavigate();
    const tokenData = readToken();

    useEffect(() => {
        if (!tokenData) {
            navigate("/auth");
        }
    }, [tokenData, navigate]);

    if (!tokenData) {
        return null;
    }

    const handleLogout = () => {
        logout();
        navigate("/auth");
    };

    return (
        <div>
            <h2>Profile</h2>
            <p><strong>Name:</strong> {tokenData.name || "N/A"}</p>
            <p><strong>Email:</strong> {tokenData.email || "N/A"}</p>
            <button onClick={handleLogout}>Logout</button>
        </div>
    );
}

export default Profile;