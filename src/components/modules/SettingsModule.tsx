import { useState } from 'react';
import { motion } from 'framer-motion';
import { Settings, Shield, Cpu, Palette, Globe, Bell, Database, Key, Info } from 'lucide-react';
import { cn } from '../../lib/utils';

export default function SettingsModule() {
  const [activeSection, setActiveSection] = useState('general');

  const sections = [
    { id: 'general', name: 'General', icon: Settings },
    { id: 'appearance', name: 'Appearance', icon: Palette },
    { id: 'neural', name: 'Neural Engine', icon: Cpu },
    { id: 'security', name: 'Security', icon: Shield },
    { id: 'api', name: 'API Manager', icon: Key },
  ];

  return (
    <div className="h-full flex gap-6 overflow-hidden">
      {/* Settings Nav */}
      <div className="w-48 flex flex-col gap-2">
        {sections.map((s) => (
          <button
            key={s.id}
            onClick={() => setActiveSection(s.id)}
            className={cn(
              "flex items-center gap-3 p-3 rounded-xl transition-all text-sm",
              activeSection === s.id ? "bg-white/10 text-white border border-white/10" : "text-white/40 hover:text-white hover:bg-white/5"
            )}
          >
            <s.icon className={cn("w-4 h-4", activeSection === s.id && "text-ira-violet")} />
            {s.name}
          </button>
        ))}
      </div>

      {/* Settings Content */}
      <div className="flex-1 glass-panel p-8 overflow-y-auto">
        {activeSection === 'general' && (
          <div className="space-y-8">
            <div>
              <h3 className="text-xl font-serif mb-2">General System Settings</h3>
              <p className="text-sm text-white/40">Configure core OS behavior and identity</p>
            </div>

            <div className="space-y-6">
              <div className="flex items-center justify-between p-4 bg-white/5 rounded-xl">
                <div className="flex items-center gap-4">
                  <Globe className="w-5 h-5 text-ira-blue" />
                  <div>
                    <div className="text-sm font-medium">System Language</div>
                    <div className="text-[10px] text-white/40">Default: English (Global)</div>
                  </div>
                </div>
                <select className="bg-white/10 border border-white/10 rounded-lg text-xs px-3 py-1.5 focus:outline-none">
                  <option>English</option>
                  <option>Hindi</option>
                  <option>Sanskrit</option>
                </select>
              </div>

              <div className="flex items-center justify-between p-4 bg-white/5 rounded-xl">
                <div className="flex items-center gap-4">
                  <Bell className="w-5 h-5 text-ira-violet" />
                  <div>
                    <div className="text-sm font-medium">Neural Notifications</div>
                    <div className="text-[10px] text-white/40">Real-time system alerts</div>
                  </div>
                </div>
                <div className="w-10 h-5 bg-ira-violet rounded-full relative cursor-pointer">
                  <div className="absolute right-1 top-1 w-3 h-3 bg-white rounded-full" />
                </div>
              </div>

              <div className="flex items-center justify-between p-4 bg-white/5 rounded-xl">
                <div className="flex items-center gap-4">
                  <Database className="w-5 h-5 text-ira-gold" />
                  <div>
                    <div className="text-sm font-medium">Cloud Synchronization</div>
                    <div className="text-[10px] text-white/40">Multi-device state persistence</div>
                  </div>
                </div>
                <div className="w-10 h-5 bg-white/10 rounded-full relative cursor-pointer">
                  <div className="absolute left-1 top-1 w-3 h-3 bg-white/40 rounded-full" />
                </div>
              </div>
            </div>
          </div>
        )}

        {activeSection === 'api' && (
          <div className="space-y-8">
            <div>
              <h3 className="text-xl font-serif mb-2">API Manager</h3>
              <p className="text-sm text-white/40">Connect external AI models and services</p>
            </div>

            <div className="p-4 bg-ira-blue/10 border border-ira-blue/20 rounded-xl flex items-start gap-4">
              <Info className="w-5 h-5 text-ira-blue shrink-0 mt-1" />
              <p className="text-xs text-ira-blue/70 leading-relaxed">
                Ira AI uses Google AI Studio by default. You can integrate Hugging Face and other providers below to expand system capabilities.
              </p>
            </div>

            <div className="space-y-4">
              {[
                { name: 'Google AI Studio', status: 'Connected', icon: Cpu },
                { name: 'Hugging Face', status: 'Not Configured', icon: Globe },
                { name: 'OpenAI (Optional)', status: 'Not Configured', icon: Key },
              ].map((api, i) => (
                <div key={i} className="flex items-center justify-between p-4 bg-white/5 rounded-xl border border-white/5">
                  <div className="flex items-center gap-4">
                    <api.icon className="w-5 h-5 text-white/60" />
                    <span className="text-sm font-medium">{api.name}</span>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className={cn(
                      "text-[10px] font-bold uppercase tracking-widest",
                      api.status === 'Connected' ? "text-emerald-500" : "text-white/20"
                    )}>{api.status}</span>
                    <button className="text-xs text-ira-violet hover:underline">Configure</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeSection !== 'general' && activeSection !== 'api' && (
          <div className="flex flex-col items-center justify-center h-full text-white/20 italic text-sm">
            Section "{activeSection}" is being optimized for your neural profile...
          </div>
        )}
      </div>
    </div>
  );
}
