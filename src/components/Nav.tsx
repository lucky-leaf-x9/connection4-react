import { useLocation, useNavigate } from "react-router-dom";
import Button from "./Button";
import "./Nav.scss";
import ThemeSwitcher from "./ThemeSwitcher";

export default function Nav() {
  const navigate = useNavigate();
  const location = useLocation();
  if (location.pathname === "/") return <></>;

  return (
    <nav>
      <Button className="default small" onClick={() => navigate("/")} label="Home" style={{ width: "150px" }} />
      <ThemeSwitcher />
    </nav>
  );
}
