"use client";

import { error, success } from "../util/toast";
import { usePortfolio } from "../../context/PortfolioContext";
import { sendContactMessage } from "../../service/api";
import { useState } from "react";

function formatDate(dateString) {
  if (!dateString) return "";
  const d = new Date(dateString);
  return d.toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" });
}
function truncate(str, n) {
  return str?.length > n ? str.substring(0, n - 1) + "…" : str;
}

export default function Template3() {
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
      success("Message sent successfully");
      setContactForm({ name: "", email: "", subject: "", message: "" });
    } catch (err) {
      error(err.message);
    } finally {
      setSending(false);
    }
  }

  if (loading) return <div style={{ minHeight: "100vh", background: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'Playfair Display', serif", fontSize: 24 }}>Loading...</div>;

  const today = new Date().toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" });

  return (
    <div style={s.root}>
      <style>{css}</style>

      {/* Ticker */}
      <div style={s.ticker}>
        <span style={s.tickerLabel}>BREAKING</span>
        <div style={s.tickerTrack}>
          <span className="ticker-content">
            {profile.name} IS AVAILABLE FOR WORK &nbsp;•&nbsp; {skills.length} SKILLS &nbsp;•&nbsp; {projects.length} PROJECTS DELIVERED &nbsp;•&nbsp; {experiences.length} COMPANIES &nbsp;•&nbsp; OPEN TO COLLABORATIONS &nbsp;•&nbsp; &nbsp;&nbsp;&nbsp;&nbsp;
            {profile.name} IS AVAILABLE FOR WORK &nbsp;•&nbsp; {skills.length} SKILLS &nbsp;•&nbsp; {projects.length} PROJECTS DELIVERED &nbsp;•&nbsp; {experiences.length} COMPANIES &nbsp;•&nbsp; OPEN TO COLLABORATIONS &nbsp;•&nbsp;
          </span>
        </div>
      </div>

      {/* MASTHEAD */}
      <header style={s.masthead}>
        <div style={s.mastheadTop}>
          <span style={s.mastheadDate}>{today}</span>
          <div style={s.mastheadName}>{profile?.name || "PORTFOLIO"}</div>
          <span style={s.mastheadEdition}>DIGITAL EDITION</span>
        </div>
        <div style={s.mastheadRule} />
        <div style={s.mastheadSub}>
          <span>{profile?.title || "Full Stack Developer"}</span>
          <span style={s.mastheadDivider}>◆</span>
          <span>{profile?.location || "Worldwide"}</span>
          <span style={s.mastheadDivider}>◆</span>
          <a href="#contact" style={s.mastheadCTA}>HIRE NOW →</a>
        </div>
        <div style={s.mastheadRule} />
      </header>

      {/* HERO SPREAD */}
      <section style={s.heroSpread}>
        {/* Main headline */}
        <div style={s.heroLeft}>
          <div style={s.heroKicker}>FRONT PAGE</div>
          <h1 style={s.heroHeadline}>
            {profile?.name || "Developer"}<br />
            <em style={s.heroHeadlineItalic}>Available for</em><br />
            Your Next<br />
            Big Project
          </h1>
          <div style={s.heroRule} />
          <p style={s.heroDek}>{profile?.bio || "Building world-class digital products."}</p>
          <div style={s.heroByline}>By <strong>{profile?.name || "The Developer"}</strong> | {profile?.email || ""}</div>
        </div>

        {/* Stats column */}
        <div style={s.heroMid}>
          <div style={s.heroStat}>
            <span style={s.heroStatNum}>{projects.length}</span>
            <span style={s.heroStatLabel}>Projects<br />Shipped</span>
          </div>
          <div style={s.heroVertRule} />
          <div style={s.heroStat}>
            <span style={s.heroStatNum}>{skills.length}</span>
            <span style={s.heroStatLabel}>Skills<br />Mastered</span>
          </div>
          <div style={s.heroVertRule} />
          <div style={s.heroStat}>
            <span style={s.heroStatNum}>{experiences.length}</span>
            <span style={s.heroStatLabel}>Companies<br />Worked</span>
          </div>
        </div>

        {/* Pull quote */}
        <div style={s.heroRight}>
          <div style={s.pullQuote}>
            <div style={s.pullQuoteMarks}>"</div>
            <p style={s.pullQuoteText}>
              {truncate(profile?.bio, 140) || "Passionate about building products that make a difference."}
            </p>
            <div style={s.pullQuoteAttrib}>— {profile?.name || "Developer"}</div>
          </div>
          {socialLinks.length > 0 && (
            <div style={s.heroSocials}>
              {socialLinks.map(link => (
                <a key={link.id} href={link.url} target="_blank" rel="noopener noreferrer" style={s.heroSocialLink}>{link.platform}</a>
              ))}
            </div>
          )}
        </div>
      </section>

      <div style={s.sectionRule} />

      {/* SKILLS — full bleed grid */}
      {skills.length > 0 && (
        <section id="skills" style={s.section}>
          <div style={s.colHeader}>
            <div style={s.colHeaderRule} />
            <span style={s.colHeaderText}>SKILLS & EXPERTISE</span>
            <div style={s.colHeaderRule} />
          </div>
          <div style={s.skillsGrid}>
            {skills.map((skill, i) => (
              <div key={skill.id} style={{ ...s.skillCell, ...(i % 3 === 0 ? s.skillCellWide : {}) }}>
                <div style={s.skillCellTop}>
                  <span style={s.skillEmoji}>{skill.icon}</span>
                  <span style={s.skillCellName}>{skill.name}</span>
                  <span style={s.skillCellPct}>{skill.percentage}%</span>
                </div>
                <div style={s.skillProgress}>
                  <div style={{ ...s.skillProgressFill, width: `${skill.percentage}%` }} className="skill-progress" />
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      <div style={s.sectionRule} />

      {/* PROJECTS — newspaper columns */}
      {projects.length > 0 && (
        <section id="projects" style={s.section}>
          <div style={s.colHeader}>
            <div style={s.colHeaderRule} />
            <span style={s.colHeaderText}>FEATURED WORKS</span>
            <div style={s.colHeaderRule} />
          </div>
          <div style={s.projectsLayout}>
            {projects.map((p, i) => (
              <div key={p.id} style={{ ...s.projectArticle, ...(i === 0 ? s.projectArticleLead : {}) }}>
                {i === 0 && <div style={s.articleKicker}>LEAD PROJECT</div>}
                <div style={s.articleNumber}>№{String(i + 1).padStart(2, "0")}</div>
                <h3 style={{ ...s.articleHeadline, ...(i === 0 ? s.articleHeadlineLarge : {}) }}>{p.title}</h3>
                <div style={s.articleRule} />
                <p style={s.articleBody}>{p.description}</p>
                {p.techstack?.length > 0 && (
                  <div style={s.articleTech}>
                    {p.techstack.map((t, j) => <span key={j} style={s.techBadge}>{t}</span>)}
                  </div>
                )}
                <div style={s.articleLinks}>
                  {p.github_link && <a href={p.github_link} target="_blank" style={s.articleLink}>GITHUB ↗</a>}
                  {p.live_link && <a href={p.live_link} target="_blank" style={{ ...s.articleLink, ...s.articleLinkPrimary }}>LIVE DEMO ↗</a>}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      <div style={s.sectionRule} />

      {/* EXPERIENCE — timeline as news wire */}
      {experiences.length > 0 && (
        <section id="experience" style={s.section}>
          <div style={s.colHeader}>
            <div style={s.colHeaderRule} />
            <span style={s.colHeaderText}>CAREER RECORD</span>
            <div style={s.colHeaderRule} />
          </div>
          <div style={s.expColumns}>
            {experiences.map((exp, i) => (
              <div key={exp.id} style={s.expEntry}>
                <div style={s.expDate}>
                  {formatDate(exp.start_date)} — {exp.is_current === "true" ? "PRESENT" : formatDate(exp.end_date)}
                </div>
                <div style={s.expRole}>{exp.role}</div>
                <div style={s.expCompany}>{exp.company}</div>
                {exp.description && <p style={s.expDesc}>{exp.description}</p>}
                {exp.points?.length > 0 && (
                  <ul style={s.expList}>
                    {exp.points.map((pt, j) => <li key={j} style={s.expListItem}>{pt}</li>)}
                  </ul>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      <div style={s.sectionRule} />

      {/* BLOG — editorial layout */}
      {blogs.length > 0 && (
        <section id="blog" style={s.section}>
          <div style={s.colHeader}>
            <div style={s.colHeaderRule} />
            <span style={s.colHeaderText}>FROM THE DESK</span>
            <div style={s.colHeaderRule} />
          </div>
          <div style={s.blogColumns}>
            {blogs.map((blog, i) => (
              <div key={blog.id} style={{ ...s.blogEntry, ...(i === 0 ? s.blogEntryLead : {}) }}>
                <div style={s.blogCat}>{blog.category || "GENERAL"}</div>
                <h3 style={{ ...s.blogTitle, ...(i === 0 ? s.blogTitleLarge : {}) }}>{blog.title}</h3>
                <p style={s.blogExcerpt}>{truncate(blog.excerpt, i === 0 ? 200 : 100)}</p>
                <div style={s.blogDate}>{formatDate(blog.publish_date)}</div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* TESTIMONIALS */}
      {testimonials.length > 0 && (
        <>
          <div style={s.sectionRule} />
          <section style={s.section}>
            <div style={s.colHeader}>
              <div style={s.colHeaderRule} />
              <span style={s.colHeaderText}>LETTERS TO THE EDITOR</span>
              <div style={s.colHeaderRule} />
            </div>
            <div style={s.testimonialsRow}>
              {testimonials.map(t => (
                <div key={t.id} style={s.testimonialEntry}>
                  <p style={s.testimonialText}>"{t.review}"</p>
                  <div style={s.testimonialSig}>— {t.name}, <em>{t.role}</em> at {t.company} | {"★".repeat(t.rating)}</div>
                </div>
              ))}
            </div>
          </section>
        </>
      )}

      <div style={s.sectionRule} />

      {/* CONTACT */}
      <section id="contact" style={s.section}>
        <div style={s.colHeader}>
          <div style={s.colHeaderRule} />
          <span style={s.colHeaderText}>CONTACT THE AUTHOR</span>
          <div style={s.colHeaderRule} />
        </div>
        <div style={s.contactLayout}>
          <div style={s.contactLeft}>
            <h2 style={s.contactHeadline}>Start the<br /><em>Conversation</em></h2>
            <p style={s.contactBody}>Have a story to tell, a problem to solve, or a product to build? The author is available for select collaborations.</p>
            {profile.email && <div style={s.contactDetail}><strong>Electronic Mail:</strong> <a href={`mailto:${profile.email}`} style={s.contactLink}>{profile.email}</a></div>}
            {profile.location && <div style={s.contactDetail}><strong>Location:</strong> {profile.location}</div>}
          </div>
          <form onSubmit={handleContact} style={s.contactForm}>
            <div style={s.formRow}>
              <input required placeholder="FULL NAME" value={contactForm.name} onChange={e => setContactForm({ ...contactForm, name: e.target.value })} style={s.input} />
              <input required type="email" placeholder="EMAIL ADDRESS" value={contactForm.email} onChange={e => setContactForm({ ...contactForm, email: e.target.value })} style={s.input} />
            </div>
            <input placeholder="SUBJECT MATTER" value={contactForm.subject} onChange={e => setContactForm({ ...contactForm, subject: e.target.value })} style={{ ...s.input, ...s.inputFull }} />
            <textarea required placeholder="YOUR MESSAGE" value={contactForm.message} onChange={e => setContactForm({ ...contactForm, message: e.target.value })} style={s.textarea} />
            <button disabled={sending} style={s.submitBtn} className="submit-hover">{sending ? "TRANSMITTING..." : "SUBMIT LETTER →"}</button>
          </form>
        </div>
      </section>

      {/* FOOTER */}
      <footer style={s.footer}>
        <div style={s.footerTop}>
          <span style={s.footerName}>{profile?.name || "PORTFOLIO"}</span>
          <span style={s.footerSep}>|</span>
          <span style={s.footerYear}>EST. {new Date().getFullYear()}</span>
          {socialLinks.length > 0 && (
            <div style={s.footerLinks}>
              {socialLinks.map(link => <a key={link.id} href={link.url} target="_blank" rel="noopener noreferrer" style={s.footerLink}>{link.platform.toUpperCase()}</a>)}
            </div>
          )}
        </div>
        <div style={s.footerBottom}>All rights reserved. {new Date().getFullYear()}.</div>
      </footer>
    </div>
  );
}

const css = `
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;0,900;1,400;1,700&family=Source+Serif+4:ital,opsz,wght@0,8..60,300;0,8..60,400;0,8..60,600;1,8..60,300;1,8..60,400&family=Bebas+Neue&display=swap');
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  @keyframes ticker {
    from { transform: translateX(0); }
    to { transform: translateX(-50%); }
  }
  .ticker-content { display: inline-block; animation: ticker 30s linear infinite; white-space: nowrap; }

  @keyframes fillProgress { from { width: 0 !important; } }
  .skill-progress { animation: fillProgress 1.4s cubic-bezier(0.4,0,0.2,1) both; }

  .submit-hover { transition: background 0.2s, color 0.2s; }
  .submit-hover:hover { background: #1a1a1a !important; color: #fff !important; }
`;

const s = {
  root: { fontFamily: "'Source Serif 4', serif", background: "#faf9f6", color: "#1a1a1a", minHeight: "100vh" },
  ticker: { background: "#1a1a1a", color: "#fff", display: "flex", alignItems: "center", overflow: "hidden", height: 36 },
  tickerLabel: { background: "#c41e3a", padding: "0 16px", fontFamily: "'Bebas Neue', sans-serif", fontSize: 15, letterSpacing: "0.1em", height: "100%", display: "flex", alignItems: "center", flexShrink: 0, zIndex: 1 },
  tickerTrack: { overflow: "hidden", flex: 1 },
  masthead: { padding: "24px 60px 0", borderBottom: "3px solid #1a1a1a" },
  mastheadTop: { display: "flex", justifyContent: "space-between", alignItems: "flex-end", paddingBottom: 12 },
  mastheadDate: { fontFamily: "'Source Serif 4', serif", fontSize: 12, color: "#666", fontStyle: "italic" },
  mastheadName: { fontFamily: "'Playfair Display', serif", fontSize: "clamp(40px, 6vw, 80px)", fontWeight: 900, letterSpacing: "-2px", lineHeight: 1, textAlign: "center" },
  mastheadEdition: { fontFamily: "'Source Serif 4', serif", fontSize: 12, color: "#666", fontStyle: "italic" },
  mastheadRule: { height: 1, background: "#1a1a1a", margin: "8px 0" },
  mastheadSub: { display: "flex", justifyContent: "center", alignItems: "center", gap: 16, padding: "8px 0", fontFamily: "'Source Serif 4', serif", fontSize: 13, color: "#444" },
  mastheadDivider: { color: "#c41e3a", fontSize: 10 },
  mastheadCTA: { fontFamily: "'Bebas Neue', sans-serif", fontSize: 14, letterSpacing: "0.1em", color: "#c41e3a", textDecoration: "none", border: "1px solid #c41e3a", padding: "2px 10px" },
  heroSpread: { display: "grid", gridTemplateColumns: "2fr 1fr 1fr", gap: 0, padding: "40px 60px", borderBottom: "2px solid #1a1a1a" },
  heroLeft: { paddingRight: 40, borderRight: "1px solid #d0ccc5" },
  heroKicker: { fontFamily: "'Bebas Neue', sans-serif", fontSize: 11, letterSpacing: "0.15em", color: "#c41e3a", marginBottom: 12 },
  heroHeadline: { fontFamily: "'Playfair Display', serif", fontSize: "clamp(36px, 4vw, 64px)", fontWeight: 900, lineHeight: 1.05, marginBottom: 16 },
  heroHeadlineItalic: { fontStyle: "italic", fontWeight: 400 },
  heroRule: { height: 3, background: "#1a1a1a", width: 60, margin: "16px 0" },
  heroDek: { fontFamily: "'Source Serif 4', serif", fontSize: 16, lineHeight: 1.7, color: "#444", marginBottom: 16 },
  heroByline: { fontFamily: "'Source Serif 4', serif", fontSize: 13, color: "#888", fontStyle: "italic" },
  heroMid: { padding: "0 32px", display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", gap: 24, borderRight: "1px solid #d0ccc5" },
  heroStat: { display: "flex", flexDirection: "column", alignItems: "center", gap: 4 },
  heroStatNum: { fontFamily: "'Playfair Display', serif", fontSize: 52, fontWeight: 900, lineHeight: 1, color: "#c41e3a" },
  heroStatLabel: { fontFamily: "'Source Serif 4', serif", fontSize: 12, color: "#888", textAlign: "center", fontStyle: "italic" },
  heroVertRule: { height: 1, width: "100%", background: "#d0ccc5" },
  heroRight: { padding: "0 0 0 32px" },
  pullQuote: { borderLeft: "4px solid #c41e3a", paddingLeft: 20, marginBottom: 32 },
  pullQuoteMarks: { fontFamily: "'Playfair Display', serif", fontSize: 72, color: "#c41e3a", lineHeight: 0.8, marginBottom: 8 },
  pullQuoteText: { fontFamily: "'Playfair Display', serif", fontSize: 18, fontStyle: "italic", lineHeight: 1.5, color: "#2a2a2a", marginBottom: 12 },
  pullQuoteAttrib: { fontFamily: "'Source Serif 4', serif", fontSize: 13, color: "#888" },
  heroSocials: { display: "flex", flexDirection: "column", gap: 8 },
  heroSocialLink: { fontFamily: "'Bebas Neue', sans-serif", fontSize: 13, letterSpacing: "0.1em", color: "#1a1a1a", textDecoration: "none", borderBottom: "1px solid #d0ccc5", paddingBottom: 6 },
  sectionRule: { height: 3, background: "#1a1a1a", margin: "0 60px" },
  section: { padding: "48px 60px" },
  colHeader: { display: "flex", alignItems: "center", gap: 16, marginBottom: 32 },
  colHeaderRule: { flex: 1, height: 1, background: "#d0ccc5" },
  colHeaderText: { fontFamily: "'Bebas Neue', sans-serif", fontSize: 18, letterSpacing: "0.12em", color: "#1a1a1a", whiteSpace: "nowrap" },
  skillsGrid: { display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 0 },
  skillCell: { padding: "16px 20px", borderBottom: "1px solid #d0ccc5", borderRight: "1px solid #d0ccc5" },
  skillCellWide: {},
  skillCellTop: { display: "flex", alignItems: "center", gap: 8, marginBottom: 8 },
  skillEmoji: { fontSize: 18 },
  skillCellName: { fontFamily: "'Source Serif 4', serif", fontWeight: 600, flex: 1, fontSize: 15 },
  skillCellPct: { fontFamily: "'Playfair Display', serif", fontWeight: 700, fontSize: 18, color: "#c41e3a" },
  skillProgress: { height: 3, background: "#e8e4dc", overflow: "hidden" },
  skillProgressFill: { height: "100%", background: "#c41e3a" },
  projectsLayout: { display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 0 },
  projectArticle: { padding: "0 24px 24px 0", borderRight: "1px solid #d0ccc5" },
  projectArticleLead: { gridColumn: "1 / 2", paddingRight: 32 },
  articleKicker: { fontFamily: "'Bebas Neue', sans-serif", fontSize: 11, letterSpacing: "0.15em", color: "#c41e3a", marginBottom: 6 },
  articleNumber: { fontFamily: "'Playfair Display', serif", fontSize: 48, fontWeight: 900, color: "#e8e4dc", lineHeight: 1, marginBottom: 8 },
  articleHeadline: { fontFamily: "'Playfair Display', serif", fontSize: 20, fontWeight: 700, lineHeight: 1.2, marginBottom: 10 },
  articleHeadlineLarge: { fontSize: 32 },
  articleRule: { height: 1, background: "#d0ccc5", margin: "10px 0" },
  articleBody: { fontSize: 14, lineHeight: 1.7, color: "#444", marginBottom: 14 },
  articleTech: { display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 14 },
  techBadge: { fontSize: 11, fontFamily: "'Bebas Neue', sans-serif", letterSpacing: "0.08em", border: "1px solid #d0ccc5", padding: "2px 8px" },
  articleLinks: { display: "flex", gap: 12 },
  articleLink: { fontFamily: "'Bebas Neue', sans-serif", fontSize: 12, letterSpacing: "0.1em", color: "#888", textDecoration: "none" },
  articleLinkPrimary: { color: "#c41e3a" },
  expColumns: { display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: 32 },
  expEntry: { borderLeft: "3px solid #c41e3a", paddingLeft: 20 },
  expDate: { fontFamily: "'Bebas Neue', sans-serif", fontSize: 12, letterSpacing: "0.1em", color: "#888", marginBottom: 4 },
  expRole: { fontFamily: "'Playfair Display', serif", fontSize: 20, fontWeight: 700, marginBottom: 4 },
  expCompany: { fontFamily: "'Source Serif 4', serif", fontSize: 15, fontStyle: "italic", color: "#c41e3a", marginBottom: 10 },
  expDesc: { fontSize: 14, lineHeight: 1.7, color: "#555", marginBottom: 10 },
  expList: { paddingLeft: 16 },
  expListItem: { fontSize: 14, color: "#555", marginBottom: 6, lineHeight: 1.5 },
  blogColumns: { display: "grid", gridTemplateColumns: "2fr 1fr 1fr", gap: 32 },
  blogEntry: { borderTop: "2px solid #1a1a1a", paddingTop: 16 },
  blogEntryLead: {},
  blogCat: { fontFamily: "'Bebas Neue', sans-serif", fontSize: 11, letterSpacing: "0.15em", color: "#c41e3a", marginBottom: 8 },
  blogTitle: { fontFamily: "'Playfair Display', serif", fontSize: 18, fontWeight: 700, lineHeight: 1.2, marginBottom: 10 },
  blogTitleLarge: { fontSize: 28 },
  blogExcerpt: { fontSize: 14, lineHeight: 1.7, color: "#555", marginBottom: 10 },
  blogDate: { fontSize: 12, color: "#999", fontStyle: "italic" },
  testimonialsRow: { display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: 32 },
  testimonialEntry: { borderTop: "1px solid #d0ccc5", paddingTop: 16 },
  testimonialText: { fontFamily: "'Playfair Display', serif", fontSize: 16, fontStyle: "italic", lineHeight: 1.7, marginBottom: 12, color: "#2a2a2a" },
  testimonialSig: { fontSize: 13, color: "#888" },
  contactLayout: { display: "grid", gridTemplateColumns: "1fr 1.6fr", gap: 60 },
  contactLeft: {},
  contactHeadline: { fontFamily: "'Playfair Display', serif", fontSize: 48, fontWeight: 900, lineHeight: 1.05, marginBottom: 20 },
  contactBody: { fontSize: 16, lineHeight: 1.7, color: "#555", marginBottom: 24 },
  contactDetail: { fontSize: 14, marginBottom: 12, color: "#444" },
  contactLink: { color: "#c41e3a", textDecoration: "none" },
  contactForm: { display: "flex", flexDirection: "column", gap: 16 },
  formRow: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 },
  input: { border: "1px solid #d0ccc5", borderBottom: "2px solid #1a1a1a", padding: "12px 16px", fontSize: 13, fontFamily: "'Bebas Neue', sans-serif", letterSpacing: "0.08em", background: "transparent", outline: "none", width: "100%" },
  inputFull: { gridColumn: "1 / -1" },
  textarea: { border: "1px solid #d0ccc5", borderBottom: "2px solid #1a1a1a", padding: "12px 16px", fontSize: 14, fontFamily: "'Source Serif 4', serif", background: "transparent", outline: "none", minHeight: 120, resize: "vertical", width: "100%" },
  submitBtn: { background: "#c41e3a", color: "#fff", border: "none", padding: "16px 32px", fontFamily: "'Bebas Neue', sans-serif", fontSize: 18, letterSpacing: "0.12em", cursor: "pointer", alignSelf: "flex-start" },
  footer: { background: "#1a1a1a", color: "#fff", padding: "24px 60px" },
  footerTop: { display: "flex", alignItems: "center", gap: 20, marginBottom: 8 },
  footerName: { fontFamily: "'Playfair Display', serif", fontSize: 20, fontWeight: 900 },
  footerSep: { color: "#555" },
  footerYear: { fontFamily: "'Source Serif 4', serif", fontSize: 14, color: "#888", fontStyle: "italic" },
  footerLinks: { display: "flex", gap: 16, marginLeft: "auto" },
  footerLink: { fontFamily: "'Bebas Neue', sans-serif", fontSize: 13, letterSpacing: "0.1em", color: "#888", textDecoration: "none" },
  footerBottom: { fontFamily: "'Source Serif 4', serif", fontSize: 12, color: "#555", fontStyle: "italic" },
};