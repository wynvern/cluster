export default function prettyDate({ date }: { date: Date }) {
	const now = new Date();
	const sameDay =
		now.getDate() === date.getDate() &&
		now.getMonth() === date.getMonth() &&
		now.getFullYear() === date.getFullYear();
	const sameYear = now.getFullYear() === date.getFullYear();

	if (sameDay) {
		return date.toLocaleTimeString([], {
			hour: "2-digit",
			minute: "2-digit",
		});
	}
	if (sameYear) {
		return date.toLocaleDateString([], { month: "short", day: "numeric" });
	}
	return date.toLocaleDateString();
}
