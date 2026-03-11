import mongoose, { Schema, Document } from "mongoose";

export interface IUser extends Document {
    name: string;
    email: string;
    password?: string;
    phone?: string;
    role: "user" | "admin";
    wishlist?: mongoose.Types.ObjectId[];
    addresses?: {
        name: string;
        street: string;
        city: string;
        zip: string;
        isDefault: boolean;
    }[];
    createdAt: Date;
    updatedAt: Date;
}

const UserSchema: Schema = new Schema(
    {
        name: { type: String, required: true },
        email: { type: String, required: true, unique: true },
        password: { type: String }, // Optional for OAuth
        phone: { type: String },
        role: { type: String, enum: ["user", "admin"], default: "user" },
        wishlist: [{ type: mongoose.Schema.Types.ObjectId, ref: "Product" }],
        addresses: [
            {
                name: { type: String, required: true },
                street: { type: String, required: true },
                city: { type: String, required: true },
                zip: { type: String, required: true },
                isDefault: { type: Boolean, default: false }
            }
        ]
    },
    { timestamps: true }
);

export default mongoose.models.User || mongoose.model<IUser>("User", UserSchema);
