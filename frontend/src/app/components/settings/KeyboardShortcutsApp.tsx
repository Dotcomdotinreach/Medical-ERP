import { Keyboard, ArrowLeft, Search, Layout, Navigation, FileText, User, Command } from "lucide-react";
import { Shell, type NavItem, type Workspace } from "../his/Shell";
import { PageHeader, SectionCard } from "../his/ui";

interface Props {
  roleName: string;
  onSignOut: () => void;
  onSwitchWorkspace: (w: Workspace) => void;
  onOpenSettings?: (page: string) => void;
  onBack: () => void;
  nav: NavItem[];
  navSecondary?: NavItem[];
  sectionLabel: string;
}

const SHORTCUTS = [
  {
    category: "Global",
    icon: Command,
    items: [
      { keys: ["Ctrl", "K"], desc: "Open search" },
      { keys: ["Ctrl", "/"], desc: "Toggle sidebar" },
      { keys: ["Ctrl", "Shift", "N"], desc: "Toggle notifications" },
      { keys: ["Esc"], desc: "Close dialog / dismiss" },
      { keys: ["Ctrl", "Shift", "P"], desc: "Command palette" },
      { keys: ["?"], desc: "Show keyboard shortcuts" },
    ],
  },
  {
    category: "Navigation",
    icon: Navigation,
    items: [
      { keys: ["G", "then", "H"], desc: "Go to Home / Dashboard" },
      { keys: ["G", "then", "P"], desc: "Go to Patients" },
      { keys: ["G", "then", "A"], desc: "Go to Appointments" },
      { keys: ["G", "then", "L"], desc: "Go to Lab Results" },
      { keys: ["G", "then", "B"], desc: "Go to Billing" },
      { keys: ["Ctrl", "["], desc: "Go back" },
      { keys: ["Ctrl", "]"], desc: "Go forward" },
    ],
  },
  {
    category: "Patients",
    icon: User,
    items: [
      { keys: ["N"], desc: "New patient registration" },
      { keys: ["E"], desc: "Edit current patient" },
      { keys: ["Ctrl", "Enter"], desc: "Save patient record" },
      { keys: ["Ctrl", "D"], desc: "Discharge patient" },
      { keys: ["Ctrl", "Shift", "V"], desc: "View vitals history" },
    ],
  },
  {
    category: "Appointments",
    icon: Layout,
    items: [
      { keys: ["N"], desc: "New appointment" },
      { keys: ["Ctrl", "Shift", "T"], desc: "Toggle day/week view" },
      { keys: ["←", "→"], desc: "Previous / Next day" },
      { keys: ["Ctrl", "Shift", "C"], desc: "Cancel appointment" },
      { keys: ["Ctrl", "Shift", "R"], desc: "Reschedule appointment" },
    ],
  },
  {
    category: "Orders & Records",
    icon: FileText,
    items: [
      { keys: ["Ctrl", "Shift", "L"], desc: "New lab order" },
      { keys: ["Ctrl", "Shift", "M"], desc: "New medication order" },
      { keys: ["Ctrl", "Shift", "I"], desc: "New imaging order" },
      { keys: ["Ctrl", "P"], desc: "Print current view" },
      { keys: ["Ctrl", "Shift", "E"], desc: "Export as PDF" },
    ],
  },
  {
    category: "Search & Filtering",
    icon: Search,
    items: [
      { keys: ["/"], desc: "Focus search bar" },
      { keys: ["Ctrl", "F"], desc: "Find in page" },
      { keys: ["Ctrl", "Shift", "F"], desc: "Advanced search" },
      { keys: ["Ctrl", "R"], desc: "Refresh current view" },
    ],
  },
];

export function KeyboardShortcutsApp({ roleName, onSignOut, onSwitchWorkspace, onOpenSettings, onBack, nav, navSecondary, sectionLabel }: Props) {
  return (
    <Shell
      nav={nav}
      navSecondary={navSecondary}
      sectionLabel={sectionLabel}
      activeId="shortcuts"
      onNavigate={() => onBack()}
      breadcrumb={["Home", "Keyboard Shortcuts"]}
      roleName={roleName}
      onSignOut={onSignOut}
      workspace="reception"
      onSwitchWorkspace={onSwitchWorkspace}
      onOpenSettings={onOpenSettings}
    >
      <div className="space-y-6">
        <div className="flex items-center gap-3">
          <button onClick={onBack} className="rounded-lg border border-border p-2 hover:bg-accent"><ArrowLeft className="size-4" /></button>
          <PageHeader title="Keyboard Shortcuts" subtitle="Speed up your workflow with these keyboard shortcuts" />
        </div>

        <div className="rounded-lg border border-primary/20 bg-primary/5 p-4 flex items-start gap-3">
          <Command className="size-5 text-primary mt-0.5" />
          <div>
            <div className="text-sm font-medium text-text-primary">Pro tip</div>
            <div className="text-xs text-text-secondary">Press <kbd className="rounded border border-border bg-surface px-1.5 py-0.5 font-mono text-xs">?</kbd> anywhere in the app to quickly access these shortcuts. Most shortcuts use <kbd className="rounded border border-border bg-surface px-1.5 py-0.5 font-mono text-xs">Ctrl</kbd> on Windows or <kbd className="rounded border border-border bg-surface px-1.5 py-0.5 font-mono text-xs">⌘</kbd> on Mac.</div>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          {SHORTCUTS.map((group) => (
            <SectionCard key={group.category} title={group.category}>
              <div className="space-y-1">
                {group.items.map((item) => (
                  <div key={item.desc} className="flex items-center justify-between py-2 border-b border-border last:border-0">
                    <span className="text-sm text-text-primary">{item.desc}</span>
                    <div className="flex items-center gap-1">
                      {item.keys.map((k, i) => (
                        <span key={i}>
                          {k === "then" ? (
                            <span className="text-xs text-text-secondary mx-1">then</span>
                          ) : (
                            <kbd className="inline-flex items-center rounded border border-border bg-secondary px-2 py-1 font-mono text-xs text-text-primary shadow-sm">{k}</kbd>
                          )}
                          {i < item.keys.length - 1 && k !== "then" && item.keys[i + 1] !== "then" && <span className="text-xs text-text-secondary mx-0.5">+</span>}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </SectionCard>
          ))}
        </div>
      </div>
    </Shell>
  );
}
