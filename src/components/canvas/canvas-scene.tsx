import { Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import { Environment, Grid, OrbitControls } from "@react-three/drei";

import { BlocksTower } from "@/components/canvas/blocks-tower";

export const CanvasScene = () => {
  return (
    <div className="h-full w-full bg-gradient-to-br from-slate-50 via-slate-100 to-slate-200">
      <Canvas shadows camera={{ position: [60, 40, 60], fov: 38 }}>
        <color attach="background" args={["#f6f7f8"]} />
        <ambientLight intensity={0.7} />
        <directionalLight position={[35, 80, 20]} intensity={0.85} castShadow shadow-mapSize={[2048, 2048]} />
        <Suspense fallback={null}>
          <BlocksTower />
          <Grid args={[200, 200]} cellSize={5} cellThickness={0.4} cellColor="#e2e8f0" sectionColor="#cbd5f5" fadeDistance={120} />
          <Environment preset="city" />
        </Suspense>
        <OrbitControls
          enablePan
          enableDamping
          dampingFactor={0.15}
          minDistance={10}
          maxDistance={200}
          target={[0, 0, 0]}
          makeDefault
        />
      </Canvas>
    </div>
  );
};
