require('dotenv').config();
const jwt = require('jsonwebtoken');

function authenticateToken(req, res, next) {

    const authHeader = req.headers['authorization'];  // ✅ headers (plural)
    console.log('auth-Headers', authHeader);

    const token = authHeader && authHeader.split(' ')[1];  // ✅ authHeader not req.authHeader
    if (token == null) {
        return res.sendStatus(401);
    }

    jwt.verify(token, process.env.ACCESS_TOKEN, (err, decoded) => {
        if (err) {
            return res.sendStatus(403);
        }
        res.locals.user = decoded;  // ✅ avoid overwriting entire res.locals
        next();
    });
}

module.exports = { authenticateToken };