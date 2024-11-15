import { create } from "zustand";

interface UserRoleState {
	userRoles: { [groupname: string]: string };
	setUserRole: (groupname: string, role: string) => void;
	getUserRole: (groupname: string) => string | undefined;
}

export const useUserRoleStore = create<UserRoleState>((set, get) => ({
	userRoles: {},
	setUserRole: (groupname, role) => {
		set((state) => ({
			...state,
			userRoles: {
				...state.userRoles,
				[groupname]: role,
			},
		}));
	},
	getUserRole: (groupname) => {
		const role = get().userRoles[groupname];

		return role;
	},
}));
