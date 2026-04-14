# ebr

React frontend for a RAG (Retrieval Augmented Generation) application. Upload PDFs, ask questions, and get streamed answers with cited sources.

## Stack

| Layer | Technology |
|-------|-----------|
| Framework | React 18 + Vite |
| Language | TypeScript (strict) |
| Routing | React Router v6 |
| Data fetching | TanStack Query v5 |
| Styling | Tailwind CSS v3 |
| Forms | React Hook Form + Zod |
| Icons | Lucide React |
| HTTP | Native fetch + SSE streaming |

## Dev Setup

**Prerequisites:** Node 18+, a running instance of the backend API (default: `http://localhost:8000`)

```bash
# Install dependencies
npm install

# Copy env file and set your backend URL
cp .env.example .env

# Start dev server
npm run dev
```

The app will be available at `http://localhost:5173`.

### Environment variables

| Variable | Default | Description |
|----------|---------|-------------|
| `VITE_API_URL` | `http://localhost:8000` | Backend API base URL |

### Other scripts

```bash
npm run build       # Production build (runs tsc then vite build)
npm run preview     # Preview production build locally
npm run typecheck   # Type-check without emitting files
```

## Project Structure

```
src/
├── api/            # Fetch wrappers (client, documents, chat/SSE)
├── components/
│   ├── ui/         # Primitives: Button, Input, Card, Dialog, Toast, etc.
│   ├── layout/     # MainLayout, Sidebar
│   ├── documents/  # Upload, list, card components
│   └── chat/       # Chat interface, messages, input, citations
├── hooks/          # useDocuments, useChat, useStreamResponse
├── lib/            # utils (cn), constants
├── pages/          # HomePage, DocumentsPage
└── types/          # Shared TypeScript interfaces
```
