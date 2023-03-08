/**
 * @abstract
 */
class Renderer {
  constructor(playground, dimensions) {
    /**
     * @type {import("../Playground").default}
     */
    this.playground = playground;

    /**
     * @type {import("../Engine").default}
     */
    this.engine = playground.engine;

    /**
     * @type {HTMLCanvasElement?}
     */
    this.canvas = null;

    /**
     * @type {[number, number, number]}
     */
    this.dimensions = dimensions;
  }

  initialize(canvas) {
    this.canvas = canvas;
    this.startRendering();
  }

  startRendering() {
    throw new Error("Not implemented yet.");
  }

  async getTarget(canvasX, canvasY) {
    throw new Error("Not implemented yet.");
  }


  /**
   * 生成一個 OpenGL 環境
   * @private
   */
  _generateGl() {
    if (!this.canvas) {
      throw new Error('The canvas has not been initialized.');
    }

    const gl = this.canvas.getContext('webgl', { alpha: false });
    if (!gl) {
      throw new Error('Your browser does not support webgl canvas.');
    }

    gl.enable(gl.DEPTH_TEST);
    gl.enable(gl.CULL_FACE);

    return gl;
  }

  /**
   * 生成一個著色程式
   * @param {WebGLRenderingContext} gl 
   * @private
   * @returns {WebGLProgram}
   */
  _generateProgram(gl) {
    const vertexShader = this._loadShader(gl, gl.VERTEX_SHADER, this._vertexShaderSource);
    const fragmentShader = this._loadShader(gl, gl.FRAGMENT_SHADER, this._fragmentShaderSource);
    return this._loadProgram(gl, vertexShader, fragmentShader);
  }


  /**
   * 根據引擎的資料生成指定方塊的頂點
   * @param {import("../core").BlockType} type
   * @private
   * @returns {number[]}
   */
  _getVertices(type) {
    const result = [];

    for (let i = 0; i < this.dimensions[0]; i++) {
      for (let j = 0; j < this.dimensions[1]; j++) {
        for (let k = 0; k < this.dimensions[2]; k++) {
          if (this.engine.block(i, j, k).type !== type) continue;
          result.push(...this._genVertices(i, j, k));

          // const blockSurfaces = interactionBox ? this.engine.block(i, j, k).interactionSurfaces() : this.engine.block(i, j, k).surfaces();
          // surfaces.push(...blockSurfaces);
        }
      }
    }

    return result;
  }

  /**
   * 根據引擎的資料生成指定方塊的面的組成順序
   * @param {import("../core").BlockType} type
   * @private
   * @returns {number[]}
   */
  _getIndices(type) {
    const result = [];

    let length = 0;
    for (let i = 0; i < this.dimensions[0]; i++) {
      for (let j = 0; j < this.dimensions[1]; j++) {
        for (let k = 0; k < this.dimensions[2]; k++) {
          if (this.engine.block(i, j, k).type === type) {
            length++;
          }
        }
      }
    }
    
    for (let i = 0; i < length; i++) {
      result.push(...genIndices(i));
    }

    return result;
  }

