import type { Metadata } from "next";
import type { CSSProperties } from "react";
import styles from "./preview.module.css";

export const metadata: Metadata = {
  title: "Logo Preview",
};

const asset = "/logos/nextaiism.svg";

const sizes = [16, 24, 32, 64];

export default function LogoPreview() {
  return (
    <section className={`shell ${styles.page}`}>
      <h1>Logo preview<span>.</span></h1>
      <p className={styles.intro}>The NextAIism logo on light and dark backgrounds.</p>
      <div className={styles.concepts}>
        <article className={styles.concept}>
          <div className={styles.summary}>
            <h2>NextAIism</h2>
            <p>Two crossing orbits, a luminous core, an open outer arc, and one satellite.</p>
            <a href={asset} download>Download SVG <span aria-hidden="true">↓</span></a>
          </div>
          <div className={styles.swatches}>
            {(["light", "dark"] as const).map((theme) => (
              <figure className={`${styles.swatch} ${styles[theme]}`} key={theme}>
                <figcaption className="eyebrow">{theme}</figcaption>
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
