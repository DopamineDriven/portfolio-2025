const populatePath = <
  const B extends "development" | "master",
  const P extends string
>([branch, path]: readonly [B, P]) =>
  `https://raw.githubusercontent.com/DopamineDriven/portfolio-2025/${branch}/apps/web/public/audio/elevator-${path}.mp3` as const;

export const soundObj = {
  full: populatePath(["master", "full"]),
  "second-longest": populatePath(["master", "second-longest"]),
  "second-shortest": populatePath(["master", "second-shortest"]),
  shortest: populatePath(["master", "shortest"]),
  "outie-to-innie-switch": populatePath([
    "development",
    "outie-to-innie-switch"
  ]),
  "button-sound": populatePath(["development", "button-sound"]),
  "door-open": populatePath(["development", "door-open"])
} as const;

export type SoundKeys = keyof typeof soundObj;

export const playSound = <const T extends SoundKeys>(
  soundName: T,
  options?: { volume?: number; preload?: boolean }
) => {
  const audio = new Audio(soundObj[soundName]);

  // Set crossOrigin to "anonymous" for CORS support
  audio.crossOrigin = "anonymous";

  // Apply options if provided
  if (options) {
    if (options.volume !== undefined) {
      audio.volume = options.volume;
    }
    if (options.preload) {
      audio.preload = "auto";
    }
  }

  const handleAudioError = function (this: HTMLAudioElement, e: Event) {
    e.stopImmediatePropagation();
    let mediaErrorInfo = "No media error details available";

    if (this.error) {
      const errorCodes: Record<number, string> = {
        1: "MEDIA_ERR_ABORTED - The user aborted the download",
        2: "MEDIA_ERR_NETWORK - A network error occurred while downloading",
        3: "MEDIA_ERR_DECODE - The media cannot be decoded",
        4: "MEDIA_ERR_SRC_NOT_SUPPORTED - The media format is not supported"
      };

      mediaErrorInfo =
        errorCodes[this.error.code] ||
        `Unknown media error (code: ${this.error.code})`;

      if (this.error.message) {
        mediaErrorInfo += ` - ${this.error.message}`;
      }
    }

    console.error(
      `Audio error (${soundName}): \n` +
        ` - Media error: ${mediaErrorInfo}\n` +
        ` - Event type: ${e.type}`
    );
    return false;
  };

  audio.addEventListener("error", handleAudioError);

  return {
    play: () => {
      const playPromise = audio.play();
      if (playPromise !== undefined) {
        return playPromise.catch(error => {
          console.error(`Error playing ${soundName}:`, error);
        });
      }
      return Promise.resolve();
    },
    pause: () => {
      audio.pause();
      // Reset the audio to the beginning
      audio.currentTime = 0;
    },
    element: audio
  };
};
