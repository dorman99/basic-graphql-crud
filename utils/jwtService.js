require("dotenv").config();
const jwt = require("jsonwebtoken");
const jwtSecret = process.env.JWT_SECRET || 'umami';
module.exports = {
    sign: async (data) => {
        delete data.password;
        return await jwt.sign(data, jwtSecret);
    },
    auth: async (token) => {
        return await jwt.verify(token, jwtSecret);
    }
}