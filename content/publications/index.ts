import data from "./data.json";

type Translation = {
  status: "draft" | "approved";
  title: string;
  summary: string;
  paragraphs: string[];
};

type Publication = {
  slug: string;
  sourceLocale: "en" | "ru";
  versions: Partial<Record<string, Translation>>;
};

export function approvedPublications(locale: string) {
  return (data as Publication[]).flatMap(({ slug, versions }) => {
    const translation = versions[locale];
    return translation?.status === "approved" ? [{
      slug, ...translation,
      languages: Object.keys(versions).filter((language) => versions[language]?.status === "approved"),
    }] : [];
  });
}
