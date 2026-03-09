import mongoose, { Schema, Document } from "mongoose";

export interface IOrder extends Document {
    user: mongoose.Types.ObjectId;
    products: {
        product: mongoose.Types.ObjectId;
        quantity: number;
        customization?: string;
    }[];
    totalAmount: number;
    deliveryAddress: string;
    paymentStatus: "pending" | "completed" | "failed";
    orderStatus: "processing" | "shipped" | "delivered" | "cancelled";
    createdAt: Date;
    updatedAt: Date;
}

const OrderSchema: Schema = new Schema(
    {
        user: { type: Schema.Types.ObjectId, ref: "User", required: true },
        products: [
            {
                product: { type: Schema.Types.ObjectId, ref: "Product", required: true },
                quantity: { type: Number, required: true, min: 1 },
                customization: { type: String },
            },
        ],
        totalAmount: { type: Number, required: true },
        deliveryAddress: { type: String, required: true },
        paymentStatus: { type: String, enum: ["pending", "completed", "failed"], default: "pending" },
        orderStatus: { type: String, enum: ["processing", "shipped", "delivered", "cancelled"], default: "processing" },
    },
    { timestamps: true }
);

export default mongoose.models.Order || mongoose.model<IOrder>("Order", OrderSchema);
