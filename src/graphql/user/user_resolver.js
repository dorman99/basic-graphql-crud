let saltRound = parseInt(process.env.PASSWORD_SALT || 10); 
exports.resolver = {
    Query: {
        users: (_, {limit, offset}, {client}) => {
            limit = limit ? limit : 10;
            offset = offset && offset >= 0 ? offset : 0; 
            return client.query(`SELECT * FROM usertodo WHERE deleted IS FALSE ORDER BY id LIMIT ${limit} OFFSET ${offset}`)
            .then(result => {
                return result.rows;
            })
            .catch(err => {
                throw Error(err);
            });
        },
        user: (_, {id}, {client}) => {
            return client.query(`SELECT * FROM usertodo WHERE id = ${id} AND deleted IS FALSE`)
            .then(result => {
                if (result.rows[0]) {
                    return result.rows[0];
                }
                else {
                    throw Error("Not Found user Id");
                }
            })
            .catch(err => {
                throw Error(err);
            })
        },
        login: (_, {username, password}, {client, bcrypt, jwtService}) => {
            return client.query(`SELECT * FROM usertodo WHERE username = '${username}' AND deleted is FALSE;`)
            .then(result => result.rows[0])
            .then(user => {
                if (user) {
                    return bcrypt.compare(password, user.password)
                    .then(isValid => {
                        if (isValid) {
                            return user;
                        }
                        else {
                            throw Error("password not match");
                        }
                    })
                }
                else {
                    throw Error("Data Not Found");
                }
            })
            .then(user => {
                let genToken = jwtService.sign(user);
                return genToken.then(token => {
                    return {token}
                })
            })
            .catch(err => {
                console.log(err);
                throw Error(err);
            })

        }
    },
    Mutation: {
        register: (_, {username, password, name}, {client, bcrypt}) => {
            return client.query(`SELECT id FROM usertodo where username = '${username}' AND deleted IS FALSE`)
            .then(result => {
                if (result.rows.length > 0) {
                    return new Error("Duplicated Username");
                }
                else {
                    let hashed = bcrypt.hash(password, saltRound);
                    return hashed.then(password => password)
                    .then(hashedPassword => {
                        return client.query(`INSERT INTO usertodo (username, name, password) VALUES ('${username}', '${name}', '${hashedPassword}') RETURNING *`)
                    })
                    .then(result => result.rows[0])
                }
            })
            .catch(err => {
                console.log(err);
                throw Error(err);
            })
        },
        removeAllUserName: (_, {username}, {client}) => {
            return client.query(`UPDATE usertodo set deleted =  TRUE WHERE username = '${username}' RETURNING *`)
            .then(result => result.rows)
            .catch(err => {throw Error(err)});
        }
    }
}