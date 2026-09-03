"use client";

import { useEffect, useRef } from "react";

export default function PhaserGame() {
  const gameRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let game: Phaser.Game | undefined;

    const startGame = async () => {
      const Phaser = await import("phaser");
      const { default: MainScene } = await import("@/game/mainscene");

      if (!gameRef.current) return;

      game = new Phaser.Game({
        type: Phaser.AUTO,
        width: 800,
        height: 600,
        parent: gameRef.current,
        backgroundColor: "#222222",
        scene: MainScene,
      });
    };

    startGame();

    return () => {
      game?.destroy(true);
    };
  }, []);

  return <div ref={gameRef} />;
}