import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/db";
import Order from "@/models/Order";
import { auth } from "@/auth";

// GET single order for Tracking
export async function GET(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        await connectToDatabase();
        const { id } = await params;

        // Ensure ID is valid length (avoid casting errors)
        if (!id || id.length < 5) {
            return NextResponse.json({ error: "Invalid Order ID" }, { status: 400 });
        }

        const order = await Order.findById(id).populate('products.product');
        if (!order) {
            return NextResponse.json({ error: "Order not found" }, { status: 404 });
        }

        return NextResponse.json(order);
    } catch (error) {
        console.error("Fetch order error:", error);
        return NextResponse.json({ error: "Failed to fetch order details. Ensure ID is correct." }, { status: 500 });
    }
}

// PATCH order status for Admin Dashboard
export async function PATCH(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const session = await auth();
        if (!session || !session.user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        await connectToDatabase();
        const { id } = await params;
        const body = await request.json();

        const { orderStatus } = body;

        if (!orderStatus) {
            return NextResponse.json({ error: "orderStatus is required" }, { status: 400 });
        }

        const order = await Order.findById(id);

        if (!order) {
            return NextResponse.json({ error: "Order not found" }, { status: 404 });
        }

        order.orderStatus = orderStatus;

        // Add to timeline
        let description = `Order status updated to ${orderStatus}.`;
        if (orderStatus === 'shipped') description = "Your order has been shipped and is on the way!";
        if (orderStatus === 'delivered') description = "Your order has been delivered successfully.";
        if (orderStatus === 'cancelled') description = "Your order was cancelled.";

        if (!order.timeline) order.timeline = [];
        order.timeline.push({
            status: orderStatus.charAt(0).toUpperCase() + orderStatus.slice(1),
            description: description,
            date: new Date()
        });

        await order.save();

        return NextResponse.json(order);
    } catch (error) {
        console.error("Update order error:", error);
        return NextResponse.json({ error: "Failed to update order status" }, { status: 500 });
    }
}
