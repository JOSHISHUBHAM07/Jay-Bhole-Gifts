export { auth as middleware } from "@/auth"

export const config = {
    matcher: [
        /*
         * Match all request paths EXCEPT these:
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico
         * - api (API routes — they handle their own auth)
         * - Public pages (/, /login, /signup, /products, /about, /contact, etc.)
         */
        "/((?!_next/static|_next/image|favicon.ico|api|login|signup|$|products|about|faq|contact|track|order-success).*)",
    ],
}
