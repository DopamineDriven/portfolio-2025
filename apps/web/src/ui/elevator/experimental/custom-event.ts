// // Define the structure of the event detail
// export interface ElevatorTransitionEventDetail {
//   progress: number
// }

// // Define the custom event type
// export class ElevatorTransitionEvent extends CustomEvent<ElevatorTransitionEventDetail> {
//   constructor(detail: ElevatorTransitionEventDetail) {
//     super("elevator-transition", { detail })
//   }
// }

// // Extend the global WindowEventMap interface to include our custom event
// declare global {
//   interface WindowEventMap {
//     "elevator-transition": ElevatorTransitionEvent
//   }
// }

// // Helper function to dispatch the event
// export function dispatchElevatorTransition(progress: number): void {
//   const event = new ElevatorTransitionEvent({ progress })
//   window.dispatchEvent(event)
// }
// Define the structure of the event detail
// Define the structure of the event detail
export interface ElevatorTransitionEventDetail {
  progress: number
}

// We don't need to create a custom event class, we can just use the interface
// to type our CustomEvent instances

// Extend the global WindowEventMap interface to include our custom event type
declare global {
  interface WindowEventMap {
    "elevator-transition": CustomEvent<ElevatorTransitionEventDetail>
  }
}

// Helper function to dispatch the event
export function dispatchElevatorTransition(progress: number): void {
  const event = new CustomEvent<ElevatorTransitionEventDetail>("elevator-transition", {
    detail: { progress },
  })
  window.dispatchEvent(event)
}
