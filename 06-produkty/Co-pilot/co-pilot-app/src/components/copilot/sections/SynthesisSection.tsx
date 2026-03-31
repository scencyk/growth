"use client";

interface SynthesisSectionProps {
  text: string;
}

export function SynthesisSection({ text }: SynthesisSectionProps) {
  return (
    <div>
      <div className="flex items-center gap-2 mb-3">
        <div className="size-2 bg-primary" />
        <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-primary">
          Synteza
        </span>
      </div>
      <p className="text-[16px] leading-[1.7] font-normal text-foreground">
        {text}
      </p>
    </div>
  );
}
