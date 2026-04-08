import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ImageIcon, Video, Sparkles, Download, RefreshCw, Wand2, Layout, Layers, Loader2 } from 'lucide-react';
import { GoogleGenAI } from "@google/genai";
import { cn } from '../../lib/utils';

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export default function MediaModule() {
  const [activeTab, setActiveTab] = useState<'image' | 'video'>('image');
  const [prompt, setPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [history, setHistory] = useState<string[]>([]);

  const handleGenerateImage = async () => {
    if (!prompt.trim() || isGenerating) return;
    setIsGenerating(true);
    
    try {
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash-image',
        contents: {
          parts: [{ text: prompt }],
        },
      });

      for (const part of response.candidates?.[0]?.content?.parts || []) {
        if (part.inlineData) {
          const imageUrl = `data:image/png;base64,${part.inlineData.data}`;
          setGeneratedImage(imageUrl);
          setHistory(prev => [imageUrl, ...prev].slice(0, 10));
          break;
        }
      }
    } catch (error) {
      console.error("Image Generation Error:", error);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="h-full flex flex-col gap-6 overflow-y-auto pr-2">
      {/* Header & Tabs */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-serif">Media Studio</h2>
          <p className="text-sm text-white/40">Generate high-fidelity AI art and cinematic videos</p>
        </div>
        <div className="flex p-1 bg-white/5 rounded-xl border border-white/10">
          <button 
            onClick={() => setActiveTab('image')}
            className={cn(
              "px-4 py-2 rounded-lg text-xs font-medium transition-all flex items-center gap-2",
              activeTab === 'image' ? "bg-ira-blue text-white shadow-lg shadow-ira-blue/20" : "text-white/40 hover:text-white"
            )}
          >
            <ImageIcon className="w-4 h-4" />
            Image Gen
          </button>
          <button 
            onClick={() => setActiveTab('video')}
            className={cn(
              "px-4 py-2 rounded-lg text-xs font-medium transition-all flex items-center gap-2",
              activeTab === 'video' ? "bg-ira-violet text-white shadow-lg shadow-ira-violet/20" : "text-white/40 hover:text-white"
            )}
          >
            <Video className="w-4 h-4" />
            Video Gen
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 flex-1 min-h-0">
        {/* Controls */}
        <div className="glass-panel p-6 space-y-6">
          <div className="space-y-4">
            <label className="text-xs font-bold uppercase tracking-widest opacity-40">Prompt</label>
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder={activeTab === 'image' ? "Describe the image you want to create..." : "Describe the cinematic scene..."}
              className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-sm focus:outline-none focus:border-ira-blue/50 transition-all min-h-[120px] resize-none"
            />
          </div>

          <div className="space-y-4">
            <label className="text-xs font-bold uppercase tracking-widest opacity-40">Settings</label>
            <div className="grid grid-cols-2 gap-3">
              <button className="p-3 bg-white/5 border border-white/10 rounded-xl text-[10px] flex flex-col items-center gap-2 hover:bg-white/10 transition-all">
                <Layout className="w-4 h-4 text-ira-blue" />
                Aspect Ratio
              </button>
              <button className="p-3 bg-white/5 border border-white/10 rounded-xl text-[10px] flex flex-col items-center gap-2 hover:bg-white/10 transition-all">
                <Layers className="w-4 h-4 text-ira-violet" />
                Style Preset
              </button>
            </div>
          </div>

          <button 
            onClick={activeTab === 'image' ? handleGenerateImage : undefined}
            disabled={!prompt.trim() || isGenerating}
            className={cn(
              "w-full py-4 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all",
              prompt.trim() && !isGenerating
                ? "bg-gradient-to-r from-ira-blue to-ira-violet text-white shadow-xl shadow-ira-violet/20 hover:scale-[1.02]"
                : "bg-white/5 text-white/20 cursor-not-allowed"
            )}
          >
            {isGenerating ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <Wand2 className="w-5 h-5" />
            )}
            {isGenerating ? "Synthesizing..." : `Generate ${activeTab === 'image' ? 'Art' : 'Video'}`}
          </button>
        </div>

        {/* Preview Area */}
        <div className="lg:col-span-2 flex flex-col gap-6">
          <div className="flex-1 glass-panel relative overflow-hidden group min-h-[400px]">
            <AnimatePresence mode="wait">
              {generatedImage ? (
                <motion.div
                  key={generatedImage}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="absolute inset-0"
                >
                  <img 
                    src={generatedImage} 
                    alt="Generated Art" 
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-6">
                    <div className="flex gap-3 w-full">
                      <button className="glass-button flex-1 justify-center">
                        <Download className="w-4 h-4" />
                        Download 4K
                      </button>
                      <button className="glass-button flex-1 justify-center">
                        <RefreshCw className="w-4 h-4" />
                        Variations
                      </button>
                    </div>
                  </div>
                </motion.div>
              ) : (
                <div className="absolute inset-0 flex flex-col items-center justify-center text-white/20 p-12 text-center">
                  <div className="w-20 h-20 rounded-full bg-white/5 flex items-center justify-center mb-6">
                    <Sparkles className="w-10 h-10" />
                  </div>
                  <h3 className="text-xl font-serif text-white/40">Ready for Creation</h3>
                  <p className="text-sm max-w-xs mt-2">Enter a prompt and let Ira synthesize your vision into reality.</p>
                </div>
              )}
            </AnimatePresence>
            
            {isGenerating && (
              <div className="absolute inset-0 bg-ira-dark/60 backdrop-blur-sm flex flex-col items-center justify-center z-10">
                <Loader2 className="w-12 h-12 text-ira-blue animate-spin mb-4" />
                <div className="text-sm font-medium tracking-widest uppercase animate-pulse">Neural Synthesis in Progress</div>
              </div>
            )}
          </div>

          {/* History */}
          <div className="h-32 flex gap-4 overflow-x-auto pb-2">
            {history.map((img, i) => (
              <button 
                key={i}
                onClick={() => setGeneratedImage(img)}
                className="h-full aspect-square rounded-xl overflow-hidden border border-white/10 hover:border-ira-blue transition-all shrink-0"
              >
                <img src={img} alt="History" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
              </button>
            ))}
            {history.length === 0 && (
              <div className="h-full w-full flex items-center justify-center border border-dashed border-white/10 rounded-xl text-[10px] text-white/20 uppercase tracking-widest">
                No generation history
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
