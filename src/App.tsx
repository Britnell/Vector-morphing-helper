import { useState } from "react";
import "./App.css";
import SVGPathCommander, { getTotalLength } from "svg-path-commander";
import Morph from "./morph";

const play = `<svg width="687" height="1046" viewBox="0 0 687 1046" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M340 258L0 0V1046L340 788V258Z" fill="black"/>
<path d="M687 522L341 259V785L687 522Z" fill="black"/>
</svg>`;

const pause = `<svg width="686" height="1046" viewBox="0 0 686 1046" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M0 1046V0H248V1046H0Z" fill="black"/>
<path d="M437 1046V0H686V1046H437Z" fill="black"/>
</svg>`;

const circle = `<svg
    width="200"
    height="200"
    viewBox="0 0 1205 1205"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M1.50014,602.5c-7.5,-263.5,188.5,-601.5,601,-601.5c412.5,0,601.5,288.5,601.5,601.5c0,313,-302.5,601.5,-601.5,601.5c-299,0,-601.5,-285,-601.5,-601.5"
      stroke="black"
      strokeWidth="6"
    />
  </svg>`;

const square = `<svg
    width="200"
    height="200"
    viewBox="0 0 1187 1186"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M593.5,1l-592,592l592,592l592,-592l-592,-592z"
      stroke="black"
      strokeWidth="6"
    />
  </svg>`;

function App() {
  const [inputs, setInputs] = useState({
    a: circle,
    b: square,
    inva: false,
    invb: false,
  });

  const svgA = formatSVG(inputs.a, inputs.inva);
  const svgB = formatSVG(inputs.b, inputs.invb);

  if (inputs.inva) svgA;
  makeEqual(svgA, svgB);

  return (
    <div className="App">
      <h1>Vector morphging</h1>
      <p>
        This combines a few of the steps you need to prepare svg's for morphing,
        i.e.
      </p>
      <ul>
        <li>convert shapes to paths</li>
        <li>convert segments to curves</li>
        <li>make relative (not absolute)</li>
      </ul>
      <p>What it doesnt do (yet)</p>
      <ul>
        <li>match number of paths - needs equal number of paths</li>
        <li>match sizes - images should have similar size (viewport)</li>
      </ul>
      <div className="mt-8">
        <div className="flex gap-4">
          <div className="flex-grow flex flex-col">
            <label htmlFor="input-a">input svg shape A</label>
            <textarea
              id="input-a"
              className="flex-grow bg-gray-200"
              value={inputs.a}
              onChange={(ev) => setInputs({ ...inputs, a: ev.target.value })}
            />
            <div>
              <label>Invert</label>
              <input
                type="checkbox"
                checked={inputs.inva}
                onChange={() => setInputs({ ...inputs, inva: !inputs.inva })}
              />
            </div>
            <ShowSVG svg={svgA.outerHTML} />
            <p>A Formatted : </p>
            <div className="bg-gray-100 p-1">{svgB.outerHTML}</div>
          </div>
          <div className="flex-grow flex flex-col">
            <label htmlFor="input-b">input svg shape B</label>
            <textarea
              id="input-b"
              className="flex-grow bg-gray-200"
              value={inputs.b}
              onChange={(ev) => setInputs({ ...inputs, b: ev.target.value })}
            />

            <div>
              <label>Invert</label>
              <input
                type="checkbox"
                checked={inputs.invb}
                onChange={() => setInputs({ ...inputs, invb: !inputs.invb })}
              />
            </div>
            <ShowSVG svg={svgB.outerHTML} />
            <p> B Formatted : </p>
            <div className="bg-gray-100 p-1">{svgB.outerHTML}</div>
          </div>
        </div>
        <Morph shapeA={svgA} shapeB={svgB} />
      </div>
    </div>
  );
}

const emptyNode = ["c", 0, 0, 0, 0, 0, 0];

const makeEqual = (svgA: HTMLElement, svgB: HTMLElement) => {
  if (svgA.children.length !== svgB.children.length)
    throw new Error(" SVGs have different number of paths / shapes ");

  const shapes = {
    a: Array.from(svgA.children),
    b: Array.from(svgB.children),
  };

  for (let s = 0; s < svgA.children.length; s++) {
    svgA.removeChild(shapes.a[s]);
    svgB.removeChild(shapes.b[s]);

    const shA = new SVGPathCommander(shapes.a[s].attributes.d.value);
    const shB = new SVGPathCommander(shapes.b[s].attributes.d.value);

    while (shA.segments.length < shB.segments.length) {
      shA.segments.push(emptyNode);
    }
    while (shA.segments.length > shB.segments.length) {
      shB.segments.push(emptyNode);
    }
    svgA.appendChild(shapes.a[s]);
    svgB.appendChild(shapes.b[s]);
  }
  return [svgA, svgB];
};

const parseSvg = (svgString: string): HTMLElement =>
  new DOMParser().parseFromString(svgString, "image/svg+xml").documentElement;

const formatPath = (pathNode: any) => {
  const path = pathNode.attributes?.d?.value;
  return new SVGPathCommander(path).toCurve().toRelative();
};

const formatSVG = (svgstring: string, invert: boolean) => {
  const svgxml = parseSvg(svgstring);
  const shapes = Array.from(svgxml.children) as HTMLElement[];

  // parse each shape
  shapes.forEach((child) => {
    // remove children
    svgxml.removeChild(child);

    let element = child;

    // convert shape
    if (element.nodeName !== "path")
      element = SVGPathCommander.shapeToPath(child) as HTMLElement;

    // format path.d
    let formatted = formatPath(element);
    // TODO - reverse here?

    element.attributes.d.value = formatted.toString();

    // add formated to element
    svgxml.appendChild(element);
  });

  return svgxml;
};

const ShowSVG = ({ svg }: any) => (
  <div dangerouslySetInnerHTML={{ __html: svg }}></div>
);

export default App;
