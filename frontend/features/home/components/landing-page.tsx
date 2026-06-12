import React from 'react';
import { 
  Search, 
  Sparkles, 
  Activity, 
  Eye, 
  Brain, 
  Network, 
  Zap, 
  Bot, 
  Database, 
  Cpu,
  Share2,
  FileText,
  Map
} from 'lucide-react';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#0a0f1c] text-white selection:bg-cyan-500/30 overflow-hidden font-sans">
      {/* Background ambient glows */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-cyan-500/10 blur-[120px]" />
        <div className="absolute top-[20%] right-[-10%] w-[30%] h-[40%] rounded-full bg-purple-500/10 blur-[120px]" />
        <div className="absolute bottom-[-10%] left-[20%] w-[40%] h-[40%] rounded-full bg-emerald-500/5 blur-[120px]" />
      </div>

      {/* Navigation */}
      <nav className="relative z-10 flex items-center justify-between px-8 py-6 max-w-7xl mx-auto">
        <div className="flex items-center gap-2">
          <div className="text-cyan-400">
            <Share2 className="w-6 h-6" />
          </div>
          <span className="font-semibold text-lg tracking-tight">AI Research Mentor</span>
        </div>
        <div className="hidden md:flex items-center gap-8 text-sm text-slate-300 font-medium">
          <a href="#" className="hover:text-white transition-colors">Home</a>
          <a href="#" className="hover:text-white transition-colors">About</a>
          <a href="#" className="hover:text-white transition-colors">Thin-font</a>
          <a href="#" className="hover:text-white transition-colors">Contact</a>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="relative z-10 max-w-7xl mx-auto px-6 pt-20 pb-32 flex flex-col items-center text-center">
        {/* Floating elements to mimic the image's 3D assets */}
        <div className="absolute left-[10%] top-[10%] w-16 h-16 rounded-2xl bg-gradient-to-br from-cyan-400/20 to-purple-500/20 border border-white/10 backdrop-blur-md flex items-center justify-center opacity-60 transform -rotate-12 animate-pulse">
          <Sparkles className="w-6 h-6 text-cyan-300" />
        </div>
        <div className="absolute right-[15%] top-[5%] w-24 h-24 rounded-3xl bg-gradient-to-br from-purple-500/20 to-blue-500/20 border border-white/10 backdrop-blur-md flex items-center justify-center opacity-80 transform rotate-12">
          <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-200 to-cyan-200">AI</span>
        </div>
        <div className="absolute left-[15%] bottom-[20%] w-20 h-20 rounded-3xl bg-gradient-to-br from-emerald-400/10 to-cyan-500/10 border border-white/10 backdrop-blur-md flex items-center justify-center opacity-70 transform rotate-6">
          <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-emerald-200 to-cyan-200">AI</span>
        </div>

        <h1 className="max-w-4xl text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight text-white leading-[1.1] mb-6">
          Master Any STEM Topic with <br className="hidden md:block" />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-purple-400 to-cyan-400 animate-gradient">AI-Generated Research Roadmaps</span>
        </h1>
        
        <p className="max-w-2xl text-lg md:text-xl text-slate-400 mb-12 font-light">
          Personalized prerequisite maps, research paths, and visual learning journeys powered by AI.
        </p>

        {/* Search Input Area */}
        <div className="w-full max-w-2xl relative mb-16 group">
          <div className="absolute -inset-1 bg-gradient-to-r from-cyan-500 to-purple-500 rounded-2xl blur opacity-20 group-hover:opacity-40 transition duration-500"></div>
          <div className="relative flex flex-col sm:flex-row items-center gap-3 bg-[#111727] p-2 rounded-2xl border border-white/10 shadow-2xl">
            <div className="relative flex-1 w-full">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input 
                type="text" 
                placeholder="Enter a topic (e.g., Kalman Filter, Computer Vision)"
                className="w-full bg-transparent text-white placeholder-slate-500 pl-12 pr-4 py-3 outline-none rounded-xl focus:bg-white/5 transition-colors"
              />
            </div>
            <button className="w-full sm:w-auto px-6 py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-400 hover:to-purple-400 text-white font-medium flex items-center justify-center gap-2 transition-all shadow-[0_0_20px_rgba(6,182,212,0.3)] hover:shadow-[0_0_30px_rgba(168,85,247,0.5)]">
              <Sparkles className="w-4 h-4" />
              Generate Roadmap
            </button>
          </div>
        </div>

        {/* Popular Topics */}
        <div className="w-full max-w-4xl">
          <h2 className="text-left text-lg font-semibold text-white mb-4 pl-2">Popular Topics</h2>
          <div className="flex flex-wrap gap-3 justify-center md:justify-start">
            <TopicPill icon={<Activity />} text="Kalman Filter" active />
            <TopicPill icon={<Eye />} text="Computer Vision" />
            <TopicPill icon={<Brain />} text="Machine Learning" />
            <TopicPill icon={<Network />} text="Reinforcement Learning" />
            <TopicPill icon={<Zap />} text="Signal Processing" />
            <TopicPill icon={<Bot />} text="Robotics" />
            <TopicPill icon={<Database />} text="Data Science" />
            <TopicPill icon={<Cpu />} text="Deep Learning" />
          </div>
        </div>
      </main>

      {/* Graph Visualization Mockup Section */}
      <section className="relative z-10 max-w-6xl mx-auto px-6 py-24">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Interactive Knowledge Graphs</h2>
          <p className="text-slate-400 max-w-2xl mx-auto">Visual learning paths progressing logically from fundamental mathematics to advanced autonomous systems.</p>
        </div>

        <div className="relative w-full h-[500px] rounded-[2rem] border border-white/10 bg-[#0f1524]/80 backdrop-blur-xl overflow-hidden shadow-2xl flex items-center justify-center p-8">
          {/* Subtle grid background */}
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iMSIgY3k9IjEiIHI9IjEiIGZpbGw9InJnYmEoMjU1LDI1NSwyNTUsMC4wNSkiLz48L3N2Zz4=')] opacity-50" />
          
          {/* Mockup Nodes */}
          <div className="relative w-full max-w-4xl h-full">
            {/* SVG Lines */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ zIndex: 0 }}>
              <path d="M 150 100 Q 300 100, 400 200" fill="none" stroke="rgba(6,182,212,0.3)" strokeWidth="2" strokeDasharray="4 4" className="animate-pulse" />
              <path d="M 150 300 Q 300 300, 400 200" fill="none" stroke="rgba(6,182,212,0.3)" strokeWidth="2" strokeDasharray="4 4" />
              <path d="M 450 200 L 600 200" fill="none" stroke="rgba(168,85,247,0.3)" strokeWidth="2" />
              <path d="M 650 200 Q 750 200, 800 100" fill="none" stroke="rgba(16,185,129,0.3)" strokeWidth="2" />
              <path d="M 650 200 Q 750 200, 800 300" fill="none" stroke="rgba(16,185,129,0.3)" strokeWidth="2" />
            </svg>

            {/* Nodes */}
            <GraphNode title="Linear Algebra" difficulty="Beginner" x="50px" y="80px" color="cyan" />
            <GraphNode title="Probability" difficulty="Beginner" x="50px" y="280px" color="cyan" />
            <GraphNode title="State Estimation" difficulty="Intermediate" x="350px" y="180px" color="purple" />
            <GraphNode title="Kalman Filter" difficulty="Intermediate" x="600px" y="180px" color="purple" />
            <GraphNode title="Sensor Fusion" difficulty="Advanced" x="750px" y="80px" color="emerald" />
            <GraphNode title="Particle Filter" difficulty="Advanced" x="750px" y="280px" color="emerald" />
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="relative z-10 max-w-7xl mx-auto px-6 py-24 border-t border-white/5">
        <div className="grid md:grid-cols-3 gap-6">
          <FeatureCard 
            icon={<Map className="w-6 h-6 text-cyan-400" />}
            title="AI Roadmap Generation"
            description="Dynamically generate structured curriculum for any niche academic or engineering topic instantly."
          />
          <FeatureCard 
            icon={<FileText className="w-6 h-6 text-purple-400" />}
            title="Paper Recommendations"
            description="Context-aware mapping of foundational and state-of-the-art research papers to your specific learning nodes."
          />
          <FeatureCard 
            icon={<Network className="w-6 h-6 text-emerald-400" />}
            title="Interactive Graphs"
            description="Explore dependencies and prerequisites visually with our React Flow powered knowledge web."
          />
        </div>
      </section>

    </div>
  );
}

// Subcomponents

function TopicPill({ icon, text, active = false }: { icon: React.ReactNode, text: string, active?: boolean }) {
  return (
    <button className={`
      flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-medium transition-all duration-300
      backdrop-blur-md border hover:scale-105 hover:-translate-y-0.5
      ${active 
        ? 'bg-gradient-to-r from-cyan-500/20 to-purple-500/20 border-cyan-400/50 text-white shadow-[0_0_15px_rgba(6,182,212,0.2)]' 
        : 'bg-white/5 border-white/10 text-slate-300 hover:border-white/30 hover:text-white'}
    `}>
      <span className={`[&>svg]:w-4 [&>svg]:h-4 ${active ? 'text-cyan-400' : 'text-slate-400'}`}>
        {icon}
      </span>
      {text}
    </button>
  );
}

function GraphNode({ title, difficulty, x, y, color }: { title: string, difficulty: string, x: string, y: string, color: 'cyan' | 'purple' | 'emerald' }) {
  const colorMap = {
    cyan: 'border-cyan-500/30 bg-cyan-500/10',
    purple: 'border-purple-500/30 bg-purple-500/10',
    emerald: 'border-emerald-500/30 bg-emerald-500/10'
  };

  return (
    <div 
      className={`absolute w-[180px] p-4 rounded-xl border backdrop-blur-md shadow-lg ${colorMap[color]} hover:scale-105 transition-transform cursor-pointer`}
      style={{ left: x, top: y, zIndex: 10 }}
    >
      <div className="text-xs uppercase tracking-wider text-slate-400 mb-1">{difficulty}</div>
      <div className="font-semibold text-slate-100 text-sm">{title}</div>
    </div>
  );
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode, title: string, description: string }) {
  return (
    <div className="p-8 rounded-[2rem] bg-white/[0.02] border border-white/5 hover:bg-white/[0.04] transition-colors group">
      <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
        {icon}
      </div>
      <h3 className="text-xl font-semibold text-white mb-3">{title}</h3>
      <p className="text-slate-400 leading-relaxed">{description}</p>
    </div>
  );
}