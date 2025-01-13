export const playSound = <const T extends 'move-self' | `move-opponent` | 'capture' | 'check' | 'checkmate' | "promotion" | "game-start">(soundName: T) => {
  const audio = new Audio(`/sounds/${soundName}.mp3`);
  audio.play().catch(error => console.error('Error playing sound:', error));
};
