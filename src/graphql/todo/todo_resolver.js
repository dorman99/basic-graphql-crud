exports.resolver = {
    Query: {
        getTodoByDate: (_, {date}, {req, client, jwtService}) => {
            let token = req.header("authorization");
            return jwtService.auth(token)
            .then(user => {
                return client.query(`
                    SELECT * FROM todo WHERE c_at = $1 
                    AND userid = $2 AND deleted IS FALSE
                `, [date, parseInt(user.id)])
            })
            .then(todo => {
                return todo.rows;
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
        }
    }
}