import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/db";
import Coupon from "@/models/Coupon";

export async function POST(request: Request) {
    try {
        await connectToDatabase();
        const { code, cartTotal } = await request.json();

        if (!code) {
            return NextResponse.json({ error: "Coupon code is required" }, { status: 400 });
        }

        const coupon = await Coupon.findOne({ code: code.toUpperCase() });

        if (!coupon) {
            return NextResponse.json({ error: "Invalid coupon code" }, { status: 404 });
        }

        if (!coupon.isActive) {
            return NextResponse.json({ error: "This coupon is no longer active" }, { status: 400 });
        }

        if (new Date() > new Date(coupon.expiryDate)) {
            return NextResponse.json({ error: "This coupon has expired" }, { status: 400 });
        }

        if (coupon.usedCount >= coupon.usageLimit) {
            return NextResponse.json({ error: "This coupon has reached its usage limit" }, { status: 400 });
        }

        if (cartTotal < (coupon.minPurchase || 0)) {
            return NextResponse.json({ error: `Minimum purchase of $${coupon.minPurchase} required` }, { status: 400 });
        }

        // Calculate discount
        let discountAmount = 0;
        if (coupon.discountType === "percentage") {
            discountAmount = (cartTotal * coupon.discountValue) / 100;
        } else if (coupon.discountType === "fixed") {
            discountAmount = coupon.discountValue;
        }

        // Ensure discount doesn't exceed cart total
        discountAmount = Math.min(discountAmount, cartTotal);

        return NextResponse.json({
            success: true,
            code: coupon.code,
            discountAmount,
            message: "Coupon applied successfully"
        });

    } catch (error) {
        console.error("Coupon validation error:", error);
        return NextResponse.json({ error: "Failed to validate coupon" }, { status: 500 });
    }
}
