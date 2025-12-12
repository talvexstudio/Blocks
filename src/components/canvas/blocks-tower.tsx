import { useMemo } from "react";
import { DoubleSide } from "three";

import { FUNCTION_COLORS } from "@/constants/blocks";
import { useBlockStore } from "@/store/blocks";

export const BlocksTower = () => {
  const blocks = useBlockStore((state) => state.blocks);

  const blockMeshes = useMemo(
    () =>
      blocks.map((block) => ({
        ...block,
        floors: Array.from({ length: block.levels }),
      })),
    [blocks],
  );

  return (
    <group>
      <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[400, 400]} />
        <meshStandardMaterial color="#f3f4f6" side={DoubleSide} />
      </mesh>
      {blockMeshes.map((block) => (
        <group key={block.id} position={[block.posX, block.posZ, block.posY]}>
          {block.floors.map((_, levelIndex) => (
            <mesh
              key={`${block.id}-level-${levelIndex}`}
              position={[0, block.levelHeight * levelIndex + block.levelHeight / 2, 0]}
              castShadow
              receiveShadow
            >
              <boxGeometry args={[block.xSize, block.levelHeight * 0.95, block.ySize]} />
              <meshStandardMaterial color={FUNCTION_COLORS[block.defaultFunction]} roughness={0.45} metalness={0.05} />
            </mesh>
          ))}
        </group>
      ))}
    </group>
  );
};
