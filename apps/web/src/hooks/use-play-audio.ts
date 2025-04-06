"use client";

import { useCallback, useEffect, useRef } from "react";
import type { SoundKeys } from "@/lib/sound";
import { playSound } from "@/lib/sound";

export function usePlayAudio() {
  const audioRefs = useRef(new Map<SoundKeys, ReturnType<typeof playSound>>());

  const playSoundEffect = useCallback(
    (key: SoundKeys, options?: { volume?: number; preload?: boolean }) => {
      if (!audioRefs) return;
      if (audioRefs.current.has(key)) {
        const prevSound = audioRefs.current.get(key);
        if (!prevSound) return;
        prevSound.pause();
        audioRefs.current.delete(key);
      }

      const sound = playSound(key, options);
      audioRefs.current.set(key, sound);

      sound.element.addEventListener(
        "ended",
        () => {
          if (audioRefs.current.get(key) === sound) {
            audioRefs.current.delete(key);
          }
        },
        { once: true }
      );

      return sound.play();
    },
    []
  );

  const preloadSound = useCallback(
    (key: SoundKeys, options?: { volume?: number }) => {
      if (audioRefs.current.has(key)) {
        const getKey = audioRefs.current.get(key);
        if (!getKey) {
          throw new Error(`Audio Key ${key} Does Not exist`);
        }
        return getKey.element;
      }
      const sound = playSound(key, { ...options, preload: true });
      audioRefs.current.set(key, sound);
      return sound.element;
    },
    []
  );

  const getSound = useCallback((key: SoundKeys) => {
    return audioRefs.current.get(key);
  }, []);

  const getSoundDuration = useCallback(
    (key: SoundKeys) => {
      if (!audioRefs) return 0;
      if (audioRefs.current.has(key)) {
        const getSound = audioRefs.current.get(key);
        if (!getSound) return 0;
        const sound = getSound;
        return sound.element.duration;
      }
      preloadSound(key);
      return 0;
    },
    [preloadSound]
  );

  
  useEffect(() => {
    const currentAudioRefs = audioRefs.current;
    return () => {
      currentAudioRefs.forEach(sound => {
        sound.pause();
      });
      currentAudioRefs.clear();
    };
  }, []);

  return {
    playSoundEffect,
    preloadSound,
    getSound,
    getSoundDuration
  };
}
