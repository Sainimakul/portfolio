"use client";

import { error, success } from "../util/toast";
import { usePortfolio } from "../../context/PortfolioContext";
import { sendContactMessage } from "../../service/api";
import { useState, useEffect, useRef } from "react";

function formatDate(dateString) {
  if (!dateString) return "";
  const d = new Date(dateString);
  return d.toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" });
}
function truncate(str, n) {
  return str?.length > n ? str.substring(0, n - 1) + "…" : str;
}

export default function Template2() {
  const { portfolioData, loading } = usePortfolio();
  const [contactForm, setContactForm] = useState({ name: "", email: "", subject: "", message: "" });
  const [sending, setSending] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [activeSection, setActiveSection] = useState("home");
  const heroRef = useRef(null);

  useEffect(() => {
    const handleMouse = (e) => setMousePos({ x: e.clientX, y: e.clientY });
    window.addEventListener("mousemove", handleMouse);
    return () => window.removeEventListener("mousemove", handleMouse);
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
    } catch (err) {
      error(err.message);
    } finally {
      setSending(false);
    }
  }

  if (loading) {
    return (
      <div style={styles.loadingContainer}>
        <div style={styles.loadingOrb}></div>
        <span style={styles.loadingText}>Loading...</span>
        <style>{loadingAnim}</style>
      </div>
    );
  }

  return (
    <div style={styles.root}>
      <style>{globalStyles}</style>

      {/* Cursor glow */}
      <div style={{
        ...styles.cursorGlow,
        left: mousePos.x - 200,
        top: mousePos.y - 200,
      }} />

      {/* Background orbs */}
      <div style={styles.orb1} />
      <div style={styles.orb2} />
      <div style={styles.orb3} />

      {/* NAV */}
      <nav style={styles.nav}>
        <div style={styles.navLogo}>
          <span style={styles.navLogoText}>{profile?.name?.split(" ")[0] || "DEV"}</span>
        </div>
        <div style={styles.navLinks}>
          {["skills", "projects", "experience", "blog", "contact"].map(s => (
            <a key={s} href={`#${s}`} style={styles.navLink} className="nav-link">
              {s.charAt(0).toUpperCase() + s.slice(1)}
            </a>
          ))}
        </div>
      </nav>

      {/* HERO */}
      <section style={styles.hero} ref={heroRef}>
        <div style={styles.heroContent}>
          <div style={styles.heroBadge}>
            <span style={styles.heroBadgeDot}></span>
            Available for work
          </div>
          <h1 style={styles.heroName}>{profile?.name || "Your Name"}</h1>
          <p style={styles.heroTitle}>{profile?.title || "Full Stack Developer"}</p>
          <p style={styles.heroBio}>{profile?.bio || "Building beautiful digital experiences with modern technologies."}</p>
          <div style={styles.heroCTAs}>
            <a href="#projects" style={styles.ctaPrimary} className="btn-glow">View Work</a>
            <a href="#contact" style={styles.ctaSecondary}>Get in Touch</a>
          </div>
        </div>
        <div style={styles.heroVisual}>
          <div style={styles.heroCard}>
            <div style={styles.heroCardInner}>
              <div style={styles.heroAvatar}>
                {profile?.name?.[0] || "D"}
              </div>
              <div style={styles.heroCardStats}>
                <div style={styles.stat}>
                  <span style={styles.statNum}>{projects.length}+</span>
                  <span style={styles.statLabel}>Projects</span>
                </div>
                <div style={styles.statDivider} />
                <div style={styles.stat}>
                  <span style={styles.statNum}>{skills.length}+</span>
                  <span style={styles.statLabel}>Skills</span>
                </div>
                <div style={styles.statDivider} />
                <div style={styles.stat}>
                  <span style={styles.statNum}>{experiences.length}+</span>
                  <span style={styles.statLabel}>Roles</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SKILLS */}
      {skills.length > 0 && (
        <section id="skills" style={styles.section}>
          <div style={styles.sectionHeader}>
            <span style={styles.sectionTag}>Expertise</span>
            <h2 style={styles.sectionTitle}>Skills & Tools</h2>
          </div>
          <div style={styles.skillsGrid}>
            {skills.map((skill, i) => (
              <div key={skill.id} style={styles.skillCard} className="glass-card">
                <div style={styles.skillTop}>
                  <span style={styles.skillIcon}>{skill.icon}</span>
                  <span style={styles.skillName}>{skill.name}</span>
                  <span style={styles.skillPct}>{skill.percentage}%</span>
                </div>
                <div style={styles.skillBar}>
                  <div style={{ ...styles.skillBarFill, width: `${skill.percentage}%`, animationDelay: `${i * 0.1}s` }} className="skill-fill" />
                </div>
                {skill.description && <p style={styles.skillDesc}>{skill.description}</p>}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* PROJECTS */}
      {projects.length > 0 && (
        <section id="projects" style={styles.section}>
          <div style={styles.sectionHeader}>
            <span style={styles.sectionTag}>Portfolio</span>
            <h2 style={styles.sectionTitle}>Featured Work</h2>
          </div>
          <div style={styles.projectsGrid}>
            {projects.map((p, i) => (
              <div key={p.id} style={{ ...styles.projectCard, ...(i === 0 ? styles.projectCardFeatured : {}) }} className="glass-card project-card">
                <div style={styles.projectNum}>0{i + 1}</div>
                <h3 style={styles.projectTitle}>{p.title}</h3>
                <p style={styles.projectDesc}>{p.description}</p>
                {p.techstack?.length > 0 && (
                  <div style={styles.techstack}>
                    {p.techstack.map((t, j) => (
                      <span key={j} style={styles.techTag}>{t}</span>
                    ))}
                  </div>
                )}
                <div style={styles.projectLinks}>
                  {p.github_link && <a href={p.github_link} target="_blank" style={styles.projectLink} className="project-link-btn">GitHub ↗</a>}
                  {p.live_link && <a href={p.live_link} target="_blank" style={styles.projectLinkPrimary} className="btn-glow">Live Demo ↗</a>}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* EXPERIENCE */}
      {experiences.length > 0 && (
        <section id="experience" style={styles.section}>
          <div style={styles.sectionHeader}>
            <span style={styles.sectionTag}>Career</span>
            <h2 style={styles.sectionTitle}>Experience</h2>
          </div>
          <div style={styles.timeline}>
            {experiences.map((exp, i) => (
              <div key={exp.id} style={styles.timelineItem}>
                <div style={styles.timelineLine} />
                <div style={styles.timelineDot} />
                <div style={styles.timelineCard} className="glass-card">
                  <div style={styles.timelineHeader}>
                    <div>
                      <h3 style={styles.expRole}>{exp.role}</h3>
                      <div style={styles.expCompany}>{exp.company}</div>
                    </div>
                    <div style={styles.expDates}>
                      {formatDate(exp.start_date)} — {exp.is_current === "true" ? "Present" : formatDate(exp.end_date)}
                    </div>
                  </div>
                  {exp.description && <p style={styles.expDesc}>{exp.description}</p>}
                  {exp.points?.length > 0 && (
                    <ul style={styles.expPoints}>
                      {exp.points.map((pt, j) => (
                        <li key={j} style={styles.expPoint}>{pt}</li>
                      ))}
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
        <section id="blog" style={styles.section}>
          <div style={styles.sectionHeader}>
            <span style={styles.sectionTag}>Writing</span>
            <h2 style={styles.sectionTitle}>Blog</h2>
          </div>
          <div style={styles.blogGrid}>
            {blogs.map(blog => (
              <div key={blog.id} style={styles.blogCard} className="glass-card">
                <span style={styles.blogCategory}>{blog.category || "General"}</span>
                <h3 style={styles.blogTitle}>{blog.title}</h3>
                <p style={styles.blogExcerpt}>{truncate(blog.excerpt, 120)}</p>
                <div style={styles.blogMeta}>{formatDate(blog.publish_date)}</div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* TESTIMONIALS */}
      {testimonials.length > 0 && (
        <section style={styles.section}>
          <div style={styles.sectionHeader}>
            <span style={styles.sectionTag}>Feedback</span>
            <h2 style={styles.sectionTitle}>Testimonials</h2>
          </div>
          <div style={styles.testimonialsGrid}>
            {testimonials.map(t => (
              <div key={t.id} style={styles.testimonialCard} className="glass-card">
                <div style={styles.testimonialStars}>{"★".repeat(t.rating)}</div>
                <p style={styles.testimonialText}>"{t.review}"</p>
                <div style={styles.testimonialAuthor}>
                  <div style={styles.testimonialAvatar}>{t.name?.[0]}</div>
                  <div>
                    <div style={styles.testimonialName}>{t.name}</div>
                    <div style={styles.testimonialRole}>{t.role} @ {t.company}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* CONTACT */}
      <section id="contact" style={styles.section}>
        <div style={styles.sectionHeader}>
          <span style={styles.sectionTag}>Let's Talk</span>
          <h2 style={styles.sectionTitle}>Get In Touch</h2>
        </div>
        <div style={styles.contactGrid}>
          <div style={styles.contactInfo}>
            <p style={styles.contactSubtext}>Have a project in mind? Let's collaborate and build something extraordinary together.</p>
            {profile.email && (
              <div style={styles.contactItem}>
                <span style={styles.contactLabel}>Email</span>
                <a href={`mailto:${profile.email}`} style={styles.contactValue}>{profile.email}</a>
              </div>
            )}
            {profile.location && (
              <div style={styles.contactItem}>
                <span style={styles.contactLabel}>Location</span>
                <span style={styles.contactValue}>{profile.location}</span>
              </div>
            )}
            {socialLinks.length > 0 && (
              <div style={styles.socialLinks}>
                {socialLinks.map(link => (
                  <a key={link.id} href={link.url} target="_blank" rel="noopener noreferrer" style={styles.socialLink} className="social-link">{link.platform}</a>
                ))}
              </div>
            )}
          </div>
          <form onSubmit={handleContact} style={styles.contactForm}>
            <input required placeholder="Your Name" value={contactForm.name} onChange={e => setContactForm({ ...contactForm, name: e.target.value })} style={styles.input} className="glass-input" />
            <input required type="email" placeholder="Email Address" value={contactForm.email} onChange={e => setContactForm({ ...contactForm, email: e.target.value })} style={styles.input} className="glass-input" />
            <input placeholder="Subject" value={contactForm.subject} onChange={e => setContactForm({ ...contactForm, subject: e.target.value })} style={styles.input} className="glass-input" />
            <textarea required placeholder="Your Message" value={contactForm.message} onChange={e => setContactForm({ ...contactForm, message: e.target.value })} style={styles.textarea} className="glass-input" />
            <button disabled={sending} style={styles.submitBtn} className="btn-glow">{sending ? "Sending..." : "Send Message →"}</button>
          </form>
        </div>
      </section>

      {/* FOOTER */}
      <footer style={styles.footer}>
        <div style={styles.footerGlass}>
          <span style={styles.footerText}>© {new Date().getFullYear()} {profile?.name || "Your Name"} · Built with passion</span>
        </div>
      </footer>
    </div>
  );
}

const loadingAnim = `
@keyframes pulse { 0%,100%{transform:scale(1);opacity:1} 50%{transform:scale(1.5);opacity:0.5} }
`;

const globalStyles = `
  @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800;900&family=DM+Serif+Display:ital@0;1&display=swap');
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  
  .nav-link { transition: color 0.3s, text-shadow 0.3s; }
  .nav-link:hover { color: #a78bfa !important; text-shadow: 0 0 20px rgba(167,139,250,0.5); }

  .glass-card {
    transition: transform 0.3s ease, box-shadow 0.3s ease;
  }
  .glass-card:hover {
    transform: translateY(-4px);
    box-shadow: 0 20px 60px rgba(167,139,250,0.2), 0 0 0 1px rgba(255,255,255,0.15) !important;
  }

  .btn-glow {
    transition: all 0.3s ease;
    position: relative;
    overflow: hidden;
  }
  .btn-glow:hover {
    box-shadow: 0 0 30px rgba(167,139,250,0.6), 0 0 60px rgba(167,139,250,0.3) !important;
    transform: translateY(-2px);
  }

  .skill-fill {
    animation: fillBar 1.2s cubic-bezier(0.4,0,0.2,1) both;
  }
  @keyframes fillBar {
    from { width: 0% !important; }
  }

  .project-card { transition: all 0.4s ease; }
  .project-card:hover { transform: translateY(-6px) scale(1.01); }

  .glass-input {
    transition: all 0.3s ease;
    outline: none;
  }
  .glass-input:focus {
    border-color: rgba(167,139,250,0.6) !important;
    box-shadow: 0 0 20px rgba(167,139,250,0.2) !important;
  }

  .social-link { transition: all 0.3s; }
  .social-link:hover { color: #a78bfa !important; transform: translateY(-2px); }

  .project-link-btn { transition: all 0.3s; }
  .project-link-btn:hover { color: #a78bfa !important; }

  @keyframes float {
    0%,100% { transform: translateY(0px) rotate(0deg); }
    33% { transform: translateY(-20px) rotate(1deg); }
    66% { transform: translateY(-10px) rotate(-1deg); }
  }
  @keyframes orbFloat1 {
    0%,100% { transform: translate(0,0) scale(1); }
    50% { transform: translate(30px, -50px) scale(1.1); }
  }
  @keyframes orbFloat2 {
    0%,100% { transform: translate(0,0) scale(1); }
    50% { transform: translate(-40px, 30px) scale(0.9); }
  }
  @keyframes orbFloat3 {
    0%,100% { transform: translate(0,0) scale(1); }
    50% { transform: translate(20px, 40px) scale(1.05); }
  }
`;

const styles = {
  root: {
    fontFamily: "'Outfit', sans-serif",
    background: "#050510",
    color: "#e2e8f0",
    minHeight: "100vh",
    position: "relative",
    overflow: "hidden",
  },
  loadingContainer: {
    display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
    minHeight: "100vh", background: "#050510", gap: "16px"
  },
  loadingOrb: {
    width: 40, height: 40, borderRadius: "50%",
    background: "linear-gradient(135deg, #a78bfa, #60a5fa)",
    animation: "pulse 1.5s ease-in-out infinite"
  },
  loadingText: { color: "#a78bfa", fontFamily: "'Outfit', sans-serif", fontSize: 16 },
  cursorGlow: {
    position: "fixed", width: 400, height: 400, borderRadius: "50%",
    background: "radial-gradient(circle, rgba(167,139,250,0.06) 0%, transparent 70%)",
    pointerEvents: "none", zIndex: 0, transition: "left 0.1s ease, top 0.1s ease",
  },
  orb1: {
    position: "fixed", top: "-20%", left: "-10%", width: "50vw", height: "50vw",
    borderRadius: "50%", background: "radial-gradient(circle, rgba(167,139,250,0.12) 0%, transparent 70%)",
    animation: "orbFloat1 12s ease-in-out infinite", pointerEvents: "none", zIndex: 0,
  },
  orb2: {
    position: "fixed", bottom: "10%", right: "-10%", width: "40vw", height: "40vw",
    borderRadius: "50%", background: "radial-gradient(circle, rgba(96,165,250,0.1) 0%, transparent 70%)",
    animation: "orbFloat2 15s ease-in-out infinite", pointerEvents: "none", zIndex: 0,
  },
  orb3: {
    position: "fixed", top: "50%", left: "40%", width: "30vw", height: "30vw",
    borderRadius: "50%", background: "radial-gradient(circle, rgba(244,114,182,0.07) 0%, transparent 70%)",
    animation: "orbFloat3 18s ease-in-out infinite", pointerEvents: "none", zIndex: 0,
  },
  nav: {
    display: "flex", justifyContent: "space-between", alignItems: "center",
    padding: "20px 60px", position: "sticky", top: 0, zIndex: 100,
    background: "rgba(5,5,16,0.7)", backdropFilter: "blur(20px)",
    borderBottom: "1px solid rgba(255,255,255,0.06)",
  },
  navLogo: { display: "flex", alignItems: "center", gap: 8 },
  navLogoText: {
    fontSize: 22, fontWeight: 800, letterSpacing: "-0.5px",
    background: "linear-gradient(135deg, #a78bfa, #60a5fa)",
    WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
  },
  navLinks: { display: "flex", gap: 36 },
  navLink: {
    color: "#94a3b8", fontSize: 14, textDecoration: "none",
    fontWeight: 500, letterSpacing: "0.02em",
  },
  hero: {
    minHeight: "92vh", display: "flex", alignItems: "center",
    justifyContent: "space-between", padding: "80px 60px",
    position: "relative", zIndex: 1,
  },
  heroContent: { maxWidth: 600, flex: "0 0 auto" },
  heroBadge: {
    display: "inline-flex", alignItems: "center", gap: 8,
    background: "rgba(167,139,250,0.1)", border: "1px solid rgba(167,139,250,0.3)",
    padding: "6px 16px", borderRadius: 100, fontSize: 12,
    color: "#a78bfa", fontWeight: 600, letterSpacing: "0.08em",
    textTransform: "uppercase", marginBottom: 24,
  },
  heroBadgeDot: {
    width: 6, height: 6, borderRadius: "50%", background: "#a78bfa",
    boxShadow: "0 0 8px #a78bfa", display: "inline-block",
    animation: "pulse 2s ease-in-out infinite",
  },
  heroName: {
    fontFamily: "'DM Serif Display', serif",
    fontSize: "clamp(48px, 6vw, 88px)", fontWeight: 400, lineHeight: 1.05,
    color: "#f8fafc", marginBottom: 12,
    textShadow: "0 0 80px rgba(167,139,250,0.2)",
  },
  heroTitle: {
    fontSize: 20, color: "#a78bfa", fontWeight: 600, marginBottom: 16,
    letterSpacing: "0.02em",
  },
  heroBio: { fontSize: 17, color: "#94a3b8", lineHeight: 1.7, marginBottom: 36, maxWidth: 480 },
  heroCTAs: { display: "flex", gap: 16 },
  ctaPrimary: {
    background: "linear-gradient(135deg, #a78bfa, #60a5fa)", color: "#fff",
    padding: "14px 32px", borderRadius: 8, textDecoration: "none",
    fontWeight: 700, fontSize: 15, letterSpacing: "0.02em",
    boxShadow: "0 4px 24px rgba(167,139,250,0.4)",
  },
  ctaSecondary: {
    border: "1px solid rgba(255,255,255,0.15)", color: "#e2e8f0",
    padding: "14px 32px", borderRadius: 8, textDecoration: "none",
    fontWeight: 600, fontSize: 15,
  },
  heroVisual: { flex: "0 0 auto", display: "flex", alignItems: "center", justifyContent: "center" },
  heroCard: {
    background: "rgba(255,255,255,0.04)", backdropFilter: "blur(20px)",
    border: "1px solid rgba(255,255,255,0.1)", borderRadius: 24,
    padding: 48, animation: "float 6s ease-in-out infinite",
    boxShadow: "0 8px 40px rgba(167,139,250,0.15)",
  },
  heroCardInner: { display: "flex", flexDirection: "column", alignItems: "center", gap: 28 },
  heroAvatar: {
    width: 100, height: 100, borderRadius: "50%",
    background: "linear-gradient(135deg, #a78bfa, #60a5fa)",
    display: "flex", alignItems: "center", justifyContent: "center",
    fontSize: 42, fontWeight: 700, color: "#fff",
    boxShadow: "0 0 40px rgba(167,139,250,0.5)",
  },
  heroCardStats: { display: "flex", gap: 24, alignItems: "center" },
  stat: { display: "flex", flexDirection: "column", alignItems: "center", gap: 4 },
  statNum: { fontSize: 28, fontWeight: 800, color: "#f8fafc" },
  statLabel: { fontSize: 12, color: "#64748b", textTransform: "uppercase", letterSpacing: "0.08em" },
  statDivider: { width: 1, height: 40, background: "rgba(255,255,255,0.1)" },
  section: {
    padding: "100px 60px", position: "relative", zIndex: 1,
    borderTop: "1px solid rgba(255,255,255,0.04)",
  },
  sectionHeader: { marginBottom: 56, display: "flex", flexDirection: "column", gap: 8 },
  sectionTag: {
    fontSize: 12, fontWeight: 700, color: "#a78bfa",
    textTransform: "uppercase", letterSpacing: "0.14em",
  },
  sectionTitle: {
    fontFamily: "'DM Serif Display', serif",
    fontSize: "clamp(36px, 4vw, 56px)", fontWeight: 400, color: "#f8fafc", lineHeight: 1.1,
  },
  skillsGrid: { display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: 20 },
  skillCard: {
    background: "rgba(255,255,255,0.04)", backdropFilter: "blur(16px)",
    border: "1px solid rgba(255,255,255,0.08)", borderRadius: 16, padding: 24,
    boxShadow: "0 4px 20px rgba(0,0,0,0.2)",
  },
  skillTop: { display: "flex", alignItems: "center", gap: 10, marginBottom: 12 },
  skillIcon: { fontSize: 20 },
  skillName: { fontWeight: 600, flex: 1, color: "#e2e8f0" },
  skillPct: { color: "#a78bfa", fontWeight: 700, fontSize: 14 },
  skillBar: { height: 4, background: "rgba(255,255,255,0.08)", borderRadius: 4, overflow: "hidden", marginBottom: 12 },
  skillBarFill: { height: "100%", background: "linear-gradient(90deg, #a78bfa, #60a5fa)", borderRadius: 4 },
  skillDesc: { fontSize: 13, color: "#64748b", lineHeight: 1.5 },
  projectsGrid: { display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(380px, 1fr))", gap: 24 },
  projectCard: {
    background: "rgba(255,255,255,0.04)", backdropFilter: "blur(16px)",
    border: "1px solid rgba(255,255,255,0.08)", borderRadius: 20, padding: 32,
    boxShadow: "0 4px 20px rgba(0,0,0,0.2)",
  },
  projectCardFeatured: {
    background: "rgba(167,139,250,0.06)", border: "1px solid rgba(167,139,250,0.2)",
    gridColumn: "1 / -1",
  },
  projectNum: { fontSize: 48, fontWeight: 900, color: "rgba(167,139,250,0.15)", lineHeight: 1, marginBottom: 12 },
  projectTitle: { fontSize: 22, fontWeight: 700, color: "#f8fafc", marginBottom: 10 },
  projectDesc: { fontSize: 15, color: "#94a3b8", lineHeight: 1.6, marginBottom: 20 },
  techstack: { display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 20 },
  techTag: {
    background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)",
    padding: "4px 12px", borderRadius: 100, fontSize: 12, color: "#94a3b8", fontWeight: 500,
  },
  projectLinks: { display: "flex", gap: 12, alignItems: "center" },
  projectLink: { color: "#64748b", textDecoration: "none", fontSize: 13, fontWeight: 600 },
  projectLinkPrimary: {
    background: "linear-gradient(135deg, #a78bfa, #60a5fa)", color: "#fff",
    padding: "8px 20px", borderRadius: 8, textDecoration: "none",
    fontSize: 13, fontWeight: 700, boxShadow: "0 4px 20px rgba(167,139,250,0.3)",
  },
  timeline: { display: "flex", flexDirection: "column", gap: 0, paddingLeft: 32 },
  timelineItem: { position: "relative", paddingLeft: 32, paddingBottom: 40 },
  timelineLine: {
    position: "absolute", left: 0, top: 20, bottom: 0, width: 1,
    background: "rgba(167,139,250,0.2)",
  },
  timelineDot: {
    position: "absolute", left: -5, top: 20, width: 12, height: 12,
    borderRadius: "50%", background: "linear-gradient(135deg, #a78bfa, #60a5fa)",
    boxShadow: "0 0 12px rgba(167,139,250,0.6)",
  },
  timelineCard: {
    background: "rgba(255,255,255,0.04)", backdropFilter: "blur(16px)",
    border: "1px solid rgba(255,255,255,0.08)", borderRadius: 16, padding: 24,
  },
  timelineHeader: { display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12 },
  expRole: { fontSize: 20, fontWeight: 700, color: "#f8fafc", marginBottom: 4 },
  expCompany: { fontSize: 15, color: "#a78bfa", fontWeight: 600 },
  expDates: { fontSize: 13, color: "#64748b" },
  expDesc: { fontSize: 15, color: "#94a3b8", lineHeight: 1.6, marginBottom: 12 },
  expPoints: { paddingLeft: 16 },
  expPoint: { fontSize: 14, color: "#94a3b8", marginBottom: 6, lineHeight: 1.5 },
  blogGrid: { display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: 24 },
  blogCard: {
    background: "rgba(255,255,255,0.04)", backdropFilter: "blur(16px)",
    border: "1px solid rgba(255,255,255,0.08)", borderRadius: 16, padding: 28,
  },
  blogCategory: {
    fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em",
    color: "#a78bfa", background: "rgba(167,139,250,0.1)", padding: "4px 10px",
    borderRadius: 100, display: "inline-block", marginBottom: 14,
  },
  blogTitle: { fontSize: 18, fontWeight: 700, color: "#f8fafc", marginBottom: 10, lineHeight: 1.4 },
  blogExcerpt: { fontSize: 14, color: "#94a3b8", lineHeight: 1.6, marginBottom: 16 },
  blogMeta: { fontSize: 13, color: "#475569" },
  testimonialsGrid: { display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: 24 },
  testimonialCard: {
    background: "rgba(255,255,255,0.04)", backdropFilter: "blur(16px)",
    border: "1px solid rgba(255,255,255,0.08)", borderRadius: 16, padding: 28,
  },
  testimonialStars: { color: "#f59e0b", fontSize: 18, marginBottom: 12 },
  testimonialText: { fontSize: 15, color: "#94a3b8", lineHeight: 1.7, fontStyle: "italic", marginBottom: 20 },
  testimonialAuthor: { display: "flex", alignItems: "center", gap: 12 },
  testimonialAvatar: {
    width: 40, height: 40, borderRadius: "50%",
    background: "linear-gradient(135deg, #a78bfa, #60a5fa)",
    display: "flex", alignItems: "center", justifyContent: "center",
    fontSize: 16, fontWeight: 700, color: "#fff",
  },
  testimonialName: { fontSize: 15, fontWeight: 700, color: "#e2e8f0" },
  testimonialRole: { fontSize: 13, color: "#64748b" },
  contactGrid: { display: "grid", gridTemplateColumns: "1fr 1.5fr", gap: 60 },
  contactInfo: {},
  contactSubtext: { fontSize: 16, color: "#94a3b8", lineHeight: 1.7, marginBottom: 36 },
  contactItem: { marginBottom: 24 },
  contactLabel: { display: "block", fontSize: 11, color: "#475569", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 6, fontWeight: 700 },
  contactValue: { fontSize: 16, color: "#a78bfa", textDecoration: "none", fontWeight: 600 },
  socialLinks: { display: "flex", gap: 16, marginTop: 36, flexWrap: "wrap" },
  socialLink: {
    color: "#64748b", textDecoration: "none", fontSize: 14, fontWeight: 600,
    padding: "8px 16px", border: "1px solid rgba(255,255,255,0.1)",
    borderRadius: 8, display: "inline-flex", alignItems: "center",
  },
  contactForm: { display: "flex", flexDirection: "column", gap: 16 },
  input: {
    background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)",
    borderRadius: 10, padding: "14px 18px", color: "#e2e8f0", fontSize: 15,
    backdropFilter: "blur(10px)", fontFamily: "'Outfit', sans-serif",
  },
  textarea: {
    background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)",
    borderRadius: 10, padding: "14px 18px", color: "#e2e8f0", fontSize: 15,
    minHeight: 130, resize: "vertical", backdropFilter: "blur(10px)",
    fontFamily: "'Outfit', sans-serif",
  },
  submitBtn: {
    background: "linear-gradient(135deg, #a78bfa, #60a5fa)", color: "#fff",
    padding: "16px 32px", border: "none", borderRadius: 10,
    fontWeight: 700, fontSize: 16, cursor: "pointer",
    fontFamily: "'Outfit', sans-serif", letterSpacing: "0.02em",
    boxShadow: "0 4px 24px rgba(167,139,250,0.4)",
  },
  footer: { padding: "40px 60px", borderTop: "1px solid rgba(255,255,255,0.06)", display: "flex", justifyContent: "center", position: "relative", zIndex: 1 },
  footerGlass: {
    display: "flex", alignItems: "center", gap: 24,
  },
  footerText: { fontSize: 14, color: "#475569" },
};