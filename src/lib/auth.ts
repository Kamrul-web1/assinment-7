import { betterAuth } from "better-auth";
import { MongoClient } from "mongodb";
import { mongodbAdapter } from "@better-auth/mongo-adapter";

const client = new MongoClient(process.env.MONGODB_ULR as string);
const db = client.db('bazar-dor-14');

export const auth = betterAuth({
    emailAndPassword: {
        enabled: true
    },
    socialProviders: {
        google: {
            clientId: process.env.GOGOLE_CLIENT_ID as string,
            clientSecret: process.env.GOGOLE_CLIENT_SECRET as string,
        }
    },

    database: mongodbAdapter(db, {
        client,
    }),
});