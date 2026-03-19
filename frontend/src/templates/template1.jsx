"use client";

import { useState, useEffect, useRef } from "react";
import { success, error } from "../util/toast";
import { usePortfolio } from "../../context/PortfolioContext";

// ─── Helpers ──────────────────────────────────────────────────────────────────
function fmtDate(d) {
  if (!d) return "";
  return new Date(d).toLocaleDateString("en-US", { year: "numeric", month: "short" });
}

function useInView(ref, threshold = 0.15) {
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setInView(true); }, { threshold });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);
  return inView;
}

// ─── Reusable: Section Header ─────────────────────────────────────────────────
function SectionLabel({ tag, title, titleExtra }) {
  return (
    <div className="mb-16">
      <div className="flex items-center gap-3 mb-3">
        <div className="w-1.5 h-1.5 rotate-45 bg-amber-400" />
        <span className="text-[11px] font-bold tracking-[0.25em] uppercase text-amber-400">{tag}</span>
      </div>
      <h2 className="font-display text-5xl md:text-7xl text-white tracking-tight leading-none">
        {title}
        {titleExtra && <span className="text-amber-400 italic font-serif font-light ml-3">{titleExtra}</span>}
      </h2>
      <div className="mt-5 h-px w-24 bg-gradient-to-r from-amber-400/60 to-transparent" />
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────
export default function Template1() {
   const { portfolioData, loading } = usePortfolio();
  const profile = portfolioData?.profile.data || {};
  const skills = portfolioData?.skills.data || [];
  const projects = portfolioData?.projects.data || [];
  const blogs = portfolioData?.blogs.data || [];
  const testimonials = portfolioData?.testimonials.data || [];
  const socialLinks = portfolioData?.SocialLinks.data || [];
  const experiences = portfolioData?.experiences.data || [];

  const [menuOpen, setMenuOpen] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });
  const [sending, setSending] = useState(false);

  // Section refs for reveal
  const skillsRef = useRef(null);
  const projectsRef = useRef(null);
  const expRef = useRef(null);
  const blogRef = useRef(null);
  const contactRef = useRef(null);
  const testimonRef = useRef(null);

  const skillsVis = useInView(skillsRef);
  const projectsVis = useInView(projectsRef);
  const expVis = useInView(expRef);
  const blogVis = useInView(blogRef);
  const contactVis = useInView(contactRef);
  const testimonVis = useInView(testimonRef);

  async function handleSubmit(e) {
    e.preventDefault();
    setSending(true);
    await new Promise((r) => setTimeout(r, 1200));
    setSending(false);
    setForm({ name: "", email: "", subject: "", message: "" });
    success("Message sent! I'll get back to you shortly.");
  }

  return (
    <>
      {/* Global styles + Google Fonts */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;1,300;1,400&family=Syne:wght@400;500;600;700;800&family=DM+Sans:wght@300;400;500&display=swap');
        .font-display { font-family: 'Syne', sans-serif; }
        .font-body   { font-family: 'DM Sans', sans-serif; }
        .font-serif  { font-family: 'Playfair Display', serif; }
        html { scroll-behavior: smooth; }
        ::-webkit-scrollbar { width: 4px; background: #0a0b0f; }
        ::-webkit-scrollbar-thumb { background: #b8922a; border-radius: 2px; }
        @keyframes fadeUp   { from { opacity:0; transform:translateY(28px); } to { opacity:1; transform:translateY(0); } }
        @keyframes fadeIn   { from { opacity:0; } to { opacity:1; } }
        @keyframes scaleIn  { from { transform:scaleX(0); } to { transform:scaleX(1); } }
        @keyframes spinSlow { to { transform: rotate(360deg); } }
        @keyframes spinRev  { to { transform: rotate(-360deg); } }
        @keyframes pulse    { 0%,100%{ opacity:1;} 50%{ opacity:0.35; } }
        @keyframes barGrow  { from { width:0 !important; } }
        .anim-fadeUp  { animation: fadeUp  0.7s cubic-bezier(.16,1,.3,1) both; }
        .anim-fadeIn  { animation: fadeIn  0.6s ease both; }
        .anim-spinSlow{ animation: spinSlow 14s linear infinite; }
        .anim-spinRev { animation: spinRev  9s  linear infinite; }
        .anim-pulse   { animation: pulse 2.4s ease-in-out infinite; }
        .bar-grow     { animation: barGrow 1.5s cubic-bezier(.4,0,.2,1) both; }
        .reveal       { opacity:0; transform:translateY(24px); transition: opacity .7s ease, transform .7s cubic-bezier(.16,1,.3,1); }
        .reveal.show  { opacity:1; transform:translateY(0); }
        .nav-link     { position:relative; }
        .nav-link::after { content:''; position:absolute; bottom:-2px; left:0; width:0; height:1px; background:#f59e0b; transition: width .3s ease; }
        .nav-link:hover::after { width:100%; }
        .card-shine   { position:relative; overflow:hidden; }
        .card-shine::before { content:''; position:absolute; inset:0; background:linear-gradient(135deg,rgba(245,158,11,0.05) 0%,transparent 60%); pointer-events:none; }
        .noise-bg::after { content:''; position:fixed; inset:0; background-image:url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.03'/%3E%3C/svg%3E"); pointer-events:none; z-index:9999; opacity:.6; }
      `}</style>

      <div className="font-body bg-[#0a0b0f] text-slate-200 min-h-screen noise-bg">

        {/* ── Background ambience ── */}
        <div className="fixed inset-0 pointer-events-none z-0">
          <div className="absolute top-0 right-0 w-[700px] h-[700px] rounded-full bg-amber-500/[0.03] blur-[120px]" />
          <div className="absolute bottom-0 left-0 w-[500px] h-[500px] rounded-full bg-amber-400/[0.025] blur-[100px]" />
          {/* Grid lines */}
          <div style={{ backgroundImage:"linear-gradient(rgba(245,158,11,.025) 1px,transparent 1px),linear-gradient(90deg,rgba(245,158,11,.025) 1px,transparent 1px)", backgroundSize:"72px 72px" }} className="absolute inset-0" />
        </div>

        {/* ════════════════ NAV ════════════════ */}
        <nav className="sticky top-0 z-50 bg-[#0a0b0f]/90 backdrop-blur-xl border-b border-white/[0.05]">
          <div className="max-w-7xl mx-auto px-6 md:px-12 flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex items-center gap-2.5">
              <div className="w-2 h-2 rotate-45 bg-amber-400" />
              <span className="font-display font-800 text-white text-lg tracking-wide">{profile.name.split(" ")[0]}</span>
            </div>

            {/* Desktop links */}
            <div className="hidden md:flex items-center gap-8">
              {["Skills","Projects","Experience","Blog","Contact"].map((s) => (
                <a key={s} href={`#${s.toLowerCase()}`}
                  className="nav-link text-[12px] font-semibold tracking-[0.1em] uppercase text-slate-400 hover:text-white transition-colors duration-200">
                  {s}
                </a>
              ))}
            </div>

            {/* CTA */}
            <a href="#contact"
              className="hidden md:inline-flex items-center gap-2 bg-amber-400 hover:bg-amber-300 text-[#0a0b0f] font-bold text-xs tracking-[0.1em] uppercase px-5 py-2.5 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_8px_24px_rgba(245,158,11,0.35)]">
              Hire Me
            </a>

            {/* Hamburger */}
            <button className="md:hidden flex flex-col gap-1.5 p-2" onClick={() => setMenuOpen(!menuOpen)}>
              <span className={`block w-5 h-0.5 bg-white transition-all duration-300 ${menuOpen ? "rotate-45 translate-y-2" : ""}`} />
              <span className={`block w-5 h-0.5 bg-white transition-all duration-300 ${menuOpen ? "opacity-0" : ""}`} />
              <span className={`block w-5 h-0.5 bg-white transition-all duration-300 ${menuOpen ? "-rotate-45 -translate-y-2" : ""}`} />
            </button>
          </div>

          {/* Mobile menu */}
          {menuOpen && (
            <div className="md:hidden border-t border-white/[0.06] bg-[#0d0e13] px-6 py-5 flex flex-col gap-4">
              {["Skills","Projects","Experience","Blog","Contact"].map((s) => (
                <a key={s} href={`#${s.toLowerCase()}`} onClick={() => setMenuOpen(false)}
                  className="text-sm font-semibold tracking-[0.1em] uppercase text-slate-400 hover:text-amber-400 transition-colors">
                  {s}
                </a>
              ))}
            </div>
          )}
        </nav>

        {/* ════════════════ HERO ════════════════ */}
        <section className="relative z-10 min-h-[92vh] flex flex-col justify-center px-6 md:px-12 max-w-7xl mx-auto pt-16 pb-24">
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-16 items-center">

            {/* Left */}
            <div>
              {/* Eyebrow */}
              <div className="flex items-center gap-3 mb-8 anim-fadeIn" style={{ animationDelay:".1s" }}>
                <div className="w-8 h-px bg-amber-400" />
                <span className="text-[11px] font-bold tracking-[0.22em] uppercase text-amber-400">Available for work</span>
                <div className="w-1.5 h-1.5 rounded-full bg-amber-400 anim-pulse" />
              </div>

              {/* Name */}
              <h1 className="font-display font-extrabold text-white leading-[.9] tracking-tight mb-6"
                style={{ fontSize:"clamp(64px,10vw,120px)" }}>
                {profile.name.split(" ").map((w, i) => (
                  <span key={i} className="block anim-fadeUp" style={{ animationDelay:`${.2 + i*.12}s` }}>{w}</span>
                ))}
              </h1>

              {/* Title bar */}
              <div className="flex items-center gap-4 mb-8 anim-fadeUp" style={{ animationDelay:".44s" }}>
                <div className="w-10 h-0.5 bg-amber-400" />
                <span className="font-display text-sm font-semibold tracking-[0.18em] uppercase text-amber-400">{profile.title}</span>
              </div>

              {/* Bio */}
              <p className="text-slate-400 text-base md:text-lg leading-relaxed max-w-lg font-light mb-10 anim-fadeUp" style={{ animationDelay:".5s" }}>
                {profile.bio}
              </p>

              {/* CTAs */}
              <div className="flex flex-wrap gap-4 mb-10 anim-fadeUp" style={{ animationDelay:".58s" }}>
                <a href="#projects"
                  className="inline-flex items-center gap-2 bg-amber-400 hover:bg-amber-300 text-[#0a0b0f] font-bold text-sm tracking-wide px-7 py-3.5 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_12px_32px_rgba(245,158,11,0.4)]">
                  View Work <span>→</span>
                </a>
                <a href="#contact"
                  className="inline-flex items-center gap-2 border border-white/10 hover:border-amber-400/50 text-slate-300 hover:text-amber-400 font-medium text-sm tracking-wide px-7 py-3.5 transition-all duration-200 hover:bg-amber-400/5">
                  Start a Project
                </a>
              </div>

              {/* Socials */}
              <div className="flex gap-6 anim-fadeUp" style={{ animationDelay:".66s" }}>
                {socialLinks.map((l) => (
                  <a key={l.id} href={l.url} className="text-[11px] font-bold tracking-[0.12em] uppercase text-slate-500 hover:text-amber-400 transition-all duration-200 hover:tracking-[0.18em]">
                    {l.platform}
                  </a>
                ))}
              </div>
            </div>

            {/* Right — stats + deco */}
            <div className="hidden lg:flex flex-col gap-4 items-end">
              {[
                { num: projects.length, label: "Projects", accent: true },
                { num: skills.length,   label: "Skills",   accent: false },
                { num: experiences.length, label: "Roles", accent: true },
              ].map((s, i) => (
                <div key={i} style={{ animationDelay:`${.4+i*.14}s` }}
                  className="anim-fadeUp w-full bg-[#111217] border border-white/[0.06] hover:border-amber-400/20 p-5 flex items-center gap-4 transition-all duration-300 hover:-translate-x-1 card-shine group">
                  <div className={`w-0.5 self-stretch ${s.accent ? "bg-amber-400" : "bg-slate-600"}`} />
                  <span className={`font-display text-5xl font-extrabold ${s.accent ? "text-amber-400" : "text-slate-200"}`}>{s.num}+</span>
                  <span className="font-display text-sm tracking-[0.12em] uppercase text-slate-500 group-hover:text-slate-400 transition-colors">{s.label}</span>
                </div>
              ))}
              {/* Decorative ring */}
              <div className="relative w-28 h-28 mt-4 self-end">
                <div className="absolute inset-0 rounded-full border border-amber-400/20 anim-spinSlow" style={{ borderTopColor:"rgba(245,158,11,.7)" }} />
                <div className="absolute inset-4 rounded-full border border-white/5 anim-spinRev" style={{ borderRightColor:"rgba(245,158,11,.4)" }} />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3 h-3 rotate-45 bg-amber-400" />
              </div>
            </div>
          </div>

          {/* Scroll indicator */}
          <div className="absolute bottom-10 left-12 hidden md:flex flex-col items-center gap-2">
            <div className="w-px h-12 bg-gradient-to-b from-amber-400 to-transparent" />
            <span className="text-[9px] tracking-[0.3em] uppercase text-slate-600 [writing-mode:vertical-rl]">Scroll</span>
          </div>
        </section>

        {/* ════════════════ SKILLS ════════════════ */}
        <section id="skills" className="relative z-10 py-24 md:py-32 px-6 md:px-12 border-t border-white/[0.04]">
          <div className="max-w-7xl mx-auto">
            <div ref={skillsRef} className={`reveal ${skillsVis ? "show" : ""}`}>
              <SectionLabel tag="Expertise" title="Skills &" titleExtra="Tools" />
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                {skills.map((sk, i) => (
                  <div key={sk.id} style={{ transitionDelay:`${i*.06}s` }}
                    className={`reveal ${skillsVis ? "show" : ""} bg-[#111217] border border-white/[0.05] hover:border-amber-400/25 p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_16px_40px_rgba(0,0,0,0.5)] card-shine group`}>
                    <div className="flex items-center gap-3 mb-4">
                      <span className="text-2xl">{sk.icon}</span>
                      <span className="font-display font-semibold text-white text-sm tracking-wide flex-1">{sk.name}</span>
                      <span className="font-display text-2xl text-amber-400 font-bold">{sk.percentage}<span className="text-xs text-slate-500">%</span></span>
                    </div>
                    <div className="h-px bg-white/5 mb-1 overflow-hidden">
                      <div className={`h-full bg-gradient-to-r from-amber-500 to-amber-300 ${skillsVis ? "bar-grow" : ""}`}
                        style={{ width:`${sk.percentage}%`, animationDelay:`${.5+i*.07}s` }} />
                    </div>
                    {sk.description && <p className="text-xs text-slate-500 mt-3 leading-relaxed font-light group-hover:text-slate-400 transition-colors">{sk.description}</p>}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ════════════════ PROJECTS ════════════════ */}
        <section id="projects" className="relative z-10 py-24 md:py-32 px-6 md:px-12 bg-[#0d0e13] border-t border-white/[0.04]">
          <div className="max-w-7xl mx-auto">
            <div ref={projectsRef} className={`reveal ${projectsVis ? "show" : ""}`}>
              <SectionLabel tag="Portfolio" title="Featured" titleExtra="Work" />
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {projects.map((p, i) => (
                  <div key={p.id} style={{ transitionDelay:`${i*.08}s` }}
                    className={`reveal ${projectsVis ? "show" : ""} relative bg-[#111217] border ${i===0 ? "border-amber-400/20 md:col-span-2 xl:col-span-2 bg-[rgba(245,158,11,.02)]" : "border-white/[0.05]"} p-7 hover:border-amber-400/30 transition-all duration-350 hover:-translate-y-1.5 hover:shadow-[0_24px_56px_rgba(0,0,0,.6)] group card-shine`}>
                    {/* Corner accents */}
                    <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-amber-400/60" />
                    <div className="absolute bottom-0 right-0 w-8 h-8 border-b border-r border-amber-400/20" />

                    <div className="font-display text-6xl font-extrabold text-amber-400/10 leading-none mb-3 select-none">
                      {String(i+1).padStart(2,"0")}
                    </div>
                    <h3 className={`font-display font-bold text-white mb-3 ${i===0 ? "text-2xl md:text-3xl" : "text-xl"}`}>{p.title}</h3>
                    <p className="text-slate-500 text-sm leading-relaxed mb-5 font-light">{p.description}</p>

                    {p.techstack?.length > 0 && (
                      <div className="flex flex-wrap gap-2 mb-6">
                        {p.techstack.map((t, j) => (
                          <span key={j} className="text-[11px] font-medium tracking-wide border border-white/8 text-slate-500 px-3 py-1">{t}</span>
                        ))}
                      </div>
                    )}
                    <div className="flex gap-3">
                      {p.github_link && (
                        <a href={p.github_link} className="text-xs font-bold tracking-[.08em] border border-white/12 text-slate-400 hover:text-white hover:border-white/30 px-4 py-2 transition-all duration-200">GitHub ↗</a>
                      )}
                      {p.live_link && (
                        <a href={p.live_link} className="text-xs font-bold tracking-[.08em] bg-amber-400 hover:bg-amber-300 text-[#0a0b0f] px-4 py-2 transition-all duration-200 hover:shadow-[0_6px_20px_rgba(245,158,11,.4)]">Live Demo ↗</a>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ════════════════ EXPERIENCE ════════════════ */}
        <section id="experience" className="relative z-10 py-24 md:py-32 px-6 md:px-12 border-t border-white/[0.04]">
          <div className="max-w-7xl mx-auto">
            <div ref={expRef} className={`reveal ${expVis ? "show" : ""}`}>
              <SectionLabel tag="Career" title="Experience" />
              <div className="space-y-0">
                {experiences.map((exp, i) => (
                  <div key={exp.id} style={{ transitionDelay:`${i*.1}s` }}
                    className={`reveal ${expVis ? "show" : ""} flex gap-6 md:gap-10 group`}>
                    {/* Timeline */}
                    <div className="flex flex-col items-center pt-1.5 flex-shrink-0">
                      <div className="w-3 h-3 rotate-45 bg-amber-400 flex-shrink-0 group-hover:bg-amber-300 transition-colors" />
                      {i < experiences.length - 1 && <div className="w-px flex-1 bg-amber-400/15 my-2 min-h-[60px]" />}
                    </div>
                    {/* Card */}
                    <div className="bg-[#111217] border border-white/[0.05] hover:border-amber-400/20 p-6 md:p-8 flex-1 mb-5 transition-all duration-300 hover:translate-x-1 card-shine">
                      <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-3 mb-4">
                        <div>
                          <h3 className="font-display font-bold text-white text-xl md:text-2xl tracking-tight mb-1">{exp.role}</h3>
                          <span className="text-amber-400 font-semibold text-sm tracking-wide">{exp.company}</span>
                        </div>
                        <div className="text-xs text-slate-500 font-medium md:text-right whitespace-nowrap">
                          {fmtDate(exp.start_date)} — {exp.is_current === "true" ? <span className="text-amber-400 font-bold">Present</span> : fmtDate(exp.end_date)}
                        </div>
                      </div>
                      {exp.description && <p className="text-slate-500 text-sm leading-relaxed mb-4 font-light">{exp.description}</p>}
                      {exp.points?.length > 0 && (
                        <ul className="space-y-2">
                          {exp.points.map((pt, j) => (
                            <li key={j} className="flex gap-3 text-sm text-slate-500 leading-relaxed">
                              <span className="text-amber-400 text-[8px] mt-1.5 flex-shrink-0">◆</span>{pt}
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ════════════════ BLOG ════════════════ */}
        <section id="blog" className="relative z-10 py-24 md:py-32 px-6 md:px-12 bg-[#0d0e13] border-t border-white/[0.04]">
          <div className="max-w-7xl mx-auto">
            <div ref={blogRef} className={`reveal ${blogVis ? "show" : ""}`}>
              <SectionLabel tag="Writing" title="Blog" />
              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                {blogs.map((b, i) => (
                  <div key={b.id} style={{ transitionDelay:`${i*.07}s` }}
                    className={`reveal ${blogVis ? "show" : ""} bg-[#111217] border border-white/[0.05] hover:border-amber-400/20 p-7 flex flex-col group cursor-pointer transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_20px_48px_rgba(0,0,0,.5)] card-shine`}>
                    <div className="flex items-center justify-between mb-5">
                      <span className="text-[10px] font-bold tracking-[0.18em] uppercase bg-amber-400/10 text-amber-400 border-l-2 border-amber-400 pl-2.5 pr-3 py-1">{b.category || "General"}</span>
                      <span className="text-[11px] text-slate-600 italic">{fmtDate(b.publish_date)}</span>
                    </div>
                    <h3 className="font-display font-bold text-white text-xl leading-snug mb-3 group-hover:text-amber-50 transition-colors">{b.title}</h3>
                    <p className="text-slate-500 text-sm leading-relaxed flex-1 mb-5 font-light">{b.excerpt}</p>
                    <span className="text-xs font-semibold tracking-wide text-slate-600 group-hover:text-amber-400 transition-colors duration-200">
                      Read Article <span className="text-amber-400">→</span>
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ════════════════ TESTIMONIALS ════════════════ */}
        <section className="relative z-10 py-24 md:py-32 px-6 md:px-12 border-t border-white/[0.04]">
          <div className="max-w-7xl mx-auto">
            <div ref={testimonRef} className={`reveal ${testimonVis ? "show" : ""}`}>
              <SectionLabel tag="Feedback" title="What They" titleExtra="Say" />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {testimonials.map((t, i) => (
                  <div key={t.id} style={{ transitionDelay:`${i*.08}s` }}
                    className={`reveal ${testimonVis ? "show" : ""} bg-[#111217] border border-white/[0.05] hover:border-amber-400/20 p-8 transition-all duration-300 hover:-translate-y-1 card-shine`}>
                    <div className="flex gap-0.5 mb-5">
                      {Array.from({ length: t.rating }).map((_, j) => (
                        <span key={j} className="text-amber-400 text-base">★</span>
                      ))}
                    </div>
                    <p className="text-slate-300 text-base leading-[1.8] italic font-light mb-7">"{t.review}"</p>
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-amber-400 text-[#0a0b0f] font-extrabold text-sm flex items-center justify-center flex-shrink-0">
                        {t.name?.[0]}
                      </div>
                      <div>
                        <div className="text-sm font-bold text-white">{t.name}</div>
                        <div className="text-xs text-slate-500">{t.role} @ {t.company}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ════════════════ CONTACT ════════════════ */}
        <section id="contact" className="relative z-10 py-24 md:py-32 px-6 md:px-12 bg-[#0d0e13] border-t border-white/[0.04]">
          <div className="max-w-7xl mx-auto">
            <div ref={contactRef} className={`reveal ${contactVis ? "show" : ""}`}>
              <SectionLabel tag="Get In Touch" title="Let's Build" titleExtra="Together" />
              <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.8fr] gap-16">

                {/* Info */}
                <div>
                  <p className="text-slate-400 text-base leading-relaxed font-light mb-10 max-w-sm">
                    Have a project in mind? Let's collaborate and craft something that truly stands out.
                  </p>
                  {profile.email && (
                    <div className="flex gap-4 mb-7">
                      <span className="text-amber-400 text-lg mt-0.5">✉</span>
                      <div>
                        <div className="text-[10px] font-bold tracking-[0.18em] uppercase text-slate-600 mb-1">Email</div>
                        <a href={`mailto:${profile.email}`} className="text-amber-400 hover:text-amber-300 font-semibold transition-colors">{profile.email}</a>
                      </div>
                    </div>
                  )} {profile.mobile && (
                    <div className="flex gap-4 mb-7">
                      <span className="text-amber-400 text-lg mt-0.5">✉</span>
                      <div>
                        <div className="text-[10px] font-bold tracking-[0.18em] uppercase text-slate-600 mb-1">Mobile</div>
                        <a href={`mailto:${profile.mobile}`} className="text-amber-400 hover:text-amber-300 font-semibold transition-colors">{profile.email}</a>
                      </div>
                    </div>
                  )}
                  {profile.location && (
                    <div className="flex gap-4 mb-10">
                      <span className="text-amber-400 text-lg mt-0.5">◎</span>
                      <div>
                        <div className="text-[10px] font-bold tracking-[0.18em] uppercase text-slate-600 mb-1">Location</div>
                        <span className="text-slate-300">{profile.location}</span>
                      </div>
                    </div>
                  )}
                  <div className="flex flex-wrap gap-2.5">
                    {socialLinks.map((l) => (
                      <a key={l.id} href={l.url}
                        className="text-[11px] font-bold tracking-[0.12em] uppercase border border-white/8 text-slate-500 hover:border-amber-400/50 hover:text-amber-400 hover:bg-amber-400/5 px-4 py-2 transition-all duration-200">
                        {l.platform}
                      </a>
                    ))}
                  </div>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    {[
                      { key:"name",  label:"Name",  type:"text",  ph:"John Doe" },
                      { key:"email", label:"Email", type:"email", ph:"john@email.com" },
                    ].map(({ key, label, type, ph }) => (
                      <div key={key} className="flex flex-col gap-2">
                        <label className="text-[10px] font-bold tracking-[0.18em] uppercase text-slate-600">{label}</label>
                        <input required type={type} placeholder={ph} value={form[key]}
                          onChange={(e) => setForm({ ...form, [key]: e.target.value })}
                          className="bg-[#0a0b0f] border border-white/8 focus:border-amber-400/60 focus:ring-2 focus:ring-amber-400/10 text-slate-200 placeholder-slate-700 px-4 py-3.5 text-sm font-light outline-none transition-all duration-200 w-full" />
                      </div>
                    ))}
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="text-[10px] font-bold tracking-[0.18em] uppercase text-slate-600">Subject</label>
                    <input placeholder="Project inquiry" value={form.subject}
                      onChange={(e) => setForm({ ...form, subject: e.target.value })}
                      className="bg-[#0a0b0f] border border-white/8 focus:border-amber-400/60 focus:ring-2 focus:ring-amber-400/10 text-slate-200 placeholder-slate-700 px-4 py-3.5 text-sm font-light outline-none transition-all duration-200 w-full" />
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="text-[10px] font-bold tracking-[0.18em] uppercase text-slate-600">Message</label>
                    <textarea required rows={5} placeholder="Tell me about your project..."
                      value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })}
                      className="bg-[#0a0b0f] border border-white/8 focus:border-amber-400/60 focus:ring-2 focus:ring-amber-400/10 text-slate-200 placeholder-slate-700 px-4 py-3.5 text-sm font-light outline-none transition-all duration-200 w-full resize-vertical" />
                  </div>
                  <button type="submit" disabled={sending}
                    className="inline-flex items-center gap-3 bg-amber-400 hover:bg-amber-300 disabled:opacity-60 text-[#0a0b0f] font-bold text-sm tracking-[0.1em] uppercase px-8 py-4 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_12px_32px_rgba(245,158,11,.4)]">
                    <span>{sending ? "Sending…" : "Send Message"}</span>
                    <span className="text-base">{sending ? "⏳" : "→"}</span>
                  </button>
                </form>
              </div>
            </div>
          </div>
        </section>

        {/* ════════════════ FOOTER ════════════════ */}
        <footer className="relative z-10 border-t border-white/[0.06] bg-[#0a0b0f] px-6 md:px-12 py-8">
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2.5">
              <div className="w-2 h-2 rotate-45 bg-amber-400" />
              <span className="font-display font-bold text-white tracking-wide">{profile.name}</span>
            </div>
            <p className="text-xs text-slate-600">© {new Date().getFullYear()} · Crafted with precision</p>
            <div className="flex gap-6">
              {socialLinks.map((l) => (
                <a key={l.id} href={l.url} className="text-[11px] font-bold tracking-[0.1em] uppercase text-slate-600 hover:text-amber-400 transition-colors duration-200">{l.platform}</a>
              ))}
            </div>
          </div>
        </footer>

      </div>
    </>
  );
}