# Test Data

This directory contains exported test data from the billbrain app for testing the standalone PDF highlighter component.

## Generating Test Data

From the billbrain app directory, run:

```bash
# Export invoice data
pnpm tsx scripts/export-pdf-highlight-data.ts <invoiceId> invoice

# Export contract data
pnpm tsx scripts/export-pdf-highlight-data.ts <contractId> contract
```

## Data Format

The exported JSON files contain:

```json
{
  "highlights": [
    {
      "id": "...",
      "page": 1,
      "x": 0.15,
      "y": 0.25,
      "width": 0.3,
      "height": 0.02,
      "text": "...",
      "label": "...",
      "normalized": true
    }
  ],
  "fields": [
    {
      "id": "...",
      "label": "Invoice",
      "value": "...",
      "highlightId": "...",
      "group": "Basic Information"
    }
  ],
  "metadata": {
    "type": "invoice",
    "id": "...",
    "extractedAt": "...",
    "status": "COMPLETED"
  }
}
```

## Usage in Examples

You can import and use this data in your examples:

```tsx
import testData from "./test-data/invoice-<id>.json"

const highlights = testData.highlights
const fields = testData.fields
```

