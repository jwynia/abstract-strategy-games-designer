# Module System Documentation

## Decision: CommonJS

This project uses **CommonJS** module system exclusively. This decision was made to ensure maximum compatibility and avoid the ESM/CommonJS interoperability issues that plague many Node.js projects.

## Key Configuration

### package.json
```json
{
  // NO "type": "module" - this ensures CommonJS is used
  // If you see "type": "module", remove it
}
```

### tsconfig.json
```json
{
  "compilerOptions": {
    "module": "commonjs",  // ← MUST be commonjs
    "esModuleInterop": true,
    "allowSyntheticDefaultImports": true
  }
}
```

## Import/Export Rules

### ✅ DO: Use CommonJS syntax

```typescript
// Importing
import express from 'express'  // TypeScript will compile this to require()
import { Hono } from 'hono'
import * as fs from 'fs'

// Exporting
export default app
export { myFunction }
```

### ❌ DON'T: Use ESM-specific features

```typescript
// DON'T use these:
import.meta.url  // ESM only
await at top level  // ESM only
.mjs file extensions  // ESM signal
```

## File Extensions

- Use `.ts` for TypeScript files
- Use `.js` for compiled output
- Avoid `.mjs` or `.cjs` extensions

## Running the Code

### Development
```bash
tsx src/server.ts  # tsx handles TypeScript + CommonJS correctly
```

### Production
```bash
tsc  # Compiles to CommonJS
node dist/server.js  # Runs CommonJS output
```

## Common Issues and Fixes

### Issue: "Cannot use import statement outside a module"
**Fix**: Remove `"type": "module"` from package.json

### Issue: "exports is not defined"
**Fix**: You have ESM code trying to run as CommonJS. Check that tsconfig has `"module": "commonjs"`

### Issue: "__dirname is not defined"
**Fix**: You're in ESM mode. Remove `"type": "module"` from package.json

### Issue: Package only supports ESM
**Fix**: For ESM-only packages, use dynamic import:
```typescript
const { someFunction } = await import('esm-only-package')
```

## Testing Configuration

If using Vitest or other test runners:
```typescript
// vitest.config.ts
import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    globals: true,
    environment: 'node'
  }
})
```

## Why CommonJS?

1. **Better compatibility**: Many packages still use CommonJS
2. **Simpler tooling**: Most build tools handle CommonJS well
3. **No dual package hazard**: Avoid duplicate module instances
4. **Clearer errors**: CommonJS errors are more straightforward
5. **Works everywhere**: Node.js, bundlers, test runners all support it

## Enforcing Consistency

### Linting Rules

Add to `.eslintrc`:
```json
{
  "rules": {
    "node/no-unsupported-features/es-syntax": ["error", {
      "ignores": ["modules"]  // Allow import/export syntax
    }]
  }
}
```

### Pre-commit Check

```bash
# Check for ESM indicators
if grep -q '"type": "module"' package.json; then
  echo "Error: Remove 'type: module' from package.json"
  exit 1
fi
```

## Migration Checklist

If converting from ESM to CommonJS:

- [ ] Remove `"type": "module"` from package.json
- [ ] Change `"module": "ES2022"` to `"module": "commonjs"` in tsconfig.json
- [ ] Replace `import.meta.url` with `__filename`
- [ ] Replace top-level `await` with async functions
- [ ] Update any `.mjs` files to `.js`
- [ ] Test all imports still work

## Summary

**Always use CommonJS in this project.** TypeScript's import/export syntax will be compiled to CommonJS require/exports. This gives us modern syntax while avoiding module system headaches.