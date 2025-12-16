import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, Wand2, Copy, Check, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";

type EnhancedData = {
  original_prompt: string;
  enhanced_prompt: string;
  magic_score: number;
  mood: string;
  metadata: {
    timestamp: string;
  };
};

export default function Home() {
  const [prompt, setPrompt] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<EnhancedData | null>(null);
  const { toast } = useToast();

  const handleMagic = () => {
    if (!prompt.trim()) {
      toast({
        title: "Oops!",
        description: "We need a little text to work our magic.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    setResult(null);

    // Simulate API delay with a "bouncy" feel
    setTimeout(() => {
      const enhanced = enhancePrompt(prompt);
      setResult(enhanced);
      setIsLoading(false);
      toast({
        title: "Ta-da!",
        description: "Your prompt has been sprinkled with magic.",
      });
    }, 1500);
  };

  const enhancePrompt = (input: string): EnhancedData => {
    return {
      original_prompt: input,
      enhanced_prompt: `${input}, highly detailed, beautiful lighting, 8k resolution, vibrant colors, dreamy atmosphere`,
      magic_score: 98,
      mood: "Whimsical",
      metadata: {
        timestamp: new Date().toISOString(),
      },
    };
  };

  const copyToClipboard = () => {
    if (result) {
      navigator.clipboard.writeText(JSON.stringify(result, null, 2));
      toast({
        title: "Copied!",
        description: "Ready to paste wherever you need.",
      });
    }
  };

  return (
    <div className="min-h-screen p-4 md:p-8 flex items-center justify-center">
      <div className="max-w-6xl w-full mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Header Section */}
        <div className="lg:col-span-4 flex flex-col justify-center space-y-6 text-center lg:text-left">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: "spring", stiffness: 260, damping: 20 }}
          >
            <div className="inline-block p-3 bg-white rounded-2xl shadow-sm mb-4">
              <Sparkles className="w-8 h-8 text-yellow-400 fill-yellow-400" />
            </div>
            <h1 className="text-5xl md:text-6xl font-display font-bold text-foreground leading-tight mb-4">
              Prompt<br />
              <span className="text-primary">Magic</span>
            </h1>
            <p className="text-lg text-muted-foreground font-medium leading-relaxed">
              Turn your rough ideas into shiny, structured JSON gold. Just type and watch it sparkle!
            </p>
          </motion.div>

          <div className="hidden lg:block bg-white/50 backdrop-blur-sm p-6 rounded-3xl border border-white/60">
            <h3 className="font-bold flex items-center mb-2 text-foreground">
              <Info className="w-4 h-4 mr-2 text-primary" />
              How it works
            </h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li className="flex items-center">
                <div className="w-1.5 h-1.5 rounded-full bg-secondary-foreground/30 mr-2" />
                Type your basic idea
              </li>
              <li className="flex items-center">
                <div className="w-1.5 h-1.5 rounded-full bg-secondary-foreground/30 mr-2" />
                Hit the magic button
              </li>
              <li className="flex items-center">
                <div className="w-1.5 h-1.5 rounded-full bg-secondary-foreground/30 mr-2" />
                Get enhanced JSON instantly
              </li>
            </ul>
          </div>
        </div>

        {/* Main Interaction Area */}
        <div className="lg:col-span-8 space-y-6">
          
          {/* Input Card */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="clay-card p-6 md:p-8 relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 p-4 opacity-10">
              <Wand2 className="w-32 h-32 rotate-12" />
            </div>
            
            <label className="block text-sm font-bold text-muted-foreground mb-3 uppercase tracking-wider">
              Your Idea
            </label>
            <Textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="I want a picture of a cute cat..."
              className="bg-muted/30 border-2 border-transparent focus:border-primary/20 focus:bg-white rounded-xl text-lg p-4 min-h-[160px] resize-none transition-all shadow-inner"
            />
            
            <div className="mt-4 flex justify-end">
              <Button 
                onClick={handleMagic}
                disabled={isLoading}
                size="lg"
                className="rounded-full px-8 py-6 text-lg font-bold shadow-lg shadow-primary/20 hover:shadow-primary/40 transition-all hover:-translate-y-1 active:translate-y-0"
              >
                {isLoading ? (
                  <motion.div 
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  >
                    <Sparkles className="w-5 h-5" />
                  </motion.div>
                ) : (
                  <>
                    Make Magic <Wand2 className="ml-2 w-5 h-5" />
                  </>
                )}
              </Button>
            </div>
          </motion.div>

          {/* Output Card */}
          <AnimatePresence>
            {result && (
              <motion.div
                initial={{ y: 20, opacity: 0, scale: 0.95 }}
                animate={{ y: 0, opacity: 1, scale: 1 }}
                exit={{ y: 20, opacity: 0, scale: 0.95 }}
                className="clay-card p-6 md:p-8 bg-gradient-to-br from-white to-secondary/20 border-secondary/20"
              >
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center space-x-3">
                    <h2 className="text-xl font-bold text-foreground">Magic Result</h2>
                    <Badge variant="secondary" className="bg-green-100 text-green-700 hover:bg-green-100 border-0">
                      Score: {result.magic_score}/100
                    </Badge>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={copyToClipboard}
                    className="text-muted-foreground hover:text-primary rounded-full hover:bg-primary/5"
                  >
                    <Copy className="w-4 h-4 mr-2" />
                    Copy JSON
                  </Button>
                </div>

                <div className="bg-black/5 rounded-xl p-6 font-mono text-sm overflow-x-auto relative group">
                  <div className="absolute top-3 right-3 flex space-x-1.5">
                    <div className="w-2.5 h-2.5 rounded-full bg-red-400/50" />
                    <div className="w-2.5 h-2.5 rounded-full bg-yellow-400/50" />
                    <div className="w-2.5 h-2.5 rounded-full bg-green-400/50" />
                  </div>
                  <pre className="text-foreground/80">
                    {JSON.stringify(result, null, 2)}
                  </pre>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

        </div>
      </div>
    </div>
  );
}