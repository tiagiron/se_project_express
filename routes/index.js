const router = require("express").Router();
// const { NOT_FOUND_STATUS_CODE } = require("../utils/errors");
const NotFoundError = require("../errors/NotFoundError");

const userRouter = require("./users");
const itemRouter = require("./clothingItems");

const { createUser, login } = require("../controllers/users");
const auth = require("../middlewares/auth");

router.post("/signin", login);
router.post("/signup", createUser);
router.use("/users", auth, userRouter);
router.use("/items", itemRouter);

router.use((req, res) => {
  throw new NotFoundError("Router not found");
});

module.exports = router;
