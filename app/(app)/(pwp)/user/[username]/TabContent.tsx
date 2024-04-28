import { Tab, Tabs } from "@nextui-org/react";

export default function TabContent() {
	return (
		<div className="w-full flex items-center flex-col mt-10">
			<Tabs
				classNames={{ tabList: "mb-2" }}
				className="w-full bottom-border flex items-center justify-center"
				variant="underlined"
			>
				<Tab title={<h2 className="p-2">Posts</h2>}>Tab 1</Tab>
				<Tab title={<h2 className="p-2">Salvos</h2>}>Tab 1</Tab>
				<Tab title={<h2 className="p-2">Grupos</h2>}>Tab 1</Tab>
			</Tabs>
		</div>
	);
}
