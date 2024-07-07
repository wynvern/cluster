import type Post from "@/lib/db/post/type";
import { create } from "zustand";

interface StoreState {
	posts: Post[];
	scrollPosition: string;
	setPosts: (posts: Post[]) => void;
	setScrollPosition: (position: string) => void;
}

export const useStore = create<StoreState>((set) => ({
	posts: [],
	scrollPosition: "0",
	setPosts: (posts) => set({ posts }),
	setScrollPosition: (position) => set({ scrollPosition: position }),
}));
