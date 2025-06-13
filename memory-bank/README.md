# Memory Bank: MCP Studio

This memory bank contains comprehensive documentation for the MCP Studio project, designed to provide complete context for development work across sessions.

## File Structure

### Core Files
- **`projectbrief.md`** - Project overview, requirements, and scope
- **`productContext.md`** - User problems, solutions, and experience goals
- **`techContext.md`** - Technology stack, setup, and constraints
- **`systemPatterns.md`** - Architecture, design patterns, and implementation details
- **`activeContext.md`** - Current work focus, decisions, and next steps
- **`progress.md`** - What's working, what's left, and project status

## Usage Guidelines

### For New Development Sessions
1. **Read ALL memory bank files** before starting any work
2. Start with `projectbrief.md` for project understanding
3. Review `activeContext.md` for current priorities
4. Check `progress.md` for implementation status

### For Updates
- Update `activeContext.md` when work focus changes
- Update `progress.md` when features are completed
- Update other files when architecture or requirements change

### For Handoffs
- Ensure all files reflect current project state
- Update `activeContext.md` with immediate next steps
- Document any new patterns in `systemPatterns.md`

## Memory Bank Principles

1. **Complete Context**: Each file provides complete context for its domain
2. **Current State**: All information reflects the actual current state
3. **Actionable**: Information is specific enough to guide immediate action
4. **Interconnected**: Files reference and build upon each other
5. **Maintained**: Regular updates keep information accurate and useful

## Quick Reference

### Project Status
- **Phase**: Foundation complete, MCP integration in progress
- **Tech Stack**: Next.js 15, React 19, TypeScript, Tailwind, Dexie
- **Deployment**: Cloudflare Workers
- **Storage**: Client-side IndexedDB

### Key Patterns
- Client-side only architecture
- TypeScript-first development
- Database as source of truth
- Component composition with Radix UI
- Responsive three-panel layout

### Current Priorities
1. Complete MCP server integration
2. Stabilize AI provider APIs
3. Improve error handling
4. Polish user experience
