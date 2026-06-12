import "./Workspace.css";
import workspaceImage from "../assets/workspace.jpeg";

function Workspace() {
  return (
    <section className="workspace">

      {/* Heading */}
      <h1 className="workspace-title">
        Welcome to Personlyze.ai 👋
      </h1>

      {/* Buttons */}
      <div className="workspace-buttons">

        <button>
          ✨ AI Personalization
        </button>

        <button>
          🎥 Watch Demo
        </button>

        <button>
          🚀 Explore Platform
          <span>BETA</span>
        </button>

      </div>

      {/* Entire Card Clickable */}
      <a
        href="https://www.youtube.com/watch?v=qPMJL64Qvq0"
        target="_blank"
        rel="noopener noreferrer"
        className="workspace-card"
      >
        <img
          src={workspaceImage}
          alt="Personlyze"
        />

        <div className="workspace-overlay"></div>

        {/* Play Button */}
        <div className="play-button">
          ▶
        </div>

        {/* Bottom Text */}
        <div className="workspace-text">

          <h2>
            Discover the Future of AI Personalization
          </h2>

          <p>
            See how Personlyze.ai transforms customer
            experiences with intelligent recommendations,
            dynamic journeys, and real-time personalization
            in under 2 minutes.
          </p>

        </div>

      </a>

    </section>
  );
}

export default Workspace;