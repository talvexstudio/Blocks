import * as React from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { FUNCTION_COLORS, PROGRAM_OPTIONS } from "@/constants/blocks";
import { fromDisplayUnits, LENGTH_LABEL, toDisplayUnits, type Units } from "@/lib/units";
import type { BlockFunction, BlockModel } from "@/types/blocks";

type LengthField = "xSize" | "ySize" | "levelHeight" | "posX" | "posY" | "posZ";
type CountField = "levels";

interface FieldConfig {
  key: LengthField;
  label: string;
  min?: number;
  max?: number;
  step?: number;
}

const LENGTH_FIELDS: FieldConfig[] = [
  { key: "xSize", label: "Width", min: 1, step: 0.5 },
  { key: "ySize", label: "Depth", min: 1, step: 0.5 },
  { key: "levelHeight", label: "Level Height", min: 2.5, step: 0.1 },
  { key: "posX", label: "Offset X", step: 1 },
  { key: "posY", label: "Offset Y", step: 1 },
  { key: "posZ", label: "Offset Z", step: 1 },
];

interface BlockCardProps {
  block: BlockModel;
  units: Units;
  isFirst: boolean;
  canRemove: boolean;
  onUpdate: (id: string, payload: Partial<BlockModel>) => void;
  onRemove: (id: string) => void;
  onUnitsChange: (unit: Units) => void;
}

export const BlockCard = ({ block, units, isFirst, canRemove, onUpdate, onRemove, onUnitsChange }: BlockCardProps) => {
  const unitLabel = LENGTH_LABEL[units];
  const [drafts, setDrafts] = React.useState<Record<string, string>>({});

  React.useEffect(() => {
    setDrafts({});
  }, [block.id, units]);

  const updateDraft = (key: string, value: string) => {
    setDrafts((prev) => ({ ...prev, [key]: value }));
  };

  const clearDraft = (key: string) => {
    setDrafts((prev) => {
      const next = { ...prev };
      delete next[key];
      return next;
    });
  };

  const commitLength = (key: LengthField, draftKey: string, value: string) => {
    if (value === "" || value === "-") {
      clearDraft(draftKey);
      return;
    }
    const numeric = parseFloat(value);
    if (Number.isNaN(numeric)) return;
    onUpdate(block.id, { [key]: fromDisplayUnits(numeric, units) } as Partial<BlockModel>);
    clearDraft(draftKey);
  };

  const commitCount = (key: CountField, draftKey: string, value: string) => {
    if (value === "" || value === "-") {
      clearDraft(draftKey);
      return;
    }
    const numeric = parseFloat(value);
    if (Number.isNaN(numeric)) return;
    onUpdate(block.id, { [key]: Math.max(1, Math.round(numeric)) } as Partial<BlockModel>);
    clearDraft(draftKey);
  };

  const renderLengthField = (field: FieldConfig) => {
    const draftKey = `${block.id}-${field.key}`;
    const inputValue = drafts[draftKey] ?? toDisplayUnits(block[field.key], units).toFixed(2);

    return (
      <div key={draftKey} className="space-y-1.5">
        <Label htmlFor={draftKey}>{field.label}</Label>
        <div className="flex items-center gap-2">
          <Input
            id={draftKey}
            type="number"
            step={field.step ?? 0.1}
            min={field.min}
            max={field.max}
            value={inputValue}
            onChange={(event) => updateDraft(draftKey, event.target.value)}
            onBlur={(event) => commitLength(field.key, draftKey, event.target.value)}
            onKeyDown={(event) => event.key === "Enter" && commitLength(field.key, draftKey, (event.target as HTMLInputElement).value)}
            className="h-9"
          />
          <span className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">{unitLabel}</span>
        </div>
      </div>
    );
  };

  const renderLevelsField = () => {
    const draftKey = `${block.id}-levels`;
    const inputValue = drafts[draftKey] ?? String(block.levels);

    return (
      <div className="space-y-1.5">
        <Label htmlFor={draftKey}>Levels</Label>
        <Input
          id={draftKey}
          type="number"
          min={1}
          step={1}
          value={inputValue}
          onChange={(event) => updateDraft(draftKey, event.target.value)}
          onBlur={(event) => commitCount("levels", draftKey, event.target.value)}
          onKeyDown={(event) => event.key === "Enter" && commitCount("levels", draftKey, (event.target as HTMLInputElement).value)}
          className="h-9"
        />
      </div>
    );
  };

  return (
    <div className="rounded-2xl border border-border/60 bg-card/70 p-4 shadow-sm">
      <div className="mb-4 flex items-center justify-between gap-3">
        <div>
          <p className="text-xs uppercase tracking-[0.25em] text-muted-foreground">Block</p>
          <p className="text-lg font-semibold text-foreground">{block.name}</p>
        </div>
        {canRemove && (
          <Button variant="ghost" size="sm" onClick={() => onRemove(block.id)}>
            Remove
          </Button>
        )}
      </div>

      {isFirst && (
        <div className="mb-4 space-y-2">
          <Label>Units</Label>
          <Select value={units} onValueChange={(val) => onUnitsChange(val as Units)}>
            <SelectTrigger>
              <SelectValue placeholder="Units" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="metric">Metric (m)</SelectItem>
              <SelectItem value="imperial">Imperial (ft)</SelectItem>
            </SelectContent>
          </Select>
        </div>
      )}

      <div className="grid gap-4">
        <div className="grid gap-3">{LENGTH_FIELDS.map(renderLengthField)}</div>
        {renderLevelsField()}
        <div className="space-y-2">
          <Label>Program</Label>
          <Select value={block.defaultFunction} onValueChange={(val) => onUpdate(block.id, { defaultFunction: val as BlockFunction })}>
            <SelectTrigger>
              <SelectValue placeholder="Program" />
            </SelectTrigger>
            <SelectContent>
              {PROGRAM_OPTIONS.map((program) => (
                <SelectItem key={program} value={program}>
                    <span className="flex items-center gap-2">
                    <span
                      className="h-2.5 w-2.5 rounded-full"
                      style={{ backgroundColor: FUNCTION_COLORS[program] }}
                    />
                    {program}
                  </span>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
};
