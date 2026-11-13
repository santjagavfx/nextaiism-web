import type { Metadata } from "next";
import type { CSSProperties } from "react";
import styles from "./preview.module.css";

export const metadata: Metadata = {
  title: "Logo Preview",
};

const concepts = [
  { slug: "living-core", name: "Living Core", description: "A luminous nucleus held within a single open, tilted orbit." },
  { slug: "symbiosis", name: "Symbiosis", description: "Two trajectories frame the shared space where human and AI meet." },
  { slug: "open-evolution", name: "Open Evolution", description: "A central core and two balanced arcs share one open circle. This concept combines the three directions." },
] as const;

const sizes = [16, 24, 32, 64];

export default function LogoPreview() {
  return (
    <section className={`shell ${styles.page}`}>
      <h1>Logo preview<span>.</span></h1>
      <p className={styles.intro}>Compare three NextAIism marks on light and dark backgrounds.</p>
      <div className={styles.concepts}>
        {concepts.map(({ slug, name, description }) => {
          const asset = `/logos/${slug}.svg`;
          return (
            <article className={styles.concept} key={slug}>
              <div className={styles.summary}>
                <h2>{name}</h2>
                <p>{description}</p>
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
          );
        })}
      </div>
    </section>
  );
}
