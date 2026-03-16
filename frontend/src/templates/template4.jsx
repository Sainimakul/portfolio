"use client";

import { error, success } from "@/util/toast";
import { usePortfolio } from "../../context/PortfolioContext";
import { sendContactMessage } from "../../service/api";
import { useState, useEffect } from "react";

function formatDate(d) { if (!d) return ""; const dt = new Date(d); return dt.toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" }); }
function truncate(str, n) { return str?.length > n ? str.substring(0, n - 1) + "…" : str; }

function useTypewriter(text, speed = 40) {
  const [displayed, setDisplayed] = useState("");
  useEffect(() => {
    setDisplayed("");
    let i = 0;
    const id = setInterval(() => {
      if (i < text.length) { setDisplayed(text.slice(0, i + 1)); i++; }
      else clearInterval(id);
    }, speed);
    return () => clearInterval(id);
  }, [text, speed]);
  return displayed;
}

export default function Template4() {
  const { portfolioData, loading } = usePortfolio();
  const [contactForm, setContactForm] = useState({ name: "", email: "", subject: "", message: "" });
  const [sending, setSending] = useState(false);
  const [time, setTime] = useState(new Date());
  const [activeTab, setActiveTab] = useState("all");

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

  const titleText = profile?.name ? `> ${profile.name}_` : "> developer_";
  const typedTitle = useTypewriter(titleText, 60);

  async function handleContact(e) {
    e.preventDefault();
    try { setSending(true); await sendContactMessage(contactForm); success("Message sent successfully"); setContactForm({ name: "", email: "", subject: "", message: "" }); }
    catch (err) { error(err.message); }
    finally { setSending(false); }
  }

  if (loading) return (
    <div style={{ minHeight: "100vh", background: "#080c10", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "monospace", color: "#00ff9f", fontSize: 16 }}>
      <span style={{ animation: "pulse 1s infinite" }}>[LOADING SYSTEM...]</span>
      <style>{`@keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.3} }`}</style>
    </div>
  );

  return (
    <div style={c.root}>
      <style>{css}</style>

      {/* Scanlines overlay */}
      <div style={c.scanlines} />

      {/* TOPBAR */}
      <div style={c.topbar}>
        <div style={c.topbarLeft}>
          <span style={c.topbarDot} className="dot-blink" />
          <span style={c.topbarSys}>SYS.PORTFOLIO</span>
          <span style={c.topbarDivider}>|</span>
          <span style={c.topbarUser}>USER: {profile?.name?.toUpperCase().split(" ")[0] || "DEV"}</span>
        </div>
        <div style={c.topbarRight}>
          <span style={c.topbarTime}>{time.toTimeString().slice(0, 8)}</span>
          <span style={c.topbarDivider}>|</span>
          <span style={c.topbarStatus}>● ONLINE</span>
        </div>
      </div>

      {/* NAV TERMINAL */}
      <nav style={c.nav}>
        <div style={c.navBrand}>[{profile?.name?.split(" ")[0] || "DEV"}@portfolio]$</div>
        <div style={c.navLinks}>
          {["skills", "projects", "experience", "blog", "contact"].map(s => (
            <a key={s} href={`#${s}`} style={c.navLink} className="nav-cmd">
              ./{s}
            </a>
          ))}
        </div>
      </nav>

      {/* HERO */}
      <section style={c.hero}>
        <div style={c.heroTerminal}>
          <div style={c.terminalBar}>
            <span style={c.termDot} /><span style={{ ...c.termDot, background: "#ffbd2e" }} /><span style={{ ...c.termDot, background: "#27c93f" }} />
            <span style={c.termTitle}>terminal — bash — 80×24</span>
          </div>
          <div style={c.termBody}>
            <div style={c.termLine}><span style={c.prompt}>$</span> <span style={c.cmd}>whoami</span></div>
            <div style={c.termOutput}>{profile?.name || "Full Stack Developer"}</div>
            <div style={c.termLine}><span style={c.prompt}>$</span> <span style={c.cmd}>cat bio.txt</span></div>
            <div style={c.termOutput}>{profile?.bio || "Building digital experiences."}</div>
            <div style={c.termLine}><span style={c.prompt}>$</span> <span style={c.cmd}>ls -la</span></div>
            <div style={c.termOutput}>
              <div>drwxr-xr-x  skills/  ({skills.length} items)</div>
              <div>drwxr-xr-x  projects/  ({projects.length} items)</div>
              <div>drwxr-xr-x  experience/  ({experiences.length} items)</div>
            </div>
            <div style={c.termLine}><span style={c.prompt}>$</span> <span style={c.cursor} className="cursor-blink">▋</span></div>
          </div>
        </div>

        <div style={c.heroInfo}>
          <h1 style={c.heroName} className="glitch-text" data-text={typedTitle}>{typedTitle}</h1>
          <p style={c.heroTitle}>{profile?.title || "Full Stack Developer"}</p>
          <div style={c.heroBadges}>
            <span style={c.badge} className="badge-glow">◉ AVAILABLE</span>
            {profile?.location && <span style={c.badgeNeutral}>{profile.location}</span>}
          </div>
          <div style={c.heroStats}>
            <div style={c.heroStat}><span style={c.heroStatNum}>{projects.length}</span><span style={c.heroStatLabel}>PROJECTS</span></div>
            <div style={c.heroStatDiv} />
            <div style={c.heroStat}><span style={c.heroStatNum}>{skills.length}</span><span style={c.heroStatLabel}>SKILLS</span></div>
            <div style={c.heroStatDiv} />
            <div style={c.heroStat}><span style={c.heroStatNum}>{experiences.length}</span><span style={c.heroStatLabel}>ROLES</span></div>
          </div>
          <div style={c.heroCTAs}>
            <a href="#projects" style={c.ctaGreen} className="cta-glow">[ VIEW_PROJECTS ]</a>
            <a href="#contact" style={c.ctaOutline}>[ CONTACT_ME ]</a>
          </div>
        </div>
      </section>

      {/* SKILLS */}
      {skills.length > 0 && (
        <section id="skills" style={c.section}>
          <div style={c.sectionHeader}>
            <span style={c.sectionCmd}>$ cat skills.json</span>
            <div style={c.sectionLine} />
          </div>
          <div style={c.skillsGrid}>
            {skills.map((skill, i) => (
              <div key={skill.id} style={c.skillCard} className="cyber-card">
                <div style={c.skillHeader}>
                  <span style={c.skillNum}>0x{String(i + 1).padStart(2, "0")}</span>
                  <span style={c.skillEmoji}>{skill.icon}</span>
                  <span style={c.skillName}>{skill.name}</span>
                  <span style={c.skillPct}>{skill.percentage}%</span>
                </div>
                <div style={c.skillBar}>
                  <div style={{ ...c.skillFill, width: `${skill.percentage}%` }} className="skill-fill-cyber" />
                  <div style={{ ...c.skillFillGlow, width: `${skill.percentage}%` }} />
                </div>
                {skill.description && <p style={c.skillDesc}>{skill.description}</p>}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* PROJECTS */}
      {projects.length > 0 && (
        <section id="projects" style={c.section}>
          <div style={c.sectionHeader}>
            <span style={c.sectionCmd}>$ ls projects/ --verbose</span>
            <div style={c.sectionLine} />
          </div>
          <div style={c.projectsGrid}>
            {projects.map((p, i) => (
              <div key={p.id} style={c.projectCard} className="cyber-card">
                <div style={c.projectIdRow}>
                  <span style={c.projectId}>PROJECT_{String(i + 1).padStart(3, "0")}</span>
                  <span style={c.projectStatus}>● DEPLOYED</span>
                </div>
                <h3 style={c.projectTitle}>{p.title}</h3>
                <p style={c.projectDesc}>{p.description}</p>
                {p.techstack?.length > 0 && (
                  <div style={c.techRow}>
                    {p.techstack.map((t, j) => <span key={j} style={c.techChip}>{t}</span>)}
                  </div>
                )}
                <div style={c.projectBtns}>
                  {p.github_link && <a href={p.github_link} target="_blank" style={c.projBtn} className="proj-btn">[ GITHUB ]</a>}
                  {p.live_link && <a href={p.live_link} target="_blank" style={{ ...c.projBtn, ...c.projBtnGreen }} className="cta-glow">[ LIVE ]</a>}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* EXPERIENCE */}
      {experiences.length > 0 && (
        <section id="experience" style={c.section}>
          <div style={c.sectionHeader}>
            <span style={c.sectionCmd}>$ history --experience</span>
            <div style={c.sectionLine} />
          </div>
          <div style={c.expList}>
            {experiences.map((exp, i) => (
              <div key={exp.id} style={c.expItem} className="cyber-card">
                <div style={c.expLeft}>
                  <span style={c.expIdx}>[{String(i + 1).padStart(2, "0")}]</span>
                </div>
                <div style={c.expRight}>
                  <div style={c.expHeaderRow}>
                    <div>
                      <div style={c.expRole}>{exp.role}</div>
                      <div style={c.expCompany}>{exp.company}</div>
                    </div>
                    <div style={c.expDates}>{formatDate(exp.start_date)} → {exp.is_current === "true" ? "NOW" : formatDate(exp.end_date)}</div>
                  </div>
                  {exp.description && <p style={c.expDesc}>{exp.description}</p>}
                  {exp.points?.length > 0 && (
                    <ul style={c.expPoints}>
                      {exp.points.map((pt, j) => <li key={j} style={c.expPoint}><span style={c.expBullet}>▸</span> {pt}</li>)}
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
        <section id="blog" style={c.section}>
          <div style={c.sectionHeader}>
            <span style={c.sectionCmd}>$ cat logs/blog.md</span>
            <div style={c.sectionLine} />
          </div>
          <div style={c.blogGrid}>
            {blogs.map(blog => (
              <div key={blog.id} style={c.blogCard} className="cyber-card">
                <div style={c.blogCat}>{blog.category || "GENERAL"}</div>
                <h3 style={c.blogTitle}>{blog.title}</h3>
                <p style={c.blogExcerpt}>{truncate(blog.excerpt, 120)}</p>
                <div style={c.blogDate}>// {formatDate(blog.publish_date)}</div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* TESTIMONIALS */}
      {testimonials.length > 0 && (
        <section style={c.section}>
          <div style={c.sectionHeader}>
            <span style={c.sectionCmd}>$ grep -r "reviews"</span>
            <div style={c.sectionLine} />
          </div>
          <div style={c.testGrid}>
            {testimonials.map(t => (
              <div key={t.id} style={c.testCard} className="cyber-card">
                <div style={c.testRating}>{Array.from({ length: t.rating }).map((_, i) => <span key={i} style={c.star}>★</span>)}</div>
                <p style={c.testText}>/* {t.review} */</p>
                <div style={c.testAuthor}>
                  <span style={c.testName}>{t.name}</span>
                  <span style={c.testRole}> // {t.role}@{t.company}</span>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* CONTACT */}
      <section id="contact" style={c.section}>
        <div style={c.sectionHeader}>
          <span style={c.sectionCmd}>$ ssh contact@{profile?.name?.toLowerCase().replace(" ", "") || "dev"}.io</span>
          <div style={c.sectionLine} />
        </div>
        <div style={c.contactGrid}>
          <div style={c.contactLeft}>
            <p style={c.contactText}>Establishing secure connection...<br />Connection ready. Awaiting input.</p>
            {profile.email && <div style={c.contactField}><span style={c.contactFieldLabel}>EMAIL:</span><a href={`mailto:${profile.email}`} style={c.contactFieldVal}>{profile.email}</a></div>}
            {profile.location && <div style={c.contactField}><span style={c.contactFieldLabel}>LOCATION:</span><span style={c.contactFieldVal}>{profile.location}</span></div>}
            {socialLinks.length > 0 && (
              <div style={c.socialRow}>
                {socialLinks.map(link => <a key={link.id} href={link.url} target="_blank" rel="noopener noreferrer" style={c.socialBtn} className="proj-btn">{link.platform.toUpperCase()}</a>)}
              </div>
            )}
          </div>
          <form onSubmit={handleContact} style={c.contactForm}>
            <div style={c.inputWrap}>
              <span style={c.inputPrefix}>name&gt;</span>
              <input required placeholder="your_name" value={contactForm.name} onChange={e => setContactForm({ ...contactForm, name: e.target.value })} style={c.cyberInput} className="cyber-input" />
            </div>
            <div style={c.inputWrap}>
              <span style={c.inputPrefix}>email&gt;</span>
              <input required type="email" placeholder="your@email.io" value={contactForm.email} onChange={e => setContactForm({ ...contactForm, email: e.target.value })} style={c.cyberInput} className="cyber-input" />
            </div>
            <div style={c.inputWrap}>
              <span style={c.inputPrefix}>subject&gt;</span>
              <input placeholder="project_inquiry" value={contactForm.subject} onChange={e => setContactForm({ ...contactForm, subject: e.target.value })} style={c.cyberInput} className="cyber-input" />
            </div>
            <div style={{ ...c.inputWrap, alignItems: "flex-start" }}>
              <span style={{ ...c.inputPrefix, paddingTop: 14 }}>msg&gt;</span>
              <textarea required placeholder="write your message here..." value={contactForm.message} onChange={e => setContactForm({ ...contactForm, message: e.target.value })} style={{ ...c.cyberInput, ...c.cyberTextarea }} className="cyber-input" />
            </div>
            <button disabled={sending} style={c.sendBtn} className="cta-glow">{sending ? "[ TRANSMITTING... ]" : "[ SEND_MESSAGE ]"}</button>
          </form>
        </div>
      </section>

      <footer style={c.footer}>
        <span style={c.footerText}>// © {new Date().getFullYear()} {profile?.name || "Portfolio"} — All systems nominal</span>
      </footer>
    </div>
  );
}

const css = `
  @import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:ital,wght@0,300;0,400;0,500;0,700;1,400&family=Orbitron:wght@400;700;900&display=swap');
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  @keyframes blink { 0%,100%{opacity:1} 49%{opacity:1} 50%{opacity:0} }
  @keyframes dotBlink { 0%,100%{opacity:1;box-shadow:0 0 6px #00ff9f} 50%{opacity:0.3;box-shadow:none} }
  @keyframes scanline { 0%{background-position:0 0} 100%{background-position:0 100vh} }
  @keyframes fillCyber { from{width:0 !important} }
  @keyframes glow { 0%,100%{box-shadow:0 0 10px rgba(0,255,159,0.3)} 50%{box-shadow:0 0 30px rgba(0,255,159,0.7)} }

  .cursor-blink { animation: blink 1s step-end infinite; color: #00ff9f; }
  .dot-blink { animation: dotBlink 2s ease-in-out infinite; }
  .skill-fill-cyber { animation: fillCyber 1.5s cubic-bezier(0.4,0,0.2,1) both; }

  .glitch-text { position: relative; }
  .glitch-text::before, .glitch-text::after {
    content: attr(data-text); position: absolute; top: 0; left: 0;
    width: 100%; height: 100%;
  }
  .glitch-text::before { color: #ff0044; animation: glitch1 3s infinite; clip-path: polygon(0 0, 100% 0, 100% 35%, 0 35%); }
  .glitch-text::after { color: #00cfff; animation: glitch2 3s infinite; clip-path: polygon(0 65%, 100% 65%, 100% 100%, 0 100%); }
  @keyframes glitch1 { 0%,90%,100%{transform:translate(0)} 91%{transform:translate(-3px,1px)} 93%{transform:translate(3px,-1px)} 95%{transform:translate(-1px,2px)} }
  @keyframes glitch2 { 0%,90%,100%{transform:translate(0)} 92%{transform:translate(3px,-1px)} 94%{transform:translate(-2px,1px)} 96%{transform:translate(2px,-2px)} }

  .nav-cmd { transition: color 0.2s, text-shadow 0.2s; }
  .nav-cmd:hover { color: #00ff9f !important; text-shadow: 0 0 10px #00ff9f; }

  .cyber-card { transition: border-color 0.3s, box-shadow 0.3s; }
  .cyber-card:hover { border-color: rgba(0,255,159,0.4) !important; box-shadow: 0 0 20px rgba(0,255,159,0.1) !important; }

  .badge-glow { animation: glow 2s ease-in-out infinite; }

  .cta-glow { transition: all 0.3s; }
  .cta-glow:hover { box-shadow: 0 0 30px rgba(0,255,159,0.5) !important; background: rgba(0,255,159,0.2) !important; }

  .proj-btn { transition: all 0.2s; }
  .proj-btn:hover { color: #00ff9f !important; border-color: #00ff9f !important; }

  .cyber-input { transition: border-color 0.2s, box-shadow 0.2s; }
  .cyber-input:focus { border-color: #00ff9f !important; box-shadow: 0 0 12px rgba(0,255,159,0.3) !important; outline: none; }
`;

const GREEN = "#00ff9f";
const CYAN = "#00cfff";
const RED = "#ff0044";
const BG = "#080c10";
const SURFACE = "#0d1117";
const BORDER = "rgba(0,255,159,0.15)";

const c = {
  root: { fontFamily: "'JetBrains Mono', monospace", background: BG, color: "#c9d1d9", minHeight: "100vh", position: "relative", overflowX: "hidden" },
  scanlines: { position: "fixed", top: 0, left: 0, right: 0, bottom: 0, backgroundImage: "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,255,159,0.01) 2px, rgba(0,255,159,0.01) 4px)", pointerEvents: "none", zIndex: 9999 },
  topbar: { background: "rgba(0,255,159,0.05)", borderBottom: `1px solid ${BORDER}`, padding: "8px 60px", display: "flex", justifyContent: "space-between", fontSize: 11, color: "#4a5568" },
  topbarLeft: { display: "flex", alignItems: "center", gap: 12 },
  topbarDot: { width: 8, height: 8, borderRadius: "50%", background: GREEN, boxShadow: `0 0 6px ${GREEN}`, display: "inline-block" },
  topbarSys: { color: GREEN, fontWeight: 700 },
  topbarDivider: { color: "#2d3748" },
  topbarUser: { color: "#64748b" },
  topbarRight: { display: "flex", alignItems: "center", gap: 12 },
  topbarTime: { color: CYAN, fontWeight: 600 },
  topbarStatus: { color: GREEN, fontSize: 11 },
  nav: { display: "flex", justifyContent: "space-between", alignItems: "center", padding: "16px 60px", borderBottom: `1px solid ${BORDER}`, background: SURFACE },
  navBrand: { color: GREEN, fontWeight: 700, fontSize: 15, fontFamily: "'Orbitron', monospace" },
  navLinks: { display: "flex", gap: 28 },
  navLink: { color: "#64748b", textDecoration: "none", fontSize: 13 },
  hero: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 60, padding: "80px 60px", minHeight: "85vh", alignItems: "center", borderBottom: `1px solid ${BORDER}` },
  heroTerminal: { background: "#161b22", border: `1px solid ${BORDER}`, borderRadius: 8, overflow: "hidden", boxShadow: `0 0 40px rgba(0,255,159,0.08)` },
  terminalBar: { background: "#21262d", padding: "12px 16px", display: "flex", alignItems: "center", gap: 8 },
  termDot: { width: 12, height: 12, borderRadius: "50%", background: "#ff5f56", display: "inline-block" },
  termTitle: { fontSize: 12, color: "#4a5568", marginLeft: 8 },
  termBody: { padding: 24, display: "flex", flexDirection: "column", gap: 12, minHeight: 280 },
  termLine: { display: "flex", alignItems: "center", gap: 8 },
  prompt: { color: GREEN, fontWeight: 700, fontSize: 15 },
  cmd: { color: CYAN, fontSize: 14 },
  termOutput: { color: "#8b949e", fontSize: 13, paddingLeft: 20, lineHeight: 1.8 },
  cursor: { color: GREEN, fontSize: 18 },
  heroInfo: { display: "flex", flexDirection: "column", gap: 20 },
  heroName: { fontFamily: "'Orbitron', monospace", fontSize: "clamp(24px, 3vw, 42px)", fontWeight: 900, color: GREEN, lineHeight: 1.1, position: "relative" },
  heroTitle: { fontSize: 16, color: CYAN, fontWeight: 500 },
  heroBadges: { display: "flex", gap: 12, flexWrap: "wrap" },
  badge: { background: "rgba(0,255,159,0.1)", border: `1px solid ${GREEN}`, color: GREEN, padding: "4px 14px", fontSize: 11, letterSpacing: "0.1em", boxShadow: `0 0 10px rgba(0,255,159,0.2)` },
  badgeNeutral: { background: "rgba(0,207,255,0.08)", border: "1px solid rgba(0,207,255,0.3)", color: CYAN, padding: "4px 14px", fontSize: 11, letterSpacing: "0.06em" },
  heroStats: { display: "flex", gap: 24, alignItems: "center" },
  heroStat: { display: "flex", flexDirection: "column", gap: 4 },
  heroStatNum: { fontFamily: "'Orbitron', monospace", fontSize: 36, fontWeight: 900, color: GREEN, lineHeight: 1 },
  heroStatLabel: { fontSize: 10, color: "#4a5568", letterSpacing: "0.15em" },
  heroStatDiv: { width: 1, height: 40, background: BORDER },
  heroCTAs: { display: "flex", gap: 14, flexWrap: "wrap" },
  ctaGreen: { background: "rgba(0,255,159,0.1)", border: `1px solid ${GREEN}`, color: GREEN, padding: "12px 24px", fontSize: 13, textDecoration: "none", fontWeight: 700, letterSpacing: "0.06em", boxShadow: `0 0 20px rgba(0,255,159,0.2)` },
  ctaOutline: { border: `1px solid ${BORDER}`, color: "#64748b", padding: "12px 24px", fontSize: 13, textDecoration: "none", fontWeight: 600, letterSpacing: "0.06em" },
  section: { padding: "80px 60px", borderBottom: `1px solid ${BORDER}` },
  sectionHeader: { display: "flex", alignItems: "center", gap: 24, marginBottom: 40 },
  sectionCmd: { color: CYAN, fontSize: 14, whiteSpace: "nowrap", fontWeight: 500 },
  sectionLine: { flex: 1, height: 1, background: BORDER },
  skillsGrid: { display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: 16 },
  skillCard: { background: SURFACE, border: `1px solid ${BORDER}`, padding: 20 },
  skillHeader: { display: "flex", alignItems: "center", gap: 8, marginBottom: 12 },
  skillNum: { color: "#2d3748", fontSize: 11, fontWeight: 700 },
  skillEmoji: { fontSize: 16 },
  skillName: { color: "#e6edf3", flex: 1, fontSize: 13, fontWeight: 600 },
  skillPct: { color: GREEN, fontWeight: 700, fontSize: 14 },
  skillBar: { height: 3, background: "rgba(255,255,255,0.06)", position: "relative", marginBottom: 10 },
  skillFill: { height: "100%", background: GREEN, position: "relative" },
  skillFillGlow: { position: "absolute", top: 0, height: "100%", background: `linear-gradient(90deg, transparent, ${GREEN})`, filter: "blur(4px)", opacity: 0.6 },
  skillDesc: { fontSize: 12, color: "#4a5568", lineHeight: 1.5 },
  projectsGrid: { display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(360px, 1fr))", gap: 20 },
  projectCard: { background: SURFACE, border: `1px solid ${BORDER}`, padding: 28 },
  projectIdRow: { display: "flex", justifyContent: "space-between", marginBottom: 12 },
  projectId: { fontSize: 11, color: "#2d3748", letterSpacing: "0.1em" },
  projectStatus: { fontSize: 11, color: GREEN },
  projectTitle: { fontFamily: "'Orbitron', monospace", fontSize: 18, fontWeight: 700, color: "#e6edf3", marginBottom: 10 },
  projectDesc: { fontSize: 13, color: "#8b949e", lineHeight: 1.7, marginBottom: 16 },
  techRow: { display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 16 },
  techChip: { border: `1px solid ${BORDER}`, color: "#4a5568", padding: "3px 10px", fontSize: 11 },
  projectBtns: { display: "flex", gap: 12 },
  projBtn: { border: `1px solid ${BORDER}`, color: "#64748b", padding: "6px 14px", fontSize: 12, textDecoration: "none", fontWeight: 600, letterSpacing: "0.06em" },
  projBtnGreen: { border: `1px solid ${GREEN}`, color: GREEN },
  expList: { display: "flex", flexDirection: "column", gap: 16 },
  expItem: { background: SURFACE, border: `1px solid ${BORDER}`, padding: 24, display: "flex", gap: 20 },
  expLeft: { paddingTop: 2 },
  expIdx: { color: "#2d3748", fontSize: 13, fontWeight: 700, whiteSpace: "nowrap" },
  expRight: { flex: 1 },
  expHeaderRow: { display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 10 },
  expRole: { fontFamily: "'Orbitron', monospace", fontSize: 16, fontWeight: 700, color: "#e6edf3", marginBottom: 4 },
  expCompany: { color: CYAN, fontSize: 13, fontWeight: 600 },
  expDates: { fontSize: 12, color: "#2d3748" },
  expDesc: { fontSize: 13, color: "#8b949e", lineHeight: 1.6, marginBottom: 10 },
  expPoints: { listStyle: "none", display: "flex", flexDirection: "column", gap: 6 },
  expPoint: { fontSize: 13, color: "#8b949e", display: "flex", gap: 8 },
  expBullet: { color: GREEN, fontSize: 12, paddingTop: 2 },
  blogGrid: { display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: 20 },
  blogCard: { background: SURFACE, border: `1px solid ${BORDER}`, padding: 24 },
  blogCat: { fontSize: 10, color: CYAN, letterSpacing: "0.15em", marginBottom: 10 },
  blogTitle: { fontSize: 16, fontWeight: 700, color: "#e6edf3", marginBottom: 10, lineHeight: 1.4 },
  blogExcerpt: { fontSize: 13, color: "#8b949e", lineHeight: 1.6, marginBottom: 14 },
  blogDate: { fontSize: 11, color: "#2d3748", fontStyle: "italic" },
  testGrid: { display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: 20 },
  testCard: { background: SURFACE, border: `1px solid ${BORDER}`, padding: 24 },
  testRating: { display: "flex", gap: 4, marginBottom: 12 },
  star: { color: "#f59e0b", fontSize: 14 },
  testText: { fontSize: 13, color: "#8b949e", lineHeight: 1.7, fontStyle: "italic", marginBottom: 16 },
  testAuthor: { fontSize: 12 },
  testName: { color: GREEN, fontWeight: 600 },
  testRole: { color: "#4a5568" },
  contactGrid: { display: "grid", gridTemplateColumns: "1fr 1.5fr", gap: 60 },
  contactLeft: {},
  contactText: { fontSize: 14, color: "#4a5568", lineHeight: 1.8, marginBottom: 32 },
  contactField: { display: "flex", gap: 12, marginBottom: 16, alignItems: "center" },
  contactFieldLabel: { fontSize: 11, color: "#2d3748", letterSpacing: "0.1em", minWidth: 80 },
  contactFieldVal: { color: GREEN, textDecoration: "none", fontSize: 14 },
  socialRow: { display: "flex", gap: 12, marginTop: 32, flexWrap: "wrap" },
  socialBtn: { border: `1px solid ${BORDER}`, color: "#4a5568", padding: "6px 14px", fontSize: 11, textDecoration: "none", letterSpacing: "0.08em" },
  contactForm: { display: "flex", flexDirection: "column", gap: 16 },
  inputWrap: { display: "flex", alignItems: "center", gap: 12 },
  inputPrefix: { color: GREEN, fontSize: 13, minWidth: 70, flexShrink: 0 },
  cyberInput: { flex: 1, background: "rgba(0,255,159,0.03)", border: `1px solid ${BORDER}`, borderBottom: `1px solid rgba(0,255,159,0.3)`, padding: "12px 14px", color: "#e6edf3", fontSize: 13, fontFamily: "'JetBrains Mono', monospace" },
  cyberTextarea: { minHeight: 100, resize: "vertical" },
  sendBtn: { background: "rgba(0,255,159,0.1)", border: `1px solid ${GREEN}`, color: GREEN, padding: "14px 28px", fontSize: 14, fontFamily: "'JetBrains Mono', monospace", fontWeight: 700, cursor: "pointer", letterSpacing: "0.08em", alignSelf: "flex-start", boxShadow: `0 0 20px rgba(0,255,159,0.15)` },
  footer: { padding: "28px 60px", borderTop: `1px solid ${BORDER}`, textAlign: "center" },
  footerText: { fontSize: 12, color: "#2d3748" },
};