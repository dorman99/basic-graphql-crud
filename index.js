const {ApolloServer, ApolloError} = require("apollo-server");
const {initialQuery} = require("./utils/constant");
const glue = require("schemaglue");
const {schema, resolver} = glue("src/graphql");
const pool = require("./database");
const bcrypt = require("./utils/bcrypt");
const jwtService = require("./utils/jwtService");
const date = require("./utils/date");
const port = 3000;

pool.connect()
.then(client => {
    client.query(initialQuery)
    .then(res => {
        console.log('intial db succes');
        const server = new ApolloServer({typeDefs: schema, resolvers: resolver, context: ({req, res}) => ({req, res, client, bcrypt, jwtService, date, ApolloError})});
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
