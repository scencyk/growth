"use client";

import { useState, useCallback } from "react";
import {
  type VisitState,
  type PatientSex,
  type CustomItem,
  createVisitState,
  buildQueryFromVisit,
} from "@/lib/copilot/visit-flow";

export function useVisit() {
  const [state, setState] = useState<VisitState>(createVisitState);

  const setSex = useCallback((sex: PatientSex) => {
    setState((s) => ({ ...s, sex, stage: s.age ? (s.complaintId ? "interview" : "complaint") : "triage" }));
  }, []);

  const setAge = useCallback((age: string) => {
    setState((s) => ({ ...s, age, stage: "complaint" }));
  }, []);

  const setComplaint = useCallback((id: string) => {
    setState((s) => ({ ...s, complaintId: id, stage: "interview" }));
  }, []);

  const toggleFinding = useCallback((id: string) => {
    setState((s) => {
      const next = new Set(s.positiveFindings);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return { ...s, positiveFindings: next };
    });
  }, []);

  const toggleExam = useCallback((id: string) => {
    setState((s) => {
      const next = new Set(s.abnormalExam);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return { ...s, abnormalExam: next };
    });
  }, []);

  const addCustomFinding = useCallback((item: CustomItem) => {
    setState((s) => ({
      ...s,
      customFindings: [...s.customFindings, item],
    }));
  }, []);

  const removeCustomFinding = useCallback((id: string) => {
    setState((s) => ({
      ...s,
      customFindings: s.customFindings.filter((f) => f.id !== id),
    }));
  }, []);

  const addCustomExam = useCallback((item: CustomItem) => {
    setState((s) => ({
      ...s,
      customExams: [...s.customExams, item],
    }));
  }, []);

  const removeCustomExam = useCallback((id: string) => {
    setState((s) => ({
      ...s,
      customExams: s.customExams.filter((e) => e.id !== id),
    }));
  }, []);

  const setNotes = useCallback((notes: string) => {
    setState((s) => ({ ...s, notes }));
  }, []);

  const reset = useCallback(() => {
    setState(createVisitState());
  }, []);

  const buildQuery = useCallback(() => {
    return buildQueryFromVisit(state);
  }, [state]);

  return {
    state,
    setSex,
    setAge,
    setComplaint,
    toggleFinding,
    toggleExam,
    addCustomFinding,
    removeCustomFinding,
    addCustomExam,
    removeCustomExam,
    setNotes,
    reset,
    buildQuery,
  };
}
