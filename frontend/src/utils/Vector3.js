class Vector3 {
  constructor(x, y, z) {
    this.x = x || 0;
    this.y = y || 0;
    this.z = z || 0;
  }

  add(vec) {
    return new Vector3(this.x + vec.x, this.y + vec.y, this.z + vec.z);
  }

  subtract(vec) {
    return new Vector3(this.x - vec.x, this.y - vec.y, this.z - vec.z);
  }

  multiply(scl) {
    return new Vector3(this.x * scl, this.y * scl, this.z * scl);
  }

  dot(vec) {
    return this.x * vec.x + this.y * vec.y + this.z * vec.z;
  }

  cross(vec) {
    return new Vector3(
      this.y * vec.z - this.z * vec.y, 
      this.z * vec.x - this.x * vec.z, 
      this.x * vec.y - this.y * vec.x
    );
  }

  rotateX(rad) {
    const c = Math.cos(rad);
    const s = Math.sin(rad);
  
    return new Vector3(
      this.x, 
      c * this.y - s * this.z, 
      s * this.y + c * this.z
    );
  }

  rotateY(rad) {
    const c = Math.cos(rad);
    const s = Math.sin(rad);

    return new Vector3(
      c * this.z - s * this.x, 
      this.y, 
      s * this.z + c * this.x
    )
  }

  rotateZ(rad) {
    const c = Math.cos(rad);
    const s = Math.sin(rad);

    return new Vector3(
      c * this.x - s * this.y, 
      s * this.x + c * this.y, 
      this.z
    );
  }

  projectZ(cameraZ, distance) {
    return new Vector3(
      this.x * distance / (cameraZ - this.z), 
      this.y * distance / (cameraZ - this.z), 
      this.z
    );
  }

  mirrorY() {
    return new Vector3(this.x, -this.y, this.z);
  }
}

export default Vector3;