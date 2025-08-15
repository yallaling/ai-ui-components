# 🚀 Deployment Guide - AI UI Components

This guide covers all deployment options for the AI UI Components library.

## 📋 Prerequisites

- Node.js 18+
- npm or yarn
- Git repository (for automated deployments)

## 🎯 Deployment Options

### 1. 📚 Storybook Documentation

Deploy your interactive component documentation:

#### Option A: Netlify (Recommended)
```bash
# Install Netlify CLI
npm install -g netlify-cli

# Build and deploy
./deploy.sh
netlify deploy --dir=storybook-static --prod
```

#### Option B: Vercel
```bash
# Install Vercel CLI
npm install -g vercel

# Build and deploy
./deploy.sh
vercel --prod storybook-static
```

#### Option C: GitHub Pages (Automated)
1. Push your code to GitHub
2. The GitHub Action will automatically deploy on push to main/master
3. Access your docs at: `https://yallaling.github.io/ai-ui-components`

### 2. 📦 NPM Package

Publish your component library to NPM:

```bash
# 1. Build the library
npm run build

# 2. Login to NPM (first time only)
npm login

# 3. Publish to NPM
npm publish

# 4. Install in other projects
npm install ai-ui-components
```

#### Usage in other projects:
```typescript
import { AIWriter, AIRewriter, AIPrompt } from 'ai-ui-components';

function MyApp() {
  return (
    <div>
      <AIWriter showControls />
      <AIPrompt showAIAssistance />
    </div>
  );
}
```

### 3. 🐳 Docker Deployment

Create a Docker container for your Storybook:

```dockerfile
# Dockerfile
FROM node:18-alpine as builder

WORKDIR /app
COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build-storybook

FROM nginx:alpine
COPY --from=builder /app/storybook-static /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

Deploy:
```bash
docker build -t ai-ui-components .
docker run -p 80:80 ai-ui-components
```

### 4. ☁️ Cloud Platform Deployment

#### AWS S3 + CloudFront
```bash
# Install AWS CLI
npm install -g aws-cli

# Build and sync to S3
npm run build-storybook
aws s3 sync storybook-static/ s3://your-bucket-name
```

#### Google Cloud Storage
```bash
# Install Google Cloud SDK
npm run build-storybook
gsutil -m rsync -r -d storybook-static gs://your-bucket-name
```

## 🔧 Configuration

### Environment Variables

Create `.env` files for different environments:

```bash
# .env.production
REACT_APP_API_URL=https://api.yourapp.com
REACT_APP_ENV=production

# .env.staging
REACT_APP_API_URL=https://staging-api.yourapp.com
REACT_APP_ENV=staging
```

### Package.json Updates

Before publishing to NPM, update these fields:

```json
{
  "name": "your-ai-ui-components",
  "version": "1.0.0",
  "description": "Your description",
  "author": "Your Name <your.email@example.com>",
  "repository": {
    "type": "git",
    "url": "https://github.com/yallaling/ai-ui-components.git"
  },
  "homepage": "https://yallaling.github.io/ai-ui-components",
  "bugs": {
    "url": "https://github.com/yallaling/ai-ui-components/issues"
  }
}
```

## 🚀 Quick Start Script

Use the provided deployment script:

```bash
# Run all checks and builds
./deploy.sh
```

This script will:
- ✅ Install dependencies
- ✅ Run tests
- ✅ Run linting
- ✅ Build component library
- ✅ Build Storybook
- ✅ Show deployment options

## 📊 Monitoring & Analytics

### Storybook Analytics

Add analytics to your deployed Storybook:

```javascript
// .storybook/manager.js
import { addons } from '@storybook/addons';

addons.setConfig({
  // Add Google Analytics
  analytics: {
    gtag: 'YOUR_GA_TRACKING_ID'
  }
});
```

### NPM Package Analytics

Monitor your package usage:
- NPM downloads: https://npmtrends.com/your-package-name
- Bundle size: https://bundlephobia.com/package/your-package-name

## 🔒 Security

### NPM Publishing
- Use `npm audit` to check for vulnerabilities
- Enable 2FA on your NPM account
- Use semantic versioning

### Environment Security
- Never commit `.env` files
- Use environment-specific configurations
- Validate all environment variables

## 📈 Performance

### Bundle Optimization
- Tree shaking is enabled (ES modules)
- CSS is optimized and minified
- TypeScript declarations included

### CDN Recommendations
- Use Netlify/Vercel CDN for Storybook
- NPM packages are automatically CDN-cached
- Consider using unpkg.com for quick testing

## 🎉 Success!

After deployment, your users can:

1. **View Documentation**: Visit your deployed Storybook
2. **Install Package**: `npm install your-ai-ui-components`
3. **Use Components**: Import and use in their React apps
4. **Contribute**: Fork your repository and contribute

Happy deploying! 🚀
