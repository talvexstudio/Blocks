import { useMemo, useState } from "react";

import { BlockCard } from "@/components/blocks/block-card";
import { PROGRAM_OPTIONS } from "@/constants/blocks";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { exportBlocksToGLB, exportBlocksToJSON } from "@/lib/exporters";
import { calculateMetrics } from "@/lib/metrics";
import { formatNumber } from "@/lib/utils";
import { AREA_LABEL, toDisplayArea, type Units } from "@/lib/units";
import { useBlockStore } from "@/store/blocks";
import type { BlockFunction } from "@/types/blocks";

const FUNCTION_ORDER: BlockFunction[] = PROGRAM_OPTIONS;

export const RightSidebar = () => {
  const blocks = useBlockStore((state) => state.blocks);
  const units = useBlockStore((state) => state.units);
  const addBlock = useBlockStore((state) => state.addBlock);
  const updateBlock = useBlockStore((state) => state.updateBlock);
  const removeBlock = useBlockStore((state) => state.removeBlock);
  const setUnitsFromFirstBlock = useBlockStore((state) => state.setUnitsFromFirstBlock);

  const metrics = useMemo(() => calculateMetrics(blocks), [blocks]);
  const [exporting, setExporting] = useState({ glb: false, json: false });
  const areaLabel = AREA_LABEL[units];

  const handleUnitsChange = (unit: Units) => setUnitsFromFirstBlock(unit);

  const triggerExport = async (type: "glb" | "json") => {
    setExporting((prev) => ({ ...prev, [type]: true }));
    try {
      if (type === "glb") {
        await exportBlocksToGLB(blocks);
      } else {
        await exportBlocksToJSON(blocks, units, metrics);
      }
    } finally {
      setExporting((prev) => ({ ...prev, [type]: false }));
    }
  };

  return (
    <aside className="w-full border-t border-border/60 bg-gradient-to-b from-background to-muted/40 lg:h-[calc(100vh-64px)] lg:w-[400px] lg:border-l">
      <ScrollArea className="h-full">
        <div className="space-y-5 p-4">
          <Accordion type="multiple" defaultValue={["add", "blocks", "metrics", "export"]} className="space-y-3">
            <AccordionItem value="add" className="rounded-2xl border border-border/60 bg-card/60 px-4">
              <AccordionTrigger>Add Block</AccordionTrigger>
              <AccordionContent>
                <p className="mb-3 text-sm text-muted-foreground">
                  Duplicate context-ready masses with the same spacing, proportions, and tone as Talvex Scenarios.
                </p>
                <Button className="w-full" onClick={addBlock}>
                  New Block
                </Button>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="blocks" className="rounded-2xl border border-border/60 bg-card/60 px-4">
              <AccordionTrigger>Block Parameters</AccordionTrigger>
              <AccordionContent>
                <div className="space-y-4">
                  {blocks.map((block, index) => (
                    <BlockCard
                      key={block.id}
                      block={block}
                      units={units}
                      isFirst={index === 0}
                      canRemove={blocks.length > 1}
                      onUpdate={updateBlock}
                      onRemove={removeBlock}
                      onUnitsChange={handleUnitsChange}
                    />
                  ))}
                </div>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="metrics" className="rounded-2xl border border-border/60 bg-card/60 px-4">
              <AccordionTrigger>Metrics</AccordionTrigger>
              <AccordionContent>
                <div className="space-y-3 text-sm">
                  <MetricRow label="Total GFA" value={`${formatNumber(toDisplayArea(metrics.totalGfa, units))} ${areaLabel}`} />
                  <MetricRow label="Total Levels" value={formatNumber(metrics.totalLevels, { maximumFractionDigits: 0 })} />
                  <div className="pt-2">
                    <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">By Function</p>
                    <div className="mt-2 space-y-1.5">
                      {FUNCTION_ORDER.map((fn) => (
                        <MetricRow
                          key={fn}
                          label={fn}
                          value={`${formatNumber(toDisplayArea(metrics.gfaByFunction[fn] ?? 0, units))} ${areaLabel}`}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="export" className="rounded-2xl border border-border/60 bg-card/60 px-4">
              <AccordionTrigger>Export</AccordionTrigger>
              <AccordionContent>
                <div className="space-y-3 text-sm text-muted-foreground">
                  <p>Download ready-to-share assets for further design development.</p>
                  <div className="grid gap-2">
                    <Button onClick={() => triggerExport("glb")} disabled={exporting.glb}>
                      {exporting.glb ? "Preparing GLB…" : "Export GLB"}
                    </Button>
                    <Button variant="outline" onClick={() => triggerExport("json")} disabled={exporting.json}>
                      {exporting.json ? "Preparing JSON…" : "Export JSON"}
                    </Button>
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </ScrollArea>
    </aside>
  );
};

interface MetricRowProps {
  label: string;
  value: string;
}

const MetricRow = ({ label, value }: MetricRowProps) => (
  <div className="flex items-center justify-between text-sm">
    <span className="text-muted-foreground">{label}</span>
    <span className="font-medium text-foreground">{value}</span>
  </div>
);
