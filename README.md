# 🍥 Kuybi Dashboard

A modern, feature-rich content management dashboard built with Vue 3, TypeScript, and Tailwind CSS. Inspired by Naruto's iconic orange theme, Kuybi provides an intuitive interface for managing stories, media, categories, and more.

![Kuybi Dashboard](https://img.shields.io/badge/Vue-3.4.29-4FC08D?style=for-the-badge&logo=vue.js&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-5.6.3-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-4.1.16-06B6D4?style=for-the-badge&logo=tailwind-css&logoColor=white)

## ✨ Features

### 📝 Content Management
- **Stories**: Full CRUD operations with rich text editing
- **Categories**: Organize content with story counts
- **Tags**: Flexible tagging system for better organization
- **Media Library**: Upload, manage, and organize images and files

### 🔄 Version Control
- Create story versions with descriptions
- Rollback to previous versions
- Tag important versions
- Branch from specific versions
- Complete version history tracking

### 👤 User Management
- User authentication with JWT
- Profile management with avatar upload
- Role-based access control
- Password change functionality

### 🎨 Design & UX
- **Naruto-inspired orange theme** 🍥
- Responsive design for all devices
- Smooth animations and transitions
- Intuitive navigation with sidebar
- Dark mode ready

### 🔐 Security
- JWT token authentication
- Automatic token refresh
- Protected routes
- Secure API integration

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ 
- pnpm 10.4.1+
- Backend API running (NestJS)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/moayyadfaris/kuybi-dashboard.git
   cd kuybi-dashboard
   ```

2. **Install dependencies**
   ```bash
   pnpm install
   ```

3. **Setup environment variables**
   ```bash
   cp .env.example .env
   ```
   
   Update `.env` with your configuration:
   ```env
   VITE_APP_TITLE=Kuybi Dashboard
   VITE_APP_LOGO=https://placehold.co/128x128/F97316/FFFFFF?text=Kuybi
   VITE_API_URL=http://localhost:4040/api
   ```

4. **Start development server**
   ```bash
   pnpm dev
   ```

5. **Open in browser**
   ```
   http://localhost:5173
   ```

### Default Credentials

For testing purposes:
- **Email**: `admin@kuybi.dev`
- **Password**: `Admin@123`

## 📦 Tech Stack

### Core
- **Vue 3.4.29** - Progressive JavaScript framework
- **TypeScript 5.6.3** - Type-safe development
- **Vite 7.1.12** - Next-generation frontend tooling

### State Management & Routing
- **Pinia 2.1.7** - Vue store with TypeScript support
- **Vue Router 4.3.3** - Official router for Vue.js

### Styling
- **Tailwind CSS 4.1.16** - Utility-first CSS framework
- **Tailwind Typography** - Beautiful typographic defaults

### HTTP & Validation
- **Axios 1.13.1** - Promise-based HTTP client
- **VeeValidate 4.14.5** - Form validation
- **Yup 1.4.0** - Schema validation

### UI Components
- **Lucide Vue Next** - Beautiful icon library
- Custom component library based on shadcn/ui

## 📂 Project Structure

```
kuybi-dashboard/
├── client/                 # Frontend application
│   ├── public/            # Static assets
│   └── src/
│       ├── components/    # Reusable components
│       │   ├── ui/       # UI component library
│       │   └── versions/ # Version control components
│       ├── pages/        # Page components
│       ├── router/       # Vue Router configuration
│       ├── services/     # API services
│       ├── stores/       # Pinia stores
│       ├── types/        # TypeScript types
│       └── utils/        # Utility functions
├── server/               # Backend integration
├── shared/              # Shared constants
├── docs/                # Documentation
└── patches/             # Package patches
```

## 🎯 Available Scripts

```bash
# Development
pnpm dev          # Start dev server with hot reload

# Build
pnpm build        # Build for production

# Preview
pnpm preview      # Preview production build

# Type Checking
pnpm check        # Run TypeScript type checking

# Code Formatting
pnpm format       # Format code with Prettier
```

## 🎨 Branding

Kuybi features a custom **Naruto-inspired orange theme**:

- **Primary Color**: Orange 600 (#EA580C)
- **Accent Color**: Amber 500 (#F59E0B)
- **Logo**: 🍥 Narutomaki (Uzumaki spiral)
- **Theme**: Warm, energetic, and professional

See [BRANDING_UPDATE.md](./BRANDING_UPDATE.md) for complete branding details.

## 📱 Key Features

### Story Management
- Create, edit, and delete stories
- Rich text content editing
- Category and tag assignment
- Featured image management
- Draft and publish status
- SEO-friendly slugs

### Version Control System
- **Create Versions**: Save story states with descriptions
- **Rollback**: Restore previous versions
- **Tagging**: Mark important versions (v1.0, v2.0, etc.)
- **Branching**: Create new branches from versions
- **History**: View complete version timeline

### Media Library
- Drag-and-drop file upload
- Image preview and management
- File type filtering
- Bulk operations
- Integration with story images

### User Experience
- Responsive sidebar navigation
- Breadcrumb navigation
- Loading states and indicators
- Error handling and messages
- Toast notifications
- Smooth page transitions

## 🔌 API Integration

Kuybi integrates with a NestJS backend API. Base URL configuration:

```typescript
// Services use axios with automatic token refresh
VITE_API_URL=http://localhost:4040/api
```

### API Endpoints

- **Auth**: `/api/v1/auth/*`
- **Stories**: `/api/v1/stories/*`
- **Categories**: `/api/v1/categories/*`
- **Tags**: `/api/v1/tags/*`
- **Media**: `/api/v1/attachments/*`
- **Users**: `/api/v1/users/*`
- **Versions**: `/api/v1/versions/*`

## 🛡️ Authentication Flow

1. User logs in with email/password
2. Backend returns JWT access and refresh tokens
3. Tokens stored in localStorage
4. Access token included in all API requests
5. Automatic token refresh on expiry
6. Protected routes redirect to login if unauthorized

## 🎨 Customization

### Changing Colors

Update Tailwind configuration in `client/src/index.css`:

```css
:root {
  --primary: var(--color-orange-600);
  --primary-foreground: var(--color-white);
  /* ... other color variables */
}
```

### Adding Components

Components follow the shadcn/ui pattern:

```vue
<script setup lang="ts">
// Component logic
</script>

