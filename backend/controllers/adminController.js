const db = require("../helpers/db");
const bcrypt = require("bcryptjs");
const { success, error } = require("../helpers/response");
const { generateToken } = require("../helpers/auth");
const { sendMail } = require("../helpers/mailer");


/* =============================
   ADMIN LOGIN
============================= */

exports.adminLogin = async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log(req.body)
    const adminsResult = await db.query(
      "SELECT * FROM admin WHERE email = $1",
      [email]
    );
    const admins = adminsResult.rows;
    console.log(admins)
    if (!admins.length) return error(res, "Admin not found", 404);

    const admin = admins[0];

    const valid = await bcrypt.compare(password, admin.password_hash);
    if (!valid) return error(res, "Invalid credentials", 401);

    const token = generateToken(admin);

    success(res, { token });
  } catch (err) {
    console.log(err)
    error(res, err.message);
  }
};
exports.createAdmin = async (req, res) => {
  try {
    const { email, password, name } = req.body;

    if (!email || !password) return error(res, "Email and password are required", 400);
    if (typeof password !== "string" || password.length < 6)
      return error(res, "Password must be at least 6 characters", 400);

    const existing = await db.query("SELECT id FROM admin WHERE email=$1", [email]);
    if (existing.rows.length) return error(res, "Admin already exists", 409);

    const salt = await bcrypt.genSalt(10);
    const password_hash = await bcrypt.hash(password, salt);

    const columns = ["email", "password_hash"];
    const params = [email, password_hash];
    if (name) {
      columns.push("name");
      params.push(name);
    }

    const colStr = columns.join(", ");
    const placeholders = params.map((_, i) => `$${i + 1}`).join(", ");
    const returningCols = ["id", "email"].concat(name ? ["name"] : []).join(", ");

    const result = await db.query(
      `INSERT INTO admin (${colStr}) VALUES (${placeholders}) RETURNING ${returningCols}`,
      params
    );

    const admin = result.rows[0];
    // const token = generateToken(admin);

    success(res, { id: admin.id, token }, "Admin created");
  } catch (err) {
    console.log(err)

    error(res, err.message);
  }
};

/* =============================
   PROFILE
============================= */

exports.getProfile = async (req, res) => {
  try {

    const result = await db.query(
      "SELECT * FROM users LIMIT 1"
    );

    const profile = result.rows[0];

    success(res, profile);

  } catch (err) {
    error(res, err.message);
  }
};


exports.updateProfile = async (req, res) => {
  try {

    const {
      name,
      title,
      bio,
      location,
      email,
      linkedin,
      github,
      status,
      projects_count,
      tech_stack_count,
      template_id
    } = req.body;

    await db.query(
      `UPDATE users
       SET name=$1,
           title=$2,
           bio=$3,
           location=$4,
           email=$5,
           linkedin=$6,
           github=$7,
           status=$8,
           projects_count=$9,
           tech_stack_count=$10,
           template_id=$11
       WHERE id=1`,
      [
        name,
        title,
        bio,
        location,
        email,
        linkedin,
        github,
        status,
        projects_count,
        tech_stack_count,
        template_id
      ]
    );

    success(res, null, "Profile updated");

  } catch (err) {
    error(res, err.message);
  }
};

/* =============================
   PROJECTS
============================= */

exports.getProjects = async (req, res) => {
  try {

    const result = await db.query(`
      SELECT 
  p.*,
  COALESCE(
    json_agg(pt.technology) 
    FILTER (WHERE pt.technology IS NOT NULL),
    '[]'
  ) as techstack
FROM projects p
LEFT JOIN project_technologies pt
ON p.id = pt.project_id::bigint
GROUP BY p.id
ORDER BY p.created_at DESC;
    `);

    success(res, result.rows);

  } catch (err) {
    error(res, err.message);
  }
};

exports.addProject = async (req, res) => {
  try {

    const {
      title,
      description,
      github_link,
      live_link,
      thumbnail,
      featured,
      techstack
    } = req.body;

    const result = await db.query(
      `INSERT INTO projects 
      (title, description, github_link, live_link, thumbnail, featured)
      VALUES ($1,$2,$3,$4,$5,$6)
      RETURNING id`,
      [title, description, github_link, live_link, thumbnail, featured]
    );

    const projectId = result.rows[0].id;

    for (const tech of techstack) {
      await db.query(
        `INSERT INTO project_technologies (project_id, technology)
         VALUES ($1,$2)`,
        [projectId, tech]
      );
    }

    success(res, { id: projectId }, "Project created");

  } catch (err) {
    error(res, err.message);
  }
};
exports.updateProject = async (req, res) => {
  try {

    const { id } = req.params;

    const {
      title,
      description,
      github_link,
      live_link,
      thumbnail,
      featured,
      techstack
    } = req.body;

    await db.query(
      `UPDATE projects
       SET title=$1,
           description=$2,
           github_link=$3,
           live_link=$4,
           thumbnail=$5,
           featured=$6
       WHERE id=$7`,
      [title, description, github_link, live_link, thumbnail, featured, id]
    );

    await db.query(
      `DELETE FROM project_technologies WHERE project_id=$1`,
      [id]
    );

    for (const tech of techstack) {
      await db.query(
        `INSERT INTO project_technologies (project_id, technology)
         VALUES ($1,$2)`,
        [id, tech]
      );
    }

    success(res, null, "Project updated");

  } catch (err) {
    error(res, err.message);
  }
};

