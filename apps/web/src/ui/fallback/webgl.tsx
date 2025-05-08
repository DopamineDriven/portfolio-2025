"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AlertTriangle, CuboidIcon as Cube3d, Home } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/ui/atoms/alert";
import { Button } from "@/ui/atoms/alert-button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from "@/ui/atoms/card";

export interface WebGLFallbackProps {
  title?: string;
  description?: string;
  className?: string;
  redirectDelay?: number;
  redirectPath?: string;
}

export function WebGLFallback({
  title = "3D content unavailable",
  description = "Your device or browser doesn't support WebGL, which is required to display this 3D content.",
  className = "",
  redirectDelay = 3,
  redirectPath = "/"
}: WebGLFallbackProps) {
  const [isClient, setIsClient] = useState(false);
  const [countdown, setCountdown] = useState(redirectDelay);
  const router = useRouter();

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (!isClient) return;

    // Start countdown for automatic redirection
    const timer = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          router.push(redirectPath);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isClient, redirectPath, router]);

  if (!isClient) {
    return null; // Prevent SSR flash
  }

  return (
    <div
      className={`flex h-full min-h-[400px] w-full items-center justify-center p-4 ${className}`}>
      <Card className="bg-background/80 w-full max-w-md border-2 backdrop-blur-sm">
        <CardHeader>
          <div className="mb-2 flex items-center gap-2">
            <div className="bg-primary/10 rounded-full p-2">
              <Cube3d className="text-primary h-6 w-6" />
            </div>
            <CardTitle>{title}</CardTitle>
          </div>
          <CardDescription className="text-base">{description}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <Alert
              variant="destructive"
              className="bg-destructive/10 border-destructive/20">
              <AlertTriangle className="h-4 w-4" />
              <AlertTitle>WebGL Not Supported</AlertTitle>
              <AlertDescription>
                Your browser or device doesn't support WebGL technology required
                for 3D rendering.
              </AlertDescription>
            </Alert>

            <div className="from-primary/20 via-secondary/20 to-muted relative h-32 w-full overflow-hidden rounded-lg bg-gradient-to-br">
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="grid grid-cols-3 gap-3 opacity-50">
                  {Array.from({ length: 9 }).map((_, i) => (
                    <div
                      key={i}
                      className="bg-primary/30 h-8 w-8 animate-pulse rounded"
                      style={{
                        animationDelay: `${i * 0.1}s`,
                        animationDuration: `${2 + (i % 3)}s`
                      }}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex flex-col gap-4">
          <p className="text-muted-foreground text-center text-sm">
            Click below to proceed or wait {countdown} second
            {countdown !== 1 ? "s" : ""} to be automatically redirected
          </p>
          <Link href={redirectPath} className="w-full">
            <Button className="w-full" asChild>
              <span>
                <Home className="mr-2 h-4 w-4" />
                Continue to Home
              </span>
            </Button>
          </Link>
        </CardFooter>
      </Card>
    </div>
  );
}
