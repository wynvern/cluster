import { Switch } from "@nextui-org/react";
import { useTheme } from "next-themes";

export default function Appearance() {
	const { theme, setTheme } = useTheme();

	return (
		<div>
			<h1>General Setting</h1>

			<div className="w-full my-10 flex-col flex gap-y-6">
				<div className="w-full flex justify-between items-center default-border p-6 rounded-large">
					<div>
						<h3>Modo Escuro</h3>
						<p>Habilita o modo escuro no aplicativo.</p>
					</div>
					<div>
						<Switch
							color="success"
							onValueChange={(selected: boolean) =>
								setTheme(selected ? "dark" : "light")
							}
							isSelected={theme === "dark"}
						/>{" "}
					</div>
				</div>
			</div>
		</div>
	);
}
