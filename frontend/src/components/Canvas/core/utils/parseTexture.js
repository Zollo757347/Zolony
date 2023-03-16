function parseTexture(blockData, path) {
  const fullData = getFullData(blockData, path);
  const elements = getElements(fullData);
  const data = getVerticesData(elements);
  return data;
}

function getFullData(blockData, path) {
  const primaryData = blockData[parsePath(path)];
  if (!primaryData) {
    throw new Error(`Invalid Path ${path}`);
  }

  const data = flatten(blockData, primaryData);
  if (!data.textures) return null;

  for (let [key, value] of Object.entries(data.textures)) {
    const keys = [key];
    while (value.startsWith("#")) {
      value = value.match(/#(.+)/)[1];
      keys.push(value);

      key = value;
      value = data.textures[key];
    }

    value = parsePath(value);
    keys.forEach(k => {
      data.textures[k] = value;
    });
  }

  return data;
}

function getElements({ textures, elements }) {
  return elements.map(({ faces, ...props }) => {
    const result = {};

    for (const key in faces) {
      if (!faces[key].texture.startsWith('#')) {
        throw new Error('The value string does not starts with "#".');
      }

      result[key] = {
        ...faces[key], 
        texture: textures[faces[key].texture.substr(1)]
      };

      if (!result[key].texture) {
        throw new Error(`Texture ${key} does not exist.`);
      }
    }

    return { faces: result, ...props };
  })
}

function getVerticesData(elements) {
  const data = elements.map(({ from, to, faces }) => {
    const f = [from[0] / 16, from[1] / 16, from[2] / 16];
    const t = [to[0] / 16, to[1] / 16, to[2] / 16];
    const uv = {}, a = { e: 0, s: 1, w: 2, n: 3 };

    const n = [[1.0, 0.0, 0.0], [0.0, 0.0, 1.0], [-1.0, 0.0, 0.0], [0.0, 0.0, -1.0]];

    for (const dir in faces) {
      let r = faces[dir].uv?.map(v => v / 16) ?? [0, 0, 1, 1];
      r = [r[0], r[1], r[0], r[3], r[2], r[3], r[2], r[1]];

      if (faces[dir].rotation) {
        if (faces[dir].rotation % 90 !== 0) {
          throw new Error('Cannot rotate an image with an angle that is not the multiple of 90.');
        }

        let count = (faces[dir].rotation / 90) & 3;
        while (count--) {
          r = [r[2], r[3], r[4], r[5], r[6], r[7], r[0], r[1]];
        }
      }
      uv[dir[0]] = r;
    }

    return {
      texture: {
        up: faces.up ? {
          source: faces.up.texture,
          vertices: [
            f[0], t[1], f[2],   uv.u[0], uv.u[1],   0.0, 1.0, 0.0,
            f[0], t[1], t[2],   uv.u[2], uv.u[3],   0.0, 1.0, 0.0,
            t[0], t[1], t[2],   uv.u[4], uv.u[5],   0.0, 1.0, 0.0,
            t[0], t[1], f[2],   uv.u[6], uv.u[7],   0.0, 1.0, 0.0
          ]
        } : undefined,
        west: faces.west ? {
          source: faces.west.texture,
          vertices: [
            f[0], t[1], f[2],   uv.w[0], uv.w[1],   n[a.w][0], n[a.w][1], n[a.w][2],
            f[0], f[1], f[2],   uv.w[2], uv.w[3],   n[a.w][0], n[a.w][1], n[a.w][2],
            f[0], f[1], t[2],   uv.w[4], uv.w[5],   n[a.w][0], n[a.w][1], n[a.w][2],
            f[0], t[1], t[2],   uv.w[6], uv.w[7],   n[a.w][0], n[a.w][1], n[a.w][2]
          ]
        } : undefined,
        east: faces.east ? {
          source: faces.east.texture,
          vertices: [
            t[0], t[1], t[2],   uv.e[0], uv.e[1],   n[a.e][0], n[a.e][1], n[a.e][2],
            t[0], f[1], t[2],   uv.e[0], uv.e[3],   n[a.e][0], n[a.e][1], n[a.e][2],
            t[0], f[1], f[2],   uv.e[4], uv.e[5],   n[a.e][0], n[a.e][1], n[a.e][2],
            t[0], t[1], f[2],   uv.e[6], uv.e[7],   n[a.e][0], n[a.e][1], n[a.e][2]
          ]
        } : undefined,
        south: faces.south ? {
          source: faces.south.texture,
          vertices: [
            f[0], t[1], t[2],   uv.s[0], uv.s[1],   n[a.s][0], n[a.s][1], n[a.s][2],
            f[0], f[1], t[2],   uv.s[0], uv.s[3],   n[a.s][0], n[a.s][1], n[a.s][2],
            t[0], f[1], t[2],   uv.s[4], uv.s[5],   n[a.s][0], n[a.s][1], n[a.s][2],
            t[0], t[1], t[2],   uv.s[6], uv.s[7],   n[a.s][0], n[a.s][1], n[a.s][2]
          ]
        } : undefined,
        north: faces.north ? {
          source: faces.north.texture,
          vertices: [
            t[0], t[1], f[2],   uv.n[0], uv.n[1],   n[a.n][0], n[a.n][1], n[a.n][2],
            t[0], f[1], f[2],   uv.n[0], uv.n[3],   n[a.n][0], n[a.n][1], n[a.n][2],
            f[0], f[1], f[2],   uv.n[4], uv.n[5],   n[a.n][0], n[a.n][1], n[a.n][2],
            f[0], t[1], f[2],   uv.n[6], uv.n[7],   n[a.n][0], n[a.n][1], n[a.n][2]
          ]
        } : undefined,
        down: faces.down ? {
          source: faces.down.texture,
          vertices: [
            f[0], f[1], t[2],   uv.d[0], uv.d[1],   0.0, -1.0, 0.0,
            f[0], f[1], f[2],   uv.d[2], uv.d[3],   0.0, -1.0, 0.0,
            t[0], f[1], f[2],   uv.d[4], uv.d[5],   0.0, -1.0, 0.0,
            t[0], f[1], t[2],   uv.d[6], uv.d[7],   0.0, -1.0, 0.0
          ]
        } : undefined
      }, 
      outline: [
        f[0], t[1], f[2],   0.0, 1.0, 0.0,
        f[0], t[1], t[2],   0.0, 1.0, 0.0,
        t[0], t[1], t[2],   0.0, 1.0, 0.0,
        t[0], t[1], f[2],   0.0, 1.0, 0.0,

        f[0], t[1], f[2],   -1.0, 0.0, 0.0,
        f[0], f[1], f[2],   -1.0, 0.0, 0.0,
        f[0], f[1], t[2],   -1.0, 0.0, 0.0,
        f[0], t[1], t[2],   -1.0, 0.0, 0.0,

        t[0], t[1], t[2],   1.0, 0.0, 0.0,
        t[0], f[1], t[2],   1.0, 0.0, 0.0,
        t[0], f[1], f[2],   1.0, 0.0, 0.0,
        t[0], t[1], f[2],   1.0, 0.0, 0.0,

        f[0], t[1], t[2],   0.0, 0.0, 1.0,
        f[0], f[1], t[2],   0.0, 0.0, 1.0,
        t[0], f[1], t[2],   0.0, 0.0, 1.0,
        t[0], t[1], t[2],   0.0, 0.0, 1.0,

        t[0], t[1], f[2],   0.0, 0.0, -1.0,
        t[0], f[1], f[2],   0.0, 0.0, -1.0,
        f[0], f[1], f[2],   0.0, 0.0, -1.0,
        f[0], t[1], f[2],   0.0, 0.0, -1.0,

        f[0], f[1], t[2],   0.0, -1.0, 0.0,
        f[0], f[1], f[2],   0.0, -1.0, 0.0,
        t[0], f[1], f[2],   0.0, -1.0, 0.0,
        t[0], f[1], t[2],   0.0, -1.0, 0.0
      ]
    }
  });

  return {
    textures: data.map(({ texture }) => texture), 
    outlines: data.map(({ outline }) => outline), 
  };
}

function flatten(blockData, data) {
  while (data.parent) {
    const parentPath = parsePath(data.parent);
    const parentData = blockData[parentPath];
    if (!parentData) {
      throw new Error(`Invalid Parent Path ${parentPath}`);
    }
    
    if (parentData.textures) {
      data.textures = { ...parentData.textures, ...data.textures };
    }
    if (parentData.elements) {
      data.elements = parentData.elements;
    }

    data.parent = parentData.parent;
  }
  delete data.parent;
  return data;
}

function parsePath(path) {
  if (path.startsWith("minecraft:")) {
    path = path.substr(10);
  }
  if (path.startsWith("block/")) {
    path = path.substr(6);
  }
  return path;
}

export default parseTexture;