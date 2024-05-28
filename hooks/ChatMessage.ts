import { create } from "zustand";

type messageAttr = {
	replyToMessage: messageInfo | null;
	setReplyToMessageContent: (data: messageInfo | null) => void;
};

type messageInfo = {
	id: string;
	content: string;
	authorUsername: string;
};

export const useMessageAttr = create<messageAttr>((set) => ({
	replyToMessage: null,
	setReplyToMessageContent: (data: messageInfo | null) =>
		set({ replyToMessage: data }),
}));
