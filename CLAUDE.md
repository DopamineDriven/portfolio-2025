# CLAUDE.md — Slipstream Codebase Guide

> This document is the single source of truth for code generation in this repository.
> Violations of **HARD RULES** must never ship. **Patterns** are strongly preferred conventions.
> When in doubt, read the existing hand-written code — workup.ts, collections.ts, event-types.ts — not agent-generated code.

---

## Hard Rules (Non-Negotiable)

### Type Safety

- **NEVER use `any`.** No exceptions. Use `unknown` and narrow, or define the type properly.
- **Use `satisfies` over type assertions whenever feasible.** Only use `as` type assertions if absolutely necessary (e.g., implementing a method overload's implementation signature — and even then, always pair as `satisfies X as X`, never bare `as`). The only universally acceptable `as` usage is `as const` for literal types. See **Method Overloads** below for the one case where `satisfies X as X` is the correct pattern.
- **NEVER assert return types** except in overload implementations where `satisfies X as X` is required for resolution. Annotating a function return with a bare type assertion (`return foo as Bar`) silences TypeScript and completely nerfs its capacity to flag mistyped bugs as the codebase evolves. If the type doesn't check, *fix the type* — don't paper over it with an assertion.
- **NEVER use `@ts-ignore` or `@ts-expect-error`.** If the types don't work, fix the types.
- **NEVER use `enum`.** Use `as const satisfies` objects or union types instead.
- **NEVER use `.filter(Boolean)`.** It does not narrow types. TypeScript returns the original union (`(T | null | undefined)[]`) unchanged, which either propagates nullable types silently or forces a type assertion to "fix" — compounding the problem. Use an explicit type predicate.

```ts
// ❌ WRONG — no type narrowing, result is still (string | null)[]
const values = mixed.filter(Boolean);

// ❌ DOUBLY WRONG — .filter(Boolean) then asserting to cover the gap
const values = mixed.filter(Boolean) as string[];

// ✅ CORRECT — explicit predicate, TypeScript narrows to string[]
const values = mixed.filter((v): v is string => v != null);

// ✅ ALSO CORRECT — reusable generic predicate
function isDefined<T>(value: T | null | undefined): value is T {
  return value != null;
}
const values = mixed.filter(isDefined);
```

```ts
// ✅ CORRECT
const STATUS_MAP = {
  DOCUMENT_STATUS_FAILED: "FAILED",
  DOCUMENT_STATUS_PROCESSED: "ACTIVE",
  DOCUMENT_STATUS_PROCESSING: "PROCESSING",
  DOCUMENT_STATUS_UNKNOWN: "PENDING"
} as const satisfies Record<DocumentStatus, ProviderDocState>;

// ✅ CORRECT — satisfies for return validation
return {
  totalBytes: totalBytes ? Number(totalBytes) : 0,
  ...rest
} satisfies CreateUserStoreRT<true>;

// ✅ CORRECT — as const for literal return types
return {
  ok: true,
  doc
} as const;

// ❌ WRONG — assertion silences type errors
return data as UserStoreDocSingleton<true>[];

// ❌ WRONG — return type assertion
const result = foo as Bar;
return result;

// ❌ WRONG — satisfies exists for exactly this
const x = foo as Bar;

// ❌ WRONG — .filter(Boolean) doesn't narrow
const names = items.map(i => i.name).filter(Boolean);
// ✅ CORRECT
const names = items.map(i => i.name).filter((n): n is string => n != null);
```

### Global Type Augmentations

This codebase augments built-in interfaces via `declare global` in the workspace root. These augmentations are **always available** — do not work around them with type assertions.

**Available augmentations:**

- `JSON.parse<T>(text): T` — generic parse, no assertion needed.
- `Body.json<T>(): Promise<T>` and `Response.json<T>(): Promise<T>` — generic `.json()` on fetch responses.
- `Object.keys<T>(o: T)` — returns properly typed `(keyof T)[]` (strings and numeric keys only, symbols excluded).

```ts
// ✅ CORRECT — use the generic parameter
const data = JSON.parse<MyConfig>(rawText);
const page = await res.json<GetFilesRT>();
const keys = Object.keys(myRecord); // inferred as (keyof typeof myRecord)[]

// ❌ WRONG — unnecessary assertion, the augmentation already handles this
const data = JSON.parse(rawText) as MyConfig;
const page = (await res.json()) as GetFilesRT;
```

Additional module augmentations may exist for specific packages (e.g., `ws`, `http`, `pythonia`) — check the root `*.d.ts` files before assuming a library's types are limited to their defaults.

**Do not add competing augmentations.** If a type augmentation is needed, extend the existing declarations — never shadow or duplicate them.

### Let TypeScript Infer

- **Do not over-annotate return types.** TypeScript's inference is often more precise than manual annotations. Annotating a return type can *kill* compiler-derived narrowing.
- **Never manually annotate type predicates that the compiler can infer.** Since TS 5.5, functions that check equality against union members automatically infer `is` predicates. Manual `: model is X` annotations are only needed for complex logic the compiler can't follow.
- **Do not annotate return types on private/protected helpers** unless the inferred type is genuinely unclear. Let the compiler derive the narrowest possible type.

```ts
// ✅ CORRECT — unannotated, TS 5.5 infers:
//   model is "grok-4-0709" | "grok-4-fast-reasoning" | "grok-2-vision-1212" | ...
protected canViewImgs(model: GrokModelIdUnion) {
  return (
    model === "grok-2-vision-1212" ||
    model === "grok-4-0709" ||
    model === "grok-4-fast-reasoning"
  );
}

// ❌ WRONG — manual `: boolean` kills the type predicate inference
protected canViewImgs(model: GrokModelIdUnion): boolean {
  return (
    model === "grok-2-vision-1212" ||
    model === "grok-4-0709" ||
    model === "grok-4-fast-reasoning"
  );
}
// Caller gets no narrowing — model is still the full union after the check.
```

The same principle applies to `.filter()` — an inline predicate like `.filter((v): v is string => v != null)` is necessary because the *callback* context doesn't get inferred, but a standalone method that does equality checks doesn't need manual predicate annotation.

### Generics

- Prefer generics over overloads when the relationship between input and output types is parametric.
- Use generics with constraints (`extends`) — never unconstrained `<T>`.
- Use conditional types and mapped types in utility positions, not inline in function signatures.

```ts
// ✅ CORRECT — constrained generic with conditional return
type CreateUserStoreRT<TBigintToNum extends boolean> =
  TBigintToNum extends true
    ? { totalBytes: number; /* ... */ }
    : { totalBytes: bigint; /* ... */ };

// ✅ CORRECT — overloads when behavior diverges based on a literal flag
protected async promoteDocWithPolling(
  collectionId: string,
  userId: string,
  file_id: string,
  xaiFilename: string,
  fireAndForget: true,
  managementKey?: string
): Promise<{ readonly ok: true; readonly doc: CollectionDocument }>;
protected async promoteDocWithPolling(
  collectionId: string,
  userId: string,
  file_id: string,
  xaiFilename: string,
  fireAndForget: false,
  managementKey?: string
): Promise<
  | { readonly ok: true; readonly doc: CollectionDocument }
  | { readonly ok: false; readonly doc: CollectionDocument }
>;
```

### Method Overloads

- **Overload signatures (non-implementation) get explicit return type annotations.** The implementation signature does NOT — let TypeScript infer from the body.
- **The implementation signature is the only place `satisfies X as X` is acceptable.** The `satisfies` validates the shape; the `as` resolves the inferred union against the overload signatures. Both are needed, in that order. Never use bare `as` without a preceding `satisfies` in this context.
- **Never annotate the implementation signature's return type.** It fights the overload pattern — the overload signatures already define the public contract.

```ts
// ✅ CORRECT — overload signatures have explicit return types
private restoreCustomMeta(data: FssDocSurfacedMeta): FssDoc;
private restoreCustomMeta(data: FssDocSurfacedMeta[]): FssDoc[];
// Implementation signature: no return type annotation, inferred from body
private restoreCustomMeta(data: FssDocSurfacedMeta[] | FssDocSurfacedMeta) {
  if (Array.isArray(data)) {
    return data.map(t => this.restoreOriginalFssDoc(t));
  } else return this.restoreOriginalFssDoc(data);
}

// ✅ CORRECT — satisfies validates, as resolves for overload compat
return {
  ...rest,
  ...metaObj
} satisfies FssDocSurfacedMeta as FssDocSurfacedMeta;

// ❌ WRONG — bare `as` without `satisfies` in overload implementation
return { ...rest, ...metaObj } as FssDocSurfacedMeta;

// ❌ WRONG — annotating implementation signature return type
private restoreCustomMeta(
  data: FssDocSurfacedMeta[] | FssDocSurfacedMeta
): FssDoc | FssDoc[] { // <-- fights the overload
```

For bidirectional type transforms (converting between two representations of the same data), use discriminated overloads with `in` checks for runtime narrowing:

```ts
// Bidirectional transform — overloads define both directions
private fssDocEpimerize(data: FssDocSurfacedMeta[]): FssDoc[];
private fssDocEpimerize(data: FssDocSurfacedMeta): FssDoc;
private fssDocEpimerize(data: FssDoc[]): FssDocSurfacedMeta[];
private fssDocEpimerize(data: FssDoc): FssDocSurfacedMeta;
private fssDocEpimerize(
  data: (FssDoc | FssDocSurfacedMeta)[] | (FssDoc | FssDocSurfacedMeta)
) {
  // "attachmentId" in t discriminates FssDocSurfacedMeta from FssDoc at runtime
  if (Array.isArray(data)) {
    return data.map(t =>
      "attachmentId" in t
        ? this.restoreCustomMeta(t)
        : this.surfaceCustomMeta(t)
    );
  } else {
    return "attachmentId" in data
      ? this.restoreCustomMeta(data)
      : this.surfaceCustomMeta(data);
  }
}
```

### Discriminated Separation

- **If two code paths produce structurally different results, use separate functions** — not one function with null fields or context-dependent return semantics.
- The discriminant is known at the call site. Don't force consumers to narrow after the fact.
- Tuple returns where fields change meaning depending on which branch ran are banned. Use named objects with discriminated shapes instead.

```ts
// ❌ WRONG — tuple with context-dependent semantics
function parse(url, isCompat): [id: number | null, name: string, ext: string]
// "name" means attachmentId in one branch, filename in the other. Consumers can't tell.

// ✅ CORRECT — caller picks the parser, return types are unambiguous
function parseCompat(url): { compatStatus: "ACTIVE"; attachmentId: string; ext: string }
function parseNonCompat(url): { compatStatus: "ALIASED"; timestamp: string; filename: string; ext: string }
```

### Imports and Exports

- **NEVER use barrel exports** (re-export files like `index.ts` that just aggregate exports).
- Use explicit path imports with `.ts` extensions: `import { Foo } from "@/bar/baz.ts"`.
- Prefer `import type` for type-only imports.
- Use path aliases (`@/`, `@slipstream/`) — never relative paths beyond `./` or `../`.

### Model Call Budgets — NO OUTPUT CAPS, NO REASONING CAPS, EVER

- **NEVER introduce token caps on model calls.** No `max_tokens`, `max_output_tokens`, `max_completion_tokens`, `maxTokens`, reasoning budgets, or thinking budgets — on chat paths, summarizer arms, background jobs, anywhere. Agents are not to be muzzled.
- Omit optional max-token params entirely and let the provider's own ceiling rule. In completions/Responses dialects, reasoning pays out of the same pot as visible output — any cap starves thinking FIRST and surfaces as truncated or `incomplete` responses with zero text (the fugu-ultra failure mode, probe-verified 2026-07-11).
- Where an API **requires** the param (e.g. Anthropic's `max_tokens`), pin it at the model's documented ceiling — never below it.
- Wall-clock deadlines (`callDeadlineMs`-style aborts) are the sanctioned bound on runaway calls. Bound time, never tokens.
- If a truncation guard is needed, detect it after the fact (`finish_reason === "length"` warnings), don't prevent it with a cap.

---

## Architecture Patterns

### Caching: Registry Pattern

Caches in this codebase are **purpose-specific registries** with explicit lifecycles. Every cache must have:

1. A **clear name** that describes what it maps (e.g., `fileCache`, `docCache`, `storeDbDocRegistry`).
2. A **single key type** — typically `attachmentId`, `userId`, or a provider-specific ID.
3. A **typed value interface** — never `Map<string, any>`.
4. An **explicit sync lifecycle**: populate → reconcile → write-through on mutation.
5. **Write-through discipline**: every DB or remote API mutation must also update the corresponding cache.

```ts
// ✅ CORRECT — purpose-specific registries with clear types
protected storeDbDocRegistry = new Map<string, xAIDocDbRegistryProps>();
protected fileDbRegistry = new Map<string, FilesDbRegistryProps>();
protected fileCache = new Map<string, UploadFileRT>();
protected docCache = new Map<string, CollectionDocument>();
protected collectionRegistry = new Map<string, string>();  // userId → collectionId
protected storeDbRegistry = new Map<string, string>();      // userId → storeDbId

// ❌ WRONG — redundant derived caches that duplicate information
public readonly userStoreNamesCache = new Map<string, Set<string>>();
public readonly userIdAndStoreNameCache = new Map<string, Map<string, Data>>();
// The first is a projection of the second's keys — don't maintain both.
```

**Registry reconciliation pattern:**

When two sources of truth exist (e.g., remote API state vs DB state), reconcile them explicitly after parallel sync:

```ts
// ✅ CORRECT — parallel sync then explicit reconciliation
await Promise.all([
  this.syncFilesDbRegistry(userId),    // DB → fileDbRegistry
  this.syncFilesRegistry(key)          // Remote API → fileCache
]);
this.fileRegistriesEq();               // Reconcile discrepancies
```

**Never hide cache writes inside unrelated methods.** If a method's name says "create", it should create. Cache side effects belong in the calling orchestration layer, not buried in CRUD methods.

```ts
// ❌ WRONG — creation method with hidden cache side effect
public async createUserVectorStore(params) {
  // ...creates store...
  this.syncCache(userId, data);  // hidden side effect
  return data;
}

// ✅ CORRECT — caller manages cache
const data = await this.createUserStore(params);
this.storeDbDocRegistry.set(data.attachmentId, data);
```

### Class Design

- **Inheritance for layered responsibility.** Base class = infrastructure + API plumbing. Subclass = business logic + orchestration. Example: `GrokWorkupService` (base) → `GrokCollectionsService` (business logic).
- **Single Responsibility per class.** A class that does CDN URL parsing, PDF annotation resolution, store CRUD, AND cache management is too broad. Split by domain.
- **Protected over private for base class methods** that subclasses may need. Use `private` only for implementation details that must never leak.
- **Constructor injection** for dependencies. Never instantiate services inside other services.

### Exhaustive State Handling

When cache states create a matrix (e.g., "remote exists but DB doesn't"), enumerate all cases explicitly. Don't use if/else chains that leave states implicit.

```ts
// ✅ CORRECT — exhaustive enumeration of cache states
if (dbFileCache && xaiFileCache) return xaiFileCache.id;
else if (dbFileCache && !xaiFileCache) { /* reconcile: DB has it, remote doesn't */ }
else if (xaiFileCache && !dbFileCache) { /* reconcile: remote has it, DB doesn't */ }
else { /* neither: create fresh */ }
```

### Error Handling

- **Never use exceptions for control flow.** Don't try/catch a create and fall back to a find.
- Check existence before attempting creation. Use discriminated return types for expected failures.
- Use `Promise.withResolvers<T>()` for complex async orchestration where appropriate.

```ts
// ❌ WRONG — exceptions as control flow
try {
  const data = await this.createUserStore(params);
  return data;
} catch {
  const data = await this.getUserStoreUnique(userId, name);
  return data;
}

// ✅ CORRECT — check first, then act
const exists = await this.userStoreCheck(userId, storeName);
if (exists) return await this.getUserStoreUnique(userId, storeName);
return await this.createUserStore(params);
```

### Return Types

- Use `as const` for discriminated union returns (`{ ok: true, data }` / `{ ok: false, error }`).
- Use `satisfies` at return sites to validate shape without widening.
- Prefer `readonly` properties on return types where mutation isn't expected.

```ts
// ✅ CORRECT
if (doc.status === "DOCUMENT_STATUS_FAILED") {
  return { ok: false, doc } as const;
} else {
  return { ok: true, doc } as const;
}
```

---

## Naming and Syntax

### Array Initialization

Use `Array.of<T>()` for typed empty arrays, not `[] as T[]` or bare `[]`.

```ts
// ✅ CORRECT
const items = Array.of<CreatManyGrokProviderStoreDocSingleton>();

// ❌ WRONG
const items: CreatManyGrokProviderStoreDocSingleton[] = [];
const items = [] as CreatManyGrokProviderStoreDocSingleton[];
```

### Inline Types vs Named Interfaces

If a type appears in more than one place OR has more than ~6 fields, extract it to a named interface. Never define 30+ field parameter types inline in a method signature.

```ts
// ❌ WRONG — inline type with 20+ fields in method signature
public async upsertDoc({
  storeId,
  attachmentId,
  conversationId,
  // ...15 more fields inline...
}: {
  storeId: string;
  attachmentId: string;
  // ...15 more field types inline...
}) { }

// ✅ CORRECT — named interface
interface UpsertUserStoreDocParams {
  storeId: string;
  attachmentId: string;
  conversationId: string;
  // ...
}

public async upsertDoc(params: UpsertUserStoreDocParams) { }
```

### Async Generators for Pagination

Use `async *` generators for paginated API calls. Track seen tokens defensively to guard against broken pagination APIs.

```ts
// ✅ CORRECT
private async *getAllCollectionDocuments(
  collection_id: string,
  limit = 10,
  mgmtKey = this.xaiManagementKey
) {
  let has_more = true;
  let pagination_token: string | undefined = undefined;
  while (has_more) {
    const page = await this.fetchPage(/* ... */);
    has_more = typeof page.pagination_token !== "undefined";
    pagination_token = page.pagination_token;
    yield { data: page.documents, has_more };
  }
}
```

### Getter Properties for Static Configuration

Use `get` accessors for configuration objects that shouldn't be recalculated or accidentally mutated:

```ts
// ✅ CORRECT
private get selectForUserStore() {
  return { id: true, storeName: true, userId: true /* ... */ } as const;
}

private get createUserCollectionFieldDefs() {
  return [
    { key: "conversationId", required: true, /* ... */ }
  ] as const satisfies FieldDefinition[];
}
```

---

## When Given Reference Code

When the smooth brained great ape (human) points to existing code as a conceptual reference, **understand the intent, don't mimic the structure.** Reference code explains "how this domain works" — it does not mean "copy this and add a parameter."

Specifically:

- **Identify which parts are domain-relevant vs context-specific.** If `filenameToHexExtTuple` hex-encodes filenames because vector store APIs need safe filenames, that encoding is context-specific. A cache lookup function doesn't need it.
- **Don't carry over parameters that only exist for the reference's use case.** An `encoded` flag makes sense for filename generation — it's meaningless for epoch-based cache keys.
- **If two code paths produce structurally different results, they should be separate functions** returning discriminated types, not one function returning a union with null fields.

```ts
// ❌ WRONG — smashed together, null epoch, context-dependent "name" field
public filenameToTriplet(url: string, compatStatus: CompatStatus | null, encoded = true):
  readonly [epoch: number | null, name: string, ext: string]

// ✅ CORRECT — separate functions, discriminated returns, no encoding for cache keys
public urlParseCompat(url: string):
  { readonly compatStatus: "ACTIVE"; readonly attachmentId: string; readonly ext: string; /* ... */ }

public urlParseNonCompat(url: string):
  { readonly compatStatus: "ALIASED"; readonly timestamp: string; readonly filename: string; readonly ext: string; /* ... */ }
```

The discriminant (`compatStatus`) is already known at the call site — the caller picks which parser to invoke. No runtime narrowing needed downstream.

---

## Code Generation Constraints

### Do Not

- Add `SyncCache`-style coupling — cache writes belong in orchestration, not CRUD methods.
- Create redundant derived caches (a `Set<name>` alongside a `Map<name, data>` is redundant).
- Add side effects to methods named for reads (e.g., `populate*` should not `create`).
- Use `console.log` — use the structured logger (`this.logger.info`, `.debug`, `.warn`).
- Add TODO comments punting design decisions (e.g., `// TODO(phase3): fix this coupling`). If the design is wrong, fix it now or flag it to the human for discussion.
- Install new dependencies without explicit approval. This codebase prefers custom solutions.
- Generate "scaffold" code with placeholder implementations. Every method must be production-ready.

### Do

- Read existing implementations in the same domain before writing new code.
- Match the existing patterns in workup.ts, collections.ts, and event-types.ts.
- Use `satisfies` and `as const` pervasively.
- Use `BigInt()` / `Number()` conversions explicitly — never silently coerce.
- Extract shared constants and config into typed `as const satisfies` objects.
- Write self-documenting code — if a method is named `ensureXaiFile`, it should ensure the file exists across all cache/DB/remote states.
- Ask the human when architectural decisions are unclear rather than making assumptions.
