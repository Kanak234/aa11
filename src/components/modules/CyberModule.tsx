import { useState } from 'react';
import { motion } from 'framer-motion';
import { ShieldAlert, ShieldCheck, Lock, Globe, Search, AlertTriangle, Zap, Eye, EyeOff } from 'lucide-react';
import { cn } from '../../lib/utils';

export default function CyberModule() {
  const [isScanning, setIsScanning] = useState(false);
  const [scanProgress, setScanProgress] = useState(0);

  const startScan = () => {
    setIsScanning(true);
    setScanProgress(0);
    const interval = setInterval(() => {
      setScanProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsScanning(false);
          return 100;
        }
        return prev + 2;
      });
    }, 50);
  };

  return (
    <div className="h-full overflow-y-auto pr-2 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-serif">Cybersecurity Lab</h2>
          <p className="text-sm text-white/40">Advanced threat detection and system hardening</p>
        </div>
        <button 
          onClick={startScan}
          disabled={isScanning}
          className={cn(
            "glass-button px-6 py-3",
            isScanning ? "opacity-50 cursor-not-allowed" : "bg-red-500/20 border-red-500/30 text-red-500 hover:bg-red-500/30"
          )}
        >
          <ShieldAlert className={cn("w-5 h-5", isScanning && "animate-pulse")} />
          {isScanning ? `Scanning System (${scanProgress}%)` : "Initiate Full System Scan"}
        </button>
      </div>

      {/* Threat Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[
          { label: 'Active Threats', value: '0', icon: AlertTriangle, color: 'emerald-500' },
          { label: 'Blocked Attacks', value: '1,242', icon: ShieldCheck, color: 'ira-blue' },
          { label: 'System Vulnerability', value: 'Low', icon: Lock, color: 'ira-gold' },
        ].map((stat, i) => (
          <div key={i} className="glass-panel p-6 flex items-center gap-4">
            <div className={`p-3 bg-${stat.color}/20 text-${stat.color} rounded-xl`}>
              <stat.icon className="w-6 h-6" />
            </div>
            <div>
              <div className="text-2xl font-bold">{stat.value}</div>
              <div className="text-xs text-white/40">{stat.label}</div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Real-time Monitor */}
        <div className="glass-panel p-6 flex flex-col h-[400px]">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-medium flex items-center gap-2">
              <Globe className="w-4 h-4 text-ira-blue" />
              Global Threat Map
            </h3>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 bg-red-500 rounded-full animate-ping" />
              <span className="text-[10px] text-white/40 uppercase">Live Feed</span>
            </div>
          </div>
          <div className="flex-1 bg-black/40 rounded-xl relative overflow-hidden border border-white/5">
            {/* Mock Map Background */}
            <div className="absolute inset-0 opacity-20 bg-[url('https://picsum.photos/seed/map/800/600')] bg-cover bg-center grayscale" />
            {/* Mock Attack Lines */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none">
              <motion.path
                d="M 100 100 Q 200 50 300 150"
                stroke="rgba(239, 68, 68, 0.5)"
                strokeWidth="1"
                fill="none"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 2, repeat: Infinity }}
              />
              <motion.circle
                cx="300" cy="150" r="3"
                fill="#ef4444"
                animate={{ r: [3, 6, 3] }}
                transition={{ duration: 1, repeat: Infinity }}
              />
            </svg>
            <div className="absolute bottom-4 left-4 p-3 glass-panel text-[10px] space-y-1">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 bg-red-500 rounded-full" />
                <span>Malware Origin: RU-72</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 bg-ira-blue rounded-full" />
                <span>Ira Firewall: Active</span>
              </div>
            </div>
          </div>
        </div>

        {/* Security Tools */}
        <div className="glass-panel p-6">
          <h3 className="font-medium mb-6">Security Modules</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[
              { name: 'Phishing Detector', desc: 'AI-powered email analysis', icon: Search },
              { name: 'Password Vault', desc: 'Quantum-encrypted storage', icon: Lock },
              { name: 'Dark Web Monitor', desc: 'Data leak surveillance', icon: EyeOff },
              { name: 'Network Firewall', desc: 'Real-time packet filtering', icon: Zap },
            ].map((tool, i) => (
              <button key={i} className="p-4 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 transition-all text-left group">
                <tool.icon className="w-5 h-5 text-ira-violet mb-3 group-hover:scale-110 transition-transform" />
                <div className="text-sm font-medium">{tool.name}</div>
                <div className="text-[10px] text-white/40 mt-1">{tool.desc}</div>
              </button>
            ))}
          </div>
          
          <div className="mt-8 p-4 bg-ira-gold/10 border border-ira-gold/20 rounded-xl flex items-start gap-4">
            <AlertTriangle className="w-5 h-5 text-ira-gold shrink-0 mt-1" />
            <div>
              <div className="text-sm font-medium text-ira-gold">Security Recommendation</div>
              <p className="text-xs text-ira-gold/70 mt-1 leading-relaxed">
                Your system entropy is slightly low. Consider rotating your master encryption keys for enhanced security.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
