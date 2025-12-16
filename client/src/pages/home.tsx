import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Copy, Sparkles, Terminal, Cpu, Zap, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import bgImage from "@assets/generated_images/abstract_dark_cybernetic_data_flow_background.png";

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

  const handleTransmute = () => {
    if (!prompt.trim()) {
      toast({
        title: "Empty Input",
        description: "Please enter a prompt to transmute.",
        variant: "destructive",
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
      toast({
        title: "Transmutation Complete",
        description: "Your prompt has been enhanced.",
      });
    }, 1500);
  };

  const enhancePrompt = (input: string): EnhancedData => {
    // Mock enhancement logic
    const keywords = ["detailed", "high quality", "4k", "professional"];
    const tone = input.length > 50 ? "Narrative" : "Direct";
    
    return {
      original_prompt: input,
      enhanced_prompt: `${input}, ${keywords.join(", ")}, cinematic lighting, highly detailed, trending on artstation`,
      analysis: {
        intent: "Creative Generation",
        complexity: input.length > 100 ? "High" : "Medium",
        tone: tone,
      },
      suggested_parameters: {
        temperature: 0.7,
        max_tokens: 2048,
        top_p: 0.9,
      },
      metadata: {
        timestamp: new Date().toISOString(),
        version: "v2.5.0-alpha",
        processing_time_ms: Math.floor(Math.random() * 500) + 100,
      },
    };
  };

  const copyToClipboard = () => {
    if (result) {
      navigator.clipboard.writeText(JSON.stringify(result, null, 2));
      toast({
        title: "Copied",
        description: "JSON copied to clipboard.",
      });
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden text-foreground font-sans selection:bg-primary selection:text-primary-foreground">
      {/* Background with overlay */}
      <div 
        className="fixed inset-0 z-[-1] opacity-20 bg-cover bg-center pointer-events-none"
        style={{ backgroundImage: `url(${bgImage})` }}
      />
      <div className="fixed inset-0 z-[-1] bg-gradient-to-b from-background via-transparent to-background pointer-events-none" />
      
      {/* Scanline effect */}
      <div className="fixed inset-0 z-50 pointer-events-none opacity-[0.03] scanline" />

      <div className="container mx-auto px-4 py-12 max-w-6xl relative z-10">
        
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="text-center mb-16 space-y-4"
        >
          <div className="inline-flex items-center justify-center p-2 rounded-full border border-primary/20 bg-primary/5 mb-4 backdrop-blur-sm">
            <Cpu className="w-4 h-4 text-primary mr-2" />
            <span className="text-xs font-mono text-primary tracking-widest uppercase">System Online // v2.5.0</span>
          </div>
          <h1 className="text-5xl md:text-7xl font-bold tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-white via-primary/80 to-secondary/80 text-glow">
            PROMPT ALCHEMIST
          </h1>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto font-light border-l-2 border-primary/30 pl-4 text-left md:text-center md:border-l-0 md:pl-0">
            Transmute raw ideas into structured, machine-perfect JSON data. 
            <br className="hidden md:block"/>
            Enhance clarity, specificity, and execution parameters.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
          
          {/* Input Section */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <Card className="glass-panel border-primary/20 overflow-hidden relative group">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary to-secondary opacity-50 group-hover:opacity-100 transition-opacity" />
              
              <div className="p-6 space-y-6">
                <div className="flex justify-between items-center">
                  <h2 className="text-xl font-bold font-mono flex items-center text-primary">
                    <Terminal className="w-5 h-5 mr-2" />
                    INPUT_STREAM
                  </h2>
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                    <div className="w-2 h-2 rounded-full bg-yellow-500" />
                    <div className="w-2 h-2 rounded-full bg-green-500" />
                  </div>
                </div>

                <div className="relative">
                  <Textarea
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    placeholder="Enter your raw prompt here... e.g., 'A cyberpunk city at night'"
                    className="min-h-[300px] bg-black/20 border-primary/10 focus:border-primary/50 font-mono text-sm resize-none p-4 rounded-md focus:ring-1 focus:ring-primary/50 transition-all placeholder:text-muted-foreground/30"
                  />
                  <div className="absolute bottom-4 right-4 text-xs text-muted-foreground/50 font-mono pointer-events-none">
                    {prompt.length} CHARS
                  </div>
                </div>

                <Button 
                  onClick={handleTransmute} 
                  disabled={isLoading}
                  className="w-full h-14 text-lg font-bold tracking-widest uppercase bg-primary/10 hover:bg-primary/20 text-primary border border-primary/50 hover:border-primary shadow-[0_0_20px_-5px_hsl(var(--primary)/0.3)] hover:shadow-[0_0_30px_-5px_hsl(var(--primary)/0.6)] transition-all duration-300 relative overflow-hidden group/btn"
                >
                  <span className="relative z-10 flex items-center justify-center">
                    {isLoading ? (
                      <>
                        <RotateCcw className="w-5 h-5 mr-3 animate-spin" />
                        Processing...
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-5 h-5 mr-3" />
                        Transmute
                      </>
                    )}
                  </span>
                  <div className="absolute inset-0 bg-primary/10 translate-y-[100%] group-hover/btn:translate-y-0 transition-transform duration-300 ease-out" />
                </Button>
              </div>
            </Card>
          </motion.div>

          {/* Output Section */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <Card className="glass-panel border-secondary/20 h-full min-h-[480px] relative overflow-hidden flex flex-col">
               <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-secondary to-primary opacity-50" />
               
               <div className="p-6 flex-grow flex flex-col">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-bold font-mono flex items-center text-secondary">
                    <Zap className="w-5 h-5 mr-2" />
                    OUTPUT_DATA
                  </h2>
                  {result && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={copyToClipboard}
                      className="text-muted-foreground hover:text-foreground font-mono text-xs"
                    >
                      <Copy className="w-4 h-4 mr-2" />
                      COPY_JSON
                    </Button>
                  )}
                </div>

                <div className="flex-grow bg-black/40 rounded-md border border-white/5 p-4 relative overflow-hidden group">
                  {isLoading ? (
                    <div className="absolute inset-0 flex items-center justify-center flex-col space-y-4">
                      <div className="relative w-16 h-16">
                        <motion.div 
                          className="absolute inset-0 border-4 border-primary/30 rounded-full"
                          animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0, 0.5] }}
                          transition={{ duration: 2, repeat: Infinity }}
                        />
                        <motion.div 
                          className="absolute inset-0 border-t-4 border-primary rounded-full"
                          animate={{ rotate: 360 }}
                          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                        />
                      </div>
                      <div className="text-xs font-mono text-primary animate-pulse">
                        ANALYZING SEMANTICS...
                      </div>
                    </div>
                  ) : result ? (
                    <motion.div
                      initial={{ opacity: 0, filter: "blur(10px)" }}
                      animate={{ opacity: 1, filter: "blur(0px)" }}
                      className="h-full overflow-auto custom-scrollbar"
                    >
                      <pre className="font-mono text-sm text-blue-300 leading-relaxed">
                        <code>
                          {JSON.stringify(result, null, 2)}
                        </code>
                      </pre>
                    </motion.div>
                  ) : (
                    <div className="h-full flex flex-col items-center justify-center text-muted-foreground/30 space-y-4">
                      <Terminal className="w-16 h-16 opacity-20" />
                      <p className="font-mono text-sm">AWAITING INPUT STREAM...</p>
                    </div>
                  )}
                  
                  {/* Decorative corner accents */}
                  <div className="absolute top-0 left-0 w-4 h-4 border-t border-l border-white/20" />
                  <div className="absolute top-0 right-0 w-4 h-4 border-t border-r border-white/20" />
                  <div className="absolute bottom-0 left-0 w-4 h-4 border-b border-l border-white/20" />
                  <div className="absolute bottom-0 right-0 w-4 h-4 border-b border-r border-white/20" />
                </div>
               </div>
            </Card>
          </motion.div>

        </div>
      </div>
      
      {/* Decorative background elements */}
      <div className="fixed top-1/4 -left-20 w-96 h-96 bg-primary/20 rounded-full blur-[128px] pointer-events-none mix-blend-screen" />
      <div className="fixed bottom-1/4 -right-20 w-96 h-96 bg-secondary/20 rounded-full blur-[128px] pointer-events-none mix-blend-screen" />
    </div>
  );
}