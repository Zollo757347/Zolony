import Renderer from "./Renderer";

class OffRenderer extends Renderer {
  constructor(playground, dimensions) {
    super(playground, dimensions);

    this.print = null;
  }

  startRendering() {
    if (!this.canvas) {
      throw new Error('The canvas has not been initialized.');
    }

    const gl = this._generateGl();
    const program = this._generateProgram(gl);


    const matViewUniformLocation = gl.getUniformLocation(program, 'mView');
    const matProjUniformLocation = gl.getUniformLocation(program, 'mProj');

    gl.uniformMatrix4fv(matViewUniformLocation, gl.FALSE, this._viewMatrix);
    gl.uniformMatrix4fv(matProjUniformLocation, gl.FALSE, this._projMatrix);


    const matWorldUniformLocation = gl.getUniformLocation(program, 'mWorld');
    const pixels = new Uint8Array(4);
    let vertices, indices;
    let positionAttribLocation, surfaceAttribLocation;

    const draw = () => {
      gl.uniformMatrix4fv(matWorldUniformLocation, gl.FALSE, this._worldMatrix);

      gl.clearColor(0, 0, 0, 1);
      gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
      
      [1, 103].forEach(type => {
        vertices = this._getVertices(type);
        indices = this._getIndices(type);
        this._setupBuffer(gl, vertices, indices);
      
        positionAttribLocation = gl.getAttribLocation(program, 'vertPosition');
        surfaceAttribLocation = gl.getAttribLocation(program, 'surfaceInfo');
  
        gl.vertexAttribPointer(positionAttribLocation, 3, gl.FLOAT, gl.FALSE, 6 * Float32Array.BYTES_PER_ELEMENT, 0);
        gl.vertexAttribPointer(surfaceAttribLocation, 3, gl.FLOAT, gl.FALSE, 6 * Float32Array.BYTES_PER_ELEMENT, 3 * Float32Array.BYTES_PER_ELEMENT);
      
        gl.enableVertexAttribArray(positionAttribLocation);
        gl.enableVertexAttribArray(surfaceAttribLocation);
  
        gl.drawElements(gl.TRIANGLES, indices.length, gl.UNSIGNED_SHORT, 0);
      });

      if (this.print) {
        gl.readPixels(this.print[0], 500-this.print[1], 1, 1, gl.RGBA, gl.UNSIGNED_BYTE, pixels);
        this.print[2](pixels);
        this.print = null;
      }

      if (this.playground.alive) {
        requestAnimationFrame(draw);
      }
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

  _genVertices(x, y, z) {
    const xs = x - this.dimensions[0] / 2;
    const ys = y - this.dimensions[1] / 2;
    const zs = z - this.dimensions[2] / 2;
    const xl = xs + 1;
    const yl = ys + 1;
    const zl = zs + 1;
    
    return [
      // Top
      xs, yl, zs,  ((x<<3)|2)+128, ((y<<3)|4)+128, ((z<<3)|2)+128, 
      xs, yl, zl,  ((x<<3)|2)+128, ((y<<3)|4)+128, ((z<<3)|2)+128, 
      xl, yl, zl,  ((x<<3)|2)+128, ((y<<3)|4)+128, ((z<<3)|2)+128, 
      xl, yl, zs,  ((x<<3)|2)+128, ((y<<3)|4)+128, ((z<<3)|2)+128, 
    
      // Left
      xs, yl, zl,  ((x<<3)|0)+128, ((y<<3)|2)+128, ((z<<3)|2)+128, 
      xs, ys, zl,  ((x<<3)|0)+128, ((y<<3)|2)+128, ((z<<3)|2)+128, 
      xs, ys, zs,  ((x<<3)|0)+128, ((y<<3)|2)+128, ((z<<3)|2)+128, 
      xs, yl, zs,  ((x<<3)|0)+128, ((y<<3)|2)+128, ((z<<3)|2)+128, 
    
      // Right
      xl, yl, zl,  ((x<<3)|4)+128, ((y<<3)|2)+128, ((z<<3)|2)+128, 
      xl, ys, zl,  ((x<<3)|4)+128, ((y<<3)|2)+128, ((z<<3)|2)+128, 
      xl, ys, zs,  ((x<<3)|4)+128, ((y<<3)|2)+128, ((z<<3)|2)+128, 
      xl, yl, zs,  ((x<<3)|4)+128, ((y<<3)|2)+128, ((z<<3)|2)+128, 
    
      // Front
      xl, yl, zl,  ((x<<3)|2)+128, ((y<<3)|2)+128, ((z<<3)|4)+128, 
      xl, ys, zl,  ((x<<3)|2)+128, ((y<<3)|2)+128, ((z<<3)|4)+128, 
      xs, ys, zl,  ((x<<3)|2)+128, ((y<<3)|2)+128, ((z<<3)|4)+128, 
      xs, yl, zl,  ((x<<3)|2)+128, ((y<<3)|2)+128, ((z<<3)|4)+128, 
    
      // Back
      xl, yl, zs,  ((x<<3)|2)+128, ((y<<3)|2)+128, ((z<<3)|0)+128, 
      xl, ys, zs,  ((x<<3)|2)+128, ((y<<3)|2)+128, ((z<<3)|0)+128, 
      xs, ys, zs,  ((x<<3)|2)+128, ((y<<3)|2)+128, ((z<<3)|0)+128, 
      xs, yl, zs,  ((x<<3)|2)+128, ((y<<3)|2)+128, ((z<<3)|0)+128, 
    
      // Bottom
      xs, ys, zs,  ((x<<3)|2)+128, ((y<<3)|0)+128, ((z<<3)|2)+128, 
      xs, ys, zl,  ((x<<3)|2)+128, ((y<<3)|0)+128, ((z<<3)|2)+128, 
      xl, ys, zl,  ((x<<3)|2)+128, ((y<<3)|0)+128, ((z<<3)|2)+128, 
      xl, ys, zs,  ((x<<3)|2)+128, ((y<<3)|0)+128, ((z<<3)|2)+128, 
    ];
  }

  _vertexShaderSource = `
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

  _fragmentShaderSource = `
    precision mediump float;

    varying vec3 fragSurface;

    void main() {
      gl_FragColor = vec4(fragSurface.x / 255.0, fragSurface.y / 255.0, fragSurface.z / 255.0, 1.0);
    }
  `;
}

export default OffRenderer;