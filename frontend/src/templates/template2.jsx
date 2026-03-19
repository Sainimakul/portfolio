"use client";

import { useState, useEffect, useRef } from "react";
import { success, error } from "../util/toast";
import { usePortfolio } from "../../context/PortfolioContext";

// ─── Helpers ──────────────────────────────────────────────────────────────────
function fmtDate(d) {
  if (!d) return "";
  return new Date(d).toLocaleDateString("en-US", { year: "numeric", month: "short" });
}

function useInView(ref, threshold = 0.1) {
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setInView(true); }, { threshold });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);
  return inView;
}

// ─── Card wrapper ─────────────────────────────────────────────────────────────
function Card({ children, className = "", featured = false, style = {}, onClick }) {
  return (
    <div
      onClick={onClick}
      style={style}
      className={`
        relative bg-[#161B27] border border-[#242D3E] rounded-2xl
        transition-all duration-300 ease-out
        hover:border-[#3B82F6]/40 hover:shadow-[0_8px_40px_rgba(59,130,246,0.1)] hover:-translate-y-1
        ${featured ? "shadow-[0_4px_24px_rgba(0,0,0,0.4)]" : "shadow-[0_2px_12px_rgba(0,0,0,0.3)]"}
        ${className}
      `}
    >
      {children}
    </div>
  );
}

// ─── Section Header ───────────────────────────────────────────────────────────
function SectionHeader({ eyebrow, title, subtitle }) {
  return (
    <div className="mb-8">
      <div className="inline-flex items-center gap-2 bg-[#1E2535] border border-[#2D3748] rounded-full px-3 py-1 mb-3">
        <div className="w-1.5 h-1.5 rounded-full bg-[#3B82F6]" />
        <span className="text-[11px] font-semibold tracking-widest uppercase text-[#64748B]">{eyebrow}</span>
      </div>
      <h2 className="font-display text-3xl md:text-4xl font-bold text-white leading-tight">
        {title}
        {subtitle && <span className="text-[#3B82F6] ml-2">{subtitle}</span>}
      </h2>
    </div>
  );
}

// ─── Stat Badge ───────────────────────────────────────────────────────────────
function StatBadge({ value, label, accent = false }) {
  return (
    <div className={`flex flex-col items-center justify-center rounded-xl p-4 ${accent ? "bg-[#1E3A5F] border border-[#3B82F6]/30" : "bg-[#1A2030] border border-[#242D3E]"}`}>
      <span className={`font-display text-3xl font-extrabold ${accent ? "text-[#3B82F6]" : "text-white"}`}>{value}+</span>
      <span className="text-xs text-[#64748B] font-medium tracking-wide mt-0.5">{label}</span>
    </div>
  );
}

