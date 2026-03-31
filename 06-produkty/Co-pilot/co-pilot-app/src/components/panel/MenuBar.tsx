"use client";

import { useState, useRef, useEffect } from "react";
import { Plus, Printer, PanelLeft, Maximize, Pill, Calculator, Zap, BookOpen, Keyboard, Info } from "lucide-react";
import { cn } from "@/lib/utils";

interface MenuItem {
  label: string;
  shortcut?: string;
  action?: () => void;
  separator?: boolean;
  disabled?: boolean;
  icon?: React.ComponentType<{ className?: string }>;
}

interface MenuGroup {
  label: string;
  items: MenuItem[];
}

interface MenuBarProps {
  onNewPatient: () => void;
  onGoHome?: () => void;
  onToggleSidebar?: () => void;
}

export function MenuBar({ onNewPatient, onGoHome, onToggleSidebar }: MenuBarProps) {
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const barRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handler(e: MouseEvent) {
      if (barRef.current && !barRef.current.contains(e.target as Node)) {
        setOpenMenu(null);
      }
    }
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const menus: MenuGroup[] = [
    {
      label: "Plik",
      items: [
        { label: "Nowy pacjent", shortcut: "Ctrl+N", action: onNewPatient, icon: Plus },
        { separator: true, label: "" },
        { label: "Drukuj", shortcut: "Ctrl+P", action: () => window.print(), icon: Printer },
      ],
    },
    {
      label: "Widok",
      items: [
        { label: "Panel pacjentow", action: onToggleSidebar, icon: PanelLeft },
        { label: "Pelny ekran", shortcut: "F11", icon: Maximize, action: () => {
          if (document.fullscreenElement) document.exitFullscreen();
          else document.documentElement.requestFullscreen();
        }},
      ],
    },
    {
      label: "Narzedzia",
      items: [
        { label: "Wyszukiwarka lekow", icon: Pill, action: () => window.open("https://remedium.md/leki", "_blank") },
        { label: "Kalkulator dawki", icon: Calculator, action: () => window.open("https://remedium.md/kalkulatory", "_blank") },
        { label: "Interakcje lekowe", icon: Zap, action: () => window.open("https://remedium.md/interakcje", "_blank") },
        { label: "Baza ICD-10", icon: BookOpen, action: () => window.open("https://remedium.md/icd10", "_blank") },
      ],
    },
    {
      label: "Pomoc",
      items: [
        { label: "Skroty klawiszowe", icon: Keyboard, action: () => {
          /* Could show a dialog — for now alert */
          alert("Ctrl+N — Nowy pacjent\nCtrl+K — Szybkie zapytanie\nF11 — Pelny ekran");
        }},
        { separator: true, label: "" },
        { label: "O Co-Pilot AI", icon: Info, action: () => {
          alert("Co-Pilot AI v0.1\nAsystent decyzji klinicznej\nRemedium.md");
        }},
      ],
    },
  ];

  // Global keyboard shortcuts
  useEffect(() => {
    function handler(e: KeyboardEvent) {
      if ((e.ctrlKey || e.metaKey) && e.key === "n") {
        e.preventDefault();
        onNewPatient();
      }
    }
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onNewPatient]);

  return (
    <div ref={barRef} className="h-7 flex items-center border-b border-border bg-card px-1 shrink-0 select-none">
      {/* Logo — click goes home */}
      <button
        onClick={onGoHome}
        className="flex items-center gap-1.5 px-2 mr-1 hover:opacity-70 transition-opacity"
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" className="text-foreground shrink-0">
          <path d="M19 10.8944C15.7495 10.8944 13.1056 8.25045 13.1056 5H10.8944C10.8944 8.25045 8.25045 10.8944 5 10.8944V13.1056C8.25045 13.1056 10.8944 15.7495 10.8944 19H13.1056C13.1056 15.7495 15.7495 13.1056 19 13.1056V10.8944ZM12 14.9219C11.2956 13.7153 10.2847 12.7044 9.07807 12C10.2847 11.2924 11.2924 10.2847 12 9.07807C12.7076 10.2847 13.7153 11.2924 14.9219 12C13.7153 12.7076 12.7076 13.7153 12 14.9219Z" fill="currentColor" />
        </svg>
        <span className="text-[10px] font-semibold text-foreground">Co-Pilot</span>
      </button>

      {menus.map((menu) => (
        <div key={menu.label} className="relative">
          <button
            onMouseDown={() => setOpenMenu(openMenu === menu.label ? null : menu.label)}
            onMouseEnter={() => openMenu && setOpenMenu(menu.label)}
            className={cn(
              "px-2 py-1 text-[11px] text-foreground transition-colors rounded-sm",
              openMenu === menu.label ? "bg-muted" : "hover:bg-muted/50"
            )}
          >
            {menu.label}
          </button>

          {openMenu === menu.label && (
            <div className="absolute left-0 top-full z-50 mt-0 border border-border bg-card shadow-lg min-w-[180px] py-0.5">
              {menu.items.map((item, i) =>
                item.separator ? (
                  <div key={i} className="h-px bg-border my-0.5" />
                ) : (
                  <button
                    key={item.label}
                    onClick={() => {
                      item.action?.();
                      setOpenMenu(null);
                    }}
                    disabled={item.disabled}
                    className={cn(
                      "flex items-center justify-between w-full px-3 py-1.5 text-[11px] text-left transition-colors",
                      item.disabled
                        ? "text-muted-foreground/40"
                        : "text-foreground hover:bg-muted"
                    )}
                  >
                    <span className="flex items-center gap-2">
                      {item.icon && <item.icon className="size-3 text-muted-foreground" />}
                      {item.label}
                    </span>
                    {item.shortcut && (
                      <span className="text-[9px] font-mono text-muted-foreground ml-4">
                        {item.shortcut}
                      </span>
                    )}
                  </button>
                )
              )}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
