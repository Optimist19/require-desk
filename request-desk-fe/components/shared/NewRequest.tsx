"use client";

import { useEffect, useMemo, useState } from "react";

import {
  CheckCircle2,
  ClipboardList,
  Clock3,
  FileText,
  Plus,
  Search,
  X
} from "lucide-react";
import { useRequestDesk } from "@/store";
import Stat from "../Stat";
import RequestRow from "../RequestRow";

function NewRequest() {
  const { requestFormModalFtn, user, getRequests, listOfRequest, updateRequest } = useRequestDesk(
    (state) => state
  );
  const [query, setQuery] = useState("");

  const [isLoading, setIsLoading] = useState(false)


  const role = user?.idExist?.role ?? "";
  const id = user?.idExist?._id ?? "";

  useEffect(() => {
    void getRequests();
  }, [getRequests])

  const stats = {
    total: listOfRequest.length ?? 0,
    open: listOfRequest.filter((r) => r.status === "Open").length || 0,
    progress: listOfRequest.filter((r) => r.status === "In progress").length || 0,
    resolved: listOfRequest.filter((r) => r.status === "Resolved").length || 0
  };

  const filteredRequests = useMemo(
    () =>
      listOfRequest.filter((request) => request.title.toLowerCase().includes(query.toLowerCase())
      ),
    [listOfRequest, query]
  );

  const userFilteredRequestOnly = useMemo(
    () =>
      listOfRequest.filter((request) => request.userId.toLowerCase().includes(id)),

    [listOfRequest, id]
  );


  // const visibleRequests = useMemo(
  //   () =>
  //     role === "user"
  //       ? listOfRequest.filter((request) => request.submittedBy === "admin")
  //       : listOfRequest,
  //   [listOfRequest, role]
  // );
  async function updateStatus(id: string) {
    const request = listOfRequest.find((item) => item._id === id);
    if (!request) return;

    const order = ["Open", "In progress", "Resolved"] as const;
    const nextStatus = order[(order.indexOf(request.status) + 1) % order.length];
    await updateRequest(id, nextStatus);
  }

  return (
    <section
      className="mx-auto max-w-7xl px-5 pt-15 pb-8 md:px-9"
    //   onClick={() => setMobileNav(!mobileNav)}
    >
      <div className="mb-8 flex flex-col justify-between gap-4 md:flex-row md:items-end">
        <div>
          <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-indigo-50 px-3 py-1 text-xs font-semibold text-indigo-700">
            <span className="size-1.5 rounded-full bg-indigo-600" />
            {role === "admin" ? "Admin workspace" : "Personal workspace"}
          </div>
          <h2 className="text-3xl font-semibold tracking-tight text-slate-950">
            {role === "admin"
              ? "Keep your team moving."
              : "What can we help with?"}
          </h2>
          <p className="mt-2 max-w-xl text-sm text-slate-500">
            {role === "admin"
              ? "Review requests, assign follow-ups, and keep a pulse on your workplace."
              : "Submit a request and follow its progress from one simple place."}
          </p>
        </div>
        <button
          onClick={() => requestFormModalFtn(true)}
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm shadow-indigo-200 transition- hover:bg-indigo-700 cursor-pointer">
          <Plus /> New request
        </button>
      </div>

      {role === "admin" && (
        <div className="mb-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <Stat
            label="Total requests"
            value={stats.total}
            icon={<FileText />}
            tone="indigo"
          />
          <Stat
            label="Awaiting review"
            value={stats.open}
            icon={<Clock3 />}
            tone="amber"
          />
          <Stat
            label="In progress"
            value={stats.progress}
            icon={<ClipboardList />}
            tone="blue"
          />
          <Stat
            label="Resolved this month"
            value={stats.resolved}
            icon={<CheckCircle2 />}
            tone="emerald"
          />
        </div>
      )}

      <div
        // id="requests"
        className="rounded-2xl border border-slate-200 bg-white shadow-sm h-90 overflow-y-scroll scrollbar-thumb-indigo-600">
        <div className="flex flex-col gap-4 border-b border-slate-100 p-5 md:flex-row md:items-center md:justify-between">
          <div>
            <h3 className="font-semibold">
              {role === "admin" ? "All requests" : "Your requests"}
            </h3>
            <p className="mt-1 text-sm text-slate-500">
              {role === "admin"
                ? "The latest activity from your workspace."
                : "Everything you have submitted so far."}
            </p>
          </div>

          <label className="relative block sm:w-64" htmlFor="cancel">
            <span className="sr-only">Search users</span>

            <Search
              aria-hidden="true"
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
            />

            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search users"
              className="h-9 w-full rounded-lg border border-slate-200 bg-slate-50 pl-9 pr-3 text-sm outline-none transition focus:border-slate-400 focus:ring-2 focus:ring-slate-200 cursor-pointer"
            />
            <X onClick={() => setQuery("")} id="cancel" className="absolute right-1  top-1.5 bottom-0 text-sm text-slate-200 cursor-pointer " />

          </label>
        </div>



        {role === "user" ? (<div className="divide-y divide-slate-100">
          {userFilteredRequestOnly.length === 0 ? (
            <div className="p-10 text-center text-sm text-slate-500">
              No data
            </div>
          ) : (userFilteredRequestOnly.map((request) => (
            <RequestRow
              key={request._id}
              request={request}
              onStatus={() => updateStatus(request._id)}
            />
          )))}
        </div>) : null}

        {role === "admin" ? (<div className="divide-y divide-slate-100">
          {filteredRequests.length === 0 ? (
            <div className="p-10 text-center text-sm text-slate-500">
              No data
            </div>
          ) : (
            filteredRequests.map((request) => (
              <RequestRow
                key={request._id}
                request={request}
                admin={role === "admin"}
                onStatus={() => updateStatus(request._id)}
              />
            ))
          )}
        </div>) : null}


      </div>

      {!isLoading && filteredRequests.length === 0 && (
        <div className="px-5 py-12 text-center text-sm text-slate-500">
          No data
        </div>
      )}
      
    </section>
  );
}

export default NewRequest;
