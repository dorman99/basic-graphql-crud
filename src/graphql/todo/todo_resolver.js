exports.resolver = {
    Query: {
        getTodoByDate: (_, {dates}, {req, client, jwtService, date}) => {
            let token = req.header("authorization");
            return jwtService.auth(token)
            .then(user => {
                return client.query(`
                    SELECT * FROM todo WHERE c_at = $1 
                    AND userid = $2 AND deleted IS FALSE AND isDone IS FALSE
                `, [dates, parseInt(user.id)])
            })
            .then(todo => {
                return todo.rows.map(td => {
                    return {
                        id: parseInt(td.id),
                        name: td.name,
                        isDone: td.isdone,
                        endDate: date.toIsoStringDate(td.enddate)
                    }
                });
            })
            .catch(err => {
                throw Error(err);
            })
        },
        getById: (_, {id}, {req, client, jwtService}) => {
            let token = req.header("authorization");
            return jwtService.auth(token)
            .then(user => {
                return client.query("SELECT * FROM TODO WHERE id = $1 AND deleted IS FALSE AND userid = $2", [id, parseInt(user.id)])
            })
            .then(todo => {
                if (todo.rows[0]) {
                    return todo.rows[0]
                }
                else {
                    throw Error(`${id}, not found`);
                }
            })
            .catch(err => {
                throw Error(err);
            })
        },
        getByStatus: (_, {isDone}, {req, client, jwtService, date}) => {
            let token = req.header("authorization");
            return jwtService.auth(token)
            .then(user => {
                return client.query(`SELECT * FROM todo where isDone = $1 AND userId = $2 AND deleted IS FALSE`, [isDone, parseInt(user.id)]);
            })
            .then(todo => {
                return todo.rows.map(el => {
                    return {
                        id: parseInt(el.id),
                        name: el.name,
                        endDate: date.toIsoStringDate(el.enddate),
                        isDone: el.isdone
                    }
                })
            })
            .catch(err => {
                throw Error(err);
            })
        }
    },
    Mutation: {
        addTodo: (_, {name, endDate}, {req, client, jwtService, date}) => {
            let token = req.header("authorization");
            return jwtService.auth(token)
            .then(user => {
                endDate = date.toIsoStringDate(endDate);
                return client.query(
                    `INSERT INTO todo (name, endDate, userId) VALUES ($1, $2, $3) RETURNING *`
                , [name, endDate, parseInt(user.id)])
            })
            .then(todo => {
                const {id, enddate, isdone, name} = todo.rows[0];
                return {
                    id: parseInt(id),
                    endDate: date.toIsoStringDate(enddate),
                    isDone: isdone,
                    name
                };
            })
            .catch(err => {
                throw Error(err);
            })
        },
        doneTodo: (_, {id}, {req, client, jwtService}) => {
            let token = req.header("authorization");
            return jwtService.auth(token)
            .then(user => {
                return client.query(`UPDATE todo SET isDone = TRUE, u_at = NOW() 
                WHERE id = $1 AND userId = $2 RETURNING *`, [id, parseInt(user.id)])
            })
            .then(todo => {
                if (todo.rows[0]) {
                    return todo.rows[0];
                }
                else {
                    throw Error(`Id Is Not Valid: ${id}`);
                }
            })
            .catch(err => {
                throw Error(err);
            })
        },
        removeTodo: (_, {id}, {req, client, jwtService}) => {
            let token = req.header("authorization");
            return jwtService.auth(token)
            .then(user => {
                return client.query(`UPDATE todo SET deleted = TRUE WHERE id = $1 AND userId = $2 RETURNING *`, [id, parseInt(user.id)]);
            })
            .then(todo => {
                if (todo.rows[0]) {
                    return todo.rows[0];
                }
                else {
                    throw Error(`Not Valid Id ${id}`)
                }
            })
            .catch(err => {
                throw Error(err);
            })
        }
    }
}