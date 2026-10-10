import { RequestList } from "@/store";
import { Status } from "@/types";
import { FileText } from "lucide-react";

const statusStyles: Record<Status, string> = {
  Open: "bg-amber-50 text-amber-700 ring-amber-200",
  "In progress": "bg-blue-50 text-blue-700 ring-blue-200",
  Resolved: "bg-emerald-50 text-emerald-700 ring-emerald-200"
};

function RequestRow({
  request,
  admin,
  onStatus,
}: {
  request: RequestList;
  admin?: boolean;
  onStatus: () => void;

}) {
  return (
    <div className="flex flex-col gap-4 p-5 transition hover:bg-slate-50/70 md:flex-row md:items-center cursor-pointer">
      <div className="flex min-w-0 flex-1 items-start gap-4">
        <div className="mt-0.5 flex size-10 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-slate-500">
          <FileText />
        </div>
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <h4 className="truncate text-sm font-semibold text-slate-800 capitalize">
              {request.title}
            </h4>
            <span
              className={`rounded-full px-2 py-0.5 text-[11px] font-semibold ring-1 ring-inset ${statusStyles[request.status]}`}>
              {request.status}
            </span>
          </div>
          <p className="mt-1 text-xs text-slate-500">
            {request.category} <span className="mx-1 text-slate-300">•</span>{" "}
            {request.submittedBy === "admin"
              ? request.name.split(" ")[0]
              : request.name} <span className="mx-1 text-slate-300">•</span>{" "}
            {new Date(request.createdAt).toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
              year: "numeric",
            })}
          </p>
        </div>
      </div>
      <div className="flex items-center gap-3 pl-14 md:pl-0">
        <span className="text-xs font-medium text-slate-400">
          {request.priority} priority
        </span>
        {admin && (
          <button
            onClick={onStatus}
            className="rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-600 hover:bg-white cursor-pointer"
            aria-label={`Update status for ${request.title}`}>
            Update
          </button>
        )}
      </div>
    </div>
  );
}

export default RequestRow;
