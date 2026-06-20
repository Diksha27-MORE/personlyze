import { useLocation, useNavigate } from "react-router-dom";
import "./IndustryVideoPage.css";

export default function IndustryVideoPage() {
  const location = useLocation();
  const navigate = useNavigate();

  const industry = location.state;

  if (!industry) {
    return (
      <div style={{ color: "white", background: "black", height: "100vh" }}>
        No video selected
      </div>
    );
  }

  return (
    <div className="ivp-container" onClick={() => navigate("/")}>
      <video
        src={industry.video}
        autoPlay
        muted
        loop
        className="ivp-video"
      />

      <h1 className="ivp-title">{industry.name}</h1>
    </div>
  );
}