import { redirect } from "next/navigation";
import { auth } from "@clerk/nextjs/server";
import connectToDatabase from "@/lib/db";
import User from "@/models/User";

export default async function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const { userId } = await auth();

    if (!userId) {
        redirect("/");
    }

    await connectToDatabase();
    const user = await User.findOne({ clerkId: userId });
    
    if (!user || user.role !== "admin") {
        redirect("/");
    }

    return <>{children}</>;
}
