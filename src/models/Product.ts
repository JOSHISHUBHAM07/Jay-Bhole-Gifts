import mongoose, { Schema, Document } from "mongoose";

export interface IProduct extends Document {
    name: string;
    description: string;
    price: number;
    category: string;
    images: string[];
    stock: number;
    isPopular: boolean;
    canCustomize: boolean;
    customizationOptions?: string[];
    createdAt: Date;
    updatedAt: Date;
}

const ProductSchema: Schema = new Schema(
    {
        name: { type: String, required: true },
        description: { type: String, required: true },
        price: { type: Number, required: true },
        category: { type: String, required: true },
        images: { type: [String], required: true },
        stock: { type: Number, required: true, default: 0 },
        isPopular: { type: Boolean, default: false },
        canCustomize: { type: Boolean, default: false },
        customizationOptions: { type: [String] },
    },
    { timestamps: true }
);

export default mongoose.models.Product || mongoose.model<IProduct>("Product", ProductSchema);
