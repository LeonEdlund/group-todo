import { createPolygon, generatePathString } from 'useless-blobs';

export class SvgGenerator {
  static generateSvg() {
    const smoothing = Math.random();
    const options = {
      verts: Math.floor(Math.random() * 50) + 5,
      width: 500,
      height: 600,
      irregularity: Math.random(),
      spikiness: 0.8,
      boundingShape: 'eclipse'
    };
    const colors = ["#79DAEF", "#EF7979", "#AC79EF", "#EF79AE", "#DF5543"];
    const polygonPoints = createPolygon(options);
    const pathString = generatePathString(polygonPoints, smoothing);
    const svgNS = "http://www.w3.org/2000/svg";
    const svg = document.createElementNS(svgNS, "svg");
    const pathEl = document.createElementNS(svgNS, "path");

    svg.setAttribute("width", "100%");
    svg.setAttribute("height", "100%");
    svg.setAttribute("fill", colors[Math.floor(Math.random() * colors.length)]);
    pathEl.setAttribute("d", pathString);
    svg.appendChild(pathEl);
    return svg;

  }
}