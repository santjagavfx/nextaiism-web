import "server-only";
import { experiments, type Experiment } from "./catalog";
import { materials } from "./materials";
import { approvedExternalLaunchOrigins, approvedFrameOrigins, approvedHttpsUrl } from "./approved-origins.mjs";

export const publishedExperiments = experiments.filter((experiment) => experiment.approved);

export function experimentMaterial(experiment: Experiment, locale: string) {
  const versions = materials[experiment.id];
  const language = versions?.[locale] ? locale : "en";
  const material = versions?.[language];
  if (!material) throw new Error(`Missing English material for ${experiment.id}`);
  return { material, language };
}

export function experimentUrl(experiment: Experiment) {
  const { launch } = experiment;
  if (launch.type === "internal" || ["concept", "paused", "archived"].includes(experiment.status)) return undefined;
  return approvedHttpsUrl(launch.url, launch.type === "iframe" ? approvedFrameOrigins : approvedExternalLaunchOrigins);
}
