"use client";

import { useRequestDesk } from "@/store";
import { Role } from "@/types";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
// import { jwtDecode } from "jwt-decode";
// import dayjs from "dayjs";

function AuthPage() {

  const route = useRouter()
  const { authFtn, getUser } =
    useRequestDesk((state) => state);
  const [authMode, setAuthMode] = useState<"login" | "register">('login')
  const [form, setForm] = useState({ email: '', password: '', role: '' as Role, name: "" })
  const [err, setErr] = useState("");


  function authModeChange(mode: "login" | "register") {
    setAuthMode(mode);
  }

  async function authBtn(event: React.ChangeEvent<HTMLFormElement>) {
    event.preventDefault()
    const emailTrim = form.email.trim().toLowerCase()
    const names = form.name.split(" ")

    try {
      if (authMode === "login") {
        const isAccessToken = await authFtn({ ...form, email: emailTrim, name: `${names[0]} ${names[1]}` })

        setForm({ email: '', password: '', role: '' as Role, name: "" })

        await getUser()

        if (isAccessToken) {
          route.push("/")
        } else {
          setAuthMode("register")
        }

        return;
      }
      await authFtn({ ...form, email: emailTrim })
      setForm({ email: '', password: '', role: '' as Role, name: "" })
    } catch (error) {
      setErr("Failed to authenticate")

    } finally {
      setAuthMode("login")

    }
  }


  // if (accessToken) {
  //   const user = jwtDecode(accessToken);

  //   const expireNum = user?.exp;

  //   const isExpired =
  //     dayjs.unix(Number(expireNum)).diff(dayjs()) < 1;

  //   console.log(isExpired, "isExpired");
  //   console.log(accessToken, "from component");
  // }



  return (
    <main className="flex min-h-screen items-center justify-center bg-[#f8fafc] px-5 py-10 text-slate-900">
      <div className="grid w-full max-w-4xl overflow-hidden rounded-3xl bg-white shadow-2xl md:grid-cols-[0.85fr_1.15fr]">
        <div className="hidden flex-col justify-between bg-indigo-600 p-10 text-white md:flex">
          <div>
            <div className="mb-8 flex items-center gap-3">
              <div className="flex size-10 items-center justify-center rounded-xl bg-white/15 ">
                <Image
                  src="/images.png"
                  width={500}
                  height={500}
                  alt="Picture of the author"
                  className="rounded-full" />              </div>

              <span className="font-semibold tracking-tight">
                Request Desk
              </span>
            </div>

            <h1 className="max-w-xs text-4xl font-semibold leading-tight">
              A calmer way to manage requests.
            </h1>

            <p className="mt-5 max-w-sm text-sm leading-6 text-indigo-100">
              A simple role-based workspace for teams that want every request
              to have a clear next step.
            </p>
          </div>

          <p className="text-xs text-indigo-200">
            A full stack application(MERN)
          </p>
        </div>

        <div className="p-6 sm:p-10">
          <div className="mb-8">
            <p className="text-sm font-semibold text-indigo-600">
              Welcome to Request Desk
            </p>

            <h2 className="mt-2 text-3xl font-semibold tracking-tight">
              {authMode === "register"
                ? "Create your account"
                : "Sign in to continue"}
            </h2>

            <p className="mt-2 text-sm text-slate-500">
              {authMode === "register"
                ? "Choose the workspace role you want to preview."
                : "Use your saved local account to open the workspace."}
            </p>
          </div>

          <form onSubmit={authBtn} className="flex flex-col gap-5">
            {authMode === "register" && (<label className="text-sm font-medium">
              Name

              <input
                type="text"
                value={form.name}
                onChange={(event) =>
                  setForm({
                    ...form,
                    name: event.target.value,
                  })
                }
                className="mt-2 w-full rounded-xl border border-slate-200 px-3.5 py-3 outline-none ring-indigo-500 focus:ring-2 cursor-pointer"
                placeholder="John Doe"
                required={authMode === "register" ? true : false}
              />
            </label>)}

            <label className="text-sm font-medium">
              Email address

              <input
                type="email"
                value={form.email}
                onChange={(event) =>
                  setForm({
                    ...form,
                    email: event.target.value,
                  })
                }
                className="mt-2 w-full rounded-xl border border-slate-200 px-3.5 py-3 outline-none ring-indigo-500 focus:ring-2 cursor-pointer"
                placeholder="you@example.com"
                required
              />
            </label>

            <label className="text-sm font-medium">
              Password

              <input
                type="password"
                value={form.password}
                onChange={(event) =>
                  setForm({
                    ...form,
                    password: event.target.value,
                  })
                }
                className="mt-2 w-full rounded-xl border border-slate-200 px-3.5 py-3 outline-none ring-indigo-500 focus:ring-2 cursor-pointer"
                placeholder="At least 6 characters"
                minLength={6}
                required
              />
            </label>

            {authMode === "register" && (
              <label className="text-sm font-medium">
                Role

                <select
                  value={form.role}
                  onChange={(event) =>
                    setForm({
                      ...form,
                      role: event.target.value as Role,
                    })
                  }
                  className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-3.5 py-3 outline-none ring-indigo-500 focus:ring-2"
                >
                  <option value="">Select Role</option>
                  <option value="user">Normal user</option>
                  <option value="admin">Administrator</option>
                </select>
              </label>
            )}

            {err && (
              <p
                role="alert"
                className="rounded-xl bg-red-50 px-3.5 py-3 text-sm text-red-700"
              >
                {err}
              </p>
            )}

            <button
              type="submit"
              className="rounded-xl bg-indigo-600 px-4 py-3 font-semibold text-white transition hover:bg-indigo-700 cursor-pointer"
            >
              {authMode === "register" ? "Create account" : "Sign in"}
            </button>
          </form>

          <p className="mt-7 text-center text-sm text-slate-500">
            {authMode === "register"
              ? "Already have an account?"
              : "New to Request Desk?"}{" "}
            <button
              type="button"
              onClick={() => {
                authModeChange(authMode === "login" ? "register" : "login");
                setErr("");
              }
              }
              className="font-semibold text-indigo-600 hover:text-indigo-700 cursor-pointer"
            >
              {authMode === "register" ? "Sign in" : "Create an account"}
            </button>
          </p>
        </div>
      </div>
    </main>
  );
}

export default AuthPage;
