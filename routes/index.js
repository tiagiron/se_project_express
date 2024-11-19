const router = require("express").Router();
const { NOT_FOUND_STATUS_CODE } = require("../utils/errors");

const userRouter = require("./users");
const itemRouter = require("./clothingItems");

const { createUser, login } = require("../controllers/users");
const auth = require("../middlewares/auth");

router.post("/signin", login);
router.post("/signup", createUser);
router.use("/users", auth, userRouter);
router.use("/items", itemRouter);

router.use((req, res) => {
  res.status(NOT_FOUND_STATUS_CODE).send({ message: "Router not found" });
});

module.exports = router;
