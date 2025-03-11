require('dotenv').config();
const express=require('express');
const {ApolloServer} = require('apollo-server-express');
const {typeDefs,resolvers}=require("./schema");


const PORT=process.env.PORT || 4000;
async function startServer() {
    const app = express();

    const server=new ApolloServer({
        typeDefs,
        resolvers,
    });

    await server.start();
    server.applyMiddleware({app});

    app.listen(PORT,()=>{
        console.log(`Server running at http://localhost:${PORT}${server.graphqlPath}`);
    });
}

startServer();
