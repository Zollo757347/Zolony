const Directions = Object.freeze({
  PX: { x: 1, y: 0, z: 0, c: 'rgba(240, 120, 120, 0.3)' }, 
  PY: { x: 0, y: 1, z: 0, c: 'rgba(120, 240, 120, 0.3)' }, 
  PZ: { x: 0, y: 0, z: 1, c: 'rgba(120, 120, 240, 0.3)' }, 
  NX: { x: -1, y: 0, z: 0, c: 'rgba(120, 240, 240, 0.3)' }, 
  NY: { x: 0, y: -1, z: 0, c: 'rgba(240, 120, 240, 0.3)' }, 
  NZ: { x: 0, y: 0, z: -1, c: 'rgba(240, 240, 120, 0.3)' }
});

class Playground {
  constructor({ canvasWidth, canvasHeight, xLen, yLen, zLen, angles }) {
    this.canvasWidth = canvasWidth;
    this.canvasHeight = canvasHeight;
    this.xLen = xLen;
    this.yLen = yLen;
    this.zLen = zLen;
    this.angles = {
      theta: angles?.theta || 0, 
      phi: angles?.phi || 0
    };

    this.center = { x: xLen / 2, y: yLen / 2, z: zLen / 2 };
    this.stretchMult = Math.min(canvasWidth, canvasHeight) / Math.max(xLen, yLen, zLen);

    this.screenZ = Math.min(canvasWidth, canvasHeight);
    this.cameraZ = Math.min(canvasWidth, canvasHeight) * 2;
    this.distance = this.cameraZ - this.screenZ;

    this._pg = [];
    for (let i = 0; i < xLen; i++) {
      this._pg.push([]);
      for (let j = 0; j < yLen; j++) {
        this._pg[i].push([]);
        for (let k = 0; k < zLen; k++) {
          this._pg[i][j].push(true);
        }
      }
    }
    this._cursorAt = { x: 0, y: 0 };

    this._pg[1][2][3] = this._pg[5][3][1] = this._pg[2][4][5] = null;
  }

  _prevRefX = 0;
  _prevRefY = 0;
  adjustAngles(cursorX, cursorY, init) {
    if (!init) {
      this.angles = {
        theta: this.angles.theta + (cursorX - this._prevRefX) * 0.0087, 
        phi: Math.max(Math.min(this.angles.phi - (cursorY - this._prevRefY) * 0.0087, Math.PI / 2), -(Math.PI / 2))
      }
    }

    this._prevRefX = cursorX;
    this._prevRefY = cursorY;
  }

  place(block, canvasX, canvasY) {
    this._cursorAt = { x: canvasX, y: canvasY };

    const target = this._target;
    if (!target) return;

    const { x, y, z, a } = target;
    console.log(x, y, z, a);
    this._pg[x + a.x][y + a.y][z + a.z] = block;
  }

  destroy(canvasX, canvasY) {
    this._cursorAt = { x: canvasX, y: canvasY };

    const target = this._target;
    if (!target) return;

    const { x, y, z } = target;
    this._pg[x][y][z] = null;
  }

