import GeneralSetting from "./_categories/GeneralSetting";
import Members from "./_categories/Members";

interface SettingCategoryProps {
	className?: string;
	activeTab: string;
	groupname: string;
}

export default function SettingCategory({
	className,
	activeTab,
	groupname,
}: SettingCategoryProps) {
	return (
		<div className={className}>
			{activeTab === "Geral" ? <GeneralSetting /> : null}
			{activeTab === "Membros" ? <Members groupname={groupname} /> : null}
		</div>
	);
}
