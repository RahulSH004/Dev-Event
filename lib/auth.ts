import { betterAuth } from "better-auth";
import { mongodbAdapter } from "better-auth/adapters/mongodb";
import mongoose from "mongoose";
import connectDB from "./mongodb";

// Ensure database connection is established
await connectDB();

export const auth = betterAuth({
    database: mongodbAdapter(mongoose.connection.db!),
    baseURL: process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000",
    emailAndPassword: {
        enabled: true,
        requireEmailVerification: false,
    },
    socialProviders: {
        google: {
            clientId: process.env.AUTH_GOOGLE_ID as string,
            clientSecret: process.env.AUTH_GOOGLE_SECRET as string,
        },
    },
    session: {
        cookieCache: {
            enabled: true,
            maxAge: 5 * 60, // 5 minutes
        },
    },
    trustedOrigins: [
        process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000",
        "http://localhost:3000",
        "https://dev-event-phi.vercel.app"
    ],
});

export type Session = typeof auth.$Infer.Session;
