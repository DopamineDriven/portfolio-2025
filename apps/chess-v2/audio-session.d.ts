type SafariAudioSessionType =
  | "auto"
  | "playback"
  | "transient"
  | "transient-solo"
  | "ambient"
  | "play-and-record";

type SafariAudioSessionState =
  | "inactive"
  | "active"
  | "interrupted";

interface SafariAudioSessionEventMap {
  statechange: Event;
}

declare global {
  /**
   * Web Audio Session API
   *
   * Spec surface:
   * - type
   * - readonly state
   * - onstatechange
   *
   * Safari/WebKit shipped this behind partial support first, so this is a
   * pragmatic ambient declaration for app code.
   */
  interface AudioSession extends EventTarget {
    type: SafariAudioSessionType;
    readonly state: SafariAudioSessionState;
    onstatechange: ((this: AudioSession, ev: Event) => any) | null;

    addEventListener<K extends keyof SafariAudioSessionEventMap>(
      type: K,
      listener: (
        this: AudioSession,
        ev: SafariAudioSessionEventMap[K]
      ) => any,
      options?: boolean | AddEventListenerOptions
    ): void;

    addEventListener(
      type: string,
      listener: EventListenerOrEventListenerObject,
      options?: boolean | AddEventListenerOptions
    ): void;

    removeEventListener<K extends keyof SafariAudioSessionEventMap>(
      type: K,
      listener: (
        this: AudioSession,
        ev: SafariAudioSessionEventMap[K]
      ) => any,
      options?: boolean | EventListenerOptions
    ): void;

    removeEventListener(
      type: string,
      listener: EventListenerOrEventListenerObject,
      options?: boolean | EventListenerOptions
    ): void;
  }

  interface Navigator {
    readonly audioSession?: AudioSession;
  }
}

export {};
