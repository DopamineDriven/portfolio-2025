### Portfolio 2025

Thanks for the extra detail — I’ll look into how best to integrate `eslint-import-resolver-typescript` into your ESM-only monorepo setup using `@/*` path aliases, and analyze whether swapping to `eslint-plugin-import-x` will improve linting accuracy or performance. I’ll also provide refinements to optimize ESLint speed and dev experience for large TypeScript monorepos using flat config.

I’ll get back to you shortly with concrete recommendations and updated file contents.

# Optimizing ESLint for a TypeScript Monorepo (Path Aliases, Plugins, and Performance)

## 1. Integrating the TypeScript Import Resolver (`eslint-import-resolver-typescript`)

To ensure ESLint correctly resolves your TypeScript path aliases (like `@/...`) and `.ts` file imports, you should add **`eslint-import-resolver-typescript`** to your shared config. This resolver allows ESLint’s import rules to understand TypeScript files and path mappings defined in your `tsconfig.json` ([eslint-import-resolver-typescript - npm](https://www.npmjs.com/package/eslint-import-resolver-typescript#:~:text=,package.json)). In practice, this means ESLint will no longer complain about imports like `import { X } from "@/foo.ts"` – it will recognize the `@` alias and the `.ts` extension as valid ([eslint-import-resolver-typescript - npm](https://www.npmjs.com/package/eslint-import-resolver-typescript#:~:text=,package.json)).

**Steps to integrate:**

- **Install the resolver** in your ESLint config package (and in any repo that runs ESLint, if the config is not bundling it). For example, with npm or pnpm:  

  ```bash
  pnpm i -D eslint-import-resolver-typescript
  ```  

  Ensure `eslint-plugin-import` is also up to date. (If you were setting up from scratch, the plugin and resolver are typically installed together ([eslint-import-resolver-typescript - npm](https://www.npmjs.com/package/eslint-import-resolver-typescript#:~:text=%60eslint)).)

- **Update your flat ESLint config** to use the resolver. In ESLint’s flat config, you add a `settings` field with the resolver configuration. For example, in your `eslint.config.js` (or `.mjs`):

  ```js
  import tsPlugin from "typescript-eslint";
  import importPlugin from "eslint-plugin-import";
  // ^ import the plugins (assuming ESM). Ensure these are in your package deps.

  export default [
    {
      files: ["**/*.ts", "**/*.tsx"],  // lint TypeScript files
      ignores: [
        "**/node_modules/**",
        "**/dist/**",
        "**/build/**"               // ignore generated files to speed up linting
      ],
      languageOptions: {
        parser: tsPlugin.parser,    // @typescript-eslint parser
        parserOptions: {
          ecmaVersion: "latest",
          sourceType: "module",
          // Point to all tsconfig files in the repo (monorepo support):
          project: [
            "./tsconfig.json",              // root tsconfig (if it exists)
            "./packages/*/tsconfig.json",   // tsconfigs in packages
            "./apps/*/tsconfig.json"        // tsconfigs in apps (if you have an `apps/` dir)
          ],
          tsconfigRootDir: process.cwd()    // root of the project (monorepo root)
        }
      },
      plugins: {
        // Flat config: include plugin objects
        "@typescript-eslint": tsPlugin,
        "import": importPlugin,
        // ...other plugins...
      },
      /** 👉 Integrate TypeScript resolver for eslint-plugin-import: */
      settings: {
        "import/resolver": {
          // Use TypeScript resolver so import plugin knows about .ts and paths:
          typescript: {
            alwaysTryTypes: true,  // always prefer @types packages if they exist
            project: [
              "./packages/*/tsconfig.json",
              "./apps/*/tsconfig.json"
            ]
            // (You can add `bun: true` here if you use Bun, but it's optional)
          }
        }
      },
      rules: {
        // Example: allow .ts extensions in imports (no error for using .ts in path)
        "import/extensions": ["error", "ignorePackages", {
          ts: "always",
          tsx: "always",
          js: "never",
          jsx: "never"
        }],
        // ...your other rules (typescript-eslint rules, import rules, etc.)...
      }
    }
  ];
  ```  

  In the **`settings.import/resolver.typescript`** section above, we configure the resolver: 
  - `project` is set to an array of tsconfig paths. This should include all the tsconfig files for your packages/apps. Glob patterns are supported (note the use of `packages/*/tsconfig.json`). It’s important to avoid overly broad globs like `**/tsconfig.json` because those can degrade performance – a single `*` per folder level is preferabl ([Monorepo Configuration | typescript-eslint](https://typescript-eslint.io/troubleshooting/typed-linting/monorepos#:~:text=Wide%20globs%20in%20))】. The example uses separate patterns for `packages` and `apps` directories; adjust these to match your repository structure. This ensures the resolver knows about each package’s path aliases and types.
  - `alwaysTryTypes: true` tells the resolver to also check `@types` packages if needed (helpful for packages that have their types in DefinitelyTyped).
  - We did **not** set `extensions` here because the TypeScript resolver by default knows about `.ts/.tsx` file ([eslint-import-resolver-typescript - npm](https://www.npmjs.com/package/eslint-import-resolver-typescript#:~:text=,package.json))】. With this config, imports of `.ts` files or files using your `paths` aliases will be recognized and the `import/no-unresolved` rule (from eslint-plugin-import) will stop flagging those as errors.

- **Verify `.ts` extension handling:** By default, the import plugin might expect certain extensions. In ESM, including the file extension in imports is often required. In the example config, we added an `import/extensions` rule configuration to allow `.ts` in imports. This rule is optional, but if you had it enabled, you likely want to configure it to **allow or require `.ts`** for TypeScript files to match your project style. For instance, the sample above sets `"ts": "always"` meaning it should always include the `.ts` extension for TypeScript imports. Adjust this to your preference (or disable the rule if you don’t need it). The key is that ESLint should not complain about the presence or absence of `.ts` in your import statements once configured.

After these changes, ESLint will use the TypeScript resolver. This means when you do `import { X } from "@/foo.ts"`, the resolver will read your tsconfig paths to find what `@/foo.ts` refers to, and it will treat `.ts` files as first-class modules for import rule ([eslint-import-resolver-typescript - npm](https://www.npmjs.com/package/eslint-import-resolver-typescript#:~:text=,package.json))】. In summary, **any path aliases defined in tsconfig and any `.ts/.tsx` modules will be properly resolved** by ESLint, eliminating false “unable to resolve path” error ([eslint-import-resolver-typescript - npm](https://www.npmjs.com/package/eslint-import-resolver-typescript#:~:text=,package.json))】.

> **Note:** Make sure all your source files that need linting are included in one of the tsconfig files listed under `project`. If a file isn’t included in a tsconfig, the TypeScript ESLint parser might try to create an implicit project for it, which is slow. It’s often helpful to create a special `tsconfig.eslint.json` that **includes all** TypeScript files across your monorepo (or ensure each package’s tsconfig includes its test files, etc. ([Monorepo Configuration | typescript-eslint](https://typescript-eslint.io/troubleshooting/typed-linting/monorepos#:~:text=If%20you%20only%20have%20one,eslint%20without%20further%20configuration)) ([Monorepo Configuration | typescript-eslint](https://typescript-eslint.io/troubleshooting/typed-linting/monorepos#:~:text=project%3A%20true%2C%20project%3A%20%5B%27.%2Ftsconfig.eslint.json%27%2C%20%27.%2Fpackages%2F,))】. Pointing the resolver (and parser) at that ensures no file is missed. This can improve accuracy and performance for type-aware rules.

## 2. Switching to `eslint-plugin-import-x`: Pros, Cons, and Compatibility

**`eslint-plugin-import-x`** is a fork of the standard eslint-plugin-import, designed to be faster and more lightweigh ([eslint-plugin-import-x/CHANGELOG.md at master · un-ts/eslint-plugin-import-x · GitHub](https://github.com/un-ts/eslint-plugin-import-x/blob/master/CHANGELOG.md#:~:text=%2A%20,version%20of%20the%20original%20plugin))】. It is mostly a drop-in replacement, but there are some differences. Here’s an evaluation of switching to **import-x** in your context:

**✅ Pros (Benefits of eslint-plugin-import-x):**

- **Improved Performance:** The primary goal of import-x is to significantly speed up linting of imports in large codebase ([eslint-plugin-import-x/CHANGELOG.md at master · un-ts/eslint-plugin-import-x · GitHub](https://github.com/un-ts/eslint-plugin-import-x/blob/master/CHANGELOG.md#:~:text=%2A%20,version%20of%20the%20original%20plugin))】. The maintainers have made various performance optimizations (e.g. refactoring the internal module export map and speeding up cyclical dependency checks) to make rules run faste ([eslint-plugin-import-x/CHANGELOG.md at master · un-ts/eslint-plugin-import-x · GitHub](https://github.com/un-ts/eslint-plugin-import-x/blob/master/CHANGELOG.md#:~:text=%2A%20,util))】. Many rules in import-x are optimized compared to the original. For example, the `no-cycle` rule and others that traverse module graphs have been refactored for efficienc ([eslint-plugin-import-x/CHANGELOG.md at master · un-ts/eslint-plugin-import-x · GitHub](https://github.com/un-ts/eslint-plugin-import-x/blob/master/CHANGELOG.md#:~:text=%2A%20,util))】. In a big monorepo, these improvements can reduce ESLint runtime, especially on rules that previously took a lot of time.

- **Better ESM and modern support:** Import-x has kept up with modern module resolution features. It supports the same core functionality as eslint-plugin-import (static analysis of ES6 imports/exports), but with up-to-date enhancements. For instance, it fully supports parsing newer syntax and offers better integration with the ESLint flat config and ESM environment. One convenience with import-x (v4.5.0 and above) is that in a flat config you can programmatically create the resolver settings. This means you can `import { createTypeScriptImportResolver } from 'eslint-import-resolver-typescript'` and use it directly in your config (via the new `import-x/resolver-next` setting ([eslint-import-resolver-typescript - npm](https://www.npmjs.com/package/eslint-import-resolver-typescript#:~:text=%2F%2F%20eslint,typescript))】. In other words, **import-x can directly accept the resolver as an import** (no magic string in settings), which is nicer in pure ESM configs. The original plugin (import-js) doesn’t support that yet, and requires the settings to be a plain JSON objec ([eslint-import-resolver-typescript - npm](https://www.npmjs.com/package/eslint-import-resolver-typescript#:~:text=But%20if%20you%20are%20using,x%60%2C%20you%20can%27t%20use%20require%2Fimport))】. This improved integration can simplify your config if you switch.

- **Active Development:** The fork is actively maintained by the community (with involvement from TypeScript ESLint team members, as noted in the typescript-eslint v8 announcement) and tends to respond faster to TypeScript-centric issues. It has collaboration with the TypeScript-ESLint team for compatibility with new ESLint v9/flat config features, etc. (import-x was an early adopter of flat config support). This means going forward, import-x is likely to stay in sync with ESLint and TypeScript advancements. For example, import-x provides configuration points for caching and resolver customization that can be tweaked for performance or environment (Node, Bun, etc.), giving you more flexibility than the older plugin.

- **Similar Rule Set:** Import-x implements essentially the same rules as eslint-plugin-import, so you wouldn’t be losing functionality. All the familiar rules (`import/no-unresolved`, `import/named`, `import/order`, etc.) exist in import-x (often under the same name or with minor naming differences). The default rule configurations (like “recommended”) are equivalent, so behavior should be nearly identical. In some cases, import-x has fixed edge-case bugs from the original, so you might actually see *fewer* false positives/negatives in certain import edge cases.

**⚠️ Cons (Potential drawbacks or considerations):**

- **Migration Effort and Naming Changes:** Swapping the plugin requires some updates to your config files. The plugin name will change from `"import"` to `"import-x"` in your flat config. For example, you’ll import it as:  
  ```js
  import importX from "eslint-plugin-import-x";
  ```  
  and include it in `plugins` as `"import-x": importX`. All the rule identifiers would then use the `import-x/` prefix instead of `import/`. (If you keep the prefix `import/` in your rule names, ESLint will try to find those rules in a plugin named "import", which would be missing, leading to “rule not found” errors. So you’ll want to update rules to the new prefix or use the plugin’s recommended config.) This is mostly a search-and-replace task, but it’s something to be aware of. For example, `"import/no-unresolved": "error"` becomes `"import-x/no-unresolved": "error"`, and so on.

- **Compatibility with Existing Config:** Aside from rule name changes, most of your configuration can remain the same. The settings section for the resolver needs to use import-x’s key. Import-x supports two forms of resolver config:
  - **Legacy mode:** Using `"import-x/resolver"` (which works similar to the original `"import/resolver"` setting).
  - **New mode:** Using `"import-x/resolver-next"` with the `createTypeScriptImportResolver` function (this is available since import-x v4.5). Since you are using a flat config and ESM, you can take advantage of `resolver-next`. For example:  
    ```js
    import importX from "eslint-plugin-import-x";
    import { createTypeScriptImportResolver } from "eslint-import-resolver-typescript";

    export default [
      {
        // ... languageOptions, etc ...
        plugins: {
          "import-x": importX,
          // other plugins...
        },
        settings: {
          "import-x/resolver-next": [
            createTypeScriptImportResolver({
              alwaysTryTypes: true,
              project: ["./packages/*/tsconfig.json", "./apps/*/tsconfig.json"]
            })
          ]
        },
        rules: {
          "import-x/no-unresolved": "error",
          "import-x/named": "error",
          // ... (you can keep your rule settings the same, just with the new prefix)
        }
      }
    ];
    ```  
    This shows how your config would change if switching. The rest of your TypeScript-ESLint setup stays unchanged. Note that import-x uses its own namespace for settings and rules. This **one-time refactor** of the config is a minor overhead.

- **Stability and Community Adoption:** While import-x is gaining popularity (and even the official resolver docs mention it as an option for spee ([eslint-import-resolver-typescript - npm](https://www.npmjs.com/package/eslint-import-resolver-typescript#:~:text=This%20is%20a%20resolver%20for,x%20for%20faster%20speed))】), it’s still a fork. The original eslint-plugin-import is very mature and widely used; import-x is newer. In practice, many projects (especially those using flat config or seeking performance gains) have switched to import-x without issues, but you may want to test it in your monorepo to ensure there are no unexpected lint rule differences. The core logic is the same, but subtle behaviors could differ. For example, import-x might have changed default settings for some rules or disabled very slow rules by default. Be prepared to compare a lint run before/after switch to confirm nothing critical is flagged or missed.

- **Ongoing Updates:** Because import-x is actively evolving, you might see more frequent releases (which can be a pro for fixes, but also means you should keep an eye on changelogs). For instance, future major versions plan to rename some rules (like splitting `no-cycle` into new versions) and deprecate legacy settings as ESLint’s old config format is phased ou ([eslint-plugin-import-x/CHANGELOG.md at master · un-ts/eslint-plugin-import-x · GitHub](https://github.com/un-ts/eslint-plugin-import-x/blob/master/CHANGELOG.md#:~:text=In%20the%20next%20major%20version,legacy)) ([eslint-plugin-import-x/CHANGELOG.md at master · un-ts/eslint-plugin-import-x · GitHub](https://github.com/un-ts/eslint-plugin-import-x/blob/master/CHANGELOG.md#:~:text=A%20new%20%60no,in%20the%20next%20major%20version))】. This isn’t a deal-breaker, but it means you’ll need to occasionally update your config as you upgrade the plugin. With the original plugin, changes are slower and more incremental.

**Performance Comparison:** In many cases, teams have reported a noticeable drop in ESLint runtime after moving to import-x, especially in large projects. The import-x changelog notes general speed improvements (e.g., making the overall import processing faster by refactoring how module exports are tracke ([eslint-plugin-import-x/CHANGELOG.md at master · un-ts/eslint-plugin-import-x · GitHub](https://github.com/un-ts/eslint-plugin-import-x/blob/master/CHANGELOG.md#:~:text=%2A%20,util))】). That said, the actual gain depends on which rules you use. Some of the most expensive rules in eslint-plugin-import (like `import/no-cycle`, `import/namespace`, `import/no-unused-modules`) are still heavy in import-x, though often somewhat optimized. If your current bottleneck is import resolution and module traversal, import-x should help. If you’re only using a few simple rules from eslint-plugin-import, the difference might be marginal. Given that you’re already experiencing slow linting, it’s likely import-x will provide some relief.

**ESM Support:** Both plugins support ESM, but import-x is itself published as an ESM-compatible package and is built with modern ESM usage in mind. It handles Node’s `"exports"` field resolution better (especially when paired with the TypeScript resolver) and has experimental support for alternative resolvers like a new Rust-based resolver (`eslint-import-resolver-oxc`). In contrast, the original plugin relies on Node’s resolution or the installed resolver and had known issues with package exports that the TypeScript resolver had to solv ([add `eslint-import-resolver-typescript` as a dependency · Issue #150 · un-ts/eslint-plugin-import-x · GitHub](https://github.com/un-ts/eslint-plugin-import-x/issues/150#:~:text=%3E%20I%20think%20eslint,resolved%20in%20the%20typescript%20resolver))】. By using import-x + the TS resolver, you’re effectively on the most up-to-date path for ESLint module resolution.

**🟢 Recommendation:** If performance is a top concern and you’re willing to do a bit of config tweaking, switching to **eslint-plugin-import-x** is worth considering. It should be mostly compatible with your existing rules and will integrate well with your ESM flat config setup. Just plan the migration: update the dependency, change plugin name in config, change rule prefixes, and adjust the settings as shown above. Keep the TypeScript resolver in place (as demonstrated) – the import-x plugin will use it in the same way (or even more seamlessly if using the `resolver-next` API as in the snippet). Make sure to run your lint suite after switching to catch any differences. Overall, you can expect equal or better accuracy (no lost functionality) and improved speed with import-x. The original plugin remains perfectly fine if you prefer stability, but many large ESM+TypeScript projects have gravitated to import-x for its performance wi ([eslint-plugin-import-x/CHANGELOG.md at master · un-ts/eslint-plugin-import-x · GitHub](https://github.com/un-ts/eslint-plugin-import-x/blob/master/CHANGELOG.md#:~:text=%2A%20,version%20of%20the%20original%20plugin))4】.

## 3. Improving ESLint Performance in a Large Monorepo

Beyond plugin choices, there are several strategies to speed up ESLint in a growing monorepo and improve the developer experience. You’re already on ESLint 9 (flat config) and using modern tools, which is great. Here are some recommendations to refine your config and workflow for better performance:

- **Limit Linting to Necessary Files:** Configure ESLint to ignore or exclude files that don’t need linting. This reduces the work ESLint does. In the flat config, we can use the `files` and `ignores` fields (as shown in the config snippet above). You should ensure `node_modules` and build output directories (`dist`, `build`, etc.) are ignored. For example, in the config we added:  
  ```js
  ignores: ["**/node_modules/**", "**/dist/**", "**/build/**"]
  ```  
  This prevents ESLint from traversing those folders at all. Additionally, set `files: ["**/*.ts", "**/*.tsx"]` (and any other extensions you care about) so that ESLint only evaluates TypeScript files (if you have no plain JS files to lint). By being specific, you avoid ESLint trying to parse other file types. **Tip:** Also ignore large generated files (if any) or test fixture files, etc., that you don’t need to lint.

- **Optimize TypeScript Project Setup for ESLint:** As mentioned, include all linted files in your tsconfig(s). Missing file inclusions can trigger the TypeScript parser to fallback to a slower one-file-at-a-time mode. Consider creating a **central tsconfig for linting** that extends your base config and includes every `.ts(x)` file in the monorepo (sources, tests, etc ([Monorepo Configuration | typescript-eslint](https://typescript-eslint.io/troubleshooting/typed-linting/monorepos#:~:text=If%20you%20only%20have%20one,eslint%20without%20further%20configuration))7】. Reference this in `parserOptions.project`. This way, TypeScript can create a single Program for your entire workspace (or one per package) and reuse it, rather than spinning up a new type-checking instance for files it doesn’t know about. Also, set compilerOptions like `"skipLibCheck": true` in your tsconfig – this avoids type-checking library `.d.ts` files, which ESLint doesn’t need to repeatedly validate. Ensuring `"noEmit": true` in the tsconfig used by ESLint is wise as well, to avoid any compile output attemp ([Monorepo Configuration | typescript-eslint](https://typescript-eslint.io/troubleshooting/typed-linting/monorepos#:~:text=,paths%20you%20intend%20to%20lint))6】. If your monorepo is very large, you might use multiple tsconfigs (one per package) as we’ve done. The TypeScript ESLint parser will pick the appropriate tsconfig for each file based on the glob patterns. Just remember: **avoid using a wildcard like `**` in those globs**, because it makes ESLint scan a lot of directories and can slow down config matching. Use patterns like `packages/*/tsconfig.json` instead of `**/tsconfig.jso ([Monorepo Configuration | typescript-eslint](https://typescript-eslint.io/troubleshooting/typed-linting/monorepos#:~:text=Wide%20globs%20in%20))7】.

- **Adjust or Disable Very Expensive Rules:** Some ESLint rules are known to be performance hogs. It’s important to identify these in your config and consider if they’re worth the cost. In the context of module linting:
  - **`import/no-cycle`:** Detecting circular dependencies can be expensive in a large project because it may traverse many files. If your project isn’t at risk of a lot of circular deps (or you can rely on runtime/TypeScript to catch issues), you might disable this rule or use the newer `import/no-cycle` from import-x which has some improvements. If you keep it, consider setting a max depth if the rule supports it.
  - **`import/namespace`:** This rule checks namespace imports (`import * as X from 'module'`) for correctness. It’s reported to be particularly sl ([`import/namespace` is very slow · Issue #2340 · import-js/eslint-plugin-import · GitHub](https://github.com/import-js/eslint-plugin-import/issues/2340#:~:text=,import%232340))9】 because it ends up parsing every imported file to verify named exports. Projects have found that disabling `import/namespace` yields a big performance gain with minimal downsi ([`import/namespace` is very slow · Issue #2340 · import-js/eslint-plugin-import · GitHub](https://github.com/import-js/eslint-plugin-import/issues/2340#:~:text=,import%232340))9】 (especially if you’re already using TypeScript, which will error on invalid imports anyway). You might safely turn this one off.
  - **`import/no-unused-modules`:** If you ever enabled this, note that it scans the entire project for unused exports — very slow on a monorepo. Many choose not to use this rule in large projects.
  - **Type-aware rules:** Any rules from `@typescript-eslint` that require type information (those in the “recommended-type-checked” set) will add to lint time because they query the TypeScript type checker. While these are extremely useful, you might scope them to certain folders (for example, maybe you don’t need heavy type linting on test files or demo code). You could have separate config blocks for different glob patterns – e.g., enable the type-aware rules only in `src/**` but not in `tests/**` if that makes sense for you. This can cut down work without losing important checks where they matter.
  
  In summary, do an audit of your rules and weigh the benefit vs cost. Disabling a few of the worst offenders can easily knock seconds off the lint time. (ESLint’s own timing output can help identify which rules take longest.)

- **Use ESLint Caching for CLI runs:** When running ESLint in CI or via command line, always use the `--cache` flag (and optionally `--cache-location` to specify the cache file). ESLint’s cache will save the lint results for files and only re-lint files that have changed since the last run. This can **massively speed up repeated lint runs** (often only a fraction of files change between commits). For example, add to your package.json lint script:  
  ```json
  "lint": "eslint . --cache"
  ```  
  This way, developers running lint locally or your CI pipeline will skip unchanged files. (The first run creates the cache, subsequent runs are incremental.) This doesn’t directly affect the VS Code editor experience, but it helps with pre-commit hooks or full repo lint checks.

- **Leverage VS Code ESLint Settings for Monorepo:** In VS Code, the ESLint extension can be tuned for a workspace with multiple projects:
  - **Enable Flat Config:** Ensure you set `"eslint.experimental.useFlatConfig": true` in your VS Code settings (workspace settings). This is needed for ESLint v9 flat configs to be recognized by the extension (since flat config is relatively new). Without this, the extension might be falling back to no config or a wrong config.
  - **Multiple Working Directories:** Use the `"eslint.workingDirectories"` setting to optimize how the ESLint server runs in a monorepo. This setting allows ESLint to run separately in each project folder, rather than treating the whole monorepo as one giant project. By splitting the lint process per package, it can reduce memory usage and also scope type information to the right tsconfig. You can configure it with glob patterns. For example, in your **workspace `.vscode/settings.json`**:  
    ```json
    {
      "eslint.workingDirectories": [
        { "pattern": "packages/*" },
        { "pattern": "apps/*" }
      ]
    }
    ```  
    This tells the ESLint extension to treat each folder under `packages/` and `apps/` as a separate ESLint project with its own working directory. So if you open a file in `packages/foo/src/index.ts`, ESLint will run with `packages/foo` as the cwd and will pick up that package’s tsconfig context first. This can prevent cross-talk between projects and means ESLint doesn’t load all tsconfigs at once unnecessari ([
        ESLint - Visual Studio Marketplace
    ](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint#:~:text=%2A%20%60eslint.workingDirectories%60%20,requires%20you%20to%20change%20the)) ([
        ESLint - Visual Studio Marketplace
    ](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint#:~:text=the%20,directory%20setup%20looks%20as%20follows))2】. It’s effectively similar to running ESLint on each package individually, which is often faster than one big run on the whole repo.
  - **Auto-fix Only on Save (optional):** If you find that ESLint is re-linting as you type (which can be slow if each lint takes several seconds), you can adjust the mode. In the VS Code ESLint settings, you might set `"eslint.run": "onSave"` instead of the default `"onType"`. With `"onSave"`, ESLint will only validate when you save the file, not continuously while editing. This can significantly improve editor responsiveness for large projects (at the cost of not catching issues until you hit save). Many developers prefer on-save linting in large codebases to avoid interruptions.
  - **Editor Integration Tip:** Make sure the VS Code ESLint extension is using the workspace’s ESLint version (it usually does). Also, update it to the latest version – performance improvements are often made in the extension as well. As of ESLint extension 3.x, it runs ESLint as a language server and can reuse a single process. The extension’s release notes indicate that using `eslint.workingDirectories` with auto-changing of CWD is supported (and now even supports glob pattern ([
        ESLint - Visual Studio Marketplace
    ](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint#:~:text=,cwd))4】, which we used above.

- **Parallelize where possible:** Outside of VS Code, if you run lint tasks in CI or scripts, take advantage of parallelism. You can lint sub-projects in parallel (since ESLint is single-threaded per process). For example, run `eslint` on each package concurrently (there are npm packages and build tools that help with this in monorepos). This doesn’t change the per-file cost but can utilize multiple cores to handle a large monorepo faster. Also consider using **ESLint’s built-in caching** (as mentioned) in CI, or even repository-wide caching (some CI systems or monorepo tools like Nx can cache successful lint results between runs).

- **Monitor and profile ESLint**: When your repo grows, periodically run ESLint with the `TIMING=1` environment variable (for ESLint 9) or `--timing` flag if available. This will output performance timings per rule. It can help you catch if a particular rule suddenly becomes a bottleneck. For instance, you might discover down the line that a rule from another plugin (perhaps a security or complexity rule) is taking 3 seconds alone – then you can decide to adjust it. Since you’re already observing “Validation took 6568ms”, using such diagnostics can pinpoint what contributed to those 6.5 seconds.

By applying these strategies, you should see a noticeable improvement in ESLint’s speed and responsiveness. In a nutshell: **reduce the scope** of what ESLint has to check (files and rules), **enable caching** so repeated work is minimized, and **configure your tools** (ESLint and editor) to work efficiently with a multi-project setup. This will make the developer experience much smoother as your monorepo continues to grow.

**Sources:**

- Official documentation on the TypeScript resolver and its capabiliti ([eslint-import-resolver-typescript - npm](https://www.npmjs.com/package/eslint-import-resolver-typescript#:~:text=,package.json)) ([eslint-import-resolver-typescript - npm](https://www.npmjs.com/package/eslint-import-resolver-typescript#:~:text=settings%3A%20,types%2Funist))3】.  
- ESLint plugin import-x details and changelog notes on performance improvemen ([eslint-plugin-import-x/CHANGELOG.md at master · un-ts/eslint-plugin-import-x · GitHub](https://github.com/un-ts/eslint-plugin-import-x/blob/master/CHANGELOG.md#:~:text=%2A%20,util)) ([eslint-plugin-import-x/CHANGELOG.md at master · un-ts/eslint-plugin-import-x · GitHub](https://github.com/un-ts/eslint-plugin-import-x/blob/master/CHANGELOG.md#:~:text=%2A%20,version%20of%20the%20original%20plugin))4】.  
- TypeScript-ESLint monorepo configuration guide – advice on tsconfig setup and glob patterns for performan ([Monorepo Configuration | typescript-eslint](https://typescript-eslint.io/troubleshooting/typed-linting/monorepos#:~:text=Wide%20globs%20in%20))7】.  
- Example from a project disabling a slow import rule for performan ([`import/namespace` is very slow · Issue #2340 · import-js/eslint-plugin-import · GitHub](https://github.com/import-js/eslint-plugin-import/issues/2340#:~:text=,import%232340))9】.  
- VS Code ESLint extension documentation on using multiple working directories in monorep ([
        ESLint - Visual Studio Marketplace
    ](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint#:~:text=,cwd))9】.
