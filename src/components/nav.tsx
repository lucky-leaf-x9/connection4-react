import { useNavigate } from "react-router-dom";

function Nav() {
    const navigate = useNavigate();

    return (
        <div className="nav">
            <button className="button green small" style={{ margin: "auto", marginTop:"0.5rem" }} onClick={() => navigate("/")}>
                Home
            </button>
        </div>
    );
}
export default Nav;
