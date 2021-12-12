function errorHandler(err, req, res, next) {
  if (err.name === "UnauthorizedError") {
    res.status(401).json({ errorMessage: "The user is not authorized" });
  }
  if (err.name === "ValidationeError") {
    res.status(401).json({ errorMessage: err });
  }
  res.status(500).json({ errorMessage: "Server Error" });
}

module.exports = errorHandler;
