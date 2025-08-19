# Framework Integration Examples

## 🎯 Usage Across Frameworks

### React (Wrapper Component)
```tsx
// React wrapper for better TypeScript integration
import React, { useRef, useEffect } from 'react';
import '@yallaling/chrome-ai-components/ai-translator';

interface AITranslatorProps {
  sourceLanguage?: string;
  targetLanguage?: string;
  streaming?: boolean;
  autoTranslate?: boolean;
  placeholder?: string;
  onTranslate?: (event: CustomEvent) => void;
  onError?: (event: CustomEvent) => void;
}

export const AITranslator: React.FC<AITranslatorProps> = ({
  sourceLanguage = 'en',
  targetLanguage = 'es',
  streaming = false,
  autoTranslate = false,
  placeholder = 'Enter text to translate...',
  onTranslate,
  onError,
}) => {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const handleTranslate = (e: Event) => onTranslate?.(e as CustomEvent);
    const handleError = (e: Event) => onError?.(e as CustomEvent);

    element.addEventListener('translate', handleTranslate);
    element.addEventListener('error', handleError);

    return () => {
      element.removeEventListener('translate', handleTranslate);
      element.removeEventListener('error', handleError);
    };
  }, [onTranslate, onError]);

  return (
    <ai-translator
      ref={ref}
      source-language={sourceLanguage}
      target-language={targetLanguage}
      streaming={streaming}
      auto-translate={autoTranslate}
      placeholder={placeholder}
    />
  );
};
```

### Vue 3 (Composition API)
```vue
<template>
  <ai-translator
    :source-language="sourceLanguage"
    :target-language="targetLanguage"
    :streaming="streaming"
    :auto-translate="autoTranslate"
    :placeholder="placeholder"
    @translate="handleTranslate"
    @error="handleError"
  />
</template>

<script setup lang="ts">
import { ref } from 'vue';
import '@yallaling/chrome-ai-components/ai-translator';

interface Props {
  sourceLanguage?: string;
  targetLanguage?: string;
  streaming?: boolean;
  autoTranslate?: boolean;
  placeholder?: string;
}

const props = withDefaults(defineProps<Props>(), {
  sourceLanguage: 'en',
  targetLanguage: 'es',
  streaming: false,
  autoTranslate: false,
  placeholder: 'Enter text to translate...',
});

const emit = defineEmits<{
  translate: [event: CustomEvent];
  error: [event: CustomEvent];
}>();

const handleTranslate = (event: CustomEvent) => {
  emit('translate', event);
};

const handleError = (event: CustomEvent) => {
  emit('error', event);
};
</script>
```

### Angular (Component)
```typescript
// ai-translator.component.ts
import { Component, Input, Output, EventEmitter, ElementRef, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import '@yallaling/chrome-ai-components/ai-translator';

@Component({
  selector: 'app-ai-translator',
  template: `
    <ai-translator
      [attr.source-language]="sourceLanguage"
      [attr.target-language]="targetLanguage"
      [attr.streaming]="streaming"
      [attr.auto-translate]="autoTranslate"
      [attr.placeholder]="placeholder"
      (translate)="onTranslate($event)"
      (error)="onError($event)"
    ></ai-translator>
  `,
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class AITranslatorComponent {
  @Input() sourceLanguage = 'en';
  @Input() targetLanguage = 'es';
  @Input() streaming = false;
  @Input() autoTranslate = false;
  @Input() placeholder = 'Enter text to translate...';

  @Output() translate = new EventEmitter<CustomEvent>();
  @Output() error = new EventEmitter<CustomEvent>();

  onTranslate(event: CustomEvent) {
    this.translate.emit(event);
  }

  onError(event: CustomEvent) {
    this.error.emit(event);
  }
}
```

### Svelte
```svelte
<script lang="ts">
  import '@yallaling/chrome-ai-components/ai-translator';
  
  export let sourceLanguage = 'en';
  export let targetLanguage = 'es';
  export let streaming = false;
  export let autoTranslate = false;
  export let placeholder = 'Enter text to translate...';
  
  let translatorElement: HTMLElement;
  
  function handleTranslate(event: CustomEvent) {
    console.log('Translation:', event.detail);
  }
  
  function handleError(event: CustomEvent) {
    console.error('Translation error:', event.detail);
  }
</script>

<ai-translator
  bind:this={translatorElement}
  source-language={sourceLanguage}
  target-language={targetLanguage}
  {streaming}
  auto-translate={autoTranslate}
  {placeholder}
  on:translate={handleTranslate}
  on:error={handleError}
/>
```

### Vanilla JavaScript
```html
<!DOCTYPE html>
<html>
<head>
  <script type="module" src="https://unpkg.com/@yallaling/chrome-ai-components/ai-translator.js"></script>
</head>
<body>
  <ai-translator
    source-language="en"
    target-language="es"
    streaming="true"
    placeholder="Enter text to translate..."
  ></ai-translator>

  <script>
    const translator = document.querySelector('ai-translator');
    
    translator.addEventListener('translate', (event) => {
      console.log('Translation result:', event.detail);
    });
    
    translator.addEventListener('error', (event) => {
      console.error('Translation error:', event.detail);
    });
  </script>
</body>
</html>
```

## 🚀 Migration Strategy

### Phase 1: Create Core Package
```bash
# Create new workspace for core logic
mkdir chrome-ai-universal
cd chrome-ai-universal

# Setup monorepo structure
npm init -w packages/core
npm init -w packages/components  
npm init -w packages/react
```

### Phase 2: Extract Chrome AI Logic
Move your existing Chrome AI integration logic from React components to the core package.

### Phase 3: Build Lit Components
Create Web Components using the core logic.

### Phase 4: Update React Package
Make your existing React components use the Web Components internally, maintaining the same API.

### Phase 5: Publish Universal Packages
- `@yallaling/chrome-ai-core` - Core logic
- `@yallaling/chrome-ai-components` - Web Components
- `@yallaling/ai-ui-components` - React wrappers (existing)

## 📦 Package Dependencies

### Core Package
```json
{
  "name": "@yallaling/chrome-ai-core",
  "dependencies": {},
  "peerDependencies": {}
}
```

### Web Components Package
```json
{
  "name": "@yallaling/chrome-ai-components",
  "dependencies": {
    "lit": "^3.0.0",
    "@yallaling/chrome-ai-core": "^1.0.0"
  }
}
```

### React Package (Updated)
```json
{
  "name": "@yallaling/ai-ui-components",
  "dependencies": {
    "@yallaling/chrome-ai-components": "^1.0.0"
  },
  "peerDependencies": {
    "react": ">=16.8.0",
    "react-dom": ">=16.8.0"
  }
}
```

## 🎯 Benefits Summary

✅ **Universal**: Works in React, Vue, Angular, Svelte, Vanilla JS
✅ **Consistent**: Same Chrome AI logic across all frameworks
✅ **Maintainable**: Single source of truth for AI functionality
✅ **Progressive**: Existing React users keep their current API
✅ **Future-proof**: Web Components are web standards
✅ **TypeScript**: Full type support across all frameworks
