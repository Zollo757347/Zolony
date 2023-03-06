import OffRenderer from "./OffRenderer";
import Renderer from "./Renderer";

class DisplayRenderer extends Renderer {
  constructor(playground, dimensions) {
    super(playground, dimensions);

    /**
     * @type {OffRenderer}
     * @private
     */
    this._offRenderer = new OffRenderer(playground, dimensions);

    this.images = [];
  }

  initialize(canvas) {
    this.images = [new Image(), new Image()];
    this.images[0].src = "/assets/minecraft/iron_block.png";
    this.images[1].src = "/assets/minecraft/redstone_lamp.png";

    super.initialize(canvas);
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
    gl.activeTexture(gl.TEXTURE0);


    const matViewUniformLocation = gl.getUniformLocation(program, 'mView');
    const matProjUniformLocation = gl.getUniformLocation(program, 'mProj');

    gl.uniformMatrix4fv(matViewUniformLocation, gl.FALSE, this._viewMatrix);
    gl.uniformMatrix4fv(matProjUniformLocation, gl.FALSE, this._projMatrix);

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

      [1, 103].forEach((type, i) => {
        vertices = this._getVertices(type);
        indices = this._getIndices(type);
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
  
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, this.images[i]);
        gl.drawElements(gl.TRIANGLES, indices.length, gl.UNSIGNED_SHORT, 0);
      });

      requestAnimationFrame(draw);
    }

    requestAnimationFrame(draw);
  }

  async getTarget(canvasX, canvasY) {
    return this._offRenderer.getTarget(canvasX, canvasY);
  }

  _vertexShaderSource = `
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

  _fragmentShaderSource = `
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

export default DisplayRenderer;