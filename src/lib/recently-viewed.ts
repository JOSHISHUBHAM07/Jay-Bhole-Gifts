"use client";

const STORAGE_KEY = 'aura_recently_viewed';
const MAX_ITEMS = 10;

export function trackProductView(productId: string) {
    if (typeof window === 'undefined') return;

    try {
        const stored = localStorage.getItem(STORAGE_KEY);
        let ids: string[] = stored ? JSON.parse(stored) : [];

        // Remove if already exists to move it to the front
        ids = ids.filter(id => id !== productId);
        
        // Add to the front
        ids.unshift(productId);

        // Keep only top 10
        ids = ids.slice(0, MAX_ITEMS);

        localStorage.setItem(STORAGE_KEY, JSON.stringify(ids));
    } catch (e) {
        console.error("Failed to track product view", e);
    }
}

export function getRecentlyViewedIds(): string[] {
    if (typeof window === 'undefined') return [];
    try {
        const stored = localStorage.getItem(STORAGE_KEY);
        return stored ? JSON.parse(stored) : [];
    } catch (e) {
        return [];
    }
}
