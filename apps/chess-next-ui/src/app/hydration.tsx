"use client";

import * as React from "react";
import { useBoardStore } from "./store";

const Hydration = () => {
  React.useEffect(() => {
    // eslint-disable-next-line
    useBoardStore.persist.rehydrate();
  }, []);

  return null;
};

export default Hydration;
