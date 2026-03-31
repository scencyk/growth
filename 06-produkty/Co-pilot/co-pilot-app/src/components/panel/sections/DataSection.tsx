"use client";

import type { DataRow } from "@/lib/copilot/types";
import { Section, PropertyRow } from "../Section";

interface DataSectionProps {
  label: string;
  rows: DataRow[];
  note?: string;
}

export function DataSection({ label, rows, note }: DataSectionProps) {
  return (
    <Section label={label}>
      {rows.map((row, i) => (
        <PropertyRow
          key={i}
          label={row.key}
          value={row.value}
          highlight={row.highlight}
          mono
        />
      ))}
      {note && (
        <div className="px-3 pt-0.5">
          <p className="text-[9px] text-muted-foreground leading-snug">{note}</p>
        </div>
      )}
    </Section>
  );
}
