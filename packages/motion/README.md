# @d0paminedriven/motion

### *A text-animation-based React library built on Motion.*

<p align="center">

[![npm](https://img.shields.io/npm/v/@d0paminedriven/motion?color=blue)](https://www.npmjs.com/package/@d0paminedriven/motion)
[![npm](https://img.shields.io/npm/dm/@d0paminedriven/motion)](https://www.npmjs.com/package/@d0paminedriven/motion)
  <a style="fill:black;" href="https://github.com/DopamineDriven/portfolio-2025/tree/master/packages/motion"><svg height="32" aria-hidden="true" viewBox="0 0 24 24" version="1.1" width="32" data-view-component="true" class="octicon octicon-mark-github"><path d="M12 1C5.9225 1 1 5.9225 1 12C1 16.8675 4.14875 20.9787 8.52125 22.4362C9.07125 22.5325 9.2775 22.2025 9.2775 21.9137C9.2775 21.6525 9.26375 20.7862 9.26375 19.865C6.5 20.3737 5.785 19.1912 5.565 18.5725C5.44125 18.2562 4.905 17.28 4.4375 17.0187C4.0525 16.8125 3.5025 16.3037 4.42375 16.29C5.29 16.2762 5.90875 17.0875 6.115 17.4175C7.105 19.0812 8.68625 18.6137 9.31875 18.325C9.415 17.61 9.70375 17.1287 10.02 16.8537C7.5725 16.5787 5.015 15.63 5.015 11.4225C5.015 10.2262 5.44125 9.23625 6.1425 8.46625C6.0325 8.19125 5.6475 7.06375 6.2525 5.55125C6.2525 5.55125 7.17375 5.2625 9.2775 6.67875C10.1575 6.43125 11.0925 6.3075 12.0275 6.3075C12.9625 6.3075 13.8975 6.43125 14.7775 6.67875C16.8813 5.24875 17.8025 5.55125 17.8025 5.55125C18.4075 7.06375 18.0225 8.19125 17.9125 8.46625C18.6138 9.23625 19.04 10.2125 19.04 11.4225C19.04 15.6437 16.4688 16.5787 14.0213 16.8537C14.42 17.1975 14.7638 17.8575 14.7638 18.8887C14.7638 20.36 14.75 21.5425 14.75 21.9137C14.75 22.2025 14.9563 22.5462 15.5063 22.4362C19.8513 20.9787 23 16.8537 23 12C23 5.9225 18.0775 1 12 1Z"></path>
</svg></a>
</p>


---

## 📦 Installation

This library uses **peer** dependencies, so you’ll need to install Motion and React yourself:

```bash
npm install @d0paminedriven/motion \
  motion motion-dom motion-utils motion-plus \
  react react-dom
```

```bash
yarn add @d0paminedriven/motion \
  motion motion-dom motion-utils motion-plus \
  react react-dom
```

```bash
pnpm add @d0paminedriven/motion \
  motion motion-dom motion-utils motion-plus \
  react react-dom
```

---

## 🛠️ GentleText

Soft, subtle text animations with two mutually-exclusive modes:

* **Stagger** — per-character/word/line stagger timing
* **Delay** — explicit delay before each element

TypeScript enforces that you supply **exactly one** of these options.

### Basic usage

```tsx
"use client";

import { GentleText } from '@d0paminedriven/motion'

export default function Demo() {
  return (
    <GentleText
      content="Hello, world!"

      // ─── STAGGER MODE ───────────────────
      withStagger={{
        duration:   0.05,    // seconds between each char
        from:       'first', // 'first' | 'last' | 'center' | index
        startDelay: 0.1,     // initial delay
        ease:       'easeOut',
      }}

      // ─── or ──────────────────────────────────

      // ─── DELAY MODE ────────────────────────
      animationOptions={{
        delay: (i, total) => i * 0.04, // can be of type `number | ((i: number, total: number) => number)`
        duration: 1.2,
        ease:     'easeInOut',
      }}

      // ─── common props ──────────────────────
      as="h1"
      debug
      duration={1.5}
      yOffset={8}
      initialScale={0.95}
      blurAmount={3}
      autoPlay
      allowOverflow
      animateTarget="chars"       // 'chars' | 'words' | 'lines'
      animateOnlyInView
      inViewThreshold={0.5}
      inViewMargin="0px"
      keyframes={{                // custom keyframes example
        opacity: [0, 1],
        y: [-10, 10],
        scale: [0.5, 1],
        rotate: [-10, 0],
        color: ["#83e6f7", "#ffffff"]
      }}
      animationOptions={{
        delay: 0,
        repeat: Number.POSITIVE_INFINITY,
        repeatType: "mirror",
        repeatDelay: 2
      }}
    />
  )
}
```

### Props

| Prop                  | Type                               | Default   | Description                                                         |
| --------------------- | ---------------------------------- | --------- | ------------------------------------------------------------------- |
| `content`             | `string`                           | —         | Text to animate                                                     |
| `as`                  | `TextElementTagUnion`              | `"p"`     | HTML tag for the text element                                       |
| `duration`            | `number`                           | `1`       | Global animation duration (seconds)                                 |
| `withStagger`         | `StaggerConfig`                    | *xor*     | Stagger mode config (see above)                                     |
| `animationOptions`    | `BaseAnimationOptions & { delay }` | *xor*     | Explicit delay mode (see above)                                     |
| `animateTarget`       | `"chars" \| "words" \| "lines"`    | `"chars"` | Split target (characters, words or lines)                           |
| `keyframes`           | `DOMKeyframesDefinition`           | —         | Override default motion keyframes (opacity, transform, color, etc.) |
| `yOffset`             | `number`                           | `10`      | Initial vertical offset (px)                                        |
| `initialScale`        | `number`                           | `0.9`     | Initial scale                                                       |
| `blurAmount`          | `number`                           | `4`       | Initial blur (px)                                                   |
| `autoPlay`            | `boolean`                          | `true`    | Play on mount                                                       |
| `animateOnlyInView`   | `boolean`                          | `false`   | Wait until in-view                                                  |
| `inViewThreshold`     | `number`                           | `0.5`     | Percent in-view to trigger (0–1)                                    |
| `inViewMargin`        | `string`                           | `"0px"`   | Margin around element for in-view detection                         |
| `debug`               | `boolean`                          | `false`   | Show debug UI                                                       |
| `allowOverflow`       | `boolean`                          | `false`   | Let characters overflow container                                   |
| `onAnimationStart`    | `() => void`                       | —         | Callback at animation start                                         |
| `onAnimationComplete` | `() => void`                       | —         | Callback at animation end                                           |

<details>
  <summary>🔍 Allowed HTML tags (<code>TextElementTagUnion</code>)</summary>

```
"a", "h1", "h2", "h3", "h4", "h5", "h6",
"p", "span", "div", "pre", "cite", "address",
"aside", "blockquote", "button", "caption",
"figcaption", "code", "article", "header",
"mark", "sup", "label", "title", "small",
"sub", "details", "ins", "del", "figure",
"li", "ol", "ul", "i", "kbd", "summary"
```

</details>

### 🔑 Custom Keyframes

The `keyframes` prop accepts any valid `DOMKeyframesDefinition`, letting you override the default motion keyframes. Common uses include chaining opacity, translating, scaling, rotating, and color transitions.

```ts
keyframes: {
  opacity: [0, 1],
  y:       [-10, 10],
  scale:   [0.5, 1],
  rotate:  [-10, 0],
  color:   ["#83e6f7", "#ffffff"]
}
```

### ⚙️ Animation Generator Types

You can customize the `type` of animation under `animationOptions`. Supported values:

```ts
// imported from motion-dom

/**
 * A factory function or one of the built-in generator types:
 */
type AnimationGeneratorType =
  | GeneratorFactory      // custom generator
  | "decay"
  | "spring"
  | "keyframes"
  | "tween"
  | "inertia";
```

* **spring**: Physics-based spring animation. Ignores `duration` and adds options:

  * `stiffness` (number)
  * `damping` (number)
  * `mass`    (number)

* **decay**: Natural decay motion. Ignores `duration`, uses:

  * `power`        (number)
  * `timeConstant` (number)
  * `velocity`     (number)

* **tween**, **keyframes**, **inertia**: Standard easing or inertia-based animations. `duration` applies as usual.

---

## 🔗 Links

* **npm**: [@d0paminedriven/motion](https://www.npmjs.com/package/@d0paminedriven/motion)
* **Source**: [https://github.com/DopamineDriven/portfolio-2025/tree/master/packages/motion](https://github.com/DopamineDriven/portfolio-2025/tree/master/packages/motion)

---

## ⚖️ License

MIT © [Andrew Ross](https://github.com/DopamineDriven)
