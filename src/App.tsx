import { CanvasScene } from "@/components/canvas/canvas-scene";
import { FloatingPanels } from "@/components/layout/floating-panels";
import { KeyboardShortcuts } from "@/components/layout/keyboard-shortcuts";
import { RightSidebar } from "@/components/layout/right-sidebar";
import { TalvexHeader } from "@/components/layout/talvex-header";
import { TransformToolbar } from "@/components/layout/transform-toolbar";

function App() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <TalvexHeader />
      <KeyboardShortcuts />
      <main className="flex h-[calc(100vh-64px)] flex-col lg:flex-row">
        <section className="relative flex-1 border-t border-border/60 bg-gradient-to-b from-muted/20 to-background lg:border-r">
          <CanvasScene />
          <FloatingPanels />
          <TransformToolbar />
        </section>
        <RightSidebar />
      </main>
    </div>
  );
}

export default App;