  renderOn(canvas) {
    const context = canvas.getContext('2d');
    context.fillStyle = 'white';
    context.fillRect(0, 0, canvas.width, canvas.height);
    
    const surfaces = this._exposedSurfaces();
    const projectedSurfaces = this._projectSurfaces(surfaces);

    projectedSurfaces.sort(({ points: p1 }, { points: p2 }) => 
      Math.min(...p1.map(p => p.z)) - 
      Math.min(...p2.map(p => p.z))
    );

    projectedSurfaces.forEach(({ points: [p1, p2, p3, p4], direction: { c } }) => {
      context.fillStyle = c;
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

    let sign, v1, v2, cross;
    projectedSurfaces.forEach(({ cords, points: [p1, p2, p3, p4], direction }) => {
      const min = Math.min(p1.z, p2.z, p3.z, p4.z);
      if (maxZ >= min) return;

      sign = 0;

      v1 = { x: p2.x - p1.x, y: p2.y - p1.y };
      v2 = { x: this._cursorAt.x - p1.x, y: this._cursorAt.y - p1.y };
      cross = v1.x * v2.y - v2.x * v1.y;
      if (cross * sign < 0) return;
      sign = cross > 0 ? 1 : -1;

      v1 = { x: p3.x - p2.x, y: p3.y - p2.y };
      v2 = { x: this._cursorAt.x - p2.x, y: this._cursorAt.y - p2.y };
      cross = v1.x * v2.y - v2.x * v1.y;
      if (cross * sign < 0) return;
      sign = cross > 0 ? 1 : -1;

      v1 = { x: p4.x - p3.x, y: p4.y - p3.y };
      v2 = { x: this._cursorAt.x - p3.x, y: this._cursorAt.y - p3.y };
      cross = v1.x * v2.y - v2.x * v1.y;
      if (cross * sign < 0) return;
      sign = cross > 0 ? 1 : -1;

      v1 = { x: p1.x - p4.x, y: p1.y - p4.y };
      v2 = { x: this._cursorAt.x - p4.x, y: this._cursorAt.y - p4.y };
      cross = v1.x * v2.y - v2.x * v1.y;
      if (cross * sign < 0) return;

      maxZ = min;
      target = {
        x: cords.x + (direction.x === 1 ? -1 : 0),
        y: cords.y + (direction.y === 1 ? -1 : 0),
        z: cords.z + (direction.z === 1 ? -1 : 0),
        a: {
          x: direction.x, 
          y: direction.y, 
          z: direction.z
        }
      };
    });

    return target;
  }

  _exposedSurfaces() {
    const surfaces = [];

    for (let i = 0; i < this.xLen; i++) {
      for (let j = 0; j < this.yLen; j++) {
        for (let k = -1; k < this.zLen; k++) {
          if ((k === -1 && this._pg[i][j][k+1]) || (k === this.zLen - 1 && this._pg[i][j][k]) ||
              (k !== -1 && k !== this.zLen - 1 && this._pg[i][j][k] !== this._pg[i][j][k+1])) {
            surfaces.push({
              cords: { x: i, y: j, z: k + 1 }, 
              points: [
                { x: i, y: j, z: k + 1 }, 
                { x: i + 1, y: j, z: k + 1 }, 
                { x: i + 1, y: j + 1, z: k + 1 }, 
                { x: i, y: j + 1, z: k + 1 }
              ], 
              direction: k !== this.zLen - 1 && (k === -1 || this._pg[i][j][k+1]) ? Directions.NZ : Directions.PZ
            });
          }
        }
      }
    }
    for (let i = 0; i < this.yLen; i++) {
      for (let j = 0; j < this.zLen; j++) {
        for (let k = -1; k < this.xLen; k++) {
          if ((k === -1 && this._pg[k+1][i][j]) || (k === this.xLen - 1 && this._pg[k][i][j]) ||
              (k !== -1 && k !== this.xLen - 1 && this._pg[k][i][j] !== this._pg[k+1][i][j])) {
            surfaces.push({
              cords: { x: k + 1, y: i, z: j }, 
              points: [
                { x: k + 1, y: i, z: j }, 
                { x: k + 1, y: i + 1, z: j }, 
                { x: k + 1, y: i + 1, z: j + 1 }, 
                { x: k + 1, y: i, z: j + 1 }
              ], 
              direction: k !== this.xLen - 1 && (k === -1 || this._pg[k+1][i][j]) ? Directions.NX : Directions.PX
            });
          }
        }
      }
    }
    for (let i = 0; i < this.zLen; i++) {
      for (let j = 0; j < this.xLen; j++) {
        for (let k = -1; k < this.yLen; k++) {
          if ((k === -1 && this._pg[j][k+1][i]) || (k === this.yLen - 1 && this._pg[j][k][i]) ||
              (k !== -1 && k !== this.yLen - 1 && this._pg[j][k][i] !== this._pg[j][k+1][i])) {
            surfaces.push({
              cords: { x: j, y: k + 1, z: i }, 
              points: [
                { x: j, y: k + 1, z: i }, 
                { x: j + 1, y: k + 1, z: i }, 
                { x: j + 1, y: k + 1, z: i + 1 }, 
                { x: j, y: k + 1, z: i + 1 }
              ],
              direction: k !== this.yLen - 1 && (k === -1 || this._pg[j][k+1][i]) ? Directions.NY : Directions.PY
            });
          }
        }
      }
    }

    return surfaces;
  }

  _projectSurfaces(surfaces) {
    surfaces.forEach(s => {
      s.points = s.points.map(({ x, y, z }) => ({
        x: (x - this.center.x) * this.stretchMult, 
        y: (y - this.center.y) * this.stretchMult, 
        z: (z - this.center.z) * this.stretchMult
      }));
      s.points = this._project2D(this._rotateX(this._rotateY(s.points, this.angles.theta), this.angles.phi));
    });
    return surfaces;
  }

  _existingBlocks() {
    const blocks = [];

    this._pg.forEach((p, x) => {
      p.forEach((r, y) => {
        r.forEach((block, z) => {
          if (block) {
            blocks.push({ x, y, z });
          }
        });
      });
    });

    return blocks;
  }

  _eliminateHidden(blocks) {
    const directions = [
      { x: 1, y: 0, z: 0 }, 
      { x: 0, y: 1, z: 0 }, 
      { x: 0, y: 0, z: 1 }, 
      { x: -1, y: 0, z: 0 }, 
      { x: 0, y: -1, z: 0 }, 
      { x: 0, y: 0, z: -1 }
    ];

    return blocks.filter(b =>
      directions.some(({ x, y, z }) => {
        const nx = b.x + x, ny = b.y + y, nz = b.z + z;
        return !(
          0 <= nx && nx < this.xLen && this._pg[nx][b.y][b.z] &&
          0 <= ny && ny < this.xLen && this._pg[b.x][ny][b.z] &&
          0 <= nz && nz < this.xLen && this._pg[b.x][b.y][nz]
        );
      })
    );
  }

  // ASSUME: every block is a full block
  _project(blocks, theta, phi) {
    return blocks.map(b => {
      const vertices = Array(0b1000).fill(null).map((_, i) => ({ 
        x: (b.x - this.center.x + !!(i & 0b001)) * this.stretchMult, 
        y: (b.y - this.center.y + !!(i & 0b010)) * this.stretchMult, 
        z: (b.z - this.center.z + !!(i & 0b100)) * this.stretchMult
      }));

      const projected = this._project2D(this._rotateX(this._rotateY(vertices, theta), phi));

      return {
        vertices: projected, 
        zIndex: projected[0].z
      };
    });
  }

  _project2D(points) {
    return points.map(v => ({
      x: v.x * this.distance / (this.cameraZ - v.z) + this.canvasWidth / 2, 
      y: -(v.y * this.distance / (this.cameraZ - v.z)) + this.canvasHeight / 2, 
      z: v.z
    }));
  }

  _rotateX(points, phi) {
    const c = Math.cos(phi);
    const s = Math.sin(phi);
  
    return points.map(v => ({
      x: v.x, 
      y: s * v.z + c * v.y, 
      z: c * v.z - s * v.y
    }));
  }

  _rotateY(points, theta) {
    const c = Math.cos(theta);
    const s = Math.sin(theta);
  
    return points.map(v => ({
      x: s * v.z + c * v.x, 
      y: v.y, 
      z: c * v.z - s * v.x
    }));
  }
}

export default Playground;