import React, { useState, useEffect } from 'react';
import { Menu, X, ArrowRight, QrCode, Shield, Zap, Sparkles, Image as ImageIcon } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

const AntiGravityLanding = () => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const handleMouseMove = (e) => {
    if (isMobile) return;
    const { clientX, clientY } = e;
    const { innerWidth, innerHeight } = window;
    
    const x = (clientX / innerWidth) * 2 - 1;
    const y = (clientY / innerHeight) * 2 - 1;
    setMousePosition({ x, y });
  };

  const handleCreateQr = () => {
    setIsMobileMenuOpen(false);
    if (isAuthenticated) {
        navigate("/dashboard/generate");
    } else {
        navigate("/login");
    }
  };

  const handleDashboard = () => {
    setIsMobileMenuOpen(false);
    navigate("/dashboard/generate");
  };

  const shapes = [
    { type: 'circle', color: 'bg-blue-500/20', size: 'w-64 h-64', top: '10%', left: '15%', delay: 0 },
    { type: 'square', color: 'bg-indigo-500/20', size: 'w-48 h-48', top: '60%', left: '80%', delay: 1 },
    { type: 'circle', color: 'bg-purple-500/20', size: 'w-72 h-72', top: '40%', left: '20%', delay: 2 },
    { type: 'square', color: 'bg-cyan-500/20', size: 'w-32 h-32', top: '20%', left: '75%', delay: 0.5 },
    { type: 'circle', color: 'bg-indigo-600/10', size: 'w-96 h-96', top: '70%', left: '10%', delay: 1.5 },
  ];

  const features = [
    { title: 'Dynamic Routing', desc: 'Update destination URLs anytime without changing your physical printed QR codes.', icon: <Zap className="w-6 h-6 text-purple-400" />, colSpan: 'md:col-span-1' },
    { title: 'Custom Analytics', desc: 'Track scans, geographical locations, and device types in real-time.', icon: <QrCode className="w-6 h-6 text-blue-400" />, colSpan: 'md:col-span-1' },
    { title: 'High-Res Exports', desc: 'Download your creations in print-ready vector formats or high-resolution PNGs.', icon: <ImageIcon className="w-6 h-6 text-indigo-400" />, colSpan: 'md:col-span-1' },
  ];

  return (
    <div className="bg-slate-950 text-slate-100 font-sans selection:bg-cyan-500/30 overflow-x-hidden relative" style={{ minHeight: '100vh' }}>
      
      {/* Floating Pill Navbar */}
      <nav className="fixed top-6 left-1/2 -translate-x-1/2 z-50 w-[90%] max-w-5xl rounded-full backdrop-blur-md bg-white/5 border border-white/10 shadow-2xl shadow-indigo-500/10 px-6 py-4 flex justify-between items-center transition-all duration-300">
        <div className="flex items-center gap-2 group cursor-pointer" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-400 to-indigo-600 flex items-center justify-center text-white font-bold group-hover:scale-110 transition-transform">
            <QrCode className="w-5 h-5 text-white" />
          </div>
          <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-purple-500">
            QRVerse
          </span>
        </div>

        <div className="hidden md:flex items-center gap-4">
          {!isAuthenticated ? (
            <button onClick={() => navigate('/login')} className="text-sm font-medium text-slate-300 hover:text-white transition-colors">
              Sign In
            </button>
          ) : (
            <button onClick={handleDashboard} className="text-sm font-medium text-slate-300 hover:text-white transition-colors">
              Dashboard
            </button>
          )}
          <button onClick={handleCreateQr} className="px-6 py-2 rounded-full bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-white font-medium shadow-[0_0_20px_rgba(6,182,212,0.4)] hover:shadow-[0_0_30px_rgba(99,102,241,0.6)] transition-all duration-300 flex items-center gap-2 transform hover:-translate-y-1">
            Create QR Code <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        {/* Mobile Menu Toggle */}
        <button className="md:hidden text-slate-300" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
          {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </nav>

      {/* Mobile Menu Dropdown */}
      {isMobileMenuOpen && (
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="fixed inset-x-4 top-24 z-40 rounded-2xl backdrop-blur-xl bg-slate-900/90 border border-white/10 p-6 flex flex-col gap-4 shadow-2xl md:hidden"
        >
          {!isAuthenticated ? (
            <button onClick={() => { setIsMobileMenuOpen(false); navigate('/login'); }} className="mt-2 py-2 text-lg font-medium text-slate-300 hover:text-white border-b border-white/5 text-left">
              Sign In
            </button>
          ) : (
            <button onClick={handleDashboard} className="mt-2 py-2 text-lg font-medium text-slate-300 hover:text-white border-b border-white/5 text-left">
              Dashboard
            </button>
          )}
          <button onClick={handleCreateQr} className="mt-4 px-6 py-3 rounded-full bg-gradient-to-r from-cyan-500 to-indigo-600 text-white font-medium flex justify-center items-center gap-2">
            Create QR Code <ArrowRight className="w-4 h-4" />
          </button>
        </motion.div>
      )}

      {/* Hero Section */}
      <section 
        className="relative flex flex-col justify-center items-center pt-32 pb-16 px-4 md:px-8 overflow-hidden min-h-[100vh]"
        onMouseMove={handleMouseMove}
      >
        {/* Floating Background Shapes */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {shapes.map((shape, i) => (
            <motion.div
              key={i}
              animate={{ y: [0, -40, 0] }}
              transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: shape.delay }}
              className="absolute mix-blend-screen"
              style={{ top: shape.top, left: shape.left }}
            >
              <motion.div
                className={`${shape.color} ${shape.size} ${shape.type === 'circle' ? 'rounded-full' : 'rounded-3xl rotate-12'} blur-3xl opacity-60`}
                animate={!isMobile ? {
                  x: mousePosition.x * -70,
                  y: mousePosition.y * -70,
                } : {}}
                transition={{ type: "spring", stiffness: 40, damping: 30 }}
              />
            </motion.div>
          ))}
        </div>

        {/* Hero Content */}
        <div className="relative z-10 text-center max-w-4xl mx-auto flex flex-col items-center mt-12 mb-12">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full backdrop-blur-md bg-white/5 border border-white/10 text-sm font-medium text-cyan-300 mb-8"
          >
            <Sparkles className="w-4 h-4" />
            Next-Generation QR Generation
          </motion.div>
          
          <motion.h1 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="text-5xl md:text-7xl lg:text-8xl font-black tracking-tight mb-8 leading-tight"
          >
            Welcome to <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-indigo-500 to-purple-600 drop-shadow-[0_0_30px_rgba(99,102,241,0.4)]">
              QRVerse
            </span>
          </motion.h1>

          <motion.p 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-lg md:text-2xl text-slate-400 max-w-2xl mb-12"
          >
            Generate stunning QR codes that blend seamlessly into your brand identity, complete with deep analytics and dynamic routing.
          </motion.p>

          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto"
          >
            <button onClick={handleCreateQr} className="px-8 py-4 rounded-full bg-white text-slate-950 font-bold text-lg hover:bg-slate-200 transition-colors shadow-[0_0_20px_rgba(255,255,255,0.3)] hover:shadow-[0_0_30px_rgba(255,255,255,0.5)] transform hover:-translate-y-1 w-full sm:w-auto">
              Create QR Code
            </button>
            <button onClick={() => document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' })} className="px-8 py-4 rounded-full backdrop-blur-md bg-white/5 border border-white/10 text-white font-bold text-lg hover:bg-white/10 transition-colors transform hover:-translate-y-1 w-full sm:w-auto">
              Explore Features
            </button>
          </motion.div>
        </div>
      </section>

      {/* Bento Box Feature Grid */}
      <section id="features" className="relative z-10 max-w-7xl mx-auto px-4 md:px-8 py-24">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold mb-4">Engineered for <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-indigo-500">Brands</span></h2>
          <p className="text-slate-400 text-lg max-w-2xl mx-auto">Everything you need to build next-generation physical-to-digital experiences, packed into a beautiful workflow.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {features.map((feature, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.6, delay: i * 0.1 }}
              whileHover={{ y: -10, transition: { duration: 0.2 } }}
              className={`p-8 rounded-3xl backdrop-blur-md bg-white/5 border border-white/10 group overflow-hidden relative ${feature.colSpan}`}
            >
              {/* Hover Glow Effect */}
              <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/0 to-indigo-500/0 group-hover:from-cyan-500/10 group-hover:to-indigo-500/10 transition-colors duration-500" />
              
              <div className="relative z-10">
                <div className="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg shadow-black/20 group-hover:shadow-cyan-500/20">
                  {feature.icon}
                </div>
                <h3 className="text-2xl font-bold mb-3 text-slate-100 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-cyan-400 group-hover:to-indigo-400 transition-all">
                  {feature.title}
                </h3>
                <p className="text-slate-400 leading-relaxed">
                  {feature.desc}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 border-t border-white/10 mt-20 py-12 text-center text-slate-500">
        <p>© 2026 QRVerse. Designed with precision.</p>
      </footer>
    </div>
  );
};

export default AntiGravityLanding;
