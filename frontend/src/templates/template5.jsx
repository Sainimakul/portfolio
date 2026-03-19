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
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });
  const [sending, setSending] = useState(false);
  const [cursorPos, setCursorPos] = useState({ x: 0, y: 0 });

  const skillsRef   = useRef(null); const skillsVis   = useInView(skillsRef);
  const projectsRef = useRef(null); const projectsVis = useInView(projectsRef);
  const expRef      = useRef(null); const expVis      = useInView(expRef);
  const blogRef     = useRef(null); const blogVis     = useInView(blogRef);
  const contactRef  = useRef(null); const contactVis  = useInView(contactRef);
  const testimonRef = useRef(null); const testimonVis = useInView(testimonRef);

  useEffect(() => {
    const handleMouseMove = (e) => {
      setCursorPos({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  async function handleSubmit(e) {
    e.preventDefault();
    setSending(true);
    await new Promise(r => setTimeout(r, 1200));
    setSending(false);
    setForm({ name: "", email: "", subject: "", message: "" });
    success("Message sent!");
  }

  const firstName = profile.name?.split(" ")[0] || "Alex";
  const lastName  = profile.name?.split(" ").slice(1).join(" ") || "Morgan";

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300;400;500;600;700&family=Syne:wght@400;500;600;700;800&display=swap');

        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        :root {
          --metal-1: #1a1c1e;
          --metal-2: #2d2f33;
          --metal-3: #404348;
          --metal-4: #6b6f77;
          --metal-5: #a0a4ad;
          --metal-6: #d1d5db;
          --chrome: linear-gradient(145deg, #6b6f77, #404348, #6b6f77);
          --brass: linear-gradient(145deg, #b9770e, #8b5e0a, #b9770e);
          --copper: linear-gradient(145deg, #b87333, #8b4513, #b87333);
          --steel: linear-gradient(145deg, #7f8c8d, #5d6d6e, #7f8c8d);
          --surface: #0f1113;
          --surface-light: #1e2126;
          --surface-2: #2a2d34;
          --text-primary: #ffffff;
          --text-secondary: #a0a4ad;
          --text-tertiary: #6b6f77;
          --accent: #e5b13b;
          --accent-gradient: linear-gradient(135deg, #e5b13b, #b88a2c);
          --border: #2d2f33;
          --border-light: #404348;
          --shadow: 0 8px 32px rgba(0, 0, 0, 0.4);
          --glow: 0 0 30px rgba(229, 177, 59, 0.15);
          
          --heading: 'Syne', sans-serif;
          --body: 'Space Grotesk', sans-serif;

          --max: 1400px;
          --pad: clamp(20px, 5vw, 80px);
        }

        html { 
          scroll-behavior: smooth; 
          background: var(--surface);
        }
        
        body {
          font-family: var(--body);
          background: var(--surface);
          color: var(--text-primary);
          -webkit-font-smoothing: antialiased;
          line-height: 1.6;
          cursor: none;
        }

        a, button { cursor: none; }

        /* Custom Cursor */
        .cursor {
          width: 8px;
          height: 8px;
          background: var(--accent);
          border-radius: 50%;
          position: fixed;
          pointer-events: none;
          z-index: 9999;
          transition: transform 0.1s;
          transform: translate(-50%, -50%);
          box-shadow: 0 0 20px var(--accent);
        }

        .cursor-follower {
          width: 40px;
          height: 40px;
          border: 2px solid var(--accent);
          border-radius: 50%;
          position: fixed;
          pointer-events: none;
          z-index: 9998;
          transition: transform 0.3s, width 0.3s, height 0.3s;
          transform: translate(-50%, -50%);
          opacity: 0.5;
        }

        a:hover ~ .cursor-follower,
        button:hover ~ .cursor-follower {
          width: 60px;
          height: 60px;
          opacity: 0.8;
        }

        ::-webkit-scrollbar { width: 6px; background: var(--surface); }
        ::-webkit-scrollbar-thumb { 
          background: var(--metal-4); 
          border-radius: 3px;
        }

        .container {
          max-width: var(--max);
          margin: 0 auto;
          padding: 0 var(--pad);
        }

        /* Metallic Text Effects */
        .metal-text {
          background: linear-gradient(135deg, #ffffff, #a0a4ad);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .brass-text {
          background: var(--brass);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        /* Geometric Background */
        .geometric-bg {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          pointer-events: none;
          z-index: 0;
          opacity: 0.1;
        }

        .geometric-bg::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background-image: 
            linear-gradient(var(--metal-4) 1px, transparent 1px),
            linear-gradient(90deg, var(--metal-4) 1px, transparent 1px);
          background-size: 50px 50px;
        }

        .geometric-bg::after {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: radial-gradient(circle at 50% 50%, transparent 0%, var(--surface) 100%);
        }

        /* Navigation */
        .nav {
          position: sticky;
          top: 20px;
          z-index: 100;
          margin-top: 20px;
        }

        .nav-container {
          max-width: var(--max);
          margin: 0 auto;
          padding: 0 var(--pad);
        }

        .nav-content {
          background: rgba(26, 28, 30, 0.95);
          backdrop-filter: blur(10px);
          border: 1px solid var(--metal-3);
          border-radius: 60px;
          padding: 12px 24px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          box-shadow: var(--shadow);
        }

        .logo {
          font-family: var(--heading);
          font-size: 24px;
          font-weight: 800;
          background: var(--chrome);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          letter-spacing: -0.02em;
        }

        .nav-links {
          display: flex;
          gap: 8px;
          background: var(--metal-1);
          padding: 4px;
          border-radius: 40px;
          border: 1px solid var(--metal-3);
        }

        .nav-link {
          padding: 8px 20px;
          border-radius: 30px;
          font-size: 14px;
          font-weight: 500;
          color: var(--text-secondary);
          transition: all 0.3s;
          position: relative;
          overflow: hidden;
        }

        .nav-link::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: var(--chrome);
          opacity: 0;
          transition: opacity 0.3s;
          z-index: -1;
        }

        .nav-link:hover {
          color: var(--surface);
        }

        .nav-link:hover::before {
          opacity: 1;
        }

        .nav-cta {
          background: var(--accent-gradient);
          color: var(--surface);
          padding: 10px 28px;
          border-radius: 30px;
          font-weight: 600;
          font-size: 14px;
          transition: transform 0.3s, box-shadow 0.3s;
          border: 1px solid rgba(229, 177, 59, 0.5);
        }

        .nav-cta:hover {
          transform: translateY(-2px);
          box-shadow: var(--glow);
        }

        .ham {
          display: none;
          flex-direction: column;
          gap: 6px;
          background: var(--metal-2);
          border: 1px solid var(--metal-3);
          border-radius: 30px;
          padding: 12px 16px;
        }

        .ham span {
          width: 20px;
          height: 2px;
          background: var(--text-secondary);
          transition: 0.3s;
        }

        /* Mobile Menu */
        .mob-nav {
          background: var(--metal-1);
          border: 1px solid var(--metal-3);
          border-radius: 20px;
          margin-top: 10px;
          padding: 16px;
        }

        .mob-nav a {
          display: block;
          padding: 16px;
          color: var(--text-secondary);
          border-bottom: 1px solid var(--metal-3);
          font-weight: 500;
        }

        .mob-nav a:last-child {
          border-bottom: none;
          color: var(--accent);
        }

        /* Hero Section */
        .hero {
          min-height: 90vh;
          display: flex;
          align-items: center;
          position: relative;
          overflow: hidden;
        }

        .hero::before {
          content: '';
          position: absolute;
          top: -50%;
          right: -50%;
          width: 100%;
          height: 100%;
          background: radial-gradient(circle at 70% 30%, rgba(229, 177, 59, 0.1), transparent 70%);
          filter: blur(60px);
          z-index: 0;
        }

        .hero-grid {
          display: grid;
          grid-template-columns: 1.2fr 0.8fr;
          gap: 60px;
          align-items: center;
          position: relative;
          z-index: 1;
        }

        .hero-eyebrow {
          display: flex;
          align-items: center;
          gap: 16px;
          margin-bottom: 30px;
        }

        .hero-line {
          width: 60px;
          height: 2px;
          background: var(--accent-gradient);
        }

        .hero-year {
          font-size: 14px;
          font-weight: 500;
          color: var(--accent);
          letter-spacing: 2px;
        }

        .hero-name {
          font-family: var(--heading);
          font-size: clamp(50px, 8vw, 90px);
          font-weight: 800;
          line-height: 0.95;
          margin-bottom: 20px;
        }

        .hero-name-first {
          display: block;
          background: linear-gradient(135deg, #ffffff, var(--metal-5));
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .hero-name-last {
          display: block;
          background: var(--brass);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          font-style: italic;
        }

        .hero-badge {
          display: inline-block;
          background: var(--metal-2);
          border: 1px solid var(--metal-3);
          padding: 8px 16px;
          border-radius: 40px;
          font-size: 14px;
          color: var(--text-secondary);
          margin-bottom: 30px;
        }

        .hero-badge span {
          color: var(--accent);
          font-weight: 600;
        }

        .hero-bio {
          font-size: 18px;
          color: var(--text-secondary);
          max-width: 500px;
          margin-bottom: 40px;
          line-height: 1.7;
        }

        .hero-stats {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 30px;
          background: var(--metal-1);
          border: 1px solid var(--metal-3);
          border-radius: 20px;
          padding: 30px;
          backdrop-filter: blur(10px);
        }

        .stat-item {
          text-align: center;
        }

        .stat-number {
          font-family: var(--heading);
          font-size: 42px;
          font-weight: 800;
          background: linear-gradient(135deg, #ffffff, var(--metal-5));
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          line-height: 1;
          margin-bottom: 8px;
        }

        .stat-label {
          font-size: 12px;
          color: var(--text-tertiary);
          letter-spacing: 1px;
          text-transform: uppercase;
        }

        .hero-ctas {
          display: flex;
          gap: 20px;
          margin-top: 40px;
        }

        .btn-primary {
          background: var(--accent-gradient);
          color: var(--surface);
          border: none;
          padding: 16px 36px;
          border-radius: 40px;
          font-weight: 600;
          font-size: 16px;
          transition: all 0.3s;
          border: 1px solid rgba(229, 177, 59, 0.5);
          display: inline-flex;
          align-items: center;
          gap: 10px;
        }

        .btn-primary:hover {
          transform: translateY(-2px);
          box-shadow: var(--glow);
        }

        .btn-secondary {
          background: transparent;
          color: var(--text-primary);
          border: 2px solid var(--metal-3);
          padding: 16px 36px;
          border-radius: 40px;
          font-weight: 600;
          font-size: 16px;
          transition: all 0.3s;
          display: inline-flex;
          align-items: center;
          gap: 10px;
        }

        .btn-secondary:hover {
          border-color: var(--accent);
          color: var(--accent);
        }

        /* Social Links */
        .social-strip {
          display: flex;
          justify-content: flex-end;
          gap: 20px;
          margin-top: 40px;
        }

        .social-link {
          width: 50px;
          height: 50px;
          border-radius: 50%;
          background: var(--metal-1);
          border: 1px solid var(--metal-3);
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--text-secondary);
          transition: all 0.3s;
          font-size: 14px;
          font-weight: 500;
        }

        .social-link:hover {
          border-color: var(--accent);
          color: var(--accent);
          transform: translateY(-5px);
        }

        /* Section Headers */
        .section-header {
          display: flex;
          align-items: center;
          gap: 30px;
          margin-bottom: 60px;
        }

        .section-number {
          font-family: var(--heading);
          font-size: 100px;
          font-weight: 800;
          background: linear-gradient(135deg, var(--metal-4), var(--metal-2));
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          line-height: 0.8;
          opacity: 0.3;
        }

        .section-title-block {
          flex: 1;
        }

        .section-eyebrow {
          font-size: 14px;
          color: var(--accent);
          letter-spacing: 3px;
          text-transform: uppercase;
          margin-bottom: 10px;
        }

        .section-title {
          font-family: var(--heading);
          font-size: clamp(32px, 4vw, 56px);
          font-weight: 700;
        }

        .section-title-em {
          background: var(--brass);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          font-style: italic;
        }

        .section-meta {
          font-size: 14px;
          color: var(--text-tertiary);
          margin-top: 10px;
        }

        /* Skills Grid */
        .skills-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
          gap: 20px;
        }

        .skill-card {
          background: var(--metal-1);
          border: 1px solid var(--metal-3);
          border-radius: 16px;
          padding: 24px;
          transition: all 0.3s;
          position: relative;
          overflow: hidden;
        }

        .skill-card::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: linear-gradient(45deg, transparent, rgba(229, 177, 59, 0.1), transparent);
          transform: translateX(-100%);
          transition: transform 0.6s;
        }

        .skill-card:hover {
          transform: translateY(-5px);
          border-color: var(--accent);
          box-shadow: var(--glow);
        }

        .skill-card:hover::before {
          transform: translateX(100%);
        }

        .skill-header {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-bottom: 20px;
        }

        .skill-icon {
          font-size: 24px;
          color: var(--accent);
        }

        .skill-name {
          font-weight: 600;
          font-size: 18px;
        }

        .skill-bar-container {
          background: var(--metal-2);
          height: 6px;
          border-radius: 3px;
          overflow: hidden;
          margin: 15px 0;
        }

        .skill-bar-fill {
          height: 100%;
          background: var(--accent-gradient);
          border-radius: 3px;
          transition: width 1.2s cubic-bezier(0.4, 0, 0.2, 1);
          box-shadow: 0 0 10px rgba(229, 177, 59, 0.5);
        }

        .skill-percentage {
          font-size: 14px;
          color: var(--text-secondary);
          display: flex;
          justify-content: flex-end;
        }

        /* Projects Section */
        .projects-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 20px;
        }

        .project-card {
          background: var(--metal-1);
          border: 1px solid var(--metal-3);
          border-radius: 24px;
          overflow: hidden;
          transition: all 0.3s;
          position: relative;
        }

        .project-card.featured {
          grid-column: span 2;
          display: grid;
          grid-template-columns: 1.2fr 0.8fr;
        }

        .project-card:hover {
          transform: translateY(-5px);
          border-color: var(--accent);
          box-shadow: var(--glow);
        }

        .project-image {
          height: 250px;
          background: var(--metal-2);
          position: relative;
          overflow: hidden;
        }

        .project-image::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: linear-gradient(45deg, transparent, rgba(229, 177, 59, 0.1), transparent);
          transform: translateX(-100%);
          transition: transform 0.6s;
        }

        .project-card:hover .project-image::before {
          transform: translateX(100%);
        }

        .project-content {
          padding: 30px;
        }

        .project-tags {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
          margin-bottom: 15px;
        }

        .project-tag {
          background: var(--metal-2);
          border: 1px solid var(--metal-3);
          padding: 4px 12px;
          border-radius: 20px;
          font-size: 12px;
          color: var(--text-secondary);
        }

        .project-title {
          font-family: var(--heading);
          font-size: 24px;
          font-weight: 700;
          margin-bottom: 10px;
        }

        .project-desc {
          color: var(--text-secondary);
          margin-bottom: 20px;
          font-size: 14px;
          line-height: 1.7;
        }

        .project-links {
          display: flex;
          gap: 15px;
        }

        .project-link {
          color: var(--text-secondary);
          font-size: 14px;
          font-weight: 500;
          display: flex;
          align-items: center;
          gap: 5px;
          transition: color 0.3s;
        }

        .project-link:hover {
          color: var(--accent);
        }

        .project-badge {
          position: absolute;
          top: 20px;
          right: 20px;
          background: var(--accent-gradient);
          color: var(--surface);
          padding: 6px 14px;
          border-radius: 30px;
          font-size: 12px;
          font-weight: 600;
          letter-spacing: 1px;
        }

        /* Experience Timeline */
        .exp-timeline {
          display: flex;
          flex-direction: column;
          gap: 20px;
        }

        .exp-item {
          background: var(--metal-1);
          border: 1px solid var(--metal-3);
          border-radius: 20px;
          padding: 30px;
          transition: all 0.3s;
          position: relative;
          overflow: hidden;
        }

        .exp-item:hover {
          border-color: var(--accent);
          transform: translateX(10px);
        }

        .exp-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 20px;
        }

        .exp-role {
          font-family: var(--heading);
          font-size: 24px;
          font-weight: 700;
        }

        .exp-current {
          background: var(--accent-gradient);
          color: var(--surface);
          padding: 4px 12px;
          border-radius: 30px;
          font-size: 12px;
          font-weight: 600;
        }

        .exp-company {
          color: var(--accent);
          font-weight: 500;
          margin-bottom: 5px;
        }

        .exp-period {
          color: var(--text-tertiary);
          font-size: 14px;
          margin-bottom: 15px;
        }

        .exp-description {
          color: var(--text-secondary);
          font-size: 15px;
          line-height: 1.7;
        }

        .exp-points {
          list-style: none;
          margin-top: 15px;
        }

        .exp-point {
          color: var(--text-secondary);
          font-size: 14px;
          margin-bottom: 8px;
          padding-left: 20px;
          position: relative;
        }

        .exp-point::before {
          content: '→';
          position: absolute;
          left: 0;
          color: var(--accent);
        }

        /* Blog Grid */
        .blog-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 20px;
        }

        .blog-card {
          background: var(--metal-1);
          border: 1px solid var(--metal-3);
          border-radius: 20px;
          padding: 30px;
          transition: all 0.3s;
        }

        .blog-card:hover {
          transform: translateY(-5px);
          border-color: var(--accent);
          box-shadow: var(--glow);
        }

        .blog-category {
          display: inline-block;
          background: var(--metal-2);
          border: 1px solid var(--metal-3);
          padding: 4px 12px;
          border-radius: 30px;
          font-size: 12px;
          color: var(--accent);
          margin-bottom: 15px;
        }

        .blog-title {
          font-family: var(--heading);
          font-size: 20px;
          font-weight: 700;
          margin-bottom: 10px;
          line-height: 1.4;
        }

        .blog-excerpt {
          color: var(--text-secondary);
          font-size: 14px;
          margin-bottom: 20px;
          line-height: 1.6;
        }

        .blog-footer {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .blog-date {
          color: var(--text-tertiary);
          font-size: 12px;
        }

        .blog-read {
          color: var(--text-secondary);
          font-size: 14px;
          font-weight: 500;
          transition: color 0.3s;
        }

        .blog-card:hover .blog-read {
          color: var(--accent);
        }

        /* Testimonials */
        .testimonials-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 20px;
        }

        .testimonial-card {
          background: var(--metal-1);
          border: 1px solid var(--metal-3);
          border-radius: 20px;
          padding: 40px;
          transition: all 0.3s;
          position: relative;
        }

        .testimonial-card:hover {
          border-color: var(--accent);
          transform: translateY(-5px);
        }

        .testimonial-quote {
          font-size: 40px;
          color: var(--accent);
          opacity: 0.3;
          margin-bottom: 20px;
          line-height: 1;
        }

        .testimonial-text {
          color: var(--text-secondary);
          font-size: 16px;
          line-height: 1.7;
          margin-bottom: 30px;
          font-style: italic;
        }

        .testimonial-author {
          display: flex;
          align-items: center;
          gap: 15px;
        }

        .testimonial-avatar {
          width: 50px;
          height: 50px;
          border-radius: 50%;
          background: var(--accent-gradient);
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 600;
          font-size: 20px;
          color: var(--surface);
        }

        .testimonial-info {
          flex: 1;
        }

        .testimonial-name {
          font-weight: 600;
          margin-bottom: 4px;
        }

        .testimonial-role {
          color: var(--text-tertiary);
          font-size: 12px;
        }

        .testimonial-stars {
          color: var(--accent);
          font-size: 14px;
          margin-top: 4px;
        }

        /* Contact Section */
        .contact-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 20px;
        }

        .contact-info {
          background: var(--metal-1);
          border: 1px solid var(--metal-3);
          border-radius: 24px;
          padding: 40px;
        }

        .contact-heading {
          font-family: var(--heading);
          font-size: 42px;
          font-weight: 800;
          margin-bottom: 20px;
          line-height: 1.1;
        }

        .contact-heading em {
          background: var(--brass);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          font-style: italic;
        }

        .contact-sub {
          color: var(--text-secondary);
          margin-bottom: 40px;
          font-size: 16px;
          line-height: 1.7;
        }

        .contact-detail {
          margin-bottom: 30px;
        }

        .contact-label {
          font-size: 12px;
          color: var(--text-tertiary);
          letter-spacing: 1px;
          text-transform: uppercase;
          margin-bottom: 5px;
        }

        .contact-value {
          font-size: 18px;
          font-weight: 500;
        }

        .contact-value a {
          color: var(--accent);
          text-decoration: none;
        }

        .contact-form {
          background: var(--metal-1);
          border: 1px solid var(--metal-3);
          border-radius: 24px;
          padding: 40px;
        }

        .form-group {
          margin-bottom: 20px;
        }

        .form-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 20px;
        }

        .form-label {
          display: block;
          font-size: 12px;
          color: var(--text-tertiary);
          letter-spacing: 1px;
          text-transform: uppercase;
          margin-bottom: 8px;
        }

        .form-control {
          width: 100%;
          background: var(--metal-2);
          border: 1px solid var(--metal-3);
          border-radius: 12px;
          padding: 14px 16px;
          color: var(--text-primary);
          font-family: var(--body);
          font-size: 15px;
          transition: all 0.3s;
        }

        .form-control:focus {
          outline: none;
          border-color: var(--accent);
          box-shadow: var(--glow);
        }

        .form-control::placeholder {
          color: var(--text-tertiary);
        }

        textarea.form-control {
          resize: vertical;
          min-height: 120px;
        }

        .submit-btn {
          background: var(--accent-gradient);
          color: var(--surface);
          border: none;
          padding: 16px 32px;
          border-radius: 40px;
          font-weight: 600;
          font-size: 16px;
          transition: all 0.3s;
          border: 1px solid rgba(229, 177, 59, 0.5);
          cursor: pointer;
          width: 100%;
          margin-top: 10px;
        }

        .submit-btn:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: var(--glow);
        }

        .submit-btn:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        /* Footer */
        .footer {
          border-top: 1px solid var(--metal-3);
          margin-top: 80px;
          padding: 40px 0;
        }

        .footer-content {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .footer-name {
          font-family: var(--heading);
          font-size: 18px;
          font-weight: 700;
          background: var(--chrome);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .footer-copy {
          color: var(--text-tertiary);
          font-size: 14px;
        }

        .footer-social {
          display: flex;
          gap: 20px;
        }

        .footer-social a {
          color: var(--text-tertiary);
          transition: color 0.3s;
          font-size: 14px;
        }

        .footer-social a:hover {
          color: var(--accent);
        }

        /* Responsive */
        @media (max-width: 1200px) {
          .hero-grid,
          .projects-grid,
          .testimonials-grid,
          .contact-grid {
            grid-template-columns: 1fr;
          }

          .project-card.featured {
            grid-template-columns: 1fr;
          }

          .blog-grid {
            grid-template-columns: repeat(2, 1fr);
          }

          .nav-links, .nav-cta {
            display: none;
          }

          .ham {
            display: flex;
          }
        }

        @media (max-width: 768px) {
          .blog-grid {
            grid-template-columns: 1fr;
          }

          .hero-stats {
            grid-template-columns: 1fr;
            gap: 20px;
          }

          .form-row {
            grid-template-columns: 1fr;
          }

          .footer-content {
            flex-direction: column;
            gap: 20px;
            text-align: center;
          }

          .section-header {
            gap: 15px;
          }

          .section-number {
            font-size: 60px;
          }
        }
      `}</style>

      {/* Custom Cursor */}
      <div className="cursor" style={{ left: cursorPos.x, top: cursorPos.y }} />
      <div className="cursor-follower" style={{ left: cursorPos.x, top: cursorPos.y }} />

      {/* Geometric Background */}
      <div className="geometric-bg" />

      <div style={{ position: "relative", zIndex: 1 }}>

        {/* Navigation */}
        <nav className="nav">
          <div className="nav-container">
            <div className="nav-content">
              <div className="logo">{firstName}<span style={{ color: "var(--accent)" }}>.</span></div>
              
              <div className="nav-links">
                {["Work", "Skills", "Experience", "Contact"].map(s => (
                  <a key={s} href={`#${s.toLowerCase()}`} className="nav-link">{s}</a>
                ))}
              </div>

              <a href="#contact" className="nav-cta">Let's Build →</a>

              <button className="ham" onClick={() => setMenuOpen(!menuOpen)}>
                <span style={menuOpen ? { transform: "rotate(45deg) translateY(8px)" } : {}} />
                <span style={menuOpen ? { opacity: 0 } : {}} />
                <span style={menuOpen ? { transform: "rotate(-45deg) translateY(-8px)" } : {}} />
              </button>
            </div>

            {menuOpen && (
              <div className="mob-nav">
                {["Work", "Skills", "Experience", "Contact"].map(s => (
                  <a key={s} href={`#${s.toLowerCase()}`} onClick={() => setMenuOpen(false)}>{s}</a>
                ))}
                <a href="#contact" onClick={() => setMenuOpen(false)}>Let's Build →</a>
              </div>
            )}
          </div>
        </nav>

        {/* Hero Section */}
        <section id="about" className="hero">
          <div className="container">
            <div className="hero-grid">
              <div>
                <div className="hero-eyebrow">
                  <div className="hero-line" />
                  <span className="hero-year">EST. {new Date().getFullYear()}</span>
                </div>

                <h1 className="hero-name">
                  <span className="hero-name-first">{firstName}</span>
                  <span className="hero-name-last">{lastName || "Developer"}</span>
                </h1>

                <div className="hero-badge">
                  <span>✦</span> {profile.title || "Full-Stack Developer"} <span>✦</span>
                </div>

                <p className="hero-bio">
                  {profile.bio || "Crafting digital experiences with precision engineering and industrial-grade aesthetics. Where code meets craftsmanship."}
                </p>

                <div className="hero-ctas">
                  <a href="#projects" className="btn-primary">
                    View Portfolio <span>→</span>
                  </a>
                  <a href="#contact" className="btn-secondary">
                    Contact Me
                  </a>
                </div>
              </div>

              <div>
                <div className="hero-stats">
                  <div className="stat-item">
                    <div className="stat-number">{projects.length}+</div>
                    <div className="stat-label">Projects</div>
                  </div>
                  <div className="stat-item">
                    <div className="stat-number">{skills.length}+</div>
                    <div className="stat-label">Technologies</div>
                  </div>
                  <div className="stat-item">
                    <div className="stat-number">{experiences.length}+</div>
                    <div className="stat-label">Years</div>
                  </div>
                </div>

                <div className="social-strip">
                  {socialLinks.slice(0, 4).map(l => (
                    <a key={l.id} href={l.url} className="social-link" target="_blank" rel="noopener noreferrer">
                      {l.platform[0]}
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Skills Section */}
        <section id="skills">
          <div className="container">
            <div ref={skillsRef} className={`rv ${skillsVis ? "in" : ""}`}>
              <div className="section-header">
                <div className="section-number">01</div>
                <div className="section-title-block">
                  <div className="section-eyebrow">EXPERTISE</div>
                  <h2 className="section-title">
                    Technical <span className="section-title-em">Mastery</span>
                  </h2>
                  <div className="section-meta">{skills.length} technologies</div>
                </div>
              </div>

              <div className="skills-grid">
                {skills.map((sk, i) => (
                  <div key={sk.id} className="skill-card">
                    <div className="skill-header">
                      <span className="skill-icon">{sk.icon || '⚙️'}</span>
                      <span className="skill-name">{sk.name}</span>
                    </div>
                    <div className="skill-bar-container">
                      <div 
                        className="skill-bar-fill" 
                        style={{ width: skillsVis ? `${sk.percentage}%` : "0%" }}
                      />
                    </div>
                    <div className="skill-percentage">{sk.percentage}%</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Projects Section */}
        <section id="projects" style={{ marginTop: "80px" }}>
          <div className="container">
            <div ref={projectsRef} className={`rv ${projectsVis ? "in" : ""}`}>
              <div className="section-header">
                <div className="section-number">02</div>
                <div className="section-title-block">
                  <div className="section-eyebrow">PORTFOLIO</div>
                  <h2 className="section-title">
                    Featured <span className="section-title-em">Work</span>
                  </h2>
                  <div className="section-meta">{projects.length} projects</div>
                </div>
              </div>

              <div className="projects-grid">
                {projects.map((p, i) => (
                  <div key={p.id} className={`project-card ${i === 0 ? 'featured' : ''}`}>
                    {i === 0 && <div className="project-badge">FEATURED</div>}
                    
                    <div className="project-image" />
                    
                    <div className="project-content">
                      <div className="project-tags">
                        {p.techstack?.slice(0, 3).map((t, j) => (
                          <span key={j} className="project-tag">{t}</span>
                        ))}
                      </div>
                      
                      <h3 className="project-title">{p.title}</h3>
                      <p className="project-desc">{p.description}</p>
                      
                      <div className="project-links">
                        {p.github_link && (
                          <a href={p.github_link} className="project-link" target="_blank" rel="noopener noreferrer">
                            Code <span>↗</span>
                          </a>
                        )}
                        {p.live_link && (
                          <a href={p.live_link} className="project-link" target="_blank" rel="noopener noreferrer">
                            Live Demo <span>↗</span>
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Experience Section */}
        <section id="experience" style={{ marginTop: "80px" }}>
          <div className="container">
            <div ref={expRef} className={`rv ${expVis ? "in" : ""}`}>
              <div className="section-header">
                <div className="section-number">03</div>
                <div className="section-title-block">
                  <div className="section-eyebrow">CAREER</div>
                  <h2 className="section-title">
                    Professional <span className="section-title-em">Journey</span>
                  </h2>
                </div>
              </div>

              <div className="exp-timeline">
                {experiences.map((exp, i) => (
                  <div key={exp.id} className="exp-item">
                    <div className="exp-header">
                      <h3 className="exp-role">{exp.role}</h3>
                      {exp.is_current === "true" && <span className="exp-current">Current</span>}
                    </div>
                    <div className="exp-company">{exp.company}</div>
                    <div className="exp-period">
                      {fmtDate(exp.start_date)} — {exp.is_current === "true" ? "Present" : fmtDate(exp.end_date)}
                    </div>
                    {exp.description && <p className="exp-description">{exp.description}</p>}
                    {exp.points?.length > 0 && (
                      <ul className="exp-points">
                        {exp.points.map((pt, j) => <li key={j} className="exp-point">{pt}</li>)}
                      </ul>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Blog Section */}
        {blogs.length > 0 && (
          <section style={{ marginTop: "80px" }}>
            <div className="container">
              <div ref={blogRef} className={`rv ${blogVis ? "in" : ""}`}>
                <div className="section-header">
                  <div className="section-number">04</div>
                  <div className="section-title-block">
                    <div className="section-eyebrow">WRITING</div>
                    <h2 className="section-title">
                      Latest <span className="section-title-em">Articles</span>
                    </h2>
                    <div className="section-meta">{blogs.length} posts</div>
                  </div>
                </div>

                <div className="blog-grid">
                  {blogs.map((b, i) => (
                    <div key={b.id} className="blog-card">
                      <span className="blog-category">{b.category || "General"}</span>
                      <h3 className="blog-title">{b.title}</h3>
                      <p className="blog-excerpt">{b.excerpt}</p>
                      <div className="blog-footer">
                        <span className="blog-date">{fmtDate(b.publish_date)}</span>
                        <span className="blog-read">Read →</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>
        )}

        {/* Testimonials Section */}
        {testimonials.length > 0 && (
          <section style={{ marginTop: "80px" }}>
            <div className="container">
              <div ref={testimonRef} className={`rv ${testimonVis ? "in" : ""}`}>
                <div className="section-header">
                  <div className="section-number">05</div>
                  <div className="section-title-block">
                    <div className="section-eyebrow">TESTIMONIALS</div>
                    <h2 className="section-title">
                      Client <span className="section-title-em">Stories</span>
                    </h2>
                  </div>
                </div>

                <div className="testimonials-grid">
                  {testimonials.map((t, i) => (
                    <div key={t.id} className="testimonial-card">
                      <div className="testimonial-quote">"</div>
                      <p className="testimonial-text">{t.review}</p>
                      <div className="testimonial-author">
                        <div className="testimonial-avatar">{t.name?.[0]}</div>
                        <div className="testimonial-info">
                          <div className="testimonial-name">{t.name}</div>
                          <div className="testimonial-role">{t.role} at {t.company}</div>
                          <div className="testimonial-stars">
                            {"★".repeat(t.rating)}{"☆".repeat(5 - t.rating)}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>
        )}

        {/* Contact Section */}
        <section id="contact" style={{ marginTop: "80px" }}>
          <div className="container">
            <div ref={contactRef} className={`rv ${contactVis ? "in" : ""}`}>
              <div className="section-header">
                <div className="section-number">06</div>
                <div className="section-title-block">
                  <div className="section-eyebrow">CONNECT</div>
                  <h2 className="section-title">
                    Let's <span className="section-title-em">Collaborate</span>
                  </h2>
                </div>
              </div>

              <div className="contact-grid">
                <div className="contact-info">
                  <h3 className="contact-heading">
                    Start a <em>conversation</em>
                  </h3>
                  <p className="contact-sub">
                    Have a project in mind? Let's build something extraordinary together.
                    I'm always open to discussing new opportunities.
                  </p>

                  {profile.email && (
                    <div className="contact-detail">
                      <div className="contact-label">EMAIL</div>
                      <div className="contact-value">
                        <a href={`mailto:${profile.email}`}>{profile.email}</a>
                      </div>
                    </div>
                  )}

                  {profile.location && (
                    <div className="contact-detail">
                      <div className="contact-label">LOCATION</div>
                      <div className="contact-value">{profile.location}</div>
                    </div>
                  )}

                  <div className="contact-detail">
                    <div className="contact-label">SOCIAL</div>
                    <div style={{ display: "flex", gap: "15px", marginTop: "10px" }}>
                      {socialLinks.map(l => (
                        <a key={l.id} href={l.url} style={{ color: "var(--accent)" }} target="_blank" rel="noopener noreferrer">
                          {l.platform}
                        </a>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="contact-form">
                  <form onSubmit={handleSubmit}>
                    <div className="form-row">
                      <div className="form-group">
                        <label className="form-label">Name</label>
                        <input 
                          type="text" 
                          className="form-control" 
                          placeholder="John Doe"
                          value={form.name}
                          onChange={e => setForm({ ...form, name: e.target.value })}
                          required
                        />
                      </div>
                      <div className="form-group">
                        <label className="form-label">Email</label>
                        <input 
                          type="email" 
                          className="form-control" 
                          placeholder="john@example.com"
                          value={form.email}
                          onChange={e => setForm({ ...form, email: e.target.value })}
                          required
                        />
                      </div>
                    </div>

                    <div className="form-group">
                      <label className="form-label">Subject</label>
                      <input 
                        type="text" 
                        className="form-control" 
                        placeholder="Project Inquiry"
                        value={form.subject}
                        onChange={e => setForm({ ...form, subject: e.target.value })}
                      />
                    </div>

                    <div className="form-group">
                      <label className="form-label">Message</label>
                      <textarea 
                        className="form-control" 
                        placeholder="Tell me about your project..."
                        value={form.message}
                        onChange={e => setForm({ ...form, message: e.target.value })}
                        required
                      />
                    </div>

                    <button type="submit" className="submit-btn" disabled={sending}>
                      {sending ? "Sending..." : "Send Message →"}
                    </button>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="footer">
          <div className="container">
            <div className="footer-content">
              <div className="footer-name">{profile.name}</div>
              <div className="footer-copy">© {new Date().getFullYear()} All rights reserved</div>
              <div className="footer-social">
                {socialLinks.map(l => (
                  <a key={l.id} href={l.url} target="_blank" rel="noopener noreferrer">{l.platform}</a>
                ))}
              </div>
            </div>
          </div>
        </footer>

      </div>
    </>
  );
}