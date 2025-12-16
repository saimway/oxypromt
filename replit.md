# OxyPrompt v2

## Overview

OxyPrompt v2 is an AI-powered prompt enhancement tool that transforms simple user prompts into detailed, structured JSON for AI image generation. The application uses Groq's Llama AI model to expand brief descriptions into comprehensive prompts with detailed subject, photography, and background specifications suitable for creating 2000s-style aesthetic images.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React with TypeScript
- **Routing**: Wouter (lightweight client-side routing)
- **State Management**: TanStack React Query for server state
- **Styling**: Tailwind CSS v4 with CSS variables for theming
- **UI Components**: shadcn/ui component library (New York style) with Radix UI primitives
- **Animations**: Framer Motion for page transitions and interactions
- **Build Tool**: Vite with custom plugins for Replit integration

The frontend follows a simple single-page application pattern with a home page for prompt input and a 404 page. Components are organized in a flat structure under `client/src/components/ui/`.

### Backend Architecture
- **Framework**: Express.js with TypeScript
- **API Pattern**: RESTful endpoints under `/api` prefix
- **Server Structure**: 
  - `server/index.ts` - Main entry point with middleware setup
  - `server/routes.ts` - API route definitions
  - `server/storage.ts` - Data persistence layer (currently in-memory)
  - `server/vite.ts` - Development server integration
  - `server/static.ts` - Production static file serving

### Data Storage
- **Schema Definition**: Drizzle ORM with PostgreSQL dialect
- **Current Implementation**: In-memory storage using a Map (suitable for development/demo)
- **Database Ready**: Schema defined in `shared/schema.ts` with prompts table containing id, rawPrompt, enhancedPrompt (JSONB), and createdAt fields
- **Validation**: Zod schemas generated from Drizzle for type-safe validation

### API Structure
- `POST /api/enhance-prompt` - Accepts raw prompt text, returns AI-enhanced structured JSON
- The API integrates with Groq's chat completions endpoint using the llama-3.3-70b-versatile model

### Build System
- **Development**: Vite dev server with HMR proxied through Express
- **Production**: Custom esbuild script bundles server with allowlisted dependencies to optimize cold start times
- **Output**: Client builds to `dist/public`, server compiles to `dist/index.cjs`

## External Dependencies

### Third-Party Services
- **Groq API**: Primary AI service for prompt enhancement using Llama 3.3 70B model
  - Requires `GROQ_API_KEY` environment variable
  - Endpoint: `https://api.groq.com/openai/v1/chat/completions`

### Database
- **PostgreSQL**: Configured via `DATABASE_URL` environment variable
- **ORM**: Drizzle ORM with drizzle-kit for migrations
- **Session Store**: connect-pg-simple available for session persistence

### Key NPM Dependencies
- **UI**: Radix UI primitives, Lucide icons, class-variance-authority, tailwind-merge
- **Forms**: react-hook-form with zod resolvers
- **HTTP**: Native fetch API (no axios in client)
- **Date Handling**: date-fns