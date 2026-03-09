import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db";
import User from "@/models/User";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/auth";

// GET user's wishlist
export async function GET() {
    try {
        const session = await getServerSession(authOptions);
        if (!session || !session.user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        await connectToDatabase();
        const user = await User.findById(session.user.id).populate("wishlist");

        if (!user) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }

        return NextResponse.json(user.wishlist);
    } catch (error) {
        console.error("Error fetching wishlist:", error);
        return NextResponse.json({ error: "Failed to fetch wishlist" }, { status: 500 });
    }
}

// Add/Remove from wishlist
export async function POST(req: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session || !session.user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const body = await req.json();
        const { productId } = body;

        if (!productId) {
            return NextResponse.json({ error: "Product ID is required" }, { status: 400 });
        }

        await connectToDatabase();
        const user = await User.findById(session.user.id);

        if (!user) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }

        // Check if product is already in wishlist
        const index = user.wishlist?.indexOf(productId);

        if (index !== undefined && index !== -1) {
            // Remove it
            user.wishlist?.splice(index, 1);
        } else {
            // Add it
            if (!user.wishlist) user.wishlist = [];
            user.wishlist.push(productId);
        }

        await user.save();
        return NextResponse.json({ wishlist: user.wishlist }, { status: 200 });
    } catch (error) {
        console.error("Error updating wishlist:", error);
        return NextResponse.json({ error: "Failed to update wishlist" }, { status: 500 });
    }
}
