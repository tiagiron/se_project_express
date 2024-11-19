const jwt = require("jsonwebtoken");
const { UNAUTHORIZED_STATUS } = require("../utils/errors");
const { JWT_SECRET } = require("../utils/config");

const auth = (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization) {
    return res
      .status(UNAUTHORIZED_STATUS)
      .send({ message: "Authorization required" });
  }

  const token = authorization.replace("Bearer ", "");

  let payload;
  try {
    payload = jwt.verify(token, JWT_SECRET);
  } catch (err) {
    return res.status(UNAUTHORIZED_STATUS).send({ message: "Invalid token" });
  }

  req.user = payload;
  next();
};

module.exports = auth;
