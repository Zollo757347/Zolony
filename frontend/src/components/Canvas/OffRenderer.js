class OffRenderer {
  constructor(playground) {
    /**
     * @type {import("./Playground").default}
     */
    this.playground = playground;

    /**
     * @type {import("./Engine").default}
     */
    this.engine = playground.engine;

    /**
     * @type {HTMLCanvasElement?}
     */
    this.canvas = null;

    this.print = null;
  }

  initialize(canvas) {
    this.canvas = canvas;

    this.startRendering();
  }

  startRendering() {
    if (!this.canvas) {
      throw new Error('The canvas has not been initialized.');
    }

    const gl = this._generateGl();
    const program = this._generateProgram(gl);


    const matViewUniformLocation = gl.getUniformLocation(program, 'mView');
    const matProjUniformLocation = gl.getUniformLocation(program, 'mProj');

    gl.uniformMatrix4fv(matViewUniformLocation, gl.FALSE, OffRenderer.ViewMatrix);
    gl.uniformMatrix4fv(matProjUniformLocation, gl.FALSE, OffRenderer.ProjMatrix);


    const matWorldUniformLocation = gl.getUniformLocation(program, 'mWorld');
    const pixels = new Uint8Array(4);
    let vertices, indices;
    let positionAttribLocation, surfaceAttribLocation;

    const draw = () => {
      gl.uniformMatrix4fv(matWorldUniformLocation, gl.FALSE, this._worldMatrix);

      gl.clearColor(0, 0, 0, 1);
      gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
      
      vertices = this._getVertices();
      indices = this._getIndices();
      this._setupBuffer(gl, vertices, indices);
    
      positionAttribLocation = gl.getAttribLocation(program, 'vertPosition');
      surfaceAttribLocation = gl.getAttribLocation(program, 'surfaceInfo');

      gl.vertexAttribPointer(positionAttribLocation, 3, gl.FLOAT, gl.FALSE, 6 * Float32Array.BYTES_PER_ELEMENT, 0);
      gl.vertexAttribPointer(surfaceAttribLocation, 3, gl.FLOAT, gl.FALSE, 6 * Float32Array.BYTES_PER_ELEMENT, 3 * Float32Array.BYTES_PER_ELEMENT);
    
      gl.enableVertexAttribArray(positionAttribLocation);
      gl.enableVertexAttribArray(surfaceAttribLocation);

      gl.drawElements(gl.TRIANGLES, indices.length, gl.UNSIGNED_SHORT, 0);

      if (this.print) {
        gl.readPixels(this.print[0], 500-this.print[1], 1, 1, gl.RGBA, gl.UNSIGNED_BYTE, pixels);
        this.print[2](pixels);
        this.print = null;
      }

      requestAnimationFrame(draw);
    }

    requestAnimationFrame(draw);
  }

  async getTarget(canvasX, canvasY) {
    const repCode = await new Promise(resolve => {
      this.print = [
        canvasX, 
        canvasY, 
        (pixels) => resolve(pixels)
      ];
    });

    if (!repCode[0] && !repCode[1] && !repCode[2]) return null;

    repCode[0] -= 128;
    repCode[1] -= 128;
    repCode[2] -= 128;

    return [
      repCode[0] >> 3, 
      repCode[1] >> 3, 
      repCode[2] >> 3, 
      ((repCode[0] & 7) >> 1) - 1, 
      ((repCode[1] & 7) >> 1) - 1, 
      ((repCode[2] & 7) >> 1) - 1
    ];
  }


  /**
   * 生成一個 OpenGL 環境
   * @private
   */
  _generateGl() {
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
    const vertexShader = this._loadShader(gl, gl.VERTEX_SHADER, OffRenderer.VertexShaderSource);
    const fragmentShader = this._loadShader(gl, gl.FRAGMENT_SHADER, OffRenderer.FragmentShaderSource);
    return this._loadProgram(gl, vertexShader, fragmentShader);
  }

  _getVertices() {
    const result = [];

    for (let i = 0; i < this.playground.xLen; i++) {
      for (let j = 0; j < this.playground.yLen; j++) {
        for (let k = 0; k < this.playground.zLen; k++) {
          if (this.engine.block(i, j, k)?.type !== 1) continue;
          result.push(...genVertices(i, j, k));

          // const blockSurfaces = interactionBox ? this.engine.block(i, j, k).interactionSurfaces() : this.engine.block(i, j, k).surfaces();
          // surfaces.push(...blockSurfaces);
        }
      }
    }

    return result;
  }

  _getIndices() {
    const result = [];

    let length = 0;
    for (let i = 0; i < this.playground.xLen; i++) {
      for (let j = 0; j < this.playground.yLen; j++) {
        for (let k = 0; k < this.playground.zLen; k++) {
          if (this.engine.block(i, j, k).type === 1) {
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
    const verticesBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, verticesBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
  
    const indicesBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indicesBuffer);
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
        0,        0,        0, 0.7
    ]);
  }

  static ViewMatrix = new Float32Array([
    1, 0,   0, 0, 
    0, 1,   0, 0, 
    0, 0,   1, 0, 
    0, 0, -15, 1
  ]);

  static ProjMatrix = new Float32Array([
    2.414,     0,    0,  0, 
        0, 2.414,    0,  0, 
        0,     0, -1.5, -1, 
        0,     0,  -25,  0
  ]);

  static VertexShaderSource = `
    precision mediump float;
    
    attribute vec3 vertPosition;
    attribute vec3 surfaceInfo;
    uniform mat4 mWorld;
    uniform mat4 mView;
    uniform mat4 mProj;
    varying vec3 fragSurface;

    void main() {
      fragSurface = surfaceInfo;
      gl_Position = mProj * mView * mWorld * vec4(vertPosition, 1.0);
    }
  `;

  static FragmentShaderSource = `
    precision mediump float;

    varying vec3 fragSurface;

    void main() {
      gl_FragColor = vec4(fragSurface.x / 255.0, fragSurface.y / 255.0, fragSurface.z / 255.0, 1.0);
    }
  `;
}

function genVertices(x, y, z) {
  return [
    // Top
    x+0.0, y+1.0, z+0.0,  ((x<<3)|2)+128, ((y<<3)|4)+128, ((z<<3)|2)+128, 
    x+0.0, y+1.0, z+1.0,  ((x<<3)|2)+128, ((y<<3)|4)+128, ((z<<3)|2)+128, 
    x+1.0, y+1.0, z+1.0,  ((x<<3)|2)+128, ((y<<3)|4)+128, ((z<<3)|2)+128, 
    x+1.0, y+1.0, z+0.0,  ((x<<3)|2)+128, ((y<<3)|4)+128, ((z<<3)|2)+128, 
  
    // Left
    x+0.0, y+1.0, z+1.0,  ((x<<3)|0)+128, ((y<<3)|2)+128, ((z<<3)|2)+128, 
    x+0.0, y+0.0, z+1.0,  ((x<<3)|0)+128, ((y<<3)|2)+128, ((z<<3)|2)+128, 
    x+0.0, y+0.0, z+0.0,  ((x<<3)|0)+128, ((y<<3)|2)+128, ((z<<3)|2)+128, 
    x+0.0, y+1.0, z+0.0,  ((x<<3)|0)+128, ((y<<3)|2)+128, ((z<<3)|2)+128, 
  
    // Right
    x+1.0, y+1.0, z+1.0,  ((x<<3)|4)+128, ((y<<3)|2)+128, ((z<<3)|2)+128, 
    x+1.0, y+0.0, z+1.0,  ((x<<3)|4)+128, ((y<<3)|2)+128, ((z<<3)|2)+128, 
    x+1.0, y+0.0, z+0.0,  ((x<<3)|4)+128, ((y<<3)|2)+128, ((z<<3)|2)+128, 
    x+1.0, y+1.0, z+0.0,  ((x<<3)|4)+128, ((y<<3)|2)+128, ((z<<3)|2)+128, 
  
    // Front
    x+1.0, y+1.0, z+1.0,  ((x<<3)|2)+128, ((y<<3)|2)+128, ((z<<3)|4)+128, 
    x+1.0, y+0.0, z+1.0,  ((x<<3)|2)+128, ((y<<3)|2)+128, ((z<<3)|4)+128, 
    x+0.0, y+0.0, z+1.0,  ((x<<3)|2)+128, ((y<<3)|2)+128, ((z<<3)|4)+128, 
    x+0.0, y+1.0, z+1.0,  ((x<<3)|2)+128, ((y<<3)|2)+128, ((z<<3)|4)+128, 
  
    // Back
    x+1.0, y+1.0, z+0.0,  ((x<<3)|2)+128, ((y<<3)|2)+128, ((z<<3)|0)+128, 
    x+1.0, y+0.0, z+0.0,  ((x<<3)|2)+128, ((y<<3)|2)+128, ((z<<3)|0)+128, 
    x+0.0, y+0.0, z+0.0,  ((x<<3)|2)+128, ((y<<3)|2)+128, ((z<<3)|0)+128, 
    x+0.0, y+1.0, z+0.0,  ((x<<3)|2)+128, ((y<<3)|2)+128, ((z<<3)|0)+128, 
  
    // Bottom
    x+0.0, y+0.0, z+0.0,  ((x<<3)|2)+128, ((y<<3)|0)+128, ((z<<3)|2)+128, 
    x+0.0, y+0.0, z+1.0,  ((x<<3)|2)+128, ((y<<3)|0)+128, ((z<<3)|2)+128, 
    x+1.0, y+0.0, z+1.0,  ((x<<3)|2)+128, ((y<<3)|0)+128, ((z<<3)|2)+128, 
    x+1.0, y+0.0, z+0.0,  ((x<<3)|2)+128, ((y<<3)|0)+128, ((z<<3)|2)+128, 
  ];
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

export default OffRenderer;