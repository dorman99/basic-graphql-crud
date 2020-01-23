const {ApolloServer, gql} = require("apollo-server");
const {initialQuery} = require("./utils/constant");
// const {makeExecutableSchema} = require("graphql-tools");
const glue = require("schemaglue");
const {schema, resolver} = glue("src/graphql");
const pool = require("./database");
const bcrypt = require("bcrypt");
const port = 3000;

pool.connect()
.then(client => {
    client.query(initialQuery)
    .then(res => {
        console.log('intial db succes');
        const server = new ApolloServer({typeDefs: schema, resolvers: resolver, context: ({req, res}) => ({req, res, client, bcrypt})});
        server.listen({port}).then(({url}) => console.log(`Server Start on Port ${url}`));

    })
    .catch(err => {
        console.log(err);
        client.release();
    })
})
.then(err => {
    if (err) console.log(err);
})

function hashPassword(password) {
    let crypto = require("crypto");
    let secret = 'umami';
    return crypto.createHmac('sha256', secret)
    .update(password)
    .digest('hex');
}
