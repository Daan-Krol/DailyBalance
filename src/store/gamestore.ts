import { create } from "zustand";

type GameStore = {
  streak: number;
};

export const useGameStore = create<GameStore>(() => ({
  streak: 0,
}));