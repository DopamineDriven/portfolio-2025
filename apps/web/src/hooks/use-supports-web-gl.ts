"use client";

import { useEffect, useState } from "react";
import Cookies from "js-cookie";

export function useSupportsWebGL(): boolean {
  const cookieVal = Cookies.get("supports-webgl");
  const initial =
    cookieVal === "true" ? true : cookieVal === "false" ? false : false;

  const [supported, setSupported] = useState(initial);

  useEffect(() => {
    const canvas = document.createElement("canvas");
    const gl =
      !!window.WebGLRenderingContext &&
      (canvas.getContext("webgl") || canvas.getContext("experimental-webgl"));
    setSupported(Boolean(gl));
  }, []);

  return supported;
}
