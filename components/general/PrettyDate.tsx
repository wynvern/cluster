"use client";

function prettyDate(date: Date) {
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
		}); // returns hour and minute
	}
	if (sameYear) {
		return date.toLocaleDateString([], { month: "short", day: "numeric" }); // returns month and day
	}
	return date.toLocaleDateString(); // returns full date
}

export default function ({
	date,
	asString,
}: {
	date: Date;
	asString?: boolean;
}) {
	switch (asString) {
		case true:
			return prettyDate(new Date(date));
		default:
			return (
				<p className="second-foreground text-tiny">
					{prettyDate(new Date(date))}
				</p>
			);
	}
}