exports.deleteProject = async (req, res) => {
  try {
    const { id } = req.params;

    await db.query("DELETE FROM projects WHERE id=$1", [id]);

    success(res, null, "Project deleted");
  } catch (err) {
    error(res, err.message);
  }
};


/* =============================
   SKILLS
============================= */

exports.getSkills = async (req, res) => {
  try {
    const result = await db.query("SELECT * FROM Skills ORDER BY order_index");
    const rows = result.rows;
    success(res, rows);
  } catch (err) {
    error(res, err.message);
  }
};

exports.addSkill = async (req, res) => {
  try {
    const { name, description, percentage, icon, order_index } = req.body;

    const result = await db.query(
      `INSERT INTO Skills (name, description, percentage, icon, order_index) 
       VALUES ($1,$2,$3,$4,$5) RETURNING id`,
      [name, description, percentage, icon, order_index]
    );

    success(res, { id: result.rows[0].id }, "Skill added");
  } catch (err) {
    error(res, err.message);
  }
};
exports.updateSkill = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, percentage, icon, order_index } = req.body;

    await db.query(
      `UPDATE Skills
       SET name=$1,
           description=$2,
           percentage=$3,
           icon=$4,
           order_index=$5
       WHERE id=$6`,
      [name, description, percentage, icon, order_index, id]
    );

    success(res, null, "Skill updated");
  } catch (err) {
    error(res, err.message);
  }
};

exports.deleteSkill = async (req, res) => {
  try {
    const { id } = req.params;

    await db.query("DELETE FROM Skills WHERE id=$1", [id]);

    success(res, null, "Skill deleted");
  } catch (err) {
    error(res, err.message);
  }
};


/* =============================
   BLOGS
============================= */

exports.getBlogs = async (req, res) => {
  try {
    const result = await db.query("SELECT * FROM blogs ORDER BY publish_date DESC");
    const rows = result.rows;
    success(res, rows);
  } catch (err) {
    error(res, err.message);
  }
};

exports.addBlog = async (req, res) => {
  try {
    const { title, slug, excerpt, content, category, read_time, publish_date } = req.body;

    const result = await db.query(
      `INSERT INTO blogs 
      (title, slug, excerpt, content, category, read_time, publish_date) 
      VALUES ($1,$2,$3,$4,$5,$6,$7) 
      RETURNING id`,
      [title, slug, excerpt, content, category, read_time, publish_date]
    );

    success(res, { id: result.rows[0].id }, "Blog created");
  } catch (err) {
    error(res, err.message);
  }
};

exports.updateBlog = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, excerpt, content, category, read_time, publish_date } = req.body;

    await db.query(
      `UPDATE blogs 
       SET title=$1,
           excerpt=$2,
           content=$3,
           category=$4,
           read_time=$5,
           publish_date=$6
       WHERE id=$7`,
      [title, excerpt, content, category, read_time, publish_date, id]
    );

    success(res, null, "Blog updated");
  } catch (err) {
    error(res, err.message);
  }
};

exports.deleteBlog = async (req, res) => {
  try {
    const { id } = req.params;

    await db.query("DELETE FROM blogs WHERE id=$1", [id]);

    success(res, null, "Blog deleted");
  } catch (err) {
    error(res, err.message);
  }
};


/* =============================
   TESTIMONIALS
============================= */

exports.getTestimonials = async (req, res) => {
  try {
    const result = await db.query("SELECT * FROM testimonials");
    const rows = result.rows;
    success(res, rows);
  } catch (err) {
    error(res, err.message);
  }
};
function getInitials(name) {
  if (!name) return "";
  return name
    .split(" ")
    .map(n => n[0])
    .join("")
    .toUpperCase()
    .substring(0, 2);
}


exports.addTestimonial = async (req, res) => {
  try {
    const { name, role, company, review, rating } = req.body;

    const avatar_initials = getInitials(name);

    const result = await db.query(
      `INSERT INTO testimonials 
      (name, role, company, review, rating, avatar_initials) 
      VALUES ($1,$2,$3,$4,$5,$6) 
      RETURNING id`,
      [name, role, company, review, rating, avatar_initials]
    );

    success(res, { id: result.rows[0].id }, "Testimonial added");
  } catch (err) {
    error(res, err.message);
  }
};

exports.deleteTestimonial = async (req, res) => {
  try {
    const { id } = req.params;

    await db.query("DELETE FROM testimonials WHERE id=$1", [id]);

    success(res, null, "Testimonial deleted");
  } catch (err) {
    error(res, err.message);
  }
};


/* =============================
   CONTACT MESSAGES
============================= */

