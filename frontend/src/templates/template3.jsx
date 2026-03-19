
"use client";

import { useState, useEffect, useRef } from "react";
import { success } from "../util/toast";
import { usePortfolio } from "../../context/PortfolioContext";

function fmtDate(d) {
  if (!d) return "";
  return new Date(d).toLocaleDateString("en-US", { year: "numeric", month: "short" });
}

function useInView(ref, threshold = 0.1) {
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) setInView(true); },
      { threshold }
    );
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);
  return inView;
}

const SERVICES = [
  { icon: "01", title: "Frontend Engineering", desc: "Pixel-perfect interfaces with smooth animations, accessibility, and performance baked in from day one." },
  { icon: "02", title: "Backend & APIs", desc: "Scalable server architecture, RESTful and GraphQL APIs built for reliability and speed at any scale." },
  { icon: "03", title: "Product Strategy", desc: "From rough idea to shipped product — I help you define scope, prioritize features, and iterate fast." },
  { icon: "04", title: "Design Systems", desc: "Consistent, reusable component libraries that scale with your team and keep your UI cohesive." },
  { icon: "05", title: "Performance Audits", desc: "Lighthouse scores, Core Web Vitals, and bundle optimization that measurably improve conversions." },
  { icon: "06", title: "Ongoing Support", desc: "Post-launch partnership with SLA-backed maintenance, monitoring, and iterative improvements." },
];

