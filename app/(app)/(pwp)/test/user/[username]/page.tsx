import fetchUser from "@/lib/db/user/user";
import UserProfile from "./UserProfile";
import UserContent from "./UserContent";
import NoPosts from "@/components/card/NoPosts";
import UserHeader from "./UserHeader";

interface UserPageProps {
	params: {
		username: string;
	};
}

export default async function UserPage({
	params: { username },
}: UserPageProps) {
	const userData = await fetchUser({ username });

	return (
		<div className="flex justify-center w-full h-full">
			<div className="side-borders w-full max-w-[1000px] h-full relative">
				<UserHeader user={userData} />
				{userData ? (
					<>
						<UserProfile user={userData} />
						<UserContent user={userData} />
					</>
				) : (
					<div className="w-full h-full flex items-center justify-center">
						<NoPosts message="Usuário não encontrado." />
					</div>
				)}
			</div>
		</div>
	);
}
