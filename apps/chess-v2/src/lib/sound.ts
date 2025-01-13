const prependPath = <const T extends string>(path: T) =>
  `https://raw.githubusercontent.com/DopamineDriven/portfolio-2025/master/apps/chess-v2/public/audio/${path}.mp3` as const;
export const soundObj = {
  capture: prependPath(`capture`),
  castle: prependPath(`castle`),
  "game-end": prependPath(`game-end`),
  "game-start": prependPath(`game-start`),
  "move-check": prependPath(`move-check`),
  "move-opponent": prependPath(`move-opponent`),
  "move-self": prependPath(`move-self`),
  promote: prependPath(`promote`)
} as const;

export type SoundKeys = keyof typeof soundObj;

export const playSound = <const T extends SoundKeys>(
  soundName: T
) => {
  const audio = new Audio(soundObj[soundName]);
  audio.play().catch(error => console.error("Error playing sound:", error));
};
