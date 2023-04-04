/**
 * 將指定方塊的模型資料解析成方便使用的形式
 * @param {object} blockData 所有方塊的資料
 * @param {string} blockName 指定方塊的名稱
 * @returns 
 */
function parseTexture(blockData, blockName) {
  const fullRawData = getFullData(blockData, blockName);
  const modelComponents = getComponents(fullRawData);
  const data = parseComponents(modelComponents);
  console.log(data);
  return data;
}

/**
 * 從所有方塊的資料中抓取指定方塊的模型資料
 * @param {object} blockData 所有方塊的資料
 * @param {string} blockName 指定方塊的名稱
 * @returns 
 */
function getFullData(blockData, blockName) {
  const _data = blockData[parsePath(blockName)];
  if (!_data) {
    throw new Error(`Invalid block ${blockName}.`);
  }
  const data = flatten(blockData, _data);

  for (let [key, value] of Object.entries(data.textures)) {
    const keys = [key];
    while (value.startsWith("#")) {
      value = value.substr(1);
      keys.push(value);

      key = value;
      value = data.textures[key];
    }

    value = parsePath(value);
    keys.forEach(k => {
      data.textures[k] = value;
    });
  }

  for (const { faces } of data.elements) {
    for (const key in faces) {
      const face = faces[key];
      if (!face.texture.startsWith('#')) {
        throw new Error(`The texture string ${face.texture} does not starts with "#".`);
      }
      face.texture = data.textures[face.texture.substr(1)];
    }
  }

  return data;
}

function getComponents(data) {
  const elements = data.elements.map(({ from, to, faces, rotation }) => {
    const rotate = getRotationMatrix(rotation);
    const vertices = getVertices(from, to, rotate);
    const normals = getNormals(rotate);

    for (const key in faces) {
      const face = faces[key];
      const uv = face.uv?.map(v => v / 16) ?? [0, 0, 1, 1];
      const texCoord = [[uv[0], uv[1]], [uv[0], uv[3]], [uv[2], uv[3]], [uv[2], uv[1]]];
      if (face.rotation) {
        if (face.rotation % 90 !== 0) {
          throw new Error('Cannot rotate an image with an angle that is not the multiple of 90.');
        }

        let count = (face.rotation / 90) & 3;
        while (count--) {
          texCoord.push(texCoord.shift());
        }
      }

      delete face.uv;
      delete face.rotation;

      face.texCoord = texCoord;
    }

    return { vertices, normals, faces };
  });

  return {
    elements, 
    outlines: data.outlines?.map(({ from, to }) => getVertices(from, to, (x, y, z) => [x, y, z]).original) ?? undefined, 
    face: data.face ?? false, 
    facing: data.facing ?? false
  };
}

function parseComponents({ elements, outlines, face, facing }) {
  if (!facing) {
    return getVerticesData(elements, outlines);
  }

  const faces = face ? [
    ['floor', []], 
    ['wall', [getRotationMatrix({ origin: [8, 8, 8], axis: "x", angle: -90 }), getRotationMatrix({ origin: [8, 8, 8], axis: "z", angle: 180 })]], 
    ['ceiling', [getRotationMatrix({ origin: [8, 8, 8], axis: "x", angle: -90 })]]
  ] : [[undefined, []]];
  let data = {};

  faces.forEach(([f, rotates]) => {
    rotates.forEach(r => {
      rotateElements(elements, r);
      rotateOutlines(outlines, r);
    });

    const rotate = getRotationMatrix({ origin: [8, 8, 8], axis: "y", angle: 90 });
    const result = {};

    ['north', 'west', 'south', 'east'].forEach(dir => {
      result[dir] = getVerticesData(elements, outlines);
      rotateElements(elements, rotate);
      rotateOutlines(outlines, rotate);
    });

    if (f) data[f] = result;
    else data = result;
  });

  return data;
}

function rotateElements(elements, rotate) {
  for (const { vertices: { rotated }, normals } of elements) {
    for (let i = 0; i < rotated.length; i++) {
      rotated[i] = rotate(...rotated[i], 1);
    }
    for (const key in normals) {
      normals[key] = rotate(...normals[key], 0);
    }
  }
}

function rotateOutlines(outlines, rotate) {
  if (!outlines) return;

  outlines.forEach(outline => {
    for (let i = 0; i < outline.length; i++) {
      outline[i] = rotate(...outline[i], 1);
    }
  });
}