// ─── Main ─────────────────────────────────────────────────────────────────────
export default function Template2() {
  const { portfolioData, loading } = usePortfolio();
  const profile        = portfolioData?.profile.data       || {};
  const skills         = portfolioData?.skills.data        || [];
  const projects       = portfolioData?.projects.data      || [];
  const blogs          = portfolioData?.blogs.data         || [];
  const testimonials   = portfolioData?.testimonials.data  || [];
  const socialLinks    = portfolioData?.SocialLinks.data   || [];
  const experiences    = portfolioData?.experiences.data   || [];

  const [menuOpen, setMenuOpen]   = useState(false);
  const [activeTab, setActiveTab] = useState("all");
  const [form, setForm]           = useState({ name: "", email: "", subject: "", message: "" });
  const [sending, setSending]     = useState(false);

  const skillsRef   = useRef(null);
  const projectsRef = useRef(null);
  const expRef      = useRef(null);
  const blogRef     = useRef(null);
  const contactRef  = useRef(null);
  const testimonRef = useRef(null);

  const skillsVis   = useInView(skillsRef);
  const projectsVis = useInView(projectsRef);
  const expVis      = useInView(expRef);
  const blogVis     = useInView(blogRef);
  const contactVis  = useInView(contactRef);
  const testimonVis = useInView(testimonRef);

  async function handleSubmit(e) {
    e.preventDefault();
    setSending(true);
    await new Promise((r) => setTimeout(r, 1200));
    setSending(false);
    setForm({ name: "", email: "", subject: "", message: "" });
    success("Message sent! I'll get back to you shortly.");
  }

  const navItems = ["Skills", "Projects", "Experience", "Blog", "Contact"];

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800;900&family=Fraunces:ital,opsz,wght@0,9..144,300;0,9..144,600;1,9..144,300&family=JetBrains+Mono:wght@400;500&display=swap');

        .font-display { font-family: 'Outfit', sans-serif; }
        .font-body    { font-family: 'Outfit', sans-serif; }
        .font-serif   { font-family: 'Fraunces', serif; }
        .font-mono    { font-family: 'JetBrains Mono', monospace; }

        html { scroll-behavior: smooth; }
        ::-webkit-scrollbar { width: 5px; background: #0D1117; }
        ::-webkit-scrollbar-thumb { background: #3B82F6; border-radius: 4px; }

        @keyframes fadeUp   { from { opacity:0; transform:translateY(20px); } to { opacity:1; transform:translateY(0); } }
        @keyframes fadeIn   { from { opacity: 0 } to { opacity: 1 } }
        @keyframes glow     { 0%,100%{ box-shadow:0 0 20px rgba(59,130,246,.2); } 50%{ box-shadow:0 0 40px rgba(59,130,246,.5); } }
        @keyframes spin     { to { transform: rotate(360deg) } }
        @keyframes pulseDot { 0%,100%{ transform: scale(1); opacity:1; } 50%{ transform: scale(1.4); opacity:.6; } }
        @keyframes barFill  { from { width: 0 !important; } }
        @keyframes float    { 0%,100%{ transform:translateY(0); } 50%{ transform:translateY(-6px); } }
        @keyframes shimmer  { 0%{ background-position: -200% center; } 100%{ background-position: 200% center; } }

        .anim-fadeUp     { animation: fadeUp 0.6s cubic-bezier(.16,1,.3,1) both; }
        .anim-fadeIn     { animation: fadeIn 0.5s ease both; }
        .anim-glow       { animation: glow 3s ease-in-out infinite; }
        .anim-spin       { animation: spin 20s linear infinite; }
        .anim-pulseDot   { animation: pulseDot 2s ease-in-out infinite; }
        .anim-float      { animation: float 4s ease-in-out infinite; }

        .reveal { opacity: 0; transform: translateY(18px); transition: opacity .6s ease, transform .6s cubic-bezier(.16,1,.3,1); }
        .reveal.show { opacity: 1; transform: translateY(0); }

        .bar-fill { animation: barFill 1.2s cubic-bezier(.4,0,.2,1) both; }

        .grid-bg {
          background-image:
            linear-gradient(rgba(59,130,246,.04) 1px, transparent 1px),
            linear-gradient(90deg, rgba(59,130,246,.04) 1px, transparent 1px);
          background-size: 56px 56px;
        }

        .shimmer-text {
          background: linear-gradient(90deg, #94A3B8 0%, #FFFFFF 40%, #3B82F6 60%, #94A3B8 100%);
          background-size: 200% auto;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          animation: shimmer 4s linear infinite;
        }

        .card-dot-grid::before {
          content: '';
          position: absolute;
          top: 0; right: 0;
          width: 120px; height: 120px;
          background-image: radial-gradient(circle, rgba(59,130,246,.15) 1px, transparent 1px);
          background-size: 12px 12px;
          border-radius: 0 16px 0 0;
          pointer-events: none;
        }

        .nav-pill { transition: all .2s ease; }
        .nav-pill:hover, .nav-pill.active { background: #1E2D45; color: #3B82F6; }

        .tag {
          background: #1A2535;
          border: 1px solid #2A3548;
          color: #94A3B8;
          font-size: 11px;
          font-weight: 500;
          padding: 3px 10px;
          border-radius: 6px;
          transition: all .2s;
        }
        .tag:hover { border-color: #3B82F6; color: #3B82F6; }

        .input-field {
          background: #0D1117;
          border: 1.5px solid #242D3E;
          border-radius: 10px;
          color: #E2E8F0;
          padding: 12px 16px;
          font-size: 14px;
          font-family: 'Outfit', sans-serif;
          width: 100%;
          outline: none;
          transition: border-color .2s, box-shadow .2s;
        }
        .input-field::placeholder { color: #374151; }
        .input-field:focus { border-color: #3B82F6; box-shadow: 0 0 0 3px rgba(59,130,246,.1); }

        .btn-primary {
          background: #3B82F6;
          color: white;
          font-weight: 600;
          font-size: 14px;
          padding: 12px 28px;
          border-radius: 10px;
          border: none;
          cursor: pointer;
          transition: all .2s;
          display: inline-flex;
          align-items: center;
          gap: 8px;
          font-family: 'Outfit', sans-serif;
        }
        .btn-primary:hover { background: #2563EB; transform: translateY(-1px); box-shadow: 0 8px 24px rgba(59,130,246,.4); }
        .btn-primary:disabled { opacity: .6; cursor: not-allowed; transform: none; }

        .btn-ghost {
          background: transparent;
          color: #94A3B8;
          font-weight: 600;
          font-size: 14px;
          padding: 12px 28px;
          border-radius: 10px;
          border: 1.5px solid #242D3E;
          cursor: pointer;
          transition: all .2s;
          display: inline-flex;
          align-items: center;
          gap: 8px;
          font-family: 'Outfit', sans-serif;
        }
        .btn-ghost:hover { border-color: #3B82F6; color: #3B82F6; background: rgba(59,130,246,.05); }

        .skill-level-badge {
          font-size: 10px;
          font-weight: 600;
          padding: 2px 8px;
          border-radius: 100px;
          letter-spacing: .05em;
        }

        .timeline-connector {
          position: absolute;
          left: 19px;
          top: 44px;
          bottom: -24px;
          width: 2px;
          background: linear-gradient(to bottom, #3B82F6, transparent);
        }

        .hero-card-glow {
          box-shadow: 0 0 0 1px rgba(59,130,246,.2), 0 24px 64px rgba(0,0,0,.5), 0 0 80px rgba(59,130,246,.06);
        }
      `}</style>

      <div className="font-body bg-[#0D1117] text-slate-200 min-h-screen">

        {/* ── Ambient background ── */}
        <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
          <div className="absolute top-[-200px] right-[-200px] w-[600px] h-[600px] rounded-full bg-blue-600/[0.04] blur-[100px]" />
          <div className="absolute bottom-[-100px] left-[-100px] w-[400px] h-[400px] rounded-full bg-blue-500/[0.03] blur-[80px]" />
          <div className="grid-bg absolute inset-0 opacity-60" />
        </div>

        {/* ══════════════════════ NAV ══════════════════════════ */}
        <nav className="sticky top-0 z-50 bg-[#0D1117]/80 backdrop-blur-2xl border-b border-[#1E2535]">
          <div className="max-w-7xl mx-auto px-5 md:px-10 flex items-center justify-between h-16">

            {/* Logo */}
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 bg-[#3B82F6] rounded-lg flex items-center justify-center">
                <span className="font-display font-black text-white text-sm">
                  {profile.name?.split(" ").map(w => w[0]).join("").slice(0,2)}
                </span>
              </div>
              <span className="font-display font-bold text-white">{profile.name?.split(" ")[0]}</span>
            </div>

            {/* Desktop nav */}
            <div className="hidden md:flex items-center gap-1 bg-[#111827] border border-[#1E2535] rounded-full p-1">
              {navItems.map((s) => (
                <a key={s} href={`#${s.toLowerCase()}`}
                  className="nav-pill text-[12px] font-semibold tracking-wide text-slate-500 px-4 py-1.5 rounded-full">
                  {s}
                </a>
              ))}
            </div>

            {/* CTA */}
            <a href="#contact" className="hidden md:inline-flex btn-primary text-sm py-2 px-5">
              Hire Me <span>↗</span>
            </a>

            {/* Hamburger */}
            <button className="md:hidden p-2 text-slate-400 hover:text-white" onClick={() => setMenuOpen(!menuOpen)}>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {menuOpen
                  ? <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  : <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />}
              </svg>
            </button>
          </div>

          {/* Mobile menu */}
          {menuOpen && (
            <div className="md:hidden border-t border-[#1E2535] bg-[#111827] px-5 py-4 flex flex-col gap-1">
              {navItems.map((s) => (
                <a key={s} href={`#${s.toLowerCase()}`} onClick={() => setMenuOpen(false)}
                  className="text-sm font-semibold text-slate-400 hover:text-[#3B82F6] px-4 py-2.5 rounded-lg hover:bg-[#1E2535] transition-all">
                  {s}
                </a>
              ))}
            </div>
          )}
        </nav>

        {/* ══════════════════════ HERO ══════════════════════════ */}
        <section className="relative z-10 py-16 md:py-24 px-5 md:px-10 max-w-7xl mx-auto">

          {/* Bento grid layout */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">

            {/* Main intro card */}
            <Card featured className="lg:col-span-7 p-8 md:p-10 card-dot-grid hero-card-glow overflow-hidden">
              <div className="flex items-center gap-2 mb-6 anim-fadeIn" style={{animationDelay:".1s"}}>
                <div className="w-2 h-2 rounded-full bg-emerald-400 anim-pulseDot" />
                <span className="text-xs font-semibold text-emerald-400 tracking-widest uppercase">Available for work</span>
              </div>

              <h1 className="font-display font-black text-white leading-[1] tracking-tight mb-4"
                style={{fontSize:"clamp(42px,7vw,80px)"}}>
                {profile.name?.split(" ").map((w, i) => (
                  <span key={i} className={`block anim-fadeUp ${i === 1 ? "shimmer-text" : ""}`}
                    style={{animationDelay:`${.2+i*.1}s`}}>{w}</span>
                ))}
              </h1>

              <div className="flex items-center gap-3 mb-5 anim-fadeUp" style={{animationDelay:".38s"}}>
                <div className="h-px w-10 bg-[#3B82F6]" />
                <span className="font-mono text-sm text-[#3B82F6] tracking-wide">{profile.title}</span>
              </div>

              <p className="text-slate-400 leading-relaxed max-w-md mb-8 font-light anim-fadeUp" style={{animationDelay:".44s"}}>
                {profile.bio}
              </p>

              <div className="flex flex-wrap gap-3 anim-fadeUp" style={{animationDelay:".5s"}}>
                <a href="#projects" className="btn-primary">View Work <span>→</span></a>
                <a href="#contact" className="btn-ghost">Start a Project</a>
              </div>
            </Card>

            {/* Right column */}
            <div className="lg:col-span-5 flex flex-col gap-4">

              {/* Avatar / decorative card */}
              <Card className="p-6 flex items-center gap-5 overflow-hidden anim-fadeUp" style={{animationDelay:".2s"}}>
                <div className="relative flex-shrink-0">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#3B82F6] to-[#1D4ED8] flex items-center justify-center anim-glow">
                    <span className="font-display font-black text-white text-2xl">
                      {profile.name?.split(" ").map(w => w[0]).join("").slice(0,2)}
                    </span>
                  </div>
                  <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-emerald-400 border-2 border-[#0D1117] flex items-center justify-center">
                    <div className="w-2 h-2 rounded-full bg-white" />
                  </div>
                </div>
                <div>
                  <div className="font-display font-bold text-white text-lg">{profile.name}</div>
                  <div className="text-slate-500 text-sm">{profile.title}</div>
                  {profile.location && <div className="text-xs text-[#3B82F6] mt-1 flex items-center gap-1"><span>◎</span>{profile.location}</div>}
                </div>
              </Card>

              {/* Stats grid */}
              <div className="grid grid-cols-3 gap-3 anim-fadeUp" style={{animationDelay:".3s"}}>
                <StatBadge value={projects.length} label="Projects" accent />
                <StatBadge value={skills.length} label="Skills" />
                <StatBadge value={experiences.length} label="Roles" accent />
              </div>

              {/* Social links card */}
              <Card className="p-5 anim-fadeUp" style={{animationDelay:".38s"}}>
                <div className="text-xs font-semibold text-slate-600 tracking-widest uppercase mb-3">Connect</div>
                <div className="flex flex-wrap gap-2">
                  {socialLinks.map((l) => (
                    <a key={l.id} href={l.url}
                      className="tag hover:cursor-pointer">
                      {l.platform}
                    </a>
                  ))}
                </div>
              </Card>

              {/* Quick contact card */}
              {profile.email && (
                <Card className="p-5 flex items-center gap-4 anim-fadeUp" style={{animationDelay:".44s"}}>
                  <div className="w-10 h-10 rounded-xl bg-[#1E3A5F] flex items-center justify-center flex-shrink-0">
                    <span className="text-[#3B82F6]">✉</span>
                  </div>
                  <div className="overflow-hidden">
                    <div className="text-xs text-slate-600 mb-0.5 font-semibold tracking-wide">EMAIL</div>
                    <a href={`mailto:${profile.email}`} className="text-sm text-[#3B82F6] hover:underline truncate block">{profile.email}</a>
                  </div>
                </Card>
              )}
              {profile.mobile && (
                <Card className="p-5 flex items-center gap-4 anim-fadeUp" style={{animationDelay:".44s"}}>
                  <div className="w-10 h-10 rounded-xl bg-[#1E3A5F] flex items-center justify-center flex-shrink-0">
                    <span className="text-[#3B82F6]">📞</span>
                  </div>
                  <div className="overflow-hidden">
                    <div className="text-xs text-slate-600 mb-0.5 font-semibold tracking-wide">MOBILE</div>
                    <a href={`mailto:${profile.mobile}`} className="text-sm text-[#3B82F6] hover:underline truncate block">{profile.mobile}</a>
                  </div>
                </Card>
              )}
            </div>

          </div>
        </section>

        {/* ══════════════════════ SKILLS ══════════════════════════ */}
        <section id="skills" className="relative z-10 py-16 md:py-24 px-5 md:px-10 border-t border-[#1E2535]">
          <div className="max-w-7xl mx-auto">
            <div ref={skillsRef} className={`reveal ${skillsVis ? "show" : ""}`}>
              <SectionHeader eyebrow="Expertise" title="Skills &" subtitle="Capabilities" />

              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
                {skills.map((sk, i) => {
                  const level = sk.percentage >= 85 ? { label: "Expert", bg: "#1E3A2F", color: "#34D399" }
                    : sk.percentage >= 65 ? { label: "Advanced", bg: "#1E2D4A", color: "#3B82F6" }
                    : { label: "Proficient", bg: "#2A2040", color: "#A78BFA" };

                  return (
                    <Card key={sk.id} style={{transitionDelay:`${i*.05}s`}}
                      className={`reveal ${skillsVis ? "show" : ""} p-5`}>
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl bg-[#1A2535] flex items-center justify-center text-xl">
                            {sk.icon}
                          </div>
                          <div>
                            <div className="font-display font-semibold text-white text-sm">{sk.name}</div>
                            <span className="skill-level-badge" style={{background: level.bg, color: level.color}}>{level.label}</span>
                          </div>
                        </div>
                        <span className="font-mono text-lg font-bold text-white">{sk.percentage}<span className="text-xs text-slate-600">%</span></span>
                      </div>

                      {/* Track */}
                      <div className="h-1.5 bg-[#1A2535] rounded-full overflow-hidden mb-3">
                        <div
                          className={`h-full rounded-full ${skillsVis ? "bar-fill" : ""}`}
                          style={{
                            width: `${sk.percentage}%`,
                            background: `linear-gradient(90deg, ${level.color}80, ${level.color})`,
                            animationDelay: `${.4 + i*.06}s`
                          }}
                        />
                      </div>

                      {sk.description && <p className="text-xs text-slate-600 leading-relaxed">{sk.description}</p>}
                    </Card>
                  );
                })}
              </div>
            </div>
          </div>
        </section>

        {/* ══════════════════════ PROJECTS ══════════════════════════ */}
        <section id="projects" className="relative z-10 py-16 md:py-24 px-5 md:px-10 border-t border-[#1E2535]">
          <div className="max-w-7xl mx-auto">
            <div ref={projectsRef} className={`reveal ${projectsVis ? "show" : ""}`}>

              <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
                <SectionHeader eyebrow="Portfolio" title="Featured" subtitle="Projects" />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                {projects.map((p, i) => (
                  <Card key={p.id}
                    featured={i === 0}
                    style={{transitionDelay:`${i*.07}s`}}
                    className={`reveal ${projectsVis ? "show" : ""} p-6 ${i === 0 ? "md:col-span-2 xl:col-span-2" : ""} overflow-hidden`}>

                    {/* Project number */}
                    <div className="flex items-start justify-between mb-5">
                      <span className="font-mono text-xs text-slate-700 border border-[#2A3548] rounded px-2 py-0.5">
                        {String(i+1).padStart(2,"0")}
                      </span>
                      <div className="flex gap-2">
                        {p.github_link && (
                          <a href={p.github_link} className="w-8 h-8 rounded-lg bg-[#1A2535] border border-[#2A3548] flex items-center justify-center text-slate-500 hover:text-white hover:border-[#3B82F6] transition-all">
                            <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg>
                          </a>
                        )}
                        {p.live_link && (
                          <a href={p.live_link} className="w-8 h-8 rounded-lg bg-[#1E3A5F] border border-[#3B82F6]/30 flex items-center justify-center text-[#3B82F6] hover:bg-[#3B82F6] hover:text-white transition-all">
                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>
                          </a>
                        )}
                      </div>
                    </div>

                    <h3 className={`font-display font-bold text-white leading-tight mb-2 ${i===0 ? "text-2xl md:text-3xl" : "text-xl"}`}>
                      {p.title}
                    </h3>
                    <p className="text-slate-500 text-sm leading-relaxed mb-5 font-light">{p.description}</p>

                    {p.techstack?.length > 0 && (
                      <div className="flex flex-wrap gap-1.5">
                        {p.techstack.map((t, j) => <span key={j} className="tag">{t}</span>)}
                      </div>
                    )}
                  </Card>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ══════════════════════ EXPERIENCE ══════════════════════════ */}
        <section id="experience" className="relative z-10 py-16 md:py-24 px-5 md:px-10 border-t border-[#1E2535]">
          <div className="max-w-7xl mx-auto">
            <div ref={expRef} className={`reveal ${expVis ? "show" : ""}`}>
              <SectionHeader eyebrow="Career" title="Work" subtitle="Experience" />

              <div className="space-y-4">
                {experiences.map((exp, i) => (
                  <div key={exp.id} style={{transitionDelay:`${i*.08}s`}}
                    className={`reveal ${expVis ? "show" : ""} relative flex gap-5`}>

                    {/* Timeline column */}
                    <div className="flex flex-col items-center flex-shrink-0 w-10 pt-6">
                      <div className="w-9 h-9 rounded-xl bg-[#1E3A5F] border border-[#3B82F6]/30 flex items-center justify-center text-[#3B82F6] text-xs font-bold font-mono z-10">
                        {String(i+1).padStart(2,"0")}
                      </div>
                      {i < experiences.length - 1 && (
                        <div className="w-0.5 flex-1 bg-gradient-to-b from-[#3B82F6]/30 to-transparent mt-2 min-h-[32px]" />
                      )}
                    </div>

                    {/* Card */}
                    <Card className={`flex-1 p-6 mb-4`}>
                      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 mb-3">
                        <div>
                          <h3 className="font-display font-bold text-white text-xl leading-tight">{exp.role}</h3>
                          <div className="flex items-center gap-2 mt-1">
                            <span className="text-sm font-semibold text-[#3B82F6]">{exp.company}</span>
                            {exp.is_current === "true" && (
                              <span className="text-[10px] bg-emerald-400/10 text-emerald-400 border border-emerald-400/20 rounded-full px-2 py-0.5 font-semibold tracking-wide">CURRENT</span>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center gap-1.5 bg-[#1A2535] border border-[#2A3548] rounded-lg px-3 py-1.5 text-xs text-slate-500 font-mono self-start flex-shrink-0">
                          <span>📅</span>
                          {fmtDate(exp.start_date)} — {exp.is_current === "true" ? "Present" : fmtDate(exp.end_date)}
                        </div>
                      </div>

                      {exp.description && (
                        <p className="text-slate-500 text-sm leading-relaxed mb-4 font-light">{exp.description}</p>
                      )}

                      {exp.points?.length > 0 && (
                        <div className="grid sm:grid-cols-2 gap-2">
                          {exp.points.map((pt, j) => (
                            <div key={j} className="flex gap-2 items-start bg-[#1A2535] rounded-lg p-3">
                              <span className="text-[#3B82F6] text-xs mt-0.5 flex-shrink-0">▹</span>
                              <span className="text-xs text-slate-400 leading-relaxed">{pt}</span>
                            </div>
                          ))}
                        </div>
                      )}
                    </Card>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ══════════════════════ BLOG ══════════════════════════ */}
        <section id="blog" className="relative z-10 py-16 md:py-24 px-5 md:px-10 border-t border-[#1E2535]">
          <div className="max-w-7xl mx-auto">
            <div ref={blogRef} className={`reveal ${blogVis ? "show" : ""}`}>
              <SectionHeader eyebrow="Writing" title="Latest" subtitle="Articles" />

              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                {blogs.map((b, i) => (
                  <Card key={b.id} style={{transitionDelay:`${i*.06}s`}}
                    className={`reveal ${blogVis ? "show" : ""} p-6 flex flex-col cursor-pointer group`}>

                    <div className="flex items-center justify-between mb-5">
                      <span className="tag font-semibold text-[#3B82F6] border-[#1E3A5F] bg-[#1E3A5F]/50">{b.category || "General"}</span>
                      <span className="font-mono text-[11px] text-slate-700">{fmtDate(b.publish_date)}</span>
                    </div>

                    <h3 className="font-display font-bold text-white text-lg leading-snug mb-3 group-hover:text-[#3B82F6] transition-colors">
                      {b.title}
                    </h3>
                    <p className="text-slate-500 text-sm leading-relaxed flex-1 mb-5 font-light">{b.excerpt}</p>

                    <div className="flex items-center gap-2 text-xs font-semibold text-slate-600 group-hover:text-[#3B82F6] transition-colors pt-4 border-t border-[#1E2535]">
                      <span>Read Article</span>
                      <span className="group-hover:translate-x-1 transition-transform">→</span>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ══════════════════════ TESTIMONIALS ══════════════════════════ */}
        <section className="relative z-10 py-16 md:py-24 px-5 md:px-10 border-t border-[#1E2535]">
          <div className="max-w-7xl mx-auto">
            <div ref={testimonRef} className={`reveal ${testimonVis ? "show" : ""}`}>
              <SectionHeader eyebrow="Feedback" title="What Clients" subtitle="Say" />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {testimonials.map((t, i) => (
                  <Card key={t.id} style={{transitionDelay:`${i*.07}s`}}
                    className={`reveal ${testimonVis ? "show" : ""} p-7`}>

                    {/* Stars */}
                    <div className="flex gap-0.5 mb-4">
                      {Array.from({length:5}).map((_,j) => (
                        <span key={j} className={`text-sm ${j < t.rating ? "text-amber-400" : "text-slate-800"}`}>★</span>
                      ))}
                    </div>

                    {/* Quote mark */}
                    <div className="font-serif text-5xl text-[#3B82F6]/20 leading-none mb-2 select-none">"</div>

                    <p className="text-slate-300 text-base leading-[1.75] font-light mb-6 italic">{t.review}</p>

                    {/* Author */}
                    <div className="flex items-center gap-3 pt-5 border-t border-[#1E2535]">
                      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#3B82F6] to-[#1D4ED8] flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                        {t.name?.[0]}
                      </div>
                      <div>
                        <div className="font-semibold text-white text-sm">{t.name}</div>
                        <div className="text-xs text-slate-600">{t.role} @ {t.company}</div>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ══════════════════════ CONTACT ══════════════════════════ */}
        <section id="contact" className="relative z-10 py-16 md:py-24 px-5 md:px-10 border-t border-[#1E2535]">
          <div className="max-w-7xl mx-auto">
            <div ref={contactRef} className={`reveal ${contactVis ? "show" : ""}`}>
              <SectionHeader eyebrow="Get In Touch" title="Let's Build" subtitle="Together" />

              <div className="grid grid-cols-1 lg:grid-cols-[320px_1fr] gap-6">

                {/* Info cards column */}
                <div className="space-y-4">
                  <Card className="p-6">
                    <p className="text-slate-400 text-sm leading-relaxed font-light mb-6">
                      Have a project in mind? Let's collaborate and craft something that truly stands out.
                    </p>

                    {profile.email && (
                      <div className="flex items-center gap-3 mb-4">
                        <div className="w-9 h-9 rounded-lg bg-[#1E3A5F] border border-[#3B82F6]/20 flex items-center justify-center text-sm text-[#3B82F6] flex-shrink-0">✉</div>
                        <div>
                          <div className="text-[10px] font-semibold tracking-widest uppercase text-slate-600 mb-0.5">Email</div>
                          <a href={`mailto:${profile.email}`} className="text-sm text-[#3B82F6] hover:underline">{profile.email}</a>
                        </div>
                      </div>
                    )}
                    {profile.mobile && (
                      <div className="flex items-center gap-3 mb-4">
                        <div className="w-9 h-9 rounded-lg bg-[#1E3A5F] border border-[#3B82F6]/20 flex items-center justify-center text-sm text-[#3B82F6] flex-shrink-0">✉</div>
                        <div>
                          <div className="text-[10px] font-semibold tracking-widest uppercase text-slate-600 mb-0.5">Mobile</div>
                          <a href={`mailto:${profile.mobile}`} className="text-sm text-[#3B82F6] hover:underline">{profile.mobile}</a>
                        </div>
                      </div>
                    )}

                    {profile.location && (
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-lg bg-[#1A2535] border border-[#2A3548] flex items-center justify-center text-sm text-slate-500 flex-shrink-0">◎</div>
                        <div>
                          <div className="text-[10px] font-semibold tracking-widest uppercase text-slate-600 mb-0.5">Location</div>
                          <span className="text-sm text-slate-300">{profile.location}</span>
                        </div>
                      </div>
                    )}
                  </Card>

                  <Card className="p-5">
                    <div className="text-[10px] font-semibold tracking-widest uppercase text-slate-600 mb-3">Find Me On</div>
                    <div className="grid grid-cols-2 gap-2">
                      {socialLinks.map((l) => (
                        <a key={l.id} href={l.url}
                          className="flex items-center justify-center gap-1.5 text-xs font-semibold text-slate-500 border border-[#2A3548] rounded-lg py-2.5 hover:border-[#3B82F6] hover:text-[#3B82F6] hover:bg-[#1E3A5F]/30 transition-all">
                          {l.platform}
                        </a>
                      ))}
                    </div>
                  </Card>
                </div>

                {/* Form card */}
                <Card className="p-7" featured>
                  <form onSubmit={handleSubmit} className="space-y-5">
                    <div className="grid sm:grid-cols-2 gap-5">
                      {[
                        {key:"name",  label:"Full Name", type:"text",  ph:"John Doe"},
                        {key:"email", label:"Email Address", type:"email", ph:"john@email.com"},
                      ].map(({key, label, type, ph}) => (
                        <div key={key}>
                          <label className="block text-[11px] font-semibold tracking-widest uppercase text-slate-600 mb-2">{label}</label>
                          <input required type={type} placeholder={ph} value={form[key]}
                            onChange={e => setForm({...form, [key]: e.target.value})}
                            className="input-field" />
                        </div>
                      ))}
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold tracking-widest uppercase text-slate-600 mb-2">Subject</label>
                      <input placeholder="Project inquiry" value={form.subject}
                        onChange={e => setForm({...form, subject: e.target.value})}
                        className="input-field" />
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold tracking-widest uppercase text-slate-600 mb-2">Message</label>
                      <textarea required rows={5} placeholder="Tell me about your project..."
                        value={form.message} onChange={e => setForm({...form, message: e.target.value})}
                        className="input-field resize-none" />
                    </div>
                    <button type="submit" disabled={sending} className="btn-primary w-full justify-center py-3.5">
                      <span>{sending ? "Sending…" : "Send Message"}</span>
                      <span>{sending ? "⏳" : "→"}</span>
                    </button>
                  </form>
                </Card>

              </div>
            </div>
          </div>
        </section>

        {/* ══════════════════════ FOOTER ══════════════════════════ */}
        <footer className="relative z-10 border-t border-[#1E2535] bg-[#0D1117] px-5 md:px-10 py-8">
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 bg-[#3B82F6] rounded-lg flex items-center justify-center">
                <span className="font-display font-black text-white text-xs">
                  {profile.name?.split(" ").map(w => w[0]).join("").slice(0,2)}
                </span>
              </div>
              <span className="font-display font-bold text-white">{profile.name}</span>
            </div>
            <p className="text-xs text-slate-700 font-mono">© {new Date().getFullYear()} · Built with precision</p>
            <div className="flex gap-3">
              {socialLinks.map((l) => (
                <a key={l.id} href={l.url} className="tag">{l.platform}</a>
              ))}
            </div>
          </div>
        </footer>

      </div>
    </>
  );
}