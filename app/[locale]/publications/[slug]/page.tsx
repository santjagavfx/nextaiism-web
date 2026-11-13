import Link from "next/link";
import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { approvedPublications } from "../../../../content/publications";
import { alternateUrls } from "../../../../i18n/metadata";

type Props = { params: Promise<{ locale: string; slug: string }> };

export const dynamicParams = false;

export function generateStaticParams({ params }: { params: { locale: string } }) {
  return approvedPublications(params.locale).map(({ slug }) => ({ slug }));
}

async function getArticle(params: Props["params"]) {
  const { locale, slug } = await params;
  const article = approvedPublications(locale).find((publication) => publication.slug === slug);
  if (!article) notFound();
  return { locale, article };
}

export async function generateMetadata({ params }: Props) {
  const { locale, article } = await getArticle(params);
  return {
    title: article.title,
    description: article.summary,
    alternates: alternateUrls(locale, `/publications/${article.slug}`, article.languages),
  };
}

export default async function PublicationPage({ params }: Props) {
  const { locale, article } = await getArticle(params);
  const t = await getTranslations({ locale, namespace: "sections.publications" });
  return (
    <article className="shell section-page">
      <Link href={`/${locale}/publications`} className="back-link">← {t("title")}</Link>
      <h1>{article.title}</h1>
      <p className="hero-subtitle">{article.summary}</p>
      {article.paragraphs.map((paragraph, index) => <p className="section-detail" key={index}>{paragraph}</p>)}
    </article>
  );
}