function getVerticesData(elements, outlinesParam) {
  const textures = [];
  const outlines = [];
  elements.forEach(({ vertices: { original, rotated }, normals, faces }) => {
    const texture = {};
    
    sixSides.forEach(([dir, v, n]) => {
      texture[dir] = faces[dir] ? {
        source: faces[dir].texture, 
        vertices: [
          ...rotated[v[0]], ...faces[dir].texCoord[0], ...normals[dir], 
          ...rotated[v[1]], ...faces[dir].texCoord[1], ...normals[dir], 
          ...rotated[v[2]], ...faces[dir].texCoord[2], ...normals[dir], 
          ...rotated[v[3]], ...faces[dir].texCoord[3], ...normals[dir]
        ]
      } : undefined;

      if (!outlinesParam) {
        outlines.push(
          ...original[v[0]], ...n, 
          ...original[v[1]], ...n, 
          ...original[v[2]], ...n, 
          ...original[v[3]], ...n
        );
      }
    });

    outlinesParam?.forEach(vertices => {
      sixSides.forEach(([_, v, n]) => {
        outlines.push(
          ...vertices[v[0]], ...n, 
          ...vertices[v[1]], ...n, 
          ...vertices[v[2]], ...n, 
          ...vertices[v[3]], ...n
        );
      });
    });

    textures.push(texture);
  });

  return { textures, outlines };
}

/**
 * 把 data 根據 #parent 展開
 * @param {object} blockData 所有方塊的資料
 * @param {string} data 待處理的資料
 * @returns 
 */
function flatten(blockData, data) {
  let parent = data.parent;
  while (parent) {
    const parentPath = parsePath(parent);
    const parentData = blockData[parentPath];
    if (!parentData) {
      throw new Error(`Invalid parent path ${parentPath}`);
    }
    
    if (parentData.textures) {
      data.textures = { ...parentData.textures, ...data.textures };
    }
    if (parentData.elements) {
      data.elements = parentData.elements;
    }

    parent = parentData.parent;
  }
  delete data.parent;
  return JSON.parse(JSON.stringify(data));
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

function getRotationMatrix(rotation) {
  if (!rotation) {
    return function (x, y, z) {
      return [x, y, z];
    }
  }

  let { origin: [p = 0, q = 0, r = 0] = [0, 0, 0], axis = "x", angle = 0 } = rotation;

  const c = Math.cos(angle / 180 * Math.PI);
  const s = Math.sin(angle / 180 * Math.PI);
  const m = axis === "x" ? [
    1, 0, 0, 
    0, c,-s, 
    0, s, c
  ] : axis === "y" ? [
     c, 0, s, 
     0, 1, 0, 
    -s, 0, c
  ] : axis === "z" ? [
    c,-s, 0, 
    s, c, 0, 
    0, 0, 1
  ] : null;

  if (!m) {
    throw new Error(`Unable to parse axis "${axis}".`);
  }

  p /= 16;
  q /= 16;
  r /= 16;

  return function (x, y, z, w) {
    x -= (w ? p : 0);
    y -= (w ? q : 0);
    z -= (w ? r : 0);

    return [
      m[0]*x + m[1]*y + m[2]*z + (w ? p : 0), 
      m[3]*x + m[4]*y + m[5]*z + (w ? q : 0), 
      m[6]*x + m[7]*y + m[8]*z + (w ? r : 0)
    ];
  }
}

function getVertices(from, to, rotate) {
  const f = [from[0] / 16, from[1] / 16, from[2] / 16];
  const t = [to[0] / 16, to[1] / 16, to[2] / 16];

  const original = [
    [f[0], f[1], f[2]], 
    [f[0], f[1], t[2]], 
    [f[0], t[1], f[2]], 
    [f[0], t[1], t[2]], 
    [t[0], f[1], f[2]], 
    [t[0], f[1], t[2]], 
    [t[0], t[1], f[2]], 
    [t[0], t[1], t[2]]
  ];

  return {
    original, 
    rotated: original.map(v => rotate(...v, 1))
  };
}

function getNormals(rotate) {
  return {
    east: rotate(1, 0, 0, 0), 
    west: rotate(-1, 0, 0, 0), 
    up: rotate(0, 1, 0, 0), 
    down: rotate(0, -1, 0, 0), 
    south: rotate(0, 0, 1, 0), 
    north: rotate(0, 0, -1, 0)
  };
}

const sixSides = [
  ['up', [2, 3, 7, 6], [0, 1, 0]], 
  ['west', [2, 0, 1, 3], [-1, 0, 0]], 
  ['east', [7, 5, 4, 6], [1, 0, 0]], 
  ['south', [3, 1, 5, 7], [0, 0, 1]], 
  ['north', [6, 4, 0, 2], [0, 0, -1]], 
  ['down', [1, 0, 4, 5], [0, -1, 0]]
];

export default parseTexture;