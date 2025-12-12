import { CanvasScene } from "@/components/canvas/canvas-scene";
import { RightSidebar } from "@/components/layout/right-sidebar";
import { TalvexHeader } from "@/components/layout/talvex-header";

function App() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <TalvexHeader />
      <main className="flex h-[calc(100vh-64px)] flex-col lg:flex-row">
        <section className="flex-1 border-t border-border/60 bg-gradient-to-b from-muted/20 to-background lg:border-r">
          <CanvasScene />
        </section>
        <RightSidebar />
      </main>
    </div>
  );
}

export default App;
