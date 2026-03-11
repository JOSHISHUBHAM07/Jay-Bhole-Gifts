import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/db";
import Coupon from "@/models/Coupon";
import { auth } from "@/auth";

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        const session = await auth();
        if (!session || (session.user as any).role !== "admin") {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { id } = await params;
        await connectToDatabase();
        
        const deleted = await Coupon.findByIdAndDelete(id);
        if (!deleted) {
            return NextResponse.json({ error: "Coupon not found" }, { status: 404 });
        }
        
        return NextResponse.json({ success: true });
    } catch (error) {
        return NextResponse.json({ error: "Failed to delete coupon" }, { status: 500 });
    }
}
