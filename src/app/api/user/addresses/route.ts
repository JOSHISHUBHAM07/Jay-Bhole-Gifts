import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db";
import User from "@/models/User";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/auth";

// GET user's addresses
export async function GET() {
    try {
        const session = await getServerSession(authOptions);
        if (!session || !session.user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        await connectToDatabase();
        const user = await User.findById(session.user.id);

        if (!user) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }

        return NextResponse.json(user.addresses || []);
    } catch (error) {
        console.error("Error fetching addresses:", error);
        return NextResponse.json({ error: "Failed to fetch addresses" }, { status: 500 });
    }
}

// Add a new address
export async function POST(req: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session || !session.user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const body = await req.json();
        const { name, street, city, zip, isDefault } = body;

        if (!name || !street || !city || !zip) {
            return NextResponse.json({ error: "All address fields are required" }, { status: 400 });
        }

        await connectToDatabase();
        const user = await User.findById(session.user.id);

        if (!user) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }

        if (!user.addresses) user.addresses = [];

        // If this is set to default, unset others
        if (isDefault) {
            user.addresses.forEach((addr: any) => addr.isDefault = false);
        }

        user.addresses.push({ name, street, city, zip, isDefault: isDefault || false });

        // If it's the first address, make it default automatically
        if (user.addresses.length === 1) {
            user.addresses[0].isDefault = true;
        }

        await user.save();
        return NextResponse.json({ addresses: user.addresses }, { status: 201 });
    } catch (error) {
        console.error("Error adding address:", error);
        return NextResponse.json({ error: "Failed to add address" }, { status: 500 });
    }
}
