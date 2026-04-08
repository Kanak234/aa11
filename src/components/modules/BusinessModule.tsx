import { motion } from 'framer-motion';
import { Briefcase, TrendingUp, Users, PieChart, Zap, Calendar, Mail, BarChart3 } from 'lucide-react';
import { cn } from '../../lib/utils';

export default function BusinessModule() {
  return (
    <div className="h-full overflow-y-auto pr-2 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-serif">Business Intelligence</h2>
          <p className="text-sm text-white/40">Strategic analysis and workflow automation</p>
        </div>
        <div className="flex gap-3">
          <button className="glass-button">
            <Calendar className="w-4 h-4" />
            Schedule
          </button>
          <button className="glass-button bg-ira-gold/20 border-ira-gold/30 text-ira-gold">
            <Zap className="w-4 h-4 fill-current" />
            Automate
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {/* Revenue Chart Placeholder */}
          <div className="glass-panel p-6 h-64 flex flex-col">
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-medium flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-ira-gold" />
                Growth Analytics
              </h3>
              <select className="bg-white/5 border border-white/10 rounded-lg text-[10px] px-2 py-1 focus:outline-none">
                <option>Last 30 Days</option>
                <option>Last 6 Months</option>
              </select>
            </div>
            <div className="flex-1 flex items-end gap-2 px-2">
              {[40, 60, 45, 90, 65, 80, 55, 70, 85, 100, 75, 95].map((h, i) => (
                <motion.div 
                  key={i}
                  initial={{ height: 0 }}
                  animate={{ height: `${h}%` }}
                  transition={{ delay: i * 0.05 }}
                  className="flex-1 bg-gradient-to-t from-ira-gold/20 to-ira-gold/60 rounded-t-sm"
                />
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="glass-panel p-6">
              <h3 className="font-medium mb-4 flex items-center gap-2">
                <Users className="w-4 h-4 text-ira-blue" />
                Team Collaboration
              </h3>
              <div className="space-y-4">
                {[
                  { name: 'Alice Chen', role: 'Lead Designer', status: 'Online' },
                  { name: 'Bob Smith', role: 'Backend Dev', status: 'In Meeting' },
                  { name: 'Charlie Day', role: 'Product Manager', status: 'Offline' },
                ].map((user, i) => (
                  <div key={i} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-[10px] font-bold">
                        {user.name.split(' ').map(n => n[0]).join('')}
                      </div>
                      <div>
                        <div className="text-xs font-medium">{user.name}</div>
                        <div className="text-[10px] text-white/40">{user.role}</div>
                      </div>
                    </div>
                    <div className={cn(
                      "text-[8px] uppercase font-bold px-2 py-0.5 rounded-full",
                      user.status === 'Online' ? "bg-emerald-500/20 text-emerald-500" : "bg-white/5 text-white/30"
                    )}>
                      {user.status}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="glass-panel p-6">
              <h3 className="font-medium mb-4 flex items-center gap-2">
                <Mail className="w-4 h-4 text-ira-violet" />
                Smart Inbox
              </h3>
              <div className="space-y-3">
                {[
                  { from: 'Investor Relations', subject: 'Q1 Review Meeting', priority: 'High' },
                  { from: 'GitHub', subject: 'New PR in Repository', priority: 'Medium' },
                  { from: 'Slack', subject: '3 New Mentions', priority: 'Low' },
                ].map((mail, i) => (
                  <div key={i} className="p-3 bg-white/5 rounded-xl border border-white/5 hover:border-white/10 transition-all cursor-pointer">
                    <div className="flex justify-between items-start">
                      <div className="text-[10px] font-bold text-ira-violet">{mail.from}</div>
                      <div className={cn(
                        "text-[8px] px-1.5 rounded",
                        mail.priority === 'High' ? "bg-red-500/20 text-red-500" : "bg-white/10 text-white/40"
                      )}>{mail.priority}</div>
                    </div>
                    <div className="text-xs mt-1 truncate">{mail.subject}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="glass-panel p-6 space-y-8">
          <div>
            <h3 className="font-medium mb-4 flex items-center gap-2">
              <PieChart className="w-4 h-4 text-ira-gold" />
              Market Share
            </h3>
            <div className="aspect-square rounded-full border-8 border-white/5 flex items-center justify-center relative">
              <div className="text-center">
                <div className="text-2xl font-bold">64%</div>
                <div className="text-[10px] text-white/40 uppercase">Dominance</div>
              </div>
              <svg className="absolute inset-0 w-full h-full -rotate-90">
                <circle 
                  cx="50%" cy="50%" r="45%" 
                  fill="none" 
                  stroke="currentColor" 
                  strokeWidth="8" 
                  strokeDasharray="283" 
                  strokeDashoffset="100"
                  className="text-ira-gold"
                />
              </svg>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="font-medium flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-ira-blue" />
              Key Metrics
            </h3>
            {[
              { label: 'Customer Acquisition', value: '+$2.4k' },
              { label: 'Churn Rate', value: '1.2%' },
              { label: 'Net Promoter Score', value: '72' },
            ].map((metric, i) => (
              <div key={i} className="flex justify-between items-center p-3 bg-white/5 rounded-xl">
                <span className="text-xs text-white/60">{metric.label}</span>
                <span className="text-xs font-bold">{metric.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
