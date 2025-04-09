export interface ElevatorTransitionEventDetail {
  progress: number;
}

declare global {
  interface WindowEventMap {
    "elevator-transition": CustomEvent<ElevatorTransitionEventDetail>;
  }
}

export function dispatchElevatorTransition(
  progress: number,
  bubbles?: boolean,
  cancelable?: boolean,
  composed?: boolean
): void {
  const event = new CustomEvent<ElevatorTransitionEventDetail>(
    "elevator-transition",
    {
      detail: { progress },
      composed,
      bubbles,
      cancelable
    }
  );
  window.dispatchEvent(event);
}
