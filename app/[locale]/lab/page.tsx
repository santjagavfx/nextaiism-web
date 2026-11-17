import Image from "next/image";
import Link from "next/link";
import { getTranslations } from "next-intl/server";
import { experimentMaterial, publishedExperiments } from "../../../content/experiments";
import { categories, statuses } from "../../../content/experiments/catalog";
import { alternateUrls } from "../../../i18n/metadata";
import { Catalog } from "./catalog-client";
import styles from "./lab.module.css";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props) {
  const { locale } = await params;
  const t = await getTranslations({ locale });
  return { title: t("sections.lab.title"), description: t("lab.intro"), alternates: alternateUrls(locale, "/lab") };
}

export default async function LabPage({ params }: Props) {
  const { locale } = await params;
  const t = await getTranslations({ locale });
  const cards = publishedExperiments.map((experiment) => {
    const { material, language } = experimentMaterial(experiment, locale);
    return {
      id: experiment.id, title: material.title, category: experiment.category, status: experiment.status,
      card: (
        <Link className={styles.card} href={`/${locale}/lab/${experiment.slug}`}>
          <Image className={styles.cover} src={experiment.cover} alt="" width={900} height={600} sizes="(max-width: 600px) 100vw, 420px" />
          <div className={styles.cardBody}>
            <p className="eyebrow">{t(`lab.categories.${experiment.category}`)} · {t(`lab.statuses.${experiment.status}`)}</p>
            <h2 lang={language}>{material.title} <span aria-hidden="true">↗</span></h2>
            <p lang={language}>{material.description}</p>
            {language !== locale && <p className={styles.note}>{t("lab.fallback")}</p>}
            <p className={styles.note}>{experiment.author.name} · {t(`lab.authors.${experiment.author.type}`)}</p>
          </div>
        </Link>
      ),
    };
  });

  return (
    <section className={`shell section-page ${styles.page}`}>
      <h1>{t("sections.lab.title")}<span>.</span></h1>
      <p className="hero-subtitle">{t("lab.intro")}</p>
      <Catalog locale={locale} cards={cards}
        categories={categories.map((value) => ({ value, label: t(`lab.categories.${value}`) }))}
        statuses={statuses.map((value) => ({ value, label: t(`lab.statuses.${value}`) }))}
        labels={{ search: t("lab.search"), category: t("lab.category"), status: t("lab.status"), all: t("lab.all"), empty: t("lab.empty") }} />
    </section>
  );
}
