import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db";
import Product from "@/models/Product";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/auth";

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        const session = await getServerSession(authOptions);
        if (!session || !session.user) {
            return NextResponse.json({ error: "Unauthorized. Please log in to leave a review." }, { status: 401 });
        }

        const unwrappedParams = await params;
        const productId = unwrappedParams.id;
        const body = await req.json();
        const { rating, comment } = body;

        if (!rating || !comment) {
            return NextResponse.json({ error: "Rating and comment are required." }, { status: 400 });
        }

        await connectToDatabase();
        const product = await Product.findById(productId);

        if (!product) {
            return NextResponse.json({ error: "Product not found" }, { status: 404 });
        }

        // Check if user already reviewed
        const alreadyReviewed = product.reviews?.find(
            (r: any) => r.user.toString() === session.user.id
        );

        if (alreadyReviewed) {
            return NextResponse.json({ error: "You have already reviewed this product." }, { status: 400 });
        }

        const review = {
            user: session.user.id,
            userName: session.user.name || "Anonymous",
            rating: Number(rating),
            comment,
        };

        if (!product.reviews) {
            product.reviews = [];
        }

        product.reviews.push(review);
        product.numReviews = product.reviews.length;
        product.averageRating = product.reviews.reduce((acc: number, item: any) => item.rating + acc, 0) / product.reviews.length;

        await product.save();

        return NextResponse.json({ message: "Review added successfully", product }, { status: 201 });
    } catch (error: any) {
        console.error("Error adding review:", error);
        return NextResponse.json({ error: "Failed to add review", details: error.message }, { status: 500 });
    }
}
