import { fetchUserReports } from "@/lib/db/user/user";
import UserReport from "./UserReport";

export default async function Page() {
	const userReports = await fetchUserReports();

	return (
		<div>
			<UserReport data={userReports} />
		</div>
	);
}
