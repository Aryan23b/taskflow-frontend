interface StatCardProps {
  label: string;
  value: number;
  description: string;
  icon: string;
  accent?: string;
}

export default function StatCard({
  label,
  value,
  description,
  icon,
  accent = "from-indigo-500/20 to-indigo-500/5",
}: StatCardProps) {
  return (
    <div className="group rounded-3xl border border-white/10 bg-white/[0.04] p-5 transition duration-200 hover:-translate-y-0.5 hover:bg-white/[0.06]">

      <div className="flex items-start justify-between">

        <div>
          <p className="text-sm text-slate-400">
            {label}
          </p>

          <p className="mt-3 text-3xl font-bold tracking-tight text-white">
            {value}
          </p>

          <p className="mt-2 text-xs text-slate-500">
            {description}
          </p>
        </div>

        <div
          className={`flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br ${accent} text-lg`}
        >
          {icon}
        </div>

      </div>
    </div>
  );
}