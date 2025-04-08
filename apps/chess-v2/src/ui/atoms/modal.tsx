"use client";

import { useEffect, useRef, useState } from "react";
import { X } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";

export default function Modal({ text }: { text: string }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 1.05 }}
        className="openButton"
        onClick={() => setIsOpen(true)}
        data-primary-action>
        {text}
      </motion.button>
      <AnimatePresence>
        {isOpen ? <Dialog close={() => setIsOpen(false)} /> : null}
      </AnimatePresence>
      <StyleSheet />
    </>
  );
}

function Dialog({ close }: { close: () => void }) {
  const ref = useRef<HTMLDialogElement | null>(null);

  /**
   * Use the dialog element's imperative API to open and close the dialog
   * when the component mounts and unmounts. This enables exit animations
   * and maintains the dialog's natural accessibility behaviour.
   */
  useEffect(() => {
    const dialogRef = ref.current;
    if (!dialogRef) return;
    dialogRef.showModal();

    return () => dialogRef.close();
  }, [ref]);

  useClickOutside(ref, close);

  return (
    <>
      <motion.div
        className="overlay"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}></motion.div>
      <motion.dialog
        initial={dialogInitialState}
        animate={dialogOpenState}
        exit={dialogInitialState}
        ref={ref}
        className="modal"
        open={false}
        /**
         * The onCancel event is triggered when the user
         * presses the Esc key. We prevent the default and
         * close the dialog via the provided callback that
         * first sets React state to false.
         *
         * AnimatePresence will take care of our exit animation
         * before actually closing the dialog.
         */
        onCancel={event => {
          event.preventDefault();
          close();
        }}
        /**
         * However, if the Esc key is pressed twice, the
         * close method will always fire, and it isn't cancellable.
         * So we listen for this and make sure the React
         * state is updated to false.
         */
        onClose={close}
        style={{ transformPerspective: 500 }}>
        <h2 className="title">Confirm</h2>
        <p>Are you sure you want to become a Motion expert?</p>
        <div className="controls">
          <button onClick={close} className="cancel">
            Cancel
          </button>
          <button onClick={close} className="save">
            Expert me
          </button>
        </div>
        <button className="closeButton" aria-label="Close" onClick={close}>
          <X className="close-icon" />
        </button>
      </motion.dialog>
    </>
  );
}

const dialogOpenState = {
  opacity: 1,
  filter: "blur(0px)",
  rotateX: 0,
  rotateY: 0,
  z: 0,
  transition: {
    delay: 0.2,
    duration: 0.5,
    ease: [0.17, 0.67, 0.51, 1],
    opacity: {
      delay: 0.2,
      duration: 0.5,
      ease: "easeOut"
    }
  }
};

const dialogInitialState = {
  opacity: 0,
  filter: "blur(10px)",
  z: -100,
  rotateY: 25,
  rotateX: 5,
  transformPerspective: 500,
  transition: {
    duration: 0.3,
    ease: [0.67, 0.17, 0.62, 0.64]
  }
};

/**
 * ==============   Utils   ================
 */

function useClickOutside(
  ref: React.RefObject<HTMLDialogElement | null>,
  close: VoidFunction
) {
  useEffect(() => {
    const handleClickOutside = (event: React.MouseEvent<Element>) => {
      if (ref.current && checkClickOutside(event, ref.current)) {
        close();
      }
    };

    document.addEventListener(
      "click",
      handleClickOutside as unknown as (this: Document, ev: MouseEvent) => any
    );

    return () => {
      document.removeEventListener(
        "click",
        handleClickOutside as unknown as (this: Document, ev: MouseEvent) => any
      );
    };
  }, [ref, close]);
}

function checkClickOutside(
  event: React.MouseEvent<Element>,
  element: HTMLDialogElement
) {
  const { top, left, width, height } = element.getBoundingClientRect();

  if (
    event.clientX < left ||
    event.clientX > left + width ||
    event.clientY < top ||
    event.clientY > top + height
  ) {
    return true;
  }
}

/**
 * ==============   Types   ================
 */
interface Dialog {
  isOpen: boolean;
  open: () => void;
  close: () => void;
  ref: React.RefObject<HTMLDialogElement | null>;
}

/**
 * ==============   Styles   ================
 */
function StyleSheet() {
  return (
    <style>{`
        .openButton, .controls button {
            background-color: var(--hue-1);
            color: var(--white);
            font-size: 16px;
            padding: 10px 20px;
            border-radius: 10px;
        }

        .controls {
            border-top: 1px solid var(--divider);
            padding-top: 20px;
            margin-top: 20px;
            display: flex;
            justify-content: flex-end;
            gap: 10px;
        }

        .controls button.cancel {
            background-color: var(--divider);
        }

        .modal {
            border-radius: 10px;
            border: 1px solid var(--border);
            background-color: var(--layer);
            position: relative;
            z-index: 10000000;
            padding: 20px;
            min-width: 300px;
        }

        .modal p {
            margin: 0;
        }

        .modal::backdrop {
            display: none;
        }

        .title {
            font-size: 24px;
            margin: 0 0 20px;
        }

        .closeButton {
            position: absolute;
            top: 20px;
            right: 20px;
            background: none;
            border: none;
            padding: 0;
            cursor: pointer;
        }

        .close-icon {
            width: 24px;
            height: 24px;
            stroke: var(--white);
            stroke-width: 2;
        }

        .close-icon circle {
            fill: none;
        }

        .overlay {
            background: rgba(0, 0, 0, 0.5);
            position: fixed;
            inset: 0;
            z-index: 9999999;
            backdrop-filter: blur(3px);
        }
    `}</style>
  );
}
