import Axis from "../../utils/Axis";
import Vector3 from "../../utils/Vector3";
import SolidBlock from "./Blocks/SolidBlock";

class Playground {
  constructor({ canvasWidth, canvasHeight, xLen, yLen, zLen, angles }) {
    this.xLen = xLen;
    this.yLen = yLen;
    this.zLen = zLen;
    this.center = new Vector3(xLen / 2, yLen / 2, zLen / 2);
    this.angles = {
      theta: angles?.theta || 0, 
      phi: angles?.phi || 0
    };

    this.canvasWidth = canvasWidth;
    this.canvasHeight = canvasHeight;
    this.stretchMult = Math.min(canvasWidth, canvasHeight) / Math.max(xLen, yLen, zLen);
    this.screenZ = Math.min(canvasWidth, canvasHeight);
    this.cameraZ = Math.min(canvasWidth, canvasHeight) * 2;
    this.distance = this.cameraZ - this.screenZ;

    this._pg = Array.from({ length: xLen }, () => 
      Array.from({ length: yLen }, () => 
        Array.from({ length: zLen }, () => new SolidBlock())
      )
    );
    this._cursorAt = { x: 0, y: 0 };

    this._pg[1][2][3] = this._pg[5][3][1] = this._pg[2][4][5] = null;
  }

  _prevRefX = 0;
  _prevRefY = 0;
  adjustAngles(cursorX, cursorY, init) {
    if (!init) {
      this.angles = {
        theta: this.angles.theta - (cursorX - this._prevRefX) * 0.0087, 
        phi: Math.max(Math.min(this.angles.phi + (cursorY - this._prevRefY) * 0.0087, Math.PI / 2), -(Math.PI / 2))
      }
    }

    this._prevRefX = cursorX;
    this._prevRefY = cursorY;
  }

  place(block, canvasX, canvasY) {
    this._cursorAt = { x: canvasX, y: canvasY };

    const target = this._target;
    if (!target) return;

    let { cords: { x, y, z }, norm } = target;
    x += norm.x;
    y += norm.y;
    z += norm.z;
    if (!(0 <= x && x < this.xLen && 0 <= y && y < this.yLen && 0 <= z && z < this.zLen)) return;

    this._pg[x][y][z] = new SolidBlock();
  }

  destroy(canvasX, canvasY) {
    this._cursorAt = { x: canvasX, y: canvasY };

    const target = this._target;
    if (!target) return;

    const { cords: { x, y, z } } = target;
    if (!(0 <= x && x < this.xLen && 0 <= y && y < this.yLen && 0 <= z && z < this.zLen)) return;

    this._pg[x][y][z] = null;
  }

  renderOn(canvas) {
    const context = canvas.getContext('2d');
    context.fillStyle = 'white';
    context.fillRect(0, 0, canvas.width, canvas.height);
    
    const surfaces = this._exposedSurfaces();
    const projectedSurfaces = this._projectSurfaces(surfaces);

    projectedSurfaces.sort(({ surface: { points: p1 } }, { surface: { points: p2 } }) => 
      Math.min(...p1.map(p => p.z)) - 
      Math.min(...p2.map(p => p.z))
    );

    projectedSurfaces.forEach(({ surface : { points: [p1, p2, p3, p4], color } }) => {
      context.fillStyle = color;
      context.beginPath();
      context.moveTo(p1.x, p1.y);
      context.lineTo(p2.x, p2.y);
      context.lineTo(p3.x, p3.y);
      context.lineTo(p4.x, p4.y);
      context.closePath();
      context.fill();
    });
  }

  get _target() {
    const surfaces = this._exposedSurfaces();
    const projectedSurfaces = this._projectSurfaces(surfaces);

    let maxZ = -Infinity;
    let target = null;

    projectedSurfaces.forEach(({ cords, surface: { points, points: [p1, p2, p3, p4] }, norm }) => {
      const min = Math.min(...points.map(p => p.z));
      if (maxZ >= min) return;

      let sign = 0, v1, v2, cross;
      for (let i = 0; i < 4; i++) {
        const { x: x1, y: y1 } = points[i];
        const { x: x2, y: y2 } = points[(i + 1) & 3];

        v1 = { x: x2 - x1, y: y2 - y1 };
        v2 = { x: this._cursorAt.x - x1, y: this._cursorAt.y - y1 };
        cross = v1.x * v2.y - v2.x * v1.y;
        if (cross * sign < 0) return;
        sign = cross > 0 ? 1 : (cross === 0 ? 0 : -1);
      }

      maxZ = min;
      target = { cords, norm };
    });

    return target;
  }

  _exposedSurfaces() {
    const surfaces = [];

    [[1, 0, 0], [0, 1, 0], [0, 0, 1]].forEach(([dx, dy, dz]) => {
      const posDir = dx ? Axis.PX : dy ? Axis.PY : Axis.PZ;
      const negDir = dx ? Axis.NX : dy ? Axis.NY : Axis.NZ;

      for (let i = -1; i < this.xLen; i++) {
        for (let j = -1; j < this.yLen; j++) {
          for (let k = -1; k < this.zLen; k++) {
            const p = i + dx, q = j + dy, r = k + dz;

            const prevExist = 0 <= i && i < this.xLen && 0 <= j && j < this.yLen && 0 <= k && k < this.zLen && !!this._pg[i][j][k];
            const nextExist = 0 <= p && p < this.xLen && 0 <= q && q < this.yLen && 0 <= r && r < this.zLen && !!this._pg[p][q][r];
            
            // ASSUME: All blocks are opaque full blocks
            if (prevExist === nextExist) continue;

            if (prevExist) {
              surfaces.push({
                cords: new Vector3(i, j, k), 
                surface: this._pg[i][j][k].surface(i, j, k, posDir), 
                norm: posDir
              });
            }
            else if (nextExist) {
              surfaces.push({
                cords: new Vector3(p, q, r), 
                surface: this._pg[p][q][r].surface(p, q, r, negDir), 
                norm: negDir
              });
            }
          }
        }
      }
    });

    return surfaces;
  }

  _projectSurfaces(surfaces) {
    const offset = new Vector3(this.canvasWidth / 2, this.canvasHeight / 2, 0);

    surfaces.forEach(({ surface }) => {
      surface.points = surface.points.map(vec => 
        vec.subtract(this.center)
          .multiply(this.stretchMult)
          .rotateY(this.angles.theta)
          .rotateX(this.angles.phi)
          .projectZ(this.cameraZ, this.distance)
          .mirrorY()
          .add(offset)
      );
    });
    return surfaces;
  }
}

export default Playground;