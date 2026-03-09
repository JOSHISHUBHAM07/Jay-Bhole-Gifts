import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/db";
import Product from "@/models/Product";

const mockProducts = [
    { name: "Personalized Leather Wallet", price: 45.0, rating: 4.8, images: ["https://images.unsplash.com/photo-1627123424574-724758594e93?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60"], category: "accessories", isNew: true, description: "Premium leather wallet", stock: 50 },
    { name: "Luxury Spa Gift Set", price: 85.0, rating: 4.9, images: ["https://images.unsplash.com/photo-1544161515-4ab6ce6db874?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60"], category: "wellness", description: "Relaxing spa items", stock: 20 },
    { name: "Custom Engraved Watch", price: 120.0, rating: 4.7, images: ["https://images.unsplash.com/photo-1524592094714-0f0654e20314?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60"], category: "accessories", description: "Minimalist engraved watch", stock: 15 },
    { name: "Artisan Chocolate Box", price: 35.0, rating: 4.6, images: ["https://images.unsplash.com/photo-1549007994-cb92caebd54b?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60"], category: "food", isNew: true, description: "Handmade choco", stock: 100 },
];

export async function GET() {
    try {
        await connectToDatabase();
        const count = await Product.countDocuments();
        if (count === 0) {
            await Product.insertMany(mockProducts);
            return NextResponse.json({ message: "Database seeded successfully" });
        }
        return NextResponse.json({ message: "Database already has products" });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
