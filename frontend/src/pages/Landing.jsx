import React, { useState, useEffect, useCallback, useContext } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

/* ── Starfield ── */
const Starfield = () => {
  const stars = React.useMemo(() => Array.from({ length: 160 }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: Math.random() * 1.8 + 0.4,
    dur: Math.random() * 4 + 2,
    delay: Math.random() * 5,
    layer: Math.floor(Math.random() * 3),
  })), []);

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {stars.map(s => (
        <motion.div
          key={s.id}
          className="absolute rounded-full bg-white"
          style={{ left: `${s.x}%`, top: `${s.y}%`, width: s.size, height: s.size }}
          animate={{ opacity: [0.1, 0.8, 0.1], y: [0, -(s.layer + 1) * 30] }}
          transition={{ opacity: { duration: s.dur, delay: s.delay, repeat: Infinity, ease: 'easeInOut' }, y: { duration: 20 + s.layer * 10, delay: s.delay, repeat: Infinity, ease: 'linear' } }}
        />
      ))}
    </div>
  );
};

/* ── Video Modal ── */
const VideoModal = ({ isOpen, onClose }) => {
  const onKey = useCallback((e) => { if (e.key === 'Escape') onClose(); }, [onClose]);
  useEffect(() => {
    if (isOpen) { document.addEventListener('keydown', onKey); document.body.style.overflow = 'hidden'; }
    return () => { document.removeEventListener('keydown', onKey); document.body.style.overflow = ''; };
  }, [isOpen, onKey]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/75 backdrop-blur-xl px-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.85, opacity: 0, y: 30 }} animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.85, opacity: 0, y: 30 }}
            transition={{ type: 'spring', damping: 26, stiffness: 320 }}
            className="relative w-full max-w-4xl rounded-2xl overflow-hidden border border-[#6ee71c]/20 shadow-[0_0_80px_rgba(110,231,28,0.15)]"
            onClick={e => e.stopPropagation()}
          >
            <button onClick={onClose} className="absolute top-3 right-3 z-10 w-9 h-9 rounded-full bg-black/50 border border-white/20 flex items-center justify-center text-white hover:bg-white/20 transition-all">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
            </button>
            {/* Real project demo video (recorded session) */}
            <div className="aspect-video w-full bg-[#070d08] flex flex-col items-center justify-center relative">
              <div className="absolute inset-0 bg-gradient-to-br from-[#0d1f0e] to-[#050a06]" />
              {/* Embed the actual recorded demo */}
              <video
                className="w-full h-full object-cover"
                controls
                autoPlay
                playsInline
                src="/demo.webp"
                poster=""
                onError={(e) => {
                  // Fallback: show animated demo UI if video fails to load
                  e.target.style.display = 'none';
                  e.target.parentNode.querySelector('.demo-fallback').style.display = 'flex';
                }}
              >
                Your browser does not support the video tag.
              </video>
              {/* Fallback demo UI */}
              <div className="demo-fallback absolute inset-0 flex-col items-center justify-center" style={{ display: 'none' }}>
                <div className="w-20 h-20 rounded-full bg-[#6ee71c]/20 border border-[#6ee71c]/40 flex items-center justify-center mb-4">
                  <svg className="w-8 h-8 text-[#6ee71c] translate-x-0.5" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>
                </div>
                <p className="text-[#6ee71c] font-bold text-lg">Orionify CRM Demo</p>
                <p className="text-gray-400 text-sm mt-2">Full walkthrough: Login → Dashboard → Analytics → Add Lead</p>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

