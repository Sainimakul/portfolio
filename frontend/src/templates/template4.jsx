"use client";

import { usePortfolio } from "../../context/PortfolioContext";
import { sendContactMessage } from "../../service/api";
import { useState, useEffect } from "react";
import { success, error } from "../util/toast";

function formatDate(d) {
  if (!d) return "";
  return new Date(d).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" });
}
function truncate(str, n) {
  return str?.length > n ? str.substring(0, n - 1) + "…" : str;
}

function useTypewriter(text, speed = 60) {
  const [displayed, setDisplayed] = useState("");
  useEffect(() => {
    setDisplayed("");
    let i = 0;
    const id = setInterval(() => {
      if (i < text.length) { setDisplayed(text.slice(0, i + 1)); i++; }
      else clearInterval(id);
    }, speed);
    return () => clearInterval(id);
  }, [text]);
  return displayed;
}

const track = (eventType, metadata = {}) => ({
  "data-track": JSON.stringify({ event_type: eventType, page: typeof window !== "undefined" ? window.location.pathname : "/", metadata }),
});

export default function Template4() {
  const { portfolioData, loading } = usePortfolio();
  const [contactForm, setContactForm] = useState({ name: "", email: "", subject: "", message: "" });
  const [sending, setSending] = useState(false);
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const id = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(id);
  }, []);

  const profile = portfolioData?.profile.data || {};
  const skills = portfolioData?.skills.data || [];
  const projects = portfolioData?.projects.data || [];
  const blogs = portfolioData?.blogs.data || [];
  const testimonials = portfolioData?.testimonials.data || [];
  const socialLinks = portfolioData?.SocialLinks.data || [];
  const experiences = portfolioData?.experiences.data || [];

  const typedTitle = useTypewriter(profile?.name ? `> ${profile.name}_` : "> developer_", 60);

  async function handleContact(e) {
    e.preventDefault();
    try {
      setSending(true);
      await sendContactMessage(contactForm);
      success("Message sent successfully");
      setContactForm({ name: "", email: "", subject: "", message: "" });
    } catch (err) { error(err.message); }
    finally { setSending(false); }
  }

  if (loading) return (
    <div className="min-h-screen bg-[#080c10] flex items-center justify-center font-mono text-[#00ff9f]">
      <style>{`@keyframes pulse{0%,100%{opacity:1}50%{opacity:0.3}}`}</style>
      <span style={{ animation: "pulse 1s infinite" }}>[LOADING SYSTEM...]</span>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#080c10] text-[#c9d1d9] overflow-x-hidden relative font-mono">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@300;400;500;700&family=Orbitron:wght@400;700;900&display=swap');
        @keyframes blink{0%,49%,100%{opacity:1}50%,99%{opacity:0}}
        @keyframes dotBlink{0%,100%{opacity:1;box-shadow:0 0 6px #00ff9f}50%{opacity:0.3;box-shadow:none}}
        @keyframes fillCyber{from{width:0!important}}
        @keyframes glitch1{0%,90%,100%{transform:translate(0)}91%{transform:translate(-3px,1px)}93%{transform:translate(3px,-1px)}95%{transform:translate(-1px,2px)}}
        @keyframes glitch2{0%,90%,100%{transform:translate(0)}92%{transform:translate(3px,-1px)}94%{transform:translate(-2px,1px)}96%{transform:translate(2px,-2px)}}
        @keyframes scanlines{0%{background-position:0 0}100%{background-position:0 100vh}}
        .cursor-blink{animation:blink 1s step-end infinite;color:#00ff9f}
        .dot-blink{animation:dotBlink 2s ease-in-out infinite}
        .skill-fill-cyber{animation:fillCyber 1.5s cubic-bezier(0.4,0,0.2,1) both}
        .glitch-name{position:relative}
        .glitch-name::before,.glitch-name::after{content:attr(data-text);position:absolute;top:0;left:0;width:100%;height:100%}
        .glitch-name::before{color:#ff0044;animation:glitch1 3s infinite;clip-path:polygon(0 0,100% 0,100% 35%,0 35%)}
        .glitch-name::after{color:#00cfff;animation:glitch2 3s infinite;clip-path:polygon(0 65%,100% 65%,100% 100%,0 100%)}
        ::-webkit-scrollbar{width:3px;background:#080c10}
        ::-webkit-scrollbar-thumb{background:#00ff9f}
      `}</style>

      {/* Scanlines */}
      <div className="fixed inset-0 pointer-events-none z-50"
        style={{ backgroundImage: "repeating-linear-gradient(0deg,transparent,transparent 2px,rgba(0,255,159,0.01) 2px,rgba(0,255,159,0.01) 4px)" }} />

      {/* TOPBAR */}
      <div className="border-b border-[rgba(0,255,159,0.15)] px-6 md:px-16 py-2 flex justify-between text-[11px]"
        style={{ background: "rgba(0,255,159,0.05)" }}>
        <div className="flex items-center gap-3">
          <span className="dot-blink w-2 h-2 rounded-full bg-[#00ff9f] inline-block" />
          <span className="text-[#00ff9f] font-bold">SYS.PORTFOLIO</span>
          <span className="text-[#2d3748]">|</span>
          <span className="text-[#64748b]">USER: {profile?.name?.toUpperCase().split(" ")[0] || "DEV"}</span>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-[#00cfff] font-bold">{time.toTimeString().slice(0, 8)}</span>
          <span className="text-[#2d3748]">|</span>
          <span className="text-[#00ff9f]">● ONLINE</span>
        </div>
      </div>

      {/* NAV */}
      <nav className="flex justify-between items-center px-6 md:px-16 py-4 border-b border-[rgba(0,255,159,0.15)] bg-[#0d1117]">
        <span className="text-[#00ff9f] font-bold text-sm tracking-wide" style={{ fontFamily: "'Orbitron', monospace" }}>
          [{profile?.name?.split(" ")[0] || "DEV"}@portfolio]$
        </span>
        <div className="hidden md:flex gap-7">
          {["skills", "projects", "experience", "blog", "contact"].map((s) => (
            <a key={s} href={`#${s}`}
              className="text-[#64748b] text-sm transition-all hover:text-[#00ff9f] hover:shadow-[0_0_10px_#00ff9f]"
              {...track("nav_click", { section: s })}>./{s}</a>
          ))}
        </div>
      </nav>

      {/* HERO */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-16 px-6 md:px-16 py-16 min-h-[85vh] items-center border-b border-[rgba(0,255,159,0.15)]">
        {/* Terminal */}
        <div className="bg-[#161b22] border border-[rgba(0,255,159,0.15)] rounded-lg overflow-hidden shadow-[0_0_40px_rgba(0,255,159,0.08)]">
          <div className="bg-[#21262d] px-4 py-3 flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-[#ff5f56] inline-block" />
            <span className="w-3 h-3 rounded-full bg-[#ffbd2e] inline-block" />
            <span className="w-3 h-3 rounded-full bg-[#27c93f] inline-block" />
            <span className="text-xs text-[#4a5568] ml-2">terminal — bash — 80×24</span>
          </div>
          <div className="p-6 flex flex-col gap-3 min-h-[280px]">
            <div className="flex items-center gap-2">
              <span className="text-[#00ff9f] font-bold">$</span>
              <span className="text-[#00cfff] text-sm">whoami</span>
            </div>
            <div className="text-[#8b949e] text-sm pl-5">{profile?.name || "Full Stack Developer"}</div>
            <div className="flex items-center gap-2">
              <span className="text-[#00ff9f] font-bold">$</span>
              <span className="text-[#00cfff] text-sm">cat bio.txt</span>
            </div>
            <div className="text-[#8b949e] text-sm pl-5 leading-relaxed">{profile?.bio || "Building digital experiences."}</div>
            <div className="flex items-center gap-2">
              <span className="text-[#00ff9f] font-bold">$</span>
              <span className="text-[#00cfff] text-sm">ls -la</span>
            </div>
            <div className="text-[#8b949e] text-sm pl-5 leading-[1.8]">
              <div>drwxr-xr-x  skills/  ({skills.length} items)</div>
              <div>drwxr-xr-x  projects/  ({projects.length} items)</div>
              <div>drwxr-xr-x  experience/  ({experiences.length} items)</div>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[#00ff9f] font-bold">$</span>
              <span className="cursor-blink text-lg">▋</span>
            </div>
          </div>
        </div>

        {/* Hero info */}
        <div className="flex flex-col gap-5">
          <h1 className="glitch-name leading-tight font-black text-[#00ff9f]"
            style={{ fontFamily: "'Orbitron', monospace", fontSize: "clamp(24px,3vw,42px)" }}
            data-text={typedTitle}>{typedTitle}</h1>
          <p className="text-[#00cfff] text-base font-medium">{profile?.title || "Full Stack Developer"}</p>
          <div className="flex flex-wrap gap-3">
            <span className="bg-[rgba(0,255,159,0.1)] border border-[#00ff9f] text-[#00ff9f] px-3.5 py-1 text-xs tracking-widest shadow-[0_0_10px_rgba(0,255,159,0.2)]">◉ AVAILABLE</span>
            {profile?.location && <span className="bg-[rgba(0,207,255,0.08)] border border-[rgba(0,207,255,0.3)] text-[#00cfff] px-3.5 py-1 text-xs tracking-wide">{profile.location}</span>}
          </div>
          <div className="flex gap-6 items-center">
            {[
              { num: projects.length, label: "PROJECTS" },
              { num: skills.length, label: "SKILLS" },
              { num: experiences.length, label: "ROLES" },
            ].map((s, i) => (
              <div key={i} className="flex flex-col gap-1">
                {i > 0 && null}
                <span className="font-black text-[#00ff9f] leading-none" style={{ fontFamily: "'Orbitron', monospace", fontSize: 36 }}>{s.num}</span>
                <span className="text-[10px] text-[#4a5568] tracking-[0.15em]">{s.label}</span>
              </div>
            ))}
          </div>
          <div className="flex flex-wrap gap-3">
            <a href="#projects"
              className="bg-[rgba(0,255,159,0.1)] border border-[#00ff9f] text-[#00ff9f] px-6 py-3 text-sm font-bold tracking-widest transition-all hover:bg-[rgba(0,255,159,0.2)] shadow-[0_0_20px_rgba(0,255,159,0.2)]"
              {...track("cta_click", { type: "view_projects", location: "hero" })}>[ VIEW_PROJECTS ]</a>
            <a href="#contact"
              className="border border-[rgba(0,255,159,0.15)] text-[#64748b] px-6 py-3 text-sm font-semibold tracking-widest hover:text-[#00ff9f] hover:border-[rgba(0,255,159,0.4)] transition-all"
              {...track("cta_click", { type: "contact_me", location: "hero" })}>[ CONTACT_ME ]</a>
          </div>
        </div>
      </section>

      {/* SKILLS */}
      {skills.length > 0 && (
        <section id="skills" className="px-6 md:px-16 py-16 border-b border-[rgba(0,255,159,0.15)]">
          <CyberHeader cmd="$ cat skills.json" />
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
            {skills.map((skill, i) => (
              <div key={skill.id}
                className="bg-[#0d1117] border border-[rgba(0,255,159,0.15)] p-5 transition-all hover:border-[rgba(0,255,159,0.4)] hover:shadow-[0_0_20px_rgba(0,255,159,0.1)]"
                {...track("skill_view", { skill_name: skill.name, skill_percentage: skill.percentage })}>
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-xs text-[#2d3748] font-bold">0x{String(i + 1).padStart(2, "0")}</span>
                  <span className="text-base">{skill.icon}</span>
                  <span className="flex-1 text-[#e6edf3] text-sm font-semibold">{skill.name}</span>
                  <span className="text-[#00ff9f] font-bold text-sm">{skill.percentage}%</span>
                </div>
                <div className="h-[3px] bg-[rgba(255,255,255,0.06)] relative mb-2.5">
                  <div className="skill-fill-cyber h-full bg-[#00ff9f]" style={{ width: `${skill.percentage}%` }} />
                </div>
                {skill.description && <p className="text-xs text-[#4a5568] leading-relaxed">{skill.description}</p>}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* PROJECTS */}
      {projects.length > 0 && (
        <section id="projects" className="px-6 md:px-16 py-16 border-b border-[rgba(0,255,159,0.15)]">
          <CyberHeader cmd="$ ls projects/ --verbose" />
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
            {projects.map((p, i) => (
              <div key={p.id}
                className="bg-[#0d1117] border border-[rgba(0,255,159,0.15)] p-7 transition-all hover:border-[rgba(0,255,159,0.4)] hover:shadow-[0_0_20px_rgba(0,255,159,0.1)]"
                {...track("project_view", { project_name: p.title, project_index: i + 1 })}>
                <div className="flex justify-between mb-3">
                  <span className="text-[11px] text-[#2d3748] tracking-widest">PROJECT_{String(i + 1).padStart(3, "0")}</span>
                  <span className="text-[11px] text-[#00ff9f]">● DEPLOYED</span>
                </div>
                <h3 className="font-bold text-[#e6edf3] mb-2.5" style={{ fontFamily: "'Orbitron', monospace", fontSize: 18 }}>{p.title}</h3>
                <p className="text-xs text-[#8b949e] leading-[1.7] mb-4">{p.description}</p>
                {p.techstack?.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-4">
                    {p.techstack.map((t, j) => (
                      <span key={j} className="border border-[rgba(0,255,159,0.15)] text-[#4a5568] px-2.5 py-1 text-[11px]">{t}</span>
                    ))}
                  </div>
                )}
                <div className="flex gap-3">
                  {p.github_link && (
                    <a href={p.github_link} target="_blank"
                      className="border border-[rgba(0,255,159,0.15)] text-[#64748b] px-3.5 py-1.5 text-xs font-semibold tracking-widest hover:text-[#00ff9f] hover:border-[#00ff9f] transition-all"
                      {...track("project_link_click", { project_name: p.title, link_type: "github" })}>[ GITHUB ]</a>
                  )}
                  {p.live_link && (
                    <a href={p.live_link} target="_blank"
                      className="border border-[#00ff9f] text-[#00ff9f] px-3.5 py-1.5 text-xs font-bold tracking-widest transition-all hover:bg-[rgba(0,255,159,0.2)] shadow-[0_0_20px_rgba(0,255,159,0.15)]"
                      {...track("project_link_click", { project_name: p.title, link_type: "live" })}>[ LIVE ]</a>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* EXPERIENCE */}
      {experiences.length > 0 && (
        <section id="experience" className="px-6 md:px-16 py-16 border-b border-[rgba(0,255,159,0.15)]">
          <CyberHeader cmd="$ history --experience" />
          <div className="flex flex-col gap-4">
            {experiences.map((exp, i) => (
              <div key={exp.id}
                className="bg-[#0d1117] border border-[rgba(0,255,159,0.15)] p-6 flex gap-5 transition-all hover:border-[rgba(0,255,159,0.4)]"
                {...track("experience_view", { company: exp.company, role: exp.role })}>
                <span className="text-[#2d3748] text-sm font-bold pt-0.5 flex-shrink-0">[{String(i + 1).padStart(2, "0")}]</span>
                <div className="flex-1">
                  <div className="flex flex-wrap justify-between items-start gap-3 mb-2.5">
                    <div>
                      <div className="font-bold text-[#e6edf3]" style={{ fontFamily: "'Orbitron', monospace", fontSize: 16 }}>{exp.role}</div>
                      <div className="text-[#00cfff] text-sm font-semibold mt-1">{exp.company}</div>
                    </div>
                    <div className="text-xs text-[#2d3748]">{formatDate(exp.start_date)} → {exp.is_current === "true" ? "NOW" : formatDate(exp.end_date)}</div>
                  </div>
                  {exp.description && <p className="text-xs text-[#8b949e] leading-[1.6] mb-2.5">{exp.description}</p>}
                  {exp.points?.length > 0 && (
                    <ul className="flex flex-col gap-1.5">
                      {exp.points.map((pt, j) => <li key={j} className="flex gap-2 text-xs text-[#8b949e] leading-relaxed"><span className="text-[#00ff9f] text-xs mt-0.5 flex-shrink-0">▸</span>{pt}</li>)}
                    </ul>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* BLOG */}
      {blogs.length > 0 && (
        <section id="blog" className="px-6 md:px-16 py-16 border-b border-[rgba(0,255,159,0.15)]">
          <CyberHeader cmd="$ cat logs/blog.md" />
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
            {blogs.map((blog) => (
              <div key={blog.id}
                className="bg-[#0d1117] border border-[rgba(0,255,159,0.15)] p-6 transition-all hover:border-[rgba(0,255,159,0.4)]"
                {...track("blog_view", { blog_title: blog.title, category: blog.category || "General" })}>
                <div className="text-[10px] text-[#00cfff] tracking-[0.15em] uppercase mb-2.5">{blog.category || "GENERAL"}</div>
                <h3 className="text-[#e6edf3] font-bold text-base mb-2.5 leading-snug">{blog.title}</h3>
                <p className="text-xs text-[#8b949e] leading-[1.6] mb-3.5">{truncate(blog.excerpt, 120)}</p>
                <div className="text-[11px] text-[#2d3748] italic">// {formatDate(blog.publish_date)}</div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* TESTIMONIALS */}
      {testimonials.length > 0 && (
        <section className="px-6 md:px-16 py-16 border-b border-[rgba(0,255,159,0.15)]">
          <CyberHeader cmd='$ grep -r "reviews"' />
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
            {testimonials.map((t) => (
              <div key={t.id}
                className="bg-[#0d1117] border border-[rgba(0,255,159,0.15)] p-6 transition-all hover:border-[rgba(0,255,159,0.4)]"
                {...track("testimonial_view", { name: t.name, company: t.company, rating: t.rating })}>
                <div className="flex gap-1 mb-3">{Array.from({ length: t.rating }).map((_, i) => <span key={i} className="text-[#f59e0b] text-sm">★</span>)}</div>
                <p className="text-xs text-[#8b949e] leading-[1.7] italic mb-4">/* {t.review} */</p>
                <div className="text-xs">
                  <span className="text-[#00ff9f] font-semibold">{t.name}</span>
                  <span className="text-[#4a5568]"> // {t.role}@{t.company}</span>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* CONTACT */}
      <section id="contact" className="px-6 md:px-16 py-16">
        <CyberHeader cmd={`$ ssh contact@${profile?.name?.toLowerCase().replace(" ", "") || "dev"}.io`} />
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.5fr] gap-16">
          <div>
            <p className="text-sm text-[#4a5568] leading-[1.8] mb-8">Establishing secure connection...<br />Connection ready. Awaiting input.</p>
            {profile.email && (
              <div className="flex gap-3 mb-4 items-center">
                <span className="text-[11px] text-[#2d3748] tracking-widest min-w-[80px]">EMAIL:</span>
                <a href={`mailto:${profile.email}`} className="text-[#00ff9f] text-sm hover:text-[#7fffd4]"
                  {...track("contact_info_click", { type: "email" })}>{profile.email}</a>
              </div>
            )}
            {profile.location && (
              <div className="flex gap-3 mb-4 items-center">
                <span className="text-[11px] text-[#2d3748] tracking-widest min-w-[80px]">LOCATION:</span>
                <span className="text-[#00ff9f] text-sm">{profile.location}</span>
              </div>
            )}
            {socialLinks.length > 0 && (
              <div className="flex flex-wrap gap-3 mt-8">
                {socialLinks.map((link) => (
                  <a key={link.id} href={link.url} target="_blank" rel="noopener noreferrer"
                    className="border border-[rgba(0,255,159,0.15)] text-[#4a5568] px-3.5 py-1.5 text-[11px] tracking-widest hover:text-[#00ff9f] hover:border-[#00ff9f] transition-all"
                    {...track("social_click", { platform: link.platform, location: "contact_section" })}>
                    {link.platform.toUpperCase()}
                  </a>
                ))}
              </div>
            )}
          </div>
          <form onSubmit={handleContact} className="flex flex-col gap-4">
            {[
              { prefix: "name>", ph: "your_name", field: "name", type: "text", required: true },
              { prefix: "email>", ph: "your@email.io", field: "email", type: "email", required: true },
              { prefix: "subject>", ph: "project_inquiry", field: "subject", type: "text", required: false },
            ].map(({ prefix, ph, field, type, required }) => (
              <div key={field} className="flex items-center gap-3">
                <span className="text-[#00ff9f] text-sm min-w-[70px] flex-shrink-0">{prefix}</span>
                <input {...(required ? { required: true } : {})} type={type} placeholder={ph} value={contactForm[field]}
                  onChange={(e) => setContactForm({ ...contactForm, [field]: e.target.value })}
                  className="flex-1 bg-[rgba(0,255,159,0.03)] border border-[rgba(0,255,159,0.15)] px-3.5 py-3 text-[#e6edf3] text-sm focus:outline-none focus:border-[#00ff9f] focus:shadow-[0_0_12px_rgba(0,255,159,0.3)]" />
              </div>
            ))}
            <div className="flex items-start gap-3">
              <span className="text-[#00ff9f] text-sm min-w-[70px] flex-shrink-0 pt-3">msg</span>
              <textarea required placeholder="write your message here..." value={contactForm.message}
                onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })}
                className="flex-1 bg-[rgba(0,255,159,0.03)] border border-[rgba(0,255,159,0.15)] px-3.5 py-3 text-[#e6edf3] text-sm focus:outline-none focus:border-[#00ff9f] focus:shadow-[0_0_12px_rgba(0,255,159,0.3)] min-h-[100px] resize-y" />
            </div>
            <button type="submit" disabled={sending}
              className="bg-[rgba(0,255,159,0.1)] border border-[#00ff9f] text-[#00ff9f] px-7 py-3.5 text-sm font-bold tracking-widest self-start transition-all hover:bg-[rgba(0,255,159,0.2)] shadow-[0_0_20px_rgba(0,255,159,0.15)] disabled:opacity-60"
              {...track("form_submit_click", { form: "contact" })}>
              {sending ? "[ TRANSMITTING... ]" : "[ SEND_MESSAGE ]"}
            </button>
          </form>
        </div>
      </section>

      <footer className="border-t border-[rgba(0,255,159,0.15)] px-6 md:px-16 py-7 text-center">
        <span className="text-xs text-[#2d3748]">// © {new Date().getFullYear()} {profile?.name || "Portfolio"} — All systems nominal</span>
      </footer>
    </div>
  );
}

function CyberHeader({ cmd }) {
  return (
    <div className="flex items-center gap-6 mb-10">
      <span className="text-[#00cfff] text-sm font-medium whitespace-nowrap">{cmd}</span>
      <div className="flex-1 h-px bg-[rgba(0,255,159,0.15)]" />
    </div>
  );
}