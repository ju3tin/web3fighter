
import { useState } from "react";

export default function Pad1a() {
const [pressed, setPressed] = useState(null);

  const handleDown = (id) => {
    console.log("Pressed:", id);
    setPressed(id);
  };

  const handleUp = () => {
    setPressed(null);
  };

   const handleDown1 = (id) => {
    console.log("Pressed:", id);
    setPressed(id);
  };

  const handleUp1 = () => {
    setPressed(null);
  };

  const handleDown2 = (id) => {
    console.log("Pressed:", id);
    setPressed(id);
  };

  const handleUp2 = () => {
    setPressed(null);
  };
  const handleDown3 = (id) => {
    console.log("Pressed:", id);
    setPressed(id);
  };

  const handleUp3 = () => {
    setPressed(null);
  };

  const handleDown4 = (id) => {
    console.log("Pressed:", id);
    setPressed(id);
  };

  const handleUp4 = () => {
    setPressed(null);
  };

  const handleDown5 = (id) => {
    console.log("Pressed:", id);
    setPressed(id);
  };

  const handleUp5 = () => {
    setPressed(null);
  };

  const handleDown6 = (id) => {
    console.log("Pressed:", id);
    setPressed(id);
  };

  const handleUp6 = () => {
    setPressed(null);
  };

  const handleDown7 = (id) => {
    console.log("Pressed:", id);
    setPressed(id);
  };

  const handleUp7 = () => {
    setPressed(null);
  };

  const handleDown8 = (id) => {
    console.log("Pressed:", id);
    setPressed(id);
  };

  const handleUp8 = () => {
    setPressed(null);
  };
  
  return (
     <svg xmlns="http://www.w3.org/2000/svg" width={128} height={128} opacity="0.5">
    <circle
      id="circle1a"
      cx={-64.245}
      cy={64.011}
      r={62.862}
      style={{
        display: "inline",
        fill: "#333",
        fillRule: "evenodd",
        stroke: "#000",
        strokeWidth: 1.65824,
        strokeLinecap: "round",
        strokeLinejoin: "round",
      }}
      transform="scale(-1 1)"
    />
    <path
      id="path1a"
      d="M47.759 4.764c-3.238 0-5.884 2.645-5.884 5.883v31.021H10.787c-3.238 0-5.82 2.645-5.82 5.883v32.99c0 3.258 2.582 5.903 5.82 5.903h31.088v31a5.884 5.884 0 0 0 5.884 5.883h33.014c3.238 0 5.82-2.624 5.82-5.883v-31h31.067c3.26 0 5.82-2.645 5.82-5.904V47.55c0-3.237-2.56-5.882-5.82-5.882H86.593V10.647c0-3.238-2.582-5.883-5.82-5.883z"
      style={{
        display: "inline",
        fill: "#262626",
        fillRule: "evenodd",
        strokeWidth: 2.11618,
        cursor: "pointer",
      }}
      onPointerDown={() => handleDown("top")}
      onPointerUp={handleUp}
    />
    <ellipse
      id="ellipse1a"
      cx={64.232}
      cy={105.772}
      rx={18.754}
      ry={19.333}
      style={{
        fill: "#5a5a5a",
        fillRule: "evenodd",
        stroke: "#454545",
        strokeWidth: 2.31218,
        strokeLinecap: "round",
        strokeLinejoin: "round",
        cursor: "pointer",
      }}
      onPointerDown={() => handleDown1("top")}
      onPointerUp={handleUp1}
    />
    <ellipse
      id="ellipse2a"
      cx={64.232}
      cy={22.608}
      rx={18.754}
      ry={19.333}
      style={{
        display: "inline",
        fill: "#5a5a5a",
        fillRule: "evenodd",
        stroke: "#454545",
        strokeWidth: 2.31218,
        strokeLinecap: "round",
        strokeLinejoin: "round",
        cursor: "pointer",
      }}
      onPointerDown={() => handleDown2("top")}
      onPointerUp={handleUp2}
    />
    <ellipse
      id="ellipse3a"
      cx={-23.907}
      cy={-64.246}
      rx={18.754}
      ry={19.333}
      style={{
        fill: "#5a5a5a",
        fillRule: "evenodd",
        stroke: "#454545",
        strokeWidth: 2.31218,
        strokeLinecap: "round",
        strokeLinejoin: "round",
        cursor: "pointer",
      }}
      transform="scale(-1)"
      onPointerDown={() => handleDown3("top")}
      onPointerUp={handleUp3}
    />
    <ellipse
      id="ellipse4a"
      cx={-104.102}
      cy={-63.843}
      rx={18.754}
      ry={19.333}
      style={{
        fill: "#5a5a5a",
        fillRule: "evenodd",
        stroke: "#454545",
        strokeWidth: 2.31218,
        strokeLinecap: "round",
        strokeLinejoin: "round",
        cursor: "pointer",
      }}
      transform="scale(-1)"
      onPointerDown={() => handleDown4("top")}
      onPointerUp={handleUp4}
    />
    <path
      id="ellipse5a"
      d="M76.184 30.439H52.28L64.23 9.132Z"
      style={{
        fill: "none",
        stroke: "#00ff83",
        strokeWidth: 2.31213,
        cursor: "pointer",
      }}
      onPointerDown={() => handleDown5("top")}
      onPointerUp={handleUp5}
    />
    <rect
      id="rect1a"
      width={21.47}
      height={22.134}
      x={13.166}
      y={53.125}
      rx={0}
      ry={0}
      style={{
        fill: "none",
        stroke: "#ff01db",
        strokeWidth: 2.31218,
        cursor: "pointer",
      }}
      onPointerDown={() => handleDown6("top")}
      onPointerUp={handleUp6}
    />
    <ellipse
      id="ellipse11a"
      cx={-104.566}
      cy={-64.19}
      rx={12.86}
      ry={13.257}
      style={{
        fill: "none",
        stroke: "red",
        strokeWidth: 3.37186,
        strokeLinecap: "round",
        strokeLinejoin: "round",
        cursor: "pointer",
      }}
      transform="scale(-1)"
      onPointerDown={() => handleDown7("top")}
      onPointerUp={handleUp7}
    />
    <path
      id="ellipse1ppa"
      d="m54.726 96.157 19.357 19.955m0-19.955-19.357 19.955"
      style={{
        fill: "none",
        stroke: "#8243fb",
        strokeWidth: 2.31218,
        cursor: "pointer",
      }}
      onPointerDown={() => handleDown8("top")}
      onPointerUp={handleUp8}
    />
  </svg>
     );
}
