import OffRenderer from "./OffRenderer";

class Renderer {
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

    /**
     * @type {OffRenderer}
     * @private
     */
    this._offRenderer = new OffRenderer(this.playground);

    this.image = null;
  }

  async initialize(canvas) {
    this.canvas = canvas;

    this.image = new Image();
    await new Promise(resolve => {
      if (this.image.complete) {
        resolve();
      }
      else {
        this.image.onload = () => resolve();
      }
      this.image.src = "/assets/minecraft/iron_block.png";
    });

    this.startRendering();
    this._offRenderer.initialize(new OffscreenCanvas(canvas.width, canvas.height));
  }

  startRendering() {
    if (!this.canvas) {
      throw new Error('The canvas has not been initialized.');
    }

    const gl = this._generateGl();
    const program = this._generateProgram(gl);

    const boxTexture = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, boxTexture);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, this.image);
    gl.bindTexture(gl.TEXTURE_2D, null);


    const matViewUniformLocation = gl.getUniformLocation(program, 'mView');
    const matProjUniformLocation = gl.getUniformLocation(program, 'mProj');

    gl.uniformMatrix4fv(matViewUniformLocation, gl.FALSE, Renderer.ViewMatrix);
    gl.uniformMatrix4fv(matProjUniformLocation, gl.FALSE, Renderer.ProjMatrix);

    const ambientUniformLocation = gl.getUniformLocation(program, 'ambientIntensity');
    const lightColorUniformLocation = gl.getUniformLocation(program, 'lightColor');
    const lightDirectionUniformLocation = gl.getUniformLocation(program, 'lightDirection');

    gl.uniform3f(ambientUniformLocation, 0.4, 0.4, 0.7);
    gl.uniform3f(lightColorUniformLocation, 0.8, 0.8, 0.4);
    gl.uniform3f(lightDirectionUniformLocation, 1.0, 2.0, 3.0);

    const matWorldUniformLocation = gl.getUniformLocation(program, 'mWorld');
    let vertices, indices;
    let positionAttribLocation, texCoordAttribLocation, normalAttribLocation;

    const draw = () => {
      gl.uniformMatrix4fv(matWorldUniformLocation, gl.FALSE, this._worldMatrix);

      gl.clearColor(1, 0.96, 0.66, 1);
      gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

      gl.bindTexture(gl.TEXTURE_2D, boxTexture);
      gl.activeTexture(gl.TEXTURE0);

      vertices = this._getVertices();
      indices = this._getIndices();
      this._setupBuffer(gl, vertices, indices);
  
      positionAttribLocation = gl.getAttribLocation(program, 'vertPosition');
      texCoordAttribLocation = gl.getAttribLocation(program, 'vertTexCoord');
      normalAttribLocation = gl.getAttribLocation(program, 'vertNormal');
  
      gl.vertexAttribPointer(positionAttribLocation, 3, gl.FLOAT, gl.FALSE, 8 * Float32Array.BYTES_PER_ELEMENT, 0);
      gl.vertexAttribPointer(texCoordAttribLocation, 2, gl.FLOAT, gl.FALSE, 8 * Float32Array.BYTES_PER_ELEMENT, 3 * Float32Array.BYTES_PER_ELEMENT);
      gl.vertexAttribPointer(normalAttribLocation, 3, gl.FLOAT, gl.TRUE, 8 * Float32Array.BYTES_PER_ELEMENT, 5 * Float32Array.BYTES_PER_ELEMENT);
    
      gl.enableVertexAttribArray(positionAttribLocation);
      gl.enableVertexAttribArray(texCoordAttribLocation);
      gl.enableVertexAttribArray(normalAttribLocation);

      gl.drawElements(gl.TRIANGLES, indices.length, gl.UNSIGNED_SHORT, 0);

      requestAnimationFrame(draw);
    }

    requestAnimationFrame(draw);
  }

  async getTarget(canvasX, canvasY) {
    return this._offRenderer.getTarget(canvasX, canvasY);
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
    const vertexShader = this._loadShader(gl, gl.VERTEX_SHADER, Renderer.VertexShaderSource);
    const fragmentShader = this._loadShader(gl, gl.FRAGMENT_SHADER, Renderer.FragmentShaderSource);
    return this._loadProgram(gl, vertexShader, fragmentShader);
  }

  _getVertices() {
    const result = [];

    for (let i = 0; i < this.playground.xLen; i++) {
      for (let j = 0; j < this.playground.yLen; j++) {
        for (let k = 0; k < this.playground.zLen; k++) {
          if (this.engine.block(i, j, k).type !== 1) continue;
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
    attribute vec2 vertTexCoord;
    attribute vec3 vertNormal;
    uniform mat4 mWorld;
    uniform mat4 mView;
    uniform mat4 mProj;
    varying vec2 fragTexCoord;
    varying vec3 fragNormal;

    void main() {
      fragTexCoord = vertTexCoord;
      fragNormal = (mWorld * vec4(vertNormal, 0.0)).xyz;
      gl_Position = mProj * mView * mWorld * vec4(vertPosition, 1.0);
    }
  `;

  static FragmentShaderSource = `
    precision mediump float;

    uniform sampler2D sampler;
    uniform vec3 ambientIntensity;
    uniform vec3 lightColor;
    uniform vec3 lightDirection;
    varying vec2 fragTexCoord;
    varying vec3 fragNormal;

    void main() {
      vec4 texel = texture2D(sampler, fragTexCoord);
      vec3 lightIntensity = ambientIntensity + lightColor * max(dot(normalize(fragNormal), normalize(lightDirection)), 0.0);

      gl_FragColor = vec4(texel.rgb * lightIntensity, texel.a);
    }
  `;
}

function genVertices(x, y, z) {
  return [
    // Top
    x+0.0, y+1.0, z+0.0,   0, 0,   0.0, 1.0, 0.0,
    x+0.0, y+1.0, z+1.0,   0, 1,   0.0, 1.0, 0.0,
    x+1.0, y+1.0, z+1.0,   1, 1,   0.0, 1.0, 0.0,
    x+1.0, y+1.0, z+0.0,   1, 0,   0.0, 1.0, 0.0,
  
    // Left
    x+0.0, y+1.0, z+1.0,   0, 0,   -1.0, 0.0, 0.0,
    x+0.0, y+0.0, z+1.0,   1, 0,   -1.0, 0.0, 0.0,
    x+0.0, y+0.0, z+0.0,   1, 1,   -1.0, 0.0, 0.0,
    x+0.0, y+1.0, z+0.0,   0, 1,   -1.0, 0.0, 0.0,
  
    // Right
    x+1.0, y+1.0, z+1.0,   1, 1,   1.0, 0.0, 0.0,
    x+1.0, y+0.0, z+1.0,   0, 1,   1.0, 0.0, 0.0,
    x+1.0, y+0.0, z+0.0,   0, 0,   1.0, 0.0, 0.0,
    x+1.0, y+1.0, z+0.0,   1, 0,   1.0, 0.0, 0.0,
  
    // Front
    x+1.0, y+1.0, z+1.0,   1, 1,   0.0, 0.0, 1.0,
    x+1.0, y+0.0, z+1.0,   1, 0,   0.0, 0.0, 1.0,
    x+0.0, y+0.0, z+1.0,   0, 0,   0.0, 0.0, 1.0,
    x+0.0, y+1.0, z+1.0,   0, 1,   0.0, 0.0, 1.0,
  
    // Back
    x+1.0, y+1.0, z+0.0,   0, 0,   0.0, 0.0, -1.0,
    x+1.0, y+0.0, z+0.0,   0, 1,   0.0, 0.0, -1.0,
    x+0.0, y+0.0, z+0.0,   1, 1,   0.0, 0.0, -1.0,
    x+0.0, y+1.0, z+0.0,   1, 0,   0.0, 0.0, -1.0,
  
    // Bottom
    x+0.0, y+0.0, z+0.0,   1, 1,   0.0, -1.0, 0.0,
    x+0.0, y+0.0, z+1.0,   1, 0,   0.0, -1.0, 0.0,
    x+1.0, y+0.0, z+1.0,   0, 0,   0.0, -1.0, 0.0,
    x+1.0, y+0.0, z+0.0,   0, 1,   0.0, -1.0, 0.0,
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

export default Renderer;