const router = require("express").Router();
const controller = require("../controllers/userController");

router.get("/profile", controller.getProfile);
router.get("/skills", controller.getSkills);
router.get("/projects", controller.getProjects);
router.get("/blogs", controller.getBlogs);
router.get("/testimonials", controller.getTestimonials);
router.get("/social-links", controller.getSocialLinks);

router.post("/contact", controller.contactMessage);
router.get("/experiences", controller.getExperiences);

module.exports = router;