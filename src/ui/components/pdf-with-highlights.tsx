import * as React from "react"
import { Document, Page, pdfjs } from "react-pdf"
import { ChevronLeft, ChevronRight, FileText, Pencil } from "lucide-react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"
import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

// Configure PDF.js worker
if (typeof window !== "undefined") {
    pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`
}

/* -------------------------------------------------------------------------- */
/*                                   UTILS                                    */
/* -------------------------------------------------------------------------- */

/**
 * Utility function to merge class names (shadcn style)
 */
export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs))
}

/* -------------------------------------------------------------------------- */
/*                                   TYPES                                    */
/* -------------------------------------------------------------------------- */

/**
 * PDF Highlight coordinate structure
 */
export interface PDFHighlight {
    /** Unique identifier for the highlight */
    id: string
    /** Page number (1-indexed) */
    page: number
    /** X coordinate (normalized 0-1 OR absolute pixels) */
    x: number
    /** Y coordinate (normalized 0-1 OR absolute pixels) */
    y: number
    /** Width (normalized 0-1 OR absolute pixels) */
    width: number
    /** Height (normalized 0-1 OR absolute pixels) */
    height: number
    /** Optional extracted text */
    text?: string
    /** Optional label for the highlight */
    label?: string
    /** Optional custom color (default: "rgba(99, 102, 241, 0.3)") */
    color?: string
    /** Whether coordinates are normalized (0-1) or absolute pixels. Default: true */
    normalized?: boolean
}

/**
 * Data panel field structure
 */
export interface PDFHighlightField {
    /** Unique identifier for the field */
    id: string
    /** Field label (e.g., "Invoice") */
    label: string
    /** Field value */
    value: string | number | null
    /** Links to PDFHighlight.id */
    highlightId: string
    /** Optional field type */
    type?: string
    /** Optional group/category */
    group?: string
}

/* -------------------------------------------------------------------------- */
/*                             HIGHLIGHT UTILS                                */
/* -------------------------------------------------------------------------- */

/**
 * Calculate highlight position styles
 */
export function getHighlightStyles(highlight: PDFHighlight) {
    return {
        left: highlight.normalized ? `calc(${highlight.x * 100}% - 4px)` : highlight.x,
        top: highlight.normalized ? `calc(${highlight.y * 100}% - 4px)` : highlight.y,
        width: highlight.normalized ? `calc(${highlight.width * 100}% + 8px)` : highlight.width,
        height: highlight.normalized ? `calc(${highlight.height * 100}% + 8px)` : highlight.height,
    }
}

/**
 * Filter highlights for a specific page
 */
export function getPageHighlights(highlights: PDFHighlight[], pageNumber: number) {
    return highlights.filter((h) => h.page === pageNumber)
}

/**
 * Group items by a key
 */
export function groupBy<T>(items: T[], getKey: (item: T) => string): Record<string, T[]> {
    return items.reduce((acc, item) => {
        const key = getKey(item)
        if (!acc[key]) {
            acc[key] = []
        }
        acc[key].push(item)
        return acc
    }, {} as Record<string, T[]>)
}

/**
 * Navigate to next page
 */
export function getNextPage(currentPage: number, totalPages: number): number {
    return Math.min(currentPage + 1, totalPages)
}

/**
 * Navigate to previous page
 */
export function getPrevPage(currentPage: number): number {
    return Math.max(currentPage - 1, 1)
}

/**
 * Scroll element into view smoothly within its scroll container
 */
export function scrollToElement(element: HTMLElement | null, container?: HTMLElement | null) {
    if (!element) return

    // If a container is provided, scroll within it
    if (container) {
        const elementTop = element.offsetTop
        const containerHeight = container.clientHeight
        const elementHeight = element.clientHeight
        const scrollTo = elementTop - (containerHeight / 2) + (elementHeight / 2)

        container.scrollTo({
            top: scrollTo,
            behavior: "smooth"
        })
    } else {
        // Fallback to default scrollIntoView
        element.scrollIntoView({ behavior: "smooth", block: "center" })
    }
}

/**
 * Convert normalized coordinates (0-1) to actual pixel coordinates
 */
export function normalizeToPixels(
    highlight: PDFHighlight,
    pageWidth: number,
    pageHeight: number
): {
    x: number
    y: number
    width: number
    height: number
} {
    if (highlight.normalized === false) {
        // Already in pixels
        return {
            x: highlight.x,
            y: highlight.y,
            width: highlight.width,
            height: highlight.height,
        }
    }

    // Convert normalized (0-1) to pixels
    return {
        x: highlight.x * pageWidth,
        y: highlight.y * pageHeight,
        width: highlight.width * pageWidth,
        height: highlight.height * pageHeight,
    }
}

/**
 * Validate highlight coordinates
 */
export function validateHighlight(highlight: PDFHighlight): boolean {
    if (highlight.normalized === false) {
        // Pixel coordinates - just check they're positive
        return (
            highlight.x >= 0 &&
            highlight.y >= 0 &&
            highlight.width > 0 &&
            highlight.height > 0
        )
    }

    // Normalized coordinates - check they're between 0 and 1
    return (
        highlight.x >= 0 &&
        highlight.x <= 1 &&
        highlight.y >= 0 &&
        highlight.y <= 1 &&
        highlight.width > 0 &&
        highlight.width <= 1 &&
        highlight.height > 0 &&
        highlight.height <= 1
    )
}

/* -------------------------------------------------------------------------- */
/*                             UI COMPONENTS                                  */
/* -------------------------------------------------------------------------- */

const buttonVariants = cva(
    "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
    {
        variants: {
            variant: {
                default: "bg-primary text-primary-foreground hover:bg-primary/90",
                destructive:
                    "bg-destructive text-white hover:bg-destructive/90 focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40 dark:bg-destructive/60",
                outline:
                    "border bg-background shadow-xs hover:bg-accent hover:text-accent-foreground dark:bg-input/30 dark:border-input dark:hover:bg-input/50",
                secondary:
                    "bg-secondary text-secondary-foreground hover:bg-secondary/80",
                ghost:
                    "hover:bg-accent hover:text-accent-foreground dark:hover:bg-accent/50",
                link: "text-primary underline-offset-4 hover:underline",
            },
            size: {
                default: "h-9 px-4 py-2 has-[>svg]:px-3",
                sm: "h-8 rounded-md gap-1.5 px-3 has-[>svg]:px-2.5",
                lg: "h-10 rounded-md px-6 has-[>svg]:px-4",
                icon: "size-9",
                "icon-sm": "size-8",
                "icon-lg": "size-10",
            },
        },
        defaultVariants: {
            variant: "default",
            size: "default",
        },
    }
)

export interface ButtonProps
    extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
    asChild?: boolean
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
    ({ className, variant, size, asChild = false, ...props }, ref) => {
        const Comp = asChild ? Slot : "button"
        return (
            <Comp
                className={cn(buttonVariants({ variant, size, className }))}
                ref={ref}
                {...props}
            />
        )
    }
)
Button.displayName = "Button"

/* -------------------------------------------------------------------------- */
/*                        PDF HIGHLIGHTER COMPONENTS                          */
/* -------------------------------------------------------------------------- */

interface PDFHighlighterLoadingProps extends React.ComponentProps<"div"> {
    containerWidth: number
    numPages?: number
}

export function PDFHighlighterLoading({
    containerWidth,
    numPages = 1,
    className,
    ...props
}: PDFHighlighterLoadingProps) {
    const pageCount = Math.min(3, numPages)

    return (
        <div
            data-slot="pdf-highlighter-loading"
            className={cn("flex flex-col items-center justify-center", className)}
            {...props}
        >
            <div className={cn("w-full max-w-5xl", pageCount > 1 ? "space-y-8" : "")}>
                {Array.from({ length: pageCount }, (_, i) => (
                    <div key={i} className="mx-auto relative">
                        <div
                            className="bg-white shadow-lg border border-gray-200 relative overflow-hidden"
                            style={{
                                width: Math.min(containerWidth - 32, 1000),
                                height: Math.floor(Math.min(containerWidth - 32, 1000) * 1.414),
                            }}
                        >
                            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/50 to-transparent animate-pulse" />
                            <div className="p-4 space-y-4">
                                <div className="space-y-3">
                                    <div className="h-6 bg-gray-200 rounded animate-pulse w-3/4" />
                                    <div className="h-4 bg-gray-200 rounded animate-pulse w-1/2" />
                                </div>
                                <div className="space-y-3 pt-6">
                                    {Array.from({ length: 8 }, (_, lineIndex) => (
                                        <div key={lineIndex} className="space-y-2">
                                            <div
                                                className={cn(
                                                    "h-3 bg-gray-200 rounded animate-pulse",
                                                    lineIndex % 3 === 0
                                                        ? "w-full"
                                                        : lineIndex % 3 === 1
                                                            ? "w-5/6"
                                                            : "w-4/5"
                                                )}
                                            />
                                        </div>
                                    ))}
                                </div>
                                <div className="pt-8 space-y-3">
                                    <div className="h-4 bg-gray-200 rounded animate-pulse w-2/3" />
                                    <div className="h-4 bg-gray-200 rounded animate-pulse w-1/3" />
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {pageCount > 1 && (
                <div className="flex items-center gap-2 mt-6">
                    <div className="w-4 h-4 border-2 border-gray-300 border-t-blue-500 rounded-full animate-spin" />
                    <p className="text-sm text-gray-600">Loading PDF content...</p>
                </div>
            )}
        </div>
    )
}

interface PDFHeaderProps {
    currentPage: number
    numPages: number | null
    onPrevPage: () => void
    onNextPage: () => void
    children?: React.ReactNode
}

export function PDFHeader({
    currentPage,
    numPages,
    onPrevPage,
    onNextPage,
    children
}: PDFHeaderProps) {
    return (
        <div className="h-14 border-b border-gray-200 flex items-center justify-between px-4 bg-white flex-shrink-0">
            <div className="flex items-center gap-2">
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={onPrevPage}
                    disabled={currentPage <= 1}
                    aria-label="Previous page"
                >
                    <ChevronLeft className="w-5 h-5" />
                </Button>

                <span className="text-sm font-medium text-gray-700 min-w-[5rem] text-center">
                    Page {currentPage} of {numPages || "--"}
                </span>

                <Button
                    variant="ghost"
                    size="icon"
                    onClick={onNextPage}
                    disabled={!numPages || currentPage >= (numPages || 1)}
                    aria-label="Next page"
                >
                    <ChevronRight className="w-5 h-5" />
                </Button>
            </div>
            {children && <div className="flex items-center gap-2">{children}</div>}
        </div>
    )
}

interface DataPanelProps {
    fields: PDFHighlightField[]
    title?: string
    onHighlight: (highlightId: string) => void
    activeHighlightId: string | null
}

export function DataPanel({ fields, title = "Data Panel", onHighlight, activeHighlightId }: DataPanelProps) {
    const withGroup = fields.filter((f) => f.group)
    const withoutGroup = fields.filter((f) => !f.group)
    const groups = groupBy(withGroup, (f) => f.group!)
    const grouped = { groups, ungrouped: withoutGroup }

    return (
        <div className="h-full w-full border-l border-gray-200 bg-white flex flex-col flex-shrink-0">
            {/* Header */}
            <div className="h-14 border-b border-gray-200 flex items-center px-6 flex-shrink-0">
                <FileText className="w-5 h-5 text-gray-600 mr-2" />
                <h2 className="text-base font-semibold text-gray-900">{title}</h2>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto">
                <div className="px-6 py-4 space-y-6">
                    {/* Grouped fields */}
                    {Object.entries(grouped.groups).map(([groupName, groupFields]) => (
                        <div key={groupName} className="space-y-1">
                            <div className="flex items-center gap-2 mb-3">
                                <FileText className="w-4 h-4 text-blue-600" />
                                <h3 className="text-sm font-semibold text-gray-900">{groupName}</h3>
                            </div>
                            <div className="space-y-0">
                                {groupFields.map((field) => (
                                    <FieldRow key={field.id} field={field} onHighlight={onHighlight} activeHighlightId={activeHighlightId} />
                                ))}
                            </div>
                        </div>
                    ))}

                    {/* Ungrouped fields */}
                    {grouped.ungrouped.length > 0 && (
                        <div className="space-y-0">
                            {grouped.ungrouped.map((field) => (
                                <FieldRow key={field.id} field={field} onHighlight={onHighlight} activeHighlightId={activeHighlightId} />
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

interface FieldRowProps {
    field: PDFHighlightField
    onHighlight: (highlightId: string) => void
    activeHighlightId: string | null
}

function FieldRow({ field, onHighlight, activeHighlightId }: FieldRowProps) {
    const isActive = field.highlightId === activeHighlightId

    return (
        <div className="flex items-start justify-between py-3 border-b border-gray-100 last:border-b-0">
            <div className="flex-1 min-w-0 pr-3">
                <div className="text-xs text-gray-500 mb-1">{field.label}:</div>
                <div className="text-sm font-medium text-gray-900 break-words">
                    {field.value !== null && field.value !== undefined ? String(field.value) : "—"}
                </div>
            </div>
            <Button
                variant={isActive ? "default" : "outline"}
                className={isActive ? "bg-blue-600 text-white hover:bg-blue-700 border border-transparent" : "border border-gray-300 cursor-pointer"}
                size="sm"
                onClick={() => onHighlight(field.highlightId)}
            >
                <Pencil className="w-3.5 h-3.5" />
                Highlight
            </Button>
        </div>
    )
}

/* -------------------------------------------------------------------------- */
/*                             MAIN PDF VIEWER                                */
/* -------------------------------------------------------------------------- */

interface PDFViewerProps {
    pdfUrl: string | File
    highlights: PDFHighlight[]
    activeHighlightId: string | null
    setActiveHighlightId: (id: string | null) => void
}

export function PDFViewer({ pdfUrl, highlights, activeHighlightId }: PDFViewerProps) {
    const [numPages, setNumPages] = React.useState<number | null>(null)
    const [currentPage, setCurrentPage] = React.useState(1)
    const [error, setError] = React.useState<Error | null>(null)
    const [containerWidth, setContainerWidth] = React.useState<number>(0)
    const containerRef = React.useRef<HTMLDivElement>(null)
    const pageRefs = React.useRef<Map<number, HTMLDivElement>>(new Map())
    const highlightRefs = React.useRef<Map<string, HTMLElement>>(new Map())

    // Handle container resizing
    React.useEffect(() => {
        const container = containerRef.current
        if (!container) return

        const observer = new ResizeObserver((entries) => {
            // Use requestAnimationFrame to avoid "ResizeObserver loop limit exceeded"
            requestAnimationFrame(() => {
                if (!Array.isArray(entries) || !entries.length) return
                const width = entries[0].contentRect.width
                setContainerWidth(width)
            })
        })

        observer.observe(container)
        return () => observer.disconnect()
    }, [])

    // Handle scroll end event
    // Page tracking (Initial load + Scroll end)
    React.useEffect(() => {
        const container = containerRef.current
        if (!container || !numPages) return

        const updatePage = () => {
            const observer = new IntersectionObserver(
                (entries) => {
                    let maxRatio = 0
                    let mostVisiblePage = -1

                    entries.forEach((entry) => {
                        if (entry.isIntersecting && entry.intersectionRatio > maxRatio) {
                            maxRatio = entry.intersectionRatio
                            mostVisiblePage = parseInt(entry.target.getAttribute("data-page-number") || "1")
                        }
                    })

                    if (mostVisiblePage !== -1) {
                        setCurrentPage(mostVisiblePage)
                    }
                    observer.disconnect()
                },
                { root: container, threshold: [0.1, 0.5, 0.9] }
            )
            pageRefs.current.forEach((element) => observer.observe(element))
        }

        // Run on mount/update to set initial page
        updatePage()

        const handleScrollEnd = () => {
            updatePage()
        }

        // Add event listener for scrollend
        container.addEventListener("scrollend", handleScrollEnd)

        return () => {
            container.removeEventListener("scrollend", handleScrollEnd)
        }
    }, [numPages])

    // Scroll to highlight (using billbrain's approach)
    React.useEffect(() => {
        if (activeHighlightId) {
            const tryScroll = (attempt = 0) => {
                const element = highlightRefs.current.get(activeHighlightId)
                if (element) {
                    const container = containerRef.current
                    const rect = element.getBoundingClientRect()
                    const view = (container || document.documentElement).getBoundingClientRect()

                    // Only scroll if the annotation is not fully visible
                    if (rect.top < view.top || rect.bottom > view.bottom) {
                        element.scrollIntoView({
                            behavior: "smooth",
                            block: "center",
                            inline: "nearest",
                            // @ts-ignore
                            container: "nearest"
                        })
                    }
                } else if (attempt < 10) {
                    // Keep trying until element is rendered (up to 10 attempts)
                    requestAnimationFrame(() => tryScroll(attempt + 1))
                }
            }

            // Wait for highlight to render, then try scrolling
            setTimeout(() => requestAnimationFrame(() => tryScroll()), 50)
        }
    }, [activeHighlightId])

    const handleDocumentLoadSuccess = ({ numPages }: { numPages: number }) => {
        setNumPages(numPages)
        setError(null)
    }

    const handleDocumentLoadError = (error: Error) => {
        setError(error)
    }

    const scrollToPage = (pageNumber: number) => {
        const element = pageRefs.current.get(pageNumber)
        if (element) {
            element.scrollIntoView({ behavior: "smooth", block: "start" })
        }
    }

    const handleNextPage = () => {
        if (numPages) {
            const nextPage = getNextPage(currentPage, numPages)
            setCurrentPage(nextPage)
            scrollToPage(nextPage)
        }
    }

    const handlePrevPage = () => {
        const prevPage = getPrevPage(currentPage)
        setCurrentPage(prevPage)
        scrollToPage(prevPage)
    }

    return (
        <div className="h-full flex flex-col bg-white">
            {/* Navigation Bar */}
            <PDFHeader
                currentPage={currentPage}
                numPages={numPages}
                onPrevPage={handlePrevPage}
                onNextPage={handleNextPage}
            />

            {/* PDF Viewer */}
            <div ref={containerRef} className="flex-1 overflow-y-auto overflow-x-hidden bg-gray-50 relative" style={{ minWidth: 0 }}>
                <div className="p-4 flex justify-center">
                    <div className="w-full">
                        <div className="relative">
                            {pdfUrl ? (
                                <Document
                                    file={pdfUrl}
                                    onLoadSuccess={handleDocumentLoadSuccess}
                                    onLoadError={handleDocumentLoadError}
                                    loading={<PDFHighlighterLoading containerWidth={containerWidth || 800} />}
                                >
                                    {Array.from({ length: numPages || 0 }, (_, index) => {
                                        const pageNumber = index + 1
                                        const displayWidth = containerWidth - 32

                                        const pageHighlights = getPageHighlights(highlights, pageNumber)
                                        const activeHighlights = activeHighlightId
                                            ? pageHighlights.filter((h) => h.id === activeHighlightId)
                                            : []

                                        return (
                                            <div
                                                key={pageNumber}
                                                className="mb-8 last:mb-0 mx-auto relative"
                                                data-page-number={pageNumber}
                                                style={{ width: displayWidth }}
                                                ref={(el) => {
                                                    if (el) pageRefs.current.set(pageNumber, el)
                                                    else pageRefs.current.delete(pageNumber)
                                                }}
                                            >
                                                <Page
                                                    key={`page-${pageNumber}-${displayWidth}`}
                                                    pageNumber={pageNumber}
                                                    width={displayWidth}
                                                    className="shadow-lg max-w-full"
                                                    loading={<PDFHighlighterLoading containerWidth={displayWidth} numPages={1} />}
                                                    renderTextLayer={false}
                                                    renderAnnotationLayer={false}
                                                >
                                                    {/* Highlights */}
                                                    {activeHighlights.length > 0 && (
                                                        <div className="absolute inset-0 pointer-events-none">
                                                            {activeHighlights.map((highlight) => (
                                                                <div
                                                                    key={highlight.id}
                                                                    ref={(el) => {
                                                                        if (el) highlightRefs.current.set(highlight.id, el)
                                                                        else highlightRefs.current.delete(highlight.id)
                                                                    }}
                                                                    className="absolute transition-all duration-300 bg-blue-400/30 border-2 border-blue-500 shadow-lg"
                                                                    style={getHighlightStyles(highlight)}
                                                                />
                                                            ))}
                                                        </div>
                                                    )}
                                                </Page>
                                            </div>
                                        )
                                    })}
                                </Document>
                            ) : (
                                <div className="flex items-center justify-center h-full text-gray-400">
                                    No PDF loaded
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div >
    )
}