export default function Template2() {
  const { portfolioData } = usePortfolio();
  const profile      = portfolioData?.profile.data || {};
  const skills       = portfolioData?.skills.data || [];
  const projects     = portfolioData?.projects.data || [];
  const blogs        = portfolioData?.blogs.data || [];
  const testimonials = portfolioData?.testimonials.data || [];
  const socialLinks  = portfolioData?.SocialLinks.data || [];
  const experiences  = portfolioData?.experiences.data || [];

  const [menuOpen, setMenuOpen] = useState(false);
  const [form, setForm]         = useState({ name: "", email: "", subject: "", message: "" });
  const [sending, setSending]   = useState(false);
  const [scrollY, setScrollY]   = useState(0);

  useEffect(() => {
    const fn = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", fn, { passive: true });
    return () => window.removeEventListener("scroll", fn);
  }, []);

  const servicesRef  = useRef(null); const servicesVis  = useInView(servicesRef);
  const statsRef     = useRef(null); const statsVis     = useInView(statsRef);
  const projectsRef  = useRef(null); const projectsVis  = useInView(projectsRef);
  const skillsRef    = useRef(null); const skillsVis    = useInView(skillsRef);
  const expRef       = useRef(null); const expVis       = useInView(expRef);
  const blogRef      = useRef(null); const blogVis      = useInView(blogRef);
  const testimonRef  = useRef(null); const testimonVis  = useInView(testimonRef);
  const ctaRef       = useRef(null); const ctaVis       = useInView(ctaRef);
  const contactRef   = useRef(null); const contactVis   = useInView(contactRef);

  async function handleSubmit(e) {
    e.preventDefault();
    setSending(true);
    await new Promise(r => setTimeout(r, 1200));
    setSending(false);
    setForm({ name: "", email: "", subject: "", message: "" });
    success("Message sent! I'll get back to you shortly.");
  }

  const firstName = (profile.name || "Portfolio").split(" ")[0];
  const lastName  = (profile.name || "").split(" ").slice(1).join(" ");

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Instrument+Serif:ital@0;1&family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600;1,9..40,300&display=swap');

        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        :root {
          --black:  #0a0a0a;
          --white:  #fafaf8;
          --red:    #e8321a;
          --gray:   #6b6b6b;
          --light:  #f0ede8;
          --border: #d8d4ce;
          --font-display: 'Bebas Neue', sans-serif;
          --font-serif:   'Instrument Serif', serif;
          --font-body:    'DM Sans', sans-serif;
        }

        html { scroll-behavior: smooth; background: var(--white); }
        body { font-family: var(--font-body); color: var(--black); background: var(--white); }

        ::-webkit-scrollbar { width: 3px; background: var(--white); }
        ::-webkit-scrollbar-thumb { background: var(--black); }

        /* ── Animations ── */
        @keyframes fadeUp   { from { opacity:0; transform:translateY(40px); } to { opacity:1; transform:translateY(0); } }
        @keyframes fadeIn   { from { opacity:0; } to { opacity:1; } }
        @keyframes slideLeft{ from { opacity:0; transform:translateX(40px);} to { opacity:1; transform:translateX(0); } }
        @keyframes lineGrow { from { transform: scaleX(0); } to { transform: scaleX(1); } }
        @keyframes marquee  { from { transform: translateX(0); } to { transform: translateX(-50%); } }
        @keyframes blink    { 0%,100%{ opacity:1; } 50%{ opacity:0; } }

        .anim-fadeUp  { animation: fadeUp  .8s cubic-bezier(.16,1,.3,1) both; }
        .anim-fadeIn  { animation: fadeIn  .6s ease both; }
        .anim-slideL  { animation: slideLeft .8s cubic-bezier(.16,1,.3,1) both; }

        .reveal       { opacity:0; transform:translateY(30px); transition: opacity .7s ease, transform .7s cubic-bezier(.16,1,.3,1); }
        .reveal.show  { opacity:1; transform:translateY(0); }
        .reveal-left  { opacity:0; transform:translateX(-24px); transition: opacity .7s ease, transform .7s cubic-bezier(.16,1,.3,1); }
        .reveal-left.show { opacity:1; transform:translateX(0); }

        /* ── Nav ── */
        .t2-nav {
          position: fixed; top: 0; left: 0; right: 0; z-index: 100;
          height: 60px;
          display: flex; align-items: center; justify-content: space-between;
          padding: 0 40px;
          transition: background .3s, border-color .3s, box-shadow .3s;
          border-bottom: 1px solid transparent;
        }
        .t2-nav.scrolled {
          background: rgba(250,250,248,.96);
          backdrop-filter: blur(12px);
          border-color: var(--border);
          box-shadow: 0 1px 0 var(--border);
        }
        .t2-nav-logo {
          font-family: var(--font-display);
          font-size: 22px;
          letter-spacing: .04em;
          color: var(--black);
          text-decoration: none;
          display: flex; align-items: center; gap: 6px;
        }
        .t2-nav-logo span { color: var(--red); }
        .t2-nav-links { display: flex; gap: 32px; }
        .t2-nav-links a {
          font-size: 12px; font-weight: 500; letter-spacing: .08em;
          text-transform: uppercase; color: var(--gray);
          text-decoration: none; transition: color .2s;
          position: relative;
        }
        .t2-nav-links a::after {
          content: ''; position: absolute; bottom: -3px; left: 0;
          width: 0; height: 1.5px; background: var(--red);
          transition: width .25s ease;
        }
        .t2-nav-links a:hover { color: var(--black); }
        .t2-nav-links a:hover::after { width: 100%; }
        .t2-nav-cta {
          display: inline-flex; align-items: center; gap: 6px;
          background: var(--black); color: var(--white);
          font-size: 12px; font-weight: 600; letter-spacing: .08em;
          text-transform: uppercase; text-decoration: none;
          padding: 10px 22px; transition: background .2s, transform .2s;
        }
        .t2-nav-cta:hover { background: var(--red); transform: translateY(-1px); }

        /* ── Hero ── */
        .t2-hero {
          min-height: 100vh;
          display: grid;
          grid-template-rows: 1fr auto;
          padding: 0 40px;
          padding-top: 60px;
          background: var(--white);
          position: relative;
          overflow: hidden;
        }
        .t2-hero-inner {
          display: grid;
          grid-template-columns: 1fr 1fr;
          align-items: center;
          gap: 0;
          max-width: 1400px;
          margin: 0 auto;
          width: 100%;
          padding: 60px 0 40px;
        }
        .t2-hero-left { padding-right: 60px; border-right: 1px solid var(--border); }
        .t2-hero-right { padding-left: 60px; }
        .t2-hero-eyebrow {
          display: flex; align-items: center; gap: 10px;
          font-size: 11px; font-weight: 600; letter-spacing: .18em;
          text-transform: uppercase; color: var(--red);
          margin-bottom: 24px;
        }
        .t2-hero-eyebrow-dot {
          width: 6px; height: 6px; border-radius: 50%;
          background: var(--red);
          animation: blink 2s ease-in-out infinite;
        }
        .t2-hero-name {
          font-family: var(--font-display);
          font-size: clamp(80px, 10vw, 140px);
          line-height: .92;
          letter-spacing: .01em;
          color: var(--black);
          margin-bottom: 28px;
        }
        .t2-hero-name em {
          font-family: var(--font-serif);
          font-style: italic;
          color: var(--red);
        }
        .t2-hero-title-bar {
          display: flex; align-items: center; gap: 14px;
          margin-bottom: 28px;
        }
        .t2-hero-title-bar::before {
          content: ''; display: block;
          width: 40px; height: 2px; background: var(--red);
          flex-shrink: 0;
        }
        .t2-hero-title-bar span {
          font-size: 13px; font-weight: 500; letter-spacing: .12em;
          text-transform: uppercase; color: var(--gray);
        }
        .t2-hero-bio {
          font-size: 16px; line-height: 1.75; color: #555;
          font-weight: 300; max-width: 420px; margin-bottom: 40px;
        }
        .t2-hero-ctas { display: flex; gap: 12px; flex-wrap: wrap; margin-bottom: 40px; }
        .t2-btn-black {
          display: inline-flex; align-items: center; gap: 8px;
          background: var(--black); color: var(--white);
          font-size: 12px; font-weight: 600; letter-spacing: .08em;
          text-transform: uppercase; text-decoration: none;
          padding: 14px 28px; transition: all .2s;
          border: 1.5px solid var(--black);
        }
        .t2-btn-black:hover { background: var(--red); border-color: var(--red); transform: translateY(-2px); }
        .t2-btn-outline {
          display: inline-flex; align-items: center; gap: 8px;
          background: transparent; color: var(--black);
          font-size: 12px; font-weight: 600; letter-spacing: .08em;
          text-transform: uppercase; text-decoration: none;
          padding: 14px 28px; transition: all .2s;
          border: 1.5px solid var(--border);
        }
        .t2-btn-outline:hover { border-color: var(--black); transform: translateY(-2px); }

        /* Right hero card */
        .t2-hero-card {
          background: var(--light);
          border: 1px solid var(--border);
          padding: 36px;
        }
        .t2-hero-card-header {
          display: flex; align-items: center; gap: 14px;
          padding-bottom: 24px; margin-bottom: 24px;
          border-bottom: 1px solid var(--border);
        }
        .t2-hero-avatar {
          width: 56px; height: 56px;
          background: var(--black);
          display: flex; align-items: center; justify-content: center;
          font-family: var(--font-display); font-size: 26px;
          color: var(--white); flex-shrink: 0;
        }
        .t2-hero-card-name { font-family: var(--font-display); font-size: 20px; color: var(--black); letter-spacing: .04em; }
        .t2-hero-card-role { font-size: 12px; color: var(--gray); margin-top: 2px; }
        .t2-stats-row {
          display: grid; grid-template-columns: repeat(3,1fr);
          gap: 1px; background: var(--border);
          border: 1px solid var(--border);
          margin-bottom: 24px;
        }
        .t2-stat {
          background: var(--white);
          padding: 20px 16px; text-align: center;
        }
        .t2-stat-num {
          font-family: var(--font-display); font-size: 36px;
          color: var(--black); letter-spacing: .02em;
          line-height: 1;
        }
        .t2-stat-label { font-size: 10px; color: var(--gray); font-weight: 500; letter-spacing: .1em; text-transform: uppercase; margin-top: 4px; }
        .t2-skill-chips { display: flex; flex-wrap: wrap; gap: 6px; }
        .t2-chip {
          font-size: 11px; font-weight: 500; letter-spacing: .04em;
          border: 1px solid var(--border); color: var(--gray);
          padding: 5px 12px; background: var(--white);
          transition: all .2s;
        }
        .t2-chip:hover { border-color: var(--black); color: var(--black); }

        /* ── Marquee ── */
        .t2-marquee-wrap {
          border-top: 1px solid var(--border);
          border-bottom: 1px solid var(--border);
          overflow: hidden; background: var(--black);
          padding: 14px 0;
        }
        .t2-marquee-track {
          display: flex; gap: 0;
          animation: marquee 20s linear infinite;
          width: max-content;
        }
        .t2-marquee-item {
          font-family: var(--font-display); font-size: 14px;
          letter-spacing: .12em; color: var(--white);
          padding: 0 32px; white-space: nowrap;
          display: flex; align-items: center; gap: 20px;
        }
        .t2-marquee-item::after { content: '✦'; color: var(--red); font-size: 10px; }

        /* ── Section layout ── */
        .t2-section {
          padding: 100px 40px;
          max-width: 1400px; margin: 0 auto;
        }
        .t2-section-full {
          padding: 100px 40px;
          background: var(--light);
          border-top: 1px solid var(--border);
          border-bottom: 1px solid var(--border);
        }
        .t2-section-full-inner { max-width: 1400px; margin: 0 auto; }

        .t2-section-header {
          display: grid;
          grid-template-columns: auto 1fr;
          align-items: end;
          gap: 32px;
          margin-bottom: 64px;
          padding-bottom: 28px;
          border-bottom: 1px solid var(--border);
        }
        .t2-section-tag {
          font-size: 10px; font-weight: 700; letter-spacing: .22em;
          text-transform: uppercase; color: var(--red);
          margin-bottom: 10px;
        }
        .t2-section-title {
          font-family: var(--font-display);
          font-size: clamp(40px,5vw,68px);
          letter-spacing: .02em;
          line-height: 1;
          color: var(--black);
        }
        .t2-section-title em {
          font-family: var(--font-serif);
          font-style: italic;
          color: var(--red);
        }
        .t2-section-desc {
          font-size: 14px; color: var(--gray);
          line-height: 1.7; max-width: 280px;
          font-weight: 300; text-align: right;
          align-self: end;
        }

        /* ── Stats bar ── */
        .t2-stats-bar {
          display: grid;
          grid-template-columns: repeat(5,1fr);
          border-left: 1px solid var(--border);
        }
        .t2-stats-bar-item {
          border-right: 1px solid var(--border);
          border-top: 1px solid var(--border);
          border-bottom: 1px solid var(--border);
          padding: 32px 24px; text-align: center;
        }
        .t2-stats-bar-num {
          font-family: var(--font-display); font-size: 52px;
          color: var(--black); letter-spacing: .02em; line-height: 1;
          margin-bottom: 4px;
        }
        .t2-stats-bar-label {
          font-size: 11px; color: var(--gray);
          font-weight: 500; letter-spacing: .1em; text-transform: uppercase;
        }

        /* ── Services ── */
        .t2-services-grid {
          display: grid;
          grid-template-columns: repeat(3,1fr);
          border-top: 1px solid var(--border);
          border-left: 1px solid var(--border);
        }
        .t2-service-card {
          border-right: 1px solid var(--border);
          border-bottom: 1px solid var(--border);
          padding: 40px 36px;
          transition: background .25s;
          cursor: default;
          position: relative; overflow: hidden;
        }
        .t2-service-card::after {
          content: ''; position: absolute;
          bottom: 0; left: 0; right: 0; height: 3px;
          background: var(--red); transform: scaleX(0);
          transform-origin: left; transition: transform .3s ease;
        }
        .t2-service-card:hover { background: var(--light); }
        .t2-service-card:hover::after { transform: scaleX(1); }
        .t2-service-num {
          font-family: var(--font-display); font-size: 13px;
          letter-spacing: .12em; color: var(--red);
          margin-bottom: 24px;
        }
        .t2-service-title {
          font-family: var(--font-display); font-size: 22px;
          letter-spacing: .04em; color: var(--black);
          margin-bottom: 14px;
        }
        .t2-service-desc { font-size: 13px; color: var(--gray); line-height: 1.75; font-weight: 300; }

        /* ── Projects ── */
        .t2-projects-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1px; background: var(--border);
          border: 1px solid var(--border);
        }
        .t2-project-card {
          background: var(--white);
          padding: 44px;
          position: relative; overflow: hidden;
          transition: background .25s;
        }
        .t2-project-card:first-child {
          grid-column: span 2;
          border-bottom: 1px solid var(--border);
          display: grid; grid-template-columns: 1fr 1.2fr; gap: 48px; align-items: start;
        }
        .t2-project-card:hover { background: var(--light); }
        .t2-project-num {
          font-family: var(--font-display); font-size: 80px;
          color: #e8e4de; line-height: 1; letter-spacing: .02em;
          margin-bottom: 0; position: absolute; top: 28px; right: 36px;
          pointer-events: none;
        }
        .t2-project-card:first-child .t2-project-num { position: static; font-size: 100px; opacity: .25; }
        .t2-project-featured-badge {
          display: inline-flex; align-items: center; gap: 6px;
          background: var(--red); color: var(--white);
          font-size: 10px; font-weight: 700; letter-spacing: .14em;
          text-transform: uppercase; padding: 5px 12px;
          margin-bottom: 20px;
        }
        .t2-project-title {
          font-family: var(--font-display);
          color: var(--black); letter-spacing: .02em;
        }
        .t2-project-card:first-child .t2-project-title { font-size: 38px; margin-bottom: 16px; }
        .t2-project-title { font-size: 24px; margin-bottom: 12px; }
        .t2-project-desc { font-size: 13px; color: var(--gray); line-height: 1.75; font-weight: 300; margin-bottom: 20px; }
        .t2-tech-row { display: flex; flex-wrap: wrap; gap: 6px; margin-bottom: 24px; }
        .t2-tech-tag {
          font-size: 10px; font-weight: 600; letter-spacing: .08em;
          text-transform: uppercase; color: var(--gray);
          border: 1px solid var(--border); padding: 4px 10px;
          background: var(--white);
        }
        .t2-project-links { display: flex; gap: 10px; }
        .t2-link-ghost {
          font-size: 11px; font-weight: 700; letter-spacing: .1em;
          text-transform: uppercase; color: var(--black);
          text-decoration: none; border: 1.5px solid var(--black);
          padding: 8px 18px; transition: all .2s;
        }
        .t2-link-ghost:hover { background: var(--black); color: var(--white); }
        .t2-link-solid {
          font-size: 11px; font-weight: 700; letter-spacing: .1em;
          text-transform: uppercase; color: var(--white);
          text-decoration: none; background: var(--black);
          padding: 8px 18px; transition: all .2s;
          border: 1.5px solid var(--black);
        }
        .t2-link-solid:hover { background: var(--red); border-color: var(--red); }

        /* ── Skills ── */
        .t2-skills-grid {
          display: grid;
          grid-template-columns: repeat(3,1fr);
          gap: 1px; background: var(--border);
          border: 1px solid var(--border);
        }
        .t2-skill-row {
          background: var(--white);
          padding: 24px 28px;
          display: flex; align-items: center; gap: 16px;
          transition: background .2s;
        }
        .t2-skill-row:hover { background: var(--light); }
        .t2-skill-icon { font-size: 22px; flex-shrink: 0; }
        .t2-skill-info { flex: 1; min-width: 0; }
        .t2-skill-name {
          font-size: 13px; font-weight: 600; color: var(--black);
          margin-bottom: 8px; letter-spacing: .02em;
        }
        .t2-skill-bar-bg {
          height: 3px; background: var(--border); overflow: hidden;
        }
        .t2-skill-bar-fill {
          height: 100%; background: var(--black);
          transition: width 1.2s cubic-bezier(.4,0,.2,1);
        }
        .t2-skill-pct {
          font-family: var(--font-display); font-size: 18px;
          color: var(--gray); letter-spacing: .04em; flex-shrink: 0;
        }

        /* ── Experience ── */
        .t2-exp-list { display: flex; flex-direction: column; }
        .t2-exp-item {
          display: grid;
          grid-template-columns: 160px 1fr;
          border-top: 1px solid var(--border);
          padding: 36px 0;
          gap: 40px;
          transition: background .2s;
          cursor: default;
        }
        .t2-exp-item:last-child { border-bottom: 1px solid var(--border); }
        .t2-exp-item:hover .t2-exp-right { padding-left: 16px; }
        .t2-exp-right { transition: padding-left .3s ease; }
        .t2-exp-date {
          font-size: 11px; font-weight: 600; letter-spacing: .1em;
          text-transform: uppercase; color: var(--gray);
          padding-top: 4px;
        }
        .t2-exp-role {
          font-family: var(--font-display); font-size: 26px;
          letter-spacing: .03em; color: var(--black); margin-bottom: 4px;
        }
        .t2-exp-company {
          font-size: 13px; font-weight: 500; color: var(--red);
          letter-spacing: .06em; text-transform: uppercase; margin-bottom: 14px;
        }
        .t2-exp-desc { font-size: 13px; color: var(--gray); line-height: 1.75; font-weight: 300; margin-bottom: 12px; }
        .t2-exp-points { list-style: none; display: flex; flex-direction: column; gap: 6px; }
        .t2-exp-points li {
          font-size: 13px; color: var(--gray); line-height: 1.6;
          display: flex; gap: 10px; align-items: start;
        }
        .t2-exp-points li::before { content: '→'; color: var(--red); font-size: 12px; flex-shrink: 0; margin-top: 1px; }

        /* ── Testimonials ── */
        .t2-test-grid {
          display: grid; grid-template-columns: 1fr 1fr;
          gap: 1px; background: var(--border);
          border: 1px solid var(--border);
        }
        .t2-test-card {
          background: var(--white); padding: 44px;
          transition: background .2s;
        }
        .t2-test-card:hover { background: var(--light); }
        .t2-test-stars { display: flex; gap: 3px; margin-bottom: 24px; }
        .t2-test-star { color: var(--red); font-size: 14px; }
        .t2-test-quote {
          font-family: var(--font-serif); font-style: italic;
          font-size: 17px; line-height: 1.8; color: var(--black);
          margin-bottom: 28px;
        }
        .t2-test-author { display: flex; align-items: center; gap: 14px; padding-top: 24px; border-top: 1px solid var(--border); }
        .t2-test-avatar {
          width: 44px; height: 44px; background: var(--black);
          display: flex; align-items: center; justify-content: center;
          font-family: var(--font-display); font-size: 18px;
          color: var(--white); flex-shrink: 0;
        }
        .t2-test-name { font-size: 13px; font-weight: 700; color: var(--black); }
        .t2-test-role-co { font-size: 11px; color: var(--gray); margin-top: 2px; }

        /* ── Blog ── */
        .t2-blog-grid {
          display: grid; grid-template-columns: repeat(3,1fr);
          gap: 1px; background: var(--border);
          border: 1px solid var(--border);
        }
        .t2-blog-card {
          background: var(--white); padding: 36px;
          display: flex; flex-direction: column;
          cursor: pointer; transition: background .2s;
          position: relative; overflow: hidden;
        }
        .t2-blog-card::after {
          content: ''; position: absolute;
          top: 0; left: 0; right: 0; height: 3px;
          background: var(--red); transform: scaleX(0);
          transform-origin: left; transition: transform .3s ease;
        }
        .t2-blog-card:hover { background: var(--light); }
        .t2-blog-card:hover::after { transform: scaleX(1); }
        .t2-blog-top { display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px; }
        .t2-blog-cat {
          font-size: 10px; font-weight: 700; letter-spacing: .14em;
          text-transform: uppercase; color: var(--red);
          background: rgba(232,50,26,.07); padding: 4px 10px;
        }
        .t2-blog-date { font-size: 11px; color: var(--gray); }
        .t2-blog-title {
          font-family: var(--font-display); font-size: 20px;
          letter-spacing: .02em; color: var(--black); margin-bottom: 12px;
          line-height: 1.15;
        }
        .t2-blog-excerpt { font-size: 13px; color: var(--gray); line-height: 1.7; flex: 1; margin-bottom: 24px; font-weight: 300; }
        .t2-blog-read { font-size: 11px; font-weight: 700; letter-spacing: .1em; text-transform: uppercase; color: var(--black); display: flex; align-items: center; gap: 6px; }

        /* ── CTA Banner ── */
        .t2-cta-banner {
          background: var(--black);
          padding: 100px 40px;
          text-align: center;
          position: relative; overflow: hidden;
        }
        .t2-cta-banner::before {
          content: 'HIRE ME'; position: absolute;
          font-family: var(--font-display);
          font-size: clamp(120px,18vw,220px);
          color: rgba(255,255,255,.025);
          letter-spacing: .06em;
          top: 50%; left: 50%;
          transform: translate(-50%,-50%);
          white-space: nowrap; pointer-events: none;
        }
        .t2-cta-tag { font-size: 11px; font-weight: 700; letter-spacing: .2em; text-transform: uppercase; color: var(--red); margin-bottom: 20px; }
        .t2-cta-headline {
          font-family: var(--font-display);
          font-size: clamp(48px,7vw,96px);
          color: var(--white); letter-spacing: .02em;
          line-height: .95; margin-bottom: 28px;
        }
        .t2-cta-headline em { font-family: var(--font-serif); font-style: italic; color: var(--red); }
        .t2-cta-sub { font-size: 15px; color: #888; font-weight: 300; max-width: 500px; margin: 0 auto 48px; line-height: 1.75; }
        .t2-cta-btns { display: flex; justify-content: center; gap: 12px; flex-wrap: wrap; }
        .t2-btn-white {
          display: inline-flex; align-items: center; gap: 8px;
          background: var(--white); color: var(--black);
          font-size: 12px; font-weight: 700; letter-spacing: .1em;
          text-transform: uppercase; text-decoration: none;
          padding: 15px 32px; transition: all .25s;
          border: 1.5px solid var(--white);
        }
        .t2-btn-white:hover { background: var(--red); color: var(--white); border-color: var(--red); transform: translateY(-2px); }
        .t2-btn-ghost-white {
          display: inline-flex; align-items: center; gap: 8px;
          background: transparent; color: var(--white);
          font-size: 12px; font-weight: 700; letter-spacing: .1em;
          text-transform: uppercase; text-decoration: none;
          padding: 15px 32px; transition: all .25s;
          border: 1.5px solid rgba(255,255,255,.2);
        }
        .t2-btn-ghost-white:hover { border-color: var(--white); transform: translateY(-2px); }

        /* ── Contact ── */
        .t2-contact-grid {
          display: grid; grid-template-columns: 380px 1fr; gap: 80px; align-items: start;
        }
        .t2-contact-info-item { display: flex; gap: 16px; margin-bottom: 28px; }
        .t2-contact-icon {
          width: 40px; height: 40px; border: 1px solid var(--border);
          display: flex; align-items: center; justify-content: center;
          font-size: 16px; flex-shrink: 0; background: var(--light);
        }
        .t2-contact-label { font-size: 10px; font-weight: 700; letter-spacing: .16em; text-transform: uppercase; color: var(--gray); margin-bottom: 4px; }
        .t2-contact-val { font-size: 14px; font-weight: 500; color: var(--black); }
        .t2-contact-val a { color: var(--red); text-decoration: none; }
        .t2-social-links { display: flex; flex-wrap: wrap; gap: 8px; margin-top: 36px; }
        .t2-social-link {
          font-size: 10px; font-weight: 700; letter-spacing: .12em;
          text-transform: uppercase; color: var(--gray);
          border: 1px solid var(--border); padding: 8px 16px;
          text-decoration: none; transition: all .2s;
        }
        .t2-social-link:hover { border-color: var(--black); color: var(--black); }

        /* Form */
        .t2-form { display: flex; flex-direction: column; gap: 20px; }
        .t2-form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
        .t2-field { display: flex; flex-direction: column; gap: 6px; }
        .t2-label {
          font-size: 10px; font-weight: 700; letter-spacing: .16em;
          text-transform: uppercase; color: var(--gray);
        }
        .t2-input, .t2-textarea {
          border: 1px solid var(--border);
          background: var(--white);
          color: var(--black); font-family: var(--font-body);
          font-size: 14px; font-weight: 300;
          padding: 14px 16px; outline: none;
          transition: border-color .2s;
          width: 100%;
        }
        .t2-input::placeholder, .t2-textarea::placeholder { color: #bbb; }
        .t2-input:focus, .t2-textarea:focus { border-color: var(--black); }
        .t2-textarea { resize: vertical; min-height: 140px; }
        .t2-submit {
          display: inline-flex; align-items: center; gap: 10px;
          background: var(--black); color: var(--white);
          font-family: var(--font-body); font-size: 12px;
          font-weight: 700; letter-spacing: .1em; text-transform: uppercase;
          padding: 16px 36px; border: none; cursor: pointer;
          transition: all .25s; align-self: flex-start;
          border: 1.5px solid var(--black);
        }
        .t2-submit:hover { background: var(--red); border-color: var(--red); transform: translateY(-2px); }
        .t2-submit:disabled { opacity: .5; cursor: not-allowed; transform: none; }

        /* ── Footer ── */
        .t2-footer {
          border-top: 1px solid var(--border);
          padding: 28px 40px;
          display: flex; align-items: center; justify-content: space-between;
          flex-wrap: wrap; gap: 16px;
          background: var(--white);
        }
        .t2-footer-logo {
          font-family: var(--font-display); font-size: 20px;
          letter-spacing: .04em; color: var(--black);
        }
        .t2-footer-logo span { color: var(--red); }
        .t2-footer-copy { font-size: 12px; color: var(--gray); }
        .t2-footer-links { display: flex; gap: 24px; }
        .t2-footer-links a {
          font-size: 11px; font-weight: 600; letter-spacing: .1em;
          text-transform: uppercase; color: var(--gray);
          text-decoration: none; transition: color .2s;
        }
        .t2-footer-links a:hover { color: var(--red); }

        /* ── Mobile responsive ── */
        @media (max-width: 900px) {
          .t2-nav { padding: 0 20px; }
          .t2-nav-links { display: none; }
          .t2-hero { padding: 0 20px; }
          .t2-hero-inner { grid-template-columns: 1fr; padding: 80px 0 40px; }
          .t2-hero-left { padding-right: 0; border-right: none; border-bottom: 1px solid var(--border); padding-bottom: 40px; margin-bottom: 36px; }
          .t2-hero-right { padding-left: 0; }
          .t2-section { padding: 60px 20px; }
          .t2-section-full { padding: 60px 20px; }
          .t2-section-header { grid-template-columns: 1fr; }
          .t2-section-desc { text-align: left; }
          .t2-stats-bar { grid-template-columns: repeat(3,1fr); }
          .t2-services-grid { grid-template-columns: 1fr; }
          .t2-projects-grid { grid-template-columns: 1fr; }
          .t2-project-card:first-child { grid-column: span 1; grid-template-columns: 1fr; }
          .t2-skills-grid { grid-template-columns: 1fr 1fr; }
          .t2-exp-item { grid-template-columns: 1fr; gap: 8px; }
          .t2-test-grid { grid-template-columns: 1fr; }
          .t2-blog-grid { grid-template-columns: 1fr; }
          .t2-contact-grid { grid-template-columns: 1fr; gap: 48px; }
          .t2-form-row { grid-template-columns: 1fr; }
          .t2-footer { flex-direction: column; text-align: center; padding: 24px 20px; }
          .t2-cta-banner { padding: 80px 20px; }
          .t2-mobile-menu { display: flex; }
        }
        @media (min-width: 901px) {
          .t2-mobile-menu { display: none !important; }
          .t2-hamburger { display: none !important; }
        }
        .t2-mobile-menu {
          flex-direction: column; gap: 16px;
          border-top: 1px solid var(--border);
          background: var(--white); padding: 24px 20px;
        }
        .t2-mobile-menu a {
          font-size: 13px; font-weight: 600; letter-spacing: .08em;
          text-transform: uppercase; color: var(--gray);
          text-decoration: none; transition: color .2s;
        }
        .t2-mobile-menu a:hover { color: var(--red); }
      `}</style>

      {/* ══════════════════════════════════ NAV ══ */}
      <nav className={`t2-nav ${scrollY > 40 ? "scrolled" : ""}`}>
        <a href="#" className="t2-nav-logo">
          {firstName}<span>.</span>
        </a>
        <div className="t2-nav-links">
          {["Services","Projects","Experience","Blog","Contact"].map(s => (
            <a key={s} href={`#${s.toLowerCase()}`}>{s}</a>
          ))}
        </div>
        <a href="#contact" className="t2-nav-cta" style={{display:"flex"}}>
          Hire Me <span>→</span>
        </a>
        <button
          className="t2-hamburger"
          onClick={() => setMenuOpen(!menuOpen)}
          style={{background:"none",border:"none",cursor:"pointer",padding:"8px",display:"flex",flexDirection:"column",gap:"5px"}}>
          <span style={{display:"block",width:"22px",height:"2px",background:"var(--black)",transition:"all .3s",transform:menuOpen?"rotate(45deg) translateY(7px)":"none"}} />
          <span style={{display:"block",width:"22px",height:"2px",background:"var(--black)",transition:"all .3s",opacity:menuOpen?0:1}} />
          <span style={{display:"block",width:"22px",height:"2px",background:"var(--black)",transition:"all .3s",transform:menuOpen?"rotate(-45deg) translateY(-7px)":"none"}} />
        </button>
      </nav>

      {menuOpen && (
        <div className="t2-mobile-menu" style={{position:"fixed",top:"60px",left:0,right:0,zIndex:99}}>
          {["Services","Projects","Experience","Blog","Contact"].map(s => (
            <a key={s} href={`#${s.toLowerCase()}`} onClick={() => setMenuOpen(false)}>{s}</a>
          ))}
          <a href="#contact" onClick={() => setMenuOpen(false)} style={{color:"var(--red)"}}>Hire Me →</a>
        </div>
      )}

      {/* ══════════════════════════════════ HERO ══ */}
      <section className="t2-hero">
        <div className="t2-hero-inner">

          {/* Left */}
          <div className="t2-hero-left">
            <div className="t2-hero-eyebrow anim-fadeIn" style={{animationDelay:".1s"}}>
              <span className="t2-hero-eyebrow-dot" />
              Available for New Projects
            </div>

            <h1 className="t2-hero-name anim-fadeUp" style={{animationDelay:".18s"}}>
              {firstName}<br /><em>{lastName}</em>
            </h1>

            <div className="t2-hero-title-bar anim-fadeUp" style={{animationDelay:".28s"}}>
              <span>{profile.title || "Full Stack Developer"}</span>
            </div>

            <p className="t2-hero-bio anim-fadeUp" style={{animationDelay:".35s"}}>
              {profile.bio || "I build fast, scalable digital products that help businesses grow. From pixel-perfect UIs to robust backends — end to end."}
            </p>

            <div className="t2-hero-ctas anim-fadeUp" style={{animationDelay:".42s"}}>
              <a href="#projects" className="t2-btn-black">View My Work <span>→</span></a>
              <a href="#contact" className="t2-btn-outline">Start a Project</a>
            </div>

            <div style={{display:"flex",gap:"20px",flexWrap:"wrap"}} className="anim-fadeIn" style={{animationDelay:".5s"}}>
              {socialLinks.slice(0,5).map(l => (
                <a key={l.id} href={l.url}
                  style={{fontSize:"11px",fontWeight:700,letterSpacing:".1em",textTransform:"uppercase",color:"var(--gray)",textDecoration:"none",transition:"color .2s"}}
                  onMouseEnter={e=>e.target.style.color="var(--red)"}
                  onMouseLeave={e=>e.target.style.color="var(--gray)"}>
                  {l.platform}
                </a>
              ))}
            </div>
          </div>

          {/* Right */}
          <div className="t2-hero-right anim-slideL" style={{animationDelay:".3s"}}>
            <div className="t2-hero-card">
              <div className="t2-hero-card-header">
                <div className="t2-hero-avatar">{(profile.name||"P")[0]}</div>
                <div>
                  <div className="t2-hero-card-name">{profile.name || "Your Name"}</div>
                  <div className="t2-hero-card-role">{profile.title || "Developer"} {profile.location ? `· ${profile.location}` : ""}</div>
                </div>
              </div>

              <div className="t2-stats-row">
                {[
                  { n: `${projects.length}+`, l: "Projects" },
                  { n: `${skills.length}+`,   l: "Skills" },
                  { n: `${experiences.length}+`, l: "Roles" },
                ].map((s,i) => (
                  <div key={i} className="t2-stat">
                    <div className="t2-stat-num">{s.n}</div>
                    <div className="t2-stat-label">{s.l}</div>
                  </div>
                ))}
              </div>

              <div className="t2-skill-chips">
                {skills.slice(0,8).map(sk => (
                  <span key={sk.id} className="t2-chip">{sk.icon} {sk.name}</span>
                ))}
              </div>

              <div style={{marginTop:"24px",paddingTop:"24px",borderTop:"1px solid var(--border)"}}>
                <a href="#contact" className="t2-btn-black" style={{width:"100%",justifyContent:"center"}}>
                  Get In Touch →
                </a>
              </div>
            </div>
          </div>

        </div>

        {/* Scroll hint */}
        <div style={{display:"flex",alignItems:"center",gap:"10px",paddingBottom:"32px",paddingLeft:"0",opacity:".4"}}>
          <div style={{width:"1px",height:"32px",background:"var(--black)"}} />
          <span style={{fontSize:"10px",letterSpacing:".22em",textTransform:"uppercase",color:"var(--black)"}}>Scroll to explore</span>
        </div>
      </section>

      {/* ══════════════════════════════════ MARQUEE ══ */}
      <div className="t2-marquee-wrap">
        <div className="t2-marquee-track">
          {[...Array(2)].map((_, ri) =>
            ["Full Stack Development","UI/UX Design","API Engineering","Product Strategy","Clean Code","Fast Delivery","Scalable Systems","Available Now"].map((w,i) => (
              <div key={`${ri}-${i}`} className="t2-marquee-item">{w}</div>
            ))
          )}
        </div>
      </div>

      {/* ══════════════════════════════════ STATS BAR ══ */}
      <div style={{padding:"0 40px",background:"var(--white)"}}>
        <div ref={statsRef} style={{maxWidth:"1400px",margin:"0 auto"}}>
          <div className="t2-stats-bar">
            {[
              { n: `${projects.length}+`, l: "Projects Delivered" },
              { n: `${skills.length}+`, l: "Technologies" },
              { n: `${experiences.length}+`, l: "Roles Held" },
              { n: `${testimonials.length}+`, l: "Happy Clients" },
              { n: "100%", l: "Satisfaction Rate" },
            ].map((s,i) => (
              <div key={i} className={`t2-stats-bar-item reveal ${statsVis?"show":""}`} style={{transitionDelay:`${i*.07}s`}}>
                <div className="t2-stats-bar-num">{s.n}</div>
                <div className="t2-stats-bar-label">{s.l}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ══════════════════════════════════ SERVICES ══ */}
      <section id="services" className="t2-section-full">
        <div className="t2-section-full-inner">
          <div ref={servicesRef}>
            <div className={`t2-section-header reveal ${servicesVis?"show":""}`}>
              <div>
                <div className="t2-section-tag">What I Offer</div>
                <h2 className="t2-section-title">Services Built for<br /><em>Your Growth</em></h2>
              </div>
              <p className="t2-section-desc">End-to-end digital solutions — not just code, but results your business can measure.</p>
            </div>

            <div className="t2-services-grid">
              {SERVICES.map((sv,i) => (
                <div key={i} className={`t2-service-card reveal ${servicesVis?"show":""}`} style={{transitionDelay:`${i*.07}s`}}>
                  <div className="t2-service-num">{sv.icon}</div>
                  <div className="t2-service-title">{sv.title}</div>
                  <div className="t2-service-desc">{sv.desc}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════ PROJECTS ══ */}
      <section id="projects" className="t2-section">
        <div ref={projectsRef}>
          <div className={`t2-section-header reveal ${projectsVis?"show":""}`}>
            <div>
              <div className="t2-section-tag">Portfolio</div>
              <h2 className="t2-section-title">Featured <em>Work</em></h2>
            </div>
            <p className="t2-section-desc">Every project is a story of problem-solving, collaboration, and craft.</p>
          </div>

          <div className="t2-projects-grid">
            {projects.map((p,i) => (
              <div key={p.id} className={`t2-project-card reveal ${projectsVis?"show":""}`} style={{transitionDelay:`${i*.08}s`}}>
                {i === 0 && (
                  <div>
                    <div className="t2-project-featured-badge">⭐ Featured Project</div>
                    <h3 className="t2-project-title">{p.title}</h3>
                    <p className="t2-project-desc">{p.description}</p>
                    {p.techstack?.length > 0 && (
                      <div className="t2-tech-row">
                        {p.techstack.map((t,j) => <span key={j} className="t2-tech-tag">{t}</span>)}
                      </div>
                    )}
                    <div className="t2-project-links">
                      {p.github_link && <a href={p.github_link} className="t2-link-ghost">GitHub ↗</a>}
                      {p.live_link   && <a href={p.live_link}   className="t2-link-solid">Live Demo ↗</a>}
                    </div>
                  </div>
                )}
                {i === 0 && (
                  <div style={{display:"flex",alignItems:"center",justifyContent:"center"}}>
                    <div className="t2-project-num">{String(i+1).padStart(2,"0")}</div>
                  </div>
                )}
                {i > 0 && (
                  <>
                    <div className="t2-project-num">{String(i+1).padStart(2,"0")}</div>
                    <h3 className="t2-project-title" style={{fontSize:"24px"}}>{p.title}</h3>
                    <p className="t2-project-desc">{p.description}</p>
                    {p.techstack?.length > 0 && (
                      <div className="t2-tech-row">
                        {p.techstack.map((t,j) => <span key={j} className="t2-tech-tag">{t}</span>)}
                      </div>
                    )}
                    <div className="t2-project-links">
                      {p.github_link && <a href={p.github_link} className="t2-link-ghost">GitHub ↗</a>}
                      {p.live_link   && <a href={p.live_link}   className="t2-link-solid">Live Demo ↗</a>}
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════ SKILLS ══ */}
      <section id="skills" className="t2-section-full">
        <div className="t2-section-full-inner">
          <div ref={skillsRef}>
            <div className={`t2-section-header reveal ${skillsVis?"show":""}`}>
              <div>
                <div className="t2-section-tag">Tech Stack</div>
                <h2 className="t2-section-title">Skills & <em>Expertise</em></h2>
              </div>
              <p className="t2-section-desc">A carefully built arsenal of tools and technologies I use to deliver.</p>
            </div>

            <div className="t2-skills-grid">
              {skills.map((sk,i) => (
                <div key={sk.id} className={`t2-skill-row reveal ${skillsVis?"show":""}`} style={{transitionDelay:`${i*.04}s`}}>
                  <div className="t2-skill-icon">{sk.icon}</div>
                  <div className="t2-skill-info">
                    <div className="t2-skill-name">{sk.name}</div>
                    <div className="t2-skill-bar-bg">
                      <div className="t2-skill-bar-fill"
                        style={{width: skillsVis ? `${sk.percentage}%` : "0%", transitionDelay:`${.4+i*.05}s`}} />
                    </div>
                  </div>
                  <div className="t2-skill-pct">{sk.percentage}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════ EXPERIENCE ══ */}
      <section id="experience" className="t2-section">
        <div ref={expRef}>
          <div className={`t2-section-header reveal ${expVis?"show":""}`}>
            <div>
              <div className="t2-section-tag">Career</div>
              <h2 className="t2-section-title">Work <em>Experience</em></h2>
            </div>
            <p className="t2-section-desc">Companies I've partnered with and the impact I've made.</p>
          </div>

          <div className="t2-exp-list">
            {experiences.map((exp,i) => (
              <div key={exp.id} className={`t2-exp-item reveal ${expVis?"show":""}`} style={{transitionDelay:`${i*.1}s`}}>
                <div className="t2-exp-date">
                  {fmtDate(exp.start_date)}<br />
                  {exp.is_current === "true"
                    ? <span style={{color:"var(--red)",fontWeight:700}}>Present</span>
                    : fmtDate(exp.end_date)}
                </div>
                <div className="t2-exp-right">
                  <div className="t2-exp-role">{exp.role}</div>
                  <div className="t2-exp-company">{exp.company}</div>
                  {exp.description && <p className="t2-exp-desc">{exp.description}</p>}
                  {exp.points?.length > 0 && (
                    <ul className="t2-exp-points">
                      {exp.points.map((pt,j) => <li key={j}>{pt}</li>)}
                    </ul>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════ TESTIMONIALS ══ */}
      <section className="t2-section-full">
        <div className="t2-section-full-inner">
          <div ref={testimonRef}>
            <div className={`t2-section-header reveal ${testimonVis?"show":""}`}>
              <div>
                <div className="t2-section-tag">Social Proof</div>
                <h2 className="t2-section-title">Clients <em>Love It</em></h2>
              </div>
              <p className="t2-section-desc">Don't take my word for it — here's what my clients say.</p>
            </div>

            <div className="t2-test-grid">
              {testimonials.map((t,i) => (
                <div key={t.id} className={`t2-test-card reveal ${testimonVis?"show":""}`} style={{transitionDelay:`${i*.08}s`}}>
                  <div className="t2-test-stars">
                    {Array.from({length:t.rating}).map((_,j) => <span key={j} className="t2-test-star">★</span>)}
                  </div>
                  <p className="t2-test-quote">"{t.review}"</p>
                  <div className="t2-test-author">
                    <div className="t2-test-avatar">{t.name?.[0]}</div>
                    <div>
                      <div className="t2-test-name">{t.name}</div>
                      <div className="t2-test-role-co">{t.role} @ {t.company}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════ BLOG ══ */}
      <section id="blog" className="t2-section">
        <div ref={blogRef}>
          <div className={`t2-section-header reveal ${blogVis?"show":""}`}>
            <div>
              <div className="t2-section-tag">Writing</div>
              <h2 className="t2-section-title">Latest <em>Articles</em></h2>
            </div>
            <p className="t2-section-desc">Thoughts on development, design, and building great products.</p>
          </div>

          <div className="t2-blog-grid">
            {blogs.map((b,i) => (
              <div key={b.id} className={`t2-blog-card reveal ${blogVis?"show":""}`} style={{transitionDelay:`${i*.07}s`}}>
                <div className="t2-blog-top">
                  <span className="t2-blog-cat">{b.category || "General"}</span>
                  <span className="t2-blog-date">{fmtDate(b.publish_date)}</span>
                </div>
                <h3 className="t2-blog-title">{b.title}</h3>
                <p className="t2-blog-excerpt">{b.excerpt}</p>
                <span className="t2-blog-read">Read Article <span style={{color:"var(--red)"}}>→</span></span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════ CTA BANNER ══ */}
      <div ref={ctaRef} className="t2-cta-banner">
        <div className={`reveal ${ctaVis?"show":""}`}>
          <div className="t2-cta-tag">Ready to Ship?</div>
          <h2 className="t2-cta-headline">
            Let's Build Something<br /><em>Remarkable</em>
          </h2>
          <p className="t2-cta-sub">Whether you need a landing page, full-stack app, or a complete design system — I'll help you ship it fast and right.</p>
          <div className="t2-cta-btns">
            <a href="#contact" className="t2-btn-white">Start a Project →</a>
            {profile.email && (
              <a href={`mailto:${profile.email}`} className="t2-btn-ghost-white">Send an Email</a>
            )}
          </div>
        </div>
      </div>

      {/* ══════════════════════════════════ CONTACT ══ */}
      <section id="contact" className="t2-section">
        <div ref={contactRef} className={`reveal ${contactVis?"show":""}`}>
          <div className="t2-section-header">
            <div>
              <div className="t2-section-tag">Get In Touch</div>
              <h2 className="t2-section-title">Let's <em>Talk</em></h2>
            </div>
            <p className="t2-section-desc">My inbox is always open. Let's discuss your next big project.</p>
          </div>

          <div className="t2-contact-grid">
            {/* Info */}
            <div>
              {profile.email && (
                <div className="t2-contact-info-item">
                  <div className="t2-contact-icon">✉</div>
                  <div>
                    <div className="t2-contact-label">Email</div>
                    <div className="t2-contact-val"><a href={`mailto:${profile.email}`}>{profile.email}</a></div>
                  </div>
                </div>
              )}
              {profile.location && (
                <div className="t2-contact-info-item">
                  <div className="t2-contact-icon">📍</div>
                  <div>
                    <div className="t2-contact-label">Location</div>
                    <div className="t2-contact-val">{profile.location}</div>
                  </div>
                </div>
              )}
              <div className="t2-contact-info-item">
                <div className="t2-contact-icon">⏱</div>
                <div>
                  <div className="t2-contact-label">Response Time</div>
                  <div className="t2-contact-val">Within 24 hours</div>
                </div>
              </div>

              <div className="t2-social-links">
                {socialLinks.map(l => (
                  <a key={l.id} href={l.url} className="t2-social-link">{l.platform} ↗</a>
                ))}
              </div>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="t2-form">
              <div className="t2-form-row">
                {[{k:"name",l:"Name",t:"text",p:"John Doe"},{k:"email",l:"Email",t:"email",p:"john@email.com"}].map(({k,l,t,p}) => (
                  <div key={k} className="t2-field">
                    <label className="t2-label">{l}</label>
                    <input required type={t} placeholder={p} value={form[k]}
                      onChange={e => setForm({...form,[k]:e.target.value})}
                      className="t2-input" />
                  </div>
                ))}
              </div>
              <div className="t2-field">
                <label className="t2-label">Subject</label>
                <input placeholder="Project inquiry" value={form.subject}
                  onChange={e => setForm({...form,subject:e.target.value})}
                  className="t2-input" />
              </div>
              <div className="t2-field">
                <label className="t2-label">Message</label>
                <textarea required placeholder="Tell me about your project..." value={form.message}
                  onChange={e => setForm({...form,message:e.target.value})}
                  className="t2-textarea" />
              </div>
              <button type="submit" disabled={sending} className="t2-submit">
                {sending ? "Sending…" : "Send Message"} {sending ? "⏳" : "→"}
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════ FOOTER ══ */}
      <footer className="t2-footer">
        <div className="t2-footer-logo">{firstName}<span>.</span></div>
        <p className="t2-footer-copy">© {new Date().getFullYear()} {profile.name} · Built to convert</p>
        <div className="t2-footer-links">
          {socialLinks.map(l => (
            <a key={l.id} href={l.url}>{l.platform}</a>
          ))}
        </div>
      </footer>
    </>
  );
}