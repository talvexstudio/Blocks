import { create } from "zustand";
import type { BlockModel } from "@/types/blocks";
import type { Units } from "@/lib/units";

const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

const formatBlockName = (index: number) => {
  let label = "";
  let current = index;

  while (current >= 0) {
    label = alphabet[current % alphabet.length] + label;
    current = Math.floor(current / alphabet.length) - 1;
  }

  return `Block ${label}`;
};

const createBlock = (index: number): BlockModel => ({
  id: typeof crypto !== "undefined" && crypto.randomUUID ? crypto.randomUUID() : Math.random().toString(36).slice(2),
  name: formatBlockName(index),
  xSize: 24,
  ySize: 24,
  levels: 8,
  levelHeight: 3.6,
  posX: index * 8,
  posY: 0,
  posZ: 0,
  defaultFunction: "Office",
});

const reindexBlocks = (blocks: BlockModel[]) =>
  blocks.map((block, index) => ({
    ...block,
    name: formatBlockName(index),
  }));

interface BlockState {
  units: Units;
  blocks: BlockModel[];
  addBlock: () => void;
  updateBlock: (id: string, payload: Partial<BlockModel>) => void;
  removeBlock: (id: string) => void;
  setUnitsFromFirstBlock: (unit: Units) => void;
}

export const useBlockStore = create<BlockState>((set, get) => ({
  units: "metric",
  blocks: [createBlock(0)],
  addBlock: () =>
    set((state) => ({
      blocks: [...state.blocks, createBlock(state.blocks.length)],
    })),
  updateBlock: (id, payload) =>
    set((state) => ({
      blocks: reindexBlocks(
        state.blocks.map((block) => (block.id === id ? { ...block, ...payload } : block)),
      ),
    })),
  removeBlock: (id) =>
    set((state) => {
      if (state.blocks.length === 1) {
        return state;
      }

      const next = state.blocks.filter((block) => block.id !== id);
      return {
        blocks: next.length ? reindexBlocks(next) : [createBlock(0)],
      };
    }),
  setUnitsFromFirstBlock: (unit) => {
    if (get().units === unit) return;
    set({ units: unit });
  },
}));
