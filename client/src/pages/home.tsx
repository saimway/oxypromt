import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Copy, ArrowRight, Loader2, Maximize2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";

type EnhancedData = {
  original_prompt: string;
  enhanced_prompt: string;
  analysis: {
    intent: string;
    complexity: string;
    tone: string;
  };
  suggested_parameters: {
    temperature: number;
    max_tokens: number;
    top_p: number;
  };
  metadata: {
    timestamp: string;
    version: string;
    processing_time_ms: number;
  };
};

export default function Home() {
  const [prompt, setPrompt] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<EnhancedData | null>(null);
  const { toast } = useToast();

  const handleEnhance = () => {
    if (!prompt.trim()) {
      toast({
        title: "Input required",
        description: "Please enter a prompt to begin.",
      });
      return;
    }

    setIsLoading(true);
    setResult(null);

    // Simulate API delay
    setTimeout(() => {
      const enhanced = enhancePrompt(prompt);
      setResult(enhanced);
      setIsLoading(false);
    }, 1200);
  };

  const enhancePrompt = (input: string): EnhancedData => {
    const keywords = ["clear", "concise", "structured"];
    const tone = input.length > 50 ? "Detailed" : "Direct";
    
    return {
      original_prompt: input,
      enhanced_prompt: `${input}. Ensure the output is strictly formatted JSON. Focus on ${keywords.join(", ")}.`,
      analysis: {
        intent: "Structured Extraction",
        complexity: input.length > 100 ? "High" : "Standard",
        tone: tone,
      },
      suggested_parameters: {
        temperature: 0.3,
        max_tokens: 1024,
        top_p: 1.0,
      },
      metadata: {
        timestamp: new Date().toISOString(),
        version: "v1.0.0",
        processing_time_ms: Math.floor(Math.random() * 200) + 50,
      },
    };
  };

  const copyToClipboard = () => {
    if (result) {
      navigator.clipboard.writeText(JSON.stringify(result, null, 2));
      toast({
        description: "Copied to clipboard",
      });
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col font-sans selection:bg-black selection:text-white">
      {/* Navigation / Header */}
      <header className="border-b border-border/40 bg-background/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-6 h-16 flex items-center justify-between">
          <div className="text-sm font-medium tracking-tight">Prompt Enhancer</div>
          <div className="text-xs text-muted-foreground font-mono">v1.0</div>
        </div>
      </header>

      <main className="flex-grow container mx-auto px-6 py-12 md:py-24 max-w-5xl">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-24">
          
          {/* Left Column: Input */}
          <section className="space-y-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <h1 className="text-4xl font-light tracking-tight mb-4 text-primary">
                Input
              </h1>
              <p className="text-muted-foreground text-lg font-light mb-8 leading-relaxed">
                Enter your raw prompt below. We will structure and enhance it for optimal machine interpretation.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="group relative"
            >
              <Textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="Type something..."
                className="min-h-[320px] resize-none border-0 border-l border-border pl-6 rounded-none focus-visible:ring-0 focus-visible:border-primary bg-transparent text-lg placeholder:text-muted-foreground/40 transition-colors"
              />
              <div className="absolute top-0 left-0 w-[1px] h-0 bg-primary transition-all duration-500 group-focus-within:h-full" />
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <Button
                onClick={handleEnhance}
                disabled={isLoading}
                className="h-14 px-8 rounded-none text-base font-normal bg-primary text-primary-foreground hover:bg-primary/90 transition-all w-full md:w-auto flex items-center justify-between group"
              >
                <span>{isLoading ? "Processing" : "Process Prompt"}</span>
                {isLoading ? (
                  <Loader2 className="ml-4 w-4 h-4 animate-spin" />
                ) : (
                  <ArrowRight className="ml-4 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                )}
              </Button>
            </motion.div>
          </section>

          {/* Right Column: Output */}
          <section className="relative">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="h-full flex flex-col"
            >
               <div className="flex items-center justify-between mb-8">
                <h2 className="text-4xl font-light tracking-tight text-primary">
                  Output
                </h2>
                {result && (
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={copyToClipboard}
                    className="rounded-full w-10 h-10 border-border hover:bg-secondary hover:text-foreground transition-colors"
                  >
                    <Copy className="w-4 h-4" />
                  </Button>
                )}
              </div>

              <div className="flex-grow relative min-h-[400px]">
                <AnimatePresence mode="wait">
                  {result ? (
                    <motion.div
                      key="result"
                      initial={{ opacity: 0, filter: "blur(10px)" }}
                      animate={{ opacity: 1, filter: "blur(0px)" }}
                      exit={{ opacity: 0, filter: "blur(10px)" }}
                      transition={{ duration: 0.4 }}
                      className="bg-secondary/50 p-6 h-full overflow-auto font-mono text-sm leading-relaxed text-foreground/80 border border-border/50"
                    >
                      <pre>{JSON.stringify(result, null, 2)}</pre>
                    </motion.div>
                  ) : (
                    <motion.div
                      key="empty"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="absolute inset-0 flex items-center justify-center border border-dashed border-border"
                    >
                      <span className="text-muted-foreground font-light">
                        Waiting for input...
                      </span>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          </section>
        </div>
      </main>

      <footer className="border-t border-border/40 py-8 mt-auto">
         <div className="container mx-auto px-6 flex justify-between items-center text-xs text-muted-foreground">
            <span>&copy; 2024 Prompt Enhancer</span>
            <div className="flex space-x-6">
              <a href="#" className="hover:text-foreground transition-colors">Documentation</a>
              <a href="#" className="hover:text-foreground transition-colors">Privacy</a>
            </div>
         </div>
      </footer>
    </div>
  );
}