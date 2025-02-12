import { createPolygon, generatePathString } from 'useless-blobs';

export class SvgGenerator {
  constructor(options) {
    this.smoothing = 1;
    this.options = options || {
      verts: 30,
      width: 600,
      height: 400,
      irregularity: .5,
      spikiness: 0.8,
      boundingShape: 'eclipse'
    };
  }

  colors = ["#79DAEF", "#EF7979", "#AC79EF"];

  generateSvg() {
    const polygonPoints = createPolygon(this.options);
    const pathString = generatePathString(polygonPoints, this.smoothing);
    const svgNS = "http://www.w3.org/2000/svg";
    const svg = document.createElementNS(svgNS, "svg");
    svg.setAttribute("width", this.options.width);
    svg.setAttribute("height", this.options.height);
    svg.setAttribute("fill", this.colors[Math.floor(Math.random() * this.colors.length)]);

    const pathEl = document.createElementNS(svgNS, "path");
    pathEl.setAttribute("d", pathString);
    svg.appendChild(pathEl);
    return svg;
  }
}