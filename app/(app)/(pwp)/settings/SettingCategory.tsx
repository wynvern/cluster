import Appearance from "./_categories/Appearance";
import GeneralSetting from "./_categories/GeneralSetting";

interface SettingCategoryProps {
	className?: string;
	activeTab: string;
}

export default function SettingCategory({
	className,
	activeTab,
}: SettingCategoryProps) {
	return (
		<div className={className}>
			{activeTab === "Geral" ? <GeneralSetting /> : null}
			{activeTab === "Aparência" ? <Appearance /> : null}
		</div>
	);
}
