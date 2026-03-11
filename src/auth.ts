import NextAuth from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import GoogleProvider from "next-auth/providers/google"
import connectToDatabase from "@/lib/db"
import User from "@/models/User"
import bcryptjs from "bcryptjs"

export const { handlers, signIn, signOut, auth } = NextAuth({
    providers: [
        // Google OAuth Provider
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID!,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
        }),

        // Email & Password Credentials Provider
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                email: { label: "Email", type: "email" },
                password: { label: "Password", type: "password" }
            },
            async authorize(credentials) {
                if (!credentials?.email || !credentials?.password) {
                    throw new Error("Email and password are required.");
                }

                await connectToDatabase();
                const user = await User.findOne({ email: credentials.email });

                if (!user) {
                    throw new Error("No account found with this email. Please sign up first.");
                }

                if (!user.password) {
                    throw new Error("This account uses Google Sign-In. Please use the Google button.");
                }

                const isPasswordValid = await bcryptjs.compare(credentials.password as string, user.password);

                if (!isPasswordValid) {
                    throw new Error("Incorrect password. Please try again.");
                }

                return {
                    id: user._id.toString(),
                    name: user.name,
                    email: user.email,
                    role: user.role
                };
            }
        })
    ],

    pages: {
        signIn: '/login',
        error: '/login',
    },

    session: {
        strategy: "jwt",
    },

    callbacks: {
        // Called when a user signs in — used to create user in DB for Google signins
        async signIn({ user, account }) {
            if (account?.provider === "google") {
                try {
                    await connectToDatabase();
                    const existingUser = await User.findOne({ email: user.email });

                    if (!existingUser) {
                        // Create the user in our database on first Google sign-in
                        await User.create({
                            name: user.name,
                            email: user.email,
                            role: "user",
                            // No password since it's an OAuth account
                        });
                    }
                    return true;
                } catch (error) {
                    console.error("Error during Google sign-in:", error);
                    return false;
                }
            }
            return true;
        },

        async jwt({ token, user, account }) {
            if (user) {
                token.id = user.id;
                token.role = (user as any).role || "user";
            }
            // For Google sign-ins, fetch the role from the database
            if (account?.provider === "google" && token.email) {
                try {
                    await connectToDatabase();
                    const dbUser = await User.findOne({ email: token.email });
                    if (dbUser) {
                        token.id = dbUser._id.toString();
                        token.role = dbUser.role || "user";
                    }
                } catch (error) {
                    console.error("Error fetching user role:", error);
                }
            }
            return token;
        },

        async session({ session, token }) {
            if (token && session.user) {
                session.user.id = token.id as string;
                (session.user as any).role = token.role;
            }
            return session;
        },

        authorized({ auth, request: { nextUrl } }) {
            const isLoggedIn = !!auth?.user;
            const protectedPaths = ['/admin', '/profile', '/checkout'];
            const isProtected = protectedPaths.some(path => nextUrl.pathname.startsWith(path));

            if (isProtected) {
                if (isLoggedIn) return true;
                return Response.redirect(new URL('/login', nextUrl));
            } else if (isLoggedIn && (nextUrl.pathname === '/login' || nextUrl.pathname === '/signup')) {
                return Response.redirect(new URL('/profile', nextUrl));
            }
            return true;
        },
    },
})
