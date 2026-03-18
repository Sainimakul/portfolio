const router = require("express").Router();
const controller = require("../controllers/adminController");
const adminAuth = require("../middlewares/adminAuth");


/* =============================
   AUTH
============================= */

router.post("/login", controller.adminLogin);
router.post("/createAdmin", controller.createAdmin);

router.get("/profile", adminAuth, controller.getProfile);

router.put("/profile", adminAuth, controller.updateProfile);

/* =============================
   PROJECTS
============================= */

router.get("/projects", adminAuth, controller.getProjects);

router.post("/projects", adminAuth, controller.addProject);

router.put("/projects/:id", adminAuth, controller.updateProject);

router.delete("/projects/:id", adminAuth, controller.deleteProject);


/* =============================
   SKILLS
============================= */

router.get("/skills", adminAuth, controller.getSkills);

router.post("/skills", adminAuth, controller.addSkill);

router.put("/skills/:id", adminAuth, controller.updateSkill);

router.delete("/skills/:id", adminAuth, controller.deleteSkill);


/* =============================
   BLOGS
============================= */

router.get("/blogs", adminAuth, controller.getBlogs);

router.post("/blogs", adminAuth, controller.addBlog);

router.put("/blogs/:id", adminAuth, controller.updateBlog);

router.delete("/blogs/:id", adminAuth, controller.deleteBlog);


/* =============================
   TESTIMONIALS
============================= */

router.get("/testimonials", adminAuth, controller.getTestimonials);

router.post("/testimonials", adminAuth, controller.addTestimonial);

router.delete("/testimonials/:id", adminAuth, controller.deleteTestimonial);


/* =============================
   CONTACT MESSAGES
============================= */

router.get("/messages", adminAuth, controller.getMessages);

router.delete("/messages/:id", adminAuth, controller.deleteMessage);

router.post("/messages/reply", controller.sendReply);

/* =============================
   SOCIAL LINKS
============================= */

router.get("/social-links", adminAuth, controller.getSocialLinks);

router.post("/social-links", adminAuth, controller.addSocialLink);

router.put("/social-links/:id", adminAuth, controller.updateSocialLink);

router.delete("/social-links/:id", adminAuth, controller.deleteSocialLink);

/* =============================
   SOCIAL LINKS
============================= */

router.get("/experiences", controller.getExperiences);

router.post("/experiences", controller.addExperience);

router.put("/experiences/:id", controller.updateExperience);

router.delete("/experiences/:id", controller.deleteExperience);

module.exports = router;