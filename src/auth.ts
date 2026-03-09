import NextAuth from "next-auth"
import Google from "next-auth/providers/google"

export const { handlers, signIn, signOut, auth } = NextAuth({
    providers: [
        Google({
            clientId: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        }),
    ],
    pages: {
        signIn: '/login', // Set the custom login page
    },
    callbacks: {
        authorized({ auth, request: { nextUrl } }) {
            const isLoggedIn = !!auth?.user;
            const protectedPaths = ['/admin', '/profile', '/checkout'];
            const isProtected = protectedPaths.some(path => nextUrl.pathname.startsWith(path));

            if (isProtected) {
                if (isLoggedIn) return true;
                return false; // Redirect to sign-in page implicitly NextAuth handles this if pages.signIn is set
            } else if (isLoggedIn && (nextUrl.pathname === '/login' || nextUrl.pathname === '/signup')) {
                // Redirect logged-in users away from auth pages to their dashboard
                return Response.redirect(new URL('/profile', nextUrl));
            }
            return true;
        },
    },
})
