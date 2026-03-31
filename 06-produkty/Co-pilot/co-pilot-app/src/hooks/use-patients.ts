"use client";

import { useState, useCallback, useRef } from "react";
import type { Patient, Specialization, SymptomTag } from "@/lib/copilot/types";
import { matchScenario, getAutoLabel } from "@/lib/copilot/mock-data";

const LOADING_MIN = 1400;
const LOADING_MAX = 2200;
const randomDelay = () =>
  Math.floor(Math.random() * (LOADING_MAX - LOADING_MIN) + LOADING_MIN);

export function usePatients() {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);
  const timers = useRef<Map<string, ReturnType<typeof setTimeout>>>(new Map());
  const counter = useRef(0);

  const activePatient = patients.find((p) => p.id === activeId) ?? null;

  const createPatient = useCallback(() => {
    counter.current += 1;
    const id = crypto.randomUUID();
    const patient: Patient = {
      id,
      label: `Pacjent #${counter.current}`,
      query: "",
      tags: [],
      status: "new",
      response: null,
      specialization: "kardiologia",
      createdAt: new Date(),
    };
    setPatients((prev) => [...prev, patient]);
    setActiveId(id);
    return id;
  }, []);

  const addTag = useCallback((id: string, tag: SymptomTag) => {
    setPatients((prev) =>
      prev.map((p) =>
        p.id === id ? { ...p, tags: [...p.tags, tag] } : p
      )
    );
  }, []);

  const removeTag = useCallback((id: string, tagId: string) => {
    setPatients((prev) =>
      prev.map((p) =>
        p.id === id
          ? { ...p, tags: p.tags.filter((t) => t.id !== tagId) }
          : p
      )
    );
  }, []);

  const updateTagValue = useCallback((id: string, tagId: string, value: string) => {
    setPatients((prev) =>
      prev.map((p) =>
        p.id === id
          ? {
              ...p,
              tags: p.tags.map((t) =>
                t.id === tagId ? { ...t, value } : t
              ),
            }
          : p
      )
    );
  }, []);

  const removePatient = useCallback((id: string) => {
    const timer = timers.current.get(id);
    if (timer) clearTimeout(timer);
    timers.current.delete(id);

    setPatients((prev) => {
      const next = prev.filter((p) => p.id !== id);
      setActiveId((prevActive) => {
        if (prevActive !== id) return prevActive;
        if (next.length === 0) return null;
        const idx = prev.findIndex((p) => p.id === id);
        return next[Math.min(idx, next.length - 1)]?.id ?? null;
      });
      return next;
    });
  }, []);

  const setActive = useCallback((id: string) => {
    setActiveId(id);
  }, []);

  const updateLabel = useCallback((id: string, label: string) => {
    setPatients((prev) =>
      prev.map((p) => (p.id === id ? { ...p, label } : p))
    );
  }, []);

  const setSpecialization = useCallback(
    (id: string, spec: Specialization) => {
      setPatients((prev) =>
        prev.map((p) => (p.id === id ? { ...p, specialization: spec } : p))
      );
    },
    []
  );

  const updateContext = useCallback(
    (id: string, field: string, index: number | null, newValue: string) => {
      setPatients((prev) =>
        prev.map((p) => {
          if (p.id !== id || !p.response?.context) return p;
          const ctx = { ...p.response.context };

          if (field === "age") ctx.age = newValue;
          else if (field === "sex") ctx.sex = newValue;
          else if (field === "conditions" && index !== null && ctx.conditions) {
            ctx.conditions = [...ctx.conditions];
            ctx.conditions[index] = newValue;
          } else if (field === "medications" && index !== null && ctx.medications) {
            ctx.medications = [...ctx.medications];
            ctx.medications[index] = newValue;
          } else if (field === "symptoms" && index !== null && ctx.symptoms) {
            ctx.symptoms = [...ctx.symptoms];
            ctx.symptoms[index] = newValue;
          } else if (field === "parameters" && index !== null && ctx.parameters) {
            ctx.parameters = [...ctx.parameters];
            ctx.parameters[index] = { ...ctx.parameters[index], value: newValue };
          }

          return {
            ...p,
            response: { ...p.response, context: ctx },
          };
        })
      );
    },
    []
  );

  const submitQuery = useCallback((id: string, query: string) => {
    const trimmed = query.trim();
    if (!trimmed) return;

    setPatients((prev) =>
      prev.map((p) =>
        p.id === id
          ? { ...p, query: trimmed, status: "loading" as const, response: null }
          : p
      )
    );

    const existing = timers.current.get(id);
    if (existing) clearTimeout(existing);

    const timer = setTimeout(() => {
      const response = matchScenario(trimmed);
      const autoLabel = response ? getAutoLabel(response.scenarioId) : null;

      setPatients((prev) =>
        prev.map((p) => {
          if (p.id !== id) return p;
          return {
            ...p,
            status: response ? ("ready" as const) : ("error" as const),
            response,
            label:
              autoLabel && p.label.startsWith("Pacjent #")
                ? autoLabel
                : p.label,
          };
        })
      );
      timers.current.delete(id);
    }, randomDelay());

    timers.current.set(id, timer);
  }, []);

  /** Creates a new patient card AND immediately submits a query */
  const createAndSubmit = useCallback(
    (query: string) => {
      counter.current += 1;
      const id = crypto.randomUUID();
      const patient: Patient = {
        id,
        label: `Pacjent #${counter.current}`,
        query: "",
        tags: [],
        status: "new",
        response: null,
        specialization: "kardiologia",
        createdAt: new Date(),
      };
      setPatients((prev) => [...prev, patient]);
      setActiveId(id);
      // Submit on next tick so patient exists in state
      setTimeout(() => submitQuery(id, query), 0);
      return id;
    },
    [submitQuery]
  );

  return {
    patients,
    activeId,
    activePatient,
    createPatient,
    removePatient,
    setActive,
    updateLabel,
    setSpecialization,
    addTag,
    removeTag,
    updateTagValue,
    updateContext,
    submitQuery,
    createAndSubmit,
  };
}
