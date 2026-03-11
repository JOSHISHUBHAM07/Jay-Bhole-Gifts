import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/db";
import User from "@/models/User";
import { auth } from "@clerk/nextjs/server";

export async function GET() {
    try {
        const { userId } = await auth();
        if (!userId) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        await connectToDatabase();
        const user = await User.findOne({ clerkId: userId }).select("-password -wishlist -addresses");

        if (!user) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }

        return NextResponse.json(user);
    } catch (error) {
        console.error("Error fetching profile metrics:", error);
        return NextResponse.json({ error: "Failed to fetch profile metrics" }, { status: 500 });
    }
}

export async function PUT(req: Request) {
    try {
        const { userId } = await auth();
        if (!userId) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const body = await req.json();
        const { name, phone } = body;

        await connectToDatabase();

        // Cannot update email as it is the unique identifier for OAuth/Credentials
        const updatedUser = await User.findOneAndUpdate(
            { clerkId: userId },
            { name, phone },
            { new: true, runValidators: true }
        ).select("-password -wishlist -addresses");

        if (!updatedUser) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }

        return NextResponse.json({ message: "Profile updated successfully", user: updatedUser }, { status: 200 });
    } catch (error) {
        console.error("Error updating profile metrics:", error);
        return NextResponse.json({ error: "Failed to update profile metrics" }, { status: 500 });
    }
}
