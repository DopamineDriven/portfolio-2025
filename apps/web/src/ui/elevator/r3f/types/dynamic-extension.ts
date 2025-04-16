import * as THREE from "three";

/**
 * A generic type for a constructor function (with any parameters).
 */
type Constructor = new (...args: any[]) => any;
/* eslint-disable-next-line @typescript-eslint/no-unsafe-function-type */
export interface Type<T = any> extends Function {
  /* eslint-disable-next-line @typescript-eslint/prefer-function-type */
  new (...args: any[]): T;
}
/**
 * Given a type T (here, the THREE namespace), ConstructableKeys<T> will
 * produce a union of keys whose values are assignable to a constructor.
 */
type ConstructableKeys<T> = {
  [K in keyof T]: T[K] extends Constructor ? K : never;
}[keyof T];

/**
 * This type takes a base constructor and maps its constructor parameters
 * and instance type. It then augments the instance with additional methods.
 */
type ExtendedClassType<Base extends Constructor> = new (
  ...args: ConstructorParameters<Base>
) => InstanceType<Base> & {
  update(): void;
  dispose(): void;
};

export type CreateThreeExtendedKeys = ConstructableKeys<typeof THREE>;

/**
 * An extended version of the helper function that:
 * 1. Accepts a key from the THREE namespace (filtered to only constructors).
 * 2. Returns a new class that extends the original class.
 * 3. Preserves the original constructor parameters and instance types.
 *
 * We use `Extract<typeof THREE[T], Constructor>` to ensure that TypeScript
 * treats the member `THREE[key]` as a constructor.
 */
export function createExtendedThreeClass<
  const T extends CreateThreeExtendedKeys
>(key: T): ExtendedClassType<Extract<(typeof THREE)[T], Constructor>> {
  // Get the base class using the key.
  const Base = THREE[key] as unknown as Constructor;

  // At runtime, ensure that the obtained base is indeed a function.
  if (typeof Base !== "function") {
    throw new Error(`THREE.${key} is not a constructor`);
  }

  // Create an extended class that adds new methods
  const _Extended = class extends Base {
    update() {}
    dispose() {}
  };

  // Cast the result to the extended type with proper parameters and instance type.
  return class extends Base {
    update() {}
    dispose() {}
  } as ExtendedClassType<Extract<(typeof THREE)[T], Constructor>>;
}

/* ================================================================
   USAGE EXAMPLES
   ================================================================ */

// Extend a class, e.g. Object3D
const ExtendedObject3D = createExtendedThreeClass("Object3D");
const PositionImpl = createExtendedThreeClass("PropertyMixer");
const PropertyBindingImpl = createExtendedThreeClass("PropertyBinding");

const _obbbb = new PositionImpl(
  new PropertyBindingImpl(new ExtendedObject3D(), "/"),
  "PositionImpl",
  3.0
);
// TypeScript infers that ExtendedObject3D takes the same parameters as THREE.Object3D’s constructor.
const obj = new ExtendedObject3D();
obj.update();
obj.dispose();

// Extend another class, e.g. Mesh
const ExtendedMesh = createExtendedThreeClass("Mesh");
// The extended Mesh expects the same parameters as THREE.Mesh,
// such as (geometry: BufferGeometry, material: Material, ...).
const mesh = new ExtendedMesh(
  new THREE.BoxGeometry(),
  new THREE.MeshBasicMaterial()
);
mesh.update();
mesh.dispose();

const _someClass = <const V extends CreateThreeExtendedKeys>(
  _ctor: ExtendedClassType<Extract<(typeof THREE)[V], Type>>
) =>
  class extends THREE.Object3D {
    update() {}
    dispose() {}
  };
export type Equal<X, Y> =
  (<T>() => T extends X ? 1 : 2) extends <T>() => T extends Y ? 1 : 2
    ? true
    : false;

type _X = Equal<typeof obj, THREE.Object3D>;