<template>
  <!-- Component template -->
</template>
```

## 📄 Documentation

- [Branding Update](./BRANDING_UPDATE.md) - Theme and color system
- [Integration Complete](./INTEGRATION_COMPLETE.md) - API integration details
- [Version Control](./STORY_VERSIONS_IMPLEMENTATION.md) - Version system docs
- [Image Picker Refactor](./docs/IMAGE_PICKER_REFACTOR.md) - Component refactoring

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m '✨ Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Commit Convention

We use emoji prefixes for commits:

- ✨ `:sparkles:` - New features
- 🐛 `:bug:` - Bug fixes
- 📝 `:memo:` - Documentation
- 🎨 `:art:` - UI/styling changes
- ♻️ `:recycle:` - Refactoring
- ⚡ `:zap:` - Performance improvements
- 🔒 `:lock:` - Security fixes

## 📝 License

This project is licensed under the MIT License.

## 👥 Authors

- **Moayyad Faris** - [@moayyadfaris](https://github.com/moayyadfaris)

## 🙏 Acknowledgments

- Inspired by Naruto's iconic orange theme
- Built with Vue.js and the amazing Vue ecosystem
- UI components inspired by shadcn/ui
- Icons by Lucide

## 📞 Support

For support, email moayyad@example.com or open an issue in the repository.

---

**Built with ❤️ using Vue 3 and TypeScript** 🍥
