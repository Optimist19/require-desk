"use client";

import { useEffect, useState } from "react";
import { useRequestDesk } from "@/store";
import { useRouter } from "next/navigation";


export default function AuthProvider({
	children,
}: {
	children: React.ReactNode;
}) {
	const { refreshAccessToken } = useRequestDesk((state) => state);

	const [isLoading, setIsLoading] = useState(true);
	const router = useRouter();



	useEffect(() => {
		async function loadRefreshAccessToken() {
			const token = await refreshAccessToken()
			if (!token) {
				router.replace("/auth");
			}

			setIsLoading(false);

		}
		loadRefreshAccessToken()

	}, [refreshAccessToken, router]);

	if (isLoading) {

		return <div>Loading...</div>;
	}

	return children;
}