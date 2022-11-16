'use-strict';
const jwt = require('jsonwebtoken');
const authConfig = require('../../config/AuthConfig');

module.exports = {
    async validateEmailVerify(req, res, next) {
        try {
            const user = req.user
            let verify;
            let token = jwt.sign({
                user: user
            }, authConfig.secret, {
                expiresIn: authConfig.expires
            });
            verify = user.email_verified_at !== null;
            res.json({
                status: 'isClient',
                verified: verify,
                token: token
            });
        } catch (error) {
            console.log(error);
        }
    }
}
