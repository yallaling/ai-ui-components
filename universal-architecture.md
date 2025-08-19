# Universal Chrome AI Components Architecture

## 📦 Package Structure

```
@yallaling/chrome-ai-core/          # Framework-agnostic core
├── src/
│   ├── ai/                         # Chrome AI logic
│   │   ├── summarizer.ts
│   │   ├── translator.ts
│   │   ├── rewriter.ts
│   │   └── detector.ts
│   ├── utils/                      # Shared utilities
│   └── types/                      # TypeScript definitions

@yallaling/chrome-ai-components/    # Lit Web Components
├── src/
│   ├── components/                 # Universal Web Components
│   │   ├── ai-summarizer.ts
│   │   ├── ai-translator.ts
│   │   ├── ai-rewriter.ts
│   │   └── ai-chat.ts
│   └── styles/                     # CSS modules

@yallaling/ai-ui-components/        # React wrappers (your existing)
├── src/
│   ├── components/                 # React components wrapping Web Components
│   └── hooks/                      # React-specific hooks

@yallaling/chrome-ai-vue/           # Vue-specific (optional)
@yallaling/chrome-ai-angular/       # Angular-specific (optional)
```

## 🎯 Benefits of This Approach

### ✅ Universal Compatibility
- **React**: `<AISummarizer />` (your existing API)
- **Vue**: `<ai-summarizer />` or Vue wrapper
- **Angular**: `<ai-summarizer>` with Angular integration
- **Svelte**: `<ai-summarizer />` directly
- **Vanilla JS**: `document.createElement('ai-summarizer')`

### ✅ Progressive Migration
- Keep your existing React library working
- Add Web Components alongside
- Users can choose their preferred approach

### ✅ Shared Logic
- One Chrome AI implementation
- Consistent behavior across frameworks
- Single source of truth for AI logic

## 🚀 Implementation Plan

### Phase 1: Extract Core Logic
Create `@yallaling/chrome-ai-core` with pure AI logic

### Phase 2: Build Lit Components  
Create `@yallaling/chrome-ai-components` with Web Components

### Phase 3: Update React Library
Make React components use the Web Components internally

### Phase 4: Framework Wrappers
Optional framework-specific packages for better DX
