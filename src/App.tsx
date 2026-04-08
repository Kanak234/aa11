import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  LayoutDashboard, 
  MessageSquare, 
  Mic,
  Code2, 
  ShieldAlert, 
  Image as ImageIcon, 
  GraduationCap, 
  Briefcase, 
  Settings, 
  Zap,
  Search,
  User,
  Bell,
  Cpu,
  Users
} from 'lucide-react';
import { cn } from './lib/utils';
import { ModuleId, Module } from './types';

// Components (to be created)
import HomeModule from './components/modules/HomeModule';
import ChatModule from './components/modules/ChatModule';
import CodingModule from './components/modules/CodingModule';
import CyberModule from './components/modules/CyberModule';
import MediaModule from './components/modules/MediaModule';
import VoiceModule from './components/modules/VoiceModule';
import EduModule from './components/modules/EduModule';
import BusinessModule from './components/modules/BusinessModule';
import SettingsModule from './components/modules/SettingsModule';
import LandingModule from './components/modules/LandingModule';
import CommunityModule from './components/modules/CommunityModule';

const MODULES: Module[] = [
  { id: 'landing', name: 'Welcome', icon: 'Zap', description: 'Experience Ira AI', color: 'ira-gold' },
  { id: 'home', name: 'Dashboard', icon: 'LayoutDashboard', description: 'System overview and widgets', color: 'ira-blue' },
  { id: 'chat', name: 'Ira Chat', icon: 'MessageSquare', description: 'Intelligent conversation partner', color: 'ira-violet' },
  { id: 'voice', name: 'Voice Mode', icon: 'Mic', description: 'Hands-free voice interaction', color: 'ira-blue' },
  { id: 'coding', name: 'Coding Studio', icon: 'Code2', description: 'Advanced development environment', color: 'ira-gold' },
  { id: 'cyber', name: 'Cyber Lab', icon: 'ShieldAlert', description: 'Security and threat analysis', color: 'red-500' },
  { id: 'media', name: 'Media Studio', icon: 'ImageIcon', description: 'AI art and video generation', color: 'ira-blue' },
  { id: 'edu', name: 'Edu Assistant', icon: 'GraduationCap', description: 'Learning and research hub', color: 'ira-violet' },
  { id: 'business', name: 'Business Pro', icon: 'Briefcase', description: 'Automation and strategy', color: 'ira-gold' },
  { id: 'community', name: 'Community', icon: 'Users', description: 'Connect and share', color: 'ira-blue' },
  { id: 'settings', name: 'System Settings', icon: 'Settings', description: 'Customize your OS', color: 'ira-silver' },
];

const iconMap: Record<string, any> = {
  LayoutDashboard,
  MessageSquare,
  Mic,
  Code2,
  ShieldAlert,
  ImageIcon,
  GraduationCap,
  Briefcase,
  Settings,
  Zap,
  Users,
};

