"use client";

import { error, success } from "../util/toast";
import { usePortfolio } from "../../context/PortfolioContext";
import { sendContactMessage } from "../../service/api";
import { useState } from "react";

function formatDate(dateString) {
  if (!dateString) return "";
  return new Date(dateString).toLocaleDateString("en-US", { year:"numeric", month:"short", day:"numeric" });
}
function truncate(str, n) { return str?.length > n ? str.substring(0, n-1) + "…" : str; }

export default function Template3() {
  const { portfolioData, loading } = usePortfolio();
  const [contactForm, setContactForm] = useState({ name:"", email:"", subject:"", message:"" });
  const [sending, setSending] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

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

  if (loading) return <div style={{ minHeight:"100vh", background:"#faf9f6", display:"flex", alignItems:"center", justifyContent:"center", fontFamily:"'Playfair Display', serif", fontSize:24 }}>Loading...</div>;

  const today = new Date().toLocaleDateString("en-US", { weekday:"long", year:"numeric", month:"long", day:"numeric" });

  return (
    <div style={s.root}>
      <style>{css}</style>

      {/* Ticker */}
      <div style={s.ticker}>
        <span style={s.tickerLabel}>BREAKING</span>
        <div style={s.tickerTrack}>
          <span className="ticker-content">
            {profile.name} IS AVAILABLE FOR WORK &nbsp;•&nbsp; {skills.length} SKILLS &nbsp;•&nbsp; {projects.length} PROJECTS DELIVERED &nbsp;•&nbsp; {experiences.length} COMPANIES &nbsp;•&nbsp; OPEN TO COLLABORATIONS &nbsp;•&nbsp;&nbsp;&nbsp;&nbsp;
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
          <a href="#contact" style={s.mastheadCTA} className="t3-cta"
            data-track={JSON.stringify({ event_type:"cta_click", metadata:{ type:"hire_now", location:"masthead" } })}>HIRE NOW →</a>
        </div>
        <div style={s.mastheadRule} />
      </header>

      {/* NAV */}
      <nav style={s.nav}>
        <div style={s.navLinks} className={menuOpen ? "t3-nav-open" : ""}>
          {["skills","projects","experience","blog","contact"].map(sec => (
            <a key={sec} href={`#${sec}`} style={s.navLink} className="t3-nav-link"
              onClick={() => setMenuOpen(false)}
              data-track={JSON.stringify({ event_type:"nav_click", metadata:{ section:sec } })}>
              {sec.charAt(0).toUpperCase()+sec.slice(1)}
            </a>
          ))}
        </div>
        <button style={s.hamburger} className="t3-hamburger" onClick={() => setMenuOpen(!menuOpen)} aria-label="Menu">
          <span className={`t3-bar${menuOpen?" t3-bar-open-1":""}`} />
          <span className={`t3-bar${menuOpen?" t3-bar-open-2":""}`} />
          <span className={`t3-bar${menuOpen?" t3-bar-open-3":""}`} />
        </button>
      </nav>

      {/* HERO SPREAD */}
      <section style={s.heroSpread}>
        <div style={s.heroLeft}>
          <div style={s.heroKicker}>FRONT PAGE</div>
          <h1 style={s.heroHeadline}>
            {profile?.name || "Developer"}<br />
            <em style={s.heroHeadlineItalic}>Available for</em><br />
            Your Next<br />Big Project
          </h1>
          <div style={s.heroRule} />
          <p style={s.heroDek}>{profile?.bio || "Building world-class digital products."}</p>
          <div style={s.heroByline}>By <strong>{profile?.name || "The Developer"}</strong>{profile?.email ? ` | ${profile.email}` : ""}</div>
          <div style={s.heroCTAs}>
            <a href="#projects" style={s.heroCTA1} className="t3-cta"
              data-track={JSON.stringify({ event_type:"cta_click", metadata:{ type:"view_work", location:"hero" } })}>View My Work →</a>
            <a href="#contact" style={s.heroCTA2}
              data-track={JSON.stringify({ event_type:"cta_click", metadata:{ type:"contact", location:"hero" } })}>Get in Touch</a>
          </div>
        </div>
        <div style={s.heroMid}>
          <div style={s.heroStat}><span style={s.heroStatNum}>{projects.length}</span><span style={s.heroStatLabel}>Projects<br />Shipped</span></div>
          <div style={s.heroVertRule} />
          <div style={s.heroStat}><span style={s.heroStatNum}>{skills.length}</span><span style={s.heroStatLabel}>Skills<br />Mastered</span></div>
          <div style={s.heroVertRule} />
          <div style={s.heroStat}><span style={s.heroStatNum}>{experiences.length}</span><span style={s.heroStatLabel}>Companies<br />Worked</span></div>
        </div>
        <div style={s.heroRight}>
          <div style={s.pullQuote}>
            <div style={s.pullQuoteMarks}>"</div>
            <p style={s.pullQuoteText}>{truncate(profile?.bio,140) || "Passionate about building products that make a difference."}</p>
            <div style={s.pullQuoteAttrib}>— {profile?.name || "Developer"}</div>
          </div>
          {socialLinks.length > 0 && (
            <div style={s.heroSocials}>
              {socialLinks.map(link => (
                <a key={link.id} href={link.url} target="_blank" rel="noopener noreferrer" style={s.heroSocialLink}
                  data-track={JSON.stringify({ event_type:"social_click", metadata:{ platform:link.platform, location:"hero" } })}>{link.platform}</a>
              ))}
            </div>
          )}
        </div>
      </section>

      <div style={s.sectionRule} />

      {/* SKILLS */}
      {skills.length > 0 && (
        <section id="skills" style={s.section}>
          <div style={s.colHeader}><div style={s.colHeaderRule} /><span style={s.colHeaderText}>SKILLS & EXPERTISE</span><div style={s.colHeaderRule} /></div>
          <div style={s.skillsGrid}>
            {skills.map((skill, i) => (
              <div key={skill.id} style={s.skillCell}
                data-track={JSON.stringify({ event_type:"skill_view", metadata:{ skill_name:skill.name } })}>
                <div style={s.skillCellTop}>
                  <span style={s.skillEmoji}>{skill.icon}</span>
                  <span style={s.skillCellName}>{skill.name}</span>
                  <span style={s.skillCellPct}>{skill.percentage}%</span>
                </div>
                <div style={s.skillProgress}>
                  <div style={{ ...s.skillProgressFill, width:`${skill.percentage}%` }} className="t3-skill-progress" />
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      <div style={s.sectionRule} />

      {/* PROJECTS */}
      {projects.length > 0 && (
        <section id="projects" style={s.section}>
          <div style={s.colHeader}><div style={s.colHeaderRule} /><span style={s.colHeaderText}>FEATURED WORKS</span><div style={s.colHeaderRule} /></div>
          <div style={s.projectsLayout}>
            {projects.map((p, i) => (
              <div key={p.id} style={{ ...s.projectArticle, ...(i===0?s.projectArticleLead:{}) }}
                data-track={JSON.stringify({ event_type:"project_view", metadata:{ project_id:p.id, project_name:p.title } })}>
                {i===0 && <div style={s.articleKicker}>LEAD PROJECT</div>}
                <div style={s.articleNumber}>№{String(i+1).padStart(2,"0")}</div>
                <h3 style={{ ...s.articleHeadline, ...(i===0?s.articleHeadlineLarge:{}) }}>{p.title}</h3>
                <div style={s.articleRule} />
                <p style={s.articleBody}>{p.description}</p>
                {p.techstack?.length > 0 && (
                  <div style={s.articleTech}>{p.techstack.map((t,j) => <span key={j} style={s.techBadge}>{t}</span>)}</div>
                )}
                <div style={s.articleLinks}>
                  {p.github_link && <a href={p.github_link} target="_blank" style={s.articleLink}
                    data-track={JSON.stringify({ event_type:"project_link_click", metadata:{ project_id:p.id, link_type:"github" } })}>GITHUB ↗</a>}
                  {p.live_link && <a href={p.live_link} target="_blank" style={{ ...s.articleLink, ...s.articleLinkPrimary }}
                    data-track={JSON.stringify({ event_type:"project_link_click", metadata:{ project_id:p.id, link_type:"live_demo" } })}>LIVE DEMO ↗</a>}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      <div style={s.sectionRule} />

      {/* EXPERIENCE */}
      {experiences.length > 0 && (
        <section id="experience" style={s.section}>
          <div style={s.colHeader}><div style={s.colHeaderRule} /><span style={s.colHeaderText}>CAREER RECORD</span><div style={s.colHeaderRule} /></div>
          <div style={s.expColumns}>
            {experiences.map((exp) => (
              <div key={exp.id} style={s.expEntry}
                data-track={JSON.stringify({ event_type:"experience_view", metadata:{ experience_id:exp.id, company:exp.company } })}>
                <div style={s.expDate}>{formatDate(exp.start_date)} — {exp.is_current==="true"?"PRESENT":formatDate(exp.end_date)}</div>
                <div style={s.expRole}>{exp.role}</div>
                <div style={s.expCompany}>{exp.company}</div>
                {exp.description && <p style={s.expDesc}>{exp.description}</p>}
                {exp.points?.length > 0 && <ul style={s.expList}>{exp.points.map((pt,j) => <li key={j} style={s.expListItem}>{pt}</li>)}</ul>}
              </div>
            ))}
          </div>
        </section>
      )}

      <div style={s.sectionRule} />

      {/* BLOG */}
      {blogs.length > 0 && (
        <section id="blog" style={s.section}>
          <div style={s.colHeader}><div style={s.colHeaderRule} /><span style={s.colHeaderText}>FROM THE DESK</span><div style={s.colHeaderRule} /></div>
          <div style={s.blogColumns}>
            {blogs.map((blog, i) => (
              <div key={blog.id} style={{ ...s.blogEntry, ...(i===0?s.blogEntryLead:{}) }}
                data-track={JSON.stringify({ event_type:"blog_view", metadata:{ blog_id:blog.id, blog_title:blog.title } })}>
                <div style={s.blogCat}>{blog.category||"GENERAL"}</div>
                <h3 style={{ ...s.blogTitle, ...(i===0?s.blogTitleLarge:{}) }}>{blog.title}</h3>
                <p style={s.blogExcerpt}>{truncate(blog.excerpt,i===0?200:100)}</p>
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
            <div style={s.colHeader}><div style={s.colHeaderRule} /><span style={s.colHeaderText}>LETTERS TO THE EDITOR</span><div style={s.colHeaderRule} /></div>
            <div style={s.testimonialsRow}>
              {testimonials.map(t => (
                <div key={t.id} style={s.testimonialEntry}
                  data-track={JSON.stringify({ event_type:"testimonial_view", metadata:{ testimonial_id:t.id, name:t.name } })}>
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
        <div style={s.colHeader}><div style={s.colHeaderRule} /><span style={s.colHeaderText}>CONTACT THE AUTHOR</span><div style={s.colHeaderRule} /></div>
        <div style={s.contactLayout}>
          <div style={s.contactLeft}>
            <h2 style={s.contactHeadline}>Start the<br /><em>Conversation</em></h2>
            <p style={s.contactBody}>Have a story to tell, a problem to solve, or a product to build? Available for select collaborations.</p>
            {profile.email && <div style={s.contactDetail}><strong>Electronic Mail:</strong> <a href={`mailto:${profile.email}`} style={s.contactLink}
              data-track={JSON.stringify({ event_type:"contact_info_click", metadata:{ type:"email" } })}>{profile.email}</a></div>}
            {profile.location && <div style={s.contactDetail}><strong>Location:</strong> {profile.location}</div>}
          </div>
          <form onSubmit={handleContact} style={s.contactForm}>
            <div style={s.formRow}>
              <input required placeholder="FULL NAME" value={contactForm.name} onChange={e => setContactForm({...contactForm,name:e.target.value})} style={s.input}
                data-track={JSON.stringify({ event_type:"form_interaction", metadata:{ field:"name" } })} />
              <input required type="email" placeholder="EMAIL ADDRESS" value={contactForm.email} onChange={e => setContactForm({...contactForm,email:e.target.value})} style={s.input}
                data-track={JSON.stringify({ event_type:"form_interaction", metadata:{ field:"email" } })} />
            </div>
            <input placeholder="SUBJECT MATTER" value={contactForm.subject} onChange={e => setContactForm({...contactForm,subject:e.target.value})} style={{ ...s.input, ...s.inputFull }}
              data-track={JSON.stringify({ event_type:"form_interaction", metadata:{ field:"subject" } })} />
            <textarea required placeholder="YOUR MESSAGE" value={contactForm.message} onChange={e => setContactForm({...contactForm,message:e.target.value})} style={s.textarea}
              data-track={JSON.stringify({ event_type:"form_interaction", metadata:{ field:"message" } })} />
            <button disabled={sending} style={s.submitBtn} className="t3-submit"
              data-track={JSON.stringify({ event_type:"form_submit_click", metadata:{ form:"contact" } })}>{sending?"TRANSMITTING...":"SUBMIT LETTER →"}</button>
          </form>
        </div>
      </section>

      <footer style={s.footer}>
        <div style={s.footerTop}>
          <span style={s.footerName}>{profile?.name||"PORTFOLIO"}</span>
          <span style={s.footerSep}>|</span>
          <span style={s.footerYear}>EST. {new Date().getFullYear()}</span>
          {socialLinks.length > 0 && (
            <div style={s.footerLinks}>
              {socialLinks.map(link => (
                <a key={link.id} href={link.url} target="_blank" rel="noopener noreferrer" style={s.footerLink}
                  data-track={JSON.stringify({ event_type:"social_click", metadata:{ platform:link.platform, location:"footer" } })}>{link.platform.toUpperCase()}</a>
              ))}
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
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
@keyframes ticker{from{transform:translateX(0)}to{transform:translateX(-50%)}}
.ticker-content{display:inline-block;animation:ticker 30s linear infinite;white-space:nowrap;font-family:'Source Serif 4',serif;font-size:13px;letter-spacing:0.08em;color:#fff}
@keyframes fillProgress{from{width:0 !important}}
.t3-skill-progress{animation:fillProgress 1.4s cubic-bezier(0.4,0,0.2,1) both}
.t3-cta{transition:background 0.2s,color 0.2s}
.t3-cta:hover{background:#1a1a1a !important;color:#fff !important}
.t3-submit{transition:background 0.2s,color 0.2s}
.t3-submit:hover{background:#1a1a1a !important;color:#fff !important}
.t3-nav-link{position:relative;transition:color 0.2s}
.t3-nav-link:hover{color:#c41e3a !important}
.t3-hamburger{display:none;background:none;border:none;cursor:pointer;padding:4px;flex-direction:column;gap:5px;align-items:center}
.t3-bar{display:block;width:22px;height:2px;background:#1a1a1a;transition:all 0.3s}
.t3-bar-open-1{transform:rotate(45deg) translate(5px,5px)}
.t3-bar-open-2{opacity:0}
.t3-bar-open-3{transform:rotate(-45deg) translate(5px,-5px)}
@media(max-width:1024px){
  .t3-hamburger{display:flex !important}
  .t3-nav-links-wrap{display:none}
  .t3-nav-open{display:flex !important;flex-direction:column;position:absolute;top:100%;left:0;right:0;background:#faf9f6;padding:20px 40px;gap:16px;border-bottom:2px solid #1a1a1a;z-index:300}
}
@media(max-width:768px){
  .t3-hero-spread{grid-template-columns:1fr !important}
  .t3-hero-mid,.t3-hero-right{display:none}
  .t3-projects-layout{grid-template-columns:1fr !important}
  .t3-blog-columns{grid-template-columns:1fr !important}
  .t3-contact-layout{grid-template-columns:1fr !important}
  .t3-form-row{grid-template-columns:1fr !important}
  .t3-skills-grid{grid-template-columns:repeat(2,1fr) !important}
}
`;

const s = {
  root:{ fontFamily:"'Source Serif 4', serif", background:"#faf9f6", color:"#1a1a1a", minHeight:"100vh" },
  ticker:{ background:"#1a1a1a", color:"#fff", display:"flex", alignItems:"center", overflow:"hidden", height:36 },
  tickerLabel:{ background:"#c41e3a", padding:"0 16px", fontFamily:"'Bebas Neue', sans-serif", fontSize:15, letterSpacing:"0.1em", height:"100%", display:"flex", alignItems:"center", flexShrink:0, zIndex:1 },
  tickerTrack:{ overflow:"hidden", flex:1 },
  masthead:{ padding:"clamp(16px,2vw,24px) clamp(20px,5vw,60px) 0", borderBottom:"3px solid #1a1a1a" },
  mastheadTop:{ display:"flex", justifyContent:"space-between", alignItems:"flex-end", paddingBottom:12, flexWrap:"wrap", gap:8 },
  mastheadDate:{ fontFamily:"'Source Serif 4', serif", fontSize:12, color:"#666", fontStyle:"italic" },
  mastheadName:{ fontFamily:"'Playfair Display', serif", fontSize:"clamp(32px,5vw,80px)", fontWeight:900, letterSpacing:"-2px", lineHeight:1, textAlign:"center" },
  mastheadEdition:{ fontFamily:"'Source Serif 4', serif", fontSize:12, color:"#666", fontStyle:"italic" },
  mastheadRule:{ height:1, background:"#1a1a1a", margin:"8px 0" },
  mastheadSub:{ display:"flex", justifyContent:"center", alignItems:"center", gap:16, padding:"8px 0", fontFamily:"'Source Serif 4', serif", fontSize:13, color:"#444", flexWrap:"wrap" },
  mastheadDivider:{ color:"#c41e3a", fontSize:10 },
  mastheadCTA:{ fontFamily:"'Bebas Neue', sans-serif", fontSize:14, letterSpacing:"0.1em", color:"#c41e3a", textDecoration:"none", border:"1px solid #c41e3a", padding:"2px 10px" },
  nav:{ borderBottom:"1px solid #d0ccc5", padding:"12px clamp(20px,5vw,60px)", display:"flex", justifyContent:"space-between", alignItems:"center", position:"relative" },
  navLinks:{ display:"flex", gap:"clamp(16px,2.5vw,32px)" },
  navLink:{ fontFamily:"'Bebas Neue', sans-serif", fontSize:14, letterSpacing:"0.1em", color:"#1a1a1a", textDecoration:"none" },
  hamburger:{ display:"none", background:"none", border:"none", cursor:"pointer", padding:4, flexDirection:"column", gap:5, alignItems:"center" },
  heroSpread:{ display:"grid", gridTemplateColumns:"2fr 1fr 1fr", gap:0, padding:"clamp(24px,4vw,40px) clamp(20px,5vw,60px)", borderBottom:"2px solid #1a1a1a" },
  heroLeft:{ paddingRight:"clamp(20px,3vw,40px)", borderRight:"1px solid #d0ccc5" },
  heroKicker:{ fontFamily:"'Bebas Neue', sans-serif", fontSize:11, letterSpacing:"0.15em", color:"#c41e3a", marginBottom:12 },
  heroHeadline:{ fontFamily:"'Playfair Display', serif", fontSize:"clamp(28px,3.5vw,64px)", fontWeight:900, lineHeight:1.05, marginBottom:16 },
  heroHeadlineItalic:{ fontStyle:"italic", fontWeight:400 },
  heroRule:{ height:3, background:"#1a1a1a", width:60, margin:"16px 0" },
  heroDek:{ fontFamily:"'Source Serif 4', serif", fontSize:"clamp(14px,1.5vw,16px)", lineHeight:1.7, color:"#444", marginBottom:16 },
  heroByline:{ fontFamily:"'Source Serif 4', serif", fontSize:13, color:"#888", fontStyle:"italic", marginBottom:20 },
  heroCTAs:{ display:"flex", gap:12, flexWrap:"wrap" },
  heroCTA1:{ background:"#c41e3a", color:"#fff", padding:"10px 20px", textDecoration:"none", fontFamily:"'Bebas Neue', sans-serif", fontSize:14, letterSpacing:"0.1em" },
  heroCTA2:{ border:"1px solid #1a1a1a", color:"#1a1a1a", padding:"10px 20px", textDecoration:"none", fontFamily:"'Bebas Neue', sans-serif", fontSize:14, letterSpacing:"0.1em" },
  heroMid:{ padding:"0 clamp(16px,2.5vw,32px)", display:"flex", flexDirection:"column", justifyContent:"center", alignItems:"center", gap:24, borderRight:"1px solid #d0ccc5" },
  heroStat:{ display:"flex", flexDirection:"column", alignItems:"center", gap:4 },
  heroStatNum:{ fontFamily:"'Playfair Display', serif", fontSize:"clamp(36px,4vw,52px)", fontWeight:900, lineHeight:1, color:"#c41e3a" },
  heroStatLabel:{ fontFamily:"'Source Serif 4', serif", fontSize:12, color:"#888", textAlign:"center", fontStyle:"italic" },
  heroVertRule:{ height:1, width:"100%", background:"#d0ccc5" },
  heroRight:{ padding:"0 0 0 clamp(16px,2.5vw,32px)" },
  pullQuote:{ borderLeft:"4px solid #c41e3a", paddingLeft:20, marginBottom:32 },
  pullQuoteMarks:{ fontFamily:"'Playfair Display', serif", fontSize:72, color:"#c41e3a", lineHeight:0.8, marginBottom:8 },
  pullQuoteText:{ fontFamily:"'Playfair Display', serif", fontSize:"clamp(14px,1.5vw,18px)", fontStyle:"italic", lineHeight:1.5, color:"#2a2a2a", marginBottom:12 },
  pullQuoteAttrib:{ fontFamily:"'Source Serif 4', serif", fontSize:13, color:"#888" },
  heroSocials:{ display:"flex", flexDirection:"column", gap:8 },
  heroSocialLink:{ fontFamily:"'Bebas Neue', sans-serif", fontSize:13, letterSpacing:"0.1em", color:"#1a1a1a", textDecoration:"none", borderBottom:"1px solid #d0ccc5", paddingBottom:6 },
  sectionRule:{ height:3, background:"#1a1a1a", margin:"0 clamp(20px,5vw,60px)" },
  section:{ padding:"clamp(32px,5vw,48px) clamp(20px,5vw,60px)" },
  colHeader:{ display:"flex", alignItems:"center", gap:16, marginBottom:32 },
  colHeaderRule:{ flex:1, height:1, background:"#d0ccc5" },
  colHeaderText:{ fontFamily:"'Bebas Neue', sans-serif", fontSize:"clamp(14px,1.8vw,18px)", letterSpacing:"0.12em", color:"#1a1a1a", whiteSpace:"nowrap" },
  skillsGrid:{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:0 },
  skillCell:{ padding:"clamp(12px,1.5vw,16px) clamp(12px,2vw,20px)", borderBottom:"1px solid #d0ccc5", borderRight:"1px solid #d0ccc5" },
  skillCellTop:{ display:"flex", alignItems:"center", gap:8, marginBottom:8 },
  skillEmoji:{ fontSize:18 },
  skillCellName:{ fontFamily:"'Source Serif 4', serif", fontWeight:600, flex:1, fontSize:"clamp(13px,1.4vw,15px)" },
  skillCellPct:{ fontFamily:"'Playfair Display', serif", fontWeight:700, fontSize:"clamp(14px,1.8vw,18px)", color:"#c41e3a" },
  skillProgress:{ height:3, background:"#e8e4dc", overflow:"hidden" },
  skillProgressFill:{ height:"100%", background:"#c41e3a" },
  projectsLayout:{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:0 },
  projectArticle:{ padding:"0 clamp(16px,2vw,24px) 24px 0", borderRight:"1px solid #d0ccc5" },
  projectArticleLead:{ gridColumn:"1 / 2", paddingRight:"clamp(20px,3vw,32px)" },
  articleKicker:{ fontFamily:"'Bebas Neue', sans-serif", fontSize:11, letterSpacing:"0.15em", color:"#c41e3a", marginBottom:6 },
  articleNumber:{ fontFamily:"'Playfair Display', serif", fontSize:"clamp(32px,4vw,48px)", fontWeight:900, color:"#e8e4dc", lineHeight:1, marginBottom:8 },
  articleHeadline:{ fontFamily:"'Playfair Display', serif", fontSize:"clamp(16px,2vw,20px)", fontWeight:700, lineHeight:1.2, marginBottom:10 },
  articleHeadlineLarge:{ fontSize:"clamp(22px,3vw,32px)" },
  articleRule:{ height:1, background:"#d0ccc5", margin:"10px 0" },
  articleBody:{ fontSize:14, lineHeight:1.7, color:"#444", marginBottom:14 },
  articleTech:{ display:"flex", flexWrap:"wrap", gap:6, marginBottom:14 },
  techBadge:{ fontSize:11, fontFamily:"'Bebas Neue', sans-serif", letterSpacing:"0.08em", border:"1px solid #d0ccc5", padding:"2px 8px" },
  articleLinks:{ display:"flex", gap:12 },
  articleLink:{ fontFamily:"'Bebas Neue', sans-serif", fontSize:12, letterSpacing:"0.1em", color:"#888", textDecoration:"none" },
  articleLinkPrimary:{ color:"#c41e3a" },
  expColumns:{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(min(320px,100%),1fr))", gap:32 },
  expEntry:{ borderLeft:"3px solid #c41e3a", paddingLeft:20 },
  expDate:{ fontFamily:"'Bebas Neue', sans-serif", fontSize:12, letterSpacing:"0.1em", color:"#888", marginBottom:4 },
  expRole:{ fontFamily:"'Playfair Display', serif", fontSize:"clamp(16px,2vw,20px)", fontWeight:700, marginBottom:4 },
  expCompany:{ fontFamily:"'Source Serif 4', serif", fontSize:15, fontStyle:"italic", color:"#c41e3a", marginBottom:10 },
  expDesc:{ fontSize:14, lineHeight:1.7, color:"#555", marginBottom:10 },
  expList:{ paddingLeft:16 },
  expListItem:{ fontSize:14, color:"#555", marginBottom:6, lineHeight:1.5 },
  blogColumns:{ display:"grid", gridTemplateColumns:"2fr 1fr 1fr", gap:32 },
  blogEntry:{ borderTop:"2px solid #1a1a1a", paddingTop:16 },
  blogEntryLead:{},
  blogCat:{ fontFamily:"'Bebas Neue', sans-serif", fontSize:11, letterSpacing:"0.15em", color:"#c41e3a", marginBottom:8 },
  blogTitle:{ fontFamily:"'Playfair Display', serif", fontSize:"clamp(16px,1.8vw,18px)", fontWeight:700, lineHeight:1.2, marginBottom:10 },
  blogTitleLarge:{ fontSize:"clamp(20px,2.5vw,28px)" },
  blogExcerpt:{ fontSize:14, lineHeight:1.7, color:"#555", marginBottom:10 },
  blogDate:{ fontSize:12, color:"#999", fontStyle:"italic" },
  testimonialsRow:{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(min(300px,100%),1fr))", gap:32 },
  testimonialEntry:{ borderTop:"1px solid #d0ccc5", paddingTop:16 },
  testimonialText:{ fontFamily:"'Playfair Display', serif", fontSize:"clamp(14px,1.6vw,16px)", fontStyle:"italic", lineHeight:1.7, marginBottom:12, color:"#2a2a2a" },
  testimonialSig:{ fontSize:13, color:"#888" },
  contactLayout:{ display:"grid", gridTemplateColumns:"1fr 1.6fr", gap:"clamp(32px,6vw,60px)" },
  contactLeft:{},
  contactHeadline:{ fontFamily:"'Playfair Display', serif", fontSize:"clamp(32px,4vw,48px)", fontWeight:900, lineHeight:1.05, marginBottom:20 },
  contactBody:{ fontSize:"clamp(14px,1.5vw,16px)", lineHeight:1.7, color:"#555", marginBottom:24 },
  contactDetail:{ fontSize:14, marginBottom:12, color:"#444" },
  contactLink:{ color:"#c41e3a", textDecoration:"none" },
  contactForm:{ display:"flex", flexDirection:"column", gap:16 },
  formRow:{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:16 },
  input:{ border:"1px solid #d0ccc5", borderBottom:"2px solid #1a1a1a", padding:"12px 16px", fontSize:13, fontFamily:"'Bebas Neue', sans-serif", letterSpacing:"0.08em", background:"transparent", outline:"none", width:"100%" },
  inputFull:{},
  textarea:{ border:"1px solid #d0ccc5", borderBottom:"2px solid #1a1a1a", padding:"12px 16px", fontSize:14, fontFamily:"'Source Serif 4', serif", background:"transparent", outline:"none", minHeight:120, resize:"vertical", width:"100%" },
  submitBtn:{ background:"#c41e3a", color:"#fff", border:"none", padding:"clamp(12px,1.5vw,16px) clamp(20px,3vw,32px)", fontFamily:"'Bebas Neue', sans-serif", fontSize:"clamp(14px,1.6vw,18px)", letterSpacing:"0.12em", cursor:"pointer", alignSelf:"flex-start" },
  footer:{ background:"#1a1a1a", color:"#fff", padding:"clamp(16px,2vw,24px) clamp(20px,5vw,60px)" },
  footerTop:{ display:"flex", alignItems:"center", gap:20, marginBottom:8, flexWrap:"wrap" },
  footerName:{ fontFamily:"'Playfair Display', serif", fontSize:20, fontWeight:900 },
  footerSep:{ color:"#555" },
  footerYear:{ fontFamily:"'Source Serif 4', serif", fontSize:14, color:"#888", fontStyle:"italic" },
  footerLinks:{ display:"flex", gap:16, marginLeft:"auto", flexWrap:"wrap" },
  footerLink:{ fontFamily:"'Bebas Neue', sans-serif", fontSize:13, letterSpacing:"0.1em", color:"#888", textDecoration:"none" },
  footerBottom:{ fontFamily:"'Source Serif 4', serif", fontSize:12, color:"#555", fontStyle:"italic" },
};