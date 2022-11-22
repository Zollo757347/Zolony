import Axis from "../../../utils/Axis";
import Vector3 from "../../../utils/Vector3";

class SolidBlock {
  surface(x, y, z, a) {
    const baseX = a === Axis.PX ? x + 1 : x;
    const baseY = a === Axis.PY ? y + 1 : y;
    const baseZ = a === Axis.PZ ? z + 1 : z;

    const relativePoints = 
      a === Axis.PX || a === Axis.NX ? 
        [[0, 0, 0], [0, 0, 1], [0, 1, 1], [0, 1, 0]] :
        a === Axis.PY || a === Axis.NY ? 
          [[0, 0, 0], [0, 0, 1], [1, 0, 1], [1, 0, 0]] :
          [[0, 0, 0], [0, 1, 0], [1, 1, 0], [1, 0, 0]];

    return {
      points: relativePoints.map(([dx, dy, dz]) => new Vector3(baseX + dx, baseY + dy, baseZ + dz)), 
      color: this.surfaceColor(a)
    };
  }

  surfaceColor(a) {
    switch (a) {
      case Axis.PX:
        return 'rgba(240, 120, 120, 0.3)';

      case Axis.PY:
        return 'rgba(120, 240, 120, 0.3)';

      case Axis.PZ:
        return 'rgba(120, 120, 240, 0.3)';

      case Axis.NX:
        return 'rgba(120, 240, 240, 0.3)';

      case Axis.NY:
        return 'rgba(240, 120, 240, 0.3)';

      case Axis.NZ:
        return 'rgba(240, 240, 120, 0.3)';

      default:
        throw new Error();
    }
  }
}

export default SolidBlock;