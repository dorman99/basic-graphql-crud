const {ApolloServer, gql} = require("apollo-server");
let all_users = []
let count_user = all_users.length;
const typeDefs = gql`

type Query {
    hello: String!,
    user(id: Int): User,
    users: [User]!
}

type User {
    id: ID!,
    name: String!,
    username: String!,

}

type Mutation {
    register(username: String, name: String): User!,
    removeUser(id: Int): [User],
    update(id: Int, username: String): User
}
`

const resolvers = {
    Query: {
        hello: () => `Hello World`,
        user: (_, {id}, context) => {
            let user = all_users.find(user => user.id == id);
            return user ? user : null
        },
        users: () => {
            return all_users;
        }
    },
    Mutation: {
        register: (parent, {username, name}, context) => {
            const newUser = {
                id: ++count_user,
                username,
                name
            }
            all_users.push(newUser);
            return  newUser;
        },
        removeUser: (parent, {id}, content) => {
            all_users = all_users.filter(user => parseInt(user.id) !== parseInt(id));
            return all_users;
        },
        update: (parent, {id, username}) => {
            let idx = all_users.findIndex(user => user.id == id);
            if (idx > 0) {
                all_users[idx].username = username;
            }
            return idx > 0 ? all_users[idx] : 'user id not found';
        }
    }
}

const port = 3000;
const server = new ApolloServer({typeDefs, resolvers});

server.listen({port}).then(({url}) => console.log(`Server Start on Port ${url}`));