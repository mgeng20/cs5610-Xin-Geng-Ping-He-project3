const jwt = require('jsonwebtoken');
const jwtSecret = process.env.JWT_SECRET;

module.exports = {
    verifyToken(req, res, next) {
        const authHeader = req.headers.authorization;
        if (authHeader && authHeader.startsWith('Bearer ')) {
            const token = authHeader.substring(7, authHeader.length); // Extract the token after 'Bearer '
            jwt.verify(token, jwtSecret, (err, decoded) => {
                if (err) {
                    return res.status(403).json({ message: `Forbidden: ${err.message}` });
                }
                req.user = decoded;
                next();
            });
        } else {
            return res.status(401).json({ message: 'Unauthorized: No token provided or token malformed' });
        }
    }
};
