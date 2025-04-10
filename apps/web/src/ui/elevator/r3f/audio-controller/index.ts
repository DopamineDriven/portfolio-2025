// Audio controller for managing elevator sounds
export class AudioController {
  private audioElements = new Map<string, HTMLAudioElement>();
  private isPlaying = false;

  constructor() {
    // Pre-load all audio files
    this.loadAudio(
      "buttonSound",
      "https://raw.githubusercontent.com/DopamineDriven/portfolio-2025/master/apps/web/public/audio/elevator-button-sound.mp3"
    );
    this.loadAudio(
      "doorOpen",
      "https://raw.githubusercontent.com/DopamineDriven/portfolio-2025/master/apps/web/public/audio/elevator-door-open.mp3"
    );
    this.loadAudio(
      "elevatorShortest",
      "https://raw.githubusercontent.com/DopamineDriven/portfolio-2025/master/apps/web/public/audio/elevator-shortest.mp3"
    );
    this.loadAudio(
      "transition",
      "https://raw.githubusercontent.com/DopamineDriven/portfolio-2025/master/apps/web/public/audio/elevator-outie-to-innie-switch.mp3"
    );
  }

  private loadAudio(id: string, url: string): void {
    const audio = new Audio(url);
    audio.preload = "auto";
    audio.crossOrigin = "anonymous";
    audio.volume = 0.5;
    this.audioElements.set(id, audio);
  }

  public async playSequence(): Promise<void> {
    if (this.isPlaying) return;
    this.isPlaying = true;
    try {
      await this.playButtonSound();
      await this.playDoorOpenSound();
      await this.playElevatorSound();
      await this.playTransitionSound();
    } catch (err) {
      if (err instanceof Error) {
        throw new Error("error, " + err.message + `, name: ${err.name}`);
      }
    } finally {
      this.isPlaying = false;
    }
  }

  private playButtonSound(): Promise<void> {
    return this.playAudio("buttonSound");
  }

  private playDoorOpenSound(): Promise<void> {
    return this.playAudio("doorOpen");
  }

  private playElevatorSound(): Promise<void> {
    return this.playAudio("elevatorShortest");
  }

  private playTransitionSound(): Promise<void> {
    return this.playAudio("transition");
  }

  private playAudio(id: string): Promise<void> {
    return new Promise(resolve => {
      const audio = this.audioElements.get(id);
      if (!audio) {
        resolve();
        return;
      }

      // Reset audio to beginning
      audio.currentTime = 0;

      const onEnded = () => {
        audio.removeEventListener("ended", onEnded);
        resolve();
      };

      audio.addEventListener("ended", onEnded);
      audio.play().catch(() => {
        // Handle autoplay restrictions
        console.warn(
          `Couldn't play audio: ${id}. User interaction may be required.`
        );
        resolve();
      });
    });
  }

  public stopAll(): void {
    this.audioElements.forEach(audio => {
      audio.pause();
      audio.currentTime = 0;
    });
    this.isPlaying = false;
  }
}
