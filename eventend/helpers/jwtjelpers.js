import JWT from 'jsonwebtoken';
import createError from 'http-errors';

export const signAccessToken = (userId) => {
  return new Promise((resolve, reject) => {
    const payload = { id: userId }; 
    const secret = process.env.ACCESS_TOKEN_SECRET;
    const options = {
      expiresIn: '60m',
      issuer: 'EddTechnologies.com',
    };
    JWT.sign(payload, secret, options, (error, token) => {
      if (error) return reject(error);
      resolve(token);
    });
  });
};


export const verifyAccessToken = (req, res, next) => {
    if (!req.headers['authorization']) return next(createError.Unauthorized());
    const authHeader = req.headers['authorization'];
    const bearerToken = authHeader.split(' ');
    const token = bearerToken[1];
    JWT.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, payload) => {
        if (err) {
            return next(createError.Unauthorized());
        }
        req.payload = payload;
        next();
    });
};