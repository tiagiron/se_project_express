const errorHandler = (err, req, res, next) => {
  console.error(err);

  const statusCode = err.statusCode || 500;

  res
    .status(statusCode)
    .send({ message: err.message || "An error occurred on the server" });
};

module.exports = errorHandler;
