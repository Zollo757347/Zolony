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
     * @type {WebGLRenderingContext?}
     */
    this.gl = null;

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

    const gl = this.gl = this.canvas.getContext('webgl', { alpha: false });
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

  get _worldMatrix() {
    const { theta, phi } = this.playground.angles;
    const c1 = Math.cos(theta), s1 = Math.sin(theta);
    const c2 = Math.cos(phi), s2 = Math.sin(phi);

    return new Float32Array([
       c1,  s1 * s2,  c2 * s1, 0, 
        0,       c2,      -s2, 0, 
      -s1,  c1 * s2,  c1 * c2, 0, 
        0,        0,        0, 1
    ]);
  }

  __viewMatrix = null;
  get _viewMatrix() {
    if (this.__viewMatrix) return this.__viewMatrix;

    const a = 2.5 / Math.sqrt(Math.max(...this.dimensions));
    this.__viewMatrix = new Float32Array([
      a, 0, 0, 0, 
      0, a, 0, 0, 
      0, 0, a, 0, 
      0, 0, -15, 1
    ]);
    return this.__viewMatrix;
  }

  _projMatrix = new Float32Array([
    2.414,     0,    0,  0, 
        0, 2.414,    0,  0, 
        0,     0,   -1, -1, 
        0,     0, -0.2,  0
  ]);

  _vertexShaderSource = "";

  _fragmentShaderSource = "";
}

export default Renderer;