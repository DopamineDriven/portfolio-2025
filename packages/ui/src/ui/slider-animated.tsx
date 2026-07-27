"use client";

import { useEffect, useState } from "react";
import * as Slider from "@radix-ui/react-slider";
import { AnimateNumber } from "motion-plus/react";
import { useMotionValue, useSpring, useVelocity } from "motion/react";

interface ImageGenCostSliderProps {
  value: number;
  onValueChange: (value: number) => void;
  min?: number;
  max?: number;
  costPerImage?: number;
}

export function ImageGenCostSlider({
  value: initialValue,
  min = 1,
  max = 10,
  costPerImage = 0.04
}: ImageGenCostSliderProps) {
  const [value, setValue] = useState([initialValue]);
  const scaled = useMotionValue(scale(value?.[0] ?? initialValue));

  const velocity = useVelocity(scaled);
  const rotate = useSpring(velocity);

  useEffect(() => {
    if (!value?.[0]) return;
    console.log(value);

    scaled.set(scale(value[0]));
  }, [value, scaled]);

  // const handleValueChange = (newValue: number[]) => {
  //   if (!newValue?.[0]) return;
  //   onValueChange(newValue[0]);
  // };

  return (
    <div className="space-y-2">
      <Slider.Root
        className="relative flex h-5 w-full touch-none items-center select-none"
        onValueChange={setValue}
        value={value}
        defaultValue={[1]}
        min={min}
        max={max}
        step={1}>
        <Slider.Track className="bg-muted-foreground relative h-0.75 grow rounded-full">
          <Slider.Range className="bg-primary absolute h-full rounded-full" />
        </Slider.Track>
        <Slider.Thumb
          className="bg-primary hover:bg-primary/90 focus:ring-primary focus:ring-offset-background block h-5 w-5 rounded-full focus:ring-2 focus:ring-offset-2 focus:outline-none"
          aria-label="Image count">
          <div className="absolute top-[calc(-100%-12px)] left-1/2 flex w-px -translate-x-1/2 items-center justify-center">
            <AnimateNumber
              transition={{ duration: 0.2, ease: "easeOut" }}
              locales="en-US"
              className="bg-background text-foreground block size-5 rounded px-2 py-1 text-sm font-medium focus:[box-shadow:0_0_0_2px_#9911ff] focus:outline-none"
              style={{ originX: 0.5, originY: 1.5, rotate: rotate.get() }}>
              {value as any}
            </AnimateNumber>
          </div>
        </Slider.Thumb>
      </Slider.Root>
      <div className="text-muted-foreground flex items-center justify-between text-sm">
        <span className="sr-only">Number of images</span>
        <AnimateNumber
          format={{
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
            currency: "USD",
            style: "currency"
          }}
          className={`font-mono font-[530] tracking-[-0.04em] tabular-nums [font-variation-settings:"opsz"_30,"wght"_530]`}
          locales="en-US"
          transition={{
            visualDuration: 0.6,
            type: "spring",
            bounce: 0.25,
            opacity: { duration: 0.2, ease: "linear" }
          }}>
          {value?.[0] ? value[0] * costPerImage : costPerImage}
        </AnimateNumber>
      </div>
    </div>
  );
}

function scale(value: number, scaleBy = -0.1) {
  return value * scaleBy;
}
