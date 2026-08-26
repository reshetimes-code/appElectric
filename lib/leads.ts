"use client";

import { genId } from "@/lib/utils";
import type { LeadPayload } from "@/lib/types";

const KEY = "appelectric:leads";

// No backend/CRM is wired yet — this persists leads locally so the demo forms
// have real, verifiable end-to-end behavior. Swap for a real API call once a
// CRM/email integration is configured (see Phase C in the build plan).
export function saveLead(payload: Omit<LeadPayload, "id" | "createdAt">): LeadPayload {
  const lead: LeadPayload = { ...payload, id: genId("lead"), createdAt: new Date().toISOString() };
  try {
    const raw = window.localStorage.getItem(KEY);
    const existing: LeadPayload[] = raw ? JSON.parse(raw) : [];
    window.localStorage.setItem(KEY, JSON.stringify([...existing, lead]));
  } catch {
    // storage unavailable — the success state still shows; nothing persisted
  }
  return lead;
}
