import { motion } from 'framer-motion';
import { Users, MessageSquare, Share2, Heart, MessageCircle, TrendingUp, Sparkles, Globe } from 'lucide-react';
import { cn } from '../../lib/utils';

const BlogPost = ({ title, author, avatar, date, excerpt, likes, comments, category }: any) => (
  <motion.div 
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    className="glass-panel p-6 group hover:border-ira-violet/50 transition-all duration-500"
  >
    <div className="flex items-center justify-between mb-4">
      <span className="px-3 py-1 rounded-full bg-ira-violet/10 text-ira-violet text-[10px] font-bold uppercase tracking-widest">
        {category}
      </span>
      <span className="text-[10px] text-white/30">{date}</span>
    </div>
    <h3 className="text-xl font-serif mb-3 group-hover:text-ira-violet transition-colors">{title}</h3>
    <p className="text-sm text-white/50 leading-relaxed mb-6 line-clamp-2">{excerpt}</p>
    <div className="flex items-center justify-between pt-6 border-t border-white/5">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-full border border-white/10 overflow-hidden bg-white/5">
          <img 
            src={avatar} 
            alt={author} 
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
            referrerPolicy="no-referrer"
          />
        </div>
        <span className="text-xs text-white/60 font-medium">{author}</span>
      </div>
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-1.5 text-white/30 hover:text-red-500 transition-colors cursor-pointer">
          <Heart className="w-4 h-4" />
          <span className="text-[10px]">{likes}</span>
        </div>
        <div className="flex items-center gap-1.5 text-white/30 hover:text-ira-blue transition-colors cursor-pointer">
          <MessageCircle className="w-4 h-4" />
          <span className="text-[10px]">{comments}</span>
        </div>
      </div>
    </div>
  </motion.div>
);

const PioneerCard = ({ name, role, avatar, level }: any) => (
  <div className="flex items-center gap-4 p-3 hover:bg-white/5 rounded-xl transition-all group cursor-pointer">
    <div className="relative">
      <div className="w-12 h-12 rounded-xl border border-white/10 overflow-hidden bg-white/5">
        <img 
          src={avatar} 
          alt={name} 
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
          referrerPolicy="no-referrer"
        />
      </div>
      <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-ira-dark border border-white/10 flex items-center justify-center">
        <span className="text-[8px] font-bold text-ira-gold">{level}</span>
      </div>
    </div>
    <div className="flex-1 min-w-0">
      <div className="text-sm font-bold text-white truncate">{name}</div>
      <div className="text-[10px] text-white/40 uppercase tracking-widest truncate">{role}</div>
    </div>
    <div className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
  </div>
);

