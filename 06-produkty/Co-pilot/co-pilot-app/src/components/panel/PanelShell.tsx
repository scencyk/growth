"use client";

import { usePatients } from "@/hooks/use-patients";
import { useCommandPalette } from "@/hooks/use-command-palette";
import { MenuBar } from "./MenuBar";
import { PatientSidebar } from "./PatientSidebar";
import { TopBar } from "./TopBar";
import { Workspace } from "./Workspace";
import { EmptyWorkspace } from "./EmptyWorkspace";
import { CommandPalette } from "./CommandPalette";

export function PanelShell() {
  const {
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
  } = usePatients();

  const cmdPalette = useCommandPalette();

  return (
    <div className="h-full flex flex-col overflow-hidden bg-background">
      <MenuBar onNewPatient={createPatient} onGoHome={() => setActive("")} />
      <div className="flex-1 flex overflow-hidden">
      {/* Sidebar — patient cards */}
      <PatientSidebar
        patients={patients}
        activeId={activeId}
        onSelect={setActive}
        onCreate={createPatient}
        onRemove={removePatient}
      />

      {/* Main workspace */}
      <div className="flex-1 flex flex-col min-w-0">
        {activePatient ? (
          <>
            <TopBar
              patient={activePatient}
              onUpdateLabel={(label) => updateLabel(activePatient.id, label)}
              onSetSpecialization={(spec) =>
                setSpecialization(activePatient.id, spec)
              }
              onClose={() => removePatient(activePatient.id)}
            />
            <Workspace
              key={activePatient.id}
              patient={activePatient}
              onSubmitQuery={(query) => submitQuery(activePatient.id, query)}
              onFollowUp={createAndSubmit}
              onAddTag={(tag) => addTag(activePatient.id, tag)}
              onRemoveTag={(tagId) => removeTag(activePatient.id, tagId)}
              onUpdateTagValue={(tagId, value) =>
                updateTagValue(activePatient.id, tagId, value)
              }
              onUpdateContext={(field, index, value) =>
                updateContext(activePatient.id, field, index, value)
              }
            />
          </>
        ) : (
          <EmptyWorkspace
            onCreatePatient={createPatient}
          />
        )}
      </div>

      {/* ⌘K Command palette */}
      <CommandPalette
        open={cmdPalette.open}
        onClose={cmdPalette.close}
        onSubmit={createAndSubmit}
      />
      </div>
    </div>
  );
}