exports.getMessages = async (req, res) => {
  try {
    const result = await db.query(
      "SELECT * FROM messages ORDER BY created_at DESC"
    );
    const rows = result.rows;

    success(res, rows);
  } catch (err) {
    error(res, err.message);
  }
};

exports.deleteMessage = async (req, res) => {
  try {
    const { id } = req.params;

    await db.query("DELETE FROM messages WHERE id=$1", [id]);

    success(res, null, "Message deleted");
  } catch (err) {
    error(res, err.message);
  }
};

exports.sendReply = async (req, res) => {
  try {
    const { id, email, subject,  message } = req.body;

    // 1. Get message details
    const result = await db.query(
      "SELECT * FROM messages WHERE id=$1",
      [id]
    );

    if (!result.rows.length) {
      return error(res, "Message not found", 404);
    }


    // 2. Send email
    await sendMail({
      to: email,
      subject: subject,
      html: message, // HTML from tiptap
    });

    // 3. Mark as replied
    await db.query(
      "UPDATE messages SET replied='true', reply = $1 WHERE id=$2",
      [message, id]
    );

    success(res, null, "Reply sent successfully");
  } catch (err) {
    console.log(err);
    error(res, err.message);
  }
};

/* =============================
   Social Links
============================= */


exports.getSocialLinks = async (req, res) => {
  try {

    const result = await db.query(
      "SELECT * FROM social_links ORDER BY order_index ASC"
    );

    success(res, result.rows);

  } catch (err) {
    error(res, err.message);
  }
};
exports.addSocialLink = async (req, res) => {
  try {

    const { platform, url, order_index } = req.body;

    const result = await db.query(
      `INSERT INTO social_links 
      (platform, url, order_index)
      VALUES ($1,$2,$3)
      RETURNING id`,
      [platform, url, order_index]
    );

    success(res, { id: result.rows[0].id }, "Social link added");

  } catch (err) {
    error(res, err.message);
  }
};
exports.updateSocialLink = async (req, res) => {
  try {

    const { id } = req.params;
    const { platform, url, order_index } = req.body;

    await db.query(
      `UPDATE social_links
       SET platform=$1, url=$2, order_index=$3
       WHERE id=$4`,
      [platform, url, order_index, id]
    );

    success(res, null, "Social link updated");

  } catch (err) {
    error(res, err.message);
  }
};
exports.deleteSocialLink = async (req, res) => {
  try {

    const { id } = req.params;

    await db.query(
      "DELETE FROM social_links WHERE id=$1",
      [id]
    );

    success(res, null, "Social link deleted");

  } catch (err) {
    error(res, err.message);
  }
};


/* =============================
   EXPERIENCES
============================= */

exports.getExperiences = async (req, res) => {
  try {

    const result = await db.query(`
      SELECT 
  e.*,
  COALESCE(ep.points, '[]') AS points
FROM experiences e
LEFT JOIN (
  SELECT 
    experience_id,
    json_agg(point) FILTER (WHERE point IS NOT NULL) AS points
  FROM experience_points
  GROUP BY experience_id
) ep 
ON e.id = ep.experience_id::bigint
ORDER BY e.created_at DESC;
    `);

    success(res, result.rows);

  } catch (err) {
    error(res, err.message);
  }
};

exports.addExperience = async (req, res) => {

  try {

    const {
      role,
      company,
      description,
      start_date,
      end_date,
      is_current,
      points
    } = req.body;

    const result = await db.query(
      `INSERT INTO experiences
      (role, company, description, start_date, end_date, is_current)
      VALUES ($1,$2,$3,$4,$5,$6)
      RETURNING id`,
      [role, company, description, start_date, end_date, is_current]
    );

    const experienceId = result.rows[0].id;

    for (const p of points) {

      await db.query(
        `INSERT INTO experience_points
         (experience_id, point)
         VALUES ($1,$2)`,
        [experienceId, p]
      );

    }

    success(res, { id: experienceId }, "Experience added");

  } catch (err) {
    error(res, err.message);
  }

};

exports.updateExperience = async (req, res) => {

  try {

    const { id } = req.params;

    const {
      role,
      company,
      description,
      start_date,
      end_date,
      is_current,
      points
    } = req.body;

    await db.query(
      `UPDATE experiences
       SET role=$1,
           company=$2,
           description=$3,
           start_date=$4,
           end_date=$5,
           is_current=$6
       WHERE id=$7`,
      [role, company, description, start_date, end_date, is_current, id]
    );

    await db.query(
      `DELETE FROM experience_points
       WHERE experience_id=$1`,
      [id]
    );

    for (const p of points) {

      await db.query(
        `INSERT INTO experience_points
         (experience_id, point)
         VALUES ($1,$2)`,
        [id, p]
      );

    }

    success(res, null, "Experience updated");

  } catch (err) {
    error(res, err.message);
  }

};

exports.deleteExperience = async (req, res) => {

  try {

    const { id } = req.params;

    await db.query(
      `DELETE FROM experiences WHERE id=$1`,
      [id]
    );

    success(res, null, "Experience deleted");

  } catch (err) {
    error(res, err.message);
  }

};