"use client"
import {
	NavigationMenu,
	NavigationMenuContent,
	NavigationMenuItem,
	NavigationMenuLink,
	NavigationMenuList,
	NavigationMenuTrigger,
} from "@/components/ui/navigation-menu"
import { useRequestDesk } from "@/store";
import { useState } from "react";
import PopUp from "./PopUp";
import { useRouter } from "next/navigation";


export function LogOutComp() {
	const [notice, setNotice] = useState("");

	const { user, logOut } =
		useRequestDesk((state) => state);
	const route = useRouter()

	function logOutFtn() {
		logOut()
		setNotice(`${user?.idExist.name} logging out, bye!.`);
		route.push("/auth")

		window.setTimeout(() => {
			setNotice("");
		}, 3500);
	}
	return (
		<div>
			<NavigationMenu>
				<NavigationMenuList>
					<NavigationMenuItem>
						<NavigationMenuTrigger
							className="text-sm text-slate-400 cursor-pointer">
							Profile</NavigationMenuTrigger>
						<NavigationMenuContent className=" bg-indigo-600 rounded-full">
							<div className="inline-flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm shadow-indigo-200 transition- hover:bg-indigo-700">

								<NavigationMenuLink className="cursor-pointer" onClick={logOutFtn}>Logout</NavigationMenuLink>
							</div>
						</NavigationMenuContent>
					</NavigationMenuItem>
				</NavigationMenuList>
			</NavigationMenu>
			{notice && (
				<PopUp notice={notice} />
			)}
		</div>
	)
}