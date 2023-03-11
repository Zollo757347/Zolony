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
      result[key] = textures[faces[key].texture.substr(1)];
      if (!result[key]) {
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

    return {
      texture: {
        up: {
          source: faces.up,
          vertices: [
            f[0], t[1], f[2],   0, 0,   0.0, 1.0, 0.0,
            f[0], t[1], t[2],   0, 1,   0.0, 1.0, 0.0,
            t[0], t[1], t[2],   1, 1,   0.0, 1.0, 0.0,
            t[0], t[1], f[2],   1, 0,   0.0, 1.0, 0.0
          ]
        },
        west: {
          source: faces.west,
          vertices: [
            f[0], t[1], f[2],   0, 0,   -1.0, 0.0, 0.0,
            f[0], f[1], f[2],   0, 1,   -1.0, 0.0, 0.0,
            f[0], f[1], t[2],   1, 1,   -1.0, 0.0, 0.0,
            f[0], t[1], t[2],   1, 0,   -1.0, 0.0, 0.0
          ]
        },
        east: {
          source: faces.east,
          vertices: [
            t[0], t[1], t[2],   0, 0,   1.0, 0.0, 0.0,
            t[0], f[1], t[2],   0, 1,   1.0, 0.0, 0.0,
            t[0], f[1], f[2],   1, 1,   1.0, 0.0, 0.0,
            t[0], t[1], f[2],   1, 0,   1.0, 0.0, 0.0
          ]
        },
        south: {
          source: faces.south,
          vertices: [
            f[0], t[1], t[2],   0, 0,   0.0, 0.0, 1.0,
            f[0], f[1], t[2],   0, 1,   0.0, 0.0, 1.0,
            t[0], f[1], t[2],   1, 1,   0.0, 0.0, 1.0,
            t[0], t[1], t[2],   1, 0,   0.0, 0.0, 1.0
          ]
        },
        north: {
          source: faces.north,
          vertices: [
            t[0], t[1], f[2],   0, 0,   0.0, 0.0, -1.0,
            t[0], f[1], f[2],   0, 1,   0.0, 0.0, -1.0,
            f[0], f[1], f[2],   1, 1,   0.0, 0.0, -1.0,
            f[0], t[1], f[2],   1, 0,   0.0, 0.0, -1.0
          ]
        },
        down: {
          source: faces.down,
          vertices: [
            f[0], f[1], t[2],   0, 0,   0.0, -1.0, 0.0,
            f[0], f[1], f[2],   0, 1,   0.0, -1.0, 0.0,
            t[0], f[1], f[2],   1, 1,   0.0, -1.0, 0.0,
            t[0], f[1], t[2],   1, 0,   0.0, -1.0, 0.0
          ]
        }
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