export default function App() {
  const [activeModule, setActiveModule] = useState<ModuleId>('landing');
  const [isBooting, setIsBooting] = useState(true);
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setTimeout(() => setIsBooting(false), 2500);
    const clock = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => {
      clearTimeout(timer);
      clearInterval(clock);
    };
  }, []);

  const renderModule = () => {
    switch (activeModule) {
      case 'landing': return <LandingModule onGetStarted={() => setActiveModule('home')} />;
      case 'home': return <HomeModule />;
      case 'chat': return <ChatModule />;
      case 'voice': return <VoiceModule onModuleSwitch={setActiveModule} />;
      case 'coding': return <CodingModule />;
      case 'cyber': return <CyberModule />;
      case 'media': return <MediaModule />;
      case 'edu': return <EduModule />;
      case 'business': return <BusinessModule />;
      case 'community': return <CommunityModule />;
      case 'settings': return <SettingsModule />;
      default: return (
        <div className="flex items-center justify-center h-full text-white/40 italic">
          Module "{activeModule}" is currently initializing in the cloud...
        </div>
      );
    }
  };

  if (isBooting) {
    return (
      <div className="fixed inset-0 bg-ira-dark flex flex-col items-center justify-center z-50">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="relative"
        >
          <div className="w-32 h-32 rounded-full border-4 border-ira-violet/20 border-t-ira-violet animate-spin" />
          <div className="absolute inset-0 flex items-center justify-center">
            <Cpu className="w-12 h-12 text-ira-violet animate-pulse" />
          </div>
        </motion.div>
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mt-8 text-4xl font-serif ira-gradient-text tracking-widest uppercase"
        >
          Ira AI OS
        </motion.h1>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.6 }}
          transition={{ delay: 1 }}
          className="mt-2 text-sm text-ira-silver tracking-[0.3em]"
        >
          INITIALIZING WISDOM ENGINE
        </motion.p>
      </div>
    );
  }

  return (
    <div className="flex h-screen w-screen bg-ira-dark overflow-hidden text-ira-white">
      {/* Sidebar */}
      <aside className="w-20 md:w-64 glass-panel m-4 mr-2 flex flex-col overflow-hidden transition-all duration-500">
        <div className="p-6 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-ira-blue to-ira-violet flex items-center justify-center ira-glow">
            <Cpu className="w-6 h-6 text-white" />
          </div>
          <span className="hidden md:block font-serif text-xl font-medium tracking-tight">Ira AI</span>
        </div>

        <nav className="flex-1 px-4 py-2 space-y-2 overflow-y-auto">
          {MODULES.map((module) => {
            const Icon = iconMap[module.icon];
            const isActive = activeModule === module.id;
            return (
              <button
                key={module.id}
                onClick={() => setActiveModule(module.id)}
                className={cn(
                  "w-full flex items-center gap-4 p-3 rounded-xl transition-all duration-300 group",
                  isActive 
                    ? "bg-white/10 text-white border border-white/10" 
                    : "text-white/50 hover:bg-white/5 hover:text-white"
                )}
              >
                <Icon className={cn(
                  "w-6 h-6 transition-transform duration-300 group-hover:scale-110",
                  isActive && "text-ira-violet"
                )} />
                <div className="hidden md:block text-left">
                  <div className="text-sm font-medium">{module.name}</div>
                  <div className="text-[10px] opacity-40 truncate w-32">{module.description}</div>
                </div>
                {isActive && (
                  <motion.div 
                    layoutId="active-pill"
                    className="ml-auto w-1 h-6 bg-ira-violet rounded-full"
                  />
                )}
              </button>
            );
          })}
        </nav>

        <div className="p-4 border-t border-white/5">
          <button className="w-full flex items-center gap-3 p-3 text-white/50 hover:text-white transition-colors">
            <User className="w-5 h-5" />
            <span className="hidden md:block text-sm">Kanak Prabhakar</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col m-4 ml-2 gap-4 overflow-hidden">
        {/* Top Bar */}
        <header className="h-16 glass-panel px-6 flex items-center justify-between">
          <div className="flex items-center gap-4 flex-1">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
              <input 
                type="text" 
                placeholder="Search system or ask Ira..."
                className="w-full bg-white/5 border border-white/10 rounded-full py-2 pl-10 pr-4 text-sm focus:outline-none focus:border-ira-violet/50 transition-all"
              />
            </div>
          </div>

          <div className="flex items-center gap-6 ml-4">
            <div className="hidden lg:flex flex-col items-end">
              <div className="text-sm font-medium">{currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
              <div className="text-[10px] text-white/40 uppercase tracking-widest">
                {currentTime.toLocaleDateString([], { weekday: 'short', month: 'short', day: 'numeric' })}
              </div>
            </div>
            <button className="relative p-2 text-white/60 hover:text-white transition-colors">
              <Bell className="w-5 h-5" />
              <span className="absolute top-2 right-2 w-2 h-2 bg-ira-violet rounded-full border-2 border-ira-dark" />
            </button>
            <div className="flex items-center gap-2 px-3 py-1.5 bg-ira-violet/20 border border-ira-violet/30 rounded-full">
              <Zap className="w-3 h-3 text-ira-violet fill-ira-violet" />
              <span className="text-[10px] font-bold text-ira-violet uppercase tracking-tighter">Core Active</span>
            </div>
          </div>
        </header>

        {/* Module Content */}
        <div className="flex-1 overflow-hidden relative">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeModule}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
              className="h-full"
            >
              {renderModule()}
            </motion.div>
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
}
