const jwt = require('jsonwebtoken');
const expressJwt = require('express-jwt');
require('dotenv').config();

const secretKey = process.env.SECRET_KEY;
const authenticateJwt = expressJwt({ secret: secretKey, algorithms: ['HS256'] });

exports.ensureAuthenticated = (req,res,next)=>{
  authenticateJwt(req, res, (err) => {
    if (err) {
      return res.status(401).send('Token không hợp lệ.');
    }
    next();
  });
}