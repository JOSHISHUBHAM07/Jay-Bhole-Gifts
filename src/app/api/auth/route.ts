import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/db";
import User from "@/models/User";

// This is a placeholder/mock authentication endpoint for initial development.
// In a real application, we would use NextAuth.js or JWT.

export async function POST(req: Request) {
    try {
        await connectToDatabase();
        const body = await req.json();
        const { action, email, password, name } = body;

        if (action === "signup") {
            const existingUser = await User.findOne({ email });
            if (existingUser) {
                return NextResponse.json({ error: "User already exists" }, { status: 400 });
            }

            const user = await User.create({ name, email, password });
            return NextResponse.json({ message: "User created successfully", user: { id: user._id, name: user.name, email: user.email } }, { status: 201 });
        }

        if (action === "login") {
            const user = await User.findOne({ email, password });
            if (!user) {
                return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
            }
            return NextResponse.json({ message: "Login successful", user: { id: user._id, name: user.name, email: user.email } }, { status: 200 });
        }

        return NextResponse.json({ error: "Invalid action" }, { status: 400 });
    } catch (error) {
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
