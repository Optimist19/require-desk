function Stat({
  label,
  value,
  icon,
  tone
}: {
  label: string;
  value: number;
  icon: React.ReactNode;
  tone: string;
}) {
  const toneClasses: Record<string, string> = {
    indigo: "bg-indigo-50 text-indigo-600",
    amber: "bg-amber-50 text-amber-600",
    blue: "bg-blue-50 text-blue-600",
    emerald: "bg-emerald-50 text-emerald-600"
  };
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div
        className={`mb-5 flex size-9 items-center justify-center rounded-lg ${toneClasses[tone]}`}>
        {icon}
      </div>
      <p className="text-2xl font-semibold tracking-tight">{value}</p>
      <p className="mt-1 text-sm text-slate-500">{label}</p>
    </div>
  );
}

export default Stat;