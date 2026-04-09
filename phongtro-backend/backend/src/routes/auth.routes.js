const router = require("express").Router();

const { register, login } = require("../controllers/auth.controller");

const {
    authenticate,
    authorize
} = require("../middleware/auth.middleware");

router.post("/register", register);
router.post("/login", login);

router.get("/me", authenticate, (req, res) => {
    res.json(req.user);
});

router.get(
    "/admin",
    authenticate,
    authorize("ADMIN"),
    (req, res) => {
        res.json({ message: "Admin access" });
    }
);
module.exports = router;

