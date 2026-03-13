// import { verifyAccessToken } from '../helpers/jwtjelpers.js';

// // Wrapper middleware to attach payload to req object
// const authenticateToken = (req, res, next) => {
//   verifyAccessToken(req, res, (err) => {
//     if (err) {
//       return next(err);
//     }
//     // Attach payload to req object
//     req.payload = req.payload || {};
//     next();
//   });
// };

// export default authenticateToken;


import jwt from "jsonwebtoken";

export const verifyToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  if (!authHeader) {
    return res.status(401).json({ message: "No token provided" });
  }

  const token = authHeader.startsWith("Bearer ")
    ? authHeader.split(" ")[1]
    : authHeader;

  jwt.verify(token, process.env.JWT_SECRET, (err, payload) => {
    if (err) {
      return res.status(403).json({ message: "Invalid token" });
    }

    req.payload = payload;
    next();
  });
};


