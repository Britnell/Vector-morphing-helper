import { useState } from "react";
import { useSpring, animated } from "@react-spring/web";

// https://dev.to/tomdohnal/react-svg-animation-with-react-spring-4-2kba
// https://codesandbox.io/s/m9zwk5zqm8

export default function Morph({ shapeA, shapeB }: any) {
  const [active, setActive] = useState(false);
  const { x } = useSpring({ config: { duration: 800 }, x: active ? 1 : 0 });

  const paths = {
    a: Array.from<SVGElement>(shapeA.children).map(
      (path) => path.attributes.d.value
    ),
    b: Array.from<SVGElement>(shapeB.children).map(
      (path) => path.attributes.d.value
    ),
  };

  return (
    <div>
      <h3>Morphin</h3>
      <button onClick={() => setActive(!active)}>FLIP</button>
      <svg
        width="200"
        height="200"
        viewBox="0 0 1187 1186"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <animated.path
          d={x.to({
            range: [0, 1],
            output: [paths.a[0], paths.b[0]],
          })}
          stroke="black"
          strokeWidth="6"
        />
        {[0, 0].map((_, i) => (
          <animated.path
            d={x.to({
              range: [0, 1],
              output: [paths.a[i], paths.b[i]],
            })}
            stroke="black"
            strokeWidth="6"
          />
        ))}
      </svg>

      {/* <SVG path={path} /> */}
      {/* <SVG path={out} /> */}
    </div>
  );
}

const Spring = ({ shapeA, shapeB }: any) => {
  const pathA = shapeA.props.children.props;
  const pathB = shapeB.props.children.props;

  console.log(morph.d, pathA.d);

  return (
    <div>
      <h3>Morphin</h3>
      <div>Shape A{shapeA}</div>
      <div>Shape b{shapeB}</div>
      <button onClick={() => setState(!state)}>Flip</button>
      <svg
        width="200"
        height="200"
        viewBox="0 0 1187 1186"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <animated.path d={morph.d} stroke="black" />
      </svg>
    </div>
  );
};

const SVG = ({ path, width = "200", height = "200" }: any) => (
  <svg
    width={width}
    height={height}
    viewBox="0 0 1187 1186"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d={path} stroke="black" />
  </svg>
);
