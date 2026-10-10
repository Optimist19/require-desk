"use client";

import { useEffect, useState } from "react";
import { useRequestDesk } from "@/store";

export default function AuthProvider({
	children,
}: {
	children: React.ReactNode;
}) {
	const { refreshAccessToken } = useRequestDesk((state) => state);

	const [isLoading, setIsLoading] = useState(false);


	useEffect(() => {
		async function loadRefreshAccessToken() {
			const token = await refreshAccessToken()
			if (token) {
				setIsLoading(true)

				setIsLoading(false)
			}

		}
		loadRefreshAccessToken()

	}, [refreshAccessToken]);

	if (isLoading) {

		return <div>Loading...</div>;
	}

	return children;
}