"use client";

import { usePortfolio } from "../../context/PortfolioContext";
import { sendContactMessage } from "../../service/api";
import { useState, useEffect } from "react";
import { success, error } from "../util/toast";

function formatDate(d) {
  if (!d) return "";
  return new Date(d).toLocaleDateString("en-US", { year: "numeric", month: "long" });
}
function truncate(str, n) {
  return str?.length > n ? str.substring(0, n - 1) + "…" : str;
}

const track = (eventType, metadata = {}) => ({
  "data-track": JSON.stringify({ event_type: eventType, page: typeof window !== "undefined" ? window.location.pathname : "/", metadata }),
});

export default function Template5() {
  const { portfolioData, loading } = usePortfolio();
  const [contactForm, setContactForm] = useState({ name: "", email: "", subject: "", message: "" });
  const [sending, setSending] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [hoveredProject, setHoveredProject] = useState(null);

  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", h);
    return () => window.removeEventListener("scroll", h);
  }, []);

  const profile = portfolioData?.profile.data || {};
  const skills = portfolioData?.skills.data || [];
  const projects = portfolioData?.projects.data || [];
  const blogs = portfolioData?.blogs.data || [];
  const testimonials = portfolioData?.testimonials.data || [];
  const socialLinks = portfolioData?.SocialLinks.data || [];
  const experiences = portfolioData?.experiences.data || [];

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
    <div className="min-h-screen flex items-center justify-center text-[#1a1a1a] tracking-[0.15em] text-xl" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@300;400;500&display=swap');`}</style>
      Loading
    </div>
  );

  return (
    <div className="min-h-screen bg-[#f9f5ef] text-[#1a1a1a] font-light" style={{ fontFamily: "'Montserrat', sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;1,300;1,400;1,500&family=Montserrat:wght@300;400;500;600;700&display=swap');
        @keyframes revealLine{from{width:0}}
        @keyframes fillLux{from{width:0!important}}
        .skill-fill-lux{animation:fillLux 1.5s cubic-bezier(0.4,0,0.2,1) both}
        .reveal-line{animation:revealLine 1s ease both}
        ::-webkit-scrollbar{width:3px;background:#f9f5ef}
        ::-webkit-scrollbar-thumb{background:#8b7355}
      `}</style>

      {/* NAV */}
      <nav className={`sticky top-0 z-50 flex justify-between items-center px-6 md:px-20 py-7 transition-all duration-500 ${scrolled ? "shadow-[0_1px_0_rgba(0,0,0,0.06)]" : ""}`}
        style={scrolled ? { background: "rgba(249,245,239,0.95)", backdropFilter: "blur(20px)" } : {}}>
        <div className="flex items-center gap-4">
          <span className="text-xl font-semibold tracking-[0.05em]" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
            {profile?.name?.split(" ")[0] || "Portfolio"}
          </span>
          <div className="w-px h-4 bg-[rgba(0,0,0,0.15)]" />
          <span className="text-xs text-[#888] tracking-[0.08em]">{profile?.title || "Developer"}</span>
        </div>
        <div className="hidden md:flex gap-9">
          {["Work", "Skills", "Experience", "Writing", "Contact"].map((n) => (
            <a key={n} href={`#${n.toLowerCase()}`}
              className="text-xs text-[#888] tracking-[0.08em] uppercase font-medium relative group transition-colors hover:text-[#1a1a1a]"
              {...track("nav_click", { section: n.toLowerCase() })}>
              {n}
              <span className="absolute -bottom-0.5 left-0 w-0 h-px bg-[#1a1a1a] group-hover:w-full transition-all duration-500" />
            </a>
          ))}
        </div>
      </nav>

      {/* HERO */}
      <section className="grid grid-cols-1 lg:grid-cols-[80px_1fr_1fr] gap-0 lg:gap-16 px-6 md:px-20 py-28 md:py-36 border-b border-[#e8e0d4] items-center">
        <div className="hidden lg:flex flex-col items-center gap-4">
          <span className="text-xs text-[#ccc] tracking-[0.15em]" style={{ fontFamily: "'Cormorant Garamond', serif", writingMode: "vertical-rl", transform: "rotate(180deg)" }}>001</span>
          <div className="w-px h-20 bg-[#e8e0d4]" />
        </div>
        <div>
          <p className="text-[11px] text-[#8b7355] tracking-[0.15em] uppercase font-medium mb-5">Available for select projects</p>
          <h1 className="leading-[0.9] mb-6 text-[#1a1a1a]" style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "clamp(56px,6vw,96px)", fontWeight: 400, letterSpacing: "-0.02em" }}>
            {profile?.name || "Your Name"}
          </h1>
          <div className="reveal-line h-0.5 w-16 bg-[#8b7355] mb-7" />
          <p className="text-base leading-[1.8] text-[#666] max-w-[440px] font-light">
            {profile?.bio || "Crafting exceptional digital experiences through thoughtful design and engineering."}
          </p>
        </div>
        <div className="flex flex-col gap-10 lg:items-end mt-10 lg:mt-0">
          <div className="flex gap-6 items-center">
            {[
              { num: projects.length, label: "Projects" },
              { num: experiences.length, label: "Roles" },
              { num: skills.length, label: "Skills" },
            ].map((s, i) => (
              <div key={i} className="flex flex-col items-center gap-1.5">
                {i > 0 && <div className="w-px h-10 bg-[#e8e0d4] absolute" />}
                <span className="leading-none font-semibold" style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 52 }}>{s.num}</span>
                <span className="text-[11px] text-[#999] tracking-[0.1em] uppercase">{s.label}</span>
              </div>
            ))}
          </div>
          <div className="flex flex-col gap-3 lg:items-end">
            <a href="#work"
              className="bg-[#1a1a1a] text-[#f9f5ef] px-8 py-3.5 text-xs font-semibold tracking-[0.12em] uppercase transition-all hover:bg-[#333]"
              {...track("cta_click", { type: "selected_work", location: "hero" })}>Selected Work ↓</a>
            <a href="#contact"
              className="text-xs text-[#999] tracking-[0.1em] hover:text-[#1a1a1a] transition-colors"
              {...track("cta_click", { type: "lets_talk", location: "hero" })}>Let's Talk →</a>
          </div>
        </div>
      </section>

      {/* WORK */}
      {projects.length > 0 && (
        <section id="work" className="px-6 md:px-20 py-24">
          <LuxHeader num="002" title="Selected Work" />
          <div className="flex flex-col">
            {projects.map((p, i) => (
              <div key={p.id}
                className={`grid grid-cols-1 md:grid-cols-[60px_1fr_2fr_1fr_120px] items-center gap-6 py-6 border-t border-[#e8e0d4] transition-all duration-300 cursor-default ${hoveredProject === i ? "bg-[#f3ede3] pl-4 md:pl-8" : "pl-0"}`}
                onMouseEnter={() => setHoveredProject(i)}
                onMouseLeave={() => setHoveredProject(null)}
                {...track("project_view", { project_name: p.title, project_index: i + 1 })}>
                <span className="text-[#ccc]" style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 16 }}>/{String(i + 1).padStart(2, "0")}</span>
                <h3 className="font-medium" style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 22 }}>{p.title}</h3>
                <p className="text-xs text-[#888] leading-relaxed hidden md:block">{truncate(p.description, 80)}</p>
                <div className="flex flex-wrap gap-2 hidden md:flex">
                  {p.techstack?.slice(0, 3).map((t, j) => (
                    <span key={j} className="text-[11px] text-[#8b7355] border border-[#d4c4a8] px-2.5 py-0.5 tracking-wide">{t}</span>
                  ))}
                </div>
                <div className="flex gap-4 justify-end">
                  {p.github_link && <a href={p.github_link} target="_blank" className="text-xs text-[#888] hover:text-[#1a1a1a] tracking-widest transition-colors" {...track("project_link_click", { project_name: p.title, link_type: "github" })}>GitHub</a>}
                  {p.live_link && <a href={p.live_link} target="_blank" className="text-xs text-[#888] hover:text-[#1a1a1a] tracking-widest transition-colors" {...track("project_link_click", { project_name: p.title, link_type: "live" })}>Live ↗</a>}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* SKILLS */}
      {skills.length > 0 && (
        <section id="skills" className="bg-[#f3ede3] px-6 md:px-20 py-24">
          <LuxHeader num="003" title="Expertise" />
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_2fr] gap-20">
            <p className="italic text-[#555] leading-[1.7] font-light" style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 22 }}>
              A thoughtfully assembled toolkit built over years of practical application and continuous learning.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {skills.map((skill, i) => (
                <div key={skill.id} {...track("skill_view", { skill_name: skill.name, skill_percentage: skill.percentage })}>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-base">{skill.icon}</span>
                    <span className="flex-1 text-sm font-medium tracking-[0.04em]">{skill.name}</span>
                    <span className="text-[#8b7355]" style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 20 }}>{skill.percentage}</span>
                  </div>
                  <div className="h-px bg-[#e8e0d4] overflow-hidden">
                    <div className="skill-fill-lux h-full bg-[#8b7355]" style={{ width: `${skill.percentage}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* EXPERIENCE */}
      {experiences.length > 0 && (
        <section id="experience" className="px-6 md:px-20 py-24">
          <LuxHeader num="004" title="Experience" />
          <div className="flex flex-col">
            {experiences.map((exp) => (
              <div key={exp.id} className="grid grid-cols-1 md:grid-cols-[200px_1fr] gap-12 py-10 border-b border-[#e8e0d4] group hover:border-[#1a1a1a] transition-colors duration-300"
                {...track("experience_view", { company: exp.company, role: exp.role })}>
                <div className="italic text-[#999] leading-[1.8] pl-6 text-sm" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                  {formatDate(exp.start_date)}<br />— {exp.is_current === "true" ? "Present" : formatDate(exp.end_date)}
                </div>
                <div>
                  <h3 className="mb-1 font-medium" style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 28 }}>{exp.role}</h3>
                  <div className="text-xs text-[#8b7355] font-medium tracking-[0.06em] uppercase mb-4">{exp.company}</div>
                  {exp.description && <p className="text-sm text-[#666] leading-[1.8] mb-4">{exp.description}</p>}
                  {exp.points?.length > 0 && (
                    <div className="flex flex-col gap-2">
                      {exp.points.map((pt, j) => <div key={j} className="flex gap-3 text-sm text-[#666] leading-relaxed"><span className="text-[#8b7355] flex-shrink-0">—</span>{pt}</div>)}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* BLOG */}
      {blogs.length > 0 && (
        <section id="writing" className="bg-[#f3ede3] px-6 md:px-20 py-24">
          <LuxHeader num="005" title="Writing" />
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-10">
            {blogs.map((blog) => (
              <div key={blog.id}
                className="bg-[#f9f5ef] p-9 transition-all hover:-translate-y-1"
                {...track("blog_view", { blog_title: blog.title, category: blog.category || "General" })}>
                <div className="flex justify-between items-center mb-4">
                  <span className="text-[11px] text-[#8b7355] tracking-[0.12em] uppercase font-medium">{blog.category || "Thoughts"}</span>
                  <span className="text-xs text-[#999] italic">{formatDate(blog.publish_date)}</span>
                </div>
                <h3 className="leading-tight mb-3.5 font-medium" style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 26 }}>{blog.title}</h3>
                <p className="text-sm text-[#666] leading-[1.8] mb-5">{truncate(blog.excerpt, 160)}</p>
                <span className="text-xs text-[#999] tracking-[0.06em]">Read more →</span>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* TESTIMONIALS */}
      {testimonials.length > 0 && (
        <section className="px-6 md:px-20 py-24">
          <LuxHeader num="006" title="Testimonials" />
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-10">
            {testimonials.map((t) => (
              <div key={t.id} className="border-t-2 border-[#8b7355] pt-6"
                {...track("testimonial_view", { name: t.name, company: t.company, rating: t.rating })}>
                <p className="italic leading-[1.7] text-[#444] mb-6" style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 18 }}>"{t.review}"</p>
                <div className="text-sm font-semibold tracking-[0.05em]">{t.name}</div>
                <div className="text-xs text-[#888] mb-2">{t.role}, {t.company}</div>
                <div className="text-[#8b7355] text-sm">{Array.from({ length: t.rating }).map(() => "★").join("")}</div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* CONTACT */}
      <section id="contact" className="bg-[#f3ede3] px-6 md:px-20 py-24">
        <LuxHeader num="007" title="Get in Touch" />
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.5fr] gap-20">
          <div>
            <h2 className="leading-tight mb-8 font-normal" style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 40 }}>
              Let's create something<br />remarkable together.
            </h2>
            {profile.email && (
              <a href={`mailto:${profile.email}`}
                className="block italic text-[#8b7355] text-xl mb-2 hover:text-[#1a1a1a] transition-colors"
                style={{ fontFamily: "'Cormorant Garamond', serif" }}
                {...track("contact_info_click", { type: "email" })}>
                {profile.email}
              </a>
            )}
            {profile.location && <p className="text-xs text-[#888] mb-8">{profile.location}</p>}
            {socialLinks.length > 0 && (
              <div className="flex flex-wrap gap-6">
                {socialLinks.map((link) => (
                  <a key={link.id} href={link.url} target="_blank" rel="noopener noreferrer"
                    className="text-xs text-[#888] uppercase tracking-[0.1em] hover:text-[#1a1a1a] transition-colors relative group"
                    {...track("social_click", { platform: link.platform, location: "contact_section" })}>
                    {link.platform}
                    <span className="absolute -bottom-0.5 left-0 w-0 h-px bg-[#1a1a1a] group-hover:w-full transition-all duration-500" />
                  </a>
                ))}
              </div>
            )}
          </div>
          <form onSubmit={handleContact} className="flex flex-col gap-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <LuxField label="Name">
                <input required value={contactForm.name} onChange={(e) => setContactForm({ ...contactForm, name: e.target.value })}
                  className="w-full bg-transparent border-b border-[#e8e0d4] py-3 text-[#1a1a1a] text-sm focus:outline-none focus:border-[#1a1a1a] transition-colors" />
              </LuxField>
              <LuxField label="Email">
                <input required type="email" value={contactForm.email} onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })}
                  className="w-full bg-transparent border-b border-[#e8e0d4] py-3 text-[#1a1a1a] text-sm focus:outline-none focus:border-[#1a1a1a] transition-colors" />
              </LuxField>
            </div>
            <LuxField label="Subject">
              <input value={contactForm.subject} onChange={(e) => setContactForm({ ...contactForm, subject: e.target.value })}
                className="w-full bg-transparent border-b border-[#e8e0d4] py-3 text-[#1a1a1a] text-sm focus:outline-none focus:border-[#1a1a1a] transition-colors" />
            </LuxField>
            <LuxField label="Message">
              <textarea required value={contactForm.message} onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })}
                className="w-full bg-transparent border-b border-[#e8e0d4] py-3 text-[#1a1a1a] text-sm focus:outline-none focus:border-[#1a1a1a] transition-colors min-h-[100px] resize-none" />
            </LuxField>
            <button type="submit" disabled={sending}
              className="bg-transparent border border-[#1a1a1a] text-[#1a1a1a] px-10 py-4 text-xs uppercase tracking-[0.15em] font-medium self-start transition-all hover:bg-[#1a1a1a] hover:text-[#f9f5ef] disabled:opacity-60"
              {...track("form_submit_click", { form: "contact" })}>
              {sending ? "Sending..." : "Send Message"}
            </button>
          </form>
        </div>
      </section>

      <footer className="px-6 md:px-20 py-8 border-t border-[#e8e0d4] flex justify-between">
        <span className="text-xs text-[#999] tracking-[0.06em]">© {new Date().getFullYear()} {profile?.name || "Portfolio"}</span>
        <span className="italic text-[#ccc]" style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 14 }}>Crafted with care</span>
      </footer>
    </div>
  );
}

function LuxHeader({ num, title }) {
  return (
    <div className="flex items-center gap-5 mb-16">
      <span className="text-sm text-[#ccc] tracking-[0.15em]" style={{ fontFamily: "'Cormorant Garamond', serif" }}>{num}</span>
      <h2 className="font-medium tracking-[-0.01em]" style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 36 }}>{title}</h2>
      <div className="flex-1 h-px bg-[#e8e0d4]" />
    </div>
  );
}

function LuxField({ label, children }) {
  return (
    <div className="flex flex-col gap-2">
      <label className="text-[11px] text-[#999] uppercase tracking-[0.12em] font-medium">{label}</label>
      {children}
    </div>
  );
}