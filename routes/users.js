const router = require("express").Router();
const auth = require("../middlewares/auth");
const {
  validateModifyUser,
} = require("../middlewares/validation");
const { getCurrentUser, updateUser } = require("../controllers/users");

router.get("/me", auth, getCurrentUser);
router.patch("/me", auth, validateModifyUser, updateUser);

module.exports = router;
