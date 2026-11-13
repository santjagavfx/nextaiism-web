import { readFileSync, readdirSync } from "node:fs";
import { locales } from "../i18n/locales.mjs";

const read = (path) => JSON.parse(readFileSync(new URL(`../${path}`, import.meta.url), "utf8"));
const errors = [];
const isText = (value) => typeof value === "string" && value.trim().length > 0;
const isRecord = (value) => value !== null && typeof value === "object" && !Array.isArray(value);

function leaves(value, prefix = "") {
  if (!isRecord(value)) return [[prefix, value]];
  return Object.entries(value).flatMap(([key, child]) => leaves(child, prefix ? `${prefix}.${key}` : key));
}

const expected = new Map(leaves(read("messages/en.json")));
const messageFiles = readdirSync(new URL("../messages/", import.meta.url)).filter((name) => name.endsWith(".json"));
if (messageFiles.length !== locales.length || locales.some((locale) => !messageFiles.includes(`${locale}.json`))) {
  errors.push("Message catalogs must match the supported locales.");
}
for (const locale of locales) {
  const messages = new Map(leaves(read(`messages/${locale}.json`)));
  for (const key of expected.keys()) {
    if (!isText(messages.get(key))) errors.push(`${locale}: missing or empty ${key}`);
  }
  for (const key of messages.keys()) {
    if (!expected.has(key)) errors.push(`${locale}: unknown message ${key}`);
  }
}

const glossary = read("content/publications/glossary.json");
for (const [term, variants] of Object.entries(glossary)) {
  for (const locale of locales) {
    if (!isText(variants[locale])) errors.push(`Glossary: missing ${term} for ${locale}`);
  }
}

const data = read("content/publications/data.json");
if (!Array.isArray(data)) throw new Error("Publications must be a JSON array.");
const slugs = new Set();

function validText(version) {
  return isRecord(version) && isText(version.title) && isText(version.summary) &&
    Array.isArray(version.paragraphs) && version.paragraphs.length > 0 && version.paragraphs.every(isText);
}

function copy(version) {
  return [version.title, version.summary, ...version.paragraphs].join("\n");
}

for (const { slug, sourceLocale, versions } of data) {
  if (typeof slug !== "string" || !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug) || slugs.has(slug)) {
    errors.push(`Invalid or duplicate publication slug: ${slug}`);
  }
  slugs.add(slug);
  if (!["en", "ru"].includes(sourceLocale) || !isRecord(versions) || !validText(versions[sourceLocale])) {
    errors.push(`${slug}: an original in en or ru is required`);
    continue;
  }
  const source = versions[sourceLocale];
  const missing = locales.filter((locale) => !Object.hasOwn(versions, locale));
  const drafts = locales.filter((locale) => versions[locale]?.status === "draft");
  if (missing.length) console.log(`${slug}: missing ${missing.join(", ")}`);
  if (drafts.length) console.log(`${slug}: drafts ${drafts.join(", ")}`);
  for (const [locale, version] of Object.entries(versions)) {
    if (!locales.includes(locale) || !validText(version) || !["draft", "approved"].includes(version.status)) {
      errors.push(`${slug}/${locale}: invalid language, status or content`);
      continue;
    }
    for (const [term, variants] of Object.entries(glossary)) {
      if (variants[sourceLocale] && !copy(source).includes(variants[sourceLocale])) continue;
      if (variants[locale] && copy(version).includes(variants[locale])) continue;
      const message = `${slug}/${locale}: review glossary term ${term}`;
      if (version.status === "approved") errors.push(message);
      else console.log(message);
    }
    if (version.status === "approved" && source.status !== "approved") {
      errors.push(`${slug}/${locale}: approve the original first`);
    }
  }
}
if (errors.length) {
  console.error(errors.join("\n"));
  process.exitCode = 1;
} else {
  console.log(`Checked ${locales.length} UI catalogs and ${data.length} publication records.`);
}
