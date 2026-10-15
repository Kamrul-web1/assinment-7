
import { betterAuth } from "better-auth";
import { MongoClient } from "mongodb";
import { mongodbAdapter } from "@better-auth/mongo-adapter";

const mongoUrl = process.env.MONGODB_ULR;

if (!mongoUrl) {
    throw new Error(process.env.MONGODB_ULR);
}

const client = new MongoClient(mongoUrl);
const db = client.db("bazar-dor-14");

export const auth = betterAuth({
    baseURL: process.env.BETTER_AUTH_URL,
    secret: process.env.BETTER_AUTH_SECRET,


    emailAndPassword: {
        enabled: true,
    },

    socialProviders: {
        google: {
            clientId: process.env.GOGOLE_CLIENT_ID as string,
            clientSecret: process.env.GOGOLE_CLIENT_SECRET as string,
        },

        github: {
            clientId: process.env.GITHUB_CLIENT_ID as string,
            clientSecret: process.env.GITHUB_CLIENT_SECRET as string,
        },
    },

    account: {
        accountLinking: {
            enabled: true,
            trustedProviders: ["google", "github"],
            disableImplicitLinking: false,
        },
    },

    database: mongodbAdapter(db, {
        client,
    }),
});
