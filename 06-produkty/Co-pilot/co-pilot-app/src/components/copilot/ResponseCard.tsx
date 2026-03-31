"use client";

import { motion } from "motion/react";
import { SynthesisSection } from "./sections/SynthesisSection";
import { DataSection } from "./sections/DataSection";
import { InteractionsSection } from "./sections/InteractionsSection";
import { IcdSection } from "./sections/IcdSection";
import { SourcesSection } from "./sections/SourcesSection";
import { FollowUpSection } from "./sections/FollowUpSection";
import { CriticalAlert } from "./states/CriticalAlert";
import { DisclaimerBar } from "./DisclaimerBar";
import type { CoPilotResponse } from "@/lib/copilot/types";

const EASE = [0.16, 1, 0.3, 1] as const;

interface ResponseCardProps {
  response: CoPilotResponse;
  onFollowUp: (query: string) => void;
}

export function ResponseCard({ response, onFollowUp }: ResponseCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, ease: EASE }}
    >
      {response.criticalAlert && (
        <CriticalAlert message={response.criticalAlert} />
      )}

      <motion.div
        initial="initial"
        animate="animate"
        variants={{
          animate: { transition: { staggerChildren: 0.05 } },
        }}
        className="border-2 border-foreground/5 bg-card p-6 sm:p-8 space-y-0"
      >
        <motion.div
          variants={{
            initial: { opacity: 0, y: 10 },
            animate: { opacity: 1, y: 0, transition: { duration: 0.35, ease: EASE } },
          }}
        >
          <SynthesisSection text={response.synthesis} />
        </motion.div>

        {response.data && (
          <motion.div
            variants={{
              initial: { opacity: 0, y: 10 },
              animate: { opacity: 1, y: 0, transition: { duration: 0.35, ease: EASE } },
            }}
            className="mt-5"
          >
            <DataSection
              label={response.data.label}
              rows={response.data.rows}
              note={response.data.note}
            />
          </motion.div>
        )}

        {response.interactions && response.interactions.length > 0 && (
          <motion.div
            variants={{
              initial: { opacity: 0, y: 10 },
              animate: { opacity: 1, y: 0, transition: { duration: 0.35, ease: EASE } },
            }}
            className="mt-5"
          >
            <InteractionsSection interactions={response.interactions} />
          </motion.div>
        )}

        <motion.div
          variants={{
            initial: { opacity: 0, y: 10 },
            animate: { opacity: 1, y: 0, transition: { duration: 0.35, ease: EASE } },
          }}
          className="mt-5"
        >
          <IcdSection codes={response.icdCodes} />
        </motion.div>

        <motion.div
          variants={{
            initial: { opacity: 0, y: 10 },
            animate: { opacity: 1, y: 0, transition: { duration: 0.35, ease: EASE } },
          }}
          className="mt-5"
        >
          <SourcesSection sources={response.sources} />
        </motion.div>

        <motion.div
          variants={{
            initial: { opacity: 0, y: 10 },
            animate: { opacity: 1, y: 0, transition: { duration: 0.35, ease: EASE } },
          }}
          className="mt-5"
        >
          <FollowUpSection questions={response.followUp} onAsk={onFollowUp} />
        </motion.div>

        <motion.div
          variants={{
            initial: { opacity: 0 },
            animate: { opacity: 1, transition: { duration: 0.3, delay: 0.1 } },
          }}
        >
          <DisclaimerBar />
        </motion.div>
      </motion.div>
    </motion.div>
  );
}
