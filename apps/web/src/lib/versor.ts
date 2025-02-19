export class Versor {
  static fromAngles([l, p, g]: [number, number, number]): [
    number,
    number,
    number,
    number
  ] {
    l *= Math.PI / 360;
    p *= Math.PI / 360;
    g *= Math.PI / 360;
    const sl = Math.sin(l),
      cl = Math.cos(l);
    const sp = Math.sin(p),
      cp = Math.cos(p);
    const sg = Math.sin(g),
      cg = Math.cos(g);
    return [
      cl * cp * cg + sl * sp * sg,
      sl * cp * cg - cl * sp * sg,
      cl * sp * cg + sl * cp * sg,
      cl * cp * sg - sl * sp * cg
    ];
  }

  static toAngles([a, b, c, d]: [number, number, number, number]): [
    number,
    number,
    number
  ] {
    return [
      (Math.atan2(2 * (a * b + c * d), 1 - 2 * (b * b + c * c)) * 180) /
        Math.PI,
      (Math.asin(Math.max(-1, Math.min(1, 2 * (a * c - d * b)))) * 180) /
        Math.PI,
      (Math.atan2(2 * (a * d + b * c), 1 - 2 * (c * c + d * d)) * 180) / Math.PI
    ];
  }

  static interpolateAngles(
    a: [number, number, number],
    b: [number, number, number]
  ): (t: number) => [number, number, number] {
    const i = Versor.interpolate(Versor.fromAngles(a), Versor.fromAngles(b));
    return t => Versor.toAngles(i(t));
  }

  static interpolate(
    [a1, b1, c1, d1]: [number, number, number, number],
    [a2, b2, c2, d2]: [number, number, number, number]
  ): (t: number) => [number, number, number, number] {
    let dot = a1 * a2 + b1 * b2 + c1 * c2 + d1 * d2;
    if (dot < 0) (a2 = -a2), (b2 = -b2), (c2 = -c2), (d2 = -d2), (dot = -dot);
    if (dot > 0.9995)
      return Versor.interpolateLinear([a1, b1, c1, d1], [a2, b2, c2, d2]);
    const theta0 = Math.acos(Math.max(-1, Math.min(1, dot)));
    const l = Math.hypot(
      (a2 -= a1 * dot),
      (b2 -= b1 * dot),
      (c2 -= c1 * dot),
      (d2 -= d1 * dot)
    );
    (a2 /= l), (b2 /= l), (c2 /= l), (d2 /= l);
    return (t: number) => {
      const theta = theta0 * t;
      const s = Math.sin(theta);
      const c = Math.cos(theta);
      return [
        a1 * c + a2 * s,
        b1 * c + b2 * s,
        c1 * c + c2 * s,
        d1 * c + d2 * s
      ];
    };
  }
  static interpolateLinear(
    [a1, b1, c1, d1]: [number, number, number, number],
    [a2, b2, c2, d2]: [number, number, number, number]
  ): (t: number) => [number, number, number, number] {
    (a2 -= a1), (b2 -= b1), (c2 -= c1), (d2 -= d1);

    return t => {
      let r0 = a1 + a2 * t;
      let r1 = b1 + b2 * t;
      let r2 = c1 + c2 * t;
      let r3 = d1 + d2 * t;
      const l = Math.hypot(r0, r1, r2, r3);
      (r0 /= l), (r1 /= l), (r2 /= l), (r3 /= l);
      return [r0, r1, r2, r3];
    };
  }
}
