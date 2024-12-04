import { useEffect, useRef } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { GameEngine } from "./game/engine";

function Game() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const engineRef = useRef<GameEngine | null>(null);

  useEffect(() => {
    if (!canvasRef.current) return;
    
    const engine = new GameEngine(canvasRef.current);
    engineRef.current = engine;
    engine.start();

    return () => {
      engine.stop();
    };
  }, []);

  return <canvas ref={canvasRef} />;
}

createRoot(document.getElementById("root")!).render(<Game />);
