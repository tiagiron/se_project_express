const router = require("express").Router();
const { NotFoundError } = require("../errors/NotFoundError");

const userRouter = require("./users");
const itemRouter = require("./clothingItems");

const { createUser, login } = require("../controllers/users");
const auth = require("../middlewares/auth");
const {
  validateUserBody,
  validateAuthentication,
} = require("../middlewares/validation");

router.post("/signin", validateAuthentication, login);
router.post("/signup", validateUserBody, createUser);
router.use("/users", auth, userRouter);
router.use("/items", itemRouter);

router.use((req, res) => {
  throw new NotFoundError("Router not found");
});

module.exports = router;
