"use client";

import { AnimatePresence, motion } from "motion/react";
import { useCoPilot } from "@/hooks/use-copilot";
import { useCommandPalette } from "@/hooks/use-command-palette";
import { InputArea } from "./InputArea";
import { ResponseCard } from "./ResponseCard";
import { CommandPalette } from "./CommandPalette";
import { EmptyState } from "./states/EmptyState";
import { LoadingState } from "./states/LoadingState";
import { NoMatchState } from "./states/NoMatchState";

const EASE = [0.16, 1, 0.3, 1] as const;

export function CoPilotShell() {
  const {
    state,
    query,
    response,
    specialization,
    history,
    setSpecialization,
    submit,
    reset,
    askFollowUp,
  } = useCoPilot();

  const { open, close } = useCommandPalette();

  return (
    <div className="w-full max-w-[640px] mx-auto px-5 sm:px-8 pb-16">
      <CommandPalette open={open} onClose={close} onSubmit={submit} />

      {/* Back button */}
      <AnimatePresence>
        {state !== "empty" && (
          <motion.div
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -8 }}
            transition={{ duration: 0.2, ease: EASE }}
            className="pt-8"
          >
            <button
              onClick={reset}
              className="text-[11px] font-semibold uppercase tracking-[0.15em] text-muted-foreground hover:text-primary transition-colors"
            >
              &larr; Nowe pytanie
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Content */}
      <AnimatePresence mode="wait">
        {state === "empty" && (
          <motion.div
            key="empty"
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
          >
            <EmptyState onSelectExample={submit} onSelectIntent={submit} />
            <div className="mt-8">
              <InputArea
                onSubmit={submit}
                specialization={specialization}
                onSpecializationChange={setSpecialization}
                history={history}
                onHistorySelect={submit}
                autoFocus
              />
            </div>
          </motion.div>
        )}

        {state === "loading" && (
          <motion.div
            key="loading"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.3, ease: EASE }}
            className="pt-10"
          >
            {/* Query */}
            <div className="border-l-2 border-primary pl-4 mb-6">
              <p className="text-[14px] text-foreground leading-relaxed">{query}</p>
            </div>
            <LoadingState />
          </motion.div>
        )}

        {state === "response" && response && (
          <motion.div
            key="response"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.2 }}
            className="pt-10"
          >
            {/* Query */}
            <div className="border-l-2 border-primary pl-4 mb-6">
              <p className="text-[14px] text-foreground leading-relaxed">{query}</p>
            </div>
            <ResponseCard response={response} onFollowUp={askFollowUp} />
            <InputArea
              onSubmit={submit}
              specialization={specialization}
              onSpecializationChange={setSpecialization}
              history={history}
              onHistorySelect={submit}
              compact
              placeholder="Zapytaj dalej..."
            />
          </motion.div>
        )}

        {state === "response" && !response && (
          <motion.div
            key="no-match"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, ease: EASE }}
            className="pt-10"
          >
            <div className="border-l-2 border-primary pl-4 mb-6">
              <p className="text-[14px] text-foreground leading-relaxed">{query}</p>
            </div>
            <NoMatchState onReset={reset} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
