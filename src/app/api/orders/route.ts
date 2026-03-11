import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/db";
import Order from "@/models/Order";
import User from "@/models/User";
import Product from "@/models/Product";
import crypto from "crypto";
import { auth } from "@/auth";
import { sendOrderConfirmationEmail } from "@/lib/email";
import { sendOrderWhatsAppNotification } from "@/lib/whatsapp";

export async function GET(request: Request) {
    try {
        const session = await auth();
        if (!session || !session.user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { searchParams } = new URL(request.url);
        const userId = searchParams.get('userId');

        // If trying to fetch all orders (no specific user ID), require admin role
        if ((!userId || userId === "all") && (session.user as any).role !== "admin") {
            return NextResponse.json({ error: "Forbidden: Admin access required" }, { status: 403 });
        }

        await connectToDatabase();

        let query: any = {};

        if (userId && userId !== "all") {
            query = { user: userId };
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

        // Decrement product stock
        for (const item of products) {
            await Product.findByIdAndUpdate(item.product, {
                $inc: { stock: -item.quantity }
            });
        }

        const order = await Order.create({
            user,
            products,
            totalAmount,
            deliveryAddress,
            paymentStatus: isPaid,
            orderStatus: "processing",
            timeline: [
                {
                    status: "Order Placed",
                    description: "Your order has been received and is being processed."
                }
            ]
        });

        // Fetch user info to send confirmation
        const userObj = await User.findById(user);
        
        if (userObj && userObj.email) {
            await sendOrderConfirmationEmail(userObj.email, order._id.toString(), totalAmount);
        }

        // Send WhatsApp Notifications
        const customerName = userObj?.name || 'Customer';
        const customerPhone = userObj?.phone; // Usually from profile, but might be empty
        // In real world, we would extract the phone dynamically from deliveryAddress if possible or enforce in profile
        await sendOrderWhatsAppNotification(order._id.toString(), totalAmount, customerPhone, customerName);

        return NextResponse.json(order, { status: 201 });
    } catch (error) {
        console.error("Order creation error:", error);
        return NextResponse.json({ error: "Failed to create order" }, { status: 500 });
    }
}
