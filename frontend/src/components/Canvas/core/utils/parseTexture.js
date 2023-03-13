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
  return elements.map(({ from, to, faces }) => {
    const result = {};

    for (const key in faces) {
      if (!faces[key].texture.startsWith('#')) {
        throw new Error('The value string does not starts with "#".');
      }

      result[key] = {
        texture: textures[faces[key].texture.substr(1)], 
        uv: faces[key].uv
      };

      if (!result[key].texture) {
        throw new Error(`Texture ${key} does not exist.`);
      }
    }

    return { from, to, faces: result };
  })
}

function getVerticesData(elements) {
  const data = elements.map(({ from, to, faces }) => {
    const f = [from[0] / 16, from[1] / 16, from[2] / 16];
    const t = [to[0] / 16, to[1] / 16, to[2] / 16];
    const uv = {};
    for (const dir in faces) {
      uv[dir[0]] = faces[dir].uv?.map(v => v / 16) ?? [0, 0, 1, 1];
    }

    return {
      texture: {
        up: faces.up ? {
          source: faces.up.texture,
          vertices: [
            f[0], t[1], f[2],   uv.u[0], uv.u[1],   0.0, 1.0, 0.0,
            f[0], t[1], t[2],   uv.u[0], uv.u[3],   0.0, 1.0, 0.0,
            t[0], t[1], t[2],   uv.u[2], uv.u[3],   0.0, 1.0, 0.0,
            t[0], t[1], f[2],   uv.u[2], uv.u[1],   0.0, 1.0, 0.0
          ]
        } : undefined,
        west: faces.west ? {
          source: faces.west.texture,
          vertices: [
            f[0], t[1], f[2],   uv.w[0], uv.w[1],   -1.0, 0.0, 0.0,
            f[0], f[1], f[2],   uv.w[0], uv.w[3],   -1.0, 0.0, 0.0,
            f[0], f[1], t[2],   uv.w[2], uv.w[3],   -1.0, 0.0, 0.0,
            f[0], t[1], t[2],   uv.w[2], uv.w[1],   -1.0, 0.0, 0.0
          ]
        } : undefined,
        east: faces.east ? {
          source: faces.east.texture,
          vertices: [
            t[0], t[1], t[2],   uv.e[0], uv.e[1],   1.0, 0.0, 0.0,
            t[0], f[1], t[2],   uv.e[0], uv.e[3],   1.0, 0.0, 0.0,
            t[0], f[1], f[2],   uv.e[2], uv.e[3],   1.0, 0.0, 0.0,
            t[0], t[1], f[2],   uv.e[2], uv.e[1],   1.0, 0.0, 0.0
          ]
        } : undefined,
        south: faces.south ? {
          source: faces.south.texture,
          vertices: [
            f[0], t[1], t[2],   uv.s[0], uv.s[1],   0.0, 0.0, 1.0,
            f[0], f[1], t[2],   uv.s[0], uv.s[3],   0.0, 0.0, 1.0,
            t[0], f[1], t[2],   uv.s[2], uv.s[3],   0.0, 0.0, 1.0,
            t[0], t[1], t[2],   uv.s[2], uv.s[1],   0.0, 0.0, 1.0
          ]
        } : undefined,
        north: faces.north ? {
          source: faces.north.texture,
          vertices: [
            t[0], t[1], f[2],   uv.n[0], uv.n[1],   0.0, 0.0, -1.0,
            t[0], f[1], f[2],   uv.n[0], uv.n[3],   0.0, 0.0, -1.0,
            f[0], f[1], f[2],   uv.n[2], uv.n[3],   0.0, 0.0, -1.0,
            f[0], t[1], f[2],   uv.n[2], uv.n[1],   0.0, 0.0, -1.0
          ]
        } : undefined,
        down: faces.down ? {
          source: faces.down.texture,
          vertices: [
            f[0], f[1], t[2],   uv.d[0], uv.d[1],   0.0, -1.0, 0.0,
            f[0], f[1], f[2],   uv.d[0], uv.d[3],   0.0, -1.0, 0.0,
            t[0], f[1], f[2],   uv.d[2], uv.d[3],   0.0, -1.0, 0.0,
            t[0], f[1], t[2],   uv.d[2], uv.d[1],   0.0, -1.0, 0.0
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