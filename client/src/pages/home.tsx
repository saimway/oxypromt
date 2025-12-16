import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Wind, Command, ArrowUpRight, Copy, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import bgImage from "@assets/generated_images/ethereal_airy_gradient_background_with_soft_light.png";

export default function Home() {
  const [prompt, setPrompt] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();

  const handleProcess = async () => {
    if (!prompt.trim()) return;

    setIsLoading(true);
    setResult(null);

    try {
      const response = await fetch("/api/enhance-prompt", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ rawPrompt: prompt }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to enhance prompt");
      }

      const data = await response.json();
      setResult(data.enhancedPrompt);
      
      toast({
        title: "Success!",
        description: "Your prompt has been enhanced",
      });
    } catch (error) {
      console.error("Error enhancing prompt:", error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to enhance prompt",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = () => {
    if (!result) return;
    navigator.clipboard.writeText(JSON.stringify(result, null, 2));
    setCopied(true);
    toast({
      title: "Copied!",
      description: "Enhanced prompt copied to clipboard",
    });
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen relative overflow-hidden font-sans text-slate-700 selection:bg-sky-200 selection:text-sky-900">
      
      {/* Background Layer */}
      <div 
        className="fixed inset-0 z-[-1] bg-cover bg-center opacity-80"
        style={{ backgroundImage: `url(${bgImage})` }}
      />
      <div className="fixed inset-0 z-[-1] bg-white/30 backdrop-blur-[2px]" />

      <main className="container mx-auto px-4 sm:px-6 py-8 sm:py-12 md:py-20 max-w-7xl min-h-screen flex flex-col justify-center">
        
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="mb-8 sm:mb-16 md:mb-24 space-y-2"
        >
          <div className="flex items-center space-x-2 text-sky-600 mb-2 sm:mb-4 opacity-80">
            <Wind className="w-4 h-4 sm:w-5 sm:h-5" />
            <span className="text-xs sm:text-sm font-semibold tracking-wide uppercase font-display">OxyPrompt v1</span>
          </div>
          <h1 className="text-3xl sm:text-5xl md:text-6xl lg:text-8xl font-display font-light tracking-tighter text-slate-800">
            Breathe <span className="font-medium text-transparent bg-clip-text bg-gradient-to-r from-sky-500 to-indigo-500">Clarity</span>
            <br />
            Into Your Ideas.
          </h1>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-6 sm:gap-8 md:gap-16 items-start">
          
          {/* Input Glass Card */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="glass-pane p-4 sm:p-6 md:p-8 rounded-2xl sm:rounded-[2rem] relative overflow-hidden group">
               {/* Subtle glare effect */}
               <div className="absolute -top-24 -left-24 w-48 h-48 bg-white/40 blur-[50px] pointer-events-none group-hover:bg-white/60 transition-colors duration-700" />
               
               <label className="block text-xs sm:text-sm font-medium text-slate-500 mb-4 sm:mb-6 font-display uppercase tracking-widest">
                 Raw Input
               </label>
               
               <Textarea
                 value={prompt}
                 onChange={(e) => setPrompt(e.target.value)}
                 placeholder="Describe your vision..."
                 className="min-h-[180px] sm:min-h-[250px] md:min-h-[300px] bg-transparent border-0 resize-none text-lg sm:text-xl md:text-2xl lg:text-3xl font-light leading-normal placeholder:text-slate-300 focus-visible:ring-0 p-0 text-slate-700"
                 data-testid="input-prompt"
               />

               <div className="mt-4 sm:mt-6 md:mt-8 flex justify-end">
                 <Button
                   onClick={handleProcess}
                   disabled={isLoading || !prompt.trim()}
                   className="h-12 sm:h-14 px-6 sm:px-8 rounded-full bg-slate-900 hover:bg-slate-800 text-white shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]"
                   data-testid="button-enhance"
                 >
                   {isLoading ? (
                     <div className="flex items-center space-x-2">
                       <div className="w-2 h-2 bg-white rounded-full animate-bounce [animation-delay:-0.3s]" />
                       <div className="w-2 h-2 bg-white rounded-full animate-bounce [animation-delay:-0.15s]" />
                       <div className="w-2 h-2 bg-white rounded-full animate-bounce" />
                     </div>
                   ) : (
                     <span className="flex items-center text-sm sm:text-base font-medium">
                       Clarify <ArrowUpRight className="ml-2 w-4 h-4 sm:w-5 sm:h-5" />
                     </span>
                   )}
                 </Button>
               </div>
            </div>
          </motion.div>

          {/* Output Glass Card */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
          >
            <AnimatePresence mode="wait">
              {result ? (
                <motion.div
                  key="result"
                  initial={{ opacity: 0, backdropFilter: "blur(0px)" }}
                  animate={{ opacity: 1, backdropFilter: "blur(20px)" }}
                  exit={{ opacity: 0, backdropFilter: "blur(0px)" }}
                  className="glass-pane p-4 sm:p-6 md:p-8 rounded-2xl sm:rounded-[2rem] min-h-[300px] sm:min-h-[400px] md:min-h-[480px] flex flex-col"
                >
                  <div className="flex items-center justify-between mb-4 sm:mb-6 md:mb-8 pb-4 sm:pb-6 md:pb-8 border-b border-slate-200/50">
                    <h3 className="text-base sm:text-lg md:text-xl font-display font-medium text-slate-800">Crystallized Output</h3>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="rounded-full hover:bg-white/50 text-slate-500 h-8 w-8 sm:h-10 sm:w-10"
                      onClick={handleCopy}
                      data-testid="button-copy"
                    >
                      {copied ? <Check className="w-4 h-4 sm:w-5 sm:h-5 text-green-600" /> : <Copy className="w-4 h-4 sm:w-5 sm:h-5" />}
                    </Button>
                  </div>

                  <div className="space-y-4 sm:space-y-6 overflow-y-auto pr-2 custom-scrollbar max-h-[250px] sm:max-h-[350px] md:max-h-[500px] flex-1" data-testid="output-result">
                    <div className="bg-white/40 rounded-lg sm:rounded-xl p-3 sm:p-4 md:p-6 font-mono text-xs sm:text-sm text-slate-600 border border-white/50 shadow-inner">
                      <pre className="whitespace-pre-wrap break-words">{JSON.stringify(result, null, 2)}</pre>
                    </div>
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  key="empty"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="h-full min-h-[200px] sm:min-h-[300px] md:min-h-[480px] rounded-2xl sm:rounded-[2rem] border-2 border-dashed border-white/30 flex flex-col items-center justify-center text-center p-4 sm:p-6 md:p-8"
                >
                  <div className="w-14 h-14 sm:w-16 sm:h-16 md:w-20 md:h-20 bg-white/20 rounded-full flex items-center justify-center mb-4 sm:mb-6 backdrop-blur-sm">
                    <Command className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 text-white/60" />
                  </div>
                  <p className="text-slate-500/60 font-medium text-sm sm:text-base md:text-lg max-w-xs">
                    Your crystallized thought will appear here.
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>

        </div>
      </main>
    </div>
  );
}