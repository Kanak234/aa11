import { motion } from 'framer-motion';
import { 
  Activity, 
  Cpu, 
  Database, 
  Globe, 
  ShieldCheck, 
  TrendingUp,
  Clock,
  Zap
} from 'lucide-react';
import VoiceRecorder from '../VoiceRecorder';

const StatCard = ({ title, value, icon: Icon, color }: any) => (
  <div className="glass-panel p-6 flex flex-col gap-4">
    <div className="flex items-center justify-between">
      <div className={StatCardStyles[color]}>
        <Icon className="w-5 h-5" />
      </div>
      <span className="text-[10px] text-white/40 uppercase tracking-widest">Real-time</span>
    </div>
    <div>
      <div className="text-2xl font-bold">{value}</div>
      <div className="text-xs text-white/40 mt-1">{title}</div>
    </div>
  </div>
);

const StatCardStyles: Record<string, string> = {
  blue: "p-2 bg-ira-blue/20 text-ira-blue rounded-lg",
  violet: "p-2 bg-ira-violet/20 text-ira-violet rounded-lg",
  gold: "p-2 bg-ira-gold/20 text-ira-gold rounded-lg",
  green: "p-2 bg-emerald-500/20 text-emerald-500 rounded-lg",
};

export default function HomeModule() {
  return (
    <div className="h-full overflow-y-auto pr-2 space-y-6">
      {/* Welcome Section */}
      <section className="relative overflow-hidden rounded-3xl p-8 bg-gradient-to-br from-ira-violet/20 via-transparent to-ira-blue/20 border border-white/5">
        <div className="relative z-10">
          <h2 className="text-3xl font-serif mb-2">Welcome back, Kanak</h2>
          <p className="text-white/60 max-w-lg">
            Your personal AI ecosystem is fully synchronized. 12 autonomous tasks completed while you were away.
          </p>
          <div className="mt-6 flex gap-3">
            <button className="glass-button bg-ira-violet/20 border-ira-violet/30">
              <Zap className="w-4 h-4 text-ira-violet fill-ira-violet" />
              Optimize Workflow
            </button>
            <button className="glass-button">
              View Activity Log
            </button>
          </div>
        </div>
        <div className="absolute top-0 right-0 w-64 h-64 bg-ira-violet/10 blur-[100px] rounded-full" />
      </section>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="System Health" value="98.4%" icon={Activity} color="green" />
        <StatCard title="Neural Load" value="12.5 GFLOPS" icon={Cpu} color="violet" />
        <StatCard title="Data Synced" value="1.2 TB" icon={Database} color="blue" />
        <StatCard title="Global Reach" value="14 Nodes" icon={Globe} color="gold" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Activity */}
        <div className="lg:col-span-2 glass-panel p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-medium flex items-center gap-2">
              <Clock className="w-4 h-4 text-ira-violet" />
              Recent Neural Activity
            </h3>
            <button className="text-xs text-ira-violet hover:underline">View All</button>
          </div>
          <div className="space-y-4">
            {[
              { time: '2m ago', action: 'Code Optimization', detail: 'Refactored 12 React components in Project X', icon: Cpu },
              { time: '15m ago', action: 'Security Scan', detail: 'Blocked 3 suspicious login attempts from unknown IP', icon: ShieldCheck },
              { time: '1h ago', action: 'Media Generation', detail: 'Created 4K concept art for "Futuristic Saraswati"', icon: TrendingUp },
            ].map((item, i) => (
              <div key={i} className="flex items-start gap-4 p-3 hover:bg-white/5 rounded-xl transition-colors group">
                <div className="p-2 bg-white/5 rounded-lg group-hover:bg-ira-violet/20 transition-colors">
                  <item.icon className="w-4 h-4 text-white/60 group-hover:text-ira-violet" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">{item.action}</span>
                    <span className="text-[10px] text-white/30">{item.time}</span>
                  </div>
                  <p className="text-xs text-white/40 mt-0.5">{item.detail}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* System Status */}
        <div className="space-y-6">
          <VoiceRecorder />
          
          <div className="glass-panel p-6">
            <h3 className="font-medium mb-6">System Status</h3>
            <div className="space-y-6">
              {[
                { label: 'Core Processor', value: 42 },
                { label: 'Memory Allocation', value: 68 },
                { label: 'Network Latency', value: 12 },
                { label: 'AI Synthesis', value: 85 },
              ].map((stat, i) => (
                <div key={i} className="space-y-2">
                  <div className="flex justify-between text-xs">
                    <span className="text-white/60">{stat.label}</span>
                    <span className="font-mono">{stat.value}%</span>
                  </div>
                  <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: `${stat.value}%` }}
                      transition={{ duration: 1, delay: i * 0.1 }}
                      className="h-full bg-gradient-to-r from-ira-blue to-ira-violet"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
