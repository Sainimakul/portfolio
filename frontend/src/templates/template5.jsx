"use client";

import { error, success } from "@/util/toast";
import { usePortfolio } from "../../context/PortfolioContext";
import { sendContactMessage } from "../../service/api";
import { useState, useEffect, useRef } from "react";

function formatDate(d) { if (!d) return ""; return new Date(d).toLocaleDateString("en-US", { year: "numeric", month: "long" }); }
function truncate(str, n) { return str?.length > n ? str.substring(0, n - 1) + "…" : str; }

export default function Template5() {
  const { portfolioData, loading } = usePortfolio();
  const [contactForm, setContactForm] = useState({ name: "", email: "", subject: "", message: "" });
  const [sending, setSending] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [hoveredProject, setHoveredProject] = useState(null);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handler);
    return () => window.removeEventListener("scroll", handler);
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
    try { setSending(true); await sendContactMessage(contactForm); success("Message sent successfully"); setContactForm({ name: "", email: "", subject: "", message: "" }); }
    catch (err) { error(err.message); }
    finally { setSending(false); }
  }

  if (loading) return <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'Cormorant Garamond', serif", fontSize: 20, letterSpacing: "0.15em", color: "#1a1a1a" }}>Loading</div>;

  return (
    <div style={s.root}>
      <style>{css}</style>

      {/* NAV */}
      <nav style={{ ...s.nav, ...(scrolled ? s.navScrolled : {}) }}>
        <div style={s.navLeft}>
          <span style={s.navLogo}>{profile?.name?.split(" ")[0] || "Portfolio"}</span>
          <span style={s.navRule} />
          <span style={s.navTitle}>{profile?.title || "Developer"}</span>
        </div>
        <div style={s.navLinks}>
          {["Work", "Skills", "Experience", "Writing", "Contact"].map(n => (
            <a key={n} href={`#${n.toLowerCase()}`} style={s.navLink} className="nav-link-luxury">{n}</a>
          ))}
        </div>
      </nav>

      {/* HERO */}
      <section style={s.hero}>
        <div style={s.heroLeft}>
          <div style={s.heroNumber}>001</div>
          <div style={s.heroLine} />
        </div>
        <div style={s.heroCenter}>
          <p style={s.heroAvail}>Available for select projects</p>
          <h1 style={s.heroName}>{profile?.name || "Your Name"}</h1>
          <div style={s.heroNameLine} />
          <p style={s.heroTagline}>{profile?.bio || "Crafting exceptional digital experiences through thoughtful design and engineering."}</p>
        </div>
        <div style={s.heroRight}>
          <div style={s.heroMetrics}>
            <div style={s.heroMetric}>
              <span style={s.heroMetricNum}>{projects.length}</span>
              <span style={s.heroMetricLabel}>Projects</span>
            </div>
            <div style={s.heroMetricDiv} />
            <div style={s.heroMetric}>
              <span style={s.heroMetricNum}>{experiences.length}</span>
              <span style={s.heroMetricLabel}>Roles</span>
            </div>
            <div style={s.heroMetricDiv} />
            <div style={s.heroMetric}>
              <span style={s.heroMetricNum}>{skills.length}</span>
              <span style={s.heroMetricLabel}>Skills</span>
            </div>
          </div>
          <div style={s.heroActions}>
            <a href="#work" style={s.ctaPrimary} className="cta-luxury">Selected Work ↓</a>
            <a href="#contact" style={s.ctaSecondary} className="cta-luxury-sec">Let's Talk →</a>
          </div>
        </div>
      </section>

      {/* WORK */}
      {projects.length > 0 && (
        <section id="work" style={s.section}>
          <div style={s.sectionMeta}>
            <span style={s.sectionNum}>002</span>
            <span style={s.sectionTitle}>Selected Work</span>
          </div>
          <div style={s.projectsList}>
            {projects.map((p, i) => (
              <div
                key={p.id}
                style={{ ...s.projectRow, ...(hoveredProject === i ? s.projectRowHovered : {}) }}
                onMouseEnter={() => setHoveredProject(i)}
                onMouseLeave={() => setHoveredProject(null)}
                className="project-row-luxury"
              >
                <span style={s.projectIndex}>/{String(i + 1).padStart(2, "0")}</span>
                <h3 style={s.projectName}>{p.title}</h3>
                <p style={s.projectSummary}>{truncate(p.description, 80)}</p>
                <div style={s.projectTags}>
                  {p.techstack?.slice(0, 3).map((t, j) => <span key={j} style={s.projectTag}>{t}</span>)}
                </div>
                <div style={s.projectActions}>
                  {p.github_link && <a href={p.github_link} target="_blank" style={s.projectActionLink}>GitHub</a>}
                  {p.live_link && <a href={p.live_link} target="_blank" style={s.projectActionLink}>Live ↗</a>}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* SKILLS */}
      {skills.length > 0 && (
        <section id="skills" style={{ ...s.section, ...s.sectionAlt }}>
          <div style={s.sectionMeta}>
            <span style={s.sectionNum}>003</span>
            <span style={s.sectionTitle}>Expertise</span>
          </div>
          <div style={s.skillsCols}>
            <p style={s.skillsIntro}>A thoughtfully assembled toolkit built over years of practical application and continuous learning.</p>
            <div style={s.skillsGrid}>
              {skills.map((skill, i) => (
                <div key={skill.id} style={s.skillItem}>
                  <div style={s.skillItemTop}>
                    <span style={s.skillItemEmoji}>{skill.icon}</span>
                    <span style={s.skillItemName}>{skill.name}</span>
                    <span style={s.skillItemPct}>{skill.percentage}</span>
                  </div>
                  <div style={s.skillTrack}>
                    <div style={{ ...s.skillFill, width: `${skill.percentage}%` }} className="skill-fill-lux" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* EXPERIENCE */}
      {experiences.length > 0 && (
        <section id="experience" style={s.section}>
          <div style={s.sectionMeta}>
            <span style={s.sectionNum}>004</span>
            <span style={s.sectionTitle}>Experience</span>
          </div>
          <div style={s.expTimeline}>
            {experiences.map((exp, i) => (
              <div key={exp.id} style={s.expEntry} className="exp-entry-luxury">
                <div style={s.expDate}>{formatDate(exp.start_date)}<br />— {exp.is_current === "true" ? "Present" : formatDate(exp.end_date)}</div>
                <div style={s.expContent}>
                  <h3 style={s.expRole}>{exp.role}</h3>
                  <div style={s.expCompany}>{exp.company}</div>
                  {exp.description && <p style={s.expDesc}>{exp.description}</p>}
                  {exp.points?.length > 0 && (
                    <div style={s.expPoints}>
                      {exp.points.map((pt, j) => <div key={j} style={s.expPoint}><span style={s.expPointDash}>—</span> {pt}</div>)}
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
        <section id="writing" style={{ ...s.section, ...s.sectionAlt }}>
          <div style={s.sectionMeta}>
            <span style={s.sectionNum}>005</span>
            <span style={s.sectionTitle}>Writing</span>
          </div>
          <div style={s.blogGrid}>
            {blogs.map((blog, i) => (
              <div key={blog.id} style={s.blogCard} className="blog-card-luxury">
                <div style={s.blogHeader}>
                  <span style={s.blogCat}>{blog.category || "Thoughts"}</span>
                  <span style={s.blogDate}>{formatDate(blog.publish_date)}</span>
                </div>
                <h3 style={s.blogTitle}>{blog.title}</h3>
                <p style={s.blogExcerpt}>{truncate(blog.excerpt, 160)}</p>
                <span style={s.blogRead}>Read more →</span>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* TESTIMONIALS */}
      {testimonials.length > 0 && (
        <section style={s.section}>
          <div style={s.sectionMeta}>
            <span style={s.sectionNum}>006</span>
            <span style={s.sectionTitle}>Testimonials</span>
          </div>
          <div style={s.testGrid}>
            {testimonials.map(t => (
              <div key={t.id} style={s.testCard}>
                <p style={s.testText}>"{t.review}"</p>
                <div style={s.testAuthor}>
                  <div style={s.testName}>{t.name}</div>
                  <div style={s.testRole}>{t.role}, {t.company}</div>
                  <div style={s.testStars}>{Array.from({ length: t.rating }).map((_, i) => "★").join("")}</div>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* CONTACT */}
      <section id="contact" style={{ ...s.section, ...s.sectionAlt }}>
        <div style={s.sectionMeta}>
          <span style={s.sectionNum}>007</span>
          <span style={s.sectionTitle}>Get in Touch</span>
        </div>
        <div style={s.contactLayout}>
          <div style={s.contactLeft}>
            <h2 style={s.contactHeadline}>Let's create something remarkable together.</h2>
            {profile.email && <a href={`mailto:${profile.email}`} style={s.contactEmail}>{profile.email}</a>}
            {profile.location && <p style={s.contactLocation}>{profile.location}</p>}
            {socialLinks.length > 0 && (
              <div style={s.socialRow}>
                {socialLinks.map(link => <a key={link.id} href={link.url} target="_blank" rel="noopener noreferrer" style={s.socialLink} className="nav-link-luxury">{link.platform}</a>)}
              </div>
            )}
          </div>
          <form onSubmit={handleContact} style={s.form}>
            <div style={s.formRow}>
              <div style={s.formField}>
                <label style={s.label}>Name</label>
                <input required value={contactForm.name} onChange={e => setContactForm({ ...contactForm, name: e.target.value })} style={s.input} className="lux-input" />
              </div>
              <div style={s.formField}>
                <label style={s.label}>Email</label>
                <input required type="email" value={contactForm.email} onChange={e => setContactForm({ ...contactForm, email: e.target.value })} style={s.input} className="lux-input" />
              </div>
            </div>
            <div style={s.formField}>
              <label style={s.label}>Subject</label>
              <input value={contactForm.subject} onChange={e => setContactForm({ ...contactForm, subject: e.target.value })} style={s.input} className="lux-input" />
            </div>
            <div style={s.formField}>
              <label style={s.label}>Message</label>
              <textarea required value={contactForm.message} onChange={e => setContactForm({ ...contactForm, message: e.target.value })} style={s.textarea} className="lux-input" />
            </div>
            <button disabled={sending} style={s.submitBtn} className="submit-lux">{sending ? "Sending..." : "Send Message"}</button>
          </form>
        </div>
      </section>

      <footer style={s.footer}>
        <span style={s.footerLeft}>© {new Date().getFullYear()} {profile?.name || "Portfolio"}</span>
        <span style={s.footerRight}>Crafted with care</span>
      </footer>
    </div>
  );
}

const css = `
  @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;1,300;1,400;1,500&family=Montserrat:wght@300;400;500;600;700&display=swap');
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  @keyframes revealLine { from{width:0} }
  @keyframes fillLux { from{width:0 !important} }
  .skill-fill-lux { animation: fillLux 1.5s cubic-bezier(0.4,0,0.2,1) both; }

  .nav-link-luxury { position: relative; transition: color 0.3s; }
  .nav-link-luxury::after { content:''; position:absolute; bottom:-2px; left:0; width:0; height:1px; background:#1a1a1a; transition: width 0.4s cubic-bezier(0.4,0,0.2,1); }
  .nav-link-luxury:hover::after { width:100%; }
  .nav-link-luxury:hover { color:#1a1a1a !important; }

  .cta-luxury { transition: all 0.3s; }
  .cta-luxury:hover { background:#1a1a1a !important; color:#f9f5ef !important; }
  .cta-luxury-sec { transition: all 0.3s; }
  .cta-luxury-sec:hover { color:#1a1a1a !important; }

  .project-row-luxury { transition: all 0.3s; cursor: default; }
  .project-row-luxury:hover { padding-left: 32px !important; }

  .exp-entry-luxury { transition: border-color 0.3s; }
  .exp-entry-luxury:hover { border-left-color: #1a1a1a !important; }

  .blog-card-luxury { transition: transform 0.3s, box-shadow 0.3s; }
  .blog-card-luxury:hover { transform: translateY(-4px); box-shadow: 0 20px 40px rgba(0,0,0,0.06); }

  .lux-input { transition: border-color 0.3s; }
  .lux-input:focus { border-color: #1a1a1a !important; outline: none; }

  .submit-lux { transition: all 0.3s; }
  .submit-lux:hover { background: #1a1a1a !important; }
`;

const CREAM = "#f9f5ef";
const INK = "#1a1a1a";
const WARM = "#8b7355";
const SUBTLE = "#e8e0d4";

const s = {
  root: { fontFamily: "'Montserrat', sans-serif", background: CREAM, color: INK, minHeight: "100vh", fontWeight: 300 },
  nav: { display: "flex", justifyContent: "space-between", alignItems: "center", padding: "28px 80px", position: "sticky", top: 0, zIndex: 100, transition: "background 0.4s, box-shadow 0.4s" },
  navScrolled: { background: "rgba(249,245,239,0.95)", backdropFilter: "blur(20px)", boxShadow: "0 1px 0 rgba(0,0,0,0.06)" },
  navLeft: { display: "flex", alignItems: "center", gap: 16 },
  navLogo: { fontFamily: "'Cormorant Garamond', serif", fontSize: 22, fontWeight: 600, letterSpacing: "0.05em" },
  navRule: { width: 1, height: 16, background: "rgba(0,0,0,0.15)" },
  navTitle: { fontSize: 12, color: "#888", letterSpacing: "0.08em", fontWeight: 400 },
  navLinks: { display: "flex", gap: 36 },
  navLink: { fontSize: 12, color: "#888", textDecoration: "none", letterSpacing: "0.08em", fontWeight: 400, textTransform: "uppercase" },
  hero: { display: "grid", gridTemplateColumns: "80px 1fr 1fr", gap: 60, padding: "120px 80px 100px", borderBottom: `1px solid ${SUBTLE}`, alignItems: "center" },
  heroLeft: { display: "flex", flexDirection: "column", alignItems: "center", gap: 16 },
  heroNumber: { fontFamily: "'Cormorant Garamond', serif", fontSize: 13, color: "#ccc", letterSpacing: "0.15em", writingMode: "vertical-rl", transform: "rotate(180deg)" },
  heroLine: { width: 1, height: 80, background: SUBTLE },
  heroCenter: {},
  heroAvail: { fontSize: 11, color: WARM, letterSpacing: "0.15em", textTransform: "uppercase", marginBottom: 20, fontWeight: 500 },
  heroName: { fontFamily: "'Cormorant Garamond', serif", fontSize: "clamp(56px, 6vw, 96px)", fontWeight: 400, lineHeight: 0.9, marginBottom: 24, color: INK, letterSpacing: "-0.02em" },
  heroNameLine: { width: 64, height: 2, background: WARM, marginBottom: 28, animation: "revealLine 1s ease both" },
  heroTagline: { fontSize: 16, lineHeight: 1.8, color: "#666", maxWidth: 440, fontWeight: 300 },
  heroRight: { display: "flex", flexDirection: "column", gap: 40, alignItems: "flex-end" },
  heroMetrics: { display: "flex", gap: 24, alignItems: "center" },
  heroMetric: { display: "flex", flexDirection: "column", alignItems: "center", gap: 6 },
  heroMetricNum: { fontFamily: "'Cormorant Garamond', serif", fontSize: 52, fontWeight: 600, lineHeight: 1, color: INK },
  heroMetricLabel: { fontSize: 11, color: "#999", letterSpacing: "0.1em", textTransform: "uppercase" },
  heroMetricDiv: { width: 1, height: 40, background: SUBTLE },
  heroActions: { display: "flex", flexDirection: "column", gap: 12, alignItems: "flex-end" },
  ctaPrimary: { background: INK, color: CREAM, padding: "14px 32px", textDecoration: "none", fontSize: 12, fontWeight: 600, letterSpacing: "0.12em", textTransform: "uppercase" },
  ctaSecondary: { color: "#999", textDecoration: "none", fontSize: 12, letterSpacing: "0.1em", fontWeight: 400 },
  section: { padding: "100px 80px" },
  sectionAlt: { background: "#f3ede3" },
  sectionMeta: { display: "flex", alignItems: "center", gap: 20, marginBottom: 64 },
  sectionNum: { fontFamily: "'Cormorant Garamond', serif", fontSize: 14, color: "#ccc", letterSpacing: "0.15em" },
  sectionTitle: { fontFamily: "'Cormorant Garamond', serif", fontSize: 36, fontWeight: 500, letterSpacing: "-0.01em" },
  projectsList: { display: "flex", flexDirection: "column" },
  projectRow: { display: "grid", gridTemplateColumns: "60px 1fr 2fr 1fr 120px", alignItems: "center", gap: 24, padding: "24px 20px", borderTop: `1px solid ${SUBTLE}`, transition: "padding 0.3s" },
  projectRowHovered: { background: "#f3ede3" },
  projectIndex: { fontFamily: "'Cormorant Garamond', serif", fontSize: 16, color: "#ccc" },
  projectName: { fontFamily: "'Cormorant Garamond', serif", fontSize: 22, fontWeight: 500 },
  projectSummary: { fontSize: 13, color: "#888", lineHeight: 1.5 },
  projectTags: { display: "flex", gap: 8, flexWrap: "wrap" },
  projectTag: { fontSize: 11, color: WARM, border: `1px solid #d4c4a8`, padding: "3px 10px", letterSpacing: "0.06em" },
  projectActions: { display: "flex", gap: 16, justifyContent: "flex-end" },
  projectActionLink: { fontSize: 12, color: "#888", textDecoration: "none", letterSpacing: "0.08em" },
  skillsCols: { display: "grid", gridTemplateColumns: "1fr 2fr", gap: 80 },
  skillsIntro: { fontFamily: "'Cormorant Garamond', serif", fontSize: 22, fontStyle: "italic", lineHeight: 1.7, color: "#555", fontWeight: 400 },
  skillsGrid: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 },
  skillItem: {},
  skillItemTop: { display: "flex", alignItems: "center", gap: 8, marginBottom: 8 },
  skillItemEmoji: { fontSize: 16 },
  skillItemName: { flex: 1, fontSize: 13, fontWeight: 500, letterSpacing: "0.04em" },
  skillItemPct: { fontFamily: "'Cormorant Garamond', serif", fontSize: 20, color: WARM },
  skillTrack: { height: 1, background: SUBTLE, overflow: "hidden" },
  skillFill: { height: "100%", background: WARM },
  expTimeline: { display: "flex", flexDirection: "column", gap: 0 },
  expEntry: { display: "grid", gridTemplateColumns: "200px 1fr", gap: 48, padding: "40px 0", borderBottom: `1px solid ${SUBTLE}`, borderLeft: "1px solid transparent" },
  expDate: { fontFamily: "'Cormorant Garamond', serif", fontSize: 14, color: "#999", fontStyle: "italic", lineHeight: 1.8, paddingLeft: 24 },
  expContent: {},
  expRole: { fontFamily: "'Cormorant Garamond', serif", fontSize: 28, fontWeight: 500, marginBottom: 4 },
  expCompany: { fontSize: 13, color: WARM, fontWeight: 500, letterSpacing: "0.06em", marginBottom: 16 },
  expDesc: { fontSize: 14, color: "#666", lineHeight: 1.8, marginBottom: 16 },
  expPoints: { display: "flex", flexDirection: "column", gap: 8 },
  expPoint: { fontSize: 14, color: "#666", display: "flex", gap: 12, lineHeight: 1.6 },
  expPointDash: { color: WARM, flexShrink: 0 },
  blogGrid: { display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: 40 },
  blogCard: { background: CREAM, padding: 36 },
  blogHeader: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 },
  blogCat: { fontSize: 11, color: WARM, letterSpacing: "0.12em", textTransform: "uppercase", fontWeight: 500 },
  blogDate: { fontSize: 12, color: "#999", fontStyle: "italic" },
  blogTitle: { fontFamily: "'Cormorant Garamond', serif", fontSize: 26, fontWeight: 500, lineHeight: 1.25, marginBottom: 14 },
  blogExcerpt: { fontSize: 14, color: "#666", lineHeight: 1.8, marginBottom: 20 },
  blogRead: { fontSize: 12, color: "#999", letterSpacing: "0.06em" },
  testGrid: { display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: 40 },
  testCard: { borderTop: `2px solid ${WARM}`, paddingTop: 24 },
  testText: { fontFamily: "'Cormorant Garamond', serif", fontSize: 18, fontStyle: "italic", lineHeight: 1.7, color: "#444", marginBottom: 24 },
  testAuthor: {},
  testName: { fontSize: 14, fontWeight: 600, letterSpacing: "0.05em" },
  testRole: { fontSize: 13, color: "#888", marginBottom: 8 },
  testStars: { color: WARM, letterSpacing: "0.05em", fontSize: 14 },
  contactLayout: { display: "grid", gridTemplateColumns: "1fr 1.5fr", gap: 80 },
  contactLeft: {},
  contactHeadline: { fontFamily: "'Cormorant Garamond', serif", fontSize: 40, fontWeight: 400, lineHeight: 1.2, marginBottom: 32, color: INK },
  contactEmail: { display: "block", fontFamily: "'Cormorant Garamond', serif", fontSize: 20, color: WARM, textDecoration: "none", marginBottom: 8, fontStyle: "italic" },
  contactLocation: { fontSize: 13, color: "#888", marginBottom: 32 },
  socialRow: { display: "flex", gap: 24, flexWrap: "wrap" },
  socialLink: { fontSize: 12, color: "#888", textDecoration: "none", letterSpacing: "0.1em", textTransform: "uppercase" },
  form: { display: "flex", flexDirection: "column", gap: 24 },
  formRow: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 },
  formField: { display: "flex", flexDirection: "column", gap: 8 },
  label: { fontSize: 11, color: "#999", letterSpacing: "0.12em", textTransform: "uppercase", fontWeight: 500 },
  input: { background: "transparent", border: "none", borderBottom: `1px solid ${SUBTLE}`, padding: "12px 0", fontSize: 15, fontFamily: "'Montserrat', sans-serif", color: INK, width: "100%" },
  textarea: { background: "transparent", border: "none", borderBottom: `1px solid ${SUBTLE}`, padding: "12px 0", fontSize: 15, fontFamily: "'Montserrat', sans-serif", color: INK, minHeight: 100, resize: "none", width: "100%" },
  submitBtn: { background: "transparent", border: `1px solid ${INK}`, color: INK, padding: "16px 40px", fontSize: 12, fontFamily: "'Montserrat', sans-serif", letterSpacing: "0.15em", textTransform: "uppercase", cursor: "pointer", fontWeight: 500, alignSelf: "flex-start" },
  footer: { padding: "32px 80px", borderTop: `1px solid ${SUBTLE}`, display: "flex", justifyContent: "space-between" },
  footerLeft: { fontSize: 12, color: "#999", letterSpacing: "0.06em" },
  footerRight: { fontFamily: "'Cormorant Garamond', serif", fontSize: 14, color: "#ccc", fontStyle: "italic" },
};