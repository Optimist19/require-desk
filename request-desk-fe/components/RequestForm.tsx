import { X } from "lucide-react";
import React, { useState } from "react";
import { useRequestDesk } from "@/store";

function RequestForm() {
  const { requestFormModalFtn, submitRequest, user } = useRequestDesk(
    (state) => state
  );

  const [isLoading, setIsLoading] = useState(false);
  const [err, setErr] = useState("");
  const [form, setForm] = useState({
    title: "",
    category: "Facilities",
    priority: "Medium"
  });

  function RequestFormHandle(event: React.ChangeEvent<HTMLFormElement>) {
    event.preventDefault();

    setIsLoading(true);
    const { title,
      category,
      priority } = form



    if (title === "" || category === "" || priority === "") {
      setErr("All inputs are required")
    }
    const requestData = {
      title: title.trim(),
      category: category,
      submittedBy: user?.idExist.role,
      status: "Open",
      priority: priority as "Low" | "Medium" | "High",
    };
    try {

      const message = submitRequest(requestData);
      if (!message) {
        throw new Error("The new Request failed, and coming from the if block")
      }

      setForm({ title: "", category: "Facilities", priority: "Medium" });
      setIsLoading(false);
      window.location.reload();
      requestFormModalFtn(false);
    } catch (error) {
      setErr("Failed to make new request")
    }
  }

  return (
    <div
      className="fixed inset-0 z-40 flex items-center justify-center bg-slate-950/30 p-5"
      role="dialog"
      aria-modal="true"
      aria-labelledby="dialog-title">
      <form
        onSubmit={RequestFormHandle}
        className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl">
        <div className="flex items-start justify-between">
          <div>
            <h2 id="dialog-title" className="text-xl font-semibold">
              Create a request
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              It will be saved locally in this browser.
            </p>
          </div>
          <button
            type="button"
            onClick={() => requestFormModalFtn(false)}
            className="rounded-lg p-2 text-slate-400 hover:bg-slate-100 cursor-pointer"
            aria-label="Close">
            <X />
          </button>
        </div>
        <div className="mt-6 flex flex-col gap-4">
          <label className="text-sm font-medium">
            What do you need?
            <input
              autoFocus
              value={form.title}
              onChange={(event) =>
                setForm({ ...form, title: event.target.value })
              }
              className="mt-2 w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none ring-indigo-500 focus:ring-2"
              placeholder="e.g. Replace the lobby light"
              required
            />
          </label>
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="text-sm font-medium">
              Category
              <select
                value={form.category}
                onChange={(event) =>
                  setForm({ ...form, category: event.target.value })
                }
                className="mt-2 w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm">
                <option>Facilities</option>
                <option>Access</option>
                <option>IT & equipment</option>
                <option>Workplace</option>
              </select>
            </label>
            <label className="text-sm font-medium">
              Priority
              <select
                value={form.priority}
                onChange={(event) =>
                  setForm({
                    ...form,
                    priority: event.target.value
                  })
                }
                className="mt-2 w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm">
                <option>Low</option>
                <option>Medium</option>
                <option>High</option>
              </select>
            </label>
          </div>
        </div>
        <div className="mt-7 flex justify-end gap-3">
          <button
            type="button"
            onClick={() => requestFormModalFtn(false)}
            className="rounded-lg px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100 cursor-pointer">
            Cancel
          </button>
          <button
            type="submit"
            disabled={isLoading}
            className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-700 disabled:opacity-50 cursor-pointer">
            {isLoading ? "Saving..." : "Make request"}
          </button>
        </div>
        {err && <p className="text-right pt-1 text-[10px] text-red-500">{err}</p>
        }      </form>
    </div>
  );
}

export default RequestForm;
