import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/db";
import User from "@/models/User";
import bcryptjs from "bcryptjs";

export async function POST(req: Request) {
    try {
        const { name, email, phone, password } = await req.json();

        // Basic validation
        if (!name || !email || !password) {
            return NextResponse.json({ error: "Missing required fields." }, { status: 400 });
        }

        await connectToDatabase();

        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return NextResponse.json({ error: "Email is already registered. Please log in." }, { status: 400 });
        }

        // Hash the password securely
        const salt = await bcryptjs.genSalt(10);
        const hashedPassword = await bcryptjs.hash(password, salt);

        // Save new User
        const newUser = await User.create({
            name,
            email,
            phone: phone || "",
            password: hashedPassword,
        });

        return NextResponse.json({
            message: "User registered successfully",
            user: { _id: newUser._id, name: newUser.name, email: newUser.email }
        }, { status: 201 });

    } catch (error: any) {
        console.error("Registration error:", error);
        return NextResponse.json({ error: "Registration failed", details: error.message }, { status: 500 });
    }
}
