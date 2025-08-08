"use client";

import { create } from "zustand";

type EntityState = {
  entity: string;
  setEntity: (value: string) => void;
};

export const useEntityStore = create<EntityState>((set) => ({
  entity: "",
  setEntity: (value: string) => {
    localStorage.setItem("entity", value);
    set({ entity: value });
  },
}));