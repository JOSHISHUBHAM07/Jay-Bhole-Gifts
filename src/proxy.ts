import { auth } from "@/auth";

export default auth;

export const config = {
    // Matcher ignoring `/_next/` and `/api/` to allow assets and public api endpoints
    matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
