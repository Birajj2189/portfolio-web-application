"use client"

import { useState } from "react"
import { Beaker, Copy, Check, Terminal, Palette, Calculator } from "lucide-react"
import { Button } from "@/components/ui/button"

const codeSnippets = [
  {
    title: "React Custom Hook",
    description: "A reusable hook for handling async operations with loading and error states.",
    code: `const useAsync = (asyncFn) => {
  const [state, setState] = useState({
    data: null,
    loading: false,
    error: null,
  });

  const execute = async (...args) => {
    setState({ loading: true });
    try {
      const data = await asyncFn(...args);
      setState({ data, loading: false });
    } catch (error) {
      setState({ error, loading: false });
    }
  };

  return { ...state, execute };
};`,
    language: "javascript",
  },
  {
    title: "Debounce Function",
    description: "Utility function to debounce any callback.",
    code: `const debounce = (fn, delay) => {
  let timeoutId;
  return (...args) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => {
      fn.apply(this, args);
    }, delay);
  };
};`,
    language: "javascript",
  },
]

const demos = [
  {
    title: "Color Generator",
    description: "Generate random color palettes",
    icon: Palette,
    color: "text-accent",
  },
  {
    title: "Character Counter",
    description: "Real-time text analysis",
    icon: Calculator,
    color: "text-primary",
  },
]

export function Playground() {
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null)
  const [colors, setColors] = useState(["#14b8a6", "#ec4899", "#f97316", "#eab308", "#8b5cf6"])
  const [text, setText] = useState("")

  const copyToClipboard = (code: string, index: number) => {
    navigator.clipboard.writeText(code)
    setCopiedIndex(index)
    setTimeout(() => setCopiedIndex(null), 2000)
  }

  const generateColors = () => {
    const newColors = Array.from(
      { length: 5 },
      () =>
        "#" +
        Math.floor(Math.random() * 16777215)
          .toString(16)
          .padStart(6, "0")
    )
    setColors(newColors)
  }

  return (
    <section id="playground" className="dot-pattern px-4 py-24">
      <div className="container mx-auto max-w-6xl">
        {/* Section header */}
        <div className="mb-4 flex items-center gap-4">
          <Beaker className="h-6 w-6 text-primary" />
          <h2 className="text-3xl font-bold">Developer Playground</h2>
          <div className="h-px flex-1 bg-border" />
        </div>
        <p className="mb-12 max-w-2xl text-muted-foreground">
          A space for experiments, code snippets, and interactive demos. Feel free to explore and
          copy anything useful!
        </p>

        <div className="grid gap-8 lg:grid-cols-2">
          {/* Code Snippets */}
          <div className="space-y-6">
            <h3 className="flex items-center gap-2 text-xl font-semibold">
              <Terminal className="h-5 w-5 text-muted-foreground" />
              Code Snippets
            </h3>

            {codeSnippets.map((snippet, index) => (
              <div key={snippet.title} className="glass-card overflow-hidden rounded-xl">
                <div className="flex items-center justify-between border-b border-border p-4">
                  <div>
                    <h4 className="font-medium text-foreground">{snippet.title}</h4>
                    <p className="text-xs text-muted-foreground">{snippet.description}</p>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => copyToClipboard(snippet.code, index)}
                    className="text-muted-foreground hover:text-primary"
                  >
                    {copiedIndex === index ? (
                      <Check className="h-4 w-4 text-primary" />
                    ) : (
                      <Copy className="h-4 w-4" />
                    )}
                  </Button>
                </div>
                <pre className="overflow-x-auto p-4 text-sm">
                  <code className="font-mono text-muted-foreground">{snippet.code}</code>
                </pre>
              </div>
            ))}
          </div>

          {/* Interactive Demos */}
          <div className="space-y-6">
            <h3 className="flex items-center gap-2 text-xl font-semibold">
              <Beaker className="h-5 w-5 text-muted-foreground" />
              Mini Demos
            </h3>

            {/* Color Generator */}
            <div className="glass-card rounded-xl p-6">
              <div className="mb-4 flex items-center gap-3">
                <Palette className="h-5 w-5 text-accent" />
                <h4 className="font-medium text-foreground">Color Generator</h4>
              </div>
              <div className="mb-4 flex gap-2">
                {colors.map((color, i) => (
                  <button
                    key={i}
                    className="h-12 w-12 cursor-pointer rounded-lg transition-transform hover:scale-110"
                    style={{ backgroundColor: color }}
                    onClick={() => {
                      navigator.clipboard.writeText(color)
                    }}
                    title={`Click to copy: ${color}`}
                  />
                ))}
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={generateColors}
                className="w-full border-border hover:border-accent hover:text-accent"
              >
                Generate New Palette
              </Button>
            </div>

            {/* Character Counter */}
            <div className="glass-card rounded-xl p-6">
              <div className="mb-4 flex items-center gap-3">
                <Calculator className="h-5 w-5 text-primary" />
                <h4 className="font-medium text-foreground">Character Counter</h4>
              </div>
              <textarea
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="Type something here..."
                className="h-24 w-full resize-none rounded-lg border border-border bg-secondary p-3 text-foreground transition-colors placeholder:text-muted-foreground focus:border-primary focus:outline-none"
              />
              <div className="mt-3 flex justify-between text-sm">
                <span className="text-muted-foreground">
                  Characters: <span className="font-mono text-primary">{text.length}</span>
                </span>
                <span className="text-muted-foreground">
                  Words:{" "}
                  <span className="font-mono text-accent">
                    {text.trim() ? text.trim().split(/\s+/).length : 0}
                  </span>
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
