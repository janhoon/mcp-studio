# Technical Context: MCP Studio

## Technology Stack

### Frontend Framework
- **Next.js 15.2.2**: React framework with App Router
- **React 19.0.0**: Latest React with concurrent features
- **TypeScript 5**: Full type safety throughout application
- **Tailwind CSS 3.4.1**: Utility-first CSS framework
- **Tailwind Animate**: Animation utilities

### UI Components
- **Radix UI**: Accessible component primitives
  - Dropdown Menu, Label, Popover, Scroll Area, Select, Slot, Tabs
- **Lucide React**: Icon library
- **Class Variance Authority**: Component variant management
- **clsx & tailwind-merge**: Conditional styling utilities

### Data Management
- **Dexie 4.0.11**: IndexedDB wrapper for client-side storage
- **Dexie React Hooks**: React integration for Dexie

### AI Integration
- **AI SDK**: Vercel's AI SDK for model interactions
- **@ai-sdk/anthropic**: Anthropic Claude integration
- **@ai-sdk/openai**: OpenAI GPT integration
- **@anthropic-ai/sdk**: Direct Anthropic SDK
- **openai**: Direct OpenAI SDK

### Content Rendering
- **React Markdown**: Markdown rendering in chat
- **React Syntax Highlighter**: Code syntax highlighting
- **Remark GFM**: GitHub Flavored Markdown support

### Development Tools
- **ESLint**: Code linting with Next.js config
- **Prettier**: Code formatting
- **PostCSS**: CSS processing
- **Turbopack**: Fast development bundling

### Deployment
- **Cloudflare Workers**: Edge deployment platform
- **@opennextjs/cloudflare**: Next.js to Cloudflare adapter
- **Wrangler**: Cloudflare deployment tool

## Development Setup

### Prerequisites
- Node.js (version compatible with Next.js 15)
- npm or yarn package manager
- Cloudflare account (for deployment)

### Local Development
```bash
npm run dev          # Start development server with Turbopack
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
npm run format       # Format code with Prettier
```

### Deployment Commands
```bash
npm run deploy       # Deploy to Cloudflare
npm run preview      # Preview deployment locally
npm run cf-typegen   # Generate Cloudflare types
```

## Technical Constraints

### Client-Side Only
- No backend server or database
- All data stored in browser's IndexedDB
- API calls made directly from client to AI providers
- MCP server communication through client-side protocols

### Browser Compatibility
- Modern browsers with IndexedDB support
- ES2020+ JavaScript features
- CSS Grid and Flexbox support
- WebSocket support for MCP servers

### Performance Considerations
- Bundle size optimization with tree shaking
- Lazy loading of components
- Efficient IndexedDB queries
- Minimal re-renders with React optimization

### Security Constraints
- API keys stored in browser storage
- No server-side validation
- CORS limitations for MCP server connections
- Client-side encryption considerations

## Dependencies Overview

### Core Dependencies (Production)
- **React Ecosystem**: React 19, Next.js 15
- **UI Framework**: Tailwind CSS, Radix UI components
- **Data Storage**: Dexie for IndexedDB operations
- **AI Integration**: Multiple AI SDK packages
- **Content Rendering**: Markdown and syntax highlighting
- **Analytics**: PostHog for usage tracking

### Development Dependencies
- **Build Tools**: TypeScript, ESLint, Prettier
- **Deployment**: Cloudflare Workers types and tools
- **Styling**: Tailwind plugins and utilities

### Version Overrides
- React types pinned to 19.0.10 for compatibility
- Consistent React DOM types across packages

## Architecture Decisions

### State Management
- React hooks for local component state
- No global state management library
- Database operations through custom hooks
- Direct IndexedDB integration via Dexie

### Routing
- Next.js App Router for file-based routing
- Client-side navigation
- No server-side rendering for dynamic content

### Styling Approach
- Utility-first with Tailwind CSS
- Component variants with CVA
- Responsive design with mobile-first approach
- Dark/light theme support ready

### Data Flow
- Unidirectional data flow
- Database as single source of truth
- Optimistic updates for better UX
- Error boundaries for graceful failures
