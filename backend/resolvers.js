import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { pool } from "./db.js"; // Assuming you have a separate file for DB connection
import dotenv from "dotenv";
import { PubSub } from "graphql-subscriptions";
import { subscribe } from "graphql";
const pubsub=new PubSub();

dotenv.config();


const resolvers = {
  Query: {
    personas: async () => {
      try{
      const result = await pool.query(`SELECT id,name,image,quote,"lastModified" FROM personas ORDER BY "lastModified" DESC`);
      return result.rows.map(persona => ({
        ...persona,
        lastModified: new Date(persona.lastModified).toISOString()
      }));
      }
      catch(error){
        console.error("Error fetching personas:",error);
        throw new Error("Failed to fetch personas");
      }
    },
    persona: async(_,{id})=>{
      const result=await pool.query("SELECT * FROM personas WHERE id=$1",[id]);
      return result.rows[0];
    },
    currentUser: async (_, __, { user }) => {
      if (!user) throw new Error("Not authenticated");
      return user;
    },
  },
  Mutation: {
    createPersona: async (_, { input }) => {
    try{
      const result = await pool.query(
        `INSERT INTO personas (name,image,quote,description,attitudes,painPoints,jobs,activities,"lastModified") VALUES ($1, $2, $3, $4,$5,$6,$7,$8,NOW()) RETURNING *`,
        [
          input.name,
          input.image || "",
          input.quote || "",
          input.description || "",
          input.attitudes || "",
          input.painPoints || "",
          input.jobs || "",
          input.activities || "",
        ]);
      
        if(!result || result.rowCount==0){
          throw new Error("Failed to insert persona.");
        }
        const newPersona=result.rows[0];
        pubsub.publish("PERSONA_UPDATED",{personaUpdated:newPersona});

      return newPersona;
    }
    catch(error){
      console.error("Error creating persona:",error);
      throw new Error("Database error:Unable to create persona");
    }
    },
    updatePersona: async (_, { id, input }) => {
      try {

        const result = await pool.query(
          `UPDATE personas 
           SET name = COALESCE($2, name),
               image = COALESCE($3, image),
               quote = COALESCE($4, quote),
               description = COALESCE($5, description),
               attitudes = COALESCE($6, attitudes),
               painPoints = COALESCE($7, painPoints),
               jobs = COALESCE($8, jobs),
               activities = COALESCE($9, activities),
               "lastModified" = NOW()
           WHERE id = $1 
           RETURNING *`,
          [id, input.name, input.image, input.quote, input.description, input.attitudes, input.painPoints, input.jobs, input.activities]
        );

        if (result.rowCount === 0) {
          throw new Error(`Persona with ID ${id} not found.`);
        }
        const updatedPersona=result.rows[0];
        pubsub.publish("PERSONA_UPDATED",{personaUpdated:updatedPersona});
        return updatedPersona;
      } catch (error) {
        console.error("Error updating persona:", error);
        throw new Error("Failed to update persona");
      }
    },
    deletePersona: async (_, { id }) => {
      try {
        await pool.query(`DELETE FROM personas WHERE id = $1`, [id]);
        pubsub.publish("PERSONA_UPDATED", { personaUpdated: null });
        return true;
      } catch (error) {
        console.error("Error deleting persona:", error);
        throw new Error("Database error: Unable to delete persona");
      }
    },
    signup: async (_, { name,email, password }) => {
      const hashedPassword = await bcrypt.hash(password, 10);
      try {
        const result = await pool.query(
          "INSERT INTO users (name, email, password) VALUES ($1, $2, $3) RETURNING id, name, email",
          [name, email, hashedPassword]
        );
        return result.rows[0];
      } catch (error) {
        throw new Error("User already exists or database error.");
      }
    },
    login: async (_, { email, password }) => {
      const result = await pool.query("SELECT * FROM users WHERE email = $1", [email]);
      if (result.rows.length === 0) {
        throw new Error("User not found");
      }
      const isValid = await bcrypt.compare(password, result.rows[0].password);
      if (!isValid) {
        throw new Error("Incorrect password");
      }
      const token = jwt.sign({ userId: result.rows[0].id }, process.env.JWT_SECRET, { expiresIn: "1h" });
      return { id: result.rows[0].id, email: result.rows[0].email, token };
    },
  },
  Subscription:{
    personaUpdated:{
      subscribe:()=>pubsub.asyncIterableIterator(["PERSONA_UPDATED"]),
    },
  },
};

export { resolvers };