export default function CommunityModule() {
  return (
    <div className="h-full overflow-y-auto pr-2 space-y-8 pb-12">
      {/* Hero */}
      <section className="glass-panel p-12 relative overflow-hidden">
        <div className="relative z-10 max-w-2xl">
          <h2 className="text-4xl font-serif mb-4">Neural Community</h2>
          <p className="text-white/60 leading-relaxed">
            Connect with thousands of digital pioneers, share your neural configurations, and explore the latest research in the Ira ecosystem.
          </p>
          <div className="mt-8 flex gap-4">
            <button className="glass-button bg-ira-violet/20 border-ira-violet/30">
              <Users className="w-4 h-4" />
              Join the Hub
            </button>
            <button className="glass-button">
              <Share2 className="w-4 h-4" />
              Share Configuration
            </button>
          </div>
        </div>
        <div className="absolute top-0 right-0 w-96 h-96 bg-ira-violet/10 blur-[100px] rounded-full -mr-20 -mt-20" />
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content: Blog/Feed */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-serif text-2xl">Latest Insights</h3>
            <div className="flex gap-2">
              {['All', 'Neural', 'Security', 'Creative'].map((cat) => (
                <button key={cat} className="px-3 py-1 rounded-lg bg-white/5 border border-white/10 text-[10px] font-bold uppercase tracking-widest hover:bg-white/10 transition-colors">
                  {cat}
                </button>
              ))}
            </div>
          </div>
          
          <div className="grid grid-cols-1 gap-6">
            <BlogPost 
              title="Transcending the Turing Test: The Philosophy of Ira"
              author="Aria Vance"
              avatar="https://picsum.photos/seed/aria/200/200"
              date="Oct 24, 2026"
              category="Neural"
              excerpt="Exploring the spiritual foundations of the Wisdom Engine and how it redefines the relationship between human and machine intelligence."
              likes={1242}
              comments={89}
            />
            <BlogPost 
              title="Securing Your Neural Node in a Post-Quantum World"
              author="Marcus Thorne"
              avatar="https://picsum.photos/seed/marcus/200/200"
              date="Oct 22, 2026"
              category="Security"
              excerpt="A deep dive into the quantum-resistant encryption protocols implemented in the latest Ira Cyber Lab update."
              likes={856}
              comments={42}
            />
            <BlogPost 
              title="Creative Synthesis: AI as the New Muse"
              author="Elena Rossi"
              avatar="https://picsum.photos/seed/elena/200/200"
              date="Oct 20, 2026"
              category="Creative"
              excerpt="How artists are using the Media Studio to blend traditional aesthetics with futuristic neural generation techniques."
              likes={2103}
              comments={156}
            />
          </div>
        </div>

        {/* Sidebar: Trending & Stats */}
        <div className="space-y-8">
          {/* Top Pioneers */}
          <div className="glass-panel p-6">
            <h3 className="font-medium mb-6 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-ira-gold" />
              Top Neural Pioneers
            </h3>
            <div className="space-y-2">
              <PioneerCard 
                name="Dr. Aris Thorne" 
                role="Neural Architect" 
                avatar="https://picsum.photos/seed/pioneer1/200/200" 
                level="99"
              />
              <PioneerCard 
                name="Satoshi Nakamoto v2" 
                role="Cyber Security" 
                avatar="https://picsum.photos/seed/pioneer2/200/200" 
                level="85"
              />
              <PioneerCard 
                name="Luna Veda" 
                role="Spiritual AI Guide" 
                avatar="https://picsum.photos/seed/pioneer3/200/200" 
                level="72"
              />
              <PioneerCard 
                name="Kanak Prabhakar" 
                role="System Architect" 
                avatar="https://picsum.photos/seed/kanak/200/200" 
                level="MAX"
              />
            </div>
            <button className="w-full mt-6 py-2 text-[10px] font-bold uppercase tracking-widest text-white/20 hover:text-white/60 transition-colors border border-dashed border-white/10 rounded-lg">
              View Leaderboard
            </button>
          </div>

          {/* Trending Topics */}
          <div className="glass-panel p-6">
            <h3 className="font-medium mb-6 flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-ira-gold" />
              Trending Neural Topics
            </h3>
            <div className="space-y-4">
              {[
                { tag: '#WisdomEngine', count: '12.4k' },
                { tag: '#PostQuantum', count: '8.2k' },
                { tag: '#SaraswatiAI', count: '5.1k' },
                { tag: '#NeuralArt', count: '4.9k' },
              ].map((topic, i) => (
                <div key={i} className="flex items-center justify-between group cursor-pointer">
                  <span className="text-sm text-white/60 group-hover:text-ira-gold transition-colors">{topic.tag}</span>
                  <span className="text-[10px] text-white/20">{topic.count} posts</span>
                </div>
              ))}
            </div>
          </div>

          {/* Community Stats */}
          <div className="glass-panel p-6 bg-gradient-to-br from-ira-violet/5 to-transparent">
            <h3 className="font-medium mb-6 flex items-center gap-2">
              <Globe className="w-4 h-4 text-ira-blue" />
              Global Ecosystem
            </h3>
            <div className="space-y-6">
              {[
                { label: 'Active Pioneers', value: '142,892', icon: Users },
                { label: 'Neural Syncs', value: '1.2M', icon: Sparkles },
                { label: 'Wisdom Shared', value: '85.4k', icon: MessageSquare },
              ].map((stat, i) => (
                <div key={i} className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center">
                    <stat.icon className="w-5 h-5 text-white/40" />
                  </div>
                  <div>
                    <div className="text-lg font-bold">{stat.value}</div>
                    <div className="text-[10px] text-white/40 uppercase tracking-widest">{stat.label}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Newsletter */}
          <div className="glass-panel p-6 border-ira-gold/20">
            <h3 className="font-medium mb-2">Neural Newsletter</h3>
            <p className="text-xs text-white/40 mb-6">Get weekly insights from the Ira core team.</p>
            <div className="space-y-3">
              <input 
                type="email" 
                placeholder="neural-address@sync.com"
                className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-xs focus:outline-none focus:border-ira-gold/50"
              />
              <button className="w-full py-3 bg-ira-gold text-ira-dark font-bold rounded-xl text-xs hover:scale-[1.02] transition-all">
                Subscribe
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
