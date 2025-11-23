import { betterAuth } from "better-auth";
import { mongodbAdapter } from "better-auth/adapters/mongodb";
import mongoose from "mongoose";

export const auth = betterAuth({
    database: mongodbAdapter(mongoose.connection),
    baseURL: process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000",
    emailAndPassword: {
        enabled: true,
        requireEmailVerification: false,
    },
    socialProviders: {
        google: {
            clientId: process.env.GOOGLE_CLIENT_ID as string,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
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
