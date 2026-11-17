import type { ExperimentMaterial } from "./catalog";

export const materials: Record<string, Partial<Record<string, ExperimentMaterial>>> = {
  "marine-ecosystem": {
    en: { title: "Marine Ecosystem", description: "A Unity experiment about sea anemones and clownfish.", goal: "Explore how clownfish and sea anemones share a habitat and interact over time." },
    ru: { title: "Морская экосистема", description: "Эксперимент в Unity об актиниях и рыбах-клоунах.", goal: "Исследовать, как рыбы-клоуны и актинии делят среду обитания и взаимодействуют со временем." },
  },
};
