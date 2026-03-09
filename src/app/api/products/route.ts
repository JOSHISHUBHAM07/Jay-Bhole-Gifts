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
        const q = searchParams.get('q');
        const minPrice = searchParams.get('minPrice');
        const maxPrice = searchParams.get('maxPrice');
        const sortParam = searchParams.get('sort') || '-createdAt';

        let query: any = {};

        // Category filtering
        if (category && category !== 'all' && category !== 'trending') {
            query.category = { $regex: new RegExp(`^${category}$`, 'i') };
        }
        if (category === 'trending' || isPopular === 'true') {
            query.isPopular = true; // Use the actual boolean field
        }

        // Text search
        if (q) {
            query.$or = [
                { name: { $regex: q, $options: 'i' } },
                { description: { $regex: q, $options: 'i' } }
            ];
        }

        // Price filtering
        if (minPrice || maxPrice) {
            query.price = {};
            if (minPrice) query.price.$gte = Number(minPrice);
            if (maxPrice) query.price.$lte = Number(maxPrice);
        }

        // Sorting format parsing (e.g. "price", "-price", "createdAt")
        let sortObj: any = { createdAt: -1 };
        if (sortParam) {
            if (sortParam.startsWith('-')) {
                sortObj = { [sortParam.substring(1)]: -1 };
            } else {
                sortObj = { [sortParam]: 1 };
            }
        }

        const products = await Product.find(query).sort(sortObj);
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
