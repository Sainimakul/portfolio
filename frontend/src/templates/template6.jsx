"use client";

import { usePortfolio } from "../../context/PortfolioContext";
import { sendContactMessage } from "../../service/api";
import { useState } from "react";
import { success, error } from "@/util/toast";

function formatDate(d) {
  if (!d) return "";
  return new Date(d).toLocaleDateString("en-US", { year: "numeric", month: "short" });
}
function truncate(str, n) {
  return str?.length > n ? str.substring(0, n - 1) + "…" : str;
}

const track = (eventType, metadata = {}) => ({
  "data-track": JSON.stringify({ event_type: eventType, page: typeof window !== "undefined" ? window.location.pathname : "/", metadata }),
});

const COLORS = ["#ffd600", "#ff4db8", "#2b57ff", "#00c471", "#ff8c42", "#c77dff"];

export default function Template6() {
  const { portfolioData, loading } = usePortfolio();
  const [contactForm, setContactForm] = useState({ name: "", email: "", subject: "", message: "" });
  const [sending, setSending] = useState(false);

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
      success("Message sent!");
      setContactForm({ name: "", email: "", subject: "", message: "" });
    } catch (err) { error(err.message); }
    finally { setSending(false); }
  }

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center text-[#111] text-3xl" style={{ background: "#ffd600", fontFamily: "'Archivo Black', sans-serif" }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Archivo+Black&display=swap')`}</style>
      LOADING ★
    </div>
  );

  return (
    <div className="min-h-screen text-[#111]" style={{ fontFamily: "'Space Grotesk', sans-serif", background: "#fffff0" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Archivo+Black&family=Space+Grotesk:wght@300;400;500;600;700&display=swap');
        @keyframes marquee{from{transform:translateX(0)}to{transform:translateX(-50%)}}
        @keyframes spinSlow{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}
        @keyframes bounce{0%,100%{transform:translateY(0) rotate(0)}50%{transform:translateY(-12px) rotate(5deg)}}
        @keyframes wiggle{0%,100%{transform:rotate(-3deg)}50%{transform:rotate(3deg)}}
        @keyframes fillRetro{from{width:0!important}}
        .marquee-scroll{animation:marquee 30s linear infinite;display:inline-flex}
        .spin-slow{animation:spinSlow 20s linear infinite;display:inline-block}
        .bounce-deco{animation:bounce 3s ease-in-out infinite;display:inline-block}
        .wiggle-deco{animation:wiggle 2s ease-in-out infinite;display:inline-block}
        .skill-bar-retro{animation:fillRetro 1.4s cubic-bezier(0.4,0,0.2,1) both}
        ::-webkit-scrollbar{width:4px;background:#fffff0}
        ::-webkit-scrollbar-thumb{background:#111}
      `}</style>

      {/* NAV */}
      <nav className="sticky top-0 z-50 flex justify-between items-center px-6 md:px-16 py-5 border-b-4 border-[#111]" style={{ background: "#111" }}>
        <div className="flex items-center gap-2.5">
          <span className="text-[#ffd600] text-xl" style={{ fontFamily: "'Archivo Black', sans-serif" }}>★</span>
          <span className="text-white text-xl tracking-tight" style={{ fontFamily: "'Archivo Black', sans-serif" }}>
            {profile?.name?.split(" ")[0] || "DEV"}
          </span>
        </div>
        <div className="hidden md:flex gap-8">
          {["Skills", "Projects", "Blog", "Contact"].map((n) => (
            <a key={n} href={`#${n.toLowerCase()}`}
              className="text-[#aaa] text-sm tracking-wide hover:text-[#ffd600] transition-colors"
              style={{ fontFamily: "'Archivo Black', sans-serif" }}
              {...track("nav_click", { section: n.toLowerCase() })}>
              {n}
            </a>
          ))}
        </div>
        <div className="text-[#00c471] text-xs font-bold tracking-widest">● OPEN TO WORK</div>
      </nav>

      {/* HERO */}
      <section className="relative flex flex-wrap justify-between items-center px-6 md:px-20 py-24 min-h-[90vh] border-b-4 border-[#111] overflow-hidden gap-12">
        {/* Deco shapes */}
        <span className="spin-slow absolute top-10 left-[8%] text-[#ff4db8] text-7xl opacity-40 pointer-events-none">●</span>
        <span className="bounce-deco absolute top-[30%] right-[5%] text-[#2b57ff] text-5xl opacity-50 pointer-events-none">■</span>
        <span className="wiggle-deco absolute bottom-[20%] left-[15%] text-[#00c471] text-4xl opacity-40 pointer-events-none">▲</span>

        <div className="max-w-[580px] relative z-10">
          <div className="inline-block bg-[#ffd600] border-[3px] border-[#111] px-4 py-1.5 text-sm font-bold mb-6"
            style={{ boxShadow: "4px 4px 0 #111" }}>
            👋 Hey, I'm available for work!
          </div>
          <h1 className="leading-[0.92] mb-4 text-[#111]" style={{ fontFamily: "'Archivo Black', sans-serif", fontSize: "clamp(52px,7vw,96px)", letterSpacing: "-2px" }}>
            {profile?.name || "Your Name"}
          </h1>
          <div className="h-2.5 w-4/5 bg-[#ff4db8] mb-5" style={{ boxShadow: "4px 4px 0 #111" }} />
          <p className="text-xl text-[#2b57ff] mb-4 font-bold" style={{ fontFamily: "'Archivo Black', sans-serif" }}>{profile?.title || "Full Stack Developer"}</p>
          <p className="text-base text-[#444] leading-[1.7] mb-9 max-w-[420px]">{profile?.bio || "Building bold, beautiful digital experiences."}</p>
          <div className="flex flex-wrap gap-4">
            <a href="#projects"
              className="bg-[#111] text-white px-8 py-4 font-bold text-sm tracking-wide border-[3px] border-[#111] transition-all hover:-translate-x-1 hover:-translate-y-1 hover:shadow-[5px_5px_0_#111]"
              style={{ fontFamily: "'Archivo Black', sans-serif", boxShadow: "5px 5px 0 #111" }}
              {...track("cta_click", { type: "see_work", location: "hero" })}>SEE MY WORK ↓</a>
            <a href="#contact"
              className="bg-[#ffd600] text-[#111] px-8 py-4 font-bold text-sm tracking-wide border-[3px] border-[#111] transition-all hover:-translate-x-1 hover:-translate-y-1"
              style={{ fontFamily: "'Archivo Black', sans-serif", boxShadow: "5px 5px 0 #111" }}
              {...track("cta_click", { type: "lets_talk", location: "hero" })}>LET'S TALK →</a>
          </div>
        </div>

        <div className="flex flex-col gap-5 relative z-10">
          {[
            { label: "Projects", value: projects.length, color: "#ff4db8", shape: "▲" },
            { label: "Skills", value: skills.length, color: "#2b57ff", shape: "●" },
            { label: "Roles", value: experiences.length, color: "#00c471", shape: "■" },
          ].map((card, i) => (
            <div key={i}
              className="border-[3px] border-[#111] p-5 flex flex-col items-center gap-1 min-w-[140px] transition-transform hover:scale-105"
              style={{ background: card.color, transform: `rotate(${[-2, 1, -1][i]}deg)`, boxShadow: "6px 6px 0 #111" }}
              {...track("stat_view", { stat_label: card.label, stat_value: card.value })}>
              <span className="text-2xl font-black text-[#111]" style={{ fontFamily: "'Archivo Black', sans-serif" }}>{card.shape}</span>
              <span className="text-5xl leading-none font-black text-[#111]" style={{ fontFamily: "'Archivo Black', sans-serif" }}>{card.value}</span>
              <span className="text-xs font-bold tracking-widest uppercase text-[#111]">{card.label}</span>
            </div>
          ))}
        </div>
      </section>

      {/* MARQUEE */}
      <div className="border-y-[3px] border-[#111] py-3 overflow-hidden bg-[#ffd600]">
        <div className="marquee-scroll">
          {Array.from({ length: 4 }).map((_, i) => (
            <span key={i} className="text-sm tracking-widest mr-10" style={{ fontFamily: "'Archivo Black', sans-serif" }}>
              AVAILABLE FOR WORK &nbsp;★&nbsp; FULL STACK &nbsp;●&nbsp; OPEN SOURCE &nbsp;■&nbsp; CREATIVE CODER &nbsp;▲&nbsp; LET'S BUILD &nbsp;★&nbsp;&nbsp;&nbsp;
            </span>
          ))}
        </div>
      </div>

      {/* SKILLS */}
      {skills.length > 0 && (
        <section id="skills" className="px-6 md:px-16 py-20">
          <RetroHeader color="#ffd600" shape="▲" title="SKILLS" />
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
            {skills.map((skill, i) => {
              const bg = COLORS[i % COLORS.length];
              return (
                <div key={skill.id}
                  className="border-[3px] bg-white overflow-hidden transition-all hover:-translate-x-1 hover:-translate-y-1"
                  style={{ borderColor: bg, boxShadow: `5px 5px 0 #111` }}
                  {...track("skill_view", { skill_name: skill.name, skill_percentage: skill.percentage })}>
                  <div className="flex items-center gap-2.5 px-4 py-3.5" style={{ background: bg }}>
                    <span className="text-xl">{skill.icon}</span>
                    <span className="flex-1 font-bold text-sm text-[#111]">{skill.name}</span>
                    <span className="font-black text-xl text-[#111]" style={{ fontFamily: "'Archivo Black', sans-serif" }}>{skill.percentage}%</span>
                  </div>
                  <div className="mx-4 my-3 h-2.5 bg-[#eee] border-2 border-[#111] overflow-hidden">
                    <div className="skill-bar-retro h-full" style={{ width: `${skill.percentage}%`, background: bg }} />
                  </div>
                  {skill.description && <p className="px-4 pb-4 text-xs text-[#555] leading-relaxed">{skill.description}</p>}
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* PROJECTS */}
      {projects.length > 0 && (
        <section id="projects" className="px-6 md:px-16 py-20 bg-[#111]">
          <RetroHeader color="#ff4db8" shape="●" title="PROJECTS" titleClass="text-white" />
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {projects.map((p, i) => {
              const accent = COLORS[i % COLORS.length];
              return (
                <div key={p.id}
                  className="bg-[#1a1a1a] border-[3px] border-[rgba(255,255,255,0.15)] p-7 transition-all hover:-translate-x-1 hover:-translate-y-1"
                  style={{ borderTop: `6px solid ${accent}`, boxShadow: "6px 6px 0 rgba(255,255,255,0.1)" }}
                  {...track("project_view", { project_name: p.title, project_index: i + 1 })}>
                  <div className="inline-block px-3 py-1 mb-3.5 font-black text-xs text-[#111]" style={{ background: accent, fontFamily: "'Archivo Black', sans-serif" }}>
                    #{String(i + 1).padStart(2, "0")}
                  </div>
                  <h3 className="text-white mb-2.5 tracking-tight" style={{ fontFamily: "'Archivo Black', sans-serif", fontSize: 22 }}>{p.title}</h3>
                  <p className="text-[#aaa] text-sm leading-[1.6] mb-4">{truncate(p.description, 100)}</p>
                  {p.techstack?.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-4">
                      {p.techstack.map((t, j) => (
                        <span key={j} className="px-2.5 py-1 text-[11px] font-bold text-[#111]" style={{ background: accent }}>{t}</span>
                      ))}
                    </div>
                  )}
                  <div className="flex gap-3">
                    {p.github_link && (
                      <a href={p.github_link} target="_blank"
                        className="px-4 py-2 text-xs font-bold text-[#111] border-2 border-[rgba(255,255,255,0.2)] tracking-widest transition-all hover:-translate-x-0.5 hover:-translate-y-0.5"
                        style={{ background: accent, fontFamily: "'Archivo Black', sans-serif" }}
                        {...track("project_link_click", { project_name: p.title, link_type: "github" })}>GITHUB ↗</a>
                    )}
                    {p.live_link && (
                      <a href={p.live_link} target="_blank"
                        className="px-4 py-2 text-xs font-bold text-[#111] border-2 border-[rgba(255,255,255,0.2)] tracking-widest bg-white transition-all hover:-translate-x-0.5 hover:-translate-y-0.5"
                        style={{ fontFamily: "'Archivo Black', sans-serif" }}
                        {...track("project_link_click", { project_name: p.title, link_type: "live" })}>LIVE ↗</a>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* EXPERIENCE */}
      {experiences.length > 0 && (
        <section id="experience" className="px-6 md:px-16 py-20">
          <RetroHeader color="#2b57ff" shape="◆" title="CAREER" />
          <div className="flex flex-col gap-5">
            {experiences.map((exp, i) => (
              <div key={exp.id}
                className="bg-white border-[3px] border-[#111] p-7 transition-transform hover:translate-x-1"
                style={{ borderLeft: `8px solid ${[COLORS[1], COLORS[2], COLORS[0], COLORS[3]][i % 4]}`, boxShadow: "6px 6px 0 #111" }}
                {...track("experience_view", { company: exp.company, role: exp.role })}>
                <div className="flex flex-wrap justify-between items-start gap-3 mb-3">
                  <div>
                    <h3 className="text-xl tracking-tight mb-1" style={{ fontFamily: "'Archivo Black', sans-serif" }}>{exp.role}</h3>
                    <div className="text-[#2b57ff] text-sm font-bold">{exp.company}</div>
                  </div>
                  <div className="text-xs text-[#888] font-bold tracking-wider">
                    {formatDate(exp.start_date)} – {exp.is_current === "true" ? "NOW" : formatDate(exp.end_date)}
                  </div>
                </div>
                {exp.description && <p className="text-sm text-[#555] leading-[1.7] mb-3">{exp.description}</p>}
                {exp.points?.length > 0 && (
                  <ul className="list-disc list-inside">
                    {exp.points.map((pt, j) => <li key={j} className="text-sm text-[#555] mb-1.5 leading-relaxed">{pt}</li>)}
                  </ul>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* BLOG */}
      {blogs.length > 0 && (
        <section id="blog" className="px-6 md:px-16 py-20 bg-[#fdf9ff]">
          <RetroHeader color="#00c471" shape="■" title="BLOG" />
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
            {blogs.map((blog, i) => (
              <div key={blog.id}
                className="bg-white border-[3px] border-[#111] p-7 transition-all hover:-translate-y-1"
                style={{ borderBottom: `5px solid ${COLORS[i % 3]}`, boxShadow: "6px 6px 0 #111" }}
                {...track("blog_view", { blog_title: blog.title, category: blog.category || "General" })}>
                <span className="inline-block px-2.5 py-1 text-white text-[11px] font-bold tracking-widest mb-3.5" style={{ background: COLORS[i % 3] }}>
                  {blog.category || "GENERAL"}
                </span>
                <h3 className="mb-2.5 leading-tight" style={{ fontFamily: "'Archivo Black', sans-serif", fontSize: 20 }}>{blog.title}</h3>
                <p className="text-sm text-[#555] leading-[1.6] mb-4">{truncate(blog.excerpt, 120)}</p>
                <span className="text-xs text-[#999] font-semibold">{formatDate(blog.publish_date)}</span>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* TESTIMONIALS */}
      {testimonials.length > 0 && (
        <section className="px-6 md:px-16 py-20 bg-[#ffd600]">
          <RetroHeader color="#111" shape="★" title="REVIEWS" titleClass="text-[#ffd600]" />
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
            {testimonials.map((t, i) => (
              <div key={t.id}
                className="border-[3px] border-[#111] p-7 transition-transform hover:rotate-[-1deg] hover:scale-[1.02]"
                style={{ background: [COLORS[1], COLORS[2], COLORS[3]][i % 3], boxShadow: "6px 6px 0 #111" }}
                {...track("testimonial_view", { name: t.name, company: t.company, rating: t.rating })}>
                <div className="text-xl text-[#111] mb-3 font-black">{Array.from({ length: t.rating }).map(() => "★").join("")}</div>
                <p className="text-sm text-[#111] leading-[1.7] italic mb-4">"{t.review}"</p>
                <div className="text-sm font-bold text-[#111]">— {t.name} | {t.role} @ {t.company}</div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* CONTACT */}
      <section id="contact" className="px-6 md:px-16 py-20 bg-[#2b57ff]">
        <RetroHeader color="#ffd600" shape="✦" title="CONTACT" />
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.2fr] gap-16">
          <div>
            <h2 className="leading-none mb-8 text-white" style={{ fontFamily: "'Archivo Black', sans-serif", fontSize: "clamp(36px,4vw,60px)" }}>
              Let's Make<br />Something<br /><em className="italic font-normal">Awesome!</em>
            </h2>
            {profile.email && (
              <div className="mb-3">
                <span className="text-[#ffd600] text-sm font-bold tracking-widest mr-2">EMAIL:</span>
                <a href={`mailto:${profile.email}`} className="text-white text-sm hover:text-[#ffd600] transition-colors"
                  {...track("contact_info_click", { type: "email" })}>{profile.email}</a>
              </div>
            )}
            {profile.mobile && (
              <div className="mb-3">
                <span className="text-[#ffd600] text-sm font-bold tracking-widest mr-2">MOBILE:</span>
                <a href={`https://wa.me/${profile.mobile}`} className="text-white text-sm hover:text-[#ffd600] transition-colors"
                  {...track("contact_info_click", { type: "mobile" })}>{profile.mobile}</a>
              </div>
            )}
            {profile.location && (
              <div className="mb-8">
                <span className="text-[#ffd600] text-sm font-bold tracking-widest mr-2">LOCATION:</span>
                <span className="text-[#ddd] text-sm">{profile.location}</span>
              </div>
            )}
            {socialLinks.length > 0 && (
              <div className="flex flex-wrap gap-3">
                {socialLinks.map((link) => (
                  <a key={link.id} href={link.url} target="_blank" rel="noopener noreferrer"
                    className="bg-[#ffd600] text-[#111] border-[3px] border-[#111] px-4 py-2 font-black text-xs tracking-wide transition-all hover:-translate-x-0.5 hover:-translate-y-0.5"
                    style={{ fontFamily: "'Archivo Black', sans-serif", boxShadow: "4px 4px 0 #111" }}
                    {...track("social_click", { platform: link.platform, location: "contact_section" })}>
                    {link.platform.toUpperCase()}
                  </a>
                ))}
              </div>
            )}
          </div>
          <form onSubmit={handleContact} className="flex flex-col gap-4">
            {[
              { ph: "YOUR NAME *", field: "name", required: true },
              { ph: "YOUR EMAIL *", field: "email", type: "email", required: true },
              { ph: "SUBJECT", field: "subject", required: false },
            ].map(({ ph, field, type = "text", required }) => (
              <input key={field} {...(required ? { required: true } : {})} type={type} placeholder={ph} value={contactForm[field]}
                onChange={(e) => setContactForm({ ...contactForm, [field]: e.target.value })}
                className="border-[3px] border-white bg-[rgba(255,255,255,0.1)] px-4 py-3.5 text-white font-semibold text-sm tracking-wide placeholder-[rgba(255,255,255,0.5)] focus:outline-none focus:shadow-[4px_4px_0_#ffd600]" />
            ))}
            <textarea required placeholder="YOUR MESSAGE *" value={contactForm.message}
              onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })}
              className="border-[3px] border-white bg-[rgba(255,255,255,0.1)] px-4 py-3.5 text-white font-semibold text-sm tracking-wide placeholder-[rgba(255,255,255,0.5)] focus:outline-none focus:shadow-[4px_4px_0_#ffd600] min-h-[120px] resize-y" />
            <button type="submit" disabled={sending}
              className="bg-[#ffd600] text-[#111] border-[3px] border-white px-8 py-4 font-black text-base tracking-wide self-start transition-all hover:-translate-x-1 hover:-translate-y-1 disabled:opacity-60"
              style={{ fontFamily: "'Archivo Black', sans-serif", boxShadow: "5px 5px 0 rgba(255,255,255,0.4)" }}
              {...track("form_submit_click", { form: "contact" })}>
              {sending ? "SENDING... ●" : "SEND MESSAGE ★"}
            </button>
          </form>
        </div>
      </section>

      <footer className="bg-[#111] border-t-4 border-[#ffd600] px-6 md:px-16 py-7">
        <div className="flex flex-wrap justify-between items-center gap-4">
          <span className="text-[#ffd600] text-base tracking-[4px]" style={{ fontFamily: "'Archivo Black', sans-serif" }}>★ ● ■ ▲</span>
          <span className="text-xs text-[#666]">© {new Date().getFullYear()} {profile?.name || "Portfolio"} — Made with energy ☕</span>
          <div className="flex gap-5">
            {socialLinks.map((link) => (
              <a key={link.id} href={link.url} target="_blank" rel="noopener noreferrer"
                className="text-xs text-[#555] font-semibold hover:text-[#ffd600] transition-colors"
                {...track("social_click", { platform: link.platform, location: "footer" })}>
                {link.platform}
              </a>
            ))}
          </div>
        </div>
      </footer>
    </div>
  );
}

function RetroHeader({ color, shape, title, titleClass = "" }) {
  return (
    <div className="mb-12">
      <div className="inline-flex items-center gap-3 border-[3px] border-[#111] px-6 py-2.5" style={{ background: color, boxShadow: "5px 5px 0 #111" }}>
        <span className="text-xl font-black text-[#111]" style={{ fontFamily: "'Archivo Black', sans-serif" }}>{shape}</span>
        <h2 className={`text-2xl tracking-tight ${titleClass || "text-[#111]"}`} style={{ fontFamily: "'Archivo Black', sans-serif" }}>{title}</h2>
      </div>
    </div>
  );
}