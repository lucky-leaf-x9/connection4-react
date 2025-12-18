import { useNavigate, useLocation } from "react-router-dom";
function Nav() {
    const navigate = useNavigate();
    const location = useLocation();
    if (location.pathname === "/") return (<></>)

    return (
        <div className="nav">
            <button className="button default small" style={{ margin: "auto", marginTop:"0.5rem" }} onClick={() => navigate("/")}>
                Home
            </button>
        </div>
    );
}
export default Nav;
