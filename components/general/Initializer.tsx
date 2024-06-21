"use client";

import React, { useEffect } from "react";
import { useTheme } from "next-themes";
import { fetchUserSettings } from "@/lib/db/user/user";

export default function Initializer() {
	const { setTheme } = useTheme();

	// TODO: Auto pick the theme from the settings and set it and possibly use local storage

	return null; // Assuming this component does not render anything
}
