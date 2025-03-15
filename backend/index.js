import express from "express";
import cors from "cors";
import { ApolloServer } from "apollo-server-express";
import { resolvers } from "./resolvers.js";
import { typeDefs } from "./typeDefs.js";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(express.json({limit:"50mb"}));
app.use(express.urlencoded({limit:"50mb",extended:true}));
app.use(cors());


const authenticateUser = (req) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) return null;

  const token = authHeader.split(" ")[1]; // "Bearer <token>"
  if (!token) return null;

  try {
    return jwt.verify(token, process.env.JWT_SECRET);
  } catch (err) {
    return null;
  }
  
};

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: ({ req }) => {
    const user = authenticateUser(req);
    return { user };
  },
});

async function startServer() {
  await server.start();
  server.applyMiddleware({ app });
  app.listen(5000, () => console.log("Server running on http://localhost:5000/graphql"));
}

startServer();
