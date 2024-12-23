// const {
//   JWT_SECRET = "7d9c1a91218069943f6f04011908e696d7a5e251350204076957cb7da12b818b",
// } = process.env;

module.exports = {
  JWT_SECRET: process.env.JWT_SECRET || "super-strong-secret",
};
