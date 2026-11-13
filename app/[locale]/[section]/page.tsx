import Link from "next/link";
import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { sectionSlugs } from "../../sections";
import { alternateUrls } from "../../../i18n/metadata";
import { approvedPublications } from "../../../content/publications";

type Props = { params: Promise<{ locale: string; section: string }> };

export const dynamicParams = false;
export function generateStaticParams() {
  return sectionSlugs.map((section) => ({ section }));
}

async function getSection(params: Props["params"]) {
  const { locale, section } = await params;
  if (!sectionSlugs.some((slug) => slug === section)) notFound();
  const t = await getTranslations({ locale });
  return { locale, section, t };
}

export async function generateMetadata({ params }: Props) {
  const { locale, section, t } = await getSection(params);
  return {
    title: t(`sections.${section}.title`),
    description: t(`sections.${section}.description`),
    alternates: alternateUrls(locale, `/${section}`),
  };
}

export default async function SectionPage({ params }: Props) {
  const { locale, section, t } = await getSection(params);
  const publications = section === "publications" ? approvedPublications(locale) : [];
  return (
    <article className="shell section-page">
      <Link href={`/${locale}#directions`} className="back-link">← {t("ui.directions")}</Link>
      <p className="eyebrow"><span className="signal" /> {t(`sections.${section}.label`)}</p>
      <h1>{t(`sections.${section}.title`)}<span>.</span></h1>
      <p className="hero-subtitle">{t(`sections.${section}.description`)}</p>
      {publications.length ? (
        <ul className="direction-grid mt-8">
          {publications.map(({ slug, title, summary }) => (
            <li key={slug}><Link className="direction" href={`/${locale}/publications/${slug}`}><h3>{title}</h3><p>{summary}</p></Link></li>
          ))}
        </ul>
      ) : <p className="section-detail">{t(`sections.${section}.detail`)}</p>}
    </article>
  );
}
