import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/db";
import Product from "@/models/Product";
import { auth } from "@/auth";

export async function GET(request: Request) {
    try {
        await connectToDatabase();
        const { searchParams } = new URL(request.url);
        const category = searchParams.get('category');
        const isPopular = searchParams.get('isPopular');

        let query: any = {};
        if (category && category !== 'all' && category !== 'trending') {
            query.category = { $regex: new RegExp(`^${category}$`, 'i') };
        }
        if (category === 'trending' || isPopular === 'true') {
            query.rating = { $gte: 4.7 }; // or query.isPopular = true;
        }

        const products = await Product.find(query).sort({ createdAt: -1 });
        return NextResponse.json(products);
    } catch (error) {
        console.error("Error fetching products:", error);
        return NextResponse.json({ error: "Failed to fetch products" }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        const session = await auth();
        // Here we could enforce stricter checks like `session?.user?.email === "admin@example.com"` 
        // or a custom role check from the session. For now, requiring any valid login is a start,
        // but let's enforce an admin-like check or at least require authentication.
        if (!session || !session.user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        await connectToDatabase();
        const body = await request.json();
        const product = await Product.create(body);
        return NextResponse.json(product, { status: 201 });
    } catch (error) {
        return NextResponse.json({ error: "Failed to create product" }, { status: 500 });
    }
}
