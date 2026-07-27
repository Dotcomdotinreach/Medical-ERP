import { useMemo, useState } from "react";
import { ArrowLeft, ArrowRight, Check } from "lucide-react";
import { toast } from "sonner";
import { StatusBadge, Avatar } from "../his/ui";
import { Button } from "../ui/button";
import { WorkflowRail, type WorkflowStep } from "./docUi";
import { ACTIVE_PATIENT } from "./docData";
import {
  INITIAL_ENCOUNTER, type EncounterState,
  SummaryStep, EmrStep, VitalsStep, ExaminationStep, DiagnosisStep, LabStep, RadiologyStep,
  PrescriptionStep, TreatmentStep, NotesStep, AdmissionStep, DischargeStep, FollowUpStep,
  SignatureStep, CompleteStep,
} from "./encounterSteps";

const STEPS: WorkflowStep[] = [
  { id: "summary", label: "Patient Summary", group: "Review" },
  { id: "emr", label: "Medical Record", group: "Review" },
  { id: "vitals", label: "Vitals", group: "Assess" },
  { id: "examination", label: "Clinical Examination", group: "Assess" },
  { id: "diagnosis", label: "Diagnosis", group: "Assess" },
  { id: "lab", label: "Laboratory Orders", group: "Orders" },
  { id: "radiology", label: "Radiology Orders", group: "Orders" },
  { id: "prescription", label: "Prescription", group: "Orders" },
  { id: "treatment", label: "Treatment Plan", group: "Plan" },
  { id: "notes", label: "Clinical Notes", group: "Plan" },
  { id: "admission", label: "Admission Decision", group: "Disposition" },
  { id: "discharge", label: "Discharge Summary", group: "Disposition" },
  { id: "followup", label: "Follow-up", group: "Disposition" },
  { id: "signature", label: "Digital Signature", group: "Close" },
  { id: "complete", label: "Case Completed", group: "Close" },
];

export function Encounter({ onExit }: { onExit: () => void }) {
  const patient = ACTIVE_PATIENT;
  const [stepId, setStepId] = useState("summary");
  const [done, setDone] = useState<Set<string>>(new Set());
  const [state, setState] = useState<EncounterState>(INITIAL_ENCOUNTER);
  const update = (patch: Partial<EncounterState>) => setState((s) => ({ ...s, ...patch }));

  const idx = STEPS.findIndex((s) => s.id === stepId);
  const step = STEPS[idx];

  // Validation gate before advancing past a step.
  const validate = (id: string): string | null => {
    if (id === "diagnosis" && state.diagnoses.length === 0) return "Add at least one diagnosis before continuing.";
    if (id === "admission" && !state.admission) return "Select an admission decision.";
    if (id === "signature" && !state.signed) return "Sign the record before completing the case.";
    return null;
  };

  const goTo = (id: string) => setStepId(id);

  const next = () => {
    const err = validate(step.id);
    if (err) { toast.error(err); return; }
    setDone((d) => new Set(d).add(step.id));
    if (idx < STEPS.length - 1) setStepId(STEPS[idx + 1].id);
  };
  const back = () => { if (idx > 0) setStepId(STEPS[idx - 1].id); else onExit(); };

  const progress = Math.round(((idx + 1) / STEPS.length) * 100);

  const body = useMemo(() => {
    const p = { patient, state, update };
    switch (stepId) {
      case "summary": return <SummaryStep {...p} />;
      case "emr": return <EmrStep {...p} />;
      case "vitals": return <VitalsStep {...p} />;
      case "examination": return <ExaminationStep {...p} />;
      case "diagnosis": return <DiagnosisStep {...p} />;
      case "lab": return <LabStep {...p} />;
      case "radiology": return <RadiologyStep {...p} />;
      case "prescription": return <PrescriptionStep {...p} />;
      case "treatment": return <TreatmentStep {...p} />;
      case "notes": return <NotesStep {...p} />;
      case "admission": return <AdmissionStep {...p} />;
      case "discharge": return <DischargeStep {...p} />;
      case "followup": return <FollowUpStep {...p} />;
      case "signature": return <SignatureStep {...p} />;
      case "complete": return <CompleteStep {...p} onReturn={onExit} />;
      default: return null;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [stepId, state]);

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-[260px_1fr]">
      {/* Workflow rail */}
      <aside className="lg:sticky lg:top-0 lg:self-start">
        <div className="rounded-xl border border-border bg-surface p-4">
          <div className="flex items-center gap-3 border-b border-border pb-3">
            <Avatar name={patient.name} tone="brand" />
            <div className="min-w-0">
              <div className="truncate font-medium text-text-primary">{patient.name}</div>
              <div className="truncate text-xs text-text-secondary">{patient.uhid} · {patient.age}/{patient.gender[0]}</div>
            </div>
          </div>
          <div className="py-3">
            <div className="mb-1 flex items-center justify-between text-xs text-text-secondary"><span>Progress</span><span>{progress}%</span></div>
            <div className="h-1.5 overflow-hidden rounded-full bg-muted"><div className="h-full rounded-full bg-primary transition-all" style={{ width: `${progress}%` }} /></div>
          </div>
          <WorkflowRail steps={STEPS} activeId={stepId} doneIds={done} onJump={goTo} />
        </div>
      </aside>

      {/* Step content */}
      <div className="min-w-0 space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <div className="text-xs font-semibold uppercase tracking-wide text-text-secondary">{step.group}</div>
            <h1 className="font-bold text-text-primary" style={{ fontSize: 22 }}>{step.label}</h1>
          </div>
          <StatusBadge tone="brand">Step {idx + 1} / {STEPS.length}</StatusBadge>
        </div>

        {body}

        {stepId !== "complete" && (
          <div className="flex items-center justify-between border-t border-border pt-4">
            <Button variant="outline" onClick={back}><ArrowLeft className="size-4" />Back</Button>
            <Button onClick={next}>
              {stepId === "signature" ? <>Complete Case<Check className="size-4" /></> : <>Continue<ArrowRight className="size-4" /></>}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
