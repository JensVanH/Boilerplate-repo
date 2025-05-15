const jwt = require("jsonwebtoken");
const config = require("../config/auth.config.js");

verifyToken = (req, res, next) => {
  let token = req.headers["x-access-token"];
  if (!token) return res.status(403).send({ message: "No token provided!" });

  jwt.verify(token, config.KEY, (err, decoded) => {
    if (err) return res.status(401).send({ message: "Unauthorized!" });
    req.userId = decoded.id;
    req.userRole = decoded.role;  // Extract the role and attach to req object
    next();
  });
};

isVerifier = (req, res, next) => {
  if (req.userRole === 'verifier') {
    next();
  } else {
    return res.status(403).send({ message: "Require Verifier Role!" });
  }
};

const authJwt = {
  verifyToken: verifyToken,
  isVerifier: isVerifier
};

module.exports = authJwt;
