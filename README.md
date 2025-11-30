# PDF Highlighter UI

A standalone, composable PDF highlighter component built with React 18/19 compatibility and shadcn-style API.

## Structure

This is a Vite project that serves as both a development environment and a distributable component library.

### Distributable Components

All components, hooks, types, and utils are organized under the `src/ui/` folder. This folder contains everything you need to copy/distribute:

```
src/
└── ui/
    ├── components/    # PDF highlighter components
    ├── hooks/         # React hooks
    ├── types/         # TypeScript types
    ├── utils/         # Utility functions
    └── index.ts       # Main export file
```

### Demo Application

The root `src/` folder contains the demo application (`App.tsx`, `main.tsx`) that showcases the components.

## Installation

```bash
pnpm install
```

## Development

### Run the Demo

```bash
pnpm dev
```

This will start the Vite dev server at `http://localhost:3001` with a working demo of the PDF highlighter.

### Build

```bash
pnpm build
```

### Type Check

```bash
pnpm typecheck
```

## Using the Components

To use these components in your own project, copy the `src/ui/` folder to your project and import from it:

```tsx
import {
  PDFHighlighter,
  PDFHighlighterViewer,
  PDFHighlighterNavigation,
  PDFHighlighterPanel,
  type PDFHighlight,
  type PDFHighlightField,
} from "./ui"
```

Or if you've set up the library build:

```tsx
import {
  PDFHighlighter,
  PDFHighlighterViewer,
  PDFHighlighterNavigation,
  PDFHighlighterPanel,
  type PDFHighlight,
  type PDFHighlightField,
} from "@pdf-highlighter/ui"
```

## Features

- ✅ **Composable**: shadcn-style sub-components
- ✅ **React 18/19 Compatible**: Works seamlessly on both versions
- ✅ **No Re-renders**: Uses refs for scrolling, prevents unnecessary re-renders
- ✅ **TypeScript**: Full type safety
- ✅ **Flexible**: Support for normalized (0-1) or pixel coordinates
- ✅ **Easy to Extend**: Build custom panels, handlers, database saves, etc.

## Data Structures

### PDFHighlight

```typescript
interface PDFHighlight {
  id: string
  page: number
  x: number                     // Normalized 0-1 OR absolute pixels
  y: number
  width: number
  height: number
  text?: string
  label?: string
  color?: string
  normalized?: boolean          // default: true
}
```

### PDFHighlightField

```typescript
interface PDFHighlightField {
  id: string
  label: string
  value: string | number | null
  highlightId: string           // Links to PDFHighlight.id
  type?: string
  group?: string
}
```

## Components

- `PDFHighlighter` - Root container
- `PDFHighlighterViewer` - Main PDF viewer with highlights
- `PDFHighlighterNavigation` - Page navigation bar
- `PDFHighlighterPanel` - Data panel with highlight buttons
- `PDFHighlighterField` - Individual field component
- `PDFHighlighterHighlight` - Highlight overlay
- `PDFHighlighterLoading` - Loading skeleton

## Hooks

- `usePageScale` - Calculate page scale
- `usePDFScroll` - Handle scrolling to highlights
- `usePDFHighlights` - Filter visible highlights

## Utils

- `cn` - Class name utility (shadcn style)
- `normalizeToPixels` - Convert normalized coordinates to pixels
- `validateHighlight` - Validate highlight coordinates

## License

MIT
