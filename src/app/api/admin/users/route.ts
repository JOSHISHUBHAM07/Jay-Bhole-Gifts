import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/db";
import User from "@/models/User";
import { auth } from "@/auth";

export async function GET(request: Request) {
    try {
        const session = await auth();
        // Additional auth check for admin could go here
        if (!session || !session.user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        await connectToDatabase();

        const users = await User.find({}).sort({ createdAt: -1 }).select("-password");

        return NextResponse.json(users);
    } catch (error) {
        console.error("Fetch users error:", error);
        return NextResponse.json({ error: "Failed to fetch users" }, { status: 500 });
    }
}
