import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/db";
import User from "@/models/User";
import { auth } from "@clerk/nextjs/server";

export async function PATCH(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { userId } = await auth();
        if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

        await connectToDatabase();
        const mongoUser = await User.findOne({ clerkId: userId });
        if (!mongoUser || mongoUser.role !== "admin") {
            return NextResponse.json({ error: "Forbidden: Admin access required" }, { status: 403 });
        }

        await connectToDatabase();
        const { id } = await params;

        const user = await User.findById(id);
        if (!user) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }

        // Toggle role
        user.role = user.role === "admin" ? "user" : "admin";
        await user.save();

        return NextResponse.json({ message: "User role updated", user });
    } catch (error) {
        console.error("Update user role error:", error);
        return NextResponse.json({ error: "Failed to update user role" }, { status: 500 });
    }
}

export async function DELETE(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { userId } = await auth();
        if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

        await connectToDatabase();
        const mongoUser = await User.findOne({ clerkId: userId });
        if (!mongoUser || mongoUser.role !== "admin") {
            return NextResponse.json({ error: "Forbidden: Admin access required" }, { status: 403 });
        }

        const { id } = await params;

        // Prevent admin from deleting themselves
        if (mongoUser._id.toString() === id) {
            return NextResponse.json({ error: "Cannot delete your own account" }, { status: 400 });
        }

        const deletedUser = await User.findByIdAndDelete(id);

        if (!deletedUser) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }

        return NextResponse.json({ message: "User deleted successfully" }, { status: 200 });
    } catch (error) {
        console.error("Delete user error:", error);
        return NextResponse.json({ error: "Failed to delete user" }, { status: 500 });
    }
}
