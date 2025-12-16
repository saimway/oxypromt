import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Wind, Command, ArrowUpRight, Copy, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import bgImage from "@assets/generated_images/ethereal_airy_gradient_background_with_soft_light.png";

type EnhancedData = {
  clarified_intent: string;
  structured_prompt: string;
  parameters: Record<string, any>;
  tags: string[];
};

export default function Home() {
  const [prompt, setPrompt] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<EnhancedData | null>(null);
  const { toast } = useToast();

  const handleProcess = () => {
    if (!prompt.trim()) return;

    setIsLoading(true);
    setResult(null);

    setTimeout(() => {
      setResult({
        clarified_intent: "Generate high-fidelity visual asset based on abstract description.",
        structured_prompt: `Subject: ${prompt}\nStyle: Photorealistic, Airy, Minimalist\nLighting: Soft diffused daylight\nCamera: 85mm f/1.8\nRender: Octane Render, 8k`,
        parameters: {
          aspect_ratio: "16:9",
          chaos: 10,
          stylize: 250
        },
        tags: ["ethereal", "glass", "light", "clean"]
      });
      setIsLoading(false);
    }, 1500);
  };

  return (
    <div className="min-h-screen relative overflow-hidden font-sans text-slate-700 selection:bg-sky-200 selection:text-sky-900">
      
      {/* Background Layer */}
      <div 
        className="fixed inset-0 z-[-1] bg-cover bg-center opacity-80"
        style={{ backgroundImage: `url(${bgImage})` }}
      />
      <div className="fixed inset-0 z-[-1] bg-white/30 backdrop-blur-[2px]" />

      <main className="container mx-auto px-6 py-12 md:py-20 max-w-7xl min-h-screen flex flex-col justify-center">
        
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="mb-16 md:mb-24 space-y-2"
        >
          <div className="flex items-center space-x-2 text-sky-600 mb-4 opacity-80">
            <Wind className="w-5 h-5" />
            <span className="text-sm font-semibold tracking-wide uppercase font-display">OxyPrompt v2</span>
          </div>
          <h1 className="text-6xl md:text-8xl font-display font-light tracking-tighter text-slate-800">
            Breathe <span className="font-medium text-transparent bg-clip-text bg-gradient-to-r from-sky-500 to-indigo-500">Clarity</span>
            <br />
            Into Your Ideas.
          </h1>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-8 md:gap-16 items-start">
          
          {/* Input Glass Card */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="glass-pane p-8 rounded-[2rem] relative overflow-hidden group">
               {/* Subtle glare effect */}
               <div className="absolute -top-24 -left-24 w-48 h-48 bg-white/40 blur-[50px] pointer-events-none group-hover:bg-white/60 transition-colors duration-700" />
               
               <label className="block text-sm font-medium text-slate-500 mb-6 font-display uppercase tracking-widest">
                 Raw Input
               </label>
               
               <Textarea
                 value={prompt}
                 onChange={(e) => setPrompt(e.target.value)}
                 placeholder="Describe your vision..."
                 className="min-h-[300px] bg-transparent border-0 resize-none text-2xl md:text-3xl font-light leading-normal placeholder:text-slate-300 focus-visible:ring-0 p-0 text-slate-700"
               />

               <div className="mt-8 flex justify-end">
                 <Button
                   onClick={handleProcess}
                   disabled={isLoading || !prompt.trim()}
                   className="h-14 px-8 rounded-full bg-slate-900 hover:bg-slate-800 text-white shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]"
                 >
                   {isLoading ? (
                     <div className="flex items-center space-x-2">
                       <div className="w-2 h-2 bg-white rounded-full animate-bounce [animation-delay:-0.3s]" />
                       <div className="w-2 h-2 bg-white rounded-full animate-bounce [animation-delay:-0.15s]" />
                       <div className="w-2 h-2 bg-white rounded-full animate-bounce" />
                     </div>
                   ) : (
                     <span className="flex items-center text-base font-medium">
                       Clarify <ArrowUpRight className="ml-2 w-5 h-5" />
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
                  className="glass-pane p-8 rounded-[2rem] min-h-[480px] flex flex-col"
                >
                  <div className="flex items-center justify-between mb-8 pb-8 border-b border-slate-200/50">
                    <h3 className="text-xl font-display font-medium text-slate-800">Crystallized Output</h3>
                    <Button variant="ghost" size="icon" className="rounded-full hover:bg-white/50 text-slate-500">
                      <Copy className="w-5 h-5" />
                    </Button>
                  </div>

                  <div className="space-y-8 overflow-y-auto pr-2 custom-scrollbar">
                    
                    <div>
                      <h4 className="text-xs font-bold text-sky-500 uppercase tracking-widest mb-2">Intent</h4>
                      <p className="text-lg text-slate-700 leading-relaxed font-light">{result.clarified_intent}</p>
                    </div>

                    <div>
                      <h4 className="text-xs font-bold text-sky-500 uppercase tracking-widest mb-3">Structure</h4>
                      <div className="bg-white/40 rounded-xl p-6 font-mono text-sm text-slate-600 border border-white/50 shadow-inner">
                        <pre className="whitespace-pre-wrap">{result.structured_prompt}</pre>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      {result.tags.map(tag => (
                        <span key={tag} className="px-3 py-1 bg-white/60 border border-white/40 rounded-full text-xs font-medium text-slate-500">
                          #{tag}
                        </span>
                      ))}
                    </div>

                  </div>
                </motion.div>
              ) : (
                <motion.div
                  key="empty"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="h-full min-h-[480px] rounded-[2rem] border-2 border-dashed border-white/30 flex flex-col items-center justify-center text-center p-8"
                >
                  <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mb-6 backdrop-blur-sm">
                    <Command className="w-8 h-8 text-white/60" />
                  </div>
                  <p className="text-slate-500/60 font-medium text-lg max-w-xs">
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