import { redirect } from "next/navigation";
import { auth } from "@/auth";

export default async function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const session = await auth();

    // Check if the user is authenticated. We could also check session.user.role here if it was added to JWT.
    // For now, if there is no active session, we kick them out. 
    if (!session || !session.user) {
        redirect("/");
    }

    // In a real application, you would also verify the user's role is "admin" from the database.
    // e.g. const user = await User.findOne({ email: session.user.email });
    // if (user.role !== "admin") redirect("/");

    return <>{children}</>;
}
