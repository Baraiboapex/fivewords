const dotenv = require('dotenv');
dotenv.config();

const jwtHelpers = {
    async generateToken(userData){
        const jwtKey = process.env.JWT_TOKEN_SECRET_KEY;
        const userData = userData;
        const jwt = await new jose.SignJWT({'urn:fivewords:userId': userData})
            .setProtectedHeader({ alg:"HS256" })
            .setIssuedAt()
            .setIssuer('urn:example:issuer')
            .setAudience('urn:example:audience')
            .setExpirationTime('2h')
            .sign(jwtKey);

        return jwt;
    },
    async validateToken(token){
        try{
            const secret = new TextEncoder().encode(
                process.env.JWT_TOKEN_SECRET_KEY,
            );
            const { payload, _ } = await jose.jwtVerify(token, secret, {
                issuer: 'urn:example:issuer',
                audience: 'urn:example:audience',
            });

            return {
                code:200,
                message:payload
            };
        }catch(err){
            throw new Error("Token is not valid.");
        }
    }
};

module.exports = {
    jwtHelpers
}