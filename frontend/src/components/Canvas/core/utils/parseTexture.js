/**
 * 將指定方塊的模型資料解析成方便使用的形式
 * @param {{ [name: string]: RawBlockData }} blockData 所有方塊的資料
 * @param {string} blockName 指定方塊的名稱
 * @returns {WebGLData | Record<FourFacings, WebGLData> | Record<ThreeFaces, Record<FourFacings, WebGLData>>}
 */
function parseTexture(blockData, blockName) {
  const fullRawData = getFullData(blockData, blockName);
  const modelComponents = getComponents(fullRawData);
  const data = parseComponents(modelComponents);
  return data;
}

/**
 * 從所有方塊的資料中抓取指定方塊的模型資料
 * @param {{ [name: string]: RawBlockData }} blockData 所有方塊的資料
 * @param {string} blockName 指定方塊的名稱
 * @returns {FullBlockData}
 */
function getFullData(blockData, blockName) {
  const _data = blockData[parsePath(blockName)];
  if (!_data) {
    throw new Error(`Invalid block ${blockName}.`);
  }
  const data = flatten(blockData, _data);

  // 把 `#textures` 的值都改成檔名
  for (let [key, value] of Object.entries(data.textures)) {
    const keys = [key];
    while (value.startsWith("#")) {
      value = value.substring(1);
      keys.push(value);

      key = value;
      value = data.textures[key];
    }

    value = parsePath(value);
    keys.forEach(k => {
      data.textures[k] = value;
    });
  }

  // 把 `#elements#faces#*#texture` 的值都根據 `#textures` 改成檔名
  for (const { faces } of data.elements) {
    for (const key in faces) {
      const face = faces[key];
      if (!face.texture.startsWith('#')) {
        throw new Error(`The texture string ${face.texture} does not starts with "#".`);
      }
      face.texture = data.textures[face.texture.substring(1)];
    }
  }

  return data;
}

/**
 * 把資料轉換為繪圖所需的各種元件
 * @param {FullBlockData} data 
 * @returns {Components}
 */
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
    outlines: data.outlines?.map(({ from, to }) => getVertices(from, to, getRotationMatrix()).original) ?? [], 
    face: data.face ?? false, 
    facing: data.facing ?? false,
    prerotation: data.prerotation ?? 0
  };
}

/**
 * 將所有元件轉換為 WebGL 所需的資料
 * @param {Components} components
 * @returns {WebGLData | Record<FourFacings, WebGLData> | Record<ThreeFaces, Record<FourFacings, WebGLData>>}
 */
function parseComponents({ elements, outlines, face, facing, prerotation }) {
  const yRotate = getRotationMatrix({ origin: [8, 8, 8], axis: "y", angle: 90 });
  if (prerotation) {
    for (let i = 0; i < prerotation; i++) {
      rotateElements(elements, yRotate);
      rotateOutlines(outlines, yRotate);
    }
  }

  if (!facing) {
    return getVerticesData(elements, outlines);
  }

  /**
   * @type {[string, Rotation[]][]}
   */
  const faces = face ? [
    ['floor', []], 
    ['wall', [getRotationMatrix({ origin: [8, 8, 8], axis: "x", angle: -90 }), getRotationMatrix({ origin: [8, 8, 8], axis: "z", angle: 180 })]], 
    ['ceiling', [getRotationMatrix({ origin: [8, 8, 8], axis: "x", angle: -90 })]]
  ] : [['', []]];
  let data = {};

  faces.forEach(([f, rotates]) => {
    rotates.forEach(r => {
      rotateElements(elements, r);
      rotateOutlines(outlines, r);
    });

    const result = {};

    ['north', 'west', 'south', 'east'].forEach(dir => {
      result[dir] = getVerticesData(elements, outlines);
      rotateElements(elements, yRotate);
      rotateOutlines(outlines, yRotate);
    });

    if (f) data[f] = result;
    else data = result;
  });

  return data;
}

/**
 * 把模型箱的所有座標都旋轉一次
 * @param {ComponentsElement[]} elements 
 * @param {Rotation} rotate 
 */
function rotateElements(elements, rotate) {
  for (const { vertices: { rotated }, normals } of elements) {
    for (let i = 0; i < rotated.length; i++) {
      rotated[i] = rotate([...rotated[i], 1]);
    }
    for (const key in normals) {
      normals[key] = rotate([...normals[key], 0]);
    }
  }
}

/**
 * 把互動箱的所有座標都旋轉一次
 * @param {Vector3[][]} outlines 
 * @param {Rotation} rotate 
 */
function rotateOutlines(outlines, rotate) {
  outlines?.forEach(outline => {
    for (let i = 0; i < outline.length; i++) {
      outline[i] = rotate([...outline[i], 1]);
    }
  });
}

/**
 * 把模型箱與互動箱資料轉成可以直接餵給 WebGL 的資料
 * @param {ComponentsElement[]} elements 
 * @param {Vector3[][]} outlinesParam 
 * @returns {WebGLData}
 */
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

      if (!outlinesParam.length) {
        outlines.push(
          ...original[v[0]], ...n, 
          ...original[v[1]], ...n, 
          ...original[v[2]], ...n, 
          ...original[v[3]], ...n
        );
      }
    });

    outlinesParam.forEach(vertices => {
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
 * @param {{ [name: string]: RawBlockData }} blockData 所有方塊的資料
 * @param {RawBlockData} data 待處理的資料
 * @returns {Omit<RawBlockData, "parent">}
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
    if (parentData.outlines) {
      data.outlines = parentData.outlines;
    }
    if (parentData.face) {
      data.face = parentData.face;
    }
    if (parentData.facing) {
      data.facing = parentData.facing;
    }
    if (parentData.prerotation) {
      data.prerotation = parentData.prerotation;
    }

    parent = parentData.parent;
  }
  delete data.parent;
  return JSON.parse(JSON.stringify(data));
}

/**
 * 將原始資料中的方塊路徑轉換為名稱
 * @param {string} path 
 * @returns {string}
 */
function parsePath(path) {
  if (path.startsWith("minecraft:")) {
    path = path.substring(10);
  }
  if (path.startsWith("block/")) {
    path = path.substring(6);
  }
  return path;
}

/**
 * 產生一個旋轉矩陣的函數
 * @param {RawRotationData?} rotation 
 * @returns {Rotation}
 */
function getRotationMatrix(rotation) {
  if (!rotation) {
    return function ([x, y, z]) {
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

  return function ([x, y, z, w]) {
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

/**
 * 回傳 from 到 to 展開的長方體的原座標與旋轉後的座標
 * @param {Vector3} from 
 * @param {Vector3} to 
 * @param {Rotation} rotate 
 * @returns {{ original: Vector3[], rotated: Vector3[] }}
 */
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
    rotated: original.map(v => rotate([...v, 1]))
  };
}

/**
 * 回傳旋轉後的三軸單位向量
 * @param {Rotation} rotate 
 * @returns {Record<SixSides, Vector3>}
 */
function getNormals(rotate) {
  return {
    east: rotate([1, 0, 0, 0]), 
    west: rotate([-1, 0, 0, 0]), 
    up: rotate([0, 1, 0, 0]), 
    down: rotate([0, -1, 0, 0]), 
    south: rotate([0, 0, 1, 0]), 
    north: rotate([0, 0, -1, 0])
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

/**
 * @typedef RawBlockData 方塊的原始資料
 * @type {object}
 * @property {string?} parent 此方塊需參考的母模型的名稱
 * @property {{ [name: string]: string }} textures 此方塊的材質列表
 * @property {RawBlockElementData[]} elements 所有模型箱的資訊
 * @property {RawBlockOutlineData[]?} outlines 所有特殊互動箱的資訊
 * @property {boolean?} face 此方塊是否能夠三面附著
 * @property {boolean?} facing 此方塊是否為四向方塊
 * @property {number?} prerotation 預設要先沿 y 軸旋轉 90 度的次數
 */

/**
 * @typedef FullBlockData 被展開後的方塊資料
 * @type {Omit<RawBlockData, "parent"|"textures">}
 */

/**
 * @typedef RawBlockElementData 方塊的模型箱資料
 * @type {object}
 * @property {Vector3} from 互動箱的西/下/北側座標
 * @property {Vector3} to 互動箱的東/上/南側座標
 * @property {RawRotationData} rotation 實際繪出前需要的旋轉
 * @property {Partial<Record<SixSides, RawFaceData>>} faces 每個面的材質
 */

/**
 * @typedef RawBlockOutlineData 方塊的互動箱資料
 * @type {object}
 * @property {Vector3} from 互動箱的西/下/北側座標
 * @property {Vector3} to 互動箱的東/上/南側座標
 */

/**
 * @typedef RawRotationData 用來描述沿著座標軸方向的旋轉
 * @type {object}
 * @property {Vector3} origin 旋轉的中心點
 * @property {ThreeAxes} axis 旋轉座標軸
 * @property {number} angle 逆時針旋轉角度
 */

/**
 * @typedef RawFaceData 用來描述一個長方形面的材質
 * @type {object}
 * @property {Vector4} uv 指定材質上的左/上/右/下側座標
 * @property {string} texture 要套用的材質
 * @property {number?} rotation 在套用材質前要先將其順時針旋轉的角度
 */

/**
 * @typedef Components 方塊中所有的繪圖必要元件
 * @type {object}
 * @property {ComponentsElement[]} elements 處理後的所有模型箱的資訊
 * @property {Vector3[][]} outlines 處理後的所有特殊互動箱的資訊
 * @property {boolean} face 此方塊是否能夠三面附著
 * @property {boolean} facing 此方塊是否為四向方塊
 * @property {number} prerotation 預設要先沿 y 軸旋轉 90 度的次數
 */

/**
 * @typedef ComponentsElement 模型箱的資訊
 * @type {object}
 * @property {{ original: Vector3[], rotated: Vector3[] }} vertices 此模型箱八個頂點的資訊
 * @property {Record<SixSides, Vector3>} normals 旋轉後的三軸單位向量
 * @property {Partial<Record<SixSides, FaceData>>} faces 每個面的材質
 */

/**
 * @typedef FaceData 用來描述一個長方形面的材質
 * @type {object}
 * @property {Vector2[]} texCoord 四個頂點對應在圖片上的像素座標
 * @property {string} texture 要套用的材質
 */

/**
 * @typedef WebGLData
 * @type {object}
 * @property {WebGLTextureData[]} textures 
 * @property {number[]} outlines 
 */

/**
 * @typedef WebGLTextureData
 * @type {Record<SixSides, { source: string, vertices: number[] }>}
 */

/**
 * @typedef Rotation 一個旋轉矩陣
 * @type {(vec: Vector4) => Vector3}
 */

/**
 * @typedef Vector2
 * @type {[number, number]}
 */

/**
 * @typedef Vector3
 * @type {[number, number, number]}
 */

/**
 * @typedef Vector4
 * @type {[number, number, number, number]}
 */

/**
 * @typedef SixSides
 * @type {"east"|"west"|"up"|"down"|"south"|"north"}
 */

/**
 * @typedef FourFacings
 * @type {"east"|"west"|"south"|"north"}
 */

/**
 * @typedef ThreeFaces
 * @type {"ceiling"|"wall"|"floor"}
 */

/**
 * @typedef ThreeAxes
 * @type {"x"|"y"|"z"}
 */

export default parseTexture;