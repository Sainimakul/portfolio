"use client";

import { useState, useEffect, useRef } from "react";
import { success } from "../util/toast";
import { usePortfolio } from "../../context/PortfolioContext";

function fmtDate(d) {
  if (!d) return "";
  return new Date(d).toLocaleDateString("en-US", { year: "numeric", month: "short" });
}

function useInView(ref) {
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setInView(true); }, { threshold: 0.08 });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);
  return inView;
}

export default function Template1() {
  const { portfolioData } = usePortfolio();
  const profile      = portfolioData?.profile.data      || {};
  const skills       = portfolioData?.skills.data       || [];
  const projects     = portfolioData?.projects.data     || [];
  const blogs        = portfolioData?.blogs.data        || [];
  const testimonials = portfolioData?.testimonials.data || [];
  const socialLinks  = portfolioData?.SocialLinks.data  || [];
  const experiences  = portfolioData?.experiences.data  || [];

  const [menuOpen, setMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("home");
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });
  const [sending, setSending] = useState(false);

  const skillsRef   = useRef(null); const skillsVis   = useInView(skillsRef);
  const projectsRef = useRef(null); const projectsVis = useInView(projectsRef);
  const expRef      = useRef(null); const expVis      = useInView(expRef);
  const blogRef     = useRef(null); const blogVis     = useInView(blogRef);
  const contactRef  = useRef(null); const contactVis  = useInView(contactRef);
  const testimonRef = useRef(null); const testimonVis = useInView(testimonRef);

  async function handleSubmit(e) {
    e.preventDefault();
    setSending(true);
    await new Promise(r => setTimeout(r, 1200));
    setSending(false);
    setForm({ name: "", email: "", subject: "", message: "" });
    success("Message sent!");
  }

  const navItems = ["About", "Skills", "Projects", "Experience", "Contact"];

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&family=JetBrains+Mono:wght@400;500;600&display=swap');

        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        :root {
          /* Core Palette */
          --bg:         #0f1117;
          --bg-card:    #161b27;
          --bg-card-2:  #1c2333;
          --bg-hover:   #1e2740;
          --border:     rgba(255,255,255,0.07);
          --border-md:  rgba(255,255,255,0.11);
          --border-focus: rgba(99,102,241,0.5);

          /* Text */
          --text-primary:   #f0f2f8;
          --text-secondary: #8b92a9;
          --text-muted:     #505878;
          --text-inverse:   #0f1117;

          /* Accent — Indigo */
          --accent:       #6366f1;
          --accent-light: #818cf8;
          --accent-dim:   rgba(99,102,241,0.12);
          --accent-glow:  rgba(99,102,241,0.20);

          /* Status */
          --green:     #34d399;
          --green-bg:  rgba(52,211,153,0.10);
          --amber:     #fbbf24;

          /* Typography */
          --sans: 'Inter', sans-serif;
          --mono: 'JetBrains Mono', monospace;

          /* Layout */
          // --max:  1150px;
          --pad:  clamp(16px, 4vw, 48px);
          --r-sm: 8px;
          --r-md: 12px;
          --r-lg: 16px;

          /* Shadows */
          --shadow-sm: 0 1px 3px rgba(0,0,0,0.4), 0 1px 2px rgba(0,0,0,0.3);
          --shadow-md: 0 4px 16px rgba(0,0,0,0.5), 0 2px 6px rgba(0,0,0,0.3);
          --shadow-accent: 0 0 0 1px var(--accent), 0 4px 24px var(--accent-glow);
        }

        html { scroll-behavior: smooth; }
        body {
          font-family: var(--sans);
          background: var(--bg);
          color: var(--text-primary);
          -webkit-font-smoothing: antialiased;
          line-height: 1.6;
        }
        ::-webkit-scrollbar { width: 5px; background: var(--bg-card); }
        ::-webkit-scrollbar-thumb { background: var(--bg-card-2); border-radius: 4px; }
        a { text-decoration: none; color: inherit; }

        /* ── REVEAL ── */
        .rv { opacity: 0; transform: translateY(18px); transition: opacity .5s ease, transform .5s ease; }
        .rv.in { opacity: 1; transform: none; }

        /* ── NAV ── */
        .nav {
          position: sticky; top: 0; z-index: 100;
          background: rgba(15,17,23,0.85);
          backdrop-filter: blur(16px);
          border-bottom: 1px solid var(--border);
        }
        .nav-inner {
          max-width: var(--max); margin: 0 auto;
          padding: 0 var(--pad); height: 64px;
          display: flex; align-items: center; justify-content: space-between;
        }
        .logo {
          display: flex; align-items: center; gap: 10px;
          font-family: var(--mono); font-size: 15px; font-weight: 600;
          color: var(--text-primary); letter-spacing: -0.02em;
        }
        .logo-mark {
          width: 32px; height: 32px; border-radius: var(--r-sm);
          background: var(--accent); display: flex; align-items: center; justify-content: center;
          font-size: 14px; font-weight: 700; color: #fff; letter-spacing: 0;
          flex-shrink: 0;
        }
        .logo-text span { color: var(--accent-light); }
        .nav-links { display: flex; align-items: center; gap: 2px; }
        .nav-link {
          font-size: 13.5px; font-weight: 500; color: var(--text-secondary);
          padding: 7px 14px; border-radius: var(--r-sm);
          transition: background .15s, color .15s;
        }
        .nav-link:hover, .nav-link.active { background: var(--accent-dim); color: var(--accent-light); }
        .nav-cta {
          margin-left: 12px; font-size: 13px; font-weight: 600;
          background: var(--accent); color: #fff;
          padding: 8px 20px; border-radius: var(--r-sm);
          border: 1px solid transparent;
          transition: background .15s, box-shadow .15s;
        }
        .nav-cta:hover { background: var(--accent-light); box-shadow: 0 0 20px var(--accent-glow); }
        .ham {
          display: none; flex-direction: column; gap: 5px;
          background: none; border: 1px solid var(--border-md);
          border-radius: var(--r-sm); cursor: pointer; padding: 8px 10px;
        }
        .ham span { display: block; width: 18px; height: 1.5px; background: var(--text-secondary); border-radius: 2px; transition: all .2s; }
        .mob-nav {
          background: var(--bg-card); border-bottom: 1px solid var(--border);
          padding: 10px var(--pad) 16px;
        }
        .mob-nav a {
          display: block; font-size: 14px; font-weight: 500;
          color: var(--text-secondary); padding: 11px 12px;
          border-radius: var(--r-sm); transition: background .15s, color .15s;
        }
        .mob-nav a:hover { background: var(--accent-dim); color: var(--accent-light); }

        /* ── HERO ── */
        .hero-wrap {
          max-width: var(--max); margin: 0 auto;
          padding: 80px var(--pad) 80px;
          display: grid; grid-template-columns: 1fr 360px;
          gap: 64px; align-items: center;
        }
        .hero-badge {
          display: inline-flex; align-items: center; gap: 8px;
          background: var(--green-bg); border: 1px solid rgba(52,211,153,0.25);
          padding: 5px 14px; border-radius: 100px;
          font-size: 12px; font-weight: 600; color: var(--green);
          margin-bottom: 28px; width: fit-content;
        }
        .hero-badge-dot {
          width: 7px; height: 7px; border-radius: 50%;
          background: var(--green);
          box-shadow: 0 0 6px var(--green);
          animation: blink 2.2s infinite;
        }
        @keyframes blink { 0%,100%{opacity:1} 50%{opacity:.3} }
        .hero-name {
          font-size: clamp(36px, 5.5vw, 60px); font-weight: 800;
          color: var(--text-primary); letter-spacing: -0.04em; line-height: 1.08;
          margin-bottom: 10px;
        }
        .hero-name span { color: var(--accent-light); }
        .hero-role {
          font-family: var(--mono); font-size: 13px; font-weight: 500;
          color: var(--accent-light); margin-bottom: 20px;
          display: flex; align-items: center; gap: 10px;
        }
        .hero-role::before { content: '›_'; color: var(--text-muted); }
        .hero-bio {
          font-size: 15.5px; line-height: 1.75; color: var(--text-secondary);
          font-weight: 400; max-width: 520px; margin-bottom: 36px;
        }
        .hero-actions { display: flex; gap: 12px; flex-wrap: wrap; margin-bottom: 36px; }
        .btn-primary {
          font-size: 14px; font-weight: 600;
          background: var(--accent); color: #fff;
          padding: 12px 26px; border-radius: var(--r-sm);
          border: 1px solid transparent; cursor: pointer;
          transition: background .15s, box-shadow .15s, transform .15s;
          display: inline-flex; align-items: center; gap: 8px;
        }
        .btn-primary:hover {
          background: var(--accent-light);
          box-shadow: 0 0 24px var(--accent-glow);
          transform: translateY(-1px);
        }
        .btn-outline {
          font-size: 14px; font-weight: 500;
          background: transparent; color: var(--text-secondary);
          border: 1px solid var(--border-md);
          padding: 12px 26px; border-radius: var(--r-sm); cursor: pointer;
          transition: border-color .15s, color .15s, background .15s, transform .15s;
          display: inline-flex; align-items: center; gap: 8px;
        }
        .btn-outline:hover {
          border-color: var(--accent); color: var(--accent-light);
          background: var(--accent-dim); transform: translateY(-1px);
        }
        .hero-socials { display: flex; gap: 8px; flex-wrap: wrap; }
        .soc-pill {
          font-family: var(--mono); font-size: 11px; font-weight: 500;
          color: var(--text-muted); border: 1px solid var(--border);
          padding: 6px 14px; border-radius: 100px;
          transition: all .15s; background: var(--bg-card);
        }
        .soc-pill:hover { color: var(--accent-light); border-color: var(--accent); background: var(--accent-dim); }

        /* Hero stats panel */
        .hero-panel {
          display: flex; flex-direction: column; gap: 12px;
        }
        .stat-card {
          background: var(--bg-card); border: 1px solid var(--border);
          border-radius: var(--r-md); padding: 20px 22px;
          display: flex; align-items: center; justify-content: space-between;
          transition: border-color .2s, box-shadow .2s;
        }
        .stat-card:hover { border-color: var(--accent); box-shadow: 0 0 20px var(--accent-glow); }
        .stat-num {
          font-size: 32px; font-weight: 800; color: var(--text-primary);
          letter-spacing: -0.04em; line-height: 1;
        }
        .stat-lbl { font-size: 12px; font-weight: 500; color: var(--text-muted); margin-top: 3px; }
        .stat-icon-wrap {
          width: 44px; height: 44px; border-radius: var(--r-sm);
          background: var(--accent-dim); display: flex; align-items: center;
          justify-content: center; font-size: 20px;
        }

        /* ── SECTION WRAPPER ── */
        .section-wrap {
          max-width: var(--max); margin: 0 auto;
          padding: 72px var(--pad);
          border-top: 1px solid var(--border);
        }
        .sec-header { margin-bottom: 40px; }
        .sec-eyebrow {
          font-family: var(--mono); font-size: 11px; font-weight: 600;
          color: var(--accent-light); letter-spacing: .14em;
          text-transform: uppercase; margin-bottom: 8px;
          display: flex; align-items: center; gap: 8px;
        }
        .sec-eyebrow::before { content: ''; display: block; width: 20px; height: 1.5px; background: var(--accent); border-radius: 2px; }
        .sec-title {
          font-size: clamp(22px, 3vw, 30px); font-weight: 800;
          color: var(--text-primary); letter-spacing: -0.03em;
        }
        .sec-title-row {
          display: flex; align-items: baseline;
          justify-content: space-between; flex-wrap: wrap; gap: 8px;
        }
        .sec-count {
          font-family: var(--mono); font-size: 11px; font-weight: 500;
          color: var(--text-muted); background: var(--bg-card);
          border: 1px solid var(--border); padding: 4px 10px;
          border-radius: 100px;
        }

        /* ── ABOUT ── */
        .about-grid {
          display: grid; grid-template-columns: 1fr 1fr;
          gap: 40px; align-items: start;
        }
        .about-text {
          font-size: 15px; line-height: 1.8; color: var(--text-secondary);
        }
        .about-text p + p { margin-top: 16px; }
        .about-highlights { display: flex; flex-direction: column; gap: 12px; }
        .highlight-card {
          background: var(--bg-card); border: 1px solid var(--border);
          border-radius: var(--r-md); padding: 18px 20px;
          display: flex; align-items: center; gap: 14px;
          transition: border-color .2s, background .2s;
        }
        .highlight-card:hover { border-color: var(--accent); background: var(--bg-hover); }
        .highlight-icon {
          width: 40px; height: 40px; border-radius: var(--r-sm);
          background: var(--accent-dim); display: flex; align-items: center;
          justify-content: center; font-size: 18px; flex-shrink: 0;
        }
        .highlight-label { font-size: 13px; font-weight: 600; color: var(--text-primary); }
        .highlight-sub { font-size: 12px; color: var(--text-muted); margin-top: 2px; }

        /* ── SKILLS ── */
        .skills-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
          gap: 12px;
        }
        .skill-card {
          background: var(--bg-card); border: 1px solid var(--border);
          border-radius: var(--r-md); padding: 18px 20px;
          transition: border-color .2s, background .2s, transform .2s;
        }
        .skill-card:hover {
          border-color: var(--border-md); background: var(--bg-card-2);
          transform: translateY(-2px);
        }
        .skill-top {
          display: flex; align-items: center; justify-content: space-between;
          margin-bottom: 12px;
        }
        .skill-name {
          font-size: 13.5px; font-weight: 600; color: var(--text-primary);
          display: flex; align-items: center; gap: 8px;
        }
        .skill-name-icon { font-size: 16px; }
        .skill-pct {
          font-family: var(--mono); font-size: 12px; font-weight: 600;
          color: var(--accent-light);
          background: var(--accent-dim); padding: 3px 8px;
          border-radius: 100px;
        }
        .skill-track {
          height: 4px; background: var(--bg-card-2);
          border-radius: 4px; overflow: hidden;
          border: 1px solid var(--border);
        }
        .skill-fill {
          height: 100%;
          background: linear-gradient(90deg, var(--accent), var(--accent-light));
          border-radius: 4px;
          transition: width 1.2s cubic-bezier(.4,0,.2,1);
        }

        /* ── PROJECTS ── */
        .proj-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(340px, 1fr));
          gap: 16px;
        }
        .proj-card {
          background: var(--bg-card); border: 1px solid var(--border);
          border-radius: var(--r-lg); padding: 24px;
          display: flex; flex-direction: column;
          transition: border-color .2s, box-shadow .2s, transform .2s;
        }
        .proj-card:hover {
          border-color: var(--accent);
          box-shadow: 0 8px 32px rgba(0,0,0,0.4), 0 0 0 1px var(--accent);
          transform: translateY(-3px);
        }
        .proj-card-meta {
          display: flex; align-items: center;
          justify-content: space-between; margin-bottom: 16px;
        }
        .proj-index {
          font-family: var(--mono); font-size: 11px; font-weight: 600;
          color: var(--accent-light); background: var(--accent-dim);
          padding: 4px 9px; border-radius: 100px;
        }
        .proj-badge {
          font-size: 10px; font-weight: 700; letter-spacing: .06em;
          text-transform: uppercase; color: var(--amber);
          background: rgba(251,191,36,0.10); border: 1px solid rgba(251,191,36,0.20);
          padding: 3px 10px; border-radius: 100px;
        }
        .proj-name {
          font-size: 17px; font-weight: 700; color: var(--text-primary);
          letter-spacing: -0.02em; margin-bottom: 8px;
        }
        .proj-desc {
          font-size: 13.5px; line-height: 1.7; color: var(--text-secondary);
          margin-bottom: 20px; flex: 1;
        }
        .proj-tags { display: flex; flex-wrap: wrap; gap: 6px; margin-bottom: 20px; }
        .proj-tag {
          font-family: var(--mono); font-size: 11px; font-weight: 500;
          background: var(--bg-card-2); color: var(--text-secondary);
          border: 1px solid var(--border); padding: 4px 10px; border-radius: var(--r-sm);
        }
        .proj-links { display: flex; gap: 8px; margin-top: auto; }
        .proj-link-gh {
          font-size: 12px; font-weight: 600; color: var(--text-secondary);
          border: 1px solid var(--border-md); padding: 8px 16px;
          border-radius: var(--r-sm); transition: all .15s; flex: 1; text-align: center;
        }
        .proj-link-gh:hover { border-color: var(--text-secondary); color: var(--text-primary); }
        .proj-link-live {
          font-size: 12px; font-weight: 600;
          background: var(--accent); color: #fff;
          padding: 8px 16px; border-radius: var(--r-sm);
          transition: background .15s, box-shadow .15s; flex: 1; text-align: center;
        }
        .proj-link-live:hover { background: var(--accent-light); box-shadow: 0 0 16px var(--accent-glow); }

        /* ── EXPERIENCE ── */
        .exp-list { display: flex; flex-direction: column; gap: 0; }
        .exp-item {
          display: grid; grid-template-columns: 2px 1fr;
          gap: 0 32px; padding-bottom: 40px;
        }
        .exp-item:last-child { padding-bottom: 0; }
        .exp-spine { background: var(--border); border-radius: 2px; position: relative; }
        .exp-spine::before {
          content: ''; position: absolute; top: 6px; left: 50%;
          transform: translateX(-50%);
          width: 10px; height: 10px; border-radius: 50%;
          background: var(--bg); border: 2px solid var(--accent);
          box-shadow: 0 0 10px var(--accent-glow);
        }
        .exp-card {
          background: var(--bg-card); border: 1px solid var(--border);
          border-radius: var(--r-md); padding: 22px 24px;
          transition: border-color .2s, box-shadow .2s;
        }
        .exp-card:hover { border-color: var(--border-md); box-shadow: var(--shadow-md); }
        .exp-card-top {
          display: flex; flex-wrap: wrap; align-items: flex-start;
          justify-content: space-between; gap: 10px; margin-bottom: 6px;
        }
        .exp-role {
          font-size: 16px; font-weight: 700; color: var(--text-primary);
          letter-spacing: -0.02em; display: flex; align-items: center; gap: 8px;
        }
        .exp-current {
          font-size: 10px; font-weight: 700; letter-spacing: .06em;
          text-transform: uppercase; color: var(--green);
          background: var(--green-bg); border: 1px solid rgba(52,211,153,0.25);
          padding: 3px 9px; border-radius: 100px;
        }
        .exp-dates {
          font-family: var(--mono); font-size: 11px; font-weight: 500;
          color: var(--text-muted); background: var(--bg-card-2);
          border: 1px solid var(--border); padding: 4px 10px;
          border-radius: 100px; white-space: nowrap;
        }
        .exp-company { font-size: 13px; font-weight: 600; color: var(--accent-light); margin-bottom: 12px; }
        .exp-desc { font-size: 13.5px; line-height: 1.72; color: var(--text-secondary); margin-bottom: 12px; }
        .exp-bullets { list-style: none; display: flex; flex-direction: column; gap: 6px; }
        .exp-bullet {
          font-size: 13px; color: var(--text-secondary); line-height: 1.65;
          padding-left: 18px; position: relative;
        }
        .exp-bullet::before {
          content: ''; position: absolute; left: 4px; top: 9px;
          width: 5px; height: 5px; border-radius: 50%;
          background: var(--accent); opacity: 0.6;
        }

        /* ── BLOG ── */
        .blog-list { display: flex; flex-direction: column; gap: 2px; }
        .blog-item {
          display: grid; grid-template-columns: 1fr auto;
          gap: 20px; align-items: center;
          padding: 20px 20px; border-radius: var(--r-md);
          transition: background .15s; cursor: pointer;
          border: 1px solid transparent;
        }
        .blog-item:hover { background: var(--bg-card); border-color: var(--border); }
        .blog-cat {
          font-family: var(--mono); font-size: 10px; font-weight: 600;
          letter-spacing: .12em; text-transform: uppercase;
          color: var(--accent-light); margin-bottom: 5px;
        }
        .blog-title {
          font-size: 15px; font-weight: 600; color: var(--text-primary);
          letter-spacing: -0.01em; margin-bottom: 4px;
          transition: color .15s;
        }
        .blog-item:hover .blog-title { color: var(--accent-light); }
        .blog-excerpt { font-size: 13px; color: var(--text-muted); line-height: 1.55; }
        .blog-right { text-align: right; flex-shrink: 0; }
        .blog-date {
          font-family: var(--mono); font-size: 11px; color: var(--text-muted);
          margin-bottom: 8px;
        }
        .blog-cta {
          font-size: 12px; font-weight: 600;
          color: var(--text-muted); transition: color .15s;
          display: flex; align-items: center; gap: 4px; justify-content: flex-end;
        }
        .blog-item:hover .blog-cta { color: var(--accent-light); }

        /* ── TESTIMONIALS ── */
        .testim-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
          gap: 14px;
        }
        .testim-card {
          background: var(--bg-card); border: 1px solid var(--border);
          border-radius: var(--r-lg); padding: 24px;
          transition: border-color .2s, transform .2s;
        }
        .testim-card:hover { border-color: var(--border-md); transform: translateY(-2px); }
        .testim-stars { font-size: 13px; letter-spacing: 3px; color: var(--amber); margin-bottom: 14px; }
        .testim-quote-mark {
          font-size: 40px; font-weight: 800; line-height: 1;
          color: var(--accent); opacity: .3; margin-bottom: -8px;
        }
        .testim-text {
          font-size: 14px; line-height: 1.75; color: var(--text-secondary);
          margin-bottom: 20px; font-style: italic;
        }
        .testim-divider { height: 1px; background: var(--border); margin-bottom: 16px; }
        .testim-author { display: flex; align-items: center; gap: 12px; }
        .testim-avatar {
          width: 38px; height: 38px; border-radius: 50%;
          background: var(--accent-dim); border: 2px solid var(--accent);
          display: flex; align-items: center; justify-content: center;
          font-family: var(--mono); font-size: 14px; font-weight: 700;
          color: var(--accent-light); flex-shrink: 0;
        }
        .testim-name { font-size: 13px; font-weight: 700; color: var(--text-primary); }
        .testim-role { font-size: 11px; color: var(--text-muted); margin-top: 2px; }

        /* ── CONTACT ── */
        .contact-grid {
          display: grid; grid-template-columns: 280px 1fr;
          gap: 48px; align-items: start;
        }
        .contact-info-card {
          background: var(--bg-card); border: 1px solid var(--border);
          border-radius: var(--r-lg); padding: 28px; display: flex;
          flex-direction: column; gap: 0;
        }
        .contact-entry { padding: 16px 0; border-bottom: 1px solid var(--border); }
        .contact-entry:first-child { padding-top: 0; }
        .contact-entry:last-child { border-bottom: none; padding-bottom: 0; }
        .contact-lbl {
          font-family: var(--mono); font-size: 10px; font-weight: 600;
          letter-spacing: .12em; text-transform: uppercase;
          color: var(--text-muted); margin-bottom: 5px;
        }
        .contact-val { font-size: 13.5px; color: var(--text-secondary); }
        .contact-val a { color: var(--accent-light); transition: color .14s; }
        .contact-val a:hover { color: var(--accent-light); text-decoration: underline; }
        .contact-socs { display: flex; flex-direction: column; gap: 6px; margin-top: 2px; }
        .contact-soc {
          font-size: 13px; font-weight: 500; color: var(--text-secondary);
          display: flex; align-items: center; justify-content: space-between;
          padding: 8px 12px; border-radius: var(--r-sm);
          border: 1px solid transparent;
          transition: all .15s;
        }
        .contact-soc:hover {
          background: var(--accent-dim); color: var(--accent-light);
          border-color: var(--accent);
        }
        .contact-soc-arrow { font-size: 12px; color: var(--text-muted); }

        /* Form */
        .form-card {
          background: var(--bg-card); border: 1px solid var(--border);
          border-radius: var(--r-lg); padding: 32px;
        }
        .form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; }
        .form-group { margin-bottom: 16px; }
        .form-group:last-of-type { margin-bottom: 0; }
        .form-label {
          display: block; font-size: 12px; font-weight: 600;
          color: var(--text-secondary); margin-bottom: 7px; letter-spacing: .01em;
        }
        .form-control {
          width: 100%; background: var(--bg);
          border: 1px solid var(--border-md); color: var(--text-primary);
          padding: 11px 14px; border-radius: var(--r-sm);
          font-family: var(--sans); font-size: 14px; outline: none;
          transition: border-color .15s, box-shadow .15s; resize: vertical;
        }
        .form-control:focus {
          border-color: var(--accent);
          box-shadow: 0 0 0 3px var(--accent-dim);
        }
        .form-control::placeholder { color: var(--text-muted); }
        .form-submit {
          margin-top: 20px; font-size: 14px; font-weight: 700;
          background: var(--accent); color: #fff;
          border: none; padding: 13px 32px; border-radius: var(--r-sm); cursor: pointer;
          transition: background .15s, box-shadow .15s, transform .15s;
          display: inline-flex; align-items: center; gap: 8px;
        }
        .form-submit:hover:not(:disabled) {
          background: var(--accent-light);
          box-shadow: 0 0 24px var(--accent-glow);
          transform: translateY(-1px);
        }
        .form-submit:disabled { opacity: .4; cursor: not-allowed; }

        /* ── FOOTER ── */
        .footer-wrap {
          max-width: var(--max); margin: 0 auto;
          padding: 28px var(--pad);
          display: flex; align-items: center; justify-content: space-between;
          flex-wrap: wrap; gap: 16px;
          border-top: 1px solid var(--border);
        }
        .footer-brand {
          display: flex; align-items: center; gap: 10px;
          font-family: var(--mono); font-size: 13px; font-weight: 600;
          color: var(--text-secondary);
        }
        .footer-copy { font-size: 12px; color: var(--text-muted); }
        .footer-links { display: flex; gap: 16px; }
        .footer-link {
          font-size: 12px; color: var(--text-muted);
          transition: color .14s;
        }
        .footer-link:hover { color: var(--accent-light); }

        /* ── DIVIDER ── */
        .section-divider { border: none; border-top: 1px solid var(--border); margin: 0; }

        @media (max-width: 820px) {
          .nav-links, .nav-cta { display: none; }
          .ham { display: flex; }
          .hero-wrap { grid-template-columns: 1fr; gap: 48px; padding-top: 56px; padding-bottom: 56px; }
          .hero-panel { display: none; }
          .about-grid { grid-template-columns: 1fr; }
          .contact-grid { grid-template-columns: 1fr; }
          .form-row { grid-template-columns: 1fr; }
        }

        @media (max-width: 540px) {
          .proj-grid { grid-template-columns: 1fr; }
          .skills-grid { grid-template-columns: 1fr; }
          .testim-grid { grid-template-columns: 1fr; }
        }
      `}</style>

      <div style={{ background: "var(--bg)", minHeight: "100vh" }}>

        {/* ── NAV ── */}
        <nav className="nav">
          <div className="nav-inner">
            <div className="logo">
              <div className="logo-mark">{profile.name?.[0] || "D"}</div>
              <span className="logo-text">
                {profile.name?.split(" ")[0] || "Dev"}<span>.portfolio</span>
              </span>
            </div>
            <div className="nav-links">
              {navItems.map(s => (
                <a key={s} href={`#${s.toLowerCase()}`} className="nav-link">{s}</a>
              ))}
              <a href="#contact" className="nav-cta">Hire me →</a>
            </div>
            <button className="ham" onClick={() => setMenuOpen(!menuOpen)} aria-label="Menu">
              <span style={menuOpen ? { transform: "rotate(45deg) translateY(6.5px)" } : {}} />
              <span style={menuOpen ? { opacity: 0 } : {}} />
              <span style={menuOpen ? { transform: "rotate(-45deg) translateY(-6.5px)" } : {}} />
            </button>
          </div>
          {menuOpen && (
            <div className="mob-nav">
              {navItems.map(s => (
                <a key={s} href={`#${s.toLowerCase()}`} onClick={() => setMenuOpen(false)}>{s}</a>
              ))}
              <a href="#contact" onClick={() => setMenuOpen(false)}
                style={{ color: "var(--accent-light)", fontWeight: 600, marginTop: 4 }}>
                Hire me →
              </a>
            </div>
          )}
        </nav>

        {/* ── HERO ── */}
        <div id="home" className="hero-wrap">
          <div>
            <div className="hero-badge">
              <span className="hero-badge-dot" />
              Available for opportunities
            </div>
            <h1 className="hero-name">
              {profile.name?.split(" ").map((word, i) =>
                i === profile.name.split(" ").length - 1
                  ? <span key={i}> {word}</span>
                  : word + " "
              ) || "Your Name"}
            </h1>
            <div className="hero-role">{profile.title || "Full-Stack Developer"}</div>
            <p className="hero-bio">{profile.bio || "Building thoughtful digital experiences with clean code and purposeful design."}</p>
            <div className="hero-actions">
              <a href="#projects" className="btn-primary">View my work →</a>
              <a href="#contact" className="btn-outline">Let's talk</a>
            </div>
            <div className="hero-socials">
              {socialLinks.map(l => (
                <a key={l.id} href={l.url} className="soc-pill" target="_blank" rel="noopener noreferrer">{l.platform}</a>
              ))}
            </div>
          </div>

          <div className="hero-panel">
            {[
              { num: projects.length,    lbl: "Projects shipped",   icon: "📦" },
              { num: skills.length,      lbl: "Technologies",        icon: "⚡" },
              { num: experiences.length, lbl: "Companies worked at", icon: "🏢" },
            ].map(s => (
              <div key={s.lbl} className="stat-card">
                <div>
                  <div className="stat-num">{s.num}</div>
                  <div className="stat-lbl">{s.lbl}</div>
                </div>
                <div className="stat-icon-wrap">{s.icon}</div>
              </div>
            ))}
          </div>
        </div>

        {/* ── ABOUT ── */}
        <section id="about">
          <div className="section-wrap">
            <div className="sec-header">
              <div className="sec-eyebrow">Who I am</div>
              <div className="sec-title">About Me</div>
            </div>
            <div className="about-grid">
              <div className="about-text">
                <p>{profile.bio || "I'm a developer who cares deeply about the intersection of design and engineering."}</p>
                <p style={{ marginTop: 16 }}>
                  {profile.location && `Based in ${profile.location}, I collaborate with teams globally to build products that are both technically sound and visually compelling.`}
                </p>
              </div>
              <div className="about-highlights">
                {[
                  { icon: "🎯", label: "Problem Solver", sub: "Turning complex challenges into simple solutions" },
                  { icon: "🎨", label: "Design-Minded", sub: "Code that looks as good as it performs" },
                  { icon: "🚀", label: "Shipping Fast", sub: `${projects.length}+ projects delivered` },
                  { icon: "🤝", label: "Team Player", sub: `${experiences.length}+ companies collaborated with` },
                ].map(h => (
                  <div key={h.label} className="highlight-card">
                    <div className="highlight-icon">{h.icon}</div>
                    <div>
                      <div className="highlight-label">{h.label}</div>
                      <div className="highlight-sub">{h.sub}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ── SKILLS ── */}
        <section id="skills">
          <div className="section-wrap">
            <div ref={skillsRef} className={`rv ${skillsVis ? "in" : ""}`}>
              <div className="sec-header">
                <div className="sec-eyebrow">Expertise</div>
                <div className="sec-title-row">
                  <div className="sec-title">Skills & Technologies</div>
                  <span className="sec-count">{skills.length} skills</span>
                </div>
              </div>
              <div className="skills-grid">
                {skills.map((sk, i) => (
                  <div key={sk.id} className="skill-card" style={{ transitionDelay: `${i * 0.04}s` }}>
                    <div className="skill-top">
                      <span className="skill-name">
                        <span className="skill-name-icon">{sk.icon}</span>
                        {sk.name}
                      </span>
                      <span className="skill-pct">{sk.percentage}%</span>
                    </div>
                    <div className="skill-track">
                      <div
                        className="skill-fill"
                        style={{
                          width: skillsVis ? `${sk.percentage}%` : "0%",
                          transitionDelay: `${0.3 + i * 0.05}s`
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ── PROJECTS ── */}
        <section id="projects">
          <div className="section-wrap">
            <div ref={projectsRef} className={`rv ${projectsVis ? "in" : ""}`}>
              <div className="sec-header">
                <div className="sec-eyebrow">Portfolio</div>
                <div className="sec-title-row">
                  <div className="sec-title">Selected Work</div>
                  <span className="sec-count">{projects.length} projects</span>
                </div>
              </div>
              <div className="proj-grid">
                {projects.map((p, i) => (
                  <div key={p.id} className="proj-card" style={{ transitionDelay: `${i * 0.06}s` }}>
                    <div className="proj-card-meta">
                      <span className="proj-index">{String(i + 1).padStart(2, "0")}</span>
                      {i === 0 && <span className="proj-badge">★ Featured</span>}
                    </div>
                    <div className="proj-name">{p.title}</div>
                    <p className="proj-desc">{p.description}</p>
                    {p.techstack?.length > 0 && (
                      <div className="proj-tags">
                        {p.techstack.map((t, j) => <span key={j} className="proj-tag">{t}</span>)}
                      </div>
                    )}
                    <div className="proj-links">
                      {p.github_link && (
                        <a href={p.github_link} className="proj-link-gh" target="_blank" rel="noopener noreferrer">
                          GitHub ↗
                        </a>
                      )}
                      {p.live_link && (
                        <a href={p.live_link} className="proj-link-live" target="_blank" rel="noopener noreferrer">
                          Live demo ↗
                        </a>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ── EXPERIENCE ── */}
        <section id="experience">
          <div className="section-wrap">
            <div ref={expRef} className={`rv ${expVis ? "in" : ""}`}>
              <div className="sec-header">
                <div className="sec-eyebrow">Career</div>
                <div className="sec-title">Work Experience</div>
              </div>
              <div className="exp-list">
                {experiences.map((exp, i) => (
                  <div key={exp.id} className="exp-item">
                    <div className="exp-spine" />
                    <div className="exp-card" style={{ transitionDelay: `${i * 0.07}s` }}>
                      <div className="exp-card-top">
                        <span className="exp-role">
                          {exp.role}
                          {exp.is_current === "true" && <span className="exp-current">Current</span>}
                        </span>
                        <span className="exp-dates">
                          {fmtDate(exp.start_date)} — {exp.is_current === "true" ? "Present" : fmtDate(exp.end_date)}
                        </span>
                      </div>
                      <div className="exp-company">{exp.company}</div>
                      {exp.description && <p className="exp-desc">{exp.description}</p>}
                      {exp.points?.length > 0 && (
                        <ul className="exp-bullets">
                          {exp.points.map((pt, j) => (
                            <li key={j} className="exp-bullet">{pt}</li>
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

        {/* ── BLOG ── */}
        {blogs.length > 0 && (
          <section id="blog">
            <div className="section-wrap">
              <div ref={blogRef} className={`rv ${blogVis ? "in" : ""}`}>
                <div className="sec-header">
                  <div className="sec-eyebrow">Writing</div>
                  <div className="sec-title-row">
                    <div className="sec-title">Latest Articles</div>
                    <span className="sec-count">{blogs.length} posts</span>
                  </div>
                </div>
                <div className="blog-list">
                  {blogs.map((b, i) => (
                    <div key={b.id} className="blog-item" style={{ transitionDelay: `${i * 0.05}s` }}>
                      <div>
                        <div className="blog-cat">{b.category || "General"}</div>
                        <div className="blog-title">{b.title}</div>
                        <p className="blog-excerpt">{b.excerpt}</p>
                      </div>
                      <div className="blog-right">
                        <div className="blog-date">{fmtDate(b.publish_date)}</div>
                        <div className="blog-cta">Read <span>→</span></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>
        )}

        {/* ── TESTIMONIALS ── */}
        {testimonials.length > 0 && (
          <section id="testimonials">
            <div className="section-wrap">
              <div ref={testimonRef} className={`rv ${testimonVis ? "in" : ""}`}>
                <div className="sec-header">
                  <div className="sec-eyebrow">Social Proof</div>
                  <div className="sec-title">What Clients Say</div>
                </div>
                <div className="testim-grid">
                  {testimonials.map((t, i) => (
                    <div key={t.id} className="testim-card" style={{ transitionDelay: `${i * 0.06}s` }}>
                      <div className="testim-stars">{"★".repeat(t.rating)}{"☆".repeat(5 - t.rating)}</div>
                      <div className="testim-quote-mark">"</div>
                      <p className="testim-text">{t.review}</p>
                      <div className="testim-divider" />
                      <div className="testim-author">
                        <div className="testim-avatar">{t.name?.[0]}</div>
                        <div>
                          <div className="testim-name">{t.name}</div>
                          <div className="testim-role">{t.role} · {t.company}</div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>
        )}

        {/* ── CONTACT ── */}
        <section id="contact">
          <div className="section-wrap">
            <div ref={contactRef} className={`rv ${contactVis ? "in" : ""}`}>
              <div className="sec-header">
                <div className="sec-eyebrow">Get in touch</div>
                <div className="sec-title">Let's Work Together</div>
              </div>
              <div className="contact-grid">

                {/* Left info panel */}
                <div className="contact-info-card">
                  <p style={{ fontSize: 13.5, color: "var(--text-secondary)", lineHeight: 1.75, marginBottom: 20 }}>
                    Have a project in mind or want to explore an opportunity? I'd love to hear from you.
                  </p>
                  
                  {profile.email && (
                    <div className="contact-entry">
                      <div className="contact-lbl">Email</div>
                      <div className="contact-val">
                        <a href={`mailto:${profile.email}`}>{profile.email}</a>
                      </div>
                    </div>
                  )}
                  {profile.mobile && (
                    <div className="contact-entry">
                      <div className="contact-lbl">Mobile</div>
                      <div className="contact-val">
                        <a href={`https://wa.me/${profile.mobile}`}>{profile.mobile}</a>
                      </div>
                    </div>
                  )}
                  {profile.location && (
                    <div className="contact-entry">
                      <div className="contact-lbl">Location</div>
                      <div className="contact-val">{profile.location}</div>
                    </div>
                  )}
                  {socialLinks.length > 0 && (
                    <div className="contact-entry">
                      <div className="contact-lbl">Profiles</div>
                      <div className="contact-socs">
                        {socialLinks.map(l => (
                          <a key={l.id} href={l.url} className="contact-soc" target="_blank" rel="noopener noreferrer">
                            <span>{l.platform}</span>
                            <span className="contact-soc-arrow">↗</span>
                          </a>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Right form */}
                <div className="form-card">
                  <form onSubmit={handleSubmit}>
                    <div className="form-row">
                      <div className="form-group">
                        <label className="form-label">Name</label>
                        <input required type="text" placeholder="John Doe" value={form.name}
                          onChange={e => setForm({ ...form, name: e.target.value })}
                          className="form-control" />
                      </div>
                      <div className="form-group">
                        <label className="form-label">Email</label>
                        <input required type="email" placeholder="john@email.com" value={form.email}
                          onChange={e => setForm({ ...form, email: e.target.value })}
                          className="form-control" />
                      </div>
                    </div>
                    <div className="form-group">
                      <label className="form-label">Subject</label>
                      <input placeholder="Project inquiry" value={form.subject}
                        onChange={e => setForm({ ...form, subject: e.target.value })}
                        className="form-control" />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Message</label>
                      <textarea required rows={5} placeholder="Tell me about your project..."
                        value={form.message}
                        onChange={e => setForm({ ...form, message: e.target.value })}
                        className="form-control" />
                    </div>
                    <button type="submit" disabled={sending} className="form-submit">
                      {sending ? "Sending…" : "Send message →"}
                    </button>
                  </form>
                </div>

              </div>
            </div>
          </div>
        </section>

        {/* ── FOOTER ── */}
        <footer>
          <div className="footer-wrap">
            <div className="footer-brand">
              <div className="logo-mark" style={{ width: 26, height: 26, fontSize: 11 }}>
                {profile.name?.[0] || "D"}
              </div>
              {profile.name}
            </div>
            <div className="footer-copy">© {new Date().getFullYear()} · All rights reserved</div>
            <div className="footer-links">
              {socialLinks.map(l => (
                <a key={l.id} href={l.url} className="footer-link" target="_blank" rel="noopener noreferrer">
                  {l.platform}
                </a>
              ))}
            </div>
          </div>
        </footer>

      </div>
    </>
  );
}