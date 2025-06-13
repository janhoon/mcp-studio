# System Patterns: MCP Studio

## Architecture Overview

### Component Hierarchy
```
App (page.tsx)
├── ChatHistory (sidebar)
│   ├── Chat list management
│   └── Chat CRUD operations
├── ChatInterface (main)
│   ├── Message display
│   ├── Input handling
│   └── AI provider integration
└── MCPSettings (sidebar)
    ├── Server configuration
    └── Connection management
```

### Data Flow Architecture
```
User Input → Component State → Database (Dexie) → UI Update
                ↓
         AI Provider API → Response → Database → UI Update
```

## Key Design Patterns

### Database Layer Pattern
- **Single Database Instance**: One Dexie instance for entire app
- **Typed Operations**: All database operations are fully typed
- **Async/Await**: Consistent async patterns throughout
- **Bulk Operations**: Efficient batch operations for messages

```typescript
// Pattern: Database operation with error handling
export async function addMessage(message: Message): Promise<void> {
  await db.messages.add(message);
}
```

### State Management Pattern
- **Local State**: React hooks for component-specific state
- **Database as Source of Truth**: No global state store
- **Optimistic Updates**: UI updates before database confirmation
- **Effect Synchronization**: useEffect for data loading

```typescript
// Pattern: Data loading with effects
useEffect(() => {
  const loadData = async () => {
    const data = await db.getData();
    setState(data);
  };
  loadData();
}, [dependency]);
```

### Component Communication Pattern
- **Props Down**: Data flows down through props
- **Callbacks Up**: Events bubble up through callbacks
- **Shared State**: Parent components manage shared state
- **Database Sync**: Components sync through database operations

### Error Handling Pattern
- **Graceful Degradation**: App continues working with partial failures
- **User Feedback**: Clear error messages for user actions
- **Retry Logic**: Automatic retries for transient failures
- **Fallback States**: Default states when data unavailable

## Critical Implementation Paths

### Chat Creation Flow
1. User clicks "New Chat" button
2. Generate unique chat ID (timestamp-based)
3. Create Chat object with default values
4. Save to database via `addChat()`
5. Update local state and set as active chat
6. UI reflects new chat immediately

### Message Handling Flow
1. User submits message in ChatInterface
2. Create user Message object
3. Add to database and update UI
4. Send to AI provider API
5. Stream or receive AI response
6. Create assistant Message object
7. Add to database and update UI

### API Key Management Flow
1. User adds API key in settings
2. Validate key format (basic validation)
3. Store in database with provider type
4. Mark as default if first key
5. Available for chat configuration

### MCP Server Integration Flow
1. User configures MCP server details
2. Store server configuration
3. Establish connection (stdio/SSE)
4. Available for chat enhancement
5. Handle connection lifecycle

## Component Relationships

### Data Dependencies
- **ChatHistory** depends on: chats array, active chat state
- **ChatInterface** depends on: active chat, messages, API keys
- **MCPSettings** depends on: MCP servers array
- **Database Layer** provides: all persistent data

### Event Flow
- **Chat Selection**: ChatHistory → App → ChatInterface
- **Message Creation**: ChatInterface → App → Database
- **Settings Changes**: MCPSettings → App → Database
- **Data Loading**: Database → App → All Components

## Database Schema Patterns

### Table Structure
```typescript
// Pattern: Consistent ID and timestamp fields
interface BaseEntity {
  id: string;           // Unique identifier
  createdAt?: string;   // ISO timestamp
  updatedAt?: string;   // ISO timestamp
}

// Pattern: Relationship through foreign keys
interface Message {
  id: string;
  chatId: string;       // Foreign key to Chat
  // ... other fields
}
```

### Query Patterns
```typescript
// Pattern: Relationship queries
const chatMessages = await db.messages
  .where("chatId")
  .equals(chatId)
  .sortBy("seq");

// Pattern: Bulk operations
await db.messages.bulkAdd(messages);
```

## UI/UX Patterns

### Layout Pattern
- **Three-Column Layout**: History | Chat | Settings
- **Responsive Collapse**: Sidebars hide on smaller screens
- **Flexible Main**: Chat interface takes remaining space
- **Overflow Handling**: Scrollable areas for long content

### Interaction Patterns
- **Optimistic UI**: Immediate feedback before server response
- **Loading States**: Clear indicators during async operations
- **Error Recovery**: User-friendly error messages with actions
- **Keyboard Navigation**: Full keyboard accessibility

### Styling Patterns
- **Utility Classes**: Tailwind for consistent spacing/colors
- **Component Variants**: CVA for component state variations
- **Responsive Design**: Mobile-first responsive breakpoints
- **Theme Support**: CSS variables for theme switching

## Performance Patterns

### Rendering Optimization
- **Memo Components**: Prevent unnecessary re-renders
- **Key Props**: Stable keys for list rendering
- **Lazy Loading**: Code splitting for large components
- **Virtual Scrolling**: For large message lists (future)

### Data Loading Patterns
- **Lazy Loading**: Load data when needed
- **Caching**: Database serves as cache layer
- **Batch Operations**: Group database operations
- **Debounced Updates**: Prevent excessive database writes

## Security Patterns

### API Key Handling
- **Local Storage Only**: Never send keys to external servers
- **Encryption Ready**: Structure supports future encryption
- **Secure Defaults**: Safe fallbacks for missing keys
- **User Control**: Clear key management interface

### Data Privacy
- **Client-Side Only**: All processing happens locally
- **No Telemetry**: Optional analytics with user control
- **Clear Data Boundaries**: Explicit data flow documentation
- **User Ownership**: Users control all their data
