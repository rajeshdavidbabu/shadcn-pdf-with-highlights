import { useState } from "react"
import {
  PDFViewer,
  DataPanel,
  type PDFHighlight,
  type PDFHighlightField
} from "./ui/components/pdf-with-highlights"
import { LandingPage } from "./ui/landing-page"
import testData from "../public/test-data/invoice-cmiko9uvi0001mselsgdk042w.json"

function PDFDemo() {
  const highlights: PDFHighlight[] = testData.highlights
  const fields: PDFHighlightField[] = testData.fields
  const pdfUrl = "/test-data/cmiko9uvi0001mselsgdk042w.pdf"

  const [activeHighlightId, setActiveHighlightId] = useState<string | null>(null)

  return (
    <div className="h-full w-full grid grid-cols-1 lg:grid-cols-5 bg-gray-50 overflow-hidden">
      {/* PDF Viewer - Left Side (60%) */}
      <div className="lg:col-span-3 min-h-0 border-r border-gray-200">
        <PDFViewer
          pdfUrl={pdfUrl}
          highlights={highlights}
          activeHighlightId={activeHighlightId}
          setActiveHighlightId={setActiveHighlightId}
        />
      </div>

      {/* Data Panel - Right Side (40%) */}
      <div className="lg:col-span-2 min-h-0 bg-white">
        <DataPanel
          fields={fields}
          title="Data Panel"
          onHighlight={setActiveHighlightId}
          activeHighlightId={activeHighlightId}
        />
      </div>
    </div>
  )
}

function App() {
  return (
    <LandingPage>
      <PDFDemo />
    </LandingPage>
  )
}

export default App
