import fetchUser from "@/lib/db/user/user";
import UserProfile from "./UserProfile";
import UserContent from "./UserContent";
import NoPosts from "@/components/card/NoPosts";
import UserHeader from "./UserHeader";
import PageHeader from "@/components/general/PageHeader";

interface UserPageProps {
	params: {
		username: string;
	};
}

export default async function UserPage({
	params: { username },
}: UserPageProps) {
	const userData = await fetchUser({ username });

	function renderInnerContent() {
		if (typeof userData === "string") {
			switch (userData) {
				case "private-profile":
					return (
						<div className="w-full h-full flex items-center justify-center">
							<NoPosts message="O perfil do usuário é privado." />
						</div>
					);
				case "no-match":
					return (
						<div className="w-full h-full flex items-center justify-center">
							<NoPosts message="O usuário não existe" />
						</div>
					);
				default:
					return (
						<div className="w-full h-full flex items-center justify-center">
							<NoPosts message="O usuário não foi encontrado." />
						</div>
					);
			}
		}
		if (typeof userData !== "string") {
			return (
				<>
					<PageHeader
						title={`u/${userData.username}`}
						enableHeightUsage={false}
						showBackButton={true}
					/>
					<UserProfile user={userData} />
					<UserContent user={userData} />
				</>
			);
		}
		if (!userData) {
			return (
				<div className="w-full h-full flex items-center justify-center">
					<NoPosts message="O usuário não foi encontrado." />
				</div>
			);
		}
	}

	return (
		<div className="flex justify-center w-full h-full">
			<div className="side-borders w-full max-w-[1000px] h-full relative">
				{renderInnerContent()}
			</div>
		</div>
	);
}
