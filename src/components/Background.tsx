import "./Background.scss";

function Background() {
  return (
    <div className="background">
      <svg
        className="waves"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 24 150 28"
        preserveAspectRatio="none"
        shapeRendering="auto"
      >
        <g>
          <path
            id="gentle-wave"
            x="48"
            y="7"
            d="M-160 44c30 0 58-18 88-18s 58 18 88 18 58-18 88-18 58 18 88 18 v44h-352z"
          ></path>
        </g>
      </svg>
    </div>
  );
}
export default Background;
