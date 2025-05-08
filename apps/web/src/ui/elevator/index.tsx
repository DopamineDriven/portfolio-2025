"use client";

import dynamic from "next/dynamic";
import { useSupportsWebGL } from "@/hooks/use-supports-web-gl";
import { WebGLFallback } from "@/ui/fallback/webgl";
import { LoadingSpinner } from "@/ui/loading-spinner";

const ElevatorAnimationPage = dynamic(() => import("@/ui/elevator/r3f"), {
  loading: () => <LoadingSpinner />,
  ssr: false
});

export function ElevatorClientWrapper() {
  const supportsWebGL = useSupportsWebGL();

  if (supportsWebGL === null) {
    return <LoadingSpinner />;
  }

  if (!supportsWebGL) {
    return (
      <WebGLFallback
        title="3D Experience Unavailable"
        description="We've detected that your device doesn't support WebGL, which is needed to display this 3D intro."
        redirectDelay={3}
        redirectPath="/"
      />
    );
  }

  return <ElevatorAnimationPage />;
}
