# Publishing Guide - Universal Chrome AI Components

## Pre-Publishing Checklist

### 1. Validate Local Packages
```bash
# Test package creation (dry run)
cd packages/core && npm pack --dry-run
cd packages/components && npm pack --dry-run  
cd packages/react && npm pack --dry-run
```

### 2. Version Management
Current versions:
- `@yallaling/chrome-ai-core`: 1.0.0
- `@yallaling/chrome-ai-components`: 1.0.0
- `@yallaling/ai-ui-components`: 2.0.0 (maintains v1.x API compatibility)

### 3. NPM Publishing Commands

#### First-time Publishing
```bash
# Login to npm (if not already logged in)
npm login

# Publish core package first (no dependencies)
cd packages/core
npm publish --access public

# Publish components package (depends on core)
cd ../components  
npm publish --access public

# Publish React package (depends on components)
cd ../react
npm publish --access public
```

#### Update Publishing
```bash
# Update version numbers in package.json files first
# Then build and publish in dependency order

npm run build  # Build all packages
cd packages/core && npm publish
cd ../components && npm publish  
cd ../react && npm publish
```

## Package Usage Examples

### For React Developers (v2.0 with v1.x compatibility)
```bash
npm install @yallaling/ai-ui-components
```

```tsx
import { AITranslator, AISummarizer } from '@yallaling/ai-ui-components';

function App() {
  return (
    <div>
      <AITranslator />
      <AISummarizer />
    </div>
  );
}
```

### For Vue/Angular/Svelte Developers (Universal Web Components)
```bash
npm install @yallaling/chrome-ai-components
```

```html
<!-- Works in any framework -->
<ai-translator-element></ai-translator-element>
```

### For Framework-Agnostic Usage (Core Logic)
```bash
npm install @yallaling/chrome-ai-core
```

```typescript
import { ChromeAITranslator } from '@yallaling/chrome-ai-core';

const translator = new ChromeAITranslator();
const result = await translator.translate('Hello', 'Spanish');
```

## Quality Assurance

### Build Verification
- ✅ All packages build without errors
- ✅ TypeScript compilation successful (ESM + CJS)
- ✅ Declaration files generated
- ✅ Source maps created
- ✅ Custom elements manifest generated

### Dependency Chain
```
@yallaling/chrome-ai-core (no deps)
    ↓
@yallaling/chrome-ai-components (+ Lit)
    ↓  
@yallaling/ai-ui-components (+ React peer deps)
```

### Bundle Analysis
- **Core**: ~10KB (minified)
- **Components**: ~25KB (minified, includes Lit)
- **React**: ~15KB (minified, excludes React)

## Post-Publishing

### 1. Update Documentation
- [ ] Update README.md with installation instructions
- [ ] Create component documentation website
- [ ] Add usage examples for each framework

### 2. Testing
- [ ] Test installation in new projects
- [ ] Verify cross-framework compatibility
- [ ] Test with different bundlers (Webpack, Vite, Rollup)

### 3. Community
- [ ] Announce on social media
- [ ] Submit to component libraries
- [ ] Create demo applications

## Publishing Notes

⚠️ **Important**: Publish in dependency order (core → components → react) to avoid dependency resolution issues.

🔄 **Versioning**: Follow semantic versioning for all packages. Breaking changes require major version bumps.

📦 **Package Names**: All packages use the `@yallaling/` scope for consistency and discoverability.
