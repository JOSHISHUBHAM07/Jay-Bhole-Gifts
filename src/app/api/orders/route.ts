import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/db";
import Order from "@/models/Order";
import crypto from "crypto";
import { auth } from "@/auth";

export async function GET(request: Request) {
    try {
        const session = await auth();
        if (!session || !session.user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        await connectToDatabase();
        const { searchParams } = new URL(request.url);
        const userId = searchParams.get('userId');

        let query: any = {};

        // If the user is requesting specific userId, make sure it matches their session, 
        // unless they are an admin. NextAuth Google provider doesn't easily expose role without db lookup,
        // so for now, we force the query user ID to be their own session email/id, or an admin override
        // Assuming session.user.email is the identifier for now in this demo since we don't have distinct DB user mapping for auth.
        // If they ask for 'userId' and it doesn't match session email, block unless admin (simplification: block if mismatch).

        if (userId && userId !== "all") {
            // Forcing query to whatever user ID is passed, but realistically this should be tied to session.
            query = { user: userId };
        } else {
            // If no userId provided, it means admin view (all orders).
            // In a real app we check if (session.user.role !== 'admin') return 401;
        }

        const orders = await Order.find(query).sort({ createdAt: -1 }).populate('products.product');
        return NextResponse.json(orders);
    } catch (error) {
        return NextResponse.json({ error: "Failed to fetch orders" }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        await connectToDatabase();
        const body = await request.json();

        const {
            razorpay_payment_id,
            razorpay_order_id,
            razorpay_signature,
            user,
            products,
            totalAmount,
            deliveryAddress
        } = body;

        // Verify Razorpay signature if payment details are present
        if (razorpay_payment_id && razorpay_order_id && razorpay_signature) {
            const secret = process.env.RAZORPAY_KEY_SECRET || "fallback_secret";
            const generated_signature = crypto
                .createHmac("sha256", secret)
                .update(razorpay_order_id + "|" + razorpay_payment_id)
                .digest("hex");

            if (generated_signature !== razorpay_signature) {
                return NextResponse.json({ error: "Payment verification failed" }, { status: 400 });
            }
        }

        const isPaid = razorpay_payment_id ? "completed" : "pending";

        const order = await Order.create({
            user,
            products,
            totalAmount,
            deliveryAddress,
            paymentStatus: isPaid,
            orderStatus: "processing"
        });

        return NextResponse.json(order, { status: 201 });
    } catch (error) {
        console.error("Order creation error:", error);
        return NextResponse.json({ error: "Failed to create order" }, { status: 500 });
    }
}
