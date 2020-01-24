require("dotenv").config();
const bcrypt = require("bcrypt");
let saltRound = parseInt(process.env.PASSWORD_SALT || 10); 

module.exports =  {
    hash: async (password) => {
        let hashedPassword = await new Promise((resolve, reject) => {
            bcrypt.hash(password, saltRound, (err, hashed) => {
                if (err) reject(err);
                else resolve(hashed);
            })
        });
        return hashedPassword;
    },
    compare: async (password, hashPassword) => {
        let compare = await new Promise((resolve, reject) => {
            bcrypt.compare(password, hashPassword, (err, isValid) => {
                if (err) reject(err);
                else resolve(isValid);
            })
        })
        return compare;
    }
}