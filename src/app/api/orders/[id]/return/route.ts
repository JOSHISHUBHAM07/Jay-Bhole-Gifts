import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/db";
import Order from "@/models/Order";
import { auth } from "@clerk/nextjs/server";

export async function POST(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { userId } = await auth();
        if (!userId) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        await connectToDatabase();
        const { id } = await params;
        const body = await request.json();
        const { reason } = body;

        const order = await Order.findById(id);

        if (!order) {
            return NextResponse.json({ error: "Order not found" }, { status: 404 });
        }

        // We could also verify that order.user matches session.user.id for security here

        if (order.orderStatus !== 'delivered') {
            return NextResponse.json({ error: "Only delivered orders can be returned" }, { status: 400 });
        }

        order.orderStatus = 'returned';

        if (!order.timeline) order.timeline = [];
        order.timeline.push({
            status: 'Return Requested',
            description: `Return requested. Reason: ${reason || "Not specified."}`,
            date: new Date()
        });

        await order.save();

        return NextResponse.json(order);
    } catch (error) {
        console.error("Return request error:", error);
        return NextResponse.json({ error: "Failed to process return request" }, { status: 500 });
    }
}
