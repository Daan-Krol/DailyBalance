import Phaser from "phaser";
import { useGameStore } from "@/store/gamestore";

export default class MainScene extends Phaser.Scene {
  private tree!: Phaser.GameObjects.Graphics;

  constructor() {
    super("MainScene");
  }

  create() {
    this.tree = this.add.graphics();

    this.drawTree();

    useGameStore.subscribe(() => {
      this.drawTree();
    });
  }

  drawTree() {
    const streak = useGameStore.getState().streak;

    this.tree.clear();

    // Tree gets bigger as streak increases
    const height = 100 + streak * 8;
    const trunkWidth = 20 + streak * 1.5;

    // Keep the tree from becoming ridiculously large
    const treeHeight = Math.min(height, 400);
    const width = Math.min(trunkWidth, 60);

    // Ground
    this.tree.fillStyle(0x654321);
    this.tree.fillRect(250, 500, 300, 20);

    // Trunk
    this.tree.fillStyle(0x8b5a2b);
    this.tree.fillRect(
      400 - width / 2,
      500 - treeHeight,
      width,
      treeHeight
    );

    // Leaves
    const leafSize = Math.min(50 + streak * 2, 100);

    this.tree.fillStyle(0x228b22);

    this.tree.fillCircle(400, 500 - treeHeight, leafSize);
    this.tree.fillCircle(350, 450 - treeHeight / 2, leafSize);
    this.tree.fillCircle(450, 450 - treeHeight / 2, leafSize);
    this.tree.fillCircle(400, 400 - treeHeight / 2, leafSize);

    // Streak text
    // this.add.text(300, 50, `Streak: ${streak}`, {
    //   fontSize: "32px",
    //   color: "#ffffff",
    // });
  }
}