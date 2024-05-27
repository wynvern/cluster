import { create } from "zustand";

type messageAttr = {
	replyToMessageId: string | null;
	setReplyToMessageId: (id: string) => void;
};

export const useMessageAttr = create<messageAttr>((set) => ({
	replyToMessageId: null,
	setReplyToMessageId: (id: string) => set({ replyToMessageId: id }),
}));
