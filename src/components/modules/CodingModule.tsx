import { useState } from 'react';
import { motion } from 'framer-motion';
import { Code2, Play, Save, RotateCcw, Terminal, FileCode, Search, Bug, Zap } from 'lucide-react';
import { generateCode } from '../../services/geminiService';
import { cn } from '../../lib/utils';

export default function CodingModule() {
  const [code, setCode] = useState(`// Ira Coding Studio v1.0
// Language: TypeScript

function calculateWisdom(knowledge: number, experience: number): number {
  return (knowledge * 0.4) + (experience * 0.6);
}

console.log("Wisdom Level:", calculateWisdom(85, 92));`);

  const [output, setOutput] = useState('System ready. Waiting for execution...');
  const [isLoading, setIsLoading] = useState(false);

  const handleRun = () => {
    setIsLoading(true);
    setOutput('Compiling neural pathways...\nExecuting code in sandbox environment...\n\n> Wisdom Level: 89.2\n\nExecution finished successfully.');
    setTimeout(() => setIsLoading(false), 1000);
  };

  const handleAISuggest = async () => {
    setIsLoading(true);
    const suggestion = await generateCode(`Optimize this code and explain improvements:\n\n${code}`);
    setOutput(`Ira AI Suggestion:\n\n${suggestion}`);
    setIsLoading(false);
  };

  return (
    <div className="h-full flex flex-col gap-4">
      {/* Toolbar */}
      <div className="glass-panel p-2 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 px-3 py-1.5 bg-white/5 rounded-lg border border-white/10">
            <FileCode className="w-4 h-4 text-ira-gold" />
            <span className="text-xs font-mono">main.ts</span>
          </div>
          <div className="h-4 w-px bg-white/10" />
          <div className="flex gap-1">
            <button className="p-2 hover:bg-white/10 rounded-lg text-white/60 transition-colors" title="Search">
              <Search className="w-4 h-4" />
            </button>
            <button className="p-2 hover:bg-white/10 rounded-lg text-white/60 transition-colors" title="Debug">
              <Bug className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button 
            onClick={handleAISuggest}
            className="glass-button text-xs py-1.5"
          >
            <Zap className="w-3 h-3 text-ira-gold fill-ira-gold" />
            AI Optimize
          </button>
          <button 
            onClick={handleRun}
            disabled={isLoading}
            className="flex items-center gap-2 px-4 py-1.5 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg text-xs font-bold transition-all disabled:opacity-50"
          >
            {isLoading ? <RotateCcw className="w-3 h-3 animate-spin" /> : <Play className="w-3 h-3 fill-current" />}
            RUN
          </button>
          <button className="p-2 bg-white/5 hover:bg-white/10 rounded-lg text-white/60 transition-colors">
            <Save className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="flex-1 grid grid-cols-1 lg:grid-cols-3 gap-4 overflow-hidden">
        {/* Editor Area */}
        <div className="lg:col-span-2 glass-panel flex flex-col overflow-hidden">
          <div className="p-3 border-b border-white/5 flex items-center gap-2 bg-white/5">
            <Code2 className="w-4 h-4 text-ira-gold" />
            <span className="text-[10px] uppercase tracking-widest font-bold opacity-40">Editor</span>
          </div>
          <textarea
            value={code}
            onChange={(e) => setCode(e.target.value)}
            className="flex-1 bg-transparent p-6 font-mono text-sm focus:outline-none resize-none leading-relaxed text-ira-gold/90"
            spellCheck={false}
          />
        </div>

        {/* Console / Output */}
        <div className="glass-panel flex flex-col overflow-hidden">
          <div className="p-3 border-b border-white/5 flex items-center gap-2 bg-white/5">
            <Terminal className="w-4 h-4 text-ira-blue" />
            <span className="text-[10px] uppercase tracking-widest font-bold opacity-40">Output Console</span>
          </div>
          <div className="flex-1 bg-black/40 p-6 font-mono text-xs text-ira-blue/80 overflow-y-auto whitespace-pre-wrap">
            {output}
          </div>
          <div className="p-3 bg-white/5 border-t border-white/5 flex items-center justify-between">
            <span className="text-[10px] text-white/20 uppercase tracking-tighter">Exit Code: 0</span>
            <span className="text-[10px] text-white/20 uppercase tracking-tighter">UTF-8</span>
          </div>
        </div>
      </div>
    </div>
  );
}
