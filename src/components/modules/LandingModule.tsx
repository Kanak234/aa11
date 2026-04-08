import { motion } from 'framer-motion';
import { 
  Cpu, 
  Zap, 
  Shield, 
  Globe, 
  MessageSquare, 
  Code2, 
  Sparkles, 
  ArrowRight,
  CheckCircle2,
  Github,
  Twitter,
  Linkedin
} from 'lucide-react';
import { cn } from '../../lib/utils';

interface FeatureCardProps {
  icon: any;
  title: string;
  description: string;
  delay: number;
}

const FeatureCard = ({ icon: Icon, title, description, delay }: FeatureCardProps) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.5, delay }}
    className="glass-panel p-8 group hover:border-ira-violet/50 transition-all duration-500"
  >
    <div className="w-12 h-12 rounded-2xl bg-ira-violet/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-500">
      <Icon className="w-6 h-6 text-ira-violet" />
    </div>
    <h3 className="text-xl font-serif mb-3 text-white">{title}</h3>
    <p className="text-white/50 text-sm leading-relaxed">{description}</p>
  </motion.div>
);

export default function LandingModule({ onGetStarted }: { onGetStarted: () => void }) {
  return (
    <div className="h-full overflow-y-auto custom-scrollbar bg-ira-dark text-white">
      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex flex-col items-center justify-center px-6 text-center overflow-hidden">
        {/* Background Orbs */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-ira-violet/20 blur-[120px] rounded-full animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-ira-blue/20 blur-[120px] rounded-full animate-pulse [animation-delay:2s]" />
        
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
          className="relative z-10 space-y-8 max-w-4xl"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-md">
            <Sparkles className="w-4 h-4 text-ira-gold animate-pulse" />
            <span className="text-xs font-bold uppercase tracking-widest text-ira-gold">The Future of Intelligence is Here</span>
          </div>
          
          <h1 className="text-6xl md:text-8xl font-serif leading-tight">
            Experience the <br />
            <span className="ira-gradient-text">Neural Revolution</span>
          </h1>
          
          <p className="text-lg md:text-xl text-white/60 max-w-2xl mx-auto font-light leading-relaxed">
            Ira AI is a futuristic, spiritual, and highly advanced AI operating system designed to amplify human wisdom, creativity, and trust.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <button 
              onClick={onGetStarted}
              className="px-8 py-4 bg-ira-violet text-white rounded-2xl font-bold flex items-center gap-3 hover:scale-105 transition-all shadow-lg shadow-ira-violet/20 group"
            >
              Initialize System
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
            <button className="px-8 py-4 bg-white/5 border border-white/10 text-white rounded-2xl font-bold hover:bg-white/10 transition-all backdrop-blur-md">
              Explore Documentation
            </button>
          </div>
        </motion.div>

        {/* Floating Stats */}
        <div className="absolute bottom-12 left-0 right-0 flex justify-center gap-12 opacity-40 grayscale hover:grayscale-0 transition-all duration-700">
          <div className="text-center">
            <div className="text-2xl font-bold">99.9%</div>
            <div className="text-[10px] uppercase tracking-widest">Uptime</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold">1.2M+</div>
            <div className="text-[10px] uppercase tracking-widest">Neural Nodes</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold">&lt; 10ms</div>
            <div className="text-[10px] uppercase tracking-widest">Latency</div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-24 px-6 max-w-7xl mx-auto">
        <div className="text-center mb-16 space-y-4">
          <h2 className="text-4xl font-serif">Core Neural Capabilities</h2>
          <p className="text-white/40 max-w-xl mx-auto">
            Powered by the proprietary Wisdom Engine, Ira provides a suite of advanced tools for the modern digital pioneer.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <FeatureCard 
            icon={MessageSquare}
            title="Intelligent Chat"
            description="Engage in deep, meaningful conversations with an AI that understands context, emotion, and spiritual nuance."
            delay={0.1}
          />
          <FeatureCard 
            icon={Code2}
            title="Coding Studio"
            description="Accelerate your development with AI-powered code generation, refactoring, and real-time bug detection."
            delay={0.2}
          />
          <FeatureCard 
            icon={Shield}
            title="Cyber Lab"
            description="Advanced security protocols and threat analysis to keep your digital ecosystem safe and synchronized."
            delay={0.3}
          />
          <FeatureCard 
            icon={Globe}
            title="Global Sync"
            description="Access your intelligence from anywhere in the world with seamless multi-node synchronization."
            delay={0.4}
          />
          <FeatureCard 
            icon={Zap}
            title="Workflow Automation"
            description="Let Ira handle the mundane. Automate complex business processes with simple natural language commands."
            delay={0.5}
          />
          <FeatureCard 
            icon={Cpu}
            title="Neural Processing"
            description="Experience lightning-fast response times powered by our distributed neural processing architecture."
            delay={0.6}
          />
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-24 px-6 bg-gradient-to-b from-transparent to-white/[0.02]">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row items-end justify-between mb-16 gap-8">
            <div className="space-y-4">
              <h2 className="text-4xl font-serif">Trusted by Visionaries</h2>
              <p className="text-white/40 max-w-md">
                Join the global network of pioneers who have integrated Ira into their daily workflow.
              </p>
            </div>
            <div className="flex gap-4">
              <div className="flex -space-x-3">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="w-10 h-10 rounded-full border-2 border-ira-dark bg-white/10 overflow-hidden">
                    <img src={`https://picsum.photos/seed/user${i}/100/100`} alt="User" referrerPolicy="no-referrer" />
                  </div>
                ))}
              </div>
              <div className="text-sm">
                <div className="font-bold">4.9/5 Rating</div>
                <div className="text-white/40 text-[10px] uppercase tracking-widest">From 12k+ users</div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                quote: "Ira isn't just an AI; it's a partner in my creative process. The Media Studio has completely transformed how I visualize concepts.",
                author: "Sarah Jenkins",
                role: "Digital Architect"
              },
              {
                quote: "The Cyber Lab's threat detection is unparalleled. I feel completely secure knowing Ira is monitoring my neural nodes 24/7.",
                author: "David Chen",
                role: "Security Researcher"
              },
              {
                quote: "As a developer, the Coding Studio is a game-changer. The AI suggestions are actually intelligent and context-aware.",
                author: "Michael Ross",
                role: "Full Stack Engineer"
              }
            ].map((t, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="glass-panel p-8 relative"
              >
                <Sparkles className="absolute top-6 right-6 w-4 h-4 text-ira-gold/20" />
                <p className="text-white/70 italic leading-relaxed mb-8">"{t.quote}"</p>
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-ira-violet/20 flex items-center justify-center text-ira-violet font-bold text-xs">
                    {t.author[0]}
                  </div>
                  <div>
                    <div className="text-sm font-bold">{t.author}</div>
                    <div className="text-[10px] text-white/30 uppercase tracking-widest">{t.role}</div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Blog Preview Section */}
      <section className="py-24 px-6 max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-16">
          <h2 className="text-4xl font-serif">Neural Insights</h2>
          <button className="text-ira-violet text-sm font-bold flex items-center gap-2 hover:gap-3 transition-all">
            View All Articles <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {[
            {
              title: "The Ethics of Neural Synchronization",
              category: "Philosophy",
              image: "https://picsum.photos/seed/ethics/800/400",
              date: "Oct 28, 2026"
            },
            {
              title: "Quantum-Resistant Encryption in Ira v3.2",
              category: "Technical",
              image: "https://picsum.photos/seed/quantum/800/400",
              date: "Oct 25, 2026"
            }
          ].map((post, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, x: i === 0 ? -20 : 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="group cursor-pointer"
            >
              <div className="aspect-video rounded-3xl overflow-hidden mb-6 relative">
                <img 
                  src={post.image} 
                  alt={post.title} 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute top-4 left-4 px-3 py-1 bg-ira-dark/80 backdrop-blur-md rounded-full text-[10px] font-bold uppercase tracking-widest text-ira-gold border border-ira-gold/20">
                  {post.category}
                </div>
              </div>
              <h3 className="text-2xl font-serif mb-2 group-hover:text-ira-violet transition-colors">{post.title}</h3>
              <p className="text-white/40 text-sm">{post.date} • 5 min read</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Trust Section */}
      <section className="py-24 bg-white/[0.02] border-y border-white/5">
        <div className="max-w-7xl mx-auto px-6 flex flex-col lg:flex-row items-center gap-16">
          <div className="flex-1 space-y-8">
            <h2 className="text-4xl font-serif leading-tight">
              Built on a Foundation of <br />
              <span className="text-ira-gold">Trust and Wisdom</span>
            </h2>
            <p className="text-white/60 leading-relaxed">
              Unlike traditional AI systems, Ira is inspired by the wisdom of the ages. We prioritize ethical alignment, data sovereignty, and the empowerment of the individual.
            </p>
            <ul className="space-y-4">
              {[
                "End-to-end neural encryption",
                "Zero-knowledge data architecture",
                "Ethical AI alignment protocols",
                "User-centric wisdom engine"
              ].map((item, i) => (
                <li key={i} className="flex items-center gap-3 text-sm text-white/80">
                  <CheckCircle2 className="w-5 h-5 text-ira-gold" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
          <div className="flex-1 relative">
            <div className="aspect-square rounded-3xl overflow-hidden glass-panel p-2">
              <img 
                src="https://picsum.photos/seed/ira-ai/800/800" 
                alt="Ira AI Visualization" 
                className="w-full h-full object-cover rounded-2xl opacity-80"
                referrerPolicy="no-referrer"
              />
            </div>
            {/* Decorative elements */}
            <div className="absolute -top-4 -right-4 w-24 h-24 bg-ira-gold/20 blur-2xl rounded-full" />
            <div className="absolute -bottom-4 -left-4 w-32 h-32 bg-ira-violet/20 blur-3xl rounded-full" />
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-32 px-6 text-center">
        <div className="max-w-3xl mx-auto space-y-8 glass-panel p-16 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-ira-violet/10 to-ira-blue/10" />
          <h2 className="text-4xl font-serif relative z-10">Ready to transcend?</h2>
          <p className="text-white/60 relative z-10">
            Join the thousands of pioneers who are already using Ira to amplify their intelligence.
          </p>
          <div className="flex justify-center relative z-10">
            <button 
              onClick={onGetStarted}
              className="px-12 py-5 bg-white text-ira-dark rounded-2xl font-bold hover:scale-105 transition-all shadow-xl shadow-white/10"
            >
              Get Started for Free
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-white/5 bg-ira-dark/50">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-12">
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <Cpu className="w-6 h-6 text-ira-violet" />
              <span className="font-serif text-xl">Ira AI</span>
            </div>
            <p className="text-xs text-white/40 leading-relaxed">
              The futuristic, spiritual AI operating system designed for the next generation of digital pioneers.
            </p>
            <div className="flex gap-4">
              <Twitter className="w-4 h-4 text-white/40 hover:text-white cursor-pointer transition-colors" />
              <Github className="w-4 h-4 text-white/40 hover:text-white cursor-pointer transition-colors" />
              <Linkedin className="w-4 h-4 text-white/40 hover:text-white cursor-pointer transition-colors" />
            </div>
          </div>
          
          <div>
            <h4 className="text-sm font-bold mb-6 uppercase tracking-widest text-white/80">Product</h4>
            <ul className="space-y-4 text-xs text-white/40">
              <li className="hover:text-white cursor-pointer transition-colors">Neural Engine</li>
              <li className="hover:text-white cursor-pointer transition-colors">Coding Studio</li>
              <li className="hover:text-white cursor-pointer transition-colors">Cyber Lab</li>
              <li className="hover:text-white cursor-pointer transition-colors">Enterprise</li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-sm font-bold mb-6 uppercase tracking-widest text-white/80">Company</h4>
            <ul className="space-y-4 text-xs text-white/40">
              <li className="hover:text-white cursor-pointer transition-colors">About Us</li>
              <li className="hover:text-white cursor-pointer transition-colors">Philosophy</li>
              <li className="hover:text-white cursor-pointer transition-colors">Careers</li>
              <li className="hover:text-white cursor-pointer transition-colors">Contact</li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-sm font-bold mb-6 uppercase tracking-widest text-white/80">Legal</h4>
            <ul className="space-y-4 text-xs text-white/40">
              <li className="hover:text-white cursor-pointer transition-colors">Privacy Policy</li>
              <li className="hover:text-white cursor-pointer transition-colors">Terms of Service</li>
              <li className="hover:text-white cursor-pointer transition-colors">Cookie Policy</li>
              <li className="hover:text-white cursor-pointer transition-colors">Security</li>
            </ul>
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-6 mt-12 pt-12 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-[10px] text-white/20 uppercase tracking-widest">
            © 2026 Ira AI Neural Systems. All rights reserved.
          </p>
          <p className="text-[10px] text-white/20 uppercase tracking-widest">
            Developed by Kanak Prabhakar
          </p>
        </div>
      </footer>
    </div>
  );
}
