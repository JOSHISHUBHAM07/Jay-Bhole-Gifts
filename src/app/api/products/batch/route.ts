import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/db";
import Product from "@/models/Product";

export async function POST(request: Request) {
    try {
        await connectToDatabase();
        const { ids } = await request.json();

        if (!Array.isArray(ids) || ids.length === 0) {
            return NextResponse.json({ products: [] });
        }

        // Limit to 10 products for safety
        const products = await Product.find({
            _id: { $in: ids.slice(0, 10) }
        }).select('name price images category stock');

        return NextResponse.json(products);
    } catch (error) {
        console.error("Batch fetch error:", error);
        return NextResponse.json({ error: "Failed to fetch products" }, { status: 500 });
    }
}
