"use client";
import { useEffect, useState } from "react";

import {
  Bell,
  Menu,
} from "lucide-react";
import { useRequestDesk } from "@/store";
import { LogOutComp } from "../Logout";
import { usePathname } from 'next/navigation'

function Header() {
  const pathname = usePathname()

  const [err, setErr] = useState("")
  const { setMobileNav, getUser, user } = useRequestDesk(
    (state) => state
  );

  useEffect(() => {
    async function loadUser() {
      try {
        await getUser()
      } catch (error) {
        setErr("Failed to get some of the user details")
      }
    }

    loadUser()
  }, [getUser])


  const hour = new Date().getHours();

  let greeting;

  if (hour < 12) {
    greeting = "Good morning";
  } else if (hour < 18) {
    greeting = "Good afternoon";
  } else {
    greeting = "Good evening";
  }

  return pathname === "/auth" ? null : (
    <header className="fixed top-0 left-0 right-0 z-20 flex h-20 items-center justify-between border-b border-slate-200/80 bg-white/90 px-5 backdrop-blur md:px-9 text-slate-900">
      <div className="flex items-center gap-3">
        <button
          className="rounded-lg p-2 hover:bg-slate-100 lg:hidden cursor-pointer"
          onClick={setMobileNav}
          aria-label="Toggle menu">
          <Menu />
        </button>

        <div className="lg:pl-64 font-semibold tracking-tight text-sm text-slate-400">

          {err ? <h1>{err}</h1> : (<div>

            <p>
              {new Date().toLocaleDateString("en-US", {
                weekday: "long",
                month: "long",
                day: "numeric",
                year: "numeric",
              })}
            </p>            <h1 id="dashboard" className="capitalize">
              {greeting}, {user?.idExist?.name}
            </h1>
          </div>)}
        </div>
      </div>
      <div className="flex items-center gap-3">
        <button
          className="hidden rounded-lg border border-slate-200 p-2 text-slate-500 hover:bg-slate-50 sm:block cursor-pointer"
          aria-label="Notifications">
          <Bell />
        </button>
        <div className="flex items-center gap-2 rounded-full border border-slate-200 bg-white py-1.5 pl-1.5 pr-3">
          <LogOutComp />
        </div>
      </div>
    </header>
  );
}

export default Header;
