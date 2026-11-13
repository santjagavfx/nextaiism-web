import type { CSSProperties } from "react";
import { getTranslations } from "next-intl/server";
import { alternateUrls } from "../../../i18n/metadata";
import styles from "./preview.module.css";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "logo" });
  return { title: t("title"), description: t("intro"), alternates: alternateUrls(locale, "/logo-preview") };
}

const asset = "/logos/nextaiism.svg";

const sizes = [16, 24, 32, 64];

export default async function LogoPreview({ params }: Props) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "logo" });
  return (
    <section className={`shell ${styles.page}`}>
      <h1>{t("title")}<span>.</span></h1>
      <p className={styles.intro}>{t("intro")}</p>
      <div className={styles.concepts}>
        <article className={styles.concept}>
          <div className={styles.summary}>
            <h2>NextAIism</h2>
            <p>{t("description")}</p>
            <a href={asset} download>{t("download")} <span aria-hidden="true">↓</span></a>
          </div>
          <div className={styles.swatches}>
            {(["light", "dark"] as const).map((theme) => (
              <figure className={`${styles.swatch} ${styles[theme]}`} key={theme}>
                <figcaption className="eyebrow">{t(theme)}</figcaption>
                <ul className={styles.samples}>
                  {sizes.map((size) => (
                    <li key={size}>
                      <span className={styles.iconSlot}>
                        <span
                          aria-hidden="true"
                          className={styles.mark}
                          style={{ "--mark": `url("${asset}")`, "--size": `${size}px` } as CSSProperties}
                        />
                      </span>
                      <span>{size} px</span>
                    </li>
                  ))}
                </ul>
              </figure>
            ))}
          </div>
        </article>
      </div>
    </section>
  );
}