  /**
   * 設置緩衝區的內容
   * @param {WebGLRenderingContext} gl 
   * @param {number[]} vertices 
   * @param {number[]} indices 
   * @private
   */
  _setupBuffer(gl, vertices, indices) {
    gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer());
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);

    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, gl.createBuffer());
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indices), gl.STATIC_DRAW);
  }

  /**
   * 載入指定類型的著色器
   * @param {WebGLRenderingContext} gl 
   * @param {number} type 
   * @param {string} source 
   * @private
   * @return {WebGLShader}
   */
  _loadShader(gl, type, source) {
    const shader = gl.createShader(type);
    gl.shaderSource(shader, source);

    gl.compileShader(shader);
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
      console.error('Shader Compilation Error\n', gl.getShaderInfoLog(shader));
      return;
    }
  
    return shader;
  }

  /**
   * 載入著色程式
   * @param {WebGLRenderingContext} gl 
   * @param {WebGLShader} vShader 
   * @param {WebGLShader} fShader 
   * @private
   * @return {WebGLProgram} 
   */
  _loadProgram(gl, vShader, fShader) {
    const program = gl.createProgram();
    gl.attachShader(program, vShader);
    gl.attachShader(program, fShader);

    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      console.error('Program Link Error\n', gl.getProgramInfoLog(program));
      return;
    }

    gl.validateProgram(program);
    if (!gl.getProgramParameter(program, gl.VALIDATE_STATUS)) {
      console.error('Program Validate Error\n', gl.getProgramInfoLog(program));
      return;
    }

    gl.useProgram(program);
    return program;
  }

  _genVertices(x, y, z) {
    const xs = x - this.dimensions[0] / 2;
    const ys = y - this.dimensions[1] / 2;
    const zs = z - this.dimensions[2] / 2;
    const xl = xs + 1;
    const yl = ys + 1;
    const zl = zs + 1;

    return [
      // Top
      xs, yl, zs,   0, 0,   0.0, 1.0, 0.0,
      xs, yl, zl,   0, 1,   0.0, 1.0, 0.0,
      xl, yl, zl,   1, 1,   0.0, 1.0, 0.0,
      xl, yl, zs,   1, 0,   0.0, 1.0, 0.0,
    
      // Left
      xs, yl, zl,   1, 0,   -1.0, 0.0, 0.0,
      xs, ys, zl,   1, 1,   -1.0, 0.0, 0.0,
      xs, ys, zs,   0, 1,   -1.0, 0.0, 0.0,
      xs, yl, zs,   0, 0,   -1.0, 0.0, 0.0,
    
      // Right
      xl, yl, zl,   0, 0,   1.0, 0.0, 0.0,
      xl, ys, zl,   0, 1,   1.0, 0.0, 0.0,
      xl, ys, zs,   1, 1,   1.0, 0.0, 0.0,
      xl, yl, zs,   1, 0,   1.0, 0.0, 0.0,
    
      // Front
      xl, yl, zl,   1, 0,   0.0, 0.0, 1.0,
      xl, ys, zl,   1, 1,   0.0, 0.0, 1.0,
      xs, ys, zl,   0, 1,   0.0, 0.0, 1.0,
      xs, yl, zl,   0, 0,   0.0, 0.0, 1.0,
    
      // Back
      xl, yl, zs,   0, 0,   0.0, 0.0, -1.0,
      xl, ys, zs,   0, 1,   0.0, 0.0, -1.0,
      xs, ys, zs,   1, 1,   0.0, 0.0, -1.0,
      xs, yl, zs,   1, 0,   0.0, 0.0, -1.0,
    
      // Bottom
      xs, ys, zs,   0, 1,   0.0, -1.0, 0.0,
      xs, ys, zl,   0, 0,   0.0, -1.0, 0.0,
      xl, ys, zl,   1, 0,   0.0, -1.0, 0.0,
      xl, ys, zs,   1, 1,   0.0, -1.0, 0.0,
    ];
  }

  get _worldMatrix() {
    const { theta, phi } = this.playground.angles;
    const c1 = Math.cos(theta), s1 = Math.sin(theta);
    const c2 = Math.cos(phi), s2 = Math.sin(phi);

    return new Float32Array([
       c1,  s1 * s2,  c2 * s1, 0, 
        0,       c2,      -s2, 0, 
      -s1,  c1 * s2,  c1 * c2, 0, 
        0,        0,        0, 0.8
    ]);
  }

  _viewMatrix = new Float32Array([
    1, 0,   0, 0, 
    0, 1,   0, 0, 
    0, 0,   1, 0, 
    0, 0, -15, 1
  ]);

  _projMatrix = new Float32Array([
    2.414,     0,    0,  0, 
        0, 2.414,    0,  0, 
        0,     0,   -1, -1, 
        0,     0, -0.2,  0
  ]);

  _vertexShaderSource = "";

  _fragmentShaderSource = "";
}

function genIndices(offset) {
  return [
    // Top
    0, 1, 2,
    0, 2, 3,

    // Left
    5, 4, 6,
    6, 4, 7,

    // Right
    8, 9, 10,
    8, 10, 11,

    // Front
    13, 12, 14,
    15, 14, 12,

    // Back
    16, 17, 18,
    16, 18, 19,

    // Bottom
    21, 20, 22,
    22, 20, 23
  ].map(a => a + offset * 24);
}

export default Renderer;