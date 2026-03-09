import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/db";
import Product from "@/models/Product";

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
        await connectToDatabase();
        const body = await request.json();
        const product = await Product.create(body);
        return NextResponse.json(product, { status: 201 });
    } catch (error) {
        return NextResponse.json({ error: "Failed to create product" }, { status: 500 });
    }
}
