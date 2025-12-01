# shadcn-pdf-with-highlights

> The Missing PDF Viewer for RAG Applications

A beautifully designed, composable PDF viewer component with precise highlighting capabilities. Built for React and Tailwind CSS projects, perfect for showing users exactly where your AI found answers in PDF documents.

## Why This Component?

When building RAG (Retrieval-Augmented Generation) applications, trust is everything. Users need to see **exactly** where your AI extracted information from source documents. This component makes it effortless to:

- ✅ Display PDF documents with pixel-perfect highlights
- ✅ Link extracted data fields to their source locations
- ✅ Provide smooth scrolling and navigation
- ✅ Build trust through visual proof of extraction

## Features

- 🎨 **Shadcn-style**: Follows shadcn/ui design patterns and conventions
- 🧩 **Composable**: Mix and match components to fit your needs
- 📱 **Responsive**: Works seamlessly across different screen sizes
- ⚡ **Performant**: Optimized rendering with minimal re-renders
- 🎯 **Type-safe**: Full TypeScript support
- 🔧 **Customizable**: Easy to extend and style

## Requirements

- React 18+ or React 19+
- Tailwind CSS
- A build tool (Vite, Next.js, etc.)

## Installation

### Option 1: If you already have shadcn/ui installed

**1. Install PDF dependencies:**

```bash
npm install react-pdf pdfjs-dist
```

> **Note:** Even with shadcn/ui, you need `react-pdf` and `pdfjs-dist` as they're specific to PDF rendering.

**2. Copy the component file:**

```bash
# Copy the main component
cp src/ui/components/pdf-with-highlights.tsx your-project/components/ui/

# That's it! The component uses shadcn's existing utilities (cn, Button, etc.)
```

> 📄 **[View the component file on GitHub](https://github.com/rajeshdavidbabu/shadcn-pdf-with-highlights/blob/master/src/ui/components/pdf-with-highlights.tsx)**

### Option 2: Fresh installation

**1. Install dependencies:**

```bash
npm install react-pdf pdfjs-dist lucide-react @radix-ui/react-slot class-variance-authority clsx tailwind-merge
```

> **Note:** `pdfjs-dist` is a required peer dependency of `react-pdf`. The PDF.js worker is automatically loaded from the unpkg CDN, so no additional configuration is needed.

**2. Copy the component:**

```bash
cp src/ui/components/pdf-with-highlights.tsx your-project/components/ui/
```

> 📄 **[View the component file on GitHub](https://github.com/rajeshdavidbabu/shadcn-pdf-with-highlights/blob/master/src/ui/components/pdf-with-highlights.tsx)**

**3. Ensure Tailwind CSS is configured** in your project.

## Usage

Check out [`src/App.tsx`](./src/App.tsx) for a complete working example. Here's a minimal setup:

```tsx
import { useState } from "react"
import {
  PDFViewer,
  DataPanel,
  type PDFHighlight,
  type PDFHighlightField
} from "./components/ui/pdf-with-highlights"

function App() {
  const [activeHighlightId, setActiveHighlightId] = useState<string | null>(null)

  const highlights: PDFHighlight[] = [
    {
      id: "highlight-1",
      page: 1,
      x: 0.1,        // Normalized coordinates (0-1)
      y: 0.2,
      width: 0.3,
      height: 0.05,
      normalized: true
    }
  ]

  const fields: PDFHighlightField[] = [
    {
      id: "field-1",
      label: "Invoice Number",
      value: "INV-001",
      highlightId: "highlight-1"
    }
  ]

  return (
    <div className="h-screen grid grid-cols-5">
      {/* PDF Viewer (60%) */}
      <div className="col-span-3">
        <PDFViewer
          pdfUrl="/path/to/document.pdf"
          highlights={highlights}
          activeHighlightId={activeHighlightId}
          setActiveHighlightId={setActiveHighlightId}
        />
      </div>

      {/* Data Panel (40%) */}
      <div className="col-span-2">
        <DataPanel
          fields={fields}
          title="Extracted Data"
          onHighlight={setActiveHighlightId}
          activeHighlightId={activeHighlightId}
        />
      </div>
    </div>
  )
}
```

## Data Structures

### PDFHighlight

```typescript
interface PDFHighlight {
  id: string
  page: number              // 1-indexed page number
  x: number                 // X coordinate (0-1 if normalized, pixels otherwise)
  y: number                 // Y coordinate (0-1 if normalized, pixels otherwise)
  width: number             // Width (0-1 if normalized, pixels otherwise)
  height: number            // Height (0-1 if normalized, pixels otherwise)
  text?: string             // Optional extracted text
  label?: string            // Optional label
  color?: string            // Optional custom color
  normalized?: boolean      // Default: true
}
```

### PDFHighlightField

```typescript
interface PDFHighlightField {
  id: string
  label: string                    // Field name (e.g., "Invoice Number")
  value: string | number | null    // Extracted value
  highlightId: string              // Links to PDFHighlight.id
  type?: string                    // Optional field type
  group?: string                   // Optional grouping
}
```

## Components Included

All components are exported from the single `pdf-with-highlights.tsx` file:

- **`PDFViewer`** - Main PDF viewer with navigation and highlighting
- **`DataPanel`** - Side panel for displaying extracted fields
- **`PDFHeader`** - Navigation header with page controls
- **`PDFHighlighterLoading`** - Loading skeleton
- **`Button`** - Shadcn-style button component

## Tips & Best Practices

### Getting Highlight Coordinates

To get the bounding box coordinates for highlights, you can use OCR services that provide layout analysis:

- **AWS Textract** - Returns normalized coordinates (0-1) for detected text blocks
- **Google Cloud Vision API** - Provides bounding polygon vertices
- **Azure Document Intelligence** - Returns bounding boxes with coordinates
- **Tesseract.js** - Open-source OCR with bounding box support

**Example with AWS Textract:**

```typescript
// Textract returns geometry in normalized coordinates (0-1)
const highlight: PDFHighlight = {
  id: block.Id,
  page: block.Page,
  x: block.Geometry.BoundingBox.Left,
  y: block.Geometry.BoundingBox.Top,
  width: block.Geometry.BoundingBox.Width,
  height: block.Geometry.BoundingBox.Height,
  normalized: true,  // Textract uses 0-1 coordinates
  text: block.Text
}
```

This makes it easy to integrate with your existing document processing pipeline!


## Development

```bash
# Install dependencies
pnpm install

# Run dev server
pnpm dev

# Build
pnpm build
```

## License

MIT

## Credits

Built with ❤️ by [Raj](https://github.com/rajeshdavidbabu)

Inspired by the need for better PDF visualization in RAG applications.
