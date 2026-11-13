import Link from "next/link";
import { getTranslations } from "next-intl/server";
import { sectionSlugs } from "../sections";
import { OrbitControls } from "../orbit-controls";
import { alternateUrls } from "../../i18n/metadata";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props) {
  return { alternates: alternateUrls((await params).locale) };
}

export default async function Home({ params }: Props) {
  const { locale } = await params;
  const t = await getTranslations({ locale });
  return (
    <>
      <section className="shell hero">
        <div className="hero-copy">
          <p className="eyebrow"><span className="signal" /> {t("ui.labName")}</p>
          <h1>NextAIism<span>.</span></h1>
          <p className="hero-subtitle">{t("ui.hero")}</p>
          <p className="lede">{t("ui.lede")}</p>
          <div className="flex flex-wrap gap-3">
            <Link href={`/${locale}/lab`} className="button primary">{t("ui.explore")} <span aria-hidden="true">↗</span></Link>
            <Link href="#directions" className="button secondary">{t("ui.directions")} <span aria-hidden="true">↓</span></Link>
          </div>
        </div>
        <div className="core-panel">
        <div className="core-scene" id="core-scene" aria-hidden="true">
          <div className="core-grid" />
          <div className="orbit orbit-one"><span /></div>
          <div className="orbit orbit-two"><span /></div>
          <div className="orbit orbit-three"><span /></div>
          <div className="core-halo" />
          <div className="core" />
          <span className="scene-label human">{t("ui.human")}</span>
          <span className="scene-label machine">{t("ui.machine")}</span>
        </div>
        <OrbitControls play={t("ui.playOrbits")} pause={t("ui.pauseOrbits")} />
        </div>
      </section>
      <section className="directions shell" id="directions" aria-labelledby="directions-title">
        <p className="eyebrow">NextAIism / {t("ui.research")}</p>
        <h2 id="directions-title">{t("ui.directions")}</h2>
        <div className="direction-grid">
          {sectionSlugs.map((slug) => (
            <Link className="direction" key={slug} href={`/${locale}/${slug}`}>
              <span className="eyebrow">{t(`sections.${slug}.label`)}</span>
              <h3>{t(`sections.${slug}.title`)} <span aria-hidden="true">↗</span></h3>
              <p>{t(`sections.${slug}.description`)}</p>
            </Link>
          ))}
        </div>
      </section>
    </>
  );
}
