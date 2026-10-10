"use client";


import {
  LayoutDashboard,
  Settings,
  Sparkles,
  Users,
  X
} from "lucide-react";
import { useRequestDesk } from "@/store";
import Link from "next/link";
import { usePathname } from 'next/navigation'
import Image from "next/image";



function Aside() {
  const {

    user,
    setMobileNav,
    mobileNav
  } = useRequestDesk((state) => state);
  const pathname = usePathname()

  const role = user?.idExist?.role

  return (
    pathname === "/auth" ? null : (<aside
      className={`fixed inset-y-0 left-0 z-30 w-64 border-r border-slate-200 bg-white px-5 py-6 transition-transform lg:translate-x-0 ${mobileNav ? "translate-x-0" : "-translate-x-full"}`}>
      <div className="flex items-center gap-3 px-2">
        <div className="flex size-10 items-center justify-center rounded-xl  text-white shadow-sm">
          <Image
            src="/images.png"
            width={500}
            height={500}
            alt="Picture of the author"
            className="rounded-full" />
        </div>
        <div>
          <p className="text-xs text-slate-400">Request Desk Hub</p>
        </div>
        <button
          className="absolute top-3 right-0 p-2 hover:bg-slate-100 lg:hidden cursor-pointer"
          onClick={setMobileNav}
          aria-label="Close menu">
          <X className="text-indigo-600" />
        </button>
      </div>
      <nav
        className="mt-10 flex flex-col gap-1"
        aria-label="Primary navigation">
        <p className="mb-2 px-3 text-[10px] font-bold uppercase tracking-[0.18em] text-slate-400">
          Workspace
        </p>
        <Link
          className="flex items-center gap-3 rounded-xl bg-indigo-50 px-3 py-2.5 text-sm font-medium text-indigo-700"
          href="/">
          <LayoutDashboard /> Dashboard
        </Link>

        {role === "admin" && (
          <>
            <p className="mb-2 mt-8 px-3 text-[10px] font-bold uppercase tracking-[0.18em] text-slate-400">
              Manage
            </p>
            <Link href="/users" className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-slate-500 hover:bg-slate-50">

              <Users /> People
            </Link>
            <a
              className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-slate-500 hover:bg-slate-50"
              href="#settings">
              <Settings /> Settings
            </a>
          </>
        )}
      </nav>
      
    </aside>)
  );
}

export default Aside;
