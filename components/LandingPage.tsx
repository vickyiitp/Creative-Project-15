import React, { useState, useEffect } from 'react';
import { 
  Box, Scan, RotateCw, BarChart3, ChevronRight, Globe, ShieldCheck, 
  Menu, X, Youtube, Linkedin, Github, Instagram, ArrowUp, Mail, ExternalLink 
} from 'lucide-react';
import { COLORS } from '../constants';

interface LandingPageProps {
  onPlay: () => void;
  onLegal: (type: 'privacy' | 'terms') => void;
}

const SocialLink: React.FC<{ href: string; icon: React.ReactNode; label: string }> = ({ href, icon, label }) => (
  <a 
    href={href} 
    target="_blank" 
    rel="noopener noreferrer"
    aria-label={label}
    className="p-2 text-gray-400 hover:text-orange-500 hover:bg-white/5 rounded-full transition-all duration-300 transform hover:scale-110"
  >
    {icon}
  </a>
);

const LandingPage: React.FC<LandingPageProps> = ({ onPlay, onLegal }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showBackToTop, setShowBackToTop] = useState(false);

  // Scroll listener for Back to Top button
  useEffect(() => {
    const handleScroll = () => {
      setShowBackToTop(window.scrollY > 400);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const socials = [
    { href: "https://youtube.com/@vickyiitp", icon: <Youtube className="w-5 h-5" />, label: "YouTube" },
    { href: "https://linkedin.com/in/vickyiitp", icon: <Linkedin className="w-5 h-5" />, label: "LinkedIn" },
    { href: "https://x.com/vickyiitp", icon: <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>, label: "X (Twitter)" },
    { href: "https://github.com/vickyiitp", icon: <Github className="w-5 h-5" />, label: "GitHub" },
    { href: "https://instagram.com/vickyiitp", icon: <Instagram className="w-5 h-5" />, label: "Instagram" },
  ];

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white overflow-x-hidden font-sans selection:bg-orange-500 selection:text-white flex flex-col">
      {/* Background Grid & Ambient Glow */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div 
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: `linear-gradient(${COLORS.gridLines} 1px, transparent 1px), linear-gradient(90deg, ${COLORS.gridLines} 1px, transparent 1px)`,
            backgroundSize: '40px 40px',
            transform: 'perspective(500px) rotateX(60deg) translateY(-100px) scale(2)',
          }}
        />
        <div className="absolute top-[-20%] left-[-10%] w-[50vw] h-[50vw] bg-purple-900/20 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[50vw] h-[50vw] bg-orange-900/10 rounded-full blur-[120px]" />
      </div>

      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 bg-black/50 backdrop-blur-md border-b border-white/5 transition-all duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-2 cursor-pointer" onClick={() => window.location.reload()}>
              <div className="bg-orange-500 p-1 rounded">
                <Box className="w-6 h-6 text-white" />
              </div>
              <span className="font-bold text-xl tracking-tighter">CARGO<span className="text-orange-500">MASTER</span></span>
            </div>

            {/* Desktop Menu */}
            <div className="hidden md:flex items-center gap-8">
              <div className="flex gap-6 text-sm font-medium text-gray-400">
                <a href="#features" className="hover:text-white transition-colors relative group">
                  PROTOCOL
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-orange-500 transition-all group-hover:w-full"></span>
                </a>
                <a href="#lore" className="hover:text-white transition-colors relative group">
                  MISSION
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-orange-500 transition-all group-hover:w-full"></span>
                </a>
              </div>
              <div className="h-4 w-px bg-gray-700 mx-2"></div>
              <div className="flex items-center gap-1">
                {socials.map((s, i) => <SocialLink key={i} {...s} />)}
              </div>
              <button 
                onClick={onPlay}
                className="bg-white/10 hover:bg-white/20 border border-white/10 px-6 py-2 rounded-full text-xs font-mono transition-all backdrop-blur-md hover:scale-105 active:scale-95"
              >
                PLAY NOW
              </button>
            </div>

            {/* Mobile Toggle */}
            <button 
              className="md:hidden p-2 text-gray-400 hover:text-white transition-colors"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-label="Toggle Menu"
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden bg-black/95 border-b border-white/10 animate-fade-in-down absolute w-full left-0 z-50 shadow-2xl">
            <div className="px-4 pt-4 pb-8 space-y-4">
              <a href="#features" className="block text-gray-300 hover:text-white py-2 text-center text-lg font-bold" onClick={() => setIsMenuOpen(false)}>PROTOCOL</a>
              <a href="#lore" className="block text-gray-300 hover:text-white py-2 text-center text-lg font-bold" onClick={() => setIsMenuOpen(false)}>MISSION</a>
              <div className="flex gap-6 py-4 border-t border-gray-800 justify-center">
                 {socials.map((s, i) => <SocialLink key={i} {...s} />)}
              </div>
              <button 
                onClick={() => { onPlay(); setIsMenuOpen(false); }}
                className="w-full bg-orange-600 text-white py-4 rounded-xl font-bold text-lg shadow-[0_0_20px_rgba(234,88,12,0.3)]"
              >
                INITIALIZE GAME
              </button>
            </div>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <main className="relative z-10 pt-32 pb-20 px-4 sm:px-6 max-w-7xl mx-auto flex flex-col-reverse md:flex-row items-center gap-12 md:gap-8">
        {/* Text Content */}
        <div className="flex-1 text-center md:text-left w-full animate-fade-in-up">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-500/10 border border-orange-500/20 text-orange-400 text-xs font-mono mb-6">
            <span className="w-2 h-2 rounded-full bg-orange-500 animate-pulse" />
            VIRTUAL LOGISTICS SIMULATOR v1.0
          </div>
          
          <h1 className="text-4xl sm:text-5xl md:text-7xl font-black tracking-tighter mb-6 leading-[1.1] md:leading-[0.9]">
            MASTER THE <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-500">ART OF CARGO.</span>
          </h1>
          
          <p className="text-base sm:text-lg text-gray-400 mb-8 max-w-xl mx-auto md:mx-0 leading-relaxed">
            The colony ships are leaving. Space is premium. Your job is simple: 
            Pack efficient, pack fast, or get left behind.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start w-full sm:w-auto">
            <button 
              onClick={onPlay}
              className="group relative px-8 py-4 bg-orange-600 hover:bg-orange-500 rounded-lg font-bold tracking-wide transition-all hover:scale-[1.02] hover:shadow-[0_0_40px_rgba(234,88,12,0.4)] overflow-hidden w-full sm:w-auto flex justify-center"
            >
              <span className="relative z-10 flex items-center gap-2">
                PLAY NOW <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-orange-600 via-white/20 to-orange-600 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-in-out" />
            </button>
          </div>
        </div>

        {/* Hero Visual - CSS 3D Cube Animation */}
        <div className="flex-1 relative w-full h-[300px] sm:h-[400px] flex items-center justify-center perspective-1000">
          <div className="relative w-48 h-48 sm:w-64 sm:h-64 animate-[float_6s_ease-in-out_infinite]">
            <div className="w-full h-full relative preserve-3d animate-[spin-slow_20s_linear_infinite]">
              <div className="absolute inset-0 transform md:scale-100 scale-75 preserve-3d">
                  <div className="absolute w-64 h-64 bg-orange-600/20 border-2 border-orange-500 backdrop-blur-sm flex items-center justify-center translate-z-32">
                    <Box className="w-24 h-24 text-orange-500/50" />
                  </div>
                  <div className="absolute w-64 h-64 bg-purple-600/20 border-2 border-purple-500 backdrop-blur-sm translate-z-[-128px] rotate-y-180" />
                  <div className="absolute w-64 h-64 bg-blue-600/20 border-2 border-blue-500 backdrop-blur-sm origin-right rotate-y-90 translate-x-[-128px]" />
                  <div className="absolute w-64 h-64 bg-green-600/20 border-2 border-green-500 backdrop-blur-sm origin-left rotate-y-[-90] translate-x-[128px]" />
                  <div className="absolute w-64 h-64 bg-white/10 border-2 border-white/30 backdrop-blur-sm origin-top rotate-x-90 translate-y-[128px]" />
                  <div className="absolute w-64 h-64 bg-black/40 border-2 border-gray-700 backdrop-blur-sm origin-bottom rotate-x-[-90] translate-y-[-128px]" />
              </div>
            </div>
            
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[140%] h-[140%] border border-dashed border-gray-600 rounded-full animate-[spin-reverse_30s_linear_infinite]" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[180%] h-[180%] border border-gray-800 rounded-full animate-[spin-slow_40s_linear_infinite]" />
          </div>
        </div>
      </main>

      {/* How It Works Section */}
      <section id="features" className="relative z-10 py-20 bg-black/50 border-t border-white/5 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-16">
            <h2 className="text-2xl sm:text-3xl font-bold mb-4">OPTIMIZATION PROTOCOLS</h2>
            <p className="text-gray-400">Three steps to logistics dominance.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
            {/* Card 1 */}
            <div className="group bg-gray-900/50 border border-white/5 p-6 sm:p-8 rounded-2xl hover:bg-gray-800/50 transition-all hover:-translate-y-2">
              <div className="bg-blue-500/10 w-12 h-12 rounded-lg flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Scan className="w-6 h-6 text-blue-400" />
              </div>
              <h3 className="text-xl font-bold mb-2">1. ANALYZE</h3>
              <p className="text-sm text-gray-400 mb-6">Scan incoming polyomino shapes. Identify volume and geometry constraints instantly.</p>
              <div className="h-16 bg-black/40 rounded border border-white/5 flex items-center justify-center gap-2 p-2">
                <div className="w-8 h-8 border border-dashed border-blue-500/50 rounded flex items-center justify-center text-[10px] text-blue-400">IN</div>
                <div className="h-[1px] w-4 bg-gray-700"></div>
                <div className="w-16 h-8 bg-blue-500/20 border border-blue-500/30 rounded flex items-center justify-center text-[10px] text-blue-300 font-mono">DATA</div>
              </div>
            </div>

            {/* Card 2 */}
            <div className="group bg-gray-900/50 border border-white/5 p-6 sm:p-8 rounded-2xl hover:bg-gray-800/50 transition-all hover:-translate-y-2">
              <div className="bg-purple-500/10 w-12 h-12 rounded-lg flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <RotateCw className="w-6 h-6 text-purple-400" />
              </div>
              <h3 className="text-xl font-bold mb-2">2. STRATEGIZE</h3>
              <p className="text-sm text-gray-400 mb-6">Rotate shapes in 3D space to find the perfect fit. Every gap is wasted profit.</p>
               <div className="h-16 bg-black/40 rounded border border-white/5 flex items-center justify-center gap-4 p-2">
                <RotateCw className="w-4 h-4 text-gray-600 animate-spin" style={{ animationDuration: '3s' }} />
                <div className="w-8 h-8 bg-purple-500/40 rounded transform rotate-12"></div>
                <div className="w-8 h-8 bg-purple-500/40 rounded transform rotate-45 border border-white/20"></div>
              </div>
            </div>

            {/* Card 3 */}
            <div className="group bg-gray-900/50 border border-white/5 p-6 sm:p-8 rounded-2xl hover:bg-gray-800/50 transition-all hover:-translate-y-2">
              <div className="bg-green-500/10 w-12 h-12 rounded-lg flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <BarChart3 className="w-6 h-6 text-green-400" />
              </div>
              <h3 className="text-xl font-bold mb-2">3. EXECUTE</h3>
              <p className="text-sm text-gray-400 mb-6">Drop the cargo. Maximize container density. Achieve 100% efficiency.</p>
               <div className="h-16 bg-black/40 rounded border border-white/5 flex items-end justify-center gap-1 p-4">
                  <div className="w-2 h-4 bg-green-900"></div>
                  <div className="w-2 h-6 bg-green-800"></div>
                  <div className="w-2 h-3 bg-green-700"></div>
                  <div className="w-2 h-8 bg-green-500 animate-pulse"></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Story / Lore Section */}
      <section id="lore" className="relative z-10 py-20 px-4 sm:px-6">
        <div className="max-w-4xl mx-auto bg-gradient-to-br from-gray-900 to-black border border-gray-800 p-8 sm:p-12 rounded-3xl relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity duration-1000">
            <Globe className="w-32 h-32 sm:w-64 sm:h-64 rotate-12" />
          </div>
          
          <div className="relative z-10">
            <div className="flex items-center gap-2 text-orange-500 mb-4 font-mono text-sm">
              <ShieldCheck className="w-4 h-4" />
              <span>CLASSIFIED BRIEFING</span>
            </div>
            
            <h2 className="text-2xl sm:text-3xl font-bold mb-6">THE YEAR IS 2084.</h2>
            <p className="text-base sm:text-lg text-gray-400 leading-relaxed mb-6">
              Earth is a resource-drained husk. The Off-World Colonies are humanity's last hope, but they are starving.
              Supply lines are stretched thin. Fuel is expensive.
            </p>
            <p className="text-base sm:text-lg text-gray-400 leading-relaxed mb-8">
              You are a <strong>Cargo Master</strong>. Your algorithm-assisted neural link allows you to see spatial possibilities others miss. 
              Efficiency isn't just a metric anymore—it's survival.
            </p>
            
            <div className="flex flex-wrap items-center gap-4 pt-4 border-t border-gray-800">
               <div className="flex -space-x-2">
                  {[1,2,3,4].map(i => (
                    <div key={i} className="w-8 h-8 rounded-full bg-gray-700 border-2 border-black flex items-center justify-center text-[10px] shadow-lg">AI</div>
                  ))}
               </div>
               <div className="text-sm text-gray-500">
                 <span className="text-white font-bold">12,403</span> Logisticians Active
               </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 border-t border-white/5 bg-black pt-16 pb-8 px-4 sm:px-6 mt-auto">
        <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12 text-center md:text-left">
                <div className="col-span-1 md:col-span-2">
                    <div className="flex items-center justify-center md:justify-start gap-2 mb-4">
                        <Box className="w-6 h-6 text-orange-500" />
                        <span className="font-bold text-xl tracking-tight text-white">CARGO MASTER</span>
                    </div>
                    <p className="text-gray-500 text-sm leading-relaxed max-w-sm mx-auto md:mx-0">
                        The ultimate spatial reasoning trainer. Designed for the next generation of logistics experts. 
                        Optimize, stack, and survive.
                    </p>
                </div>
                
                <div>
                    <h4 className="font-bold text-white mb-4 tracking-wide">CONNECT</h4>
                    <div className="flex flex-col gap-3 items-center md:items-start text-sm text-gray-400">
                        <a href="mailto:themvaplatform@gmail.com" className="hover:text-orange-500 transition-colors flex items-center gap-2 group">
                            <Mail className="w-4 h-4 group-hover:scale-110 transition-transform" /> themvaplatform@gmail.com
                        </a>
                        <a href="https://vickyiitp.tech" target="_blank" rel="noopener noreferrer" className="hover:text-orange-500 transition-colors flex items-center gap-2 group">
                            <ExternalLink className="w-4 h-4 group-hover:scale-110 transition-transform" /> vickyiitp.tech
                        </a>
                    </div>
                </div>

                <div>
                    <h4 className="font-bold text-white mb-4 tracking-wide">FOLLOW US</h4>
                    <div className="flex gap-2 justify-center md:justify-start">
                        {socials.map((s, i) => <SocialLink key={i} {...s} />)}
                    </div>
                </div>
            </div>

            <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-gray-600">
                <p>© 2025 Vicky Kumar. All rights reserved.</p>
                <div className="flex gap-6">
                    <button onClick={() => onLegal('privacy')} className="hover:text-white transition-colors">Privacy</button>
                    <button onClick={() => onLegal('terms')} className="hover:text-white transition-colors">Terms</button>
                    <span className="cursor-default">v1.0.0</span>
                </div>
            </div>
        </div>
      </footer>

      {/* Back to Top */}
      <button 
        onClick={scrollToTop}
        className={`fixed bottom-8 right-8 bg-orange-600 text-white p-3 rounded-full shadow-lg transition-all duration-300 z-40 hover:bg-orange-500 hover:-translate-y-1 ${showBackToTop ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10 pointer-events-none'}`}
        aria-label="Back to Top"
      >
        <ArrowUp className="w-5 h-5" />
      </button>
    </div>
  );
};

export default LandingPage;