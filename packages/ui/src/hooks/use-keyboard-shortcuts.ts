"use client";

import { useEffect } from "react";

export interface KeyboardShortcut {
  key: string;
  ctrlKey?: boolean;
  shiftKey?: boolean;
  metaKey?: boolean;
  altKey?: boolean;
  callback: () => void;
  description: string;
}

export function useKeyboardShortcuts(shortcuts: KeyboardShortcut[]) {
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      for (const shortcut of shortcuts) {
        const keyMatches =
          event.key.toLowerCase() === shortcut.key.toLowerCase();
        const ctrlMatches = !!shortcut.ctrlKey === event.ctrlKey;
        const shiftMatches = !!shortcut.shiftKey === event.shiftKey;
        const metaMatches = !!shortcut.metaKey === event.metaKey;
        const altMatches = !!shortcut.altKey === event.altKey;

        if (
          keyMatches &&
          ctrlMatches &&
          shiftMatches &&
          metaMatches &&
          altMatches
        ) {
          event.preventDefault();
          shortcut.callback();
          break;
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [shortcuts]);
}

export function formatShortcut(
  shortcut: KeyboardShortcut,
  isMac: boolean
) {
  const parts = Array.of<string>();

  if (shortcut.ctrlKey) parts.push(isMac ? "⌘" : "Ctrl");
  if (shortcut.shiftKey) parts.push("⇧");
  if (shortcut.altKey) parts.push(isMac ? "⌥" : "Alt");
  if (shortcut.metaKey && !isMac) parts.push("Meta");

  parts.push(shortcut.key.toUpperCase());

  return parts.join(isMac ? "" : " + ");
}
