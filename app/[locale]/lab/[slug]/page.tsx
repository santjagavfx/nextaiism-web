import Link from "next/link";
import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { experimentMaterial, experimentUrl, publishedExperiments, requiresOwnOrigin } from "../../../../content/experiments";
import { approvedPublications } from "../../../../content/publications";
import { alternateUrls } from "../../../../i18n/metadata";
import { Launcher, type PlayerLabels } from "../launcher";
import styles from "../lab.module.css";

type Props = { params: Promise<{ locale: string; slug: string }> };

async function details(params: Props["params"]) {
  const { locale, slug } = await params;
  const experiment = publishedExperiments.find((item) => item.slug === slug);
  if (!experiment) notFound();
  return { locale, slug, experiment, ...experimentMaterial(experiment, locale) };
}

export async function generateMetadata({ params }: Props) {
  const { locale, slug, material } = await details(params);
  return { title: material.title, description: material.description, alternates: alternateUrls(locale, `/lab/${slug}`) };
}

const playerKeys = ["launch", "restart", "fullscreen", "open", "preparing", "loading", "frameHelp", "loadError", "screenError"] as const;

export default async function ExperimentPage({ params }: Props) {
  const { locale, experiment, material, language } = await details(params);
  const t = await getTranslations({ locale, namespace: "lab" });
  const labels = Object.fromEntries(playerKeys.map((key) => [key, t(key)])) as PlayerLabels;
  const author = experiment.author;
  const launchUrl = experimentUrl(experiment);
  const authorUrl = author.url?.startsWith("https://") ? author.url : undefined;
  const active = experiment.status === "live" || experiment.status === "development";
  if (experiment.status === "paused" || experiment.status === "archived") {
    labels.preparing = t(`statuses.${experiment.status}`);
  }
  const articles = new Set(approvedPublications(language).map(({ slug }) => slug));
  const publications = material.publications?.filter(({ publicationSlug }) => articles.has(publicationSlug));
  const dateFormat = new Intl.DateTimeFormat(language, { dateStyle: "medium", timeZone: "UTC" });

  return (
    <article className={`shell section-page ${styles.page}`}>
      <Link className="back-link" href={`/${locale}/lab`}>← {t("back")}</Link>
      <p className="eyebrow">{t(`categories.${experiment.category}`)} · {t(`statuses.${experiment.status}`)}</p>
      <h1 lang={language}>{material.title}<span>.</span></h1>
      <p className="hero-subtitle" lang={language}>{material.description}</p>
      {language !== locale && <p className={styles.note}>{t("fallback")}</p>}
      <p className={styles.note}>{t("author")} {authorUrl ? <a href={authorUrl} target="_blank" rel="noopener noreferrer">{author.name} ↗</a> : author.name} · {t(`authors.${author.type}`)}</p>
      {!!experiment.tags.length && <p className={styles.note}>{experiment.tags.join(" · ")}</p>}
      <h2 className={styles.subheading}>{t("goal")}</h2>
      <p className={styles.note} lang={language}>{material.goal}</p>
      <Launcher title={material.title} type={experiment.launch.type} url={launchUrl} ownOrigin={requiresOwnOrigin(experiment, launchUrl)}
        component={active && experiment.launch.type === "internal" ? experiment.launch.component : undefined}
        fullscreen={experiment.launch.fullscreen} labels={labels} />
      {!!material.observations?.length && <section>
        <h2 className={styles.subheading}>{t("observations")}</h2>
        <ul lang={language}>{material.observations.map(({ date, text }) => (
          <li key={`${date}-${text}`}><time dateTime={date}>{dateFormat.format(new Date(date))}</time> · {text}</li>
        ))}</ul>
      </section>}
      {!!publications?.length && <section>
        <h2 className={styles.subheading}>{t("publications")}</h2>
        <ul lang={language}>{publications.map(({ label, publicationSlug }) => (
          <li key={publicationSlug}><Link href={`/${language}/publications/${publicationSlug}`}>{label} ↗</Link></li>
        ))}</ul>
      </section>}
    </article>
  );
}
