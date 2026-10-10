"use client";
import NewRequest from "./shared/NewRequest";
import RequestForm from "./RequestForm";
import { useRequestDesk } from "@/store";

function UserDashboard() {
  const { requestFormModal } =
    useRequestDesk((state) => state);
  return (
    <main className="min-h-screen bg-[#f8fafc] text-slate-900">
      <div className="lg:pl-64">
        <NewRequest />
      </div>

      {requestFormModal && <RequestForm />}
    </main>
  );
}

export default UserDashboard;
