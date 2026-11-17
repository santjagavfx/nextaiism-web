import type { ComponentType } from "react";

// Register trusted, repository-owned React components by their catalog key.
export const internalExperiments: Partial<Record<string, ComponentType>> = {};
