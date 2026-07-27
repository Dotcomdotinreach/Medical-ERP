import { Clock, HeartPulse, Activity, Droplets, Wind, ArrowRight } from "lucide-react";
import { PageHeader, SectionCard, Avatar } from "../his/ui";
import { Button } from "../ui/button";
import { TriagePreview } from "./docUi";
import { EMERGENCY_REFERRALS, TRIAGE_COLOR, type ClinicalTriage } from "./docData";

const ORDER: ClinicalTriage[] = ["Red", "Orange", "Yellow", "Green"];
const LABELS: Record<ClinicalTriage, string> = {
  Red: "Immediate", Orange: "Very urgent", Yellow: "Urgent", Green: "Standard",
};

export function DoctorEmergencyQueue({ openConsult }: { openConsult: (id: string) => void }) {
  const sorted = [...EMERGENCY_REFERRALS].sort((a, b) => ORDER.indexOf(a.triage) - ORDER.indexOf(b.triage));

  return (
    <div className="space-y-6">
      <PageHeader title="Emergency Queue" subtitle="Patients referred to Internal Medicine · sorted by triage priority" />

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {ORDER.map((t) => {
          const count = EMERGENCY_REFERRALS.filter((e) => e.triage === t).length;
          const c = TRIAGE_COLOR[t];
          return (
            <div key={t} className="rounded-xl border p-3" style={{ borderColor: `${c}40`, background: `${c}0d` }}>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium" style={{ color: c }}>{t}</span>
                <span className="font-bold" style={{ color: c, fontSize: 18 }}>{count}</span>
              </div>
              <div className="text-xs text-text-secondary">{LABELS[t]}</div>
            </div>
          );
        })}
      </div>

      <SectionCard title={`${sorted.length} patients waiting`}>
        <div className="space-y-3">
          {sorted.map((e) => (
            <div key={e.id} className="flex flex-col gap-3 rounded-xl border border-border p-4 lg:flex-row lg:items-center">
              <div className="w-1.5 self-stretch rounded-full" style={{ background: TRIAGE_COLOR[e.triage] }} />
              <Avatar name={e.name} tone="danger" size={44} />
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="font-medium text-text-primary">{e.name}</span>
                  <span className="text-xs text-text-secondary">{e.age}y · {e.gender} · {e.uhid}</span>
                  <TriagePreview triage={e.triage} />
                </div>
                <div className="mt-1 truncate text-sm text-text-secondary">{e.complaint} · {e.id}</div>
              </div>
              {/* Vitals preview */}
              <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-text-secondary">
                <span className="inline-flex items-center gap-1"><HeartPulse className="size-4 text-danger" />{e.vitals.hr}</span>
                <span className="inline-flex items-center gap-1"><Activity className="size-4 text-primary" />{e.vitals.bp}</span>
                <span className="inline-flex items-center gap-1"><Wind className="size-4 text-info" />{e.vitals.spo2}%</span>
                <span className="inline-flex items-center gap-1"><Droplets className="size-4 text-warning" />{e.vitals.temp}°</span>
                <span className="inline-flex items-center gap-1"><Clock className="size-4" />{e.waiting}</span>
              </div>
              <Button size="sm" onClick={() => openConsult(e.id)}>Accept Patient<ArrowRight className="size-3.5" /></Button>
            </div>
          ))}
        </div>
      </SectionCard>
    </div>
  );
}
