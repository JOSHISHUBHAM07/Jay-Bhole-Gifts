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
    variants?: {
        sku: string;
        attributes: { [key: string]: string }; // e.g., { color: "Red", size: "M" }
        stock: number;
        priceAdjustment?: number;
    }[];
    reviews?: {
        user: mongoose.Schema.Types.ObjectId;
        userName: string;
        rating: number; // 1-5
        comment: string;
        createdAt: Date;
    }[];
    averageRating?: number;
    numReviews?: number;
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
        variants: [
            {
                sku: { type: String, required: true },
                attributes: { type: Map, of: String },
                stock: { type: Number, required: true, default: 0 },
                priceAdjustment: { type: Number, default: 0 }
            }
        ],
        reviews: [
            {
                user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
                userName: { type: String, required: true },
                rating: { type: Number, required: true, min: 1, max: 5 },
                comment: { type: String, required: true },
                createdAt: { type: Date, default: Date.now }
            }
        ],
        averageRating: { type: Number, default: 0 },
        numReviews: { type: Number, default: 0 },
    },
    { timestamps: true }
);

export default mongoose.models.Product || mongoose.model<IProduct>("Product", ProductSchema);
