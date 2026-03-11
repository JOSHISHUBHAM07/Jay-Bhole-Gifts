import mongoose, { Schema, Document } from "mongoose";

export interface ICoupon extends Document {
    code: string;
    discountType: "percentage" | "fixed";
    discountValue: number;
    expiryDate: Date;
    usageLimit: number;
    usedCount: number;
    isActive: boolean;
    minPurchase?: number;
    createdAt: Date;
    updatedAt: Date;
}

const CouponSchema: Schema = new Schema(
    {
        code: { type: String, required: true, unique: true, uppercase: true },
        discountType: { type: String, enum: ["percentage", "fixed"], required: true },
        discountValue: { type: Number, required: true },
        expiryDate: { type: Date, required: true },
        usageLimit: { type: Number, required: true, default: 100 },
        usedCount: { type: Number, default: 0 },
        isActive: { type: Boolean, default: true },
        minPurchase: { type: Number, default: 0 },
    },
    { timestamps: true }
);

export default mongoose.models.Coupon || mongoose.model<ICoupon>("Coupon", CouponSchema);
