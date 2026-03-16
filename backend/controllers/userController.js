const db = require("../helpers/db");
const { success, error } = require("../helpers/response");


/* =============================
   PROFILE
============================= */

exports.getProfile = async (req, res) => {
  try {

    const result = await db.query(`
      SELECT *
      FROM users
      LIMIT 1
    `);

    success(res, result.rows[0]);

  } catch (err) {
    error(res, err.message);
  }
};


/* =============================
   SKILLS
============================= */

exports.getSkills = async (req, res) => {
  try {

    const result = await db.query(`
      SELECT *
      FROM skills
      ORDER BY order_index ASC
    `);

    success(res, result.rows);

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
    ) AS techstack
FROM projects p
LEFT JOIN project_technologies pt
    ON p.id = pt.project_id::bigint
WHERE p.featured = 'true'
GROUP BY p.id
ORDER BY p.created_at DESC;
    `);

    success(res, result.rows);

  } catch (err) {
    error(res, err.message);
  }
};


/* =============================
   BLOGS
============================= */

exports.getBlogs = async (req, res) => {
  try {

    const result = await db.query(`
      SELECT *
      FROM blogs
      ORDER BY publish_date DESC
    `);

    success(res, result.rows);

  } catch (err) {
    error(res, err.message);
  }
};


/* =============================
   TESTIMONIALS
============================= */

exports.getTestimonials = async (req, res) => {
  try {

    const result = await db.query(`
      SELECT *
      FROM testimonials
      ORDER BY id DESC
    `);

    success(res, result.rows);

  } catch (err) {
    error(res, err.message);
  }
};


/* =============================
   SOCIAL LINKS
============================= */

exports.getSocialLinks = async (req, res) => {
  try {

    const result = await db.query(`
      SELECT *
      FROM social_links
      ORDER BY order_index ASC
    `);

    success(res, result.rows);

  } catch (err) {
    error(res, err.message);
  }
};


/* =============================
   CONTACT MESSAGE
============================= */

exports.contactMessage = async (req, res) => {
  try {

    const { name, email, subject, message } = req.body;

    if (!name || !email || !message) {
      return error(res, "Name, email and message are required", 400);
    }

    await db.query(
      `INSERT INTO messages (name,email,subject,message)
       VALUES ($1,$2,$3,$4)`,
      [name, email, subject, message]
    );

    success(res, null, "Message sent successfully");

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