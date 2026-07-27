import React from "react";
import { StatusBadge, StatCard, SectionCard } from "../his/ui";
import {
  type VirtualAppointment, type WaitingRoomPatient, type SecureMessage,
  type BillingRecord, type ConsentRecord, type ConnectivityLog,
  type Provider, type AuditEntry, type QualityMetric,
  apptStatusTone, consentStatusTone, paymentStatusTone,
  connectivityTone, messageStatusTone, formatCurrency,
} from "./data";
import {
  Video, Phone, MessageSquare, Clock, Users, CheckCircle, AlertTriangle,
  Wifi, WifiOff, Shield, CreditCard, Calendar, Star, TrendingUp,
  TrendingDown, FileText, Send, Paperclip, Eye, Download, Activity,
  Mic, MicOff, Camera, CameraOff, Monitor, Signal, CircleDot,
  ChevronRight, MoreHorizontal, Bell, Search, Plus, RefreshCw,
  Settings, Zap, Radio, Headphones, ScreenShare, Image as ImageIcon,
  File, Stethoscope, Pill, TestTube2, ScanLine, UserCheck,
} from "lucide-react";

/* ── Appointment Card ─────────────────────────────────────────────────────── */
export function AppointmentCard({ a, onJoin }: { a: VirtualAppointment; onJoin?: () => void }) {
  const consultIcon = a.consultType === "Video" ? Video : a.consultType === "Audio" ? Phone : MessageSquare;
  const ConsultIcon = consultIcon;
  return (
    <div className="p-4 rounded-lg border border-border bg-card space-y-3">
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-3 min-w-0">
          <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-sm font-bold text-primary shrink-0">
            {a.patientAvatar}
          </div>
          <div className="min-w-0">
            <p className="font-semibold text-sm truncate">{a.patientName}</p>
            <p className="text-xs text-muted-foreground">{a.patientAge}y {a.patientGender} — {a.specialty}</p>
            <p className="text-xs text-muted-foreground truncate">{a.chiefComplaint}</p>
          </div>
        </div>
        <div className="flex flex-col items-end gap-1 shrink-0">
          <StatusBadge tone={apptStatusTone(a.status)}>{a.status}</StatusBadge>
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <ConsultIcon className="h-3 w-3" />
            <span>{a.consultType}</span>
          </div>
        </div>
      </div>
      <div className="flex items-center justify-between text-xs text-muted-foreground">
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1"><Clock className="h-3 w-3" />{new Date(a.appointmentTime).toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" })}</span>
          <span>{a.duration} min</span>
        </div>
        <div className="flex items-center gap-2">
          <StatusBadge tone={consentStatusTone(a.consentStatus)}>{a.consentStatus}</StatusBadge>
          <StatusBadge tone={paymentStatusTone(a.paymentStatus)}>{a.paymentStatus}</StatusBadge>
        </div>
      </div>
      {a.status === "Waiting" || a.status === "Checked In" ? (
        <button onClick={onJoin} className="w-full py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition flex items-center justify-center gap-2">
          <Video className="h-4 w-4" />Join Consultation
        </button>
      ) : null}
    </div>
  );
}

/* ── Waiting Room Card ────────────────────────────────────────────────────── */
export function WaitingRoomCard({ w, onAccept }: { w: WaitingRoomPatient; onAccept?: () => void }) {
  return (
    <div className="p-4 rounded-lg border border-border bg-card space-y-3">
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-3 min-w-0">
          <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-sm font-bold text-primary shrink-0">
            {w.patientAvatar}
          </div>
          <div className="min-w-0">
            <p className="font-semibold text-sm truncate">{w.patientName}</p>
            <p className="text-xs text-muted-foreground truncate">{w.chiefComplaint}</p>
          </div>
        </div>
        <div className="flex flex-col items-end gap-1 shrink-0">
          <StatusBadge tone={w.readyForConsultation ? "success" : "warning"}>
            {w.readyForConsultation ? "Ready" : "Not Ready"}
          </StatusBadge>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-2 text-xs">
        <div className="flex items-center gap-1 text-muted-foreground">
          <Clock className="h-3 w-3" />
          <span>In: {w.checkInTime}</span>
        </div>
        <div className="flex items-center gap-1 text-muted-foreground">
          <Signal className="h-3 w-3" />
          <StatusBadge tone={connectivityTone(w.connectivityStatus)}>{w.connectivityStatus}</StatusBadge>
        </div>
        <div className="flex items-center gap-1 text-muted-foreground">
          <Shield className="h-3 w-3" />
          <StatusBadge tone={consentStatusTone(w.consentStatus)}>{w.consentStatus}</StatusBadge>
        </div>
        <div className="flex items-center gap-1 text-muted-foreground">
          <UserCheck className="h-3 w-3" />
          <span>Identity: {w.identityVerified ? "Verified" : "Pending"}</span>
        </div>
      </div>
      {w.readyForConsultation && (
        <button onClick={onAccept} className="w-full py-2 rounded-lg bg-green-600 text-white text-sm font-medium hover:bg-green-700 transition flex items-center justify-center gap-2">
          <Video className="h-4 w-4" />Accept Patient
        </button>
      )}
    </div>
  );
}

/* ── Message Bubble ───────────────────────────────────────────────────────── */
export function MessageBubble({ m, isOwn }: { m: SecureMessage; isOwn: boolean }) {
  return (
    <div className={`flex ${isOwn ? "justify-end" : "justify-start"} mb-2`}>
      <div className={`max-w-[75%] p-3 rounded-lg ${isOwn ? "bg-primary text-primary-foreground" : "bg-muted"}`}>
        <p className="text-sm">{m.content}</p>
        {m.hasAttachment && (
          <div className="mt-2 flex items-center gap-2 p-2 rounded bg-black/5 dark:bg-white/5">
            <Paperclip className="h-3 w-3" />
            <span className="text-xs truncate">{m.attachmentName}</span>
            <Download className="h-3 w-3 ml-auto cursor-pointer" />
          </div>
        )}
        <div className="flex items-center justify-between mt-1">
          <span className={`text-[10px] ${isOwn ? "text-primary-foreground/70" : "text-muted-foreground"}`}>
            {new Date(m.timestamp).toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" })}
          </span>
          {isOwn && <StatusBadge tone={messageStatusTone(m.status)}>{m.status === "Read" ? "✓✓" : m.status === "Delivered" ? "✓✓" : "✓"}</StatusBadge>}
        </div>
      </div>
    </div>
  );
}

/* ── Billing Row ──────────────────────────────────────────────────────────── */
export function BillingRow({ b }: { b: BillingRecord }) {
  return (
    <div className="p-4 rounded-lg border border-border bg-card space-y-2">
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0">
          <p className="font-semibold text-sm">{b.patientName}</p>
          <p className="text-xs text-muted-foreground">{b.providerName} — {b.specialty}</p>
          <p className="text-xs text-muted-foreground">Invoice: {b.id}</p>
        </div>
        <StatusBadge tone={paymentStatusTone(b.paymentStatus)}>{b.paymentStatus}</StatusBadge>
      </div>
      <div className="grid grid-cols-2 gap-2 text-xs">
        <div className="flex justify-between"><span className="text-muted-foreground">Consultation</span><span>{formatCurrency(b.consultationFee)}</span></div>
        <div className="flex justify-between"><span className="text-muted-foreground">Platform</span><span>{formatCurrency(b.platformFee)}</span></div>
        <div className="flex justify-between"><span className="text-muted-foreground">Tax</span><span>{formatCurrency(b.taxAmount)}</span></div>
        <div className="flex justify-between font-medium"><span>Total</span><span>{formatCurrency(b.netAmount)}</span></div>
      </div>
      {b.insuranceClaim && (
        <div className="p-2 rounded bg-muted text-xs space-y-1">
          <div className="flex justify-between"><span className="text-muted-foreground">Insurance</span><span>{b.insuranceClaim.provider}</span></div>
          <div className="flex justify-between"><span className="text-muted-foreground">Claim</span><span>{b.insuranceClaim.claimId}</span></div>
          <div className="flex justify-between"><span className="text-muted-foreground">Approved</span><span>{formatCurrency(b.insuranceClaim.approvedAmount)}</span></div>
        </div>
      )}
      {b.refundAmount && (
        <div className="p-2 rounded bg-red-50 text-xs text-red-600">
          Refund: {formatCurrency(b.refundAmount)} on {b.refundDate}
        </div>
      )}
    </div>
  );
}

/* ── Consent Card ─────────────────────────────────────────────────────────── */
export function ConsentCard({ c }: { c: ConsentRecord }) {
  return (
    <div className="p-4 rounded-lg border border-border bg-card space-y-2">
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0">
          <p className="font-semibold text-sm">{c.patientName}</p>
          <p className="text-xs text-muted-foreground">{c.consentType}</p>
        </div>
        <StatusBadge tone={consentStatusTone(c.status)}>{c.status}</StatusBadge>
      </div>
      <p className="text-xs text-muted-foreground line-clamp-2">{c.consentText}</p>
      {c.signedDate && <p className="text-xs text-muted-foreground">Signed: {new Date(c.signedDate).toLocaleString("en-IN")}</p>}
      {c.auditTrail.length > 0 && (
        <div className="space-y-1">
          {c.auditTrail.map((a, i) => (
            <div key={i} className="flex items-center gap-2 text-[10px] text-muted-foreground">
              <span>{new Date(a.timestamp).toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" })}</span>
              <span>{a.action}</span>
              <span>— {a.user}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

/* ── Connectivity Row ─────────────────────────────────────────────────────── */
export function ConnectivityRow({ c }: { c: ConnectivityLog }) {
  return (
    <div className="flex items-center gap-4 p-3 border-b last:border-0">
      <div className="min-w-0 flex-1">
        <p className="font-medium text-sm">{c.patientName}</p>
        <p className="text-xs text-muted-foreground">{c.device} — {c.browser}</p>
      </div>
      <div className="flex items-center gap-4 text-xs">
        <div className="text-center">
          <p className="text-muted-foreground">↓</p>
          <p className="font-medium">{c.downloadSpeed} Mbps</p>
        </div>
        <div className="text-center">
          <p className="text-muted-foreground">↑</p>
          <p className="font-medium">{c.uploadSpeed} Mbps</p>
        </div>
        <div className="text-center">
          <p className="text-muted-foreground">Ping</p>
          <p className="font-medium">{c.latency}ms</p>
        </div>
        <StatusBadge tone={connectivityTone(c.status)}>{c.status}</StatusBadge>
      </div>
    </div>
  );
}

/* ── Audit Entry Row ──────────────────────────────────────────────────────── */
export function AuditEntryRow({ e }: { e: AuditEntry }) {
  const sev = e.severity === "Critical" ? "danger" : e.severity === "Warning" ? "warning" : "info";
  return (
    <div className="flex items-start gap-3 p-3 border-b last:border-0">
      <StatusBadge tone={sev}>{e.severity}</StatusBadge>
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2 flex-wrap">
          <p className="font-medium text-sm">{e.action}</p>
          <span className="text-xs text-muted-foreground">{e.user}</span>
        </div>
        <p className="text-xs text-muted-foreground truncate">{e.details}</p>
        <p className="text-[10px] text-muted-foreground mt-1">IP: {e.ipAddress}</p>
      </div>
      <span className="text-xs text-muted-foreground whitespace-nowrap shrink-0">
        {new Date(e.timestamp).toLocaleString("en-IN", { day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit" })}
      </span>
    </div>
  );
}

/* ── Quality Metric Row ───────────────────────────────────────────────────── */
export function QualityMetricRow({ q }: { q: QualityMetric }) {
  return (
    <div className="flex items-center justify-between p-3 border-b last:border-0">
      <div className="min-w-0 flex-1">
        <p className="font-medium text-sm">{q.metric}</p>
        <p className="text-xs text-muted-foreground">Target: {q.target}</p>
      </div>
      <div className="flex items-center gap-2">
        <span className="text-sm font-medium">{q.actual}</span>
        <StatusBadge tone={q.status === "Pass" ? "success" : q.status === "Warning" ? "warning" : "danger"}>{q.status}</StatusBadge>
      </div>
    </div>
  );
}

/* ── Section Heading ──────────────────────────────────────────────────────── */
export function SectionHeading({ icon, children }: { icon?: React.ReactNode; children: React.ReactNode }) {
  return (
    <h2 className="text-lg font-bold flex items-center gap-2">
      {icon}<span>{children}</span>
    </h2>
  );
}
