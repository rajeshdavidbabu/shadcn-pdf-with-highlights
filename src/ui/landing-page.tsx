import * as React from "react"
import { Github } from "lucide-react"
import { Button } from "./components/pdf-with-highlights"

interface LandingPageProps {
    children: React.ReactNode
}

export function LandingPage({ children }: LandingPageProps) {
    const demoRef = React.useRef<HTMLDivElement>(null)

    const scrollToDemo = () => {
        demoRef.current?.scrollIntoView({ behavior: "smooth" })
    }

    return (
        <div className="min-h-screen bg-white font-sans text-gray-900">
            {/* Header */}
            <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md">
                <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
                    <div className="flex items-center gap-2">
                        <span className="text-xl font-bold tracking-tight">shadcn-pdf-with-highlights</span>
                    </div>
                    <div className="flex items-center gap-4">
                        <a
                            href="https://github.com/rajeshdavidbabu/shadcn-pdf-with-highlights"
                            target="_blank"
                            rel="noreferrer"
                            className="text-gray-500 hover:text-gray-900 transition-colors"
                        >
                            <Github className="h-6 w-6" />
                        </a>
                    </div>
                </div>
            </header>

            {/* Hero Section */}
            <section className="min-h-screen flex items-center justify-center px-6 text-center">
                <div className="mx-auto max-w-5xl space-y-6">
                    <h1 className="md:text-6xl font-bold tracking-tight text-gray-900 leading-tight">
                        The Missing PDF Viewer for RAG Applications
                    </h1>
                    <p className="mx-auto max-w-3xl text-xl tracking-tight md:text-xl leading-relaxed font-medium">
                        Show users exactly where your AI found the answer on your PDF documents using your OCR layout coordinates.
                    </p>
                    <div className="flex items-center justify-center gap-4 pt-6">
                        <Button
                            size="lg"
                            onClick={scrollToDemo}
                            className="h-12 px-8 text-base text-white cursor-pointer bg-blue-600 hover:bg-blue-700 hover:shadow-xl transition-all font-medium color-white"
                        >
                            Try Live Demo
                        </Button>
                        <Button variant="outline" size="lg" className="h-12 px-8 text-base border-blue-600 text-blue-600 hover:bg-blue-50 font-medium" asChild>
                            <a href="https://github.com/rajeshdavidbabu/shadcn-pdf-with-highlights" target="_blank" rel="noreferrer">
                                View on GitHub
                            </a>
                        </Button>
                    </div>
                </div>
            </section>

            {/* Demo Section */}
            <section ref={demoRef} className="min-h-screen flex items-center justify-center py-20 bg-gray-50 border-t border-gray-200">
                <div className="mx-auto max-w-7xl px-6 w-full">
                    <div className="mb-12 text-center">
                        <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">Live Interactive Demo</h2>
                        <p className="mt-4 text-lg tracking-tight">
                            Click on the extracted fields in the Data Panel to see the viewer automatically scroll to the source.
                        </p>
                    </div>

                    {/* Demo Container - This is where the App content goes */}
                    <div className="h-[800px] w-full rounded-xl border border-gray-200 bg-white shadow-2xl overflow-hidden">
                        {children}
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="bg-white py-12">
                <div className="mx-auto max-w-7xl px-6 text-center text-gray-500">
                    <p>&copy; {new Date().getFullYear()}. Open source and MIT licensed. <br />Built with ❤️ by <a href="https://github.com/rajeshdavidbabu" target="_blank" rel="noreferrer">Raj</a></p>
                </div>
            </footer>
        </div>
    )
}
