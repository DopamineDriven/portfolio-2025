import * as THREE from "three";

export interface Uniform<T = unknown> {
  value: T;
}

export type UniformRecord<T extends Record<string, unknown>> = {
  [K in keyof T]: Uniform<T[K]>;
};

export function createUniforms<T extends Record<string, unknown>>(values: T) {
  const uniforms = Object.fromEntries(
    Object.entries(values).map(([k, v]) => [k, { value: v }])
  ) as UniformRecord<T>;

  return {
    uniforms,
    typed: uniforms
  };
}
const { uniforms: _uniforms, typed } = createUniforms({
  spotPosition: new THREE.Vector3(),
  lightColor: new THREE.Color("#fff"),
  opacity: 0.5,
  resolution: [1920, 1080] as [number, number],
  cameraNear: 0.1,
  cameraFar: 100
});

// All safe:
typed.opacity.value = 1;
typed.spotPosition.value.set(0, 0, 0);
typed.lightColor.value.set("#ff00ff");
export type InferUniformValue<T> = T extends Uniform<infer V> ? V : never;

export type ExtractUniformValues<T extends Record<string, Uniform>> = {
  [K in keyof T]: InferUniformValue<T[K]>;
};

// Example:
type _OriginalInput = ExtractUniformValues<typeof _uniforms>;

function generateGLSLUniforms<T extends Record<string, unknown>>(values: T) {
  return Object.entries(values)
    .map(([name, value]) => {
      const type = getGLSLType(value);
      return `uniform ${type} ${name};`;
    })
    .join("\n");
}

function getGLSLType<const V = unknown >(value: V) {
  if (typeof value === "number") return "float" as const;
  if (Array.isArray(value) && value.length === 2) return "vec2" as const;
  if (Array.isArray(value) && value.length === 3) return "vec3" as const;
  if (Array.isArray(value) && value.length === 4) return "vec4" as const;
  if (value instanceof THREE.Color) return "vec3" as const;
  if (value instanceof THREE.Vector2) return "vec2" as const;
  if (value instanceof THREE.Vector3) return "vec3" as const;
  if (value instanceof THREE.Matrix3) return "mat3" as const;
  return "float" as const;
}
const glsl = generateGLSLUniforms({
  spotPosition: new THREE.Vector3(),
  lightColor: new THREE.Color("#fff"),
  opacity: 0.5
});

console.log(glsl);
