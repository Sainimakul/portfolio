"use client";

import { error, success } from "@/util/toast";
import { usePortfolio } from "../../context/PortfolioContext";
import { sendContactMessage } from "../../service/api";
import { useState, useEffect } from "react";

function formatDate(d) { if (!d) return ""; return new Date(d).toLocaleDateString("en-US", { year: "numeric", month: "short" }); }
function truncate(str, n) { return str?.length > n ? str.substring(0, n - 1) + "…" : str; }

const SHAPES = ["●", "■", "▲", "◆", "★", "✦"];

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
    try { setSending(true); await sendContactMessage(contactForm); success("Message sent!"); setContactForm({ name: "", email: "", subject: "", message: "" }); }
    catch (err) { error(err.message); }
    finally { setSending(false); }
  }

  if (loading) return (
    <div style={{ minHeight: "100vh", background: YELLOW, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'Archivo Black', sans-serif", fontSize: 28 }}>
      LOADING ★
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Archivo+Black&display=swap')`}</style>
    </div>
  );

  const cards = [
    { label: "Projects", value: projects.length, color: PINK, shape: "▲" },
    { label: "Skills", value: skills.length, color: BLUE, shape: "●" },
    { label: "Roles", value: experiences.length, color: GREEN, shape: "■" },
  ];

  return (
    <div style={r.root}>
      <style>{css}</style>

      {/* NAV */}
      <nav style={r.nav}>
        <div style={r.navLogo}>
          <span style={r.navLogoShape}>★</span>
          <span style={r.navLogoText}>{profile?.name?.split(" ")[0] || "DEV"}</span>
        </div>
        <div style={r.navLinks}>
          {["Skills", "Projects", "Blog", "Contact"].map(n => (
            <a key={n} href={`#${n.toLowerCase()}`} style={r.navLink} className="retro-nav-link">{n}</a>
          ))}
        </div>
        <div style={r.navAvail}>● OPEN TO WORK</div>
      </nav>

      {/* HERO */}
      <section style={r.hero}>
        {/* Decorative shapes */}
        <div style={{ ...r.deco, top: 40, left: "8%", color: PINK, fontSize: 80, opacity: 0.4 }} className="spin-slow">●</div>
        <div style={{ ...r.deco, top: "30%", right: "5%", color: BLUE, fontSize: 60, opacity: 0.5 }} className="bounce-deco">■</div>
        <div style={{ ...r.deco, bottom: "20%", left: "15%", color: GREEN, fontSize: 48, opacity: 0.4 }} className="wiggle-deco">▲</div>

        <div style={r.heroContent}>
          <div style={r.heroChip}>👋 Hey, I'm available for work!</div>
          <h1 style={r.heroName}>{profile?.name || "Your Name"}</h1>
          <div style={r.heroUnderline} />
          <p style={r.heroRole}>{profile?.title || "Full Stack Developer"}</p>
          <p style={r.heroBio}>{profile?.bio || "Building bold, beautiful digital experiences."}</p>
          <div style={r.heroCTAs}>
            <a href="#projects" style={r.ctaFill} className="retro-btn-fill">SEE MY WORK ↓</a>
            <a href="#contact" style={r.ctaOutline} className="retro-btn-outline">LET'S TALK →</a>
          </div>
        </div>

        <div style={r.heroCards}>
          {cards.map((card, i) => (
            <div key={i} style={{ ...r.heroCard, background: card.color, transform: `rotate(${[-2, 1, -1][i]}deg)` }} className="hero-card-retro">
              <span style={r.heroCardShape}>{card.shape}</span>
              <span style={r.heroCardNum}>{card.value}</span>
              <span style={r.heroCardLabel}>{card.label}</span>
            </div>
          ))}
        </div>
      </section>

      {/* MARQUEE */}
      <div style={r.marqueeStrip}>
        <div style={r.marqueeInner} className="marquee-scroll">
          {Array.from({ length: 4 }).map((_, i) => (
            <span key={i} style={r.marqueeText}>
              {["AVAILABLE FOR WORK", "★", "FULL STACK", "●", "OPEN SOURCE", "■", "CREATIVE CODER", "▲", "LET'S BUILD", "★"].join("  ")} &nbsp;&nbsp;&nbsp;
            </span>
          ))}
        </div>
      </div>

      {/* SKILLS */}
      {skills.length > 0 && (
        <section id="skills" style={r.section}>
          <div style={r.sectionHeader}>
            <div style={{ ...r.sectionBox, background: YELLOW }}>
              <span style={r.sectionShape}>▲</span>
              <h2 style={r.sectionTitle}>SKILLS</h2>
            </div>
          </div>
          <div style={r.skillsGrid}>
            {skills.map((skill, i) => {
              const colors = [PINK, BLUE, GREEN, YELLOW, "#ff8c42", "#c77dff"];
              const bg = colors[i % colors.length];
              return (
                <div key={skill.id} style={{ ...r.skillCard, borderColor: bg }} className="retro-skill-card">
                  <div style={{ ...r.skillTop, background: bg }}>
                    <span style={r.skillEmoji}>{skill.icon}</span>
                    <span style={r.skillName}>{skill.name}</span>
                    <span style={r.skillNum}>{skill.percentage}%</span>
                  </div>
                  <div style={r.skillBarOuter}>
                    <div style={{ ...r.skillBarInner, width: `${skill.percentage}%`, background: bg }} className="skill-bar-retro" />
                  </div>
                  {skill.description && <p style={r.skillDesc}>{skill.description}</p>}
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* PROJECTS */}
      {projects.length > 0 && (
        <section id="projects" style={{ ...r.section, background: INK, color: "#fff" }}>
          <div style={r.sectionHeader}>
            <div style={{ ...r.sectionBox, background: PINK }}>
              <span style={r.sectionShape}>●</span>
              <h2 style={{ ...r.sectionTitle, color: "#fff" }}>PROJECTS</h2>
            </div>
          </div>
          <div style={r.projectsGrid}>
            {projects.map((p, i) => {
              const colors = [PINK, BLUE, GREEN, YELLOW, "#ff8c42", "#c77dff"];
              const accent = colors[i % colors.length];
              return (
                <div key={p.id} style={{ ...r.projectCard, borderTop: `6px solid ${accent}` }} className="retro-project-card">
                  <div style={{ ...r.projectBadge, background: accent }}>#{String(i + 1).padStart(2, "0")}</div>
                  <h3 style={r.projectTitle}>{p.title}</h3>
                  <p style={r.projectDesc}>{truncate(p.description, 100)}</p>
                  {p.techstack?.length > 0 && (
                    <div style={r.techRow}>
                      {p.techstack.map((t, j) => <span key={j} style={{ ...r.techTag, background: accent, color: "#111" }}>{t}</span>)}
                    </div>
                  )}
                  <div style={r.projLinks}>
                    {p.github_link && <a href={p.github_link} target="_blank" style={{ ...r.projLink, background: accent }} className="retro-proj-link">GITHUB ↗</a>}
                    {p.live_link && <a href={p.live_link} target="_blank" style={{ ...r.projLink, background: "#fff", color: "#111" }} className="retro-proj-link">LIVE ↗</a>}
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* EXPERIENCE */}
      {experiences.length > 0 && (
        <section id="experience" style={r.section}>
          <div style={r.sectionHeader}>
            <div style={{ ...r.sectionBox, background: BLUE }}>
              <span style={r.sectionShape}>◆</span>
              <h2 style={r.sectionTitle}>CAREER</h2>
            </div>
          </div>
          <div style={r.expList}>
            {experiences.map((exp, i) => (
              <div key={exp.id} style={{ ...r.expCard, borderLeft: `8px solid ${[PINK, GREEN, BLUE, YELLOW][i % 4]}` }} className="retro-exp-card">
                <div style={r.expHeader}>
                  <div>
                    <h3 style={r.expRole}>{exp.role}</h3>
                    <div style={r.expCompany}>{exp.company}</div>
                  </div>
                  <div style={r.expDates}>{formatDate(exp.start_date)} – {exp.is_current === "true" ? "NOW" : formatDate(exp.end_date)}</div>
                </div>
                {exp.description && <p style={r.expDesc}>{exp.description}</p>}
                {exp.points?.length > 0 && (
                  <ul style={r.expPoints}>
                    {exp.points.map((pt, j) => <li key={j} style={r.expPoint}>{pt}</li>)}
                  </ul>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* BLOG */}
      {blogs.length > 0 && (
        <section id="blog" style={{ ...r.section, background: "#fdf9ff" }}>
          <div style={r.sectionHeader}>
            <div style={{ ...r.sectionBox, background: GREEN }}>
              <span style={r.sectionShape}>■</span>
              <h2 style={r.sectionTitle}>BLOG</h2>
            </div>
          </div>
          <div style={r.blogGrid}>
            {blogs.map((blog, i) => (
              <div key={blog.id} style={{ ...r.blogCard, borderBottom: `5px solid ${[PINK, BLUE, GREEN][i % 3]}` }} className="retro-blog-card">
                <span style={{ ...r.blogCat, background: [PINK, BLUE, GREEN][i % 3] }}>{blog.category || "GENERAL"}</span>
                <h3 style={r.blogTitle}>{blog.title}</h3>
                <p style={r.blogExcerpt}>{truncate(blog.excerpt, 120)}</p>
                <span style={r.blogDate}>{formatDate(blog.publish_date)}</span>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* TESTIMONIALS */}
      {testimonials.length > 0 && (
        <section style={{ ...r.section, background: YELLOW }}>
          <div style={r.sectionHeader}>
            <div style={{ ...r.sectionBox, background: INK }}>
              <span style={{ ...r.sectionShape, color: YELLOW }}>★</span>
              <h2 style={{ ...r.sectionTitle, color: YELLOW }}>REVIEWS</h2>
            </div>
          </div>
          <div style={r.testGrid}>
            {testimonials.map((t, i) => (
              <div key={t.id} style={{ ...r.testCard, background: [PINK, BLUE, GREEN][i % 3] }} className="retro-test-card">
                <div style={r.testStars}>{"★".repeat(t.rating)}</div>
                <p style={r.testText}>"{t.review}"</p>
                <div style={r.testByline}>— {t.name} | {t.role} @ {t.company}</div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* CONTACT */}
      <section id="contact" style={{ ...r.section, background: BLUE }}>
        <div style={r.sectionHeader}>
          <div style={{ ...r.sectionBox, background: YELLOW }}>
            <span style={r.sectionShape}>✦</span>
            <h2 style={r.sectionTitle}>CONTACT</h2>
          </div>
        </div>
        <div style={r.contactGrid}>
          <div style={r.contactLeft}>
            <h2 style={r.contactHeadline}>Let's Make<br />Something<br /><em>Awesome!</em></h2>
            {profile.email && <div style={r.contactEmail}><span style={r.contactLabel}>EMAIL:</span> <a href={`mailto:${profile.email}`} style={r.contactLink}>{profile.email}</a></div>}
            {profile.location && <div style={r.contactLocation}><span style={r.contactLabel}>LOCATION:</span> {profile.location}</div>}
            {socialLinks.length > 0 && (
              <div style={r.socialRow}>
                {socialLinks.map(link => <a key={link.id} href={link.url} target="_blank" rel="noopener noreferrer" style={r.socialBtn} className="retro-social-btn">{link.platform.toUpperCase()}</a>)}
              </div>
            )}
          </div>
          <form onSubmit={handleContact} style={r.form}>
            <input required placeholder="YOUR NAME *" value={contactForm.name} onChange={e => setContactForm({ ...contactForm, name: e.target.value })} style={r.input} className="retro-input" />
            <input required type="email" placeholder="YOUR EMAIL *" value={contactForm.email} onChange={e => setContactForm({ ...contactForm, email: e.target.value })} style={r.input} className="retro-input" />
            <input placeholder="SUBJECT" value={contactForm.subject} onChange={e => setContactForm({ ...contactForm, subject: e.target.value })} style={r.input} className="retro-input" />
            <textarea required placeholder="YOUR MESSAGE *" value={contactForm.message} onChange={e => setContactForm({ ...contactForm, message: e.target.value })} style={{ ...r.input, ...r.textarea }} className="retro-input" />
            <button disabled={sending} style={r.submitBtn} className="retro-submit-btn">{sending ? "SENDING... ●" : "SEND MESSAGE ★"}</button>
          </form>
        </div>
      </section>

      <footer style={r.footer}>
        <div style={r.footerContent}>
          <span style={r.footerShape}>★ ● ■ ▲</span>
          <span style={r.footerText}>© {new Date().getFullYear()} {profile?.name || "Portfolio"} — Made with energy ☕</span>
          {socialLinks.length > 0 && (
            <div style={r.footerLinks}>
              {socialLinks.map(link => <a key={link.id} href={link.url} target="_blank" rel="noopener noreferrer" style={r.footerLink}>{link.platform}</a>)}
            </div>
          )}
        </div>
      </footer>
    </div>
  );
}

const YELLOW = "#ffd600";
const PINK = "#ff4db8";
const BLUE = "#2b57ff";
const GREEN = "#00c471";
const INK = "#111111";

const css = `
  @import url('https://fonts.googleapis.com/css2?family=Archivo+Black&family=Space+Grotesk:wght@300;400;500;600;700&display=swap');
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  @keyframes marquee { from{transform:translateX(0)} to{transform:translateX(-50%)} }
  .marquee-scroll { animation: marquee 30s linear infinite; display: inline-flex; }

  @keyframes spinSlow { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }
  @keyframes bounce { 0%,100%{transform:translateY(0) rotate(0)} 50%{transform:translateY(-12px) rotate(5deg)} }
  @keyframes wiggle { 0%,100%{transform:rotate(-3deg)} 50%{transform:rotate(3deg)} }
  @keyframes fillRetro { from{width:0 !important} }

  .spin-slow { animation: spinSlow 20s linear infinite; display: inline-block; }
  .bounce-deco { animation: bounce 3s ease-in-out infinite; display: inline-block; }
  .wiggle-deco { animation: wiggle 2s ease-in-out infinite; display: inline-block; }
  .skill-bar-retro { animation: fillRetro 1.4s cubic-bezier(0.4,0,0.2,1) both; }

  .retro-nav-link { position: relative; transition: color 0.2s; font-family: 'Archivo Black', sans-serif; font-size: 14px; }
  .retro-nav-link:hover { color: ${YELLOW} !important; }

  .retro-btn-fill { transition: transform 0.15s, box-shadow 0.15s; }
  .retro-btn-fill:hover { transform: translate(-3px,-3px); box-shadow: 6px 6px 0 ${INK} !important; }

  .retro-btn-outline { transition: transform 0.15s, box-shadow 0.15s; }
  .retro-btn-outline:hover { transform: translate(-3px,-3px); box-shadow: 6px 6px 0 ${INK} !important; }

  .hero-card-retro { transition: transform 0.3s; }
  .hero-card-retro:hover { transform: scale(1.06) rotate(0deg) !important; }

  .retro-skill-card { transition: transform 0.2s, box-shadow 0.2s; }
  .retro-skill-card:hover { transform: translate(-4px,-4px); box-shadow: 8px 8px 0 ${INK} !important; }

  .retro-project-card { transition: transform 0.2s, box-shadow 0.2s; }
  .retro-project-card:hover { transform: translate(-4px,-4px); box-shadow: 8px 8px 0 rgba(255,255,255,0.3) !important; }

  .retro-exp-card { transition: transform 0.2s; }
  .retro-exp-card:hover { transform: translateX(4px); }

  .retro-blog-card { transition: transform 0.2s, box-shadow 0.2s; }
  .retro-blog-card:hover { transform: translateY(-4px); box-shadow: 0 8px 0 ${INK}; }

  .retro-test-card { transition: transform 0.2s; }
  .retro-test-card:hover { transform: rotate(-1deg) scale(1.02); }

  .retro-proj-link { transition: transform 0.15s, box-shadow 0.15s; }
  .retro-proj-link:hover { transform: translate(-2px,-2px); box-shadow: 4px 4px 0 rgba(255,255,255,0.4) !important; }

  .retro-social-btn { transition: transform 0.15s, box-shadow 0.15s; }
  .retro-social-btn:hover { transform: translate(-2px,-2px); box-shadow: 4px 4px 0 ${INK} !important; }

  .retro-input { transition: border-color 0.2s, box-shadow 0.2s; }
  .retro-input:focus { outline: none; box-shadow: 4px 4px 0 ${YELLOW} !important; border-color: ${YELLOW} !important; }

  .retro-submit-btn { transition: transform 0.15s, box-shadow 0.15s; }
  .retro-submit-btn:hover { transform: translate(-3px,-3px); box-shadow: 6px 6px 0 ${INK} !important; }
`;

const r = {
  root: { fontFamily: "'Space Grotesk', sans-serif", background: "#fffff0", color: INK, minHeight: "100vh" },
  nav: { display: "flex", justifyContent: "space-between", alignItems: "center", padding: "20px 60px", background: INK, borderBottom: `4px solid ${YELLOW}`, position: "sticky", top: 0, zIndex: 100 },
  navLogo: { display: "flex", alignItems: "center", gap: 10 },
  navLogoShape: { fontSize: 20, color: YELLOW },
  navLogoText: { fontFamily: "'Archivo Black', sans-serif", fontSize: 20, color: "#fff", letterSpacing: "-0.5px" },
  navLinks: { display: "flex", gap: 32 },
  navLink: { color: "#aaa", textDecoration: "none", letterSpacing: "0.06em" },
  navAvail: { fontSize: 12, color: GREEN, fontWeight: 700, letterSpacing: "0.08em" },
  hero: { position: "relative", display: "flex", justifyContent: "space-between", alignItems: "center", padding: "100px 80px", minHeight: "90vh", background: "#fffff0", overflow: "hidden", borderBottom: `4px solid ${INK}` },
  deco: { position: "absolute", fontFamily: "'Archivo Black', sans-serif", pointerEvents: "none", zIndex: 0, lineHeight: 1 },
  heroContent: { maxWidth: 580, position: "relative", zIndex: 1 },
  heroChip: { display: "inline-block", background: YELLOW, border: `3px solid ${INK}`, padding: "6px 18px", fontSize: 13, fontWeight: 700, marginBottom: 24, boxShadow: `4px 4px 0 ${INK}` },
  heroName: { fontFamily: "'Archivo Black', sans-serif", fontSize: "clamp(52px, 7vw, 96px)", lineHeight: 0.92, marginBottom: 16, letterSpacing: "-2px", color: INK },
  heroUnderline: { width: "80%", height: 10, background: PINK, marginBottom: 20, boxShadow: `4px 4px 0 ${INK}` },
  heroRole: { fontFamily: "'Archivo Black', sans-serif", fontSize: 20, color: BLUE, marginBottom: 16, letterSpacing: "-0.5px" },
  heroBio: { fontSize: 16, lineHeight: 1.7, color: "#444", marginBottom: 36, maxWidth: 420 },
  heroCTAs: { display: "flex", gap: 16, flexWrap: "wrap" },
  ctaFill: { background: INK, color: "#fff", padding: "16px 32px", fontFamily: "'Archivo Black', sans-serif", fontSize: 14, textDecoration: "none", letterSpacing: "0.04em", border: `3px solid ${INK}`, boxShadow: `5px 5px 0 ${INK}` },
  ctaOutline: { background: YELLOW, color: INK, padding: "16px 32px", fontFamily: "'Archivo Black', sans-serif", fontSize: 14, textDecoration: "none", letterSpacing: "0.04em", border: `3px solid ${INK}`, boxShadow: `5px 5px 0 ${INK}` },
  heroCards: { display: "flex", flexDirection: "column", gap: 20, position: "relative", zIndex: 1 },
  heroCard: { border: `3px solid ${INK}`, padding: "20px 28px", display: "flex", flexDirection: "column", alignItems: "center", gap: 4, minWidth: 140, boxShadow: `6px 6px 0 ${INK}` },
  heroCardShape: { fontFamily: "'Archivo Black', sans-serif", fontSize: 24, color: INK },
  heroCardNum: { fontFamily: "'Archivo Black', sans-serif", fontSize: 52, lineHeight: 1, color: INK },
  heroCardLabel: { fontSize: 12, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase" },
  marqueeStrip: { background: YELLOW, border: `3px solid ${INK}`, borderLeft: "none", borderRight: "none", padding: "12px 0", overflow: "hidden" },
  marqueeInner: { whiteSpace: "nowrap" },
  marqueeText: { fontFamily: "'Archivo Black', sans-serif", fontSize: 15, letterSpacing: "0.1em", marginRight: 40 },
  section: { padding: "80px 80px" },
  sectionHeader: { marginBottom: 48 },
  sectionBox: { display: "inline-flex", alignItems: "center", gap: 12, border: `3px solid ${INK}`, padding: "10px 24px", boxShadow: `5px 5px 0 ${INK}` },
  sectionShape: { fontFamily: "'Archivo Black', sans-serif", fontSize: 20 },
  sectionTitle: { fontFamily: "'Archivo Black', sans-serif", fontSize: 28, letterSpacing: "-0.5px" },
  skillsGrid: { display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 20 },
  skillCard: { border: `3px solid`, background: "#fff", overflow: "hidden", boxShadow: `5px 5px 0 ${INK}` },
  skillTop: { display: "flex", alignItems: "center", gap: 10, padding: "14px 18px" },
  skillEmoji: { fontSize: 20 },
  skillName: { fontWeight: 700, flex: 1, fontSize: 15 },
  skillNum: { fontFamily: "'Archivo Black', sans-serif", fontSize: 20 },
  skillBarOuter: { margin: "0 16px 16px", height: 10, background: "#eee", border: `2px solid ${INK}` },
  skillBarInner: { height: "100%" },
  skillDesc: { padding: "0 16px 16px", fontSize: 13, color: "#555", lineHeight: 1.5 },
  projectsGrid: { display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: 24 },
  projectCard: { background: "#1a1a1a", border: `3px solid rgba(255,255,255,0.15)`, padding: 28, boxShadow: `6px 6px 0 rgba(255,255,255,0.1)` },
  projectBadge: { display: "inline-block", padding: "4px 12px", fontFamily: "'Archivo Black', sans-serif", fontSize: 13, marginBottom: 14, color: "#111" },
  projectTitle: { fontFamily: "'Archivo Black', sans-serif", fontSize: 22, color: "#fff", marginBottom: 10, letterSpacing: "-0.5px" },
  projectDesc: { fontSize: 14, color: "#aaa", lineHeight: 1.6, marginBottom: 16 },
  techRow: { display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 16 },
  techTag: { fontSize: 11, fontWeight: 700, padding: "4px 10px", letterSpacing: "0.04em" },
  projLinks: { display: "flex", gap: 12 },
  projLink: { padding: "8px 18px", fontFamily: "'Archivo Black', sans-serif", fontSize: 12, textDecoration: "none", color: "#111", border: `2px solid rgba(255,255,255,0.2)`, letterSpacing: "0.06em", boxShadow: `3px 3px 0 rgba(255,255,255,0.15)` },
  expList: { display: "flex", flexDirection: "column", gap: 20 },
  expCard: { background: "#fff", border: `3px solid ${INK}`, padding: "28px 28px 28px 24px", boxShadow: `6px 6px 0 ${INK}` },
  expHeader: { display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12 },
  expRole: { fontFamily: "'Archivo Black', sans-serif", fontSize: 20, letterSpacing: "-0.5px", marginBottom: 4 },
  expCompany: { fontSize: 15, color: BLUE, fontWeight: 700 },
  expDates: { fontSize: 12, fontWeight: 700, color: "#888", letterSpacing: "0.06em" },
  expDesc: { fontSize: 14, color: "#555", lineHeight: 1.7, marginBottom: 12 },
  expPoints: { paddingLeft: 16 },
  expPoint: { fontSize: 14, color: "#555", marginBottom: 6, lineHeight: 1.5 },
  blogGrid: { display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: 24 },
  blogCard: { background: "#fff", border: `3px solid ${INK}`, padding: 28, boxShadow: `6px 6px 0 ${INK}` },
  blogCat: { display: "inline-block", fontSize: 11, fontWeight: 700, padding: "4px 10px", color: "#fff", marginBottom: 14, letterSpacing: "0.1em" },
  blogTitle: { fontFamily: "'Archivo Black', sans-serif", fontSize: 20, marginBottom: 10, lineHeight: 1.2, letterSpacing: "-0.5px" },
  blogExcerpt: { fontSize: 14, color: "#555", lineHeight: 1.6, marginBottom: 16 },
  blogDate: { fontSize: 12, color: "#999", fontWeight: 600 },
  testGrid: { display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 24 },
  testCard: { border: `3px solid ${INK}`, padding: 28, boxShadow: `6px 6px 0 ${INK}` },
  testStars: { fontSize: 18, color: INK, marginBottom: 12 },
  testText: { fontSize: 15, lineHeight: 1.7, fontStyle: "italic", marginBottom: 16, color: "#111" },
  testByline: { fontSize: 13, fontWeight: 700 },
  contactGrid: { display: "grid", gridTemplateColumns: "1fr 1.2fr", gap: 60 },
  contactLeft: {},
  contactHeadline: { fontFamily: "'Archivo Black', sans-serif", fontSize: "clamp(36px, 4vw, 60px)", lineHeight: 1.0, marginBottom: 32, color: "#fff", letterSpacing: "-1px" },
  contactEmail: { fontSize: 14, marginBottom: 12, color: YELLOW },
  contactLabel: { fontWeight: 700, color: YELLOW, marginRight: 8 },
  contactLink: { color: "#fff", textDecoration: "none" },
  contactLocation: { fontSize: 14, color: "#ddd", marginBottom: 28 },
  socialRow: { display: "flex", gap: 12, flexWrap: "wrap" },
  socialBtn: { background: YELLOW, color: INK, border: `3px solid ${INK}`, padding: "8px 18px", fontFamily: "'Archivo Black', sans-serif", fontSize: 12, textDecoration: "none", boxShadow: `4px 4px 0 ${INK}`, letterSpacing: "0.06em" },
  form: { display: "flex", flexDirection: "column", gap: 16 },
  input: { border: `3px solid #fff`, background: "rgba(255,255,255,0.1)", padding: "14px 16px", fontSize: 14, fontFamily: "'Space Grotesk', sans-serif", fontWeight: 600, color: "#fff", width: "100%", letterSpacing: "0.04em" },
  textarea: { minHeight: 120, resize: "vertical" },
  submitBtn: { background: YELLOW, color: INK, border: `3px solid #fff`, padding: "16px 32px", fontFamily: "'Archivo Black', sans-serif", fontSize: 16, cursor: "pointer", letterSpacing: "0.04em", boxShadow: `5px 5px 0 rgba(255,255,255,0.4)`, alignSelf: "flex-start" },
  footer: { background: INK, borderTop: `4px solid ${YELLOW}`, padding: "28px 80px" },
  footerContent: { display: "flex", justifyContent: "space-between", alignItems: "center" },
  footerShape: { fontFamily: "'Archivo Black', sans-serif", color: YELLOW, fontSize: 16, letterSpacing: "4px" },
  footerText: { fontSize: 13, color: "#666" },
  footerLinks: { display: "flex", gap: 20 },
  footerLink: { fontSize: 12, color: "#555", textDecoration: "none", fontWeight: 600 },
};