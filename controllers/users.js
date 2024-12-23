const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const User = require("../models/user");
// const {
//   BAD_REQUEST_STATUS_CODE,
//   NOT_FOUND_STATUS_CODE,
//   SERVER_ERROR_STATUS_CODE,
//   CONFLICT_STATUS_CODE,
//   UNAUTHORIZED_STATUS,
// } = require("../utils/errors");
const { JWT_SECRET } = require("../utils/config");
const { BadRequestError } = require("../errors/BadRequestError");
const { ConflictError } = require("../errors/ConflictError");
const { UnauthorizedError } = require("../errors/UnauthorizedError");
const { NotFoundError } = require("../errors/NotFoundError");

const login = (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    throw new BadRequestError("Email and password are required");
  }

  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, JWT_SECRET, {
        expiresIn: "7d",
      });
      return res.send({ token });
    })
    .catch((err) => {
      console.error(err);
      if (err.name === "UnauthorizedError") {
        next(new UnauthorizedError("Incorrect email or password"));
      } else if (err.name === "ValidationError") {
        next(new BadRequestError("Invalid data"));
      } else {
        next(err);
      }
    });
};

const createUser = (req, res, next) => {
  const { email, password, name, avatar } = req.body;
  if (!email || !password || !name || !avatar) {
    throw new BadRequestError("All data required");
  }
  return User.findOne({ email })
    .then((existingUser) => {
      if (existingUser) {
        throw new ConflictError("This email already exists");
      }
      return bcrypt
        .hash(password, 10)
        .then((hash) =>
          User.create({
            email,
            password: hash,
            name,
            avatar,
          })
        )
        .then((user) => {
          res
            .status(201)
            .send({ email: user.email, name: user.name, avatar: user.avatar });
        });
    })
    .catch((err) => {
      console.error(err);
      if (err.name === "ValidationError") {
        next(new BadRequestError("Invalid data"));
      } else {
        next(err);
      }
    });
};

const getCurrentUser = (req, res, next) => {
  User.findById(req.user._id)
    .orFail()
    .then((user) => {
      const { _id, email, name, avatar } = user;
      res.send({
        _id,
        email,
        name,
        avatar,
      });
    })
    .catch((err) => {
      console.error(err);
      if (err.name === "DocumentNotFoundError") {
        next(new NotFoundError("Requested resource not found"));
      }
      if (err.name === "CastError") {
        next(new BadRequestError("Invalid data"));
      } else {
        next(err);
      }
    });
};

const updateUser = (req, res, next) => {
  const { name, avatar } = req.body;
  User.findByIdAndUpdate(
    req.user._id,
    { name, avatar },
    { new: true, runValidators: true }
  )
    .orFail()
    .then(() => res.send({ name, avatar }))
    .catch((err) => {
      console.error(err);
      if (err.name === "DocumentNotFoundError") {
        next(new NotFoundError("Requested resource not found"));
      }
      if (err.name === "ValidationError") {
        next(new BadRequestError("Invalid data"));
      } else {
        next(err);
      }
    });
};

module.exports = { createUser, getCurrentUser, login, updateUser };