/* ── Landing ── */
const Landing = () => {
  const [videoOpen, setVideoOpen] = useState(false);
  const { admin } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => { if (admin?.token) navigate('/dashboard', { replace: true }); }, [admin, navigate]);

  return (
    <div className="min-h-screen bg-[#060c07] font-sans overflow-hidden relative">

      {/* ── Backgrounds ── */}
      <div className="absolute inset-0 z-0">
        <Starfield />

        {/* Central bright GREEN pillar — matching reference image exactly */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[85vh]"
          style={{ background: 'linear-gradient(to bottom, rgba(110,231,28,0.55) 0%, rgba(110,231,28,0.25) 30%, rgba(110,231,28,0.08) 60%, transparent 100%)', filter: 'blur(70px)', mixBlendMode: 'screen' }} />

        {/* Halo ring at top */}
        <div className="absolute top-[-10%] left-1/2 -translate-x-1/2 w-[800px] h-[500px] rounded-full"
          style={{ background: 'radial-gradient(ellipse at center, rgba(110,231,28,0.18) 0%, transparent 70%)', filter: 'blur(40px)' }} />

        {/* Rock / Stone left */}
        <div className="absolute bottom-0 left-0 w-[360px] h-[350px] opacity-70"
          style={{ background: 'radial-gradient(ellipse at bottom left, rgba(40,50,35,0.95) 0%, rgba(20,30,18,0.8) 50%, transparent 80%)' }} />
        <div className="absolute bottom-0 left-[-20px] w-[300px] h-[320px]"
          style={{ background: 'conic-gradient(from 200deg at 0% 100%, #1a2b15 0deg, #0f1a0c 60deg, #1e2e18 100deg, transparent 160deg)', filter: 'blur(2px)', opacity: 0.85 }} />

        {/* Rock / Stone right */}
        <div className="absolute bottom-0 right-0 w-[360px] h-[350px] opacity-70"
          style={{ background: 'radial-gradient(ellipse at bottom right, rgba(40,50,35,0.95) 0%, rgba(20,30,18,0.8) 50%, transparent 80%)' }} />
        <div className="absolute bottom-0 right-[-20px] w-[300px] h-[320px]"
          style={{ background: 'conic-gradient(from -20deg at 100% 100%, #1a2b15 0deg, #0f1a0c 60deg, #1e2e18 100deg, transparent 160deg)', filter: 'blur(2px)', opacity: 0.85 }} />

        {/* Ground fog */}
        <div className="absolute bottom-0 left-0 right-0 h-48"
          style={{ background: 'linear-gradient(to top, rgba(6,12,7,0.9) 0%, transparent 100%)' }} />

        {/* Subtle vignette */}
        <div className="absolute inset-0" style={{ background: 'radial-gradient(ellipse at center, transparent 40%, rgba(4,8,5,0.7) 100%)' }} />
      </div>

      {/* ── Navbar ── */}
      <nav className="relative z-20 flex justify-between items-center px-8 md:px-14 py-5 max-w-[1400px] mx-auto">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-[#6ee71c] flex items-center justify-center shadow-[0_0_18px_rgba(110,231,28,0.5)]">
            <div className="w-3 h-3 bg-[#060c07] rounded-sm transform rotate-45" />
          </div>
          <span className="text-white text-lg font-black tracking-tight">Orionify<span className="text-[#6ee71c]">.</span></span>
        </div>

        <div className="hidden md:flex items-center gap-8 text-sm font-medium text-gray-400">
          {['Product', 'Customers', 'About us'].map(item => (
            <a key={item} href="#" className="hover:text-white transition-colors">{item}</a>
          ))}
        </div>

        <div className="flex items-center gap-3">
          <Link to="/login" className="text-sm font-semibold text-gray-300 hover:text-white transition-colors px-3 py-2">Log in</Link>
          <button
            onClick={() => setVideoOpen(true)}
            className="px-5 py-2.5 rounded-full border border-white/15 bg-white/5 text-white text-sm font-semibold hover:bg-white/10 transition-all backdrop-blur-md"
          >
            Book a demo
          </button>
        </div>
      </nav>

      {/* ── Hero ── */}
      <main className="relative z-10 max-w-[1200px] mx-auto px-6 pt-16 pb-48 flex flex-col items-start">

        <motion.div
          initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
          className="max-w-2xl"
        >
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-white/10 bg-white/5 text-[#6ee71c] text-[10px] font-bold tracking-widest uppercase mb-8 backdrop-blur-md">
            <span className="w-1.5 h-1.5 rounded-full bg-[#6ee71c] animate-pulse shadow-[0_0_6px_#6ee71c]" />
            FOR FREELANCERS & AGENCIES
          </div>

          {/* Headline */}
          <h1 className="text-5xl md:text-[64px] font-black text-white leading-[1.05] tracking-tight mb-6">
            One platform to{'\n'}
            <span className="text-white">handle everything</span>
          </h1>

          {/* Sub */}
          <p className="text-gray-400 text-base md:text-lg font-medium leading-relaxed max-w-lg mb-10">
            Consolidate your projects, clients and team into one integrated, easy-to-use platform.
          </p>

          {/* CTAs */}
          <div className="flex flex-wrap items-center gap-4">
            <Link to="/signup"
              className="px-8 py-3.5 rounded-full bg-[#6ee71c] text-[#060c07] text-sm font-black shadow-[0_0_30px_rgba(110,231,28,0.4)] hover:shadow-[0_0_50px_rgba(110,231,28,0.6)] hover:-translate-y-0.5 transition-all"
            >
              Get started
            </Link>
            <button
              onClick={() => setVideoOpen(true)}
              className="group flex items-center gap-3 px-6 py-3.5 rounded-full border border-white/12 bg-white/5 text-white text-sm font-semibold hover:bg-white/10 transition-all backdrop-blur-md"
            >
              <motion.span
                className="w-8 h-8 rounded-full bg-[#6ee71c]/20 border border-[#6ee71c]/40 text-[#6ee71c] flex items-center justify-center"
                animate={{ scale: [1, 1.18, 1] }}
                transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
              >
                <svg className="w-3 h-3 translate-x-0.5" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>
              </motion.span>
              Book a demo
            </button>
          </div>
        </motion.div>

        {/* ── Dashboard Laptop Mockup ── */}
        <motion.div
          className="relative mt-16 w-full max-w-4xl mx-auto"
          initial={{ opacity: 0, y: 80 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.3, ease: [0.16, 1, 0.3, 1], delay: 0.35 }}
        >
          {/* Glow behind laptop */}
          <div className="absolute -inset-6 rounded-[3rem] z-0"
            style={{ background: 'radial-gradient(ellipse at center, rgba(110,231,28,0.12) 0%, transparent 70%)', filter: 'blur(30px)' }} />

          {/* Laptop shell */}
          <div className="relative z-10 rounded-t-2xl border border-white/12 overflow-hidden shadow-[0_40px_80px_rgba(0,0,0,0.8)]"
            style={{ background: 'linear-gradient(to bottom, rgba(13,25,10,0.95), rgba(5,10,6,0.98))' }}
          >
            {/* Browser bar */}
            <div className="h-8 flex items-center justify-between px-4 border-b border-white/5" style={{ background: 'rgba(255,255,255,0.02)' }}>
              <div className="flex gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full bg-red-500/80" />
                <div className="w-2.5 h-2.5 rounded-full bg-yellow-400/80" />
                <div className="w-2.5 h-2.5 rounded-full bg-[#6ee71c]/80" />
              </div>
              <div className="w-48 h-4 rounded bg-white/5 border border-white/5 flex items-center px-2">
                <span className="text-[9px] text-gray-600 font-mono">app.orionify.com/dashboard</span>
              </div>
              <div className="w-16" />
            </div>

            {/* Dashboard content */}
            <div className="flex h-56 md:h-72">
              {/* Sidebar */}
              <div className="w-40 border-r border-white/5 p-3 hidden md:flex flex-col gap-1.5" style={{ background: 'rgba(5,10,6,0.6)' }}>
                <div className="flex items-center gap-1.5 mb-3 px-1">
                  <div className="w-4 h-4 rounded bg-[#6ee71c] flex items-center justify-center">
                    <div className="w-1.5 h-1.5 bg-black rotate-45" />
                  </div>
                  <span className="text-white text-[10px] font-black">Orionify.</span>
                </div>
                {['Overview', 'Pipeline', 'Add Lead', 'Analytics'].map((item, i) => (
                  <div key={item} className={`px-3 py-2 rounded-lg text-[10px] font-semibold ${i === 0 ? 'bg-[#6ee71c]/15 text-[#6ee71c]' : 'text-gray-500'}`}>{item}</div>
                ))}
              </div>

              {/* Main */}
              <div className="flex-1 p-5 flex flex-col gap-3">
                <div className="flex justify-between items-center mb-1">
                  <div>
                    <p className="text-white text-xs font-bold">Good Afternoon, QZ Agency</p>
                    <p className="text-gray-500 text-[9px]">Friday, 25 October 2024</p>
                  </div>
                  <div className="text-right">
                    <div className="text-white text-[10px] font-semibold">Admin User</div>
                    <div className="text-[9px] text-gray-500">admin@minicrm.com</div>
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                  {[
                    { label: 'Total Revenue', val: '$258,976', color: 'text-white' },
                    { label: 'Total Leads', val: '428', color: 'text-[#6ee71c]' },
                    { label: 'Win Rate', val: '43.6%', color: 'text-[#6ee71c]' },
                    { label: 'Avg. Offer', val: '$89,245', color: 'text-blue-400' },
                  ].map(c => (
                    <div key={c.label} className="rounded-xl p-3 border border-white/5" style={{ background: 'rgba(255,255,255,0.04)' }}>
                      <p className="text-[8px] text-gray-500 uppercase tracking-wider mb-0.5">{c.label}</p>
                      <p className={`text-sm font-black ${c.color}`}>{c.val}</p>
                    </div>
                  ))}
                </div>

                {/* Mini bar chart */}
                <div className="flex-1 rounded-xl p-3 border border-white/5" style={{ background: 'rgba(255,255,255,0.03)' }}>
                  <p className="text-[9px] text-gray-500 uppercase tracking-wider mb-2">Monthly Revenue</p>
                  <div className="flex items-end gap-1.5 h-12">
                    {[35, 55, 40, 80, 60, 95, 70, 85, 45].map((h, i) => (
                      <div key={i} className="flex-1 rounded-t-sm transition-all"
                        style={{ height: `${h}%`, background: i === 5 ? '#6ee71c' : 'rgba(255,255,255,0.12)' }} />
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom fade */}
            <div className="absolute bottom-0 left-0 right-0 h-16 z-10 pointer-events-none"
              style={{ background: 'linear-gradient(to top, rgba(5,10,6,1), transparent)' }} />
          </div>

          {/* Play button overlay */}
          <motion.button
            onClick={() => setVideoOpen(true)}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20 w-16 h-16 rounded-full bg-[#6ee71c] flex items-center justify-center"
            style={{ boxShadow: '0 0 40px rgba(110,231,28,0.6), 0 0 80px rgba(110,231,28,0.2)' }}
            whileHover={{ scale: 1.12 }} whileTap={{ scale: 0.93 }}
          >
            <div className="absolute inset-0 rounded-full bg-[#6ee71c] animate-ping opacity-25" />
            <svg className="w-6 h-6 text-[#060c07] translate-x-0.5" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>
          </motion.button>

          {/* Laptop base */}
          <div className="w-full h-3 rounded-b-xl relative z-10"
            style={{ background: 'linear-gradient(to bottom, #9ca3af, #6b7280)' }}>
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-28 h-1 rounded-b-md" style={{ background: '#9ca3af' }} />
          </div>
        </motion.div>

        {/* Social proof */}
        <motion.div
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.4 }}
          className="mt-12 flex items-center gap-4 mx-auto"
        >
          <div className="flex -space-x-2.5">
            {[11, 12, 13, 14, 15].map(n => (
              <img key={n} src={`https://i.pravatar.cc/40?img=${n}`}
                className="w-8 h-8 rounded-full border-2 border-[#060c07]" alt="" />
            ))}
          </div>
          <p className="text-gray-400 text-sm">
            Trusted by <span className="text-white font-bold">15,000+</span> businesses worldwide
          </p>
        </motion.div>
      </main>

      <VideoModal isOpen={videoOpen} onClose={() => setVideoOpen(false)} />
    </div>
  );
};

export default Landing;
