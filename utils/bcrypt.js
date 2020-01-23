require("dotenv").config();
const bcrypt = require("bcrypt");
let saltRound = parseInt(process.env.PASSWORD_SALT || 20); 

module.exports =  {
    hash: async (password) => {
        let hashedPassword = await new Promise((resolve, reject) => {
            bcrypt.hash(password, saltRound, (err, hashed) => {
                if (err) reject(err);
                else resolve(hashed);
            })
        });
        return hashedPassword;
    }
}