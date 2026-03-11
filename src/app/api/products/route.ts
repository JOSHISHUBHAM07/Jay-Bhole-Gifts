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

        // Pagination
        const page = parseInt(searchParams.get('page') || '1', 10);
        const limit = parseInt(searchParams.get('limit') || '12', 10);
        const skip = (page - 1) * limit;

        const total = await Product.countDocuments(query);
        const products = await Product.find(query).sort(sortObj).skip(skip).limit(limit);

        return NextResponse.json({
            products,
            total,
            page,
            pages: Math.ceil(total / limit)
        });
    } catch (error) {
        console.error("Error fetching products:", error);
        return NextResponse.json({ error: "Failed to fetch products" }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        const session = await auth();
        if (!session || !session.user || (session.user as any).role !== "admin") {
            return NextResponse.json({ error: "Forbidden: Admin access required" }, { status: 403 });
        }

        await connectToDatabase();
        const body = await request.json();
        const product = await Product.create(body);
        return NextResponse.json(product, { status: 201 });
    } catch (error) {
        return NextResponse.json({ error: "Failed to create product" }, { status: 500 });
    }
}
