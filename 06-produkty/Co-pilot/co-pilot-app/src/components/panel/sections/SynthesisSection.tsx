"use client";

import { Section } from "../Section";

interface SynthesisSectionProps {
  text: string;
}

export function SynthesisSection({ text }: SynthesisSectionProps) {
  return (
    <Section label="Synteza">
      <div className="px-3">
        <p className="text-[11px] text-foreground leading-[1.6]">{text}</p>
      </div>
    </Section>
  );
}
