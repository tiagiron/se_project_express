const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcrypt");
const { UnauthorizedError } = require("../errors/UnauthorizedError");

const userSchema = new mongoose.Schema({
  email: {
    required: [true, "The email field is required."],
    unique: true,
    type: String,
    validate: {
      validator(value) {
        return validator.isEmail(value);
      },
      message: "You must enter a valid email",
    },
  },
  password: {
    required: [true, "The password field is required."],
    type: String,
    select: false,
  },
  name: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 30,
  },
  avatar: {
    type: String,
    required: [true, "The avatar field is required."],
    validate: {
      validator(value) {
        return validator.isURL(value);
      },
      message: "You must enter a valid URL",
    },
  },
});

userSchema.statics.findUserByCredentials = function (email, password) {
  return this.findOne({ email })
    .select("+password")
    .then((user) => {
      if (!user) {
        console.log("No user found");
        return Promise.reject(
          new UnauthorizedError("Incorrect email or password")
        );
      }
      return bcrypt.compare(password, user.password).then((matched) => {
        if (!matched) {
          console.log("Password mismatch");
          return Promise.reject(
            new UnauthorizedError("Incorrect email or password")
          );
        }
        return user;
      });
    });
};

module.exports = mongoose.model("user", userSchema);
