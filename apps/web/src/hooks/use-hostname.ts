"use client";

import { useEffect, useState } from "react";
import Cookies from "js-cookie";

export function useHostname() {
  const [hostname, setHostname] = useState<string | undefined>(undefined);

  useEffect(() => {
    const hostnameCookie = Cookies.get("hostname");
    setHostname(hostnameCookie ?? undefined);
  }, []);

  return hostname;
}
