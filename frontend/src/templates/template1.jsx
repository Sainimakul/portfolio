"use client";

import { usePortfolio } from "../../context/PortfolioContext";
import { sendContactMessage } from "../../service/api";
import { useState, useEffect, useRef } from "react";
import { success, error } from "../util/toast";

function formatDate(dateString) {
  if (!dateString) return "";
  const d = new Date(dateString);
  return d.toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" });
}
function truncate(str, n) {
  return str?.length > n ? str.substring(0, n - 1) + "…" : str;
}

export default function Template1() {
  const { portfolioData, loading } = usePortfolio();
  const [contactForm, setContactForm] = useState({ name: "", email: "", subject: "", message: "" });
  const [sending, setSending] = useState(false);
  const [visible, setVisible] = useState({});
  const sectionRefs = useRef({});

  const profile = portfolioData?.profile.data || {};
  const skills = portfolioData?.skills.data || [];
  const projects = portfolioData?.projects.data || [];
  const blogs = portfolioData?.blogs.data || [];
  const testimonials = portfolioData?.testimonials.data || [];
  const socialLinks = portfolioData?.SocialLinks.data || [];
  const experiences = portfolioData?.experiences.data || [];

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setVisible((prev) => ({ ...prev, [entry.target.dataset.id]: true }));
          }
        });
      },
      { threshold: 0.1 }
    );
    Object.values(sectionRefs.current).forEach((el) => el && observer.observe(el));
    return () => observer.disconnect();
  }, [loading]);

  function registerRef(id) {
    return (el) => {
      if (el) {
        el.dataset.id = id;
        sectionRefs.current[id] = el;
      }
    };
  }

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
      <div style={ls.wrap}>
        <style>{`@import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Barlow:wght@300;400;500;600&display=swap'); @keyframes spin{to{transform:rotate(360deg)}}`}</style>
        <div style={ls.diamond} />
        <span style={ls.text}>LOADING</span>
      </div>
    );
  }

  return (
    
    <div style={st.root}>
      <style>{GLOBAL_CSS}</style>

      {/* Geometric background decoration */}
      <div style={st.bgGrid} />
      <div style={st.bgDiag1} />
      <div style={st.bgDiag2} />

      {/* ─── NAVBAR ─── */}
      <nav style={st.nav}>
        <div style={st.navLogoWrap}>
          <div style={st.navLogoDiamond} />
          <span style={st.navLogo}>{profile?.name?.split(" ")[0] || "DEV"}</span>
        </div>
        <div style={st.navLinks}>
          {["Skills", "Projects", "Experience", "Blog", "Contact"].map((item) => (
            <a key={item} href={`#${item.toLowerCase()}`} style={st.navLink} className="t1-nav-link">
              {item}
            </a>
          ))}
        </div>
        <a href="#contact" style={st.navCTA} className="t1-cta-btn">
          Hire Me
        </a>
      </nav>

      {/* ─── HERO ─── */}
      <section style={st.hero}>
        <div style={st.heroInner}>
          {/* Left column */}
          <div style={st.heroLeft}>
            <div style={st.heroEyebrow}>
              <span style={st.heroEyebrowLine} />
              <span style={st.heroEyebrowText}>Available for work</span>
              <span style={st.heroEyebrowDot} />
            </div>

            <h1 style={st.heroName}>
              {(profile?.name || "Your Name").split(" ").map((word, i) => (
                <span key={i} style={{ display: "block", animationDelay: `${i * 0.12}s` }} className="t1-hero-word">
                  {word}
                </span>
              ))}
            </h1>

            <div style={st.heroTitleRow}>
              <div style={st.heroTitleLine} />
              <span style={st.heroTitleText}>{profile?.title || "Full Stack Developer"}</span>
            </div>

            <p style={st.heroBio}>{profile?.bio || "Building exceptional digital experiences with modern technologies and a passion for clean, performant code."}</p>

            <div style={st.heroCTAs}>
              <a href="#projects" style={st.heroPrimaryBtn} className="t1-primary-btn">View Work →</a>
              <a href="#contact" style={st.heroSecondaryBtn} className="t1-secondary-btn">Start Project</a>
            </div>

            {socialLinks.length > 0 && (
              <div style={st.heroSocials}>
                {socialLinks.map((link) => (
                  <a key={link.id} href={link.url} target="_blank" rel="noopener noreferrer" style={st.heroSocialLink} className="t1-social-link">
                    {link.platform}
                  </a>
                ))}
              </div>
            )}
          </div>

          {/* Right column — stat cards */}
          <div style={st.heroRight}>
            <div style={st.statStack}>
              {[
                { num: projects.length, label: "Projects", accent: GOLD },
                { num: skills.length, label: "Skills", accent: "#e2e8f0" },
                { num: experiences.length, label: "Roles", accent: GOLD },
              ].map((s, i) => (
                <div key={i} style={{ ...st.statCard, animationDelay: `${0.3 + i * 0.15}s` }} className="t1-stat-card">
                  <div style={{ ...st.statCardAccent, background: s.accent }} />
                  <span style={{ ...st.statNum, color: s.accent }}>{s.num}+</span>
                  <span style={st.statLabel}>{s.label}</span>
                </div>
              ))}
            </div>

            {/* Decorative geometric element */}
            <div style={st.heroDeco}>
              <div style={st.decoRing} className="t1-spin-slow" />
              <div style={st.decoRingInner} className="t1-spin-reverse" />
              <div style={st.decoCenter} />
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <div style={st.scrollIndicator}>
          <div style={st.scrollLine} className="t1-scroll-line" />
          <span style={st.scrollText}>SCROLL</span>
        </div>
      </section>

      {/* ─── SKILLS ─── */}
      {skills.length > 0 && (
        <section
          id="skills"
          style={st.section}
          ref={registerRef("skills")}
        >
          <div style={{ ...st.sectionInner, ...(visible.skills ? st.sectionVisible : {}) }} className="t1-section-reveal">
            <div style={st.sectionHeader}>
              <div style={st.sectionHeaderLeft}>
                <div style={st.sectionTagRow}>
                  <div style={st.sectionTagDiamond} />
                  <span style={st.sectionTag}>EXPERTISE</span>
                </div>
                <h2 style={st.sectionTitle}>Skills &amp; Tools</h2>
              </div>
              <div style={st.sectionHeaderLine} />
            </div>

            <div style={st.skillsGrid}>
              {skills.map((skill, i) => (
                <div
                  key={skill.id}
                  style={{ ...st.skillCard, animationDelay: `${i * 0.07}s` }}
                  className="t1-skill-card"
                >
                  <div style={st.skillTop}>
                    <span style={st.skillIcon}>{skill.icon}</span>
                    <span style={st.skillName}>{skill.name}</span>
                    <span style={st.skillPct}>{skill.percentage}<span style={st.skillPctSym}>%</span></span>
                  </div>
                  <div style={st.skillBarTrack}>
                    <div
                      style={{ ...st.skillBarFill, width: `${skill.percentage}%`, animationDelay: `${0.4 + i * 0.07}s` }}
                      className="t1-skill-bar"
                    />
                  </div>
                  {skill.description && (
                    <p style={st.skillDesc}>{skill.description}</p>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ─── PROJECTS ─── */}
      {projects.length > 0 && (
        <section id="projects" style={{ ...st.section, ...st.sectionAlt }} ref={registerRef("projects")}>
          <div style={{ ...st.sectionInner, ...(visible.projects ? st.sectionVisible : {}) }} className="t1-section-reveal">
            <div style={st.sectionHeader}>
              <div style={st.sectionHeaderLeft}>
                <div style={st.sectionTagRow}>
                  <div style={st.sectionTagDiamond} />
                  <span style={st.sectionTag}>PORTFOLIO</span>
                </div>
                <h2 style={st.sectionTitle}>Featured Work</h2>
              </div>
              <div style={st.sectionHeaderLine} />
            </div>

            <div style={st.projectsGrid}>
              {projects.map((p, i) => (
                <div
                  key={p.id}
                  style={{ ...st.projectCard, ...(i === 0 ? st.projectCardFeatured : {}), animationDelay: `${i * 0.1}s` }}
                  className="t1-project-card"
                >
                  {/* Corner accent */}
                  <div style={st.projectCorner} />
                  <div style={st.projectCornerBR} />

                  <div style={st.projectIndex}>
                    {String(i + 1).padStart(2, "0")}
                  </div>

                  <h3 style={{ ...st.projectTitle, ...(i === 0 ? st.projectTitleLarge : {}) }}>
                    {p.title}
                  </h3>

                  <p style={st.projectDesc}>{p.description}</p>

                  {p.techstack?.length > 0 && (
                    <div style={st.techRow}>
                      {p.techstack.map((t, j) => (
                        <span key={j} style={st.techChip}>{t}</span>
                      ))}
                    </div>
                  )}

                  <div style={st.projectLinks}>
                    {p.github_link && (
                      <a href={p.github_link} target="_blank" style={st.projLinkGhost} className="t1-ghost-btn">
                        GitHub ↗
                      </a>
                    )}
                    {p.live_link && (
                      <a href={p.live_link} target="_blank" style={st.projLinkGold} className="t1-gold-btn">
                        Live Demo ↗
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ─── EXPERIENCE ─── */}
      {experiences.length > 0 && (
        <section id="experience" style={st.section} ref={registerRef("experience")}>
          <div style={{ ...st.sectionInner, ...(visible.experience ? st.sectionVisible : {}) }} className="t1-section-reveal">
            <div style={st.sectionHeader}>
              <div style={st.sectionHeaderLeft}>
                <div style={st.sectionTagRow}>
                  <div style={st.sectionTagDiamond} />
                  <span style={st.sectionTag}>CAREER</span>
                </div>
                <h2 style={st.sectionTitle}>Experience</h2>
              </div>
              <div style={st.sectionHeaderLine} />
            </div>

            <div style={st.expList}>
              {experiences.map((exp, i) => (
                <div key={exp.id} style={st.expItem} className="t1-exp-item">
                  <div style={st.expTimeDot}>
                    <div style={st.expDot} />
                    {i < experiences.length - 1 && <div style={st.expDotLine} />}
                  </div>
                  <div style={st.expCard}>
                    <div style={st.expCardTop}>
                      <div>
                        <h3 style={st.expRole}>{exp.role}</h3>
                        <div style={st.expCompany}>{exp.company}</div>
                      </div>
                      <div style={st.expDates}>
                        {formatDate(exp.start_date)} — {exp.is_current === "true" ? <span style={st.expPresent}>Present</span> : formatDate(exp.end_date)}
                      </div>
                    </div>
                    {exp.description && <p style={st.expDesc}>{exp.description}</p>}
                    {exp.points?.length > 0 && (
                      <ul style={st.expPoints}>
                        {exp.points.map((pt, j) => (
                          <li key={j} style={st.expPoint}>
                            <span style={st.expBullet}>◆</span>
                            {pt}
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ─── BLOG ─── */}
      {blogs.length > 0 && (
        <section id="blog" style={{ ...st.section, ...st.sectionAlt }} ref={registerRef("blog")}>
          <div style={{ ...st.sectionInner, ...(visible.blog ? st.sectionVisible : {}) }} className="t1-section-reveal">
            <div style={st.sectionHeader}>
              <div style={st.sectionHeaderLeft}>
                <div style={st.sectionTagRow}>
                  <div style={st.sectionTagDiamond} />
                  <span style={st.sectionTag}>WRITING</span>
                </div>
                <h2 style={st.sectionTitle}>Blog</h2>
              </div>
              <div style={st.sectionHeaderLine} />
            </div>

            <div style={st.blogGrid}>
              {blogs.map((blog, i) => (
                <div key={blog.id} style={st.blogCard} className="t1-blog-card">
                  <div style={st.blogCardTop}>
                    <span style={st.blogCat}>{blog.category || "General"}</span>
                    <span style={st.blogDate}>{formatDate(blog.publish_date)}</span>
                  </div>
                  <h3 style={st.blogTitle}>{blog.title}</h3>
                  <p style={st.blogExcerpt}>{truncate(blog.excerpt, 130)}</p>
                  <div style={st.blogFooter}>
                    <div style={st.blogReadMore}>Read Article <span style={st.blogArrow}>→</span></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ─── TESTIMONIALS ─── */}
      {testimonials.length > 0 && (
        <section style={st.section} ref={registerRef("testimonials")}>
          <div style={{ ...st.sectionInner, ...(visible.testimonials ? st.sectionVisible : {}) }} className="t1-section-reveal">
            <div style={st.sectionHeader}>
              <div style={st.sectionHeaderLeft}>
                <div style={st.sectionTagRow}>
                  <div style={st.sectionTagDiamond} />
                  <span style={st.sectionTag}>FEEDBACK</span>
                </div>
                <h2 style={st.sectionTitle}>Testimonials</h2>
              </div>
              <div style={st.sectionHeaderLine} />
            </div>

            <div style={st.testGrid}>
              {testimonials.map((t) => (
                <div key={t.id} style={st.testCard} className="t1-test-card">
                  <div style={st.testStars}>
                    {Array.from({ length: t.rating }).map((_, i) => (
                      <span key={i} style={st.testStar}>★</span>
                    ))}
                  </div>
                  <p style={st.testText}>"{t.review}"</p>
                  <div style={st.testAuthor}>
                    <div style={st.testAvatar}>{t.name?.[0]}</div>
                    <div>
                      <div style={st.testName}>{t.name}</div>
                      <div style={st.testRole}>{t.role} @ {t.company}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ─── CONTACT ─── */}
      <section id="contact" style={{ ...st.section, ...st.sectionContact }} ref={registerRef("contact")}>
        <div style={{ ...st.sectionInner, ...(visible.contact ? st.sectionVisible : {}) }} className="t1-section-reveal">
          <div style={st.sectionHeader}>
            <div style={st.sectionHeaderLeft}>
              <div style={st.sectionTagRow}>
                <div style={st.sectionTagDiamond} />
                <span style={st.sectionTag}>GET IN TOUCH</span>
              </div>
              <h2 style={st.sectionTitle}>Let's Build<br />Something <em style={st.sectionTitleItalic}>Great</em></h2>
            </div>
            <div style={st.sectionHeaderLine} />
          </div>

          <div style={st.contactGrid}>
            {/* Info */}
            <div style={st.contactInfo}>
              <p style={st.contactSubtext}>
                Have a project in mind? Let's collaborate and craft something that stands out from the crowd.
              </p>

              {profile.email && (
                <div style={st.contactDetail}>
                  <span style={st.contactDetailIcon}>✉</span>
                  <div>
                    <div style={st.contactDetailLabel}>Email</div>
                    <a href={`mailto:${profile.email}`} style={st.contactDetailValue}>{profile.email}</a>
                  </div>
                </div>
              )}

              {profile.location && (
                <div style={st.contactDetail}>
                  <span style={st.contactDetailIcon}>◎</span>
                  <div>
                    <div style={st.contactDetailLabel}>Location</div>
                    <div style={st.contactDetailValuePlain}>{profile.location}</div>
                  </div>
                </div>
              )}

              {socialLinks.length > 0 && (
                <div style={st.contactSocials}>
                  {socialLinks.map((link) => (
                    <a key={link.id} href={link.url} target="_blank" rel="noopener noreferrer" style={st.contactSocialLink} className="t1-social-pill">
                      {link.platform}
                    </a>
                  ))}
                </div>
              )}
            </div>

            {/* Form */}
            <form onSubmit={handleContact} style={st.form}>
              <div style={st.formRow}>
                <div style={st.formField}>
                  <label style={st.formLabel}>Name</label>
                  <input
                    required
                    placeholder="John Doe"
                    value={contactForm.name}
                    onChange={(e) => setContactForm({ ...contactForm, name: e.target.value })}
                    style={st.formInput}
                    className="t1-form-input"
                  />
                </div>
                <div style={st.formField}>
                  <label style={st.formLabel}>Email</label>
                  <input
                    required
                    type="email"
                    placeholder="john@example.com"
                    value={contactForm.email}
                    onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })}
                    style={st.formInput}
                    className="t1-form-input"
                  />
                </div>
              </div>
              <div style={st.formField}>
                <label style={st.formLabel}>Subject</label>
                <input
                  placeholder="Project inquiry"
                  value={contactForm.subject}
                  onChange={(e) => setContactForm({ ...contactForm, subject: e.target.value })}
                  style={st.formInput}
                  className="t1-form-input"
                />
              </div>
              <div style={st.formField}>
                <label style={st.formLabel}>Message</label>
                <textarea
                  required
                  placeholder="Tell me about your project..."
                  value={contactForm.message}
                  onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })}
                  style={st.formTextarea}
                  className="t1-form-input"
                />
              </div>
              <button disabled={sending} style={st.formSubmit} className="t1-submit-btn">
                <span>{sending ? "Sending..." : "Send Message"}</span>
                <span style={st.formSubmitArrow}>→</span>
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* ─── FOOTER ─── */}
      <footer style={st.footer}>
        <div style={st.footerInner}>
          <div style={st.footerLeft}>
            <div style={st.footerLogoDiamond} />
            <span style={st.footerName}>{profile?.name || "Portfolio"}</span>
          </div>
          <div style={st.footerCenter}>
            © {new Date().getFullYear()} · Crafted with precision
          </div>
          <div style={st.footerRight}>
            {socialLinks.map((link) => (
              <a key={link.id} href={link.url} target="_blank" rel="noopener noreferrer" style={st.footerLink} className="t1-footer-link">
                {link.platform}
              </a>
            ))}
          </div>
        </div>
      </footer>
    </div>
  );
}

/* ─── COLORS ─── */
const DARK = "#0e0f14";
const DARK2 = "#13141b";
const DARK3 = "#1a1c27";
const GOLD = "#c9a94a";
const GOLD_LIGHT = "#e8c96a";
const BORDER = "rgba(201,169,74,0.18)";
const BORDER2 = "rgba(255,255,255,0.06)";
const TEXT = "#e2e4ef";
const MUTED = "#7a7f9a";

/* ─── LOADING STYLES ─── */
const ls = {
  wrap: { minHeight: "100vh", background: DARK, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 20 },
  diamond: { width: 48, height: 48, background: GOLD, transform: "rotate(45deg)", animation: "spin 1.5s linear infinite" },
  text: { fontFamily: "'Bebas Neue', sans-serif", fontSize: 18, color: GOLD, letterSpacing: "0.3em" },
};

/* ─── GLOBAL CSS ─── */
const GLOBAL_CSS = `
@import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Barlow:ital,wght@0,300;0,400;0,500;0,600;0,700;1,300;1,400&family=Barlow+Condensed:wght@300;400;500;600;700&display=swap');

*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
html { scroll-behavior: smooth; }
::-webkit-scrollbar { width: 4px; background: ${DARK}; }
::-webkit-scrollbar-thumb { background: ${GOLD}; }

/* Hero word reveal */
@keyframes heroWordReveal {
  from { opacity: 0; transform: translateY(40px) skewY(3deg); }
  to   { opacity: 1; transform: translateY(0) skewY(0deg); }
}
.t1-hero-word {
  opacity: 0;
  animation: heroWordReveal 0.8s cubic-bezier(0.16, 1, 0.3, 1) both;
}

/* Section reveal */
@keyframes sectionReveal {
  from { opacity: 0; transform: translateY(32px); }
  to   { opacity: 1; transform: translateY(0); }
}
.t1-section-reveal {
  opacity: 0;
  transition: opacity 0.8s ease, transform 0.8s cubic-bezier(0.16,1,0.3,1);
  transform: translateY(32px);
}

/* Skill bar */
@keyframes skillGrow {
  from { width: 0 !important; }
}
.t1-skill-bar {
  animation: skillGrow 1.4s cubic-bezier(0.4, 0, 0.2, 1) both;
}

/* Scroll line */
@keyframes scrollLine {
  0%   { height: 0; opacity: 1; }
  50%  { height: 48px; opacity: 1; }
  100% { height: 48px; opacity: 0; }
}
.t1-scroll-line {
  animation: scrollLine 2.2s ease-in-out infinite;
}

/* Spin animations */
@keyframes spinSlow { to { transform: rotate(360deg); } }
@keyframes spinReverse { to { transform: rotate(-360deg); } }
.t1-spin-slow    { animation: spinSlow    12s linear infinite; }
.t1-spin-reverse { animation: spinReverse  8s linear infinite; }

/* Navbar link */
.t1-nav-link {
  position: relative;
  transition: color 0.25s;
}
.t1-nav-link::after {
  content: '';
  position: absolute;
  bottom: -3px; left: 0;
  width: 0; height: 1px;
  background: ${GOLD};
  transition: width 0.35s cubic-bezier(0.4, 0, 0.2, 1);
}
.t1-nav-link:hover { color: ${GOLD} !important; }
.t1-nav-link:hover::after { width: 100%; }

/* CTA button */
.t1-cta-btn {
  transition: background 0.25s, color 0.25s, transform 0.2s, box-shadow 0.25s;
}
.t1-cta-btn:hover {
  background: ${GOLD_LIGHT} !important;
  transform: translateY(-2px);
  box-shadow: 0 8px 24px rgba(201,169,74,0.35) !important;
}

/* Primary / secondary hero btns */
.t1-primary-btn {
  transition: all 0.25s;
}
.t1-primary-btn:hover {
  background: ${GOLD_LIGHT} !important;
  transform: translateY(-2px);
  box-shadow: 0 8px 28px rgba(201,169,74,0.4) !important;
}
.t1-secondary-btn {
  transition: all 0.25s;
}
.t1-secondary-btn:hover {
  border-color: ${GOLD} !important;
  color: ${GOLD} !important;
  background: rgba(201,169,74,0.06) !important;
}

/* Social link */
.t1-social-link {
  transition: color 0.2s, letter-spacing 0.2s;
}
.t1-social-link:hover { color: ${GOLD} !important; letter-spacing: 0.12em; }

/* Stat card */
.t1-stat-card {
  transition: transform 0.3s, box-shadow 0.3s;
}
.t1-stat-card:hover {
  transform: translateX(-4px);
  box-shadow: 4px 0 24px rgba(201,169,74,0.15) !important;
}

/* Skill card */
.t1-skill-card {
  transition: transform 0.3s, border-color 0.3s, box-shadow 0.3s;
}
.t1-skill-card:hover {
  transform: translateY(-4px);
  border-color: rgba(201,169,74,0.5) !important;
  box-shadow: 0 12px 36px rgba(0,0,0,0.4) !important;
}

/* Project card */
.t1-project-card {
  transition: transform 0.35s, border-color 0.3s, box-shadow 0.35s;
}
.t1-project-card:hover {
  transform: translateY(-6px);
  border-color: rgba(201,169,74,0.4) !important;
  box-shadow: 0 20px 48px rgba(0,0,0,0.5) !important;
}

/* Ghost / gold btns */
.t1-ghost-btn { transition: all 0.2s; }
.t1-ghost-btn:hover {
  border-color: rgba(255,255,255,0.4) !important;
  color: #fff !important;
}
.t1-gold-btn { transition: all 0.2s; }
.t1-gold-btn:hover {
  background: ${GOLD_LIGHT} !important;
  box-shadow: 0 6px 20px rgba(201,169,74,0.4) !important;
}

/* Blog card */
.t1-blog-card {
  transition: transform 0.3s, box-shadow 0.3s;
}
.t1-blog-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 16px 40px rgba(0,0,0,0.5) !important;
}

/* Testimonial card */
.t1-test-card {
  transition: transform 0.3s, border-color 0.3s;
}
.t1-test-card:hover {
  transform: translateY(-4px);
  border-color: rgba(201,169,74,0.35) !important;
}

/* Experience item */
.t1-exp-item {
  transition: transform 0.2s;
}
.t1-exp-item:hover { transform: translateX(4px); }

/* Form input */
.t1-form-input {
  transition: border-color 0.25s, box-shadow 0.25s;
  outline: none;
}
.t1-form-input:focus {
  border-color: ${GOLD} !important;
  box-shadow: 0 0 0 3px rgba(201,169,74,0.12) !important;
}

/* Submit button */
.t1-submit-btn {
  transition: all 0.25s;
}
.t1-submit-btn:hover {
  background: ${GOLD_LIGHT} !important;
  transform: translateY(-2px);
  box-shadow: 0 10px 30px rgba(201,169,74,0.35) !important;
}

/* Social pill */
.t1-social-pill {
  transition: all 0.2s;
}
.t1-social-pill:hover {
  background: rgba(201,169,74,0.15) !important;
  border-color: ${GOLD} !important;
  color: ${GOLD} !important;
}

/* Footer link */
.t1-footer-link {
  transition: color 0.2s;
}
.t1-footer-link:hover { color: ${GOLD} !important; }
`;

/* ─── COMPONENT STYLES ─── */
const st = {
  root: {
    fontFamily: "'Barlow', sans-serif",
    background: DARK,
    color: TEXT,
    minHeight: "100vh",
    position: "relative",
    overflowX: "hidden",
  },

  /* Background decoration */
  bgGrid: {
    position: "fixed",
    inset: 0,
    backgroundImage: `
      linear-gradient(rgba(201,169,74,0.03) 1px, transparent 1px),
      linear-gradient(90deg, rgba(201,169,74,0.03) 1px, transparent 1px)
    `,
    backgroundSize: "60px 60px",
    pointerEvents: "none",
    zIndex: 0,
  },
  bgDiag1: {
    position: "fixed",
    top: "-30%",
    right: "-20%",
    width: "70vw",
    height: "70vw",
    borderRadius: "50%",
    background: "radial-gradient(circle, rgba(201,169,74,0.04) 0%, transparent 60%)",
    pointerEvents: "none",
    zIndex: 0,
  },
  bgDiag2: {
    position: "fixed",
    bottom: "-20%",
    left: "-15%",
    width: "50vw",
    height: "50vw",
    borderRadius: "50%",
    background: "radial-gradient(circle, rgba(201,169,74,0.03) 0%, transparent 60%)",
    pointerEvents: "none",
    zIndex: 0,
  },

  /* NAV */
  nav: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "20px 72px",
    position: "sticky",
    top: 0,
    zIndex: 200,
    background: "rgba(14,15,20,0.88)",
    backdropFilter: "blur(20px)",
    borderBottom: `1px solid ${BORDER}`,
  },
  navLogoWrap: { display: "flex", alignItems: "center", gap: 10 },
  navLogoDiamond: {
    width: 10,
    height: 10,
    background: GOLD,
    transform: "rotate(45deg)",
    flexShrink: 0,
  },
  navLogo: {
    fontFamily: "'Bebas Neue', sans-serif",
    fontSize: 24,
    letterSpacing: "0.12em",
    color: "#fff",
  },
  navLinks: { display: "flex", gap: 36 },
  navLink: {
    color: MUTED,
    textDecoration: "none",
    fontSize: 13,
    fontWeight: 500,
    letterSpacing: "0.07em",
    textTransform: "uppercase",
  },
  navCTA: {
    background: GOLD,
    color: "#0e0f14",
    padding: "9px 24px",
    textDecoration: "none",
    fontWeight: 700,
    fontSize: 13,
    letterSpacing: "0.08em",
    textTransform: "uppercase",
  },

  /* HERO */
  hero: {
    position: "relative",
    zIndex: 1,
    minHeight: "92vh",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    padding: "80px 72px 60px",
    borderBottom: `1px solid ${BORDER}`,
  },
  heroInner: {
    display: "grid",
    gridTemplateColumns: "1fr 400px",
    gap: 60,
    alignItems: "center",
  },
  heroLeft: {},
  heroEyebrow: {
    display: "flex",
    alignItems: "center",
    gap: 12,
    marginBottom: 28,
  },
  heroEyebrowLine: {
    display: "block",
    width: 40,
    height: 1,
    background: GOLD,
  },
  heroEyebrowText: {
    fontSize: 12,
    fontWeight: 600,
    letterSpacing: "0.2em",
    textTransform: "uppercase",
    color: GOLD,
  },
  heroEyebrowDot: {
    display: "block",
    width: 6,
    height: 6,
    borderRadius: "50%",
    background: GOLD,
    boxShadow: `0 0 10px ${GOLD}`,
  },
  heroName: {
    fontFamily: "'Bebas Neue', sans-serif",
    fontSize: "clamp(64px, 9vw, 128px)",
    lineHeight: 0.92,
    letterSpacing: "0.02em",
    color: "#fff",
    marginBottom: 20,
  },
  heroTitleRow: {
    display: "flex",
    alignItems: "center",
    gap: 16,
    marginBottom: 28,
  },
  heroTitleLine: {
    width: 48,
    height: 3,
    background: GOLD,
  },
  heroTitleText: {
    fontFamily: "'Barlow Condensed', sans-serif",
    fontSize: 18,
    fontWeight: 600,
    letterSpacing: "0.14em",
    textTransform: "uppercase",
    color: GOLD,
  },
  heroBio: {
    fontSize: 17,
    lineHeight: 1.75,
    color: MUTED,
    maxWidth: 520,
    fontWeight: 300,
    marginBottom: 40,
  },
  heroCTAs: {
    display: "flex",
    gap: 16,
    marginBottom: 40,
  },
  heroPrimaryBtn: {
    background: GOLD,
    color: "#0e0f14",
    padding: "14px 36px",
    textDecoration: "none",
    fontWeight: 700,
    fontSize: 14,
    letterSpacing: "0.06em",
    textTransform: "uppercase",
  },
  heroSecondaryBtn: {
    border: `1px solid ${BORDER}`,
    color: TEXT,
    padding: "14px 36px",
    textDecoration: "none",
    fontWeight: 500,
    fontSize: 14,
    letterSpacing: "0.06em",
    textTransform: "uppercase",
  },
  heroSocials: {
    display: "flex",
    gap: 24,
  },
  heroSocialLink: {
    color: MUTED,
    textDecoration: "none",
    fontSize: 12,
    fontWeight: 600,
    letterSpacing: "0.1em",
    textTransform: "uppercase",
  },

  /* Stat cards */
  heroRight: {
    display: "flex",
    flexDirection: "column",
    gap: 28,
    alignItems: "flex-end",
  },
  statStack: {
    display: "flex",
    flexDirection: "column",
    gap: 12,
    width: "100%",
  },
  statCard: {
    background: DARK2,
    border: `1px solid ${BORDER}`,
    padding: "20px 28px",
    display: "flex",
    alignItems: "center",
    gap: 16,
    position: "relative",
    overflow: "hidden",
  },
  statCardAccent: {
    position: "absolute",
    left: 0,
    top: 0,
    bottom: 0,
    width: 3,
  },
  statNum: {
    fontFamily: "'Bebas Neue', sans-serif",
    fontSize: 48,
    lineHeight: 1,
  },
  statLabel: {
    fontFamily: "'Barlow Condensed', sans-serif",
    fontSize: 14,
    fontWeight: 500,
    letterSpacing: "0.14em",
    textTransform: "uppercase",
    color: MUTED,
  },

  /* Deco */
  heroDeco: {
    position: "relative",
    width: 140,
    height: 140,
    alignSelf: "flex-end",
  },
  decoRing: {
    position: "absolute",
    inset: 0,
    border: `1px solid ${BORDER}`,
    borderRadius: "50%",
    borderTopColor: GOLD,
  },
  decoRingInner: {
    position: "absolute",
    inset: 20,
    border: `1px solid ${BORDER}`,
    borderRadius: "50%",
    borderRightColor: `rgba(201,169,74,0.5)`,
  },
  decoCenter: {
    position: "absolute",
    top: "50%",
    left: "50%",
    width: 16,
    height: 16,
    background: GOLD,
    transform: "translate(-50%, -50%) rotate(45deg)",
  },

  /* Scroll indicator */
  scrollIndicator: {
    position: "absolute",
    bottom: 32,
    left: 72,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: 8,
  },
  scrollLine: {
    width: 1,
    background: GOLD,
    height: 0,
  },
  scrollText: {
    fontFamily: "'Barlow Condensed', sans-serif",
    fontSize: 10,
    letterSpacing: "0.25em",
    color: MUTED,
    writingMode: "vertical-rl",
    textTransform: "uppercase",
  },

  /* SECTION BASE */
  section: {
    position: "relative",
    zIndex: 1,
    padding: "100px 72px",
    borderBottom: `1px solid ${BORDER2}`,
  },
  sectionAlt: {
    background: DARK2,
  },
  sectionContact: {
    background: DARK3,
  },
  sectionInner: {},
  sectionVisible: {
    opacity: 1,
    transform: "translateY(0)",
  },
  sectionHeader: {
    display: "flex",
    alignItems: "flex-end",
    gap: 32,
    marginBottom: 64,
  },
  sectionHeaderLeft: {},
  sectionTagRow: {
    display: "flex",
    alignItems: "center",
    gap: 8,
    marginBottom: 8,
  },
  sectionTagDiamond: {
    width: 8,
    height: 8,
    background: GOLD,
    transform: "rotate(45deg)",
    flexShrink: 0,
  },
  sectionTag: {
    fontFamily: "'Barlow Condensed', sans-serif",
    fontSize: 11,
    fontWeight: 700,
    letterSpacing: "0.22em",
    textTransform: "uppercase",
    color: GOLD,
  },
  sectionTitle: {
    fontFamily: "'Bebas Neue', sans-serif",
    fontSize: "clamp(44px, 5vw, 68px)",
    letterSpacing: "0.03em",
    color: "#fff",
    lineHeight: 1,
  },
  sectionTitleItalic: {
    fontFamily: "'Barlow', sans-serif",
    fontStyle: "italic",
    fontWeight: 300,
    color: GOLD,
  },
  sectionHeaderLine: {
    flex: 1,
    height: 1,
    background: `linear-gradient(90deg, ${BORDER}, transparent)`,
    marginBottom: 8,
  },

  /* SKILLS */
  skillsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
    gap: 16,
  },
  skillCard: {
    background: DARK3,
    border: `1px solid ${BORDER2}`,
    padding: "22px 24px",
  },
  skillTop: {
    display: "flex",
    alignItems: "center",
    gap: 10,
    marginBottom: 14,
  },
  skillIcon: { fontSize: 20 },
  skillName: {
    flex: 1,
    fontWeight: 600,
    fontSize: 15,
    color: TEXT,
  },
  skillPct: {
    fontFamily: "'Bebas Neue', sans-serif",
    fontSize: 26,
    color: GOLD,
    lineHeight: 1,
  },
  skillPctSym: {
    fontSize: 14,
    color: MUTED,
  },
  skillBarTrack: {
    height: 3,
    background: "rgba(255,255,255,0.06)",
    marginBottom: 14,
    overflow: "hidden",
  },
  skillBarFill: {
    height: "100%",
    background: `linear-gradient(90deg, ${GOLD}, ${GOLD_LIGHT})`,
  },
  skillDesc: {
    fontSize: 13,
    color: MUTED,
    lineHeight: 1.6,
  },

  /* PROJECTS */
  projectsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(380px, 1fr))",
    gap: 24,
  },
  projectCard: {
    background: DARK,
    border: `1px solid ${BORDER2}`,
    padding: "36px 32px",
    position: "relative",
    overflow: "hidden",
  },
  projectCardFeatured: {
    border: `1px solid ${BORDER}`,
    background: "rgba(201,169,74,0.03)",
    gridColumn: "1 / -1",
  },
  projectCorner: {
    position: "absolute",
    top: 0,
    left: 0,
    width: 32,
    height: 32,
    borderTop: `2px solid ${GOLD}`,
    borderLeft: `2px solid ${GOLD}`,
  },
  projectCornerBR: {
    position: "absolute",
    bottom: 0,
    right: 0,
    width: 32,
    height: 32,
    borderBottom: `2px solid rgba(201,169,74,0.3)`,
    borderRight: `2px solid rgba(201,169,74,0.3)`,
  },
  projectIndex: {
    fontFamily: "'Bebas Neue', sans-serif",
    fontSize: 64,
    color: "rgba(201,169,74,0.12)",
    lineHeight: 1,
    marginBottom: 8,
  },
  projectTitle: {
    fontFamily: "'Bebas Neue', sans-serif",
    fontSize: 26,
    letterSpacing: "0.04em",
    color: "#fff",
    marginBottom: 12,
  },
  projectTitleLarge: {
    fontSize: 38,
  },
  projectDesc: {
    fontSize: 15,
    color: MUTED,
    lineHeight: 1.7,
    marginBottom: 20,
    fontWeight: 300,
  },
  techRow: {
    display: "flex",
    flexWrap: "wrap",
    gap: 8,
    marginBottom: 24,
  },
  techChip: {
    border: `1px solid ${BORDER}`,
    padding: "4px 12px",
    fontSize: 12,
    color: MUTED,
    fontWeight: 500,
    letterSpacing: "0.04em",
  },
  projectLinks: {
    display: "flex",
    gap: 12,
  },
  projLinkGhost: {
    border: `1px solid rgba(255,255,255,0.15)`,
    color: MUTED,
    padding: "9px 20px",
    textDecoration: "none",
    fontSize: 13,
    fontWeight: 600,
    letterSpacing: "0.06em",
  },
  projLinkGold: {
    background: GOLD,
    color: "#0e0f14",
    padding: "9px 20px",
    textDecoration: "none",
    fontSize: 13,
    fontWeight: 700,
    letterSpacing: "0.06em",
  },

  /* EXPERIENCE */
  expList: {
    display: "flex",
    flexDirection: "column",
    gap: 0,
  },
  expItem: {
    display: "flex",
    gap: 24,
    paddingBottom: 0,
  },
  expTimeDot: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    flexShrink: 0,
    paddingTop: 6,
  },
  expDot: {
    width: 12,
    height: 12,
    background: GOLD,
    transform: "rotate(45deg)",
    flexShrink: 0,
  },
  expDotLine: {
    width: 1,
    flex: 1,
    background: BORDER,
    margin: "8px 0",
    minHeight: 40,
  },
  expCard: {
    background: DARK3,
    border: `1px solid ${BORDER2}`,
    padding: "28px 28px",
    flex: 1,
    marginBottom: 16,
  },
  expCardTop: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 14,
    flexWrap: "wrap",
    gap: 12,
  },
  expRole: {
    fontFamily: "'Bebas Neue', sans-serif",
    fontSize: 26,
    letterSpacing: "0.03em",
    color: "#fff",
    marginBottom: 4,
  },
  expCompany: {
    fontSize: 15,
    color: GOLD,
    fontWeight: 600,
    letterSpacing: "0.04em",
  },
  expDates: {
    fontSize: 13,
    color: MUTED,
    fontWeight: 500,
  },
  expPresent: {
    color: GOLD,
    fontWeight: 700,
  },
  expDesc: {
    fontSize: 15,
    color: MUTED,
    lineHeight: 1.7,
    marginBottom: 16,
    fontWeight: 300,
  },
  expPoints: {
    listStyle: "none",
    display: "flex",
    flexDirection: "column",
    gap: 8,
  },
  expPoint: {
    fontSize: 14,
    color: MUTED,
    display: "flex",
    gap: 10,
    lineHeight: 1.6,
  },
  expBullet: {
    color: GOLD,
    fontSize: 8,
    paddingTop: 5,
    flexShrink: 0,
  },

  /* BLOG */
  blogGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))",
    gap: 20,
  },
  blogCard: {
    background: DARK,
    border: `1px solid ${BORDER2}`,
    padding: "28px",
    display: "flex",
    flexDirection: "column",
  },
  blogCardTop: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 14,
  },
  blogCat: {
    fontFamily: "'Barlow Condensed', sans-serif",
    fontSize: 11,
    fontWeight: 700,
    letterSpacing: "0.16em",
    textTransform: "uppercase",
    color: GOLD,
    background: "rgba(201,169,74,0.1)",
    padding: "3px 10px",
    borderLeft: `2px solid ${GOLD}`,
  },
  blogDate: {
    fontSize: 12,
    color: MUTED,
    fontStyle: "italic",
  },
  blogTitle: {
    fontFamily: "'Bebas Neue', sans-serif",
    fontSize: 24,
    letterSpacing: "0.03em",
    color: "#fff",
    marginBottom: 12,
    lineHeight: 1.1,
  },
  blogExcerpt: {
    fontSize: 14,
    color: MUTED,
    lineHeight: 1.7,
    flex: 1,
    marginBottom: 20,
    fontWeight: 300,
  },
  blogFooter: {},
  blogReadMore: {
    fontSize: 13,
    fontWeight: 600,
    color: MUTED,
    letterSpacing: "0.08em",
  },
  blogArrow: {
    color: GOLD,
    transition: "transform 0.2s",
  },

  /* TESTIMONIALS */
  testGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))",
    gap: 20,
  },
  testCard: {
    background: DARK2,
    border: `1px solid ${BORDER2}`,
    padding: "28px",
  },
  testStars: {
    display: "flex",
    gap: 2,
    marginBottom: 14,
  },
  testStar: {
    color: GOLD,
    fontSize: 16,
  },
  testText: {
    fontSize: 15,
    color: MUTED,
    lineHeight: 1.75,
    fontStyle: "italic",
    marginBottom: 20,
    fontWeight: 300,
  },
  testAuthor: {
    display: "flex",
    alignItems: "center",
    gap: 12,
  },
  testAvatar: {
    width: 40,
    height: 40,
    background: GOLD,
    color: "#0e0f14",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontWeight: 800,
    fontSize: 16,
    flexShrink: 0,
  },
  testName: {
    fontSize: 15,
    fontWeight: 700,
    color: TEXT,
  },
  testRole: {
    fontSize: 13,
    color: MUTED,
  },

  /* CONTACT */
  contactGrid: {
    display: "grid",
    gridTemplateColumns: "1fr 1.6fr",
    gap: 80,
  },
  contactInfo: {},
  contactSubtext: {
    fontSize: 16,
    color: MUTED,
    lineHeight: 1.8,
    marginBottom: 40,
    fontWeight: 300,
  },
  contactDetail: {
    display: "flex",
    gap: 16,
    marginBottom: 28,
    alignItems: "flex-start",
  },
  contactDetailIcon: {
    color: GOLD,
    fontSize: 18,
    marginTop: 2,
    flexShrink: 0,
  },
  contactDetailLabel: {
    fontSize: 11,
    color: MUTED,
    textTransform: "uppercase",
    letterSpacing: "0.12em",
    fontWeight: 700,
    marginBottom: 4,
  },
  contactDetailValue: {
    color: GOLD,
    textDecoration: "none",
    fontSize: 15,
    fontWeight: 600,
  },
  contactDetailValuePlain: {
    color: TEXT,
    fontSize: 15,
  },
  contactSocials: {
    display: "flex",
    gap: 10,
    flexWrap: "wrap",
    marginTop: 32,
  },
  contactSocialLink: {
    border: `1px solid ${BORDER}`,
    color: MUTED,
    padding: "8px 18px",
    textDecoration: "none",
    fontSize: 12,
    fontWeight: 600,
    letterSpacing: "0.1em",
    textTransform: "uppercase",
    background: "transparent",
  },

  /* FORM */
  form: {
    display: "flex",
    flexDirection: "column",
    gap: 20,
  },
  formRow: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: 20,
  },
  formField: {
    display: "flex",
    flexDirection: "column",
    gap: 8,
  },
  formLabel: {
    fontSize: 11,
    fontWeight: 700,
    letterSpacing: "0.14em",
    textTransform: "uppercase",
    color: MUTED,
  },
  formInput: {
    background: DARK,
    border: `1px solid ${BORDER}`,
    padding: "14px 16px",
    color: TEXT,
    fontSize: 15,
    fontFamily: "'Barlow', sans-serif",
    fontWeight: 400,
    width: "100%",
  },
  formTextarea: {
    background: DARK,
    border: `1px solid ${BORDER}`,
    padding: "14px 16px",
    color: TEXT,
    fontSize: 15,
    fontFamily: "'Barlow', sans-serif",
    fontWeight: 400,
    minHeight: 140,
    resize: "vertical",
    width: "100%",
  },
  formSubmit: {
    background: GOLD,
    color: "#0e0f14",
    border: "none",
    padding: "16px 36px",
    fontFamily: "'Barlow Condensed', sans-serif",
    fontSize: 16,
    fontWeight: 700,
    letterSpacing: "0.1em",
    textTransform: "uppercase",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    gap: 12,
    alignSelf: "flex-start",
  },
  formSubmitArrow: {
    fontSize: 18,
  },

  /* FOOTER */
  footer: {
    background: DARK2,
    borderTop: `1px solid ${BORDER}`,
    padding: "28px 72px",
    position: "relative",
    zIndex: 1,
  },
  footerInner: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  footerLeft: {
    display: "flex",
    alignItems: "center",
    gap: 10,
  },
  footerLogoDiamond: {
    width: 8,
    height: 8,
    background: GOLD,
    transform: "rotate(45deg)",
  },
  footerName: {
    fontFamily: "'Bebas Neue', sans-serif",
    fontSize: 18,
    letterSpacing: "0.1em",
    color: "#fff",
  },
  footerCenter: {
    fontSize: 13,
    color: MUTED,
  },
  footerRight: {
    display: "flex",
    gap: 24,
  },
  footerLink: {
    fontSize: 12,
    color: MUTED,
    textDecoration: "none",
    fontWeight: 600,
    letterSpacing: "0.08em",
    textTransform: "uppercase",
  },
};