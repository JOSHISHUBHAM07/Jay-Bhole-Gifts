import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/db";
import Coupon from "@/models/Coupon";
import { auth } from "@clerk/nextjs/server";
import User from "@/models/User";

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { userId } = await auth();
        if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

        await connectToDatabase();
        const mongoUser = await User.findOne({ clerkId: userId });
        if (!mongoUser || mongoUser.role !== "admin") {
            return NextResponse.json({ error: "Forbidden: Admin access required" }, { status: 403 });
        }

        const { id } = await params;
        
        const deleted = await Coupon.findByIdAndDelete(id);
        if (!deleted) {
            return NextResponse.json({ error: "Coupon not found" }, { status: 404 });
        }
        
        return NextResponse.json({ success: true });
    } catch (error) {
        return NextResponse.json({ error: "Failed to delete coupon" }, { status: 500 });
    }
}
