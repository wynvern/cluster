import fetchUser from "@/util/user/user";
import UserPage from "./UserPage";

export default async function Test() {
	const userData = await fetchUser({ id: "1" });

	return (
		<div>
			<UserPage user={userData} />
		</div>
	);
}
