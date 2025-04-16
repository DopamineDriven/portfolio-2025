import * as THREE from "three";

export class TriangleGeometry extends THREE.BufferGeometry {
  constructor(width = 1, height = 1) {
    super();

    const vertices = new Float32Array([
      -width / 2,
      -height / 2,
      0, // bottom left
      width / 2,
      -height / 2,
      0, // bottom right
      0,
      height / 2,
      0 // top
    ]);

    const uvs = new Float32Array([0, 0, 1, 0, 0.5, 1]);

    // all pointing forward (2D triangle)
    const normals = new Float32Array([0, 0, 1, 0, 0, 1, 0, 0, 1]);

    this.setAttribute("position", new THREE.BufferAttribute(vertices, 3));
    this.setAttribute("normal", new THREE.BufferAttribute(normals, 3));
    this.setAttribute("uv", new THREE.BufferAttribute(uvs, 2));

    // add face
    this.setIndex([0, 1, 2]);

    this.computeBoundingSphere();
  }
}
