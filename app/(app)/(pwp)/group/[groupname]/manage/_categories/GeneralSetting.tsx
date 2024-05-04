import { Switch } from "@nextui-org/react";

export default function GeneralSetting() {
	return (
		<div>
			<h2>Configurações Gerais</h2>
			<p>
				Configurações e gerenciamento de permissões para usuários, entre
				outras configurações do grupo.
			</p>
			<div className="w-full my-10 flex-col flex gap-y-6">
				<div className="w-full flex justify-between items-center default-border p-6 rounded-large">
					<div>
						<h3>Posts por membros</h3>
						<p>
							Quando habilitado, qualquer membro do grupo pode
							realizar posts no grupo.
						</p>
					</div>
					<div>
						<Switch color="success" />
					</div>
				</div>
				<div className="w-full flex justify-between items-center default-border p-6 rounded-large">
					<div>
						<h3>Grupo somente visualização</h3>
						<p>
							Nenhum usuário poderá entrar no grupo, e somente os
							moderadores e dono do grupo presentes no momento em
							que esta opção for habilitada terão acesso.
						</p>
					</div>
					<div className="ml-10">
						<Switch color="success" />
					</div>
				</div>
			</div>
		</div>
	);
}
