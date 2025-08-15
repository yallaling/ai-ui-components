# Toast Setup Guide

## 🍞 Toast Notifications Setup

The AI components now include copy and download functionality with toast notifications. To enable these notifications in your app, you need to add the `Toaster` component.

## Quick Setup

### 1. Add Toaster to Your App Root

```jsx
import { Toaster } from 'react-hot-toast';

function App() {
  return (
    <div className="App">
      {/* Your app content */}
      <YourComponents />
      
      {/* Add this at the end of your app */}
      <Toaster 
        position="top-right"
        toastOptions={{
          duration: 3000,
          style: {
            background: '#363636',
            color: '#fff',
          },
        }}
      />
    </div>
  );
}
```

### 2. Next.js Setup (App Router)

```jsx
// app/layout.tsx
import { Toaster } from 'react-hot-toast';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        {children}
        <Toaster position="top-right" />
      </body>
    </html>
  );
}
```

### 3. Next.js Setup (Pages Router)

```jsx
// pages/_app.tsx
import { Toaster } from 'react-hot-toast';
import type { AppProps } from 'next/app';

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <Component {...pageProps} />
      <Toaster position="top-right" />
    </>
  );
}
```

## ⚙️ Customization Options

```jsx
<Toaster 
  position="top-center" // top-left, top-center, top-right, bottom-left, bottom-center, bottom-right
  reverseOrder={false}
  gutter={8}
  containerClassName=""
  containerStyle={{}}
  toastOptions={{
    // Default options for all toasts
    className: '',
    duration: 4000,
    style: {
      background: '#363636',
      color: '#fff',
      padding: '16px',
      borderRadius: '8px',
    },
    // Custom styles for different types
    success: {
      duration: 3000,
      theme: {
        primary: 'green',
        secondary: 'black',
      },
    },
    error: {
      duration: 5000,
      theme: {
        primary: 'red',
        secondary: 'black',
      },
    },
  }}
/>
```

## 🎯 Without Toast Setup

If you don't add the `Toaster` component, the copy and download functionality will still work, but users won't see the success notifications. The features will fail silently.

## 💡 Pro Tips

1. **Position**: `top-right` works best for most layouts
2. **Duration**: 3000ms (3 seconds) is optimal for success messages
3. **Styling**: Match your app's design system colors
4. **Mobile**: Consider `top-center` for better mobile experience

## 🔍 Troubleshooting

**Issue**: Toasts not appearing
- ✅ Ensure `<Toaster />` is added to your app
- ✅ Check it's not blocked by CSS z-index issues
- ✅ Verify react-hot-toast version compatibility

**Issue**: Styling conflicts
- ✅ Use `containerClassName` to override styles
- ✅ Check CSS specificity issues
- ✅ Use inline styles via `toastOptions.style`

That's it! Your AI components will now show beautiful toast notifications for copy and download actions. 🎉
