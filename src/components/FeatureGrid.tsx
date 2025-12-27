import { ShieldCheck, Route, Gauge, Search, WalletCards, Trophy } from "lucide-react";

const features = [
  { icon: Route, title: "User journey & funnel", text: "Where visitors hesitate or drop off." },
  { icon: ShieldCheck, title: "Trust & credibility", text: "Proof and reassurance at decision moments." },
  { icon: WalletCards, title: "Checkout / lead flow", text: "Friction points in forms and payments." },
  { icon: Search, title: "Traffic intent match", text: "Expectations vs page reality (GA/GSC if available)." },
  { icon: Gauge, title: "Speed & UX basics", text: "Obvious UX blockers that silently kill conversions." },
  { icon: Trophy, title: "Competitor snapshot", text: "What competitors do better and what to copy fast." },
];

export function FeatureGrid() {
  return (
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
      {features.map((f) => (
        <div key={f.title} className="rounded-2xl border p-5">
          <div className="flex items-center gap-3">
            <span className="inline-flex h-10 w-10 items-center justify-center rounded-2xl border bg-white">
              <f.icon size={18} />
            </span>
            <div className="font-semibold">{f.title}</div>
          </div>
          <div className="text-gray-700 mt-2 text-sm">{f.text}</div>
        </div>
      ))}
    </div>
  );
}
