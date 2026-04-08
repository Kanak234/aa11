import { motion } from 'framer-motion';
import { GraduationCap, BookOpen, Calculator, Globe, Search, FileText, Brain, Sparkles } from 'lucide-react';

export default function EduModule() {
  return (
    <div className="h-full overflow-y-auto pr-2 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-serif">Education Assistant</h2>
          <p className="text-sm text-white/40">Personalized learning path and research tools</p>
        </div>
        <button className="glass-button bg-ira-violet/20 border-ira-violet/30">
          <Brain className="w-5 h-5 text-ira-violet" />
          Create Study Plan
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Current Course', value: 'Quantum Physics', icon: BookOpen, color: 'ira-blue' },
          { label: 'Study Hours', value: '42.5h', icon: GraduationCap, color: 'ira-violet' },
          { label: 'Solved Problems', value: '156', icon: Calculator, color: 'ira-gold' },
          { label: 'Knowledge Score', value: '850', icon: Sparkles, color: 'emerald-500' },
        ].map((stat, i) => (
          <div key={i} className="glass-panel p-6">
            <stat.icon className={`w-5 h-5 text-${stat.color} mb-4`} />
            <div className="text-xl font-bold">{stat.value}</div>
            <div className="text-[10px] text-white/40 uppercase tracking-widest">{stat.label}</div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 glass-panel p-6">
          <h3 className="font-medium mb-6 flex items-center gap-2">
            <Search className="w-4 h-4 text-ira-violet" />
            Research Hub
          </h3>
          <div className="relative mb-6">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
            <input 
              type="text" 
              placeholder="Search academic papers, books, or concepts..."
              className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-10 pr-4 text-sm focus:outline-none focus:border-ira-violet/50"
            />
          </div>
          <div className="space-y-4">
            {[
              { title: 'Introduction to Neural Networks', type: 'PDF', size: '2.4 MB' },
              { title: 'Advanced Calculus: Part 2', type: 'Video', size: '45 mins' },
              { title: 'History of Ancient Civilizations', type: 'Notes', size: '12 pages' },
            ].map((item, i) => (
              <div key={i} className="flex items-center justify-between p-4 bg-white/5 rounded-xl hover:bg-white/10 transition-all cursor-pointer group">
                <div className="flex items-center gap-4">
                  <div className="p-2 bg-white/10 rounded-lg group-hover:bg-ira-violet/20">
                    <FileText className="w-4 h-4 text-white/60 group-hover:text-ira-violet" />
                  </div>
                  <div>
                    <div className="text-sm font-medium">{item.title}</div>
                    <div className="text-[10px] text-white/30">{item.type} • {item.size}</div>
                  </div>
                </div>
                <button className="text-xs text-ira-violet opacity-0 group-hover:opacity-100 transition-opacity">Open</button>
              </div>
            ))}
          </div>
        </div>

        <div className="glass-panel p-6">
          <h3 className="font-medium mb-6">Learning Progress</h3>
          <div className="space-y-6">
            {[
              { subject: 'Mathematics', progress: 75 },
              { subject: 'Computer Science', progress: 92 },
              { subject: 'Physics', progress: 45 },
              { subject: 'Economics', progress: 60 },
            ].map((item, i) => (
              <div key={i} className="space-y-2">
                <div className="flex justify-between text-xs">
                  <span className="text-white/60">{item.subject}</span>
                  <span className="font-mono">{item.progress}%</span>
                </div>
                <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${item.progress}%` }}
                    className="h-full bg-ira-violet"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
