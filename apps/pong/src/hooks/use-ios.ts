"use client";

import { useEffect, useState } from "react";
import Cookies from "cookie.js"; // or import cookie from "cookie.js" depending on the package

export function useIos() {
  const [isIos, setIsIos] = useState<boolean>(false);

  useEffect(() => {
    // Read the "ios" cookie value (assumed to be "true" or "false")
    const iosCookie = Cookies.get("ios");
    setIsIos(iosCookie === "true");
  }, []);

  return isIos;
}
