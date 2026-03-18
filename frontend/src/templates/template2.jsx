"use client";

import { error, success } from "../util/toast";
import { usePortfolio } from "../../context/PortfolioContext";
import { sendContactMessage } from "../../service/api";
import { useState, useEffect, useRef } from "react";

function formatDate(dateString) {
  if (!dateString) return "";
  return new Date(dateString).toLocaleDateString("en-US", { year:"numeric", month:"short", day:"numeric" });
}
function truncate(str, n) { return str?.length > n ? str.substring(0, n-1) + "…" : str; }

export default function Template2() {
  const { portfolioData, loading } = usePortfolio();
  const [contactForm, setContactForm] = useState({ name:"", email:"", subject:"", message:"" });
  const [sending, setSending] = useState(false);
  const [mousePos, setMousePos] = useState({ x:0, y:0 });
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const h = (e) => setMousePos({ x:e.clientX, y:e.clientY });
    window.addEventListener("mousemove", h);
    return () => window.removeEventListener("mousemove", h);
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
      setContactForm({ name:"", email:"", subject:"", message:"" });
    } catch (err) { error(err.message); }
    finally { setSending(false); }
  }

  if (loading) return (
    <div style={styles.loadingContainer}>
      <div style={styles.loadingOrb} />
      <span style={styles.loadingText}>Loading...</span>
      <style>{`@keyframes pulse{0%,100%{transform:scale(1);opacity:1}50%{transform:scale(1.5);opacity:0.5}}`}</style>
    </div>
  );

  return (
    <div style={styles.root}>
      <style>{globalStyles}</style>
      <div style={{ ...styles.cursorGlow, left:mousePos.x-200, top:mousePos.y-200 }} />
      <div style={styles.orb1} /><div style={styles.orb2} /><div style={styles.orb3} />

      {/* NAV */}
      <nav style={styles.nav}>
        <div style={styles.navLogo}>
          <span style={styles.navLogoText}>{profile?.name?.split(" ")[0] || "DEV"}</span>
        </div>
        <div className={`t2-nav-links${menuOpen ? " t2-nav-open" : ""}`} style={styles.navLinks}>
          {["skills","projects","experience","blog","contact"].map(s => (
            <a key={s} href={`#${s}`} style={styles.navLink} className="t2-nav-link"
              onClick={() => setMenuOpen(false)}
              data-track={JSON.stringify({ event_type:"nav_click", metadata:{ section:s } })}>
              {s.charAt(0).toUpperCase()+s.slice(1)}
            </a>
          ))}
        </div>
        <button style={styles.hamburger} className="t2-hamburger" onClick={() => setMenuOpen(!menuOpen)} aria-label="Menu">
          <span className={`t2-bar${menuOpen?" t2-bar-open-1":""}`} />
          <span className={`t2-bar${menuOpen?" t2-bar-open-2":""}`} />
          <span className={`t2-bar${menuOpen?" t2-bar-open-3":""}`} />
        </button>
      </nav>

      {/* HERO */}
      <section style={styles.hero}>
        <div style={styles.heroContent}>
          <div style={styles.heroBadge}><span style={styles.heroBadgeDot} />Available for work</div>
          <h1 style={styles.heroName}>{profile?.name || "Your Name"}</h1>
          <p style={styles.heroTitle}>{profile?.title || "Full Stack Developer"}</p>
          <p style={styles.heroBio}>{profile?.bio || "Building beautiful digital experiences."}</p>
          <div style={styles.heroCTAs}>
            <a href="#projects" style={styles.ctaPrimary} className="t2-btn-glow"
              data-track={JSON.stringify({ event_type:"cta_click", metadata:{ type:"view_work", location:"hero" } })}>View Work</a>
            <a href="#contact" style={styles.ctaSecondary}
              data-track={JSON.stringify({ event_type:"cta_click", metadata:{ type:"contact", location:"hero" } })}>Get in Touch</a>
          </div>
        </div>
        <div style={styles.heroVisual}>
          <div style={styles.heroCard}>
            <div style={styles.heroCardInner}>
              <div style={styles.heroAvatar}>{profile?.name?.[0] || "D"}</div>
              <div style={styles.heroCardStats}>
                <div style={styles.stat}><span style={styles.statNum}>{projects.length}+</span><span style={styles.statLabel}>Projects</span></div>
                <div style={styles.statDivider} />
                <div style={styles.stat}><span style={styles.statNum}>{skills.length}+</span><span style={styles.statLabel}>Skills</span></div>
                <div style={styles.statDivider} />
                <div style={styles.stat}><span style={styles.statNum}>{experiences.length}+</span><span style={styles.statLabel}>Roles</span></div>
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
              <div key={skill.id} style={styles.skillCard} className="t2-glass-card"
                data-track={JSON.stringify({ event_type:"skill_view", metadata:{ skill_name:skill.name } })}>
                <div style={styles.skillTop}>
                  <span style={styles.skillIcon}>{skill.icon}</span>
                  <span style={styles.skillName}>{skill.name}</span>
                  <span style={styles.skillPct}>{skill.percentage}%</span>
                </div>
                <div style={styles.skillBar}>
                  <div style={{ ...styles.skillBarFill, width:`${skill.percentage}%`, animationDelay:`${i*0.1}s` }} className="t2-skill-fill" />
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
              <div key={p.id} style={{ ...styles.projectCard, ...(i===0?styles.projectCardFeatured:{}) }} className="t2-glass-card t2-project-card"
                data-track={JSON.stringify({ event_type:"project_view", metadata:{ project_id:p.id, project_name:p.title } })}>
                <div style={styles.projectNum}>0{i+1}</div>
                <h3 style={styles.projectTitle}>{p.title}</h3>
                <p style={styles.projectDesc}>{p.description}</p>
                {p.techstack?.length > 0 && (
                  <div style={styles.techstack}>{p.techstack.map((t,j) => <span key={j} style={styles.techTag}>{t}</span>)}</div>
                )}
                <div style={styles.projectLinks}>
                  {p.github_link && <a href={p.github_link} target="_blank" style={styles.projectLink} className="t2-project-link-btn"
                    data-track={JSON.stringify({ event_type:"project_link_click", metadata:{ project_id:p.id, link_type:"github" } })}>GitHub ↗</a>}
                  {p.live_link && <a href={p.live_link} target="_blank" style={styles.projectLinkPrimary} className="t2-btn-glow"
                    data-track={JSON.stringify({ event_type:"project_link_click", metadata:{ project_id:p.id, link_type:"live_demo" } })}>Live Demo ↗</a>}
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
              <div key={exp.id} style={styles.timelineItem}
                data-track={JSON.stringify({ event_type:"experience_view", metadata:{ experience_id:exp.id, company:exp.company } })}>
                <div style={styles.timelineLine} /><div style={styles.timelineDot} />
                <div style={styles.timelineCard} className="t2-glass-card">
                  <div style={styles.timelineHeader}>
                    <div>
                      <h3 style={styles.expRole}>{exp.role}</h3>
                      <div style={styles.expCompany}>{exp.company}</div>
                    </div>
                    <div style={styles.expDates}>{formatDate(exp.start_date)} — {exp.is_current==="true"?"Present":formatDate(exp.end_date)}</div>
                  </div>
                  {exp.description && <p style={styles.expDesc}>{exp.description}</p>}
                  {exp.points?.length > 0 && (
                    <ul style={styles.expPoints}>{exp.points.map((pt,j) => <li key={j} style={styles.expPoint}>{pt}</li>)}</ul>
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
              <div key={blog.id} style={styles.blogCard} className="t2-glass-card"
                data-track={JSON.stringify({ event_type:"blog_view", metadata:{ blog_id:blog.id, blog_title:blog.title } })}>
                <span style={styles.blogCategory}>{blog.category||"General"}</span>
                <h3 style={styles.blogTitle}>{blog.title}</h3>
                <p style={styles.blogExcerpt}>{truncate(blog.excerpt,120)}</p>
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
              <div key={t.id} style={styles.testimonialCard} className="t2-glass-card"
                data-track={JSON.stringify({ event_type:"testimonial_view", metadata:{ testimonial_id:t.id, name:t.name } })}>
                <div style={styles.testimonialStars}>{"★".repeat(t.rating)}</div>
                <p style={styles.testimonialText}>"{t.review}"</p>
                <div style={styles.testimonialAuthor}>
                  <div style={styles.testimonialAvatar}>{t.name?.[0]}</div>
                  <div><div style={styles.testimonialName}>{t.name}</div><div style={styles.testimonialRole}>{t.role} @ {t.company}</div></div>
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
            <p style={styles.contactSubtext}>Have a project in mind? Let's collaborate and build something extraordinary.</p>
            {profile.email && <div style={styles.contactItem}><span style={styles.contactLabel}>Email</span><a href={`mailto:${profile.email}`} style={styles.contactValue}
              data-track={JSON.stringify({ event_type:"contact_info_click", metadata:{ type:"email" } })}>{profile.email}</a></div>}
            {profile.location && <div style={styles.contactItem}><span style={styles.contactLabel}>Location</span><span style={styles.contactValue}>{profile.location}</span></div>}
            {socialLinks.length > 0 && (
              <div style={styles.socialLinks}>
                {socialLinks.map(link => (
                  <a key={link.id} href={link.url} target="_blank" rel="noopener noreferrer" style={styles.socialLink} className="t2-social-link"
                    data-track={JSON.stringify({ event_type:"social_click", metadata:{ platform:link.platform, location:"contact" } })}>{link.platform}</a>
                ))}
              </div>
            )}
          </div>
          <form onSubmit={handleContact} style={styles.contactForm}>
            <input required placeholder="Your Name" value={contactForm.name} onChange={e => setContactForm({...contactForm,name:e.target.value})} style={styles.input} className="t2-glass-input"
              data-track={JSON.stringify({ event_type:"form_interaction", metadata:{ field:"name" } })} />
            <input required type="email" placeholder="Email Address" value={contactForm.email} onChange={e => setContactForm({...contactForm,email:e.target.value})} style={styles.input} className="t2-glass-input"
              data-track={JSON.stringify({ event_type:"form_interaction", metadata:{ field:"email" } })} />
            <input placeholder="Subject" value={contactForm.subject} onChange={e => setContactForm({...contactForm,subject:e.target.value})} style={styles.input} className="t2-glass-input"
              data-track={JSON.stringify({ event_type:"form_interaction", metadata:{ field:"subject" } })} />
            <textarea required placeholder="Your Message" value={contactForm.message} onChange={e => setContactForm({...contactForm,message:e.target.value})} style={styles.textarea} className="t2-glass-input"
              data-track={JSON.stringify({ event_type:"form_interaction", metadata:{ field:"message" } })} />
            <button disabled={sending} style={styles.submitBtn} className="t2-btn-glow"
              data-track={JSON.stringify({ event_type:"form_submit_click", metadata:{ form:"contact" } })}>{sending?"Sending...":"Send Message →"}</button>
          </form>
        </div>
      </section>

      <footer style={styles.footer}>
        <div style={styles.footerGlass}>
          <span style={styles.footerText}>© {new Date().getFullYear()} {profile?.name||"Your Name"} · Built with passion</span>
          {socialLinks.length > 0 && (
            <div style={styles.footerSocials}>
              {socialLinks.map(link => (
                <a key={link.id} href={link.url} target="_blank" rel="noopener noreferrer" style={styles.footerLink} className="t2-social-link"
                  data-track={JSON.stringify({ event_type:"social_click", metadata:{ platform:link.platform, location:"footer" } })}>{link.platform}</a>
              ))}
            </div>
          )}
        </div>
      </footer>
    </div>
  );
}

const globalStyles = `
@import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800;900&family=DM+Serif+Display:ital@0;1&display=swap');
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
.t2-nav-link{transition:color 0.3s,text-shadow 0.3s}
.t2-nav-link:hover{color:#a78bfa !important;text-shadow:0 0 20px rgba(167,139,250,0.5)}
.t2-glass-card{transition:transform 0.3s ease,box-shadow 0.3s ease}
.t2-glass-card:hover{transform:translateY(-4px);box-shadow:0 20px 60px rgba(167,139,250,0.2),0 0 0 1px rgba(255,255,255,0.15) !important}
.t2-btn-glow{transition:all 0.3s ease}
.t2-btn-glow:hover{box-shadow:0 0 30px rgba(167,139,250,0.6),0 0 60px rgba(167,139,250,0.3) !important;transform:translateY(-2px)}
@keyframes fillBar{from{width:0% !important}}
.t2-skill-fill{animation:fillBar 1.2s cubic-bezier(0.4,0,0.2,1) both}
.t2-project-card{transition:all 0.4s ease}
.t2-project-card:hover{transform:translateY(-6px) scale(1.01)}
.t2-glass-input{transition:all 0.3s ease;outline:none}
.t2-glass-input:focus{border-color:rgba(167,139,250,0.6) !important;box-shadow:0 0 20px rgba(167,139,250,0.2) !important}
.t2-social-link{transition:all 0.3s}
.t2-social-link:hover{color:#a78bfa !important;transform:translateY(-2px)}
.t2-project-link-btn{transition:all 0.3s}
.t2-project-link-btn:hover{color:#a78bfa !important}
@keyframes float{0%,100%{transform:translateY(0px) rotate(0deg)}33%{transform:translateY(-20px) rotate(1deg)}66%{transform:translateY(-10px) rotate(-1deg)}}
@keyframes orbFloat1{0%,100%{transform:translate(0,0) scale(1)}50%{transform:translate(30px,-50px) scale(1.1)}}
@keyframes orbFloat2{0%,100%{transform:translate(0,0) scale(1)}50%{transform:translate(-40px,30px) scale(0.9)}}
@keyframes orbFloat3{0%,100%{transform:translate(0,0) scale(1)}50%{transform:translate(20px,40px) scale(1.05)}}
@keyframes pulse{0%,100%{opacity:1}50%{opacity:0.3}}
.t2-hamburger{display:none;background:none;border:none;cursor:pointer;padding:4px;flex-direction:column;gap:5px;align-items:center}
.t2-bar{display:block;width:22px;height:2px;background:#e2e8f0;transition:all 0.3s}
.t2-bar-open-1{transform:rotate(45deg) translate(5px,5px)}
.t2-bar-open-2{opacity:0}
.t2-bar-open-3{transform:rotate(-45deg) translate(5px,-5px)}
@media(max-width:1024px){
  .t2-hamburger{display:flex !important}
  .t2-nav-links{display:none !important}
  .t2-nav-open{display:flex !important;flex-direction:column;position:absolute;top:100%;left:0;right:0;background:rgba(5,5,16,0.97);padding:20px 24px;gap:16px;border-bottom:1px solid rgba(255,255,255,0.06);z-index:300}
}
@media(max-width:768px){
  .t2-hero{flex-direction:column !important;padding:60px 24px !important;min-height:auto !important}
  .t2-hero-visual{display:none !important}
  .t2-contact-grid{grid-template-columns:1fr !important}
  .t2-form-row{display:none}
}
`;

const styles = {
  root:{ fontFamily:"'Outfit', sans-serif", background:"#050510", color:"#e2e8f0", minHeight:"100vh", position:"relative", overflow:"hidden" },
  loadingContainer:{ display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", minHeight:"100vh", background:"#050510", gap:16 },
  loadingOrb:{ width:40, height:40, borderRadius:"50%", background:"linear-gradient(135deg,#a78bfa,#60a5fa)", animation:"pulse 1.5s ease-in-out infinite" },
  loadingText:{ color:"#a78bfa", fontFamily:"'Outfit', sans-serif", fontSize:16 },
  cursorGlow:{ position:"fixed", width:400, height:400, borderRadius:"50%", background:"radial-gradient(circle,rgba(167,139,250,0.06) 0%,transparent 70%)", pointerEvents:"none", zIndex:0, transition:"left 0.1s ease,top 0.1s ease" },
  orb1:{ position:"fixed", top:"-20%", left:"-10%", width:"50vw", height:"50vw", borderRadius:"50%", background:"radial-gradient(circle,rgba(167,139,250,0.12) 0%,transparent 70%)", animation:"orbFloat1 12s ease-in-out infinite", pointerEvents:"none", zIndex:0 },
  orb2:{ position:"fixed", bottom:"10%", right:"-10%", width:"40vw", height:"40vw", borderRadius:"50%", background:"radial-gradient(circle,rgba(96,165,250,0.1) 0%,transparent 70%)", animation:"orbFloat2 15s ease-in-out infinite", pointerEvents:"none", zIndex:0 },
  orb3:{ position:"fixed", top:"50%", left:"40%", width:"30vw", height:"30vw", borderRadius:"50%", background:"radial-gradient(circle,rgba(244,114,182,0.07) 0%,transparent 70%)", animation:"orbFloat3 18s ease-in-out infinite", pointerEvents:"none", zIndex:0 },
  nav:{ display:"flex", justifyContent:"space-between", alignItems:"center", padding:"clamp(14px,2vw,20px) clamp(20px,5vw,60px)", position:"sticky", top:0, zIndex:100, background:"rgba(5,5,16,0.7)", backdropFilter:"blur(20px)", borderBottom:"1px solid rgba(255,255,255,0.06)" },
  navLogo:{ display:"flex", alignItems:"center", gap:8 },
  navLogoText:{ fontSize:"clamp(18px,2.5vw,22px)", fontWeight:800, letterSpacing:"-0.5px", background:"linear-gradient(135deg,#a78bfa,#60a5fa)", WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent" },
  navLinks:{ display:"flex", gap:"clamp(16px,2.5vw,36px)" },
  navLink:{ color:"#94a3b8", fontSize:"clamp(12px,1.2vw,14px)", textDecoration:"none", fontWeight:500, letterSpacing:"0.02em" },
  hamburger:{ display:"none", background:"none", border:"none", cursor:"pointer", padding:4, flexDirection:"column", gap:5, alignItems:"center" },
  hero:{ minHeight:"92vh", display:"flex", alignItems:"center", justifyContent:"space-between", padding:"clamp(60px,8vw,80px) clamp(20px,5vw,60px)", position:"relative", zIndex:1, gap:40, flexWrap:"wrap" },
  heroContent:{ maxWidth:600, flex:"1 1 300px" },
  heroBadge:{ display:"inline-flex", alignItems:"center", gap:8, background:"rgba(167,139,250,0.1)", border:"1px solid rgba(167,139,250,0.3)", padding:"6px 16px", borderRadius:100, fontSize:12, color:"#a78bfa", fontWeight:600, letterSpacing:"0.08em", textTransform:"uppercase", marginBottom:24 },
  heroBadgeDot:{ width:6, height:6, borderRadius:"50%", background:"#a78bfa", boxShadow:"0 0 8px #a78bfa", display:"inline-block", animation:"pulse 2s ease-in-out infinite" },
  heroName:{ fontFamily:"'DM Serif Display', serif", fontSize:"clamp(48px,6vw,88px)", fontWeight:400, lineHeight:1.05, color:"#f8fafc", marginBottom:12, textShadow:"0 0 80px rgba(167,139,250,0.2)" },
  heroTitle:{ fontSize:"clamp(16px,1.8vw,20px)", color:"#a78bfa", fontWeight:600, marginBottom:16 },
  heroBio:{ fontSize:"clamp(14px,1.5vw,17px)", color:"#94a3b8", lineHeight:1.7, marginBottom:36, maxWidth:480 },
  heroCTAs:{ display:"flex", gap:16, flexWrap:"wrap" },
  ctaPrimary:{ background:"linear-gradient(135deg,#a78bfa,#60a5fa)", color:"#fff", padding:"clamp(11px,1.2vw,14px) clamp(20px,3vw,32px)", borderRadius:8, textDecoration:"none", fontWeight:700, fontSize:"clamp(13px,1.3vw,15px)", boxShadow:"0 4px 24px rgba(167,139,250,0.4)" },
  ctaSecondary:{ border:"1px solid rgba(255,255,255,0.15)", color:"#e2e8f0", padding:"clamp(11px,1.2vw,14px) clamp(20px,3vw,32px)", borderRadius:8, textDecoration:"none", fontWeight:600, fontSize:"clamp(13px,1.3vw,15px)" },
  heroVisual:{ flex:"0 0 auto", display:"flex", alignItems:"center", justifyContent:"center" },
  heroCard:{ background:"rgba(255,255,255,0.04)", backdropFilter:"blur(20px)", border:"1px solid rgba(255,255,255,0.1)", borderRadius:24, padding:"clamp(28px,4vw,48px)", animation:"float 6s ease-in-out infinite", boxShadow:"0 8px 40px rgba(167,139,250,0.15)" },
  heroCardInner:{ display:"flex", flexDirection:"column", alignItems:"center", gap:28 },
  heroAvatar:{ width:100, height:100, borderRadius:"50%", background:"linear-gradient(135deg,#a78bfa,#60a5fa)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:42, fontWeight:700, color:"#fff", boxShadow:"0 0 40px rgba(167,139,250,0.5)" },
  heroCardStats:{ display:"flex", gap:24, alignItems:"center" },
  stat:{ display:"flex", flexDirection:"column", alignItems:"center", gap:4 },
  statNum:{ fontSize:28, fontWeight:800, color:"#f8fafc" },
  statLabel:{ fontSize:12, color:"#64748b", textTransform:"uppercase", letterSpacing:"0.08em" },
  statDivider:{ width:1, height:40, background:"rgba(255,255,255,0.1)" },
  section:{ padding:"clamp(60px,8vw,100px) clamp(20px,5vw,60px)", position:"relative", zIndex:1, borderTop:"1px solid rgba(255,255,255,0.04)" },
  sectionHeader:{ marginBottom:56, display:"flex", flexDirection:"column", gap:8 },
  sectionTag:{ fontSize:12, fontWeight:700, color:"#a78bfa", textTransform:"uppercase", letterSpacing:"0.14em" },
  sectionTitle:{ fontFamily:"'DM Serif Display', serif", fontSize:"clamp(32px,4vw,56px)", fontWeight:400, color:"#f8fafc", lineHeight:1.1 },
  skillsGrid:{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(min(300px,100%),1fr))", gap:20 },
  skillCard:{ background:"rgba(255,255,255,0.04)", backdropFilter:"blur(16px)", border:"1px solid rgba(255,255,255,0.08)", borderRadius:16, padding:24, boxShadow:"0 4px 20px rgba(0,0,0,0.2)" },
  skillTop:{ display:"flex", alignItems:"center", gap:10, marginBottom:12 },
  skillIcon:{ fontSize:20 },
  skillName:{ fontWeight:600, flex:1, color:"#e2e8f0" },
  skillPct:{ color:"#a78bfa", fontWeight:700, fontSize:14 },
  skillBar:{ height:4, background:"rgba(255,255,255,0.08)", borderRadius:4, overflow:"hidden", marginBottom:12 },
  skillBarFill:{ height:"100%", background:"linear-gradient(90deg,#a78bfa,#60a5fa)", borderRadius:4 },
  skillDesc:{ fontSize:13, color:"#64748b", lineHeight:1.5 },
  projectsGrid:{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(min(380px,100%),1fr))", gap:24 },
  projectCard:{ background:"rgba(255,255,255,0.04)", backdropFilter:"blur(16px)", border:"1px solid rgba(255,255,255,0.08)", borderRadius:20, padding:"clamp(20px,3vw,32px)", boxShadow:"0 4px 20px rgba(0,0,0,0.2)" },
  projectCardFeatured:{ background:"rgba(167,139,250,0.06)", border:"1px solid rgba(167,139,250,0.2)", gridColumn:"1 / -1" },
  projectNum:{ fontSize:48, fontWeight:900, color:"rgba(167,139,250,0.15)", lineHeight:1, marginBottom:12 },
  projectTitle:{ fontSize:"clamp(18px,2vw,22px)", fontWeight:700, color:"#f8fafc", marginBottom:10 },
  projectDesc:{ fontSize:15, color:"#94a3b8", lineHeight:1.6, marginBottom:20 },
  techstack:{ display:"flex", flexWrap:"wrap", gap:8, marginBottom:20 },
  techTag:{ background:"rgba(255,255,255,0.06)", border:"1px solid rgba(255,255,255,0.1)", padding:"4px 12px", borderRadius:100, fontSize:12, color:"#94a3b8", fontWeight:500 },
  projectLinks:{ display:"flex", gap:12, alignItems:"center", flexWrap:"wrap" },
  projectLink:{ color:"#64748b", textDecoration:"none", fontSize:13, fontWeight:600 },
  projectLinkPrimary:{ background:"linear-gradient(135deg,#a78bfa,#60a5fa)", color:"#fff", padding:"8px 20px", borderRadius:8, textDecoration:"none", fontSize:13, fontWeight:700, boxShadow:"0 4px 20px rgba(167,139,250,0.3)" },
  timeline:{ display:"flex", flexDirection:"column", gap:0, paddingLeft:"clamp(16px,3vw,32px)" },
  timelineItem:{ position:"relative", paddingLeft:"clamp(20px,3vw,32px)", paddingBottom:40 },
  timelineLine:{ position:"absolute", left:0, top:20, bottom:0, width:1, background:"rgba(167,139,250,0.2)" },
  timelineDot:{ position:"absolute", left:-5, top:20, width:12, height:12, borderRadius:"50%", background:"linear-gradient(135deg,#a78bfa,#60a5fa)", boxShadow:"0 0 12px rgba(167,139,250,0.6)" },
  timelineCard:{ background:"rgba(255,255,255,0.04)", backdropFilter:"blur(16px)", border:"1px solid rgba(255,255,255,0.08)", borderRadius:16, padding:"clamp(16px,2vw,24px)" },
  timelineHeader:{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:12, flexWrap:"wrap", gap:8 },
  expRole:{ fontSize:"clamp(16px,2vw,20px)", fontWeight:700, color:"#f8fafc", marginBottom:4 },
  expCompany:{ fontSize:15, color:"#a78bfa", fontWeight:600 },
  expDates:{ fontSize:13, color:"#64748b" },
  expDesc:{ fontSize:15, color:"#94a3b8", lineHeight:1.6, marginBottom:12 },
  expPoints:{ paddingLeft:16 },
  expPoint:{ fontSize:14, color:"#94a3b8", marginBottom:6, lineHeight:1.5 },
  blogGrid:{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(min(320px,100%),1fr))", gap:24 },
  blogCard:{ background:"rgba(255,255,255,0.04)", backdropFilter:"blur(16px)", border:"1px solid rgba(255,255,255,0.08)", borderRadius:16, padding:28 },
  blogCategory:{ fontSize:11, fontWeight:700, textTransform:"uppercase", letterSpacing:"0.1em", color:"#a78bfa", background:"rgba(167,139,250,0.1)", padding:"4px 10px", borderRadius:100, display:"inline-block", marginBottom:14 },
  blogTitle:{ fontSize:"clamp(16px,1.8vw,18px)", fontWeight:700, color:"#f8fafc", marginBottom:10, lineHeight:1.4 },
  blogExcerpt:{ fontSize:14, color:"#94a3b8", lineHeight:1.6, marginBottom:16 },
  blogMeta:{ fontSize:13, color:"#475569" },
  testimonialsGrid:{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(min(320px,100%),1fr))", gap:24 },
  testimonialCard:{ background:"rgba(255,255,255,0.04)", backdropFilter:"blur(16px)", border:"1px solid rgba(255,255,255,0.08)", borderRadius:16, padding:28 },
  testimonialStars:{ color:"#f59e0b", fontSize:18, marginBottom:12 },
  testimonialText:{ fontSize:15, color:"#94a3b8", lineHeight:1.7, fontStyle:"italic", marginBottom:20 },
  testimonialAuthor:{ display:"flex", alignItems:"center", gap:12 },
  testimonialAvatar:{ width:40, height:40, borderRadius:"50%", background:"linear-gradient(135deg,#a78bfa,#60a5fa)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:16, fontWeight:700, color:"#fff" },
  testimonialName:{ fontSize:15, fontWeight:700, color:"#e2e8f0" },
  testimonialRole:{ fontSize:13, color:"#64748b" },
  contactGrid:{ display:"grid", gridTemplateColumns:"1fr 1.5fr", gap:"clamp(32px,6vw,60px)" },
  contactInfo:{},
  contactSubtext:{ fontSize:16, color:"#94a3b8", lineHeight:1.7, marginBottom:36 },
  contactItem:{ marginBottom:24 },
  contactLabel:{ display:"block", fontSize:11, color:"#475569", textTransform:"uppercase", letterSpacing:"0.1em", marginBottom:6, fontWeight:700 },
  contactValue:{ fontSize:16, color:"#a78bfa", textDecoration:"none", fontWeight:600 },
  socialLinks:{ display:"flex", gap:16, marginTop:36, flexWrap:"wrap" },
  socialLink:{ color:"#64748b", textDecoration:"none", fontSize:14, fontWeight:600, padding:"8px 16px", border:"1px solid rgba(255,255,255,0.1)", borderRadius:8, display:"inline-flex", alignItems:"center" },
  contactForm:{ display:"flex", flexDirection:"column", gap:16 },
  input:{ background:"rgba(255,255,255,0.04)", border:"1px solid rgba(255,255,255,0.08)", borderRadius:10, padding:"14px 18px", color:"#e2e8f0", fontSize:15, backdropFilter:"blur(10px)", fontFamily:"'Outfit', sans-serif" },
  textarea:{ background:"rgba(255,255,255,0.04)", border:"1px solid rgba(255,255,255,0.08)", borderRadius:10, padding:"14px 18px", color:"#e2e8f0", fontSize:15, minHeight:130, resize:"vertical", backdropFilter:"blur(10px)", fontFamily:"'Outfit', sans-serif" },
  submitBtn:{ background:"linear-gradient(135deg,#a78bfa,#60a5fa)", color:"#fff", padding:"clamp(12px,1.5vw,16px) clamp(20px,3vw,32px)", border:"none", borderRadius:10, fontWeight:700, fontSize:16, cursor:"pointer", fontFamily:"'Outfit', sans-serif", boxShadow:"0 4px 24px rgba(167,139,250,0.4)", alignSelf:"flex-start" },
  footer:{ padding:"40px clamp(20px,5vw,60px)", borderTop:"1px solid rgba(255,255,255,0.06)", display:"flex", justifyContent:"center", position:"relative", zIndex:1 },
  footerGlass:{ display:"flex", alignItems:"center", gap:24, flexWrap:"wrap", justifyContent:"center" },
  footerText:{ fontSize:14, color:"#475569" },
  footerSocials:{ display:"flex", gap:16 },
  footerLink:{ fontSize:13, color:"#64748b", textDecoration:"none" },
};