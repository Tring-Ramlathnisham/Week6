const { gql } = require("apollo-server-express");
const pool=require("./db");

const typeDefs = gql `
    type User{
    id:ID !
    name:String!
    email:String!
    }

    type Query{
        users:[User]
        user(id: ID!):User
    }

    type Mutation{
        addUser(name:String!,email:String!):User
        updateUser(id:ID!,email:String!):User
        deleteUser(id:ID!):String!

    }
`;


const resolvers ={
    Query:{
        users:async()=>{
            const { rows } = await pool.query("Select * from users");
            return rows;
        },
        user: async(__dirname,{id})=>{
            const { rows } = await pool.query("Select * from users where id=$1",[id,]);
            return rows[0];
        },
    },

    Mutation:{
        addUser:async(__dirname,{name,email})=>{
            const {rows}=await pool.query("Insert into users(name,email) values ($1,$2) returning *",[name,email]);
            return rows[0];
        },
        updateUser:async(__dirname,{id,email})=>{
            const {rows}=await pool.query("Update users set email= $2 where id=$1 returning *",[id,email]);
            return rows[0];
        },
        deleteUser:async(__dirname,{id})=>{
            await pool.query("Delete from users where id=$1",[id]);
            return "User deleted successfully.";
        }
    },
};

module.exports={typeDefs,resolvers};