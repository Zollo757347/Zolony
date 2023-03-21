import { BlockType } from "../core";
import OffRenderer from "./OffRenderer";
import Renderer from "./Renderer";

class DisplayRenderer extends Renderer {
  constructor(playground, dimensions) {
    super(playground, dimensions);

    this.images = new Map();

    this._devMode = false;

    /**
     * @type {OffRenderer}
     * @private
     */
    this._offRenderer = new OffRenderer(playground, dimensions);
  }

  initialize(canvas) {
    ['iron_block', 'cobblestone', 'lever_on', 'lever', 'redstone_lamp', 'redstone_lamp_on', 'glass', 'repeater', 'smooth_stone', 'repeater_on', 'redstone_torch', 'redstone_torch_off', 'bedrock'].forEach(src => {
      const image = new Image();
      image.src = `/assets/minecraft/${src}.png`;
      this.images.set(src, image);
    });

    if (this._devMode) {
      super.initialize(new OffscreenCanvas(canvas.width, canvas.height));
      this._offRenderer.initialize(canvas);
    }
    else {
      super.initialize(canvas);
      this._offRenderer.initialize(new OffscreenCanvas(canvas.width, canvas.height));
    }
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
    const matWorldUniformLocation = gl.getUniformLocation(program, 'mWorld');

    gl.uniform3f(ambientUniformLocation, 0.4, 0.4, 0.7);
    gl.uniform3f(lightColorUniformLocation, 0.8, 0.8, 0.4);
    gl.uniform3f(lightDirectionUniformLocation, 1.0, 2.0, 3.0);


    const positionAttribLocation = gl.getAttribLocation(program, 'vertPosition');
    const texCoordAttribLocation = gl.getAttribLocation(program, 'vertTexCoord');
    const normalAttribLocation = gl.getAttribLocation(program, 'vertNormal');
      
    gl.enableVertexAttribArray(positionAttribLocation);
    gl.enableVertexAttribArray(texCoordAttribLocation);
    gl.enableVertexAttribArray(normalAttribLocation);

    const indices = new Uint16Array(
      Array.from(
        { length: 1000 }, 
        (_, i) => {
          i <<= 2;
          return [i, i + 1, i + 2, i, i + 2, i + 3];
        }
      ).flat()
    );

    const draw = () => {
      gl.uniformMatrix4fv(matWorldUniformLocation, gl.FALSE, this._worldMatrix);

      gl.clearColor(1, 0.96, 0.66, 1);
      gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

      for (const [image, { vertices }] of this._getBlockVertices()) {
        this._setupBuffer(gl, vertices, indices);
    
        gl.vertexAttribPointer(positionAttribLocation, 3, gl.FLOAT, gl.FALSE, 8 * Float32Array.BYTES_PER_ELEMENT, 0);
        gl.vertexAttribPointer(texCoordAttribLocation, 2, gl.FLOAT, gl.FALSE, 8 * Float32Array.BYTES_PER_ELEMENT, 3 * Float32Array.BYTES_PER_ELEMENT);
        gl.vertexAttribPointer(normalAttribLocation, 3, gl.FLOAT, gl.TRUE, 8 * Float32Array.BYTES_PER_ELEMENT, 5 * Float32Array.BYTES_PER_ELEMENT);
  
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, this.images.get(image));
        gl.drawElements(gl.TRIANGLES, (vertices.length * 3) >> 4, gl.UNSIGNED_SHORT, 0);
      }

      if (this.playground.alive) {
        requestAnimationFrame(draw);
      }
    }

    requestAnimationFrame(draw);
  }

  async getTarget(canvasX, canvasY) {
    return this._offRenderer.getTarget(canvasX, canvasY);
  }

  _getBlockVertices() {
    const map = new Map();
    for (let i = 0; i < this.dimensions[0]; i++) {
      for (let j = 0; j < this.dimensions[1]; j++) {
        for (let k = 0; k < this.dimensions[2]; k++) {
          const block = this.engine.block(i, j, k);
          if (!block?.textures) continue;

          const x = i - this.dimensions[0] / 2;
          const y = j - this.dimensions[1] / 2;
          const z = k - this.dimensions[2] / 2;

          const [a, b, c, d] = !block.states.facing ? [1, 0, 0, 1] :
            block.states.facing === 'west' ? [0, 1, -1, 0] :
            block.states.facing === 'south' ? [-1, 0, 0, -1] :
            block.states.facing === 'east' ? [0, -1, 1, 0] : [1, 0, 0, 1];

          const [n, p, q, r, s] = !block.states.face ? [1, 1, 0, 0, 1] :
            block.states.face === 'wall' ? [-1, 0, -1, -1, 0] :
            block.states.face === 'ceiling' ? [-1, -1, 0, 0, 1] : [1, 1, 0, 0, 1];

          const an = a * n, cn = c * n;
          const br = b * r, dr = d * r;
          const bs = b * s, ds = d * s;
          const [e, f, g] = [(1-an-br-bs)/2, (1-p-q)/2, (1-cn-dr-ds)/2];

          block.textures.forEach(texture => {
            for (const [dirName, data] of Object.entries(texture)) {
              if (!data || !this._shouldRender(block, dirName)) continue;
              
              let storage = map.get(data.source);
              if (!storage) {
                storage = { vertices: [], counter: 0 };
                map.set(data.source, storage);
              }

              const v = data.vertices;
              for (let i = 0; i < v.length; i += 8) {
                storage.vertices.push(
                  v[i] * an + v[i+1] * br + v[i+2] * bs + e + x, 
                              v[i+1] * p  + v[i+2] * q  + f + y, 
                  v[i] * cn + v[i+1] * dr + v[i+2] * ds + g + z, 
                  v[i+3], 
                  v[i+4], 
                  v[i+5] * an + v[i+6] * br + v[i+7] * bs, 
                              + v[i+6] * p  + v[i+7] * q, 
                  v[i+5] * cn + v[i+6] * dr + v[i+7] * ds
                );
              }
              storage.counter++;
            }
          });
        }
      }  
    }
    return map;
  }

  _shouldRender(block, dirName) {
    if (block.type !== BlockType.IronBlock && block.type !== BlockType.GlassBlock) return true;

    const [dx, dy, dz] = {
      'up': [0, 1, 0], 
      'west': [-1, 0, 0], 
      'east': [1, 0, 0], 
      'south': [0, 0, 1], 
      'north': [0, 0, -1], 
      'down': [0, -1, 0]
    }[dirName];

    const adjacentBlock = this.engine.block(block.x + dx, block.y + dy, block.z + dz);
    if (!adjacentBlock) return true;

    if (block.type === BlockType.GlassBlock) return !adjacentBlock.fullBlock;
    return !adjacentBlock.fullBlock || adjacentBlock.type === BlockType.AirBlock || adjacentBlock.type === BlockType.GlassBlock;
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
      if (gl_FragColor.a < 0.1) discard;
    }
  `;
}

export default DisplayRenderer